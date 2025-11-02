import { useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { AutocompleteHelp } from "./AutocompleteHelp";

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  theme?: "light" | "dark";
}

// Suppress CSS errors immediately at module load time
if (typeof window !== "undefined") {
  const originalError = console.error;
  const originalWarn = console.warn;

  console.error = (...args: any[]) => {
    const errorString = String(args[0] || "");
    if (
      errorString.includes("cssRules") ||
      errorString.includes("CSSStyleSheet") ||
      errorString.includes("SecurityError") ||
      errorString.includes("Failed to read")
    ) {
      return;
    }
    originalError.apply(console, args);
  };

  console.warn = (...args: any[]) => {
    const warnString = String(args[0] || "");
    if (
      warnString.includes("cssRules") ||
      warnString.includes("CSSStyleSheet")
    ) {
      return;
    }
    originalWarn.apply(console, args);
  };

  // Override CSS rule access errors at the global level
  const originalGetCSSRules = Object.getOwnPropertyDescriptor(
    CSSStyleSheet.prototype,
    "cssRules"
  );

  if (originalGetCSSRules) {
    Object.defineProperty(CSSStyleSheet.prototype, "cssRules", {
      get() {
        try {
          return originalGetCSSRules.get?.call(this);
        } catch (e) {
          // Silently return empty rules on security error
          return [];
        }
      },
    });
  }
}

export function JsonEditor({
  value,
  onChange,
  error,
  theme = "light",
}: JsonEditorProps) {
  const editorRef = useRef<any>(null);

  useEffect(() => {
    // Additional runtime error suppression
    const handleError = (event: ErrorEvent) => {
      if (
        event.message.includes("cssRules") ||
        event.message.includes("CSSStyleSheet") ||
        event.message.includes("SecurityError")
      ) {
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    };

    window.addEventListener("error", handleError, true);

    return () => {
      window.removeEventListener("error", handleError, true);
    };
  }, []);

  const handleEditorWillMount = (_monaco: any) => {
    // Additional Monaco-specific error suppression
    try {
      // This helps prevent CSS-related errors in Monaco
      if (typeof window !== "undefined") {
        const style = document.createElement("style");
        style.textContent = "/* Monaco editor styles loaded */";
        document.head.appendChild(style);
      }
    } catch (e) {
      // Silently catch any errors
    }
  };

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;

    // Register code snippets for faster JSON editing
    monaco.languages.registerCompletionItemProvider("json", {
      provideCompletionItems: (model: any, position: any) => {
        // Get the full text content
        const textUntilPosition = model.getValueInRange({
          startLineNumber: 1,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        });

        // Check if we're inside a "fields" array
        const isInsideFieldsArray = (() => {
          try {
            // Count opening and closing brackets for "fields"
            const fieldsMatch = textUntilPosition.match(/"fields"\s*:\s*\[/g);
            if (!fieldsMatch) return false;

            // Get text after the last "fields": [
            const lastFieldsIndex = textUntilPosition.lastIndexOf('"fields"');
            const textAfterFields =
              textUntilPosition.substring(lastFieldsIndex);

            // Count brackets to see if we're still inside
            const openBrackets = (textAfterFields.match(/\[/g) || []).length;
            const closeBrackets = (textAfterFields.match(/\]/g) || []).length;

            return openBrackets > closeBrackets;
          } catch {
            return false;
          }
        })();

        // Helper function to create field snippet
        const createFieldSnippet = (fieldContent: string) => {
          if (isInsideFieldsArray) {
            // Just return the field object
            return fieldContent;
          } else {
            // Wrap in complete form structure
            return `{
  "title": "\${1:Form Title}",
  "description": "\${2:Form description}",
  "fields": [
    ${fieldContent}
  ]
}`;
          }
        };

        const suggestions = [
          {
            label: "text-field",
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: createFieldSnippet(
              [
                "{",
                '  "id": "${1:name}",',
                '  "type": "text",',
                '  "label": "${2:Name}",',
                '  "placeholder": "${3:Enter your name}",',
                '  "validation": {',
                '    "required": ${4:true}',
                "  }",
                "}",
              ].join("\n")
            ),
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation:
              "Text input field" +
              (isInsideFieldsArray ? "" : " (with form wrapper)"),
          },
          {
            label: "email-field",
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: createFieldSnippet(
              [
                "{",
                '  "id": "${1:email}",',
                '  "type": "email",',
                '  "label": "${2:Email Address}",',
                '  "placeholder": "${3:your@email.com}",',
                '  "validation": {',
                '    "required": true',
                "  }",
                "}",
              ].join("\n")
            ),
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation:
              "Email field with validation" +
              (isInsideFieldsArray ? "" : " (with form wrapper)"),
          },
          {
            label: "select-field",
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: createFieldSnippet(
              [
                "{",
                '  "id": "${1:choice}",',
                '  "type": "select",',
                '  "label": "${2:Choose Option}",',
                '  "options": [',
                '    { "label": "${3:Option 1}", "value": "${4:option1}" },',
                '    { "label": "${5:Option 2}", "value": "${6:option2}" }',
                "  ],",
                '  "validation": {',
                '    "required": ${7:true}',
                "  }",
                "}",
              ].join("\n")
            ),
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation:
              "Select dropdown field" +
              (isInsideFieldsArray ? "" : " (with form wrapper)"),
          },
          {
            label: "textarea-field",
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: createFieldSnippet(
              [
                "{",
                '  "id": "${1:message}",',
                '  "type": "textarea",',
                '  "label": "${2:Message}",',
                '  "placeholder": "${3:Enter your message...}",',
                '  "validation": {',
                '    "required": ${4:true},',
                '    "minLength": ${5:10}',
                "  }",
                "}",
              ].join("\n")
            ),
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation:
              "Textarea field with length validation" +
              (isInsideFieldsArray ? "" : " (with form wrapper)"),
          },
          {
            label: "checkbox-field",
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: createFieldSnippet(
              [
                "{",
                '  "id": "${1:agree}",',
                '  "type": "checkbox",',
                '  "label": "${2:I agree to the terms and conditions}",',
                '  "validation": {',
                '    "required": ${3:true}',
                "  }",
                "}",
              ].join("\n")
            ),
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation:
              "Checkbox field" +
              (isInsideFieldsArray ? "" : " (with form wrapper)"),
          },
          {
            label: "radio-field",
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: createFieldSnippet(
              [
                "{",
                '  "id": "${1:choice}",',
                '  "type": "radio",',
                '  "label": "${2:Choose an option}",',
                '  "options": [',
                '    { "label": "${3:Yes}", "value": "${4:yes}" },',
                '    { "label": "${5:No}", "value": "${6:no}" }',
                "  ],",
                '  "validation": {',
                '    "required": ${7:true}',
                "  }",
                "}",
              ].join("\n")
            ),
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation:
              "Radio button group" +
              (isInsideFieldsArray ? "" : " (with form wrapper)"),
          },
          {
            label: "form-section",
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: [
              "{",
              '  "id": "${1:sectionId}",',
              '  "title": "${2:Section Title}",',
              '  "description": "${3:Section description}",',
              '  "fields": [',
              "    $0",
              "  ]",
              "}",
            ].join("\n"),
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: "Form section template",
          },
          {
            label: "form-complete",
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: [
              "{",
              '  "title": "${1:Form Title}",',
              '  "description": "${2:Form description}",',
              '  "submitButton": "${3:Submit}",',
              '  "fields": [',
              "    $0",
              "  ]",
              "}",
            ].join("\n"),
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: "Complete form schema template",
          },
          {
            label: "validation-required",
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: [
              '"validation": {',
              '  "required": true,',
              '  "message": "${1:This field is required}"',
              "}",
            ].join("\n"),
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: "Required validation rule",
          },
          {
            label: "conditional-logic",
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: [
              '"conditional": [',
              "  {",
              '    "field": "${1:fieldId}",',
              '    "operator": "${2:equals}",',
              '    "value": "${3:value}",',
              '    "action": "${4:show}"',
              "  }",
              "]",
            ].join("\n"),
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: "Conditional logic template",
          },
          {
            label: "number-field",
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: createFieldSnippet(
              [
                "{",
                '  "id": "${1:age}",',
                '  "type": "number",',
                '  "label": "${2:Age}",',
                '  "placeholder": "${3:Enter your age}",',
                '  "validation": {',
                '    "required": ${4:true},',
                '    "min": ${5:0},',
                '    "max": ${6:100}',
                "  }",
                "}",
              ].join("\n")
            ),
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation:
              "Number input with min/max validation" +
              (isInsideFieldsArray ? "" : " (with form wrapper)"),
          },
          {
            label: "date-field",
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: createFieldSnippet(
              [
                "{",
                '  "id": "${1:birthdate}",',
                '  "type": "date",',
                '  "label": "${2:Date of Birth}",',
                '  "validation": {',
                '    "required": ${3:true}',
                "  }",
                "}",
              ].join("\n")
            ),
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation:
              "Date picker field" +
              (isInsideFieldsArray ? "" : " (with form wrapper)"),
          },
          {
            label: "rating-field",
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: createFieldSnippet(
              [
                "{",
                '  "id": "${1:rating}",',
                '  "type": "rating",',
                '  "label": "${2:Rate your experience}",',
                '  "maxRating": ${3:5},',
                '  "allowHalf": ${4:false},',
                '  "validation": {',
                '    "required": ${5:true}',
                "  }",
                "}",
              ].join("\n")
            ),
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation:
              "Rating field (stars)" +
              (isInsideFieldsArray ? "" : " (with form wrapper)"),
          },
          {
            label: "password-field",
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: createFieldSnippet(
              [
                "{",
                '  "id": "${1:password}",',
                '  "type": "password",',
                '  "label": "${2:Password}",',
                '  "placeholder": "${3:Enter password}",',
                '  "validation": {',
                '    "required": true,',
                '    "minLength": ${4:8}',
                "  }",
                "}",
              ].join("\n")
            ),
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation:
              "Password field with min length" +
              (isInsideFieldsArray ? "" : " (with form wrapper)"),
          },
          {
            label: "tel-field",
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: createFieldSnippet(
              [
                "{",
                '  "id": "${1:phone}",',
                '  "type": "tel",',
                '  "label": "${2:Phone Number}",',
                '  "placeholder": "${3:+1 (555) 000-0000}",',
                '  "validation": {',
                '    "required": ${4:true}',
                "  }",
                "}",
              ].join("\n")
            ),
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation:
              "Phone number field" +
              (isInsideFieldsArray ? "" : " (with form wrapper)"),
          },
          {
            label: "url-field",
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: createFieldSnippet(
              [
                "{",
                '  "id": "${1:website}",',
                '  "type": "url",',
                '  "label": "${2:Website}",',
                '  "placeholder": "${3:https://example.com}",',
                '  "validation": {',
                '    "required": ${4:true}',
                "  }",
                "}",
              ].join("\n")
            ),
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation:
              "URL field" + (isInsideFieldsArray ? "" : " (with form wrapper)"),
          },
          {
            label: "file-field",
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: createFieldSnippet(
              [
                "{",
                '  "id": "${1:attachment}",',
                '  "type": "file",',
                '  "label": "${2:Upload File}",',
                '  "accept": "${3:.pdf,.doc,.docx}",',
                '  "validation": {',
                '    "required": ${4:true}',
                "  }",
                "}",
              ].join("\n")
            ),
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation:
              "File upload field" +
              (isInsideFieldsArray ? "" : " (with form wrapper)"),
          },
        ];
        return { suggestions };
      },
    });

    // Configure JSON schema validation and autocomplete
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      schemas: [
        {
          uri: "http://myserver/form-schema.json",
          fileMatch: ["*"],
          schema: {
            type: "object",
            properties: {
              title: {
                type: "string",
                description: "Form title",
              },
              description: {
                type: "string",
                description: "Form description",
              },
              submitButton: {
                type: "string",
                description: "Submit button text",
              },
              theme: {
                type: "string",
                enum: ["light", "dark", "auto"],
                description: "Form theme",
              },
              enableMarks: {
                type: "boolean",
                description: "Enable quiz/marks mode",
              },
              shuffleQuestions: {
                type: "boolean",
                description: "Randomize question order",
              },
              answerSequence: {
                type: "string",
                enum: ["sequential", "any"],
                description: "Answer sequence requirement",
              },
              uniqueField: {
                type: "string",
                description: "Field ID to use as unique identifier",
              },
              requireAuth: {
                type: "boolean",
                description: "Require user authentication",
              },
              exportFormats: {
                type: "array",
                items: {
                  type: "string",
                  enum: ["json", "csv", "xml"],
                },
                description: "Available export formats",
              },
              sections: {
                type: "array",
                description: "Form sections",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string", description: "Section ID" },
                    title: { type: "string", description: "Section title" },
                    description: {
                      type: "string",
                      description: "Section description",
                    },
                    collapsible: {
                      type: "boolean",
                      description: "Allow collapse",
                    },
                    defaultCollapsed: {
                      type: "boolean",
                      description: "Start collapsed",
                    },
                    fields: {
                      type: "array",
                      description: "Fields in this section",
                      items: { $ref: "#/definitions/field" },
                    },
                  },
                  required: ["id", "title", "fields"],
                },
              },
              fields: {
                type: "array",
                description: "Form fields (use this OR sections)",
                items: { $ref: "#/definitions/field" },
              },
            },
            definitions: {
              field: {
                type: "object",
                properties: {
                  id: {
                    type: "string",
                    description: "Unique field identifier",
                  },
                  type: {
                    type: "string",
                    enum: [
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
                    ],
                    description: "Field type",
                  },
                  label: {
                    type: "string",
                    description: "Field label",
                  },
                  placeholder: {
                    type: "string",
                    description: "Placeholder text",
                  },
                  helpText: {
                    type: "string",
                    description: "Help text tooltip",
                  },
                  defaultValue: {
                    description: "Default field value",
                  },
                  disabled: {
                    type: "boolean",
                    description: "Disable field",
                  },
                  options: {
                    type: "array",
                    description: "Options for select/radio/checkbox fields",
                    items: {
                      type: "object",
                      properties: {
                        label: { type: "string", description: "Option label" },
                        value: { description: "Option value" },
                      },
                      required: ["label", "value"],
                    },
                  },
                  validation: {
                    type: "object",
                    description: "Validation rules",
                    properties: {
                      required: {
                        type: "boolean",
                        description: "Field is required",
                      },
                      minLength: {
                        type: "number",
                        description: "Minimum length",
                      },
                      maxLength: {
                        type: "number",
                        description: "Maximum length",
                      },
                      min: { type: "number", description: "Minimum value" },
                      max: { type: "number", description: "Maximum value" },
                      pattern: { type: "string", description: "Regex pattern" },
                      email: {
                        type: "boolean",
                        description: "Email validation",
                      },
                      url: { type: "boolean", description: "URL validation" },
                      message: {
                        type: "string",
                        description: "Custom error message",
                      },
                    },
                  },
                  conditional: {
                    type: "array",
                    description: "Conditional logic rules",
                    items: {
                      type: "object",
                      properties: {
                        field: {
                          type: "string",
                          description: "Field ID to check",
                        },
                        operator: {
                          type: "string",
                          enum: [
                            "equals",
                            "notEquals",
                            "contains",
                            "greaterThan",
                            "lessThan",
                          ],
                          description: "Comparison operator",
                        },
                        value: { description: "Value to compare" },
                        action: {
                          type: "string",
                          enum: [
                            "show",
                            "hide",
                            "require",
                            "enable",
                            "disable",
                          ],
                          description: "Action to perform",
                        },
                      },
                      required: ["field", "operator", "value", "action"],
                    },
                  },
                  computed: {
                    type: "object",
                    description: "Computed field configuration",
                    properties: {
                      formula: {
                        type: "string",
                        description: "Calculation formula",
                      },
                      dependencies: {
                        type: "array",
                        items: { type: "string" },
                        description: "Field IDs this depends on",
                      },
                      precision: {
                        type: "number",
                        description: "Decimal precision",
                      },
                    },
                    required: ["formula", "dependencies"],
                  },
                  rows: {
                    type: "array",
                    description: "Matrix rows",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        label: { type: "string" },
                        required: { type: "boolean" },
                      },
                    },
                  },
                  columns: {
                    type: "array",
                    description: "Matrix columns",
                    items: {
                      type: "object",
                      properties: {
                        label: { type: "string" },
                        value: {},
                      },
                    },
                  },
                  enableMarks: {
                    type: "boolean",
                    description: "Enable marks for this question",
                  },
                  marks: {
                    type: "number",
                    description: "Points awarded",
                  },
                  maxMarks: {
                    type: "number",
                    description: "Maximum points possible",
                  },
                  accept: {
                    type: "string",
                    description: "Accepted file types",
                  },
                  maxSize: {
                    type: "number",
                    description: "Max file size in bytes",
                  },
                  maxRating: {
                    type: "number",
                    description: "Maximum rating value",
                  },
                  allowHalf: {
                    type: "boolean",
                    description: "Allow half ratings",
                  },
                  step: {
                    type: "number",
                    description: "Range slider step",
                  },
                },
                required: ["id", "type", "label"],
              },
            },
            required: ["title"],
          },
        },
      ],
    });

    // Focus the editor
    editor.focus();
  };

  const handleEditorChange = (value: string | undefined) => {
    onChange(value || "");
  };

  const insertFieldTemplate = (template: string) => {
    if (!editorRef.current) return;

    const editor = editorRef.current;
    const selection = editor.getSelection();
    const currentPosition = editor.getPosition();

    if (!currentPosition) return;

    // Get current line content
    const model = editor.getModel();
    const lineContent = model.getLineContent(currentPosition.lineNumber);

    // Check if we're inside a "fields" array
    const isInFieldsArray =
      lineContent.includes('"fields"') ||
      value.includes('"fields": [') ||
      value.includes('"fields":[');

    let insertText = template;

    // If not in fields array, wrap in complete structure
    if (!isInFieldsArray && !value.includes('"fields"')) {
      insertText = `{
  "title": "New Form",
  "description": "Form description",
  "fields": [
    ${template}
  ]
}`;
    }

    const range = {
      startLineNumber: selection?.startLineNumber || currentPosition.lineNumber,
      startColumn: selection?.startColumn || currentPosition.column,
      endLineNumber: selection?.endLineNumber || currentPosition.lineNumber,
      endColumn: selection?.endColumn || currentPosition.column,
    };

    editor.executeEdits("insert-field", [
      {
        range,
        text: insertText,
      },
    ]);

    editor.focus();
  };

  return (
    <div
      className="border rounded-lg overflow-hidden flex flex-col"
      style={{
        height: "calc(100vh - 69px - 69px - 74px - 16px - 16px - 40px)",
      }}
    >
      {/* Quick Insert Toolbar */}
      <div className="flex items-center gap-2 p-2 bg-muted/30 border-b flex-shrink-0 flex-wrap">
        <span className="text-xs text-muted-foreground mr-1">
          Quick Insert:
        </span>
        <button
          onClick={() =>
            insertFieldTemplate(`{
  "id": "name",
  "type": "text",
  "label": "Name",
  "placeholder": "Enter your name",
  "validation": {
    "required": true
  }
}`)
          }
          className="px-2 py-1 text-xs bg-background hover:bg-accent rounded border transition-colors"
          title="Insert text field"
        >
          Text
        </button>
        <button
          onClick={() =>
            insertFieldTemplate(`{
  "id": "email",
  "type": "email",
  "label": "Email",
  "placeholder": "your@email.com",
  "validation": {
    "required": true
  }
}`)
          }
          className="px-2 py-1 text-xs bg-background hover:bg-accent rounded border transition-colors"
          title="Insert email field"
        >
          Email
        </button>
        <button
          onClick={() =>
            insertFieldTemplate(`{
  "id": "message",
  "type": "textarea",
  "label": "Message",
  "placeholder": "Enter your message",
  "validation": {
    "required": true,
    "minLength": 10
  }
}`)
          }
          className="px-2 py-1 text-xs bg-background hover:bg-accent rounded border transition-colors"
          title="Insert textarea"
        >
          Textarea
        </button>
        <button
          onClick={() =>
            insertFieldTemplate(`{
  "id": "choice",
  "type": "select",
  "label": "Choose Option",
  "options": [
    { "label": "Option 1", "value": "opt1" },
    { "label": "Option 2", "value": "opt2" }
  ],
  "validation": {
    "required": true
  }
}`)
          }
          className="px-2 py-1 text-xs bg-background hover:bg-accent rounded border transition-colors"
          title="Insert select dropdown"
        >
          Select
        </button>
        <button
          onClick={() =>
            insertFieldTemplate(`{
  "id": "agree",
  "type": "checkbox",
  "label": "I agree to the terms",
  "validation": {
    "required": true
  }
}`)
          }
          className="px-2 py-1 text-xs bg-background hover:bg-accent rounded border transition-colors"
          title="Insert checkbox"
        >
          Checkbox
        </button>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            💡 Type field names for smart autocomplete
          </span>
          <AutocompleteHelp />
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage="json"
          value={value}
          onChange={handleEditorChange}
          beforeMount={handleEditorWillMount}
          onMount={handleEditorDidMount}
          theme={theme === "dark" ? "vs-dark" : "light"}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: "on",
            formatOnPaste: true,
            formatOnType: true,
            autoClosingBrackets: "always",
            autoClosingQuotes: "always",
            autoClosingOvertype: "always",
            autoIndent: "full",
            bracketPairColorization: {
              enabled: true,
            },
            guides: {
              bracketPairs: true,
              indentation: true,
            },
            quickSuggestions: {
              other: true,
              comments: false,
              strings: true,
            },
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: "on",
            tabCompletion: "on",
            snippetSuggestions: "top",
            suggest: {
              showWords: false,
              showSnippets: true,
              showKeywords: true,
              showProperties: true,
              showValues: true,
              preview: true,
              previewMode: "subwordSmart",
            },
            parameterHints: {
              enabled: true,
              cycle: true,
            },
            matchBrackets: "always",
            selectionHighlight: true,
            occurrencesHighlight: "singleFile",
            folding: true,
            foldingStrategy: "indentation",
            showFoldingControls: "always",
            renderWhitespace: "selection",
            renderLineHighlight: "all",
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            smoothScrolling: true,
            mouseWheelZoom: true,
            padding: { top: 16, bottom: 16 },
            scrollbar: {
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10,
              useShadows: true,
              verticalHasArrows: false,
              horizontalHasArrows: false,
            },
          }}
        />
      </div>
      {error && error.trim() && (
        <div className="px-4 py-2 bg-destructive/10 border-t border-destructive/20 text-destructive text-sm flex-shrink-0">
          {error}
        </div>
      )}
    </div>
  );
}
