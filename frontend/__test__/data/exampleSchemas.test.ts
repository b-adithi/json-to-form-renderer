import {
  contactFormSchema,
  surveyFormSchema,
  jobApplicationSchema,
  quizSchema,
  calculatorFormSchema,
  exampleSchemas,
} from "../../src/data/exampleSchemas";
import { FieldSchema } from "../../src/types/schema";

describe("Example Schemas", () => {
  describe("contactFormSchema", () => {
    it("should have correct structure", () => {
      expect(contactFormSchema.title).toBe("Contact Form");
      expect(contactFormSchema.description).toBe(
        "A simple contact form with validation"
      );
      expect(contactFormSchema.submitButton).toBe("Send Message");
      expect(contactFormSchema.fields).toHaveLength(5);
    });

    it("should have all required fields", () => {
      const fieldIds = contactFormSchema.fields!.map((field) => field.id);
      expect(fieldIds).toEqual([
        "fullName",
        "email",
        "phone",
        "subject",
        "message",
      ]);
    });

    it("should have proper validation rules", () => {
      const fullNameField = contactFormSchema.fields!.find(
        (f) => f.id === "fullName"
      );
      expect(fullNameField?.validation?.required).toBe(true);
      expect(fullNameField?.validation?.minLength).toBe(2);
      expect(fullNameField?.validation?.maxLength).toBe(50);

      const emailField = contactFormSchema.fields!.find(
        (f) => f.id === "email"
      );
      expect(emailField?.validation?.required).toBe(true);
      expect(emailField?.validation?.email).toBe(true);
    });

    it("should have select options for subject field", () => {
      const subjectField = contactFormSchema.fields!.find(
        (f) => f.id === "subject"
      );
      expect(subjectField?.options).toHaveLength(4);
      expect(subjectField?.options![0]).toEqual({
        label: "General Inquiry",
        value: "general",
      });
    });
  });

  describe("surveyFormSchema", () => {
    it("should have sections structure", () => {
      expect(surveyFormSchema.title).toBe("Customer Satisfaction Survey");
      expect(surveyFormSchema.enableMarks).toBe(false);
      expect(surveyFormSchema.sections).toHaveLength(2);
    });

    it("should have personal information section", () => {
      const personalSection = surveyFormSchema.sections![0];
      expect(personalSection.id).toBe("section1");
      expect(personalSection.title).toBe("Personal Information");
      expect(personalSection.fields).toHaveLength(2);
    });

    it("should have service rating section", () => {
      const ratingSection = surveyFormSchema.sections![1];
      expect(ratingSection.id).toBe("section2");
      expect(ratingSection.title).toBe("Service Rating");
      expect(ratingSection.fields).toHaveLength(3);
    });

    it("should have rating field with correct properties", () => {
      const ratingField = surveyFormSchema.sections![1].fields.find(
        (f) => f.id === "overallRating"
      );
      expect(ratingField?.type).toBe("rating");
      expect(ratingField?.maxRating).toBe(5);
    });

    it("should have range field with proper configuration", () => {
      const rangeField = surveyFormSchema.sections![1].fields.find(
        (f) => f.id === "recommend"
      );
      expect(rangeField?.type).toBe("range");
      expect(rangeField?.validation?.min).toBe(0);
      expect(rangeField?.validation?.max).toBe(10);
      expect(rangeField?.step).toBe(1);
    });
  });

  describe("jobApplicationSchema", () => {
    it("should have unique field configuration", () => {
      expect(jobApplicationSchema.title).toBe("Job Application Form");
      expect(jobApplicationSchema.uniqueField).toBe("email");
      expect(jobApplicationSchema.fields).toHaveLength(9);
    });

    it("should have conditional logic for portfolio field", () => {
      const portfolioField = jobApplicationSchema.fields!.find(
        (f) => f.id === "portfolioUrl"
      );
      expect(portfolioField?.conditional).toHaveLength(2);

      const showCondition = portfolioField?.conditional![0];
      expect(showCondition?.field).toBe("hasPortfolio");
      expect(showCondition?.operator).toBe("equals");
      expect(showCondition?.value).toBe("yes");
      expect(showCondition?.action).toBe("show");

      const requireCondition = portfolioField?.conditional![1];
      expect(requireCondition?.action).toBe("require");
    });

    it("should have proper field types", () => {
      const fields = jobApplicationSchema.fields!;
      const emailField = fields.find((f) => f.id === "email");
      const positionField = fields.find((f) => f.id === "position");
      const dateField = fields.find((f) => f.id === "availableDate");

      expect(emailField?.type).toBe("email");
      expect(positionField?.type).toBe("select");
      expect(dateField?.type).toBe("date");
    });
  });

  describe("quizSchema", () => {
    it("should have quiz configuration", () => {
      expect(quizSchema.title).toBe("JavaScript Knowledge Quiz");
      expect(quizSchema.enableMarks).toBe(true);
      expect(quizSchema.answerSequence).toBe("any");
      expect(quizSchema.sections).toHaveLength(1);
    });

    it("should have questions with marks", () => {
      const quizSection = quizSchema.sections![0];
      const questions = quizSection.fields;

      expect(questions).toHaveLength(3);
      questions.forEach((question) => {
        expect(question.enableMarks).toBe(true);
        expect(question.maxMarks).toBeGreaterThan(0);
      });
    });

    it("should have different question types", () => {
      const questions = quizSchema.sections![0].fields;
      const radioQuestion = questions.find((q) => q.id === "q1");
      const checkboxQuestion = questions.find((q) => q.id === "q2");
      const textQuestion = questions.find((q) => q.id === "q3");

      expect(radioQuestion?.type).toBe("radio");
      expect(checkboxQuestion?.type).toBe("checkbox");
      expect(textQuestion?.type).toBe("textarea");
    });

    it("should have proper validation for checkbox question", () => {
      const checkboxQuestion = quizSchema.sections![0].fields.find(
        (q) => q.id === "q2"
      );
      expect(checkboxQuestion?.validation?.required).toBe(true);
      expect(checkboxQuestion?.validation?.min).toBe(1);
    });
  });

  describe("calculatorFormSchema", () => {
    it("should have calculation fields", () => {
      expect(calculatorFormSchema.title).toBe("Loan Calculator");
      expect(calculatorFormSchema.fields).toHaveLength(5);
    });

    it("should have computed fields", () => {
      const monthlyPaymentField = calculatorFormSchema.fields!.find(
        (f) => f.id === "monthlyPayment"
      );
      const totalPaymentField = calculatorFormSchema.fields!.find(
        (f) => f.id === "totalPayment"
      );

      expect(monthlyPaymentField?.computed).toBeDefined();
      expect(monthlyPaymentField?.disabled).toBe(true);
      expect(monthlyPaymentField?.computed?.dependencies).toEqual([
        "loanAmount",
        "interestRate",
        "loanTerm",
      ]);

      expect(totalPaymentField?.computed).toBeDefined();
      expect(totalPaymentField?.computed?.dependencies).toEqual([
        "monthlyPayment",
        "loanTerm",
      ]);
      expect(totalPaymentField?.computed?.precision).toBe(2);
    });

    it("should have proper input validation", () => {
      const loanAmountField = calculatorFormSchema.fields!.find(
        (f) => f.id === "loanAmount"
      );
      const interestRateField = calculatorFormSchema.fields!.find(
        (f) => f.id === "interestRate"
      );

      expect(loanAmountField?.validation?.min).toBe(1000);
      expect(loanAmountField?.validation?.max).toBe(1000000);
      expect(interestRateField?.validation?.min).toBe(0);
      expect(interestRateField?.validation?.max).toBe(100);
      expect(interestRateField?.step).toBe(0.1);
    });
  });

  describe("exampleSchemas export", () => {
    it("should export all schemas correctly", () => {
      expect(exampleSchemas.contact).toBe(contactFormSchema);
      expect(exampleSchemas.survey).toBe(surveyFormSchema);
      expect(exampleSchemas.jobApplication).toBe(jobApplicationSchema);
      expect(exampleSchemas.quiz).toBe(quizSchema);
      expect(exampleSchemas.calculator).toBe(calculatorFormSchema);
    });

    it("should have all schemas as valid FormSchema types", () => {
      Object.values(exampleSchemas).forEach((schema) => {
        expect(schema.title).toBeDefined();
        expect(typeof schema.title).toBe("string");
        // Each schema should have either fields or sections
        expect(schema.fields || schema.sections).toBeDefined();
      });
    });
  });

  describe("Schema Validation Completeness", () => {
    it("should have all required fields marked as required", () => {
      const allSchemas = Object.values(exampleSchemas);

      allSchemas.forEach((schema) => {
        const allFields: FieldSchema[] = [];

        if (schema.fields) {
          allFields.push(...schema.fields);
        }

        if (schema.sections) {
          schema.sections.forEach((section) => {
            allFields.push(...section.fields);
          });
        }

        // Check that fields marked as required have proper validation
        allFields.forEach((field) => {
          if (field.validation?.required) {
            expect(field.validation.required).toBe(true);
          }
        });
      });
    });

    it("should have proper field ID uniqueness within each schema", () => {
      const allSchemas = Object.values(exampleSchemas);

      allSchemas.forEach((schema) => {
        const allFieldIds: string[] = [];

        if (schema.fields) {
          allFieldIds.push(...schema.fields.map((f) => f.id));
        }

        if (schema.sections) {
          schema.sections.forEach((section) => {
            allFieldIds.push(...section.fields.map((f) => f.id));
          });
        }

        // Check for duplicate IDs
        const uniqueIds = new Set(allFieldIds);
        expect(uniqueIds.size).toBe(allFieldIds.length);
      });
    });

    it("should have valid field types", () => {
      const validTypes = [
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

      const allSchemas = Object.values(exampleSchemas);

      allSchemas.forEach((schema) => {
        const allFields: FieldSchema[] = [];

        if (schema.fields) {
          allFields.push(...schema.fields);
        }

        if (schema.sections) {
          schema.sections.forEach((section) => {
            allFields.push(...section.fields);
          });
        }

        allFields.forEach((field) => {
          expect(validTypes).toContain(field.type);
        });
      });
    });
  });
});
