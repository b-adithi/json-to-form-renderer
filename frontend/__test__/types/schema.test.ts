import {
  FieldType,
  ValidationRule,
  ConditionalLogic,
  ComputedField,
  FieldOption,
  FieldSchema,
  FormSection,
  FormSchema,
  FormData,
  FormErrors,
  FormSubmission,
  LiveForm,
} from "../../src/types/schema";

describe("Schema Types", () => {
  describe("FieldType", () => {
    it("should include all expected field types", () => {
      const expectedTypes: FieldType[] = [
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
      ];

      expectedTypes.forEach((type) => {
        const fieldType: FieldType = type;
        expect(fieldType).toBe(type);
      });
    });
  });

  describe("ValidationRule", () => {
    it("should accept all optional validation properties", () => {
      const validationRule: ValidationRule = {
        required: true,
        minLength: 5,
        maxLength: 100,
        min: 0,
        max: 999,
        pattern: "^[a-zA-Z]+$",
        email: true,
        url: true,
        custom: "customValidator",
        message: "Validation failed",
      };

      expect(validationRule.required).toBe(true);
      expect(validationRule.minLength).toBe(5);
      expect(validationRule.maxLength).toBe(100);
      expect(validationRule.pattern).toBe("^[a-zA-Z]+$");
      expect(validationRule.message).toBe("Validation failed");
    });

    it("should accept empty validation rule", () => {
      const emptyRule: ValidationRule = {};
      expect(emptyRule).toEqual({});
    });
  });

  describe("ConditionalLogic", () => {
    it("should have required properties", () => {
      const conditional: ConditionalLogic = {
        field: "hasPortfolio",
        operator: "equals",
        value: "yes",
        action: "show",
      };

      expect(conditional.field).toBe("hasPortfolio");
      expect(conditional.operator).toBe("equals");
      expect(conditional.value).toBe("yes");
      expect(conditional.action).toBe("show");
    });

    it("should support all operators", () => {
      const operators = [
        "equals",
        "notEquals",
        "contains",
        "greaterThan",
        "lessThan",
      ];

      operators.forEach((op) => {
        const conditional: ConditionalLogic = {
          field: "test",
          operator: op as any,
          value: "value",
          action: "show",
        };
        expect(conditional.operator).toBe(op);
      });
    });

    it("should support all actions", () => {
      const actions = ["show", "hide", "require", "enable", "disable"];

      actions.forEach((action) => {
        const conditional: ConditionalLogic = {
          field: "test",
          operator: "equals",
          value: "value",
          action: action as any,
        };
        expect(conditional.action).toBe(action);
      });
    });
  });

  describe("ComputedField", () => {
    it("should have required formula and dependencies", () => {
      const computed: ComputedField = {
        formula: "field1 + field2",
        dependencies: ["field1", "field2"],
      };

      expect(computed.formula).toBe("field1 + field2");
      expect(computed.dependencies).toEqual(["field1", "field2"]);
    });

    it("should accept optional precision", () => {
      const computed: ComputedField = {
        formula: "amount * rate",
        dependencies: ["amount", "rate"],
        precision: 2,
      };

      expect(computed.precision).toBe(2);
    });
  });

  describe("FieldOption", () => {
    it("should accept string value", () => {
      const option: FieldOption = {
        label: "Option 1",
        value: "option1",
      };

      expect(option.label).toBe("Option 1");
      expect(option.value).toBe("option1");
    });

    it("should accept number value", () => {
      const option: FieldOption = {
        label: "Five",
        value: 5,
      };

      expect(option.label).toBe("Five");
      expect(option.value).toBe(5);
    });
  });

  describe("FieldSchema", () => {
    it("should have required properties", () => {
      const field: FieldSchema = {
        id: "email",
        type: "email",
        label: "Email Address",
      };

      expect(field.id).toBe("email");
      expect(field.type).toBe("email");
      expect(field.label).toBe("Email Address");
    });

    it("should accept all optional properties", () => {
      const field: FieldSchema = {
        id: "complex",
        type: "matrix",
        label: "Complex Field",
        placeholder: "Enter value",
        helpText: "This is help text",
        defaultValue: "default",
        options: [{ label: "Option", value: "value" }],
        validation: { required: true },
        conditional: [
          {
            field: "other",
            operator: "equals",
            value: "yes",
            action: "show",
          },
        ],
        computed: {
          formula: "field1 + field2",
          dependencies: ["field1", "field2"],
        },
        disabled: true,
        rows: [{ id: "row1", label: "Row 1" }],
        columns: [{ label: "Col 1", value: "col1" }],
        enableMarks: true,
        marks: 10,
        maxMarks: 20,
        accept: ".pdf,.doc",
        maxSize: 1024000,
        maxRating: 5,
        allowHalf: true,
        step: 0.5,
      };

      expect(field.placeholder).toBe("Enter value");
      expect(field.helpText).toBe("This is help text");
      expect(field.disabled).toBe(true);
      expect(field.maxRating).toBe(5);
      expect(field.allowHalf).toBe(true);
    });
  });

  describe("FormSection", () => {
    it("should have required properties", () => {
      const section: FormSection = {
        id: "section1",
        title: "Personal Info",
        fields: [],
      };

      expect(section.id).toBe("section1");
      expect(section.title).toBe("Personal Info");
      expect(section.fields).toEqual([]);
    });

    it("should accept optional properties", () => {
      const section: FormSection = {
        id: "section2",
        title: "Contact Info",
        description: "Your contact information",
        fields: [],
        collapsible: true,
        defaultCollapsed: false,
      };

      expect(section.description).toBe("Your contact information");
      expect(section.collapsible).toBe(true);
      expect(section.defaultCollapsed).toBe(false);
    });
  });

  describe("FormSchema", () => {
    it("should have required title", () => {
      const schema: FormSchema = {
        title: "Test Form",
      };

      expect(schema.title).toBe("Test Form");
    });

    it("should accept all optional properties", () => {
      const schema: FormSchema = {
        title: "Complete Form",
        description: "A complete form schema",
        sections: [],
        fields: [],
        theme: "dark",
        submitButton: "Submit",
        shuffleQuestions: true,
        enableMarks: true,
        answerSequence: "sequential",
        uniqueField: "email",
        requireAuth: true,
        exportFormats: ["json", "csv", "xml"],
      };

      expect(schema.description).toBe("A complete form schema");
      expect(schema.theme).toBe("dark");
      expect(schema.shuffleQuestions).toBe(true);
      expect(schema.answerSequence).toBe("sequential");
      expect(schema.exportFormats).toEqual(["json", "csv", "xml"]);
    });
  });

  describe("FormData", () => {
    it("should accept any field values", () => {
      const formData: FormData = {
        email: "test@example.com",
        age: 25,
        active: true,
        preferences: ["option1", "option2"],
      };

      expect(formData.email).toBe("test@example.com");
      expect(formData.age).toBe(25);
      expect(formData.active).toBe(true);
      expect(formData.preferences).toEqual(["option1", "option2"]);
    });
  });

  describe("FormErrors", () => {
    it("should map field IDs to error messages", () => {
      const errors: FormErrors = {
        email: "Invalid email format",
        age: "Must be at least 18",
      };

      expect(errors.email).toBe("Invalid email format");
      expect(errors.age).toBe("Must be at least 18");
    });
  });

  describe("FormSubmission", () => {
    it("should have required properties", () => {
      const submission: FormSubmission = {
        submissionId: "sub-123",
        timestamp: "2024-01-01T00:00:00Z",
        data: { name: "John Doe" },
      };

      expect(submission.submissionId).toBe("sub-123");
      expect(submission.timestamp).toBe("2024-01-01T00:00:00Z");
      expect(submission.data).toEqual({ name: "John Doe" });
    });

    it("should accept optional properties", () => {
      const submission: FormSubmission = {
        submissionId: "sub-456",
        timestamp: "2024-01-01T00:00:00Z",
        userIdentifier: "user@example.com",
        data: { score: 85 },
        totalMarks: 85,
        maxMarks: 100,
      };

      expect(submission.userIdentifier).toBe("user@example.com");
      expect(submission.totalMarks).toBe(85);
      expect(submission.maxMarks).toBe(100);
    });
  });

  describe("LiveForm", () => {
    it("should have required properties", () => {
      const liveForm: LiveForm = {
        id: "form-123",
        name: "Test Form",
        schema: { title: "Test Form" },
        createdAt: "2024-01-01T00:00:00Z",
        status: "published",
      };

      expect(liveForm.id).toBe("form-123");
      expect(liveForm.name).toBe("Test Form");
      expect(liveForm.schema.title).toBe("Test Form");
      expect(liveForm.status).toBe("published");
    });

    it("should accept optional properties", () => {
      const liveForm: LiveForm = {
        id: "form-456",
        name: "Survey Form",
        schema: { title: "Survey Form" },
        createdAt: "2024-01-01T00:00:00Z",
        status: "draft",
        responses: [],
        responseCount: 0,
      };

      expect(liveForm.responses).toEqual([]);
      expect(liveForm.responseCount).toBe(0);
    });

    it("should support both published and draft status", () => {
      const published: LiveForm = {
        id: "form-1",
        name: "Published Form",
        schema: { title: "Published" },
        createdAt: "2024-01-01T00:00:00Z",
        status: "published",
      };

      const draft: LiveForm = {
        id: "form-2",
        name: "Draft Form",
        schema: { title: "Draft" },
        createdAt: "2024-01-01T00:00:00Z",
        status: "draft",
      };

      expect(published.status).toBe("published");
      expect(draft.status).toBe("draft");
    });
  });
});
