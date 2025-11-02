import { FormSubmission, FormSchema, FieldSchema } from "../types/schema";

// Helper to get all fields from schema (including nested sections)
function getAllFields(schema: FormSchema): FieldSchema[] {
  const fields: FieldSchema[] = [];

  if (schema.fields) {
    fields.push(...schema.fields);
  }

  if (schema.sections) {
    schema.sections.forEach((section) => {
      fields.push(...section.fields);
    });
  }

  return fields;
}

// Helper to get field label by ID
function getFieldLabel(schema: FormSchema, fieldId: string): string {
  const allFields = getAllFields(schema);
  const field = allFields.find((f) => f.id === fieldId);
  return field?.label || fieldId;
}

// Helper to format value for display
function formatValue(value: any, schema: FormSchema, fieldId: string): string {
  if (value === null || value === undefined) return "";

  // Handle arrays (from checkboxes/multiselect)
  if (Array.isArray(value)) {
    return value.join(", ");
  }

  // Handle objects
  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  // Handle numbers (especially computed fields)
  if (typeof value === "number") {
    const field = getAllFields(schema).find((f) => f.id === fieldId);
    const precision = field?.computed?.precision;

    if (precision !== undefined) {
      return value.toFixed(precision);
    }

    // Check if it might be a currency field (contains 'price', 'cost', 'total', 'amount')
    const fieldLabel = fieldId.toLowerCase();
    if (
      fieldLabel.includes("price") ||
      fieldLabel.includes("cost") ||
      fieldLabel.includes("total") ||
      fieldLabel.includes("amount") ||
      fieldLabel.includes("payment") ||
      fieldLabel.includes("fee")
    ) {
      return value.toFixed(2);
    }
  }

  return String(value);
}

export function exportToJSON(data: FormSubmission): string {
  return JSON.stringify(data, null, 2);
}

export function exportToCSV(data: FormSubmission, schema?: FormSchema): string {
  const headers = ["Field", "Value"];
  const rows: string[][] = [headers];

  Object.entries(data.data).forEach(([key, value]) => {
    const fieldLabel = schema ? getFieldLabel(schema, key) : key;
    let valueStr: string;

    if (schema) {
      valueStr = formatValue(value, schema, key);
    } else {
      // Fallback formatting without schema
      if (value === null) {
        valueStr = "null";
      } else if (value === undefined) {
        valueStr = "undefined";
      } else if (Array.isArray(value)) {
        valueStr = value.join(", ");
      } else if (typeof value === "object") {
        valueStr = JSON.stringify(value);
      } else {
        valueStr = String(value);
      }
    }

    rows.push([fieldLabel, valueStr]);
  });

  return rows
    .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
    .join("\n");
}

export function downloadFile(
  content: string,
  filename: string,
  mimeType: string
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportSubmission(
  submission: FormSubmission,
  format: "json" | "csv",
  schema?: FormSchema
): void {
  let content: string;
  let filename: string;
  let mimeType: string;

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

  switch (format) {
    case "json":
      content = exportToJSON(submission);
      filename = `form-submission-${timestamp}.json`;
      mimeType = "application/json";
      break;
    case "csv":
      content = exportToCSV(submission, schema);
      filename = `form-submission-${timestamp}.csv`;
      mimeType = "text/csv";
      break;
  }

  downloadFile(content, filename, mimeType);
}
