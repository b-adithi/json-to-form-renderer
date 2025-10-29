import { useState, useEffect } from "react";
import { fetchForms } from "../api/forms";
import { submitResponse } from "../api/responses";
import { useParams, useSearchParams } from "react-router-dom";
import { FormRenderer } from "../components/FormRenderer";
import { FormSchema, FormSubmission } from "../types/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { CheckCircle2, AlertCircle, FileText } from "lucide-react";

export function PublicFormPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [formSchema, setFormSchema] = useState<FormSchema | null>(null);
  const [formName, setFormName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Registration state
  const [isRegistered, setIsRegistered] = useState(false);
  const [respondentName, setRespondentName] = useState("");
  const [respondentEmail, setRespondentEmail] = useState("");

  // Submission state
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // First try to load form from URL parameter (for sharing)
    const encodedData = searchParams.get("data");

    if (encodedData) {
      try {
        // Decode form data from URL
        const decodedData = atob(encodedData);
        const formData = JSON.parse(decodedData);

        setFormSchema(formData.schema);
        setFormName(formData.name);
        setIsLoading(false);
        return;
      } catch (error) {
        console.error("PublicFormPage: Error decoding form from URL:", error);
        // Fall through to try API
      }
    }

    // Fallback: Load form from backend API using fetchForms
    setIsLoading(true);
    fetchForms()
      .then((forms) => {
        const form = forms.find((f) => f.id === id && f.status === "published");
        if (form && form.schema) {
          setFormSchema(form.schema);
          setFormName(form.name ?? "");
        } else {
          setNotFound(true);
        }
      })
      .catch(() => {
        setNotFound(true);
      })
      .finally(() => setIsLoading(false));
  }, [id, searchParams]);

  const handleRegistration = (e: React.FormEvent) => {
    e.preventDefault();

    if (!respondentName.trim() || !respondentEmail.trim()) {
      toast.error("Please enter your name and email");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(respondentEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsRegistered(true);
    toast.success("Registration successful! Please fill out the form.");
  };

  const handleFormSubmit = async (submission: FormSubmission) => {
    // Prepare response payload
    const payload = {
      formId: id ?? "",
      userId: respondentEmail,
      responses: submission.data,
    };
    try {
      await submitResponse(payload);
      setIsSubmitted(true);
      toast.success("Form submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit response");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="py-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading form...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="py-12 text-center">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl mb-2">Form Not Found</h2>
            <p className="text-muted-foreground mb-4">
              This form doesn't exist or has not been published yet.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="py-12 text-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl mb-2">Thank You!</h2>
            <p className="text-muted-foreground mb-4">
              Your response has been submitted successfully.
            </p>
            <p className="text-sm text-muted-foreground">
              We've received your submission and will get back to you if needed.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isRegistered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">{formName}</CardTitle>
            <CardDescription>
              Please provide your information to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegistration} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="respondent-name">Full Name *</Label>
                <Input
                  id="respondent-name"
                  type="text"
                  placeholder="Enter your full name"
                  value={respondentName}
                  onChange={(e) => setRespondentName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="respondent-email">Email Address *</Label>
                <Input
                  id="respondent-email"
                  type="email"
                  placeholder="your@email.com"
                  value={respondentEmail}
                  onChange={(e) => setRespondentEmail(e.target.value)}
                  required
                />
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <p className="text-xs text-blue-900 dark:text-blue-100">
                  <strong>Privacy Notice:</strong> Your information will be used
                  solely for the purpose of this form submission and will be
                  kept confidential.
                </p>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Continue to Form
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">{formName}</CardTitle>
            <CardDescription>
              Submitted by: {respondentName} ({respondentEmail})
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardContent className="pt-6">
            {formSchema && (
              <FormRenderer schema={formSchema} onSubmit={handleFormSubmit} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
