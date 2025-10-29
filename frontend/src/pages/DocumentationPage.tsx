import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Code2, FileText, CheckCircle2, Copy, Sparkles } from "lucide-react";
import { copyToClipboard } from "../utils/clipboard";
import { toast } from "sonner";

export function DocumentationPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2>Documentation</h2>
        <p className="text-muted-foreground mt-1">
          Learn how to create your own form schemas with examples and best
          practices
        </p>
      </div>

      {/* Smart Autocomplete Section */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            Smart Autocomplete - The Easy Way!
          </CardTitle>
          <CardDescription>
            No need to write JSON from scratch! Use our intelligent autocomplete
            system.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border">
            <h4 className="mb-3 flex items-center gap-2">
              <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                STEP 1
              </span>
              Type a field name in the editor
            </h4>
            <p className="text-sm text-muted-foreground mb-2">
              In the JSON editor, start typing any field type:
            </p>
            <div className="flex gap-2 flex-wrap">
              <code className="bg-muted px-2 py-1 rounded text-xs">
                text-field
              </code>
              <code className="bg-muted px-2 py-1 rounded text-xs">
                email-field
              </code>
              <code className="bg-muted px-2 py-1 rounded text-xs">
                select-field
              </code>
              <code className="bg-muted px-2 py-1 rounded text-xs">
                checkbox-field
              </code>
              <code className="bg-muted px-2 py-1 rounded text-xs">
                textarea-field
              </code>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border">
            <h4 className="mb-3 flex items-center gap-2">
              <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                STEP 2
              </span>
              Press Enter or Tab
            </h4>
            <p className="text-sm text-muted-foreground">
              The editor will automatically insert a complete field template
              with all required properties!
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border">
            <h4 className="mb-3 flex items-center gap-2">
              <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                STEP 3
              </span>
              Customize the placeholders
            </h4>
            <p className="text-sm text-muted-foreground mb-2">
              Use Tab to jump between placeholders and customize field IDs,
              labels, and options.
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <p className="text-sm text-green-900 dark:text-green-100">
              ✨ <strong>Magic Feature:</strong> If you haven't created a form
              structure yet, the autocomplete will automatically wrap your field
              in a complete form with title, description, and fields array! No
              manual setup needed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div>
              <div className="mb-1.5">Available field types:</div>
              <div className="space-y-1">
                <div>
                  <code className="bg-muted px-1.5 py-0.5 rounded">
                    text-field
                  </code>{" "}
                  - Text input
                </div>
                <div>
                  <code className="bg-muted px-1.5 py-0.5 rounded">
                    email-field
                  </code>{" "}
                  - Email validation
                </div>
                <div>
                  <code className="bg-muted px-1.5 py-0.5 rounded">
                    password-field
                  </code>{" "}
                  - Password input
                </div>
                <div>
                  <code className="bg-muted px-1.5 py-0.5 rounded">
                    number-field
                  </code>{" "}
                  - Numeric input
                </div>
                <div>
                  <code className="bg-muted px-1.5 py-0.5 rounded">
                    tel-field
                  </code>{" "}
                  - Phone number
                </div>
                <div>
                  <code className="bg-muted px-1.5 py-0.5 rounded">
                    url-field
                  </code>{" "}
                  - URL validation
                </div>
                <div>
                  <code className="bg-muted px-1.5 py-0.5 rounded">
                    date-field
                  </code>{" "}
                  - Date picker
                </div>
              </div>
            </div>
            <div>
              <div className="mb-1.5">More field types:</div>
              <div className="space-y-1">
                <div>
                  <code className="bg-muted px-1.5 py-0.5 rounded">
                    textarea-field
                  </code>{" "}
                  - Multi-line text
                </div>
                <div>
                  <code className="bg-muted px-1.5 py-0.5 rounded">
                    select-field
                  </code>{" "}
                  - Dropdown menu
                </div>
                <div>
                  <code className="bg-muted px-1.5 py-0.5 rounded">
                    radio-field
                  </code>{" "}
                  - Radio buttons
                </div>
                <div>
                  <code className="bg-muted px-1.5 py-0.5 rounded">
                    checkbox-field
                  </code>{" "}
                  - Checkbox
                </div>
                <div>
                  <code className="bg-muted px-1.5 py-0.5 rounded">
                    file-field
                  </code>{" "}
                  - File upload
                </div>
                <div>
                  <code className="bg-muted px-1.5 py-0.5 rounded">
                    rating-field
                  </code>{" "}
                  - Star rating
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Schema Structure */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <Code2 className="w-4 h-4 text-white" />
            </div>
            Basic Schema Structure
          </CardTitle>
          <CardDescription>
            Every form starts with a JSON schema. Here's the minimal structure
            you need.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="relative group">
            <pre className="bg-slate-900 dark:bg-slate-950 text-slate-50 p-5 rounded-lg overflow-x-auto text-sm leading-relaxed border border-slate-800">
              {`{
  "title": "My Form",
  "description": "Form description",
  "fields": [
    {
      "id": "fieldName",
      "type": "text",
      "label": "Field Label",
      "validation": {
        "required": true,
        "minLength": 3
      }
    }
  ]
}`}
            </pre>
            <Button
              size="sm"
              variant="secondary"
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={async () => {
                const success = await copyToClipboard(`{
  "title": "My Form",
  "description": "Form description",
  "fields": [
    {
      "id": "fieldName",
      "type": "text",
      "label": "Field Label",
      "validation": {
        "required": true,
        "minLength": 3
      }
    }
  ]
}`);
                if (success) {
                  toast.success("Code copied to clipboard!");
                } else {
                  toast.error("Failed to copy code");
                }
              }}
            >
              <Copy className="w-3.5 h-3.5 mr-1.5" />
              Copy
            </Button>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              💡 <strong>Quick Tip:</strong> Start with a simple structure and
              add complexity as needed. The schema is flexible and supports many
              advanced features.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Field Types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Code2 className="w-4 h-4 text-white" />
            </div>
            Supported Field Types
          </CardTitle>
          <CardDescription>
            Choose from a variety of field types for your forms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              "text",
              "email",
              "password",
              "number",
              "tel",
              "url",
              "textarea",
              "select",
              "multiselect",
              "radio",
              "checkbox",
              "date",
              "time",
              "datetime",
              "file",
              "rating",
              "range",
              "matrix",
            ].map((type) => (
              <div key={type} className="px-3 py-2 bg-muted rounded-lg text-sm">
                <code>{type}</code>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Validation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
            Validation Rules
          </CardTitle>
          <CardDescription>
            Add validation to ensure data quality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="relative group">
            <pre className="bg-slate-900 dark:bg-slate-950 text-slate-50 p-5 rounded-lg overflow-x-auto text-sm leading-relaxed border border-slate-800">
              {`"validation": {
  "required": true,
  "minLength": 3,
  "maxLength": 50,
  "pattern": "^[A-Za-z]+$",
  "message": "Custom error message"
}`}
            </pre>
            <Button
              size="sm"
              variant="secondary"
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={async () => {
                const success = await copyToClipboard(`"validation": {
  "required": true,
  "minLength": 3,
  "maxLength": 50,
  "pattern": "^[A-Za-z]+$",
  "message": "Custom error message"
}`);
                if (success) {
                  toast.success("Code copied to clipboard!");
                } else {
                  toast.error("Failed to copy code");
                }
              }}
            >
              <Copy className="w-3.5 h-3.5 mr-1.5" />
              Copy
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Conditional Logic */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Code2 className="w-4 h-4 text-white" />
            </div>
            Conditional Logic
          </CardTitle>
          <CardDescription>
            Show or hide fields based on user input
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="relative group">
            <pre className="bg-slate-900 dark:bg-slate-950 text-slate-50 p-5 rounded-lg overflow-x-auto text-sm leading-relaxed border border-slate-800">
              {`"conditional": [
  {
    "field": "hasPortfolio",
    "operator": "equals",
    "value": "yes",
    "action": "show"
  }
]`}
            </pre>
            <Button
              size="sm"
              variant="secondary"
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={async () => {
                const success = await copyToClipboard(`"conditional": [
  {
    "field": "hasPortfolio",
    "operator": "equals",
    "value": "yes",
    "action": "show"
  }
]`);
                if (success) {
                  toast.success("Code copied to clipboard!");
                } else {
                  toast.error("Failed to copy code");
                }
              }}
            >
              <Copy className="w-3.5 h-3.5 mr-1.5" />
              Copy
            </Button>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <p className="text-sm text-amber-900 dark:text-amber-100 mb-2">
              <strong>Available operators:</strong>
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs text-amber-900 dark:text-amber-100">
              <div>
                •{" "}
                <code className="bg-amber-100 dark:bg-amber-900 px-1.5 py-0.5 rounded">
                  equals
                </code>
              </div>
              <div>
                •{" "}
                <code className="bg-amber-100 dark:bg-amber-900 px-1.5 py-0.5 rounded">
                  notEquals
                </code>
              </div>
              <div>
                •{" "}
                <code className="bg-amber-100 dark:bg-amber-900 px-1.5 py-0.5 rounded">
                  contains
                </code>
              </div>
              <div>
                •{" "}
                <code className="bg-amber-100 dark:bg-amber-900 px-1.5 py-0.5 rounded">
                  greaterThan
                </code>
              </div>
              <div>
                •{" "}
                <code className="bg-amber-100 dark:bg-amber-900 px-1.5 py-0.5 rounded">
                  lessThan
                </code>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Computed Fields */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
              <Code2 className="w-4 h-4 text-white" />
            </div>
            Computed Fields
          </CardTitle>
          <CardDescription>
            Create calculated fields that automatically update based on other
            field values
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="relative group">
            <pre className="bg-slate-900 dark:bg-slate-950 text-slate-50 p-5 rounded-lg overflow-x-auto text-sm leading-relaxed border border-slate-800">
              {`"computed": {
  "formula": "price * quantity",
  "dependencies": ["price", "quantity"],
  "precision": 2
}`}
            </pre>
            <Button
              size="sm"
              variant="secondary"
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={async () => {
                const success = await copyToClipboard(`"computed": {
  "formula": "price * quantity",
  "dependencies": ["price", "quantity"],
  "precision": 2
}`);
                if (success) {
                  toast.success("Code copied to clipboard!");
                } else {
                  toast.error("Failed to copy code");
                }
              }}
            >
              <Copy className="w-3.5 h-3.5 mr-1.5" />
              Copy
            </Button>
          </div>
          <div className="bg-pink-50 dark:bg-pink-950 border border-pink-200 dark:border-pink-800 rounded-lg p-4">
            <p className="text-sm text-pink-900 dark:text-pink-100">
              💡 <strong>Use case:</strong> Perfect for calculators, pricing
              forms, order totals, BMI calculators, and any scenario requiring
              automatic calculations.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Complete Example */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            Complete Example
          </CardTitle>
          <CardDescription>
            A full form schema with multiple field types, validation, and
            conditional logic
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="relative group">
            <pre className="bg-slate-900 dark:bg-slate-950 text-slate-50 p-5 rounded-lg overflow-x-auto text-sm leading-relaxed border border-slate-800 max-h-96">
              {`{
  "title": "Event Registration",
  "description": "Register for our upcoming event",
  "fields": [
    {
      "id": "name",
      "type": "text",
      "label": "Full Name",
      "validation": {
        "required": true,
        "minLength": 2
      }
    },
    {
      "id": "email",
      "type": "email",
      "label": "Email Address",
      "validation": {
        "required": true
      }
    },
    {
      "id": "attendanceType",
      "type": "radio",
      "label": "Attendance Type",
      "options": [
        { "label": "In Person", "value": "in-person" },
        { "label": "Virtual", "value": "virtual" }
      ],
      "validation": {
        "required": true
      }
    },
    {
      "id": "dietaryRestrictions",
      "type": "textarea",
      "label": "Dietary Restrictions",
      "conditional": [
        {
          "field": "attendanceType",
          "operator": "equals",
          "value": "in-person",
          "action": "show"
        }
      ]
    }
  ]
}`}
            </pre>
            <Button
              size="sm"
              variant="secondary"
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={async () => {
                const success = await copyToClipboard(`{
  "title": "Event Registration",
  "description": "Register for our upcoming event",
  "fields": [
    {
      "id": "name",
      "type": "text",
      "label": "Full Name",
      "validation": {
        "required": true,
        "minLength": 2
      }
    },
    {
      "id": "email",
      "type": "email",
      "label": "Email Address",
      "validation": {
        "required": true
      }
    },
    {
      "id": "attendanceType",
      "type": "radio",
      "label": "Attendance Type",
      "options": [
        { "label": "In Person", "value": "in-person" },
        { "label": "Virtual", "value": "virtual" }
      ],
      "validation": {
        "required": true
      }
    },
    {
      "id": "dietaryRestrictions",
      "type": "textarea",
      "label": "Dietary Restrictions",
      "conditional": [
        {
          "field": "attendanceType",
          "operator": "equals",
          "value": "in-person",
          "action": "show"
        }
      ]
    }
  ]
}`);
                if (success) {
                  toast.success("Code copied to clipboard!");
                } else {
                  toast.error("Failed to copy code");
                }
              }}
            >
              <Copy className="w-3.5 h-3.5 mr-1.5" />
              Copy
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
