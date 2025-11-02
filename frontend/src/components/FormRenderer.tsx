// IMPORT INFRA
import { useState, useEffect } from "react";

// IMPORT PACKAGES
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { ChevronDown, ChevronUp, Download, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Badge } from "./ui/badge";
import {
  TextField,
  TextareaField,
  SelectField,
  RadioField,
  CheckboxField,
  RatingField,
  RangeField,
  MatrixField,
} from "./FormFields";

// IMPORT UTILS
import {
  FormSchema,
  FieldSchema,
  FormData,
  FormErrors,
  FormSubmission,
} from "../types/schema";
import { validateField } from "../utils/validation";
import {
  shouldShowField,
  isFieldRequired,
  isFieldDisabled,
} from "../utils/conditionalLogic";
import { updateComputedFields } from "../utils/computedFields";
import { exportSubmission } from "../utils/export";

interface FormRendererProps {
  schema: FormSchema;
  onSubmit?: (submission: FormSubmission) => void;
}

export function FormRenderer({ schema, onSubmit }: FormRendererProps) {
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    new Set()
  );
  const [submission, setSubmission] = useState<FormSubmission | null>(null);

  // Get all fields from schema
  const allFields: FieldSchema[] = schema.sections
    ? schema.sections.flatMap((section) => section.fields)
    : schema.fields || [];

  // Shuffle questions if enabled
  const [shuffledFields] = useState(() => {
    if (schema.shuffleQuestions) {
      const fields = [...allFields];
      for (let i = fields.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [fields[i], fields[j]] = [fields[j], fields[i]];
      }
      return fields;
    }
    return allFields;
  });

  // Initialize form data with default values
  useEffect(() => {
    const initialData: FormData = {};
    allFields.forEach((field) => {
      if (field.defaultValue !== undefined) {
        initialData[field.id] = field.defaultValue;
      }
    });
    setFormData(initialData);

    // Initialize collapsed sections
    const collapsed = new Set<string>();
    schema.sections?.forEach((section) => {
      if (section.defaultCollapsed) {
        collapsed.add(section.id);
      }
    });
    setCollapsedSections(collapsed);
  }, [schema]);

  // Update computed fields when dependencies change
  useEffect(() => {
    const computedUpdates = updateComputedFields(allFields, formData);
    // Only update if computedUpdates actually change formData
    const hasChange = Object.entries(computedUpdates).some(
      ([key, value]) => formData[key] !== value
    );
    if (hasChange) {
      setFormData((prev) => ({ ...prev, ...computedUpdates }));
    }
  }, [formData]);

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));

    // Clear error for this field when user makes a change
    if (errors[fieldId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const handleFieldBlur = (field: FieldSchema) => {
    setTouched((prev) => new Set(prev).add(field.id));

    // Validate on blur
    const error = validateField(formData[field.id], {
      ...field,
      validation: {
        ...field.validation,
        required: isFieldRequired(field, formData),
      },
    });

    if (error) {
      setErrors((prev) => ({ ...prev, [field.id]: error }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    allFields.forEach((field) => {
      // Only validate visible fields
      if (!shouldShowField(field, formData)) {
        return;
      }

      const error = validateField(formData[field.id], {
        ...field,
        validation: {
          ...field.validation,
          required: isFieldRequired(field, formData),
        },
      });

      if (error) {
        newErrors[field.id] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTotalMarks = (): { total: number; max: number } => {
    let total = 0;
    let max = 0;

    allFields.forEach((field) => {
      if (field.enableMarks && field.maxMarks) {
        max += field.maxMarks;
        // In a real implementation, you'd check the answer against correct answers
        // For now, we'll just track the max marks
      }
    });

    return { total, max };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Mark all fields as touched to show errors
      const allFieldIds = new Set(allFields.map((f) => f.id));
      setTouched(allFieldIds);
      return;
    }

    // Create submission
    const { total, max } = calculateTotalMarks();
    const newSubmission: FormSubmission = {
      submissionId: `sub-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      userIdentifier: schema.uniqueField
        ? formData[schema.uniqueField]
        : undefined,
      data: formData,
      ...(schema.enableMarks && { totalMarks: total, maxMarks: max }),
    };

    setSubmission(newSubmission);
    setSubmitted(true);
    onSubmit?.(newSubmission);
  };

  const handleExport = (format: "json" | "csv") => {
    if (submission) {
      exportSubmission(submission, format);
    }
  };

  const toggleSection = (sectionId: string) => {
    setCollapsedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const renderField = (field: FieldSchema) => {
    // Check if field should be shown
    if (!shouldShowField(field, formData)) {
      return null;
    }

    const value = formData[field.id];
    const error = touched.has(field.id) ? errors[field.id] : undefined;
    const required = isFieldRequired(field, formData);
    const disabled =
      isFieldDisabled(field, formData) || field.computed !== undefined;

    const commonProps = {
      field,
      value,
      onChange: (val: any) => handleFieldChange(field.id, val),
      onBlur: () => handleFieldBlur(field),
      error,
      disabled,
      required,
    };

    switch (field.type) {
      case "textarea":
        return <TextareaField key={field.id} {...commonProps} />;
      case "select":
        return <SelectField key={field.id} {...commonProps} />;
      case "radio":
        return <RadioField key={field.id} {...commonProps} />;
      case "checkbox":
        return <CheckboxField key={field.id} {...commonProps} />;
      case "rating":
        return <RatingField key={field.id} {...commonProps} />;
      case "range":
        return <RangeField key={field.id} {...commonProps} />;
      case "matrix":
        return <MatrixField key={field.id} {...commonProps} />;
      default:
        return <TextField key={field.id} {...commonProps} />;
    }
  };

  if (submitted && submission) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <CardTitle>Form Submitted Successfully!</CardTitle>
          </div>
          <CardDescription>
            Your response has been recorded. Submission ID:{" "}
            {submission.submissionId}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {schema.enableMarks && submission.maxMarks && (
            <Alert>
              <AlertTitle>Score</AlertTitle>
              <AlertDescription>
                Total Marks: {submission.totalMarks || 0} /{" "}
                {submission.maxMarks}
              </AlertDescription>
            </Alert>
          )}

          {schema.exportFormats && schema.exportFormats.length > 0 && (
            <div className="space-y-2">
              <p>Download your submission:</p>
              <div className="flex gap-2">
                {schema.exportFormats.includes("json") && (
                  <Button
                    onClick={() => handleExport("json")}
                    variant="outline"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export JSON
                  </Button>
                )}
                {schema.exportFormats.includes("csv") && (
                  <Button onClick={() => handleExport("csv")} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                )}
              </div>
            </div>
          )}

          <Button
            onClick={() => {
              setSubmitted(false);
              setSubmission(null);
              setFormData({});
              setErrors({});
              setTouched(new Set());
            }}
          >
            Submit Another Response
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <CardTitle>{schema.title}</CardTitle>
              {schema.description && (
                <CardDescription>{schema.description}</CardDescription>
              )}
            </div>
            {schema.enableMarks && <Badge variant="secondary">Quiz Mode</Badge>}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {schema.sections ? (
            schema.sections.map((section) => (
              <div key={section.id} className="space-y-4">
                {section.collapsible ? (
                  <Collapsible
                    open={!collapsedSections.has(section.id)}
                    onOpenChange={() => toggleSection(section.id)}
                  >
                    <CollapsibleTrigger className="flex items-center justify-between w-full">
                      <div className="text-left">
                        <h3>{section.title}</h3>
                        {section.description && (
                          <p className="text-muted-foreground">
                            {section.description}
                          </p>
                        )}
                      </div>
                      {collapsedSections.has(section.id) ? (
                        <ChevronDown className="w-5 h-5" />
                      ) : (
                        <ChevronUp className="w-5 h-5" />
                      )}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-4 mt-4">
                      {section.fields.map(renderField)}
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <>
                    <div>
                      <h3>{section.title}</h3>
                      {section.description && (
                        <p className="text-muted-foreground">
                          {section.description}
                        </p>
                      )}
                    </div>
                    <div className="space-y-4">
                      {section.fields.map(renderField)}
                    </div>
                  </>
                )}
                <Separator />
              </div>
            ))
          ) : (
            <div className="space-y-4">
              {(schema.shuffleQuestions ? shuffledFields : allFields).map(
                renderField
              )}
            </div>
          )}

          <Button type="submit" className="w-full">
            {schema.submitButton || "Submit"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
