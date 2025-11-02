// Helper to handle API calls and auto-logout on 403

import { useState, useEffect, useCallback } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import { apiClient } from "./api/client";
import { setGlobalLogoutHandler } from "./api/client";
import {
  createForm,
  updateForm,
  deleteForm as deleteFormApi,
} from "./api/forms";
import { FormSchema, LiveForm } from "./types/schema";
import { FormRenderer } from "./components/FormRenderer";
import { exampleSchemas } from "./data/exampleSchemas";
import { Login } from "./components/Login";
import { Button } from "./components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./components/ui/alert-dialog";
import { Moon, Sun, Code2, Book, FileText } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "./components/ui/sonner";
import { ScrollArea } from "./components/ui/scroll-area";
import { Avatar, AvatarFallback } from "./components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";
import logoDark from "/light.png";
import logoLight from "/dark.png";
import { FormListPage } from "./pages/FormListPage";
import { FormEditorPage } from "./pages/FormEditorPage";
import { ResponsesPage } from "./pages/ResponsesPage";
import { ExamplesPage } from "./pages/ExamplesPage";
import { DocumentationPage } from "./pages/DocumentationPage";

// Main App Container
import { RouteLoader } from "./components/RouteLoader";
import { fetchForms } from "./api/forms";
import { fetchResponses } from "./api/responses";
import { PublicFormPage } from "./pages/PublicFormPage";
import { loginUser } from "./api/users";
import { FormUrlDialog } from "./components/FormUrlDialog";

function AppContainer() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check for saved authentication and theme on mount
  useEffect(() => {
    setCheckingAuth(true);
    const savedAuth = localStorage.getItem("formrenderer_auth");
    if (savedAuth) {
      const { email, token } = JSON.parse(savedAuth);
      setUserEmail(email);
      setIsAuthenticated(true);
      if (token) apiClient.setToken(token);
    }

    // Load saved theme
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || savedTheme === "light") {
      setTheme(savedTheme);
    }

    setTimeout(() => setCheckingAuth(false), 350); // Simulate short load
  }, []);

  useEffect(() => {
    // Apply theme
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Save theme to localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await loginUser(email, password);
      if (response.success && response.token) {
        setUserEmail(email);
        setIsAuthenticated(true);
        localStorage.setItem(
          "formrenderer_auth",
          JSON.stringify({ email, token: response.token })
        );
        apiClient.setToken(response.token);
      }
      return response;
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserEmail("");
    localStorage.removeItem("formrenderer_auth");
    toast.success("Logged out successfully");
  };

  if (checkingAuth) {
    return <RouteLoader message="Checking authentication..." />;
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <Toaster position="top-center" duration={2000} closeButton />
        <Login onLogin={handleLogin} />
      </>
    );
  }

  return (
    <BrowserRouter>
      {/* Only render PublicFormPage for /submit/:id, otherwise render MainApp */}
      {window.location.pathname.startsWith("/submit/") ? (
        <Routes>
          <Route path="/submit/:id" element={<PublicFormPage />} />
        </Routes>
      ) : (
        <MainApp
          theme={theme}
          toggleTheme={toggleTheme}
          userEmail={userEmail}
          handleLogout={handleLogout}
        />
      )}
    </BrowserRouter>
  );
}

// Main Application with Router
export function MainApp({
  theme,
  toggleTheme,
  userEmail,
  handleLogout,
}: {
  theme: "light" | "dark";
  toggleTheme: () => void;
  userEmail: string;
  handleLogout: () => void;
}) {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 350); // Simulate short load
    return () => clearTimeout(timeout);
  }, [location.pathname]);
  const [schemaText, setSchemaText] = useState("");
  const [schema, setSchema] = useState<FormSchema | null>(null);
  const [schemaError, setSchemaError] = useState<string>("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [liveForms, setLiveForms] = useState<LiveForm[]>([]);
  const [currentFormName, setCurrentFormName] = useState("");
  const [editingFormId, setEditingFormId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formToDelete, setFormToDelete] = useState<string | null>(null);
  const [isUrlDialogOpen, setIsUrlDialogOpen] = useState(false);
  const [publishedFormId, setPublishedFormId] = useState<string>("");
  const [publishedFormName, setPublishedFormName] = useState<string>("");
  const [publishedFormSchema, setPublishedFormSchema] =
    useState<FormSchema | null>(null);

  const navigate = useNavigate();

  // Determine active navigation based on route
  const getActiveNav = () => {
    if (location.pathname.startsWith("/examples")) return "examples";
    if (location.pathname.startsWith("/docs")) return "docs";
    return "editor";
  };

  useEffect(() => {
    // Load contact form as default
    const defaultSchema = exampleSchemas.contact;
    setSchemaText(JSON.stringify(defaultSchema, null, 2));
    setSchema(defaultSchema);

    // Set global logout handler for apiClient
    setGlobalLogoutHandler(handleLogout);
    // Fetch all forms using service
    fetchForms()
      .then((forms) => setLiveForms(forms))
      .catch(() => setLiveForms([]));
  }, []);

  // Function to refresh the forms list
  const refreshForms = useCallback(async () => {
    try {
      const forms = await fetchForms();
      setLiveForms(forms);
    } catch (error) {
      setLiveForms([]);
    }
  }, []);

  const handleSchemaChange = (value: string) => {
    setSchemaText(value);
    setSchemaError("");
  };

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(schemaText);
      const formatted = JSON.stringify(parsed, null, 2);
      setSchemaText(formatted);
      toast.success("JSON formatted successfully!");
    } catch (error) {
      toast.error("Cannot format invalid JSON");
    }
  };

  const loadExample = (exampleKey: string) => {
    const exampleSchema =
      exampleSchemas[exampleKey as keyof typeof exampleSchemas];
    if (exampleSchema) {
      setSchemaText(JSON.stringify(exampleSchema, null, 2));
      parseSchema(JSON.stringify(exampleSchema, null, 2));
      toast.success("Example loaded successfully!");
    }
  };

  // Helper function to correct line numbers in JSON parse errors
  const correctErrorLineNumber = (
    errorMessage: string,
    jsonText: string
  ): string => {
    const lineMatch = errorMessage.match(
      /at position (\d+) \(line (\d+) column (\d+)\)/
    );

    if (lineMatch) {
      const position = parseInt(lineMatch[1], 10);
      const column = parseInt(lineMatch[3], 10);

      const textUpToPosition = jsonText.substring(0, position);
      const actualLine = (textUpToPosition.match(/\n/g) || []).length + 1;

      return errorMessage.replace(
        /\(line \d+ column \d+\)/,
        `(line ${actualLine} column ${column})`
      );
    }

    return errorMessage;
  };

  const parseSchema = (text: string) => {
    try {
      const parsed = JSON.parse(text);
      setSchema(parsed);
      setSchemaError("");
      toast.success("Schema parsed successfully!");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Invalid JSON";
      setSchemaError(correctErrorLineNumber(errorMessage, text));
      setSchema(null);
      toast.error("Failed to parse schema");
    }
  };

  const openPreview = () => {
    try {
      const parsed = JSON.parse(schemaText);
      setSchema(parsed);
      setSchemaError("");
      setIsDrawerOpen(true);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Invalid JSON";
      setSchemaError(correctErrorLineNumber(errorMessage, schemaText));
      setSchema(null);
      toast.error("Cannot preview: Invalid JSON schema");
    }
  };

  const createNewForm = () => {
    setSchemaText("");
    setSchema(null);
    setCurrentFormName("");
    setEditingFormId(null);
    navigate("/forms/create");
    toast.success("Ready to create new form!");
  };

  const saveAsLiveForm = async (status: "draft" | "published" = "draft") => {
    if (!schema || !currentFormName.trim()) {
      toast.error("Please provide a form name and valid schema");
      return;
    }

    let formId = editingFormId;
    try {
      if (editingFormId) {
        // Update existing form via API
        const updated = await updateForm(editingFormId, {
          name: currentFormName,
          schema,
          status,
        });
        setLiveForms((prev) =>
          prev.map((f) => (f.id === editingFormId ? updated : f))
        );
        toast.success(
          status === "published"
            ? "Form published successfully!"
            : "Form saved as draft!"
        );
      } else {
        // Create new form via API
        const created = await createForm({
          name: currentFormName,
          schema,
          status,
        });
        formId = created.id;
        setLiveForms((prev) => [created, ...prev]);
        toast.success(
          status === "published"
            ? "Form published successfully!"
            : "Form saved as draft!"
        );
      }
      if (status === "published") {
        // Show URL dialog for published forms
        setPublishedFormId(formId!);
        setPublishedFormName(currentFormName);
        setPublishedFormSchema(schema);
        setIsUrlDialogOpen(true);
      } else {
        // Navigate to forms only for draft saves (not published forms)
        navigate("/forms", { state: { shouldRefresh: true } });
      }
    } catch (error) {
      toast.error("Failed to save form");
    }
  };

  const toggleFormStatus = async (formId: string) => {
    const form = liveForms.find((f) => f.id === formId);
    if (!form) return;
    const newStatus = form.status === "published" ? "draft" : "published";
    try {
      const updated = await updateForm(formId, { status: newStatus });
      setLiveForms((prev) => prev.map((f) => (f.id === formId ? updated : f)));
      toast.success(
        newStatus === "draft"
          ? "Form unpublished and saved as draft"
          : "Form published successfully!"
      );
      if (newStatus === "published") {
        // Show URL dialog for published forms
        setPublishedFormId(formId!);
        setPublishedFormName(form.name);
        setPublishedFormSchema(form.schema);
        setIsUrlDialogOpen(true);
      }
    } catch {
      toast.error("Failed to update form status");
    }
  };

  const cloneForm = (form: LiveForm) => {
    const clonedSchema = JSON.stringify(form.schema, null, 2);
    setSchemaText(clonedSchema);
    setSchema(form.schema);
    setCurrentFormName(`${form.name} (Copy)`);
    setEditingFormId(null);
    navigate("/forms/create");
    toast.success("Form cloned successfully!");
  };

  const cloneExampleForm = (key: string) => {
    const exampleSchema = exampleSchemas[key as keyof typeof exampleSchemas];
    if (exampleSchema) {
      setSchemaText(JSON.stringify(exampleSchema, null, 2));
      setSchema(exampleSchema);
      setCurrentFormName("");
      setEditingFormId(null);
      navigate("/forms/create");
      toast.success("Form cloned! Please provide a name and save.");
    }
  };

  const previewExample = (key: string) => {
    loadExample(key);
    openPreview();
  };

  const openDeleteDialog = (formId: string) => {
    setFormToDelete(formId);
    setIsDeleteDialogOpen(true);
  };

  const deleteForm = () => {
    if (formToDelete) {
      (async () => {
        try {
          await deleteFormApi(formToDelete);
          setLiveForms((prev) => prev.filter((f) => f.id !== formToDelete));
          toast.success("Form deleted successfully!");
        } catch {
          toast.error("Failed to delete form");
        } finally {
          setIsDeleteDialogOpen(false);
          setFormToDelete(null);
        }
      })();
    }
  };

  const loadLiveForm = (form: LiveForm) => {
    setSchemaText(JSON.stringify(form.schema, null, 2));
    setSchema(form.schema);
    setCurrentFormName(form.name);
    setEditingFormId(form.id);
    navigate(`/forms/${form.id}/edit`);
  };

  const testForm = (form: LiveForm) => {
    loadLiveForm(form);
    openPreview();
  };

  const handleFormSubmission = (formId: string) => {
    setLiveForms((prev) =>
      prev.map((f) =>
        f.id === formId
          ? { ...f, responseCount: (f.responseCount || 0) + 1 }
          : f
      )
    );
    toast.success("Form response recorded!");
  };

  // Updated exportResponses: fetch responses from API before exporting
  const exportResponses = async (formId: string, format: "json" | "csv") => {
    try {
      const responses = await fetchResponses(formId);
      if (!responses || !Array.isArray(responses) || responses.length === 0) {
        toast.error("No responses to export");
        return;
      }
      if (format === "json") {
        const dataStr = JSON.stringify(responses, null, 2);
        const dataBlob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `responses_${formId}.json`;
        link.click();
        URL.revokeObjectURL(url);
        toast.success("Responses exported as JSON!");
      } else if (format === "csv") {
        // Collect all dynamic response keys
        const allKeys = new Set<string>();
        responses.forEach((response: any) => {
          if (response.responses && typeof response.responses === "object") {
            Object.keys(response.responses).forEach((key) => allKeys.add(key));
          }
        });
        const headers = [
          "Full Name",
          "Email",
          "Submitted On",
          ...Array.from(allKeys),
        ];
        const csvRows = [headers.join(",")];
        responses.forEach((response: any) => {
          const row = [
            response.userFullName ?? "",
            response.userId ?? "",
            response.submittedOn ?? "",
            ...Array.from(allKeys).map((key) => {
              const value = response.responses?.[key];
              if (value === null || value === undefined) return "";
              if (Array.isArray(value)) return value.join("; ");
              if (typeof value === "object") return JSON.stringify(value);
              return String(value).replace(/"/g, '""');
            }),
          ];
          csvRows.push(row.map((cell) => `"${cell}"`).join(","));
        });
        const csvStr = csvRows.join("\n");
        const dataBlob = new Blob([csvStr], { type: "text/csv" });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `responses_${formId}.csv`;
        link.click();
        URL.revokeObjectURL(url);
        toast.success("Responses exported as CSV!");
      }
    } catch (error) {
      toast.error("Failed to export responses");
    }
  };

  const navItems = [
    {
      id: "editor",
      label: "Form Editor",
      icon: Code2,
      path: "/forms",
    },
    {
      id: "examples",
      label: "Examples",
      icon: FileText,
      path: "/examples",
    },
    {
      id: "docs",
      label: "Documentation",
      icon: Book,
      path: "/docs",
    },
  ];

  const activeNav = getActiveNav();

  // Breadcrumb helper
  const getBreadcrumb = () => {
    if (location.pathname === "/forms/create") {
      return {
        parent: "Form Editor",
        parentPath: "/forms",
        current: "Create New Form",
      };
    }
    if (location.pathname.includes("/edit")) {
      return {
        parent: "Form Editor",
        parentPath: "/forms",
        current: `Edit: ${currentFormName}`,
      };
    }
    if (location.pathname.includes("/responses")) {
      const formId = location.pathname.split("/")[2];
      const form = liveForms.find((f) => f.id === formId);
      return {
        parent: "Form Editor",
        parentPath: "/forms",
        current: `Responses: ${form?.name || ""}`,
      };
    }
    return null;
  };

  const breadcrumb = getBreadcrumb();

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-center" duration={2000} closeButton />
      {loading && <RouteLoader message="Loading..." />}
      <div className="flex h-screen overflow-hidden">
        {/* Left Sidebar - Always Fixed */}
        <aside className="fixed top-0 left-0 z-40 w-64 h-screen border-r bg-sidebar">
          <div className="flex flex-col h-full">
            {/* Logo Section */}
            <div className="p-4 flex-shrink-0">
              <img
                src={theme === "dark" ? logoLight : logoDark}
                alt="Logo"
                className="w-auto h-10"
              />
            </div>

            {/* Navigation */}
            <ScrollArea className="flex-1 px-3">
              <div className="space-y-1 py-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => navigate(item.path)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                        activeNav === item.id
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "hover:bg-accent text-sidebar-foreground"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </aside>

        {/* Main Content - With left margin for sidebar */}
        <div className="flex-1 flex flex-col overflow-hidden ml-64">
          {/* Top Header */}
          <header className="border-b bg-card px-6 py-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                {breadcrumb ? (
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem>
                        <BreadcrumbLink
                          onClick={() => navigate(breadcrumb.parentPath)}
                          className="cursor-pointer text-primary hover:text-primary/80"
                        >
                          {breadcrumb.parent}
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbPage>{breadcrumb.current}</BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                ) : (
                  <></>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={toggleTheme}
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                >
                  {theme === "light" ? (
                    <Moon className="w-5 h-5" />
                  ) : (
                    <Sun className="w-5 h-5" />
                  )}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="rounded-full">
                      <Avatar className="w-9 h-9 cursor-pointer">
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
                          {userEmail.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="text-sm">Signed in as</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {userEmail}
                      </p>
                    </div>
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-destructive cursor-pointer"
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <main className="flex-1 overflow-hidden flex flex-col">
            {/* Determine if current route is forms or examples for height adjustment */}
            {/*
        height-without-footer: used for /forms and /examples
        height-footer: used for other routes
      */}
            <div
              className={`overflow-y-auto p-[16px] space-y-6 ${
                location.pathname.startsWith("/forms") ||
                location.pathname.startsWith("/examples") ||
                location.pathname.startsWith("/docs")
                  ? "height-without-footer"
                  : "height-footer"
              }`}
            >
              <Routes>
                <Route path="/" element={<Navigate to="/forms" replace />} />
                <Route
                  path="/forms"
                  element={
                    <FormListPage
                      liveForms={liveForms}
                      onCreateNew={createNewForm}
                      onEdit={loadLiveForm}
                      onTestForm={testForm}
                      onToggleStatus={toggleFormStatus}
                      onClone={cloneForm}
                      onDelete={openDeleteDialog}
                      onRefresh={refreshForms}
                    />
                  }
                />
                <Route
                  path="/forms/create"
                  element={
                    <FormEditorPage
                      formName={currentFormName}
                      schemaText={schemaText}
                      schemaError={schemaError}
                      theme={theme}
                      isEditMode={false}
                      onFormNameChange={setCurrentFormName}
                      onSchemaChange={handleSchemaChange}
                      onLoadExample={loadExample}
                      onFormatJSON={formatJSON}
                      onPreview={openPreview}
                      onSaveAsDraft={() => saveAsLiveForm("draft")}
                      onPublish={() => saveAsLiveForm("published")}
                    />
                  }
                />
                <Route
                  path="/forms/:id/edit"
                  element={
                    <FormEditorPage
                      formName={currentFormName}
                      schemaText={schemaText}
                      schemaError={schemaError}
                      theme={theme}
                      isEditMode={true}
                      onFormNameChange={setCurrentFormName}
                      onSchemaChange={handleSchemaChange}
                      onLoadExample={loadExample}
                      onFormatJSON={formatJSON}
                      onPreview={openPreview}
                      onSaveAsDraft={() => saveAsLiveForm("draft")}
                      onPublish={() => saveAsLiveForm("published")}
                    />
                  }
                />
                <Route
                  path="/forms/:id/responses"
                  element={
                    <ResponsesPageWrapper
                      liveForms={liveForms}
                      exportResponses={exportResponses}
                    />
                  }
                />
                <Route
                  path="/examples"
                  element={
                    <ExamplesPage
                      onClone={cloneExampleForm}
                      onPreview={previewExample}
                    />
                  }
                />
                <Route path="/docs" element={<DocumentationPage />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>

      {/* Form Preview Drawer with Fixed Footer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-2xl p-0 flex flex-col"
        >
          <SheetHeader className="px-6 pt-6 pb-4 border-b flex-shrink-0">
            <SheetTitle>Form Preview</SheetTitle>
            <SheetDescription>
              Test your form and see how it looks
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {schema ? (
              <FormRenderer
                schema={schema}
                onSubmit={(submission) => {
                  console.log("Form submitted:", submission);
                  if (editingFormId) {
                    handleFormSubmission(editingFormId);
                  } else {
                    toast.success("Form submitted successfully!");
                  }
                }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Code2 className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-muted-foreground mb-2">No Schema Loaded</h3>
                <p className="text-sm text-muted-foreground">
                  Load an example or enter your own schema to preview the form
                </p>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              form and all of its responses.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setFormToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteForm}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Form URL Dialog */}
      {publishedFormSchema && (
        <FormUrlDialog
          open={isUrlDialogOpen}
          onOpenChange={(open) => {
            setIsUrlDialogOpen(open);
            if (!open) {
              navigate("/forms", { state: { shouldRefresh: true } });
            }
          }}
          formId={publishedFormId}
          formName={publishedFormName}
          formSchema={publishedFormSchema}
        />
      )}
    </div>
  );
}

// Wrapper component for ResponsesPage to access URL params
function ResponsesPageWrapper({
  liveForms,
  exportResponses,
}: {
  liveForms: LiveForm[];
  exportResponses: (formId: string, format: "json" | "csv") => void;
}) {
  const { id } = useParams<{ id: string }>();
  const form = liveForms.find((f) => f.id === id);
  const [responses, setResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (form) {
      setLoading(true);
      fetchResponses(form.id)
        .then((data) => {
          setResponses(Array.isArray(data) ? data : []);
        })
        .catch(() => {
          setResponses([]);
        })
        .finally(() => setLoading(false));
    }
  }, [form]);

  if (!form) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Form not found</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading responses...</p>
      </div>
    );
  }

  return (
    <ResponsesPage
      responses={responses}
      onExportCSV={() => exportResponses(form.id, "csv")}
      onExportJSON={() => exportResponses(form.id, "json")}
    />
  );
}

export default AppContainer;
