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

export function exportToXML(data: FormSubmission): string {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += "<submission>\n";
  xml += `  <id>${escapeXml(data.submissionId)}</id>\n`;
  xml += `  <timestamp>${escapeXml(data.timestamp)}</timestamp>\n`;

  if (data.userIdentifier) {
    xml += `  <userIdentifier>${escapeXml(
      data.userIdentifier
    )}</userIdentifier>\n`;
  }

  if (data.totalMarks !== undefined) {
    xml += `  <totalMarks>${data.totalMarks}</totalMarks>\n`;
  }

  if (data.maxMarks !== undefined) {
    xml += `  <maxMarks>${data.maxMarks}</maxMarks>\n`;
  }

  xml += "  <data>\n";
  Object.entries(data.data).forEach(([key, value]) => {
    xml += `    <field name="${escapeXml(key)}">`;
    if (Array.isArray(value)) {
      xml += "\n";
      value.forEach((item) => {
        xml += `      <item>${escapeXml(String(item))}</item>\n`;
      });
      xml += "    ";
    } else if (typeof value === "object" && value !== null) {
      xml += escapeXml(JSON.stringify(value));
    } else {
      xml += escapeXml(String(value));
    }
    xml += "</field>\n";
  });
  xml += "  </data>\n";
  xml += "</submission>";

  return xml;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
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
  format: "json" | "csv" | "xml",
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
    case "xml":
      content = exportToXML(submission);
      filename = `form-submission-${timestamp}.xml`;
      mimeType = "application/xml";
      break;
  }

  downloadFile(content, filename, mimeType);
}

// Enhanced export for multiple submissions
export function exportMultipleSubmissions(
  submissions: any[],
  format: "json" | "csv",
  schema: FormSchema,
  filename: string
): void {
  let content: string;
  let mimeType: string;

  if (format === "json") {
    content = JSON.stringify(submissions, null, 2);
    mimeType = "application/json";
  } else {
    // Enhanced CSV export with field labels
    const allKeys = new Set<string>();
    submissions.forEach((response: any) => {
      Object.keys(response.data).forEach((key) => allKeys.add(key));
    });

    // Create headers with field labels
    const fieldIds = Array.from(allKeys);
    const headers = [
      "Submission ID",
      "Timestamp",
      "Respondent Name",
      "Respondent Email",
      ...fieldIds.map((fieldId) => getFieldLabel(schema, fieldId)),
    ];

    const csvRows = [headers.join(",")];

    submissions.forEach((response: any) => {
      const row = [
        response.submissionId,
        response.timestamp,
        response.respondentName || "",
        response.respondentEmail || "",
        ...fieldIds.map((fieldId) => {
          const value = response.data[fieldId];
          return formatValue(value, schema, fieldId);
        }),
      ];
      csvRows.push(
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      );
    });

    content = csvRows.join("\n");
    mimeType = "text/csv";
  }

  downloadFile(content, filename, mimeType);
}
