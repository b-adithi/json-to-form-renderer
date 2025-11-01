// Schema type definitions for the JSON-to-Form Renderer

export type FieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "tel"
  | "url"
  | "textarea"
  | "select"
  | "multiselect"
  | "radio"
  | "checkbox"
  | "date"
  | "time"
  | "datetime"
  | "file"
  | "rating"
  | "range"
  | "matrix";

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  email?: boolean;
  url?: boolean;
  custom?: string; // Custom validation function name
  message?: string;
}

export interface ConditionalLogic {
  field: string;
  operator:
    | "equals"
    | "notEquals"
    | "contains"
    | "greaterThan"
    | "lessThan"
    | "notEmpty";
  value?: any;
  action: "show" | "hide" | "require" | "enable" | "disable";
}

export interface ComputedField {
  formula: string;
  dependencies: string[];
  precision?: number;
}

export interface MatrixQuestion {
  id: string;
  label: string;
  required?: boolean;
}

export interface FieldOption {
  label: string;
  value: string | number;
}

export interface FieldSchema {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  helpText?: string;
  defaultValue?: any;
  options?: FieldOption[];
  validation?: ValidationRule;
  conditional?: ConditionalLogic[];
  computed?: ComputedField;
  disabled?: boolean;
  required?: boolean;

  // Matrix specific
  rows?: MatrixQuestion[];
  columns?: FieldOption[];

  // Marks/Quiz specific
  enableMarks?: boolean;
  marks?: number;
  maxMarks?: number;

  // File upload specific
  accept?: string;
  maxSize?: number; // in bytes

  // Rating specific
  maxRating?: number;
  allowHalf?: boolean;

  // Range specific
  step?: number;
}

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  fields: FieldSchema[];
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export interface FormSchema {
  title: string;
  description?: string;
  sections?: FormSection[];
  fields?: FieldSchema[];
  theme?: "light" | "dark" | "auto";
  submitButton?: string;

  // Advanced settings
  shuffleQuestions?: boolean;
  enableMarks?: boolean;
  answerSequence?: "sequential" | "any";
  uniqueField?: string; // Field to use as submission identifier
  requireAuth?: boolean; // Require user authentication

  // Export settings
  exportFormats?: ("json" | "csv" | "xml")[];
}

export interface FormData {
  [fieldId: string]: any;
}

export interface FormErrors {
  [fieldId: string]: string;
}

export interface FormSubmission {
  submissionId: string;
  timestamp: string;
  userIdentifier?: string; // Email or unique field value
  data: FormData;
  totalMarks?: number;
  maxMarks?: number;
}

export interface LiveForm {
  id: string;
  name: string;
  schema: FormSchema;
  createdAt: string;
  status: "published" | "draft";
  responses?: FormSubmission[];
  responseCount?: number;
}
