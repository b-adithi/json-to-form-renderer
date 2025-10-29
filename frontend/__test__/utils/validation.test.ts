import { FieldSchema } from "../../src/types/schema";
import { validateField, validateForm } from "../../src/utils/validation";
import { describe, it, expect } from "@jest/globals";

describe("Validation Utility", () => {
  describe("validateField", () => {
    it("should validate required fields", () => {
      const field: FieldSchema = {
        id: "name",
        type: "text",
        label: "Name",
        validation: { required: true },
      };
      // Test with empty value
      const emptyResult = validateField("", field);
      expect(emptyResult).toBe("Name is required");
      // Test with valid value
      const validResult = validateField("John Doe", field);
      expect(validResult).toBeNull();
    });

    it("should validate minLength", () => {
      const field: FieldSchema = {
        id: "username",
        type: "text",
        label: "Username",
        validation: { minLength: 3 },
      };
      const tooShort = validateField("ab", field);
      expect(tooShort).toContain("at least 3 characters");
      const validLength = validateField("abc", field);
      expect(validLength).toBeNull();
    });

    it("should validate maxLength", () => {
      const field: FieldSchema = {
        id: "bio",
        type: "textarea",
        label: "Bio",
        validation: { maxLength: 10 },
      };
      const tooLong = validateField("This is a very long text", field);
      expect(tooLong).toContain("no more than 10 characters");
      const validLength = validateField("Short", field);
      expect(validLength).toBeNull();
    });

    it("should validate email format", () => {
      const field: FieldSchema = {
        id: "email",
        type: "email",
        label: "Email",
        validation: { required: true },
      };
      const invalidEmail = validateField("notanemail", field);
      expect(invalidEmail).toContain("valid email address");
      const validEmail = validateField("test@example.com", field);
      expect(validEmail).toBeNull();
    });

    it("should validate URL format", () => {
      const field: FieldSchema = {
        id: "website",
        type: "url",
        label: "Website",
        validation: { url: true },
      };
      const invalidUrl = validateField("notaurl", field);
      expect(invalidUrl).toContain("valid URL");
      const validUrl = validateField("https://example.com", field);
      expect(validUrl).toBeNull();
    });

    it("should validate number min/max", () => {
      const field: FieldSchema = {
        id: "age",
        type: "number",
        label: "Age",
        validation: { min: 18, max: 100 },
      };
      const tooSmall = validateField("15", field);
      expect(tooSmall).toContain("at least 18");
      const tooLarge = validateField("150", field);
      expect(tooLarge).toContain("no more than 100");
      const valid = validateField("25", field);
      expect(valid).toBeNull();
    });

    it("should validate pattern (regex)", () => {
      const field: FieldSchema = {
        id: "code",
        type: "text",
        label: "Code",
        validation: { pattern: "^[A-Z]{3}[0-9]{3}$" },
      };
      const invalid = validateField("abc123", field);
      expect(invalid).toContain("format is invalid");
      const valid = validateField("ABC123", field);
      expect(valid).toBeNull();
    });

    it("should use custom error message when provided", () => {
      const field: FieldSchema = {
        id: "username",
        type: "text",
        label: "Username",
        validation: {
          required: true,
          message: "Username is mandatory",
        },
      };
      const result = validateField("", field);
      expect(result).toBe("Username is mandatory");
    });
  });

  describe("validateForm", () => {
    it("should validate all fields in a form", () => {
      const fields: FieldSchema[] = [
        {
          id: "name",
          type: "text",
          label: "Name",
          validation: { required: true },
        },
        {
          id: "email",
          type: "email",
          label: "Email",
          validation: { required: true },
        },
      ];
      const formData = { name: "", email: "invalid" };
      const errors = validateForm(formData, fields);
      expect(errors.name).toBeTruthy();
      expect(errors.email).toBeTruthy();
    });

    it("should return empty object for valid form", () => {
      const fields: FieldSchema[] = [
        {
          id: "name",
          type: "text",
          label: "Name",
          validation: { required: true },
        },
      ];
      const formData = { name: "John Doe" };
      const errors = validateForm(formData, fields);
      expect(Object.keys(errors).length).toBe(0);
    });
  });
});
