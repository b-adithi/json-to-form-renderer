import { FieldSchema } from "../types/schema";

export function validateField(value: any, field: FieldSchema): string | null {
  const validation = field.validation;

  if (!validation) return null;

  // Required validation
  if (validation.required) {
    if (value === undefined || value === null || value === "") {
      return validation.message || `${field.label} is required`;
    }
    if (Array.isArray(value) && value.length === 0) {
      return validation.message || `${field.label} is required`;
    }
  }

  // Skip other validations if value is empty and not required
  if (!value && !validation.required) return null;

  // Email validation
  if (field.type === "email" || validation.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return validation.message || "Please enter a valid email address";
    }
  }

  // URL validation
  if (field.type === "url" || validation.url) {
    try {
      new URL(value);
    } catch {
      return validation.message || "Please enter a valid URL";
    }
  }

  // Pattern validation
  if (validation.pattern) {
    const regex = new RegExp(validation.pattern);
    if (!regex.test(value)) {
      return validation.message || `${field.label} format is invalid`;
    }
  }

  // String length validation
  if (typeof value === "string") {
    if (validation.minLength && value.length < validation.minLength) {
      return (
        validation.message ||
        `${field.label} must be at least ${validation.minLength} characters`
      );
    }
    if (validation.maxLength && value.length > validation.maxLength) {
      return (
        validation.message ||
        `${field.label} must be no more than ${validation.maxLength} characters`
      );
    }
  }

  // Number range validation
  if (
    typeof value === "number" ||
    field.type === "number" ||
    field.type === "range"
  ) {
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(numValue)) {
      return validation.message || `${field.label} must be a number`;
    }
    if (validation.min !== undefined && numValue < validation.min) {
      return (
        validation.message ||
        `${field.label} must be at least ${validation.min}`
      );
    }
    if (validation.max !== undefined && numValue > validation.max) {
      return (
        validation.message ||
        `${field.label} must be no more than ${validation.max}`
      );
    }
  }

  // Array validation (for multiselect, checkbox)
  if (Array.isArray(value)) {
    if (validation.min && value.length < validation.min) {
      return (
        validation.message ||
        `Please select at least ${validation.min} option(s)`
      );
    }
    if (validation.max && value.length > validation.max) {
      return (
        validation.message ||
        `Please select no more than ${validation.max} option(s)`
      );
    }
  }

  return null;
}

export function validateForm(
  data: { [key: string]: any },
  fields: FieldSchema[]
): { [key: string]: string } {
  const errors: { [key: string]: string } = {};

  fields.forEach((field) => {
    const error = validateField(data[field.id], field);
    if (error) {
      errors[field.id] = error;
    }
  });

  return errors;
}
