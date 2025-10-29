import { LiveForm } from "../types/schema";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Plus,
  FileText,
  Edit,
  Eye,
  CheckCircle2,
  BarChart3,
  Copy,
  Trash2,
  MoreVertical,
  ExternalLink,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FormListPageProps {
  liveForms: LiveForm[];
  onCreateNew: () => void;
  onEdit: (form: LiveForm) => void;
  onTestForm: (form: LiveForm) => void;
  onToggleStatus: (formId: string) => void;
  onClone: (form: LiveForm) => void;
  onDelete: (formId: string) => void;
}

export function FormListPage({
  liveForms,
  onCreateNew,
  onEdit,
  onTestForm,
  onToggleStatus,
  onClone,
  onDelete,
}: FormListPageProps) {
  const navigate = useNavigate();

  const openPublicForm = (formId: string) => {
    const formUrl = `${window.location.origin}/submit/${formId}`;
    window.open(formUrl, "_blank");
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2>Forms</h2>
          <p className="text-muted-foreground mt-1">
            Manage and create your forms
          </p>
        </div>
        <Button
          onClick={onCreateNew}
          className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Form
        </Button>
      </div>

      {/* Forms List */}
      {liveForms.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-card">
          <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-muted-foreground mb-2">No forms yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create your first form to get started
          </p>
          <Button onClick={onCreateNew}>
            <Plus className="w-4 h-4 mr-2" />
            Create Form
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left px-6 py-3 text-muted-foreground">
                    Form Name
                  </th>
                  <th className="text-left px-6 py-3 text-muted-foreground">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-muted-foreground">
                    Created
                  </th>
                  <th className="text-left px-6 py-3 text-muted-foreground">
                    Responses
                  </th>
                  <th className="w-12"></th>
                </tr>
              </thead>
              <tbody>
                {liveForms.map((form) => (
                  <tr
                    key={form.id}
                    className="border-b last:border-b-0 hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-6 py-4">{form.name}</td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          form.status === "published" ? "default" : "secondary"
                        }
                      >
                        {form.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(form.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/forms/${form.id}/responses`)}
                        className="h-8 px-3 hover:bg-muted"
                      >
                        <BarChart3 className="w-4 h-4 mr-2" />
                        {typeof form.responseCount === "number"
                          ? form.responseCount
                          : 0}
                      </Button>
                    </td>
                    <td className="px-6 py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreVertical
                              aria-label="DropdownTrigger"
                              className="h-4 w-4"
                            />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          data-testid="dropdown-menu"
                        >
                          <DropdownMenuItem onClick={() => onEdit(form)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onTestForm(form)}>
                            <Eye className="w-4 h-4 mr-2" />
                            Test Form
                          </DropdownMenuItem>
                          {form.status === "published" && (
                            <DropdownMenuItem
                              onClick={() => openPublicForm(form.id)}
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Open Public Form
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => onToggleStatus(form.id)}
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            {form.status === "published"
                              ? "Unpublish"
                              : "Publish"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              navigate(`/forms/${form.id}/responses`)
                            }
                          >
                            <BarChart3 className="w-4 h-4 mr-2" />
                            View Responses
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onClone(form)}>
                            <Copy className="w-4 h-4 mr-2" />
                            Clone
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDelete(form.id)}
                            className="text-red-600 icon-red focus:text-red-600 dark:text-red-500 dark:focus:text-red-500"
                            data-testid="Delete"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
