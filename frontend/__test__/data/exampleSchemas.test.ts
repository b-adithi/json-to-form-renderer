import {
  contactFormSchema,
  surveyFormSchema,
  jobApplicationSchema,
  quizSchema,
  eventRegistrationFormSchema,
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

  describe("eventRegistrationFormSchema", () => {
    it("should have correct basic structure", () => {
      expect(eventRegistrationFormSchema.title).toBe(
        "Event Registration with Advanced Features"
      );
      expect(eventRegistrationFormSchema.description).toBe(
        "Comprehensive example showcasing conditional logic, validation, and computed fields"
      );
      expect(eventRegistrationFormSchema.submitButton).toBe(
        "Complete Registration"
      );
      expect(eventRegistrationFormSchema.fields).toHaveLength(20);
    });

    it("should have all required participant fields", () => {
      const participantFields = ["participantName", "email", "phone", "age"];
      participantFields.forEach((fieldId) => {
        const field = eventRegistrationFormSchema.fields!.find(
          (f) => f.id === fieldId
        );
        expect(field).toBeDefined();
        expect(field?.validation?.required).toBe(true);
      });
    });

    it("should have ticket type selection with proper options", () => {
      const ticketField = eventRegistrationFormSchema.fields!.find(
        (f) => f.id === "ticketType"
      );
      expect(ticketField?.type).toBe("select");
      expect(ticketField?.options).toHaveLength(4);
      expect(ticketField?.options![0]).toEqual({
        label: "General Admission - $50",
        value: "general",
      });
      expect(ticketField?.options![2]).toEqual({
        label: "Student - $25",
        value: "student",
      });
    });

    it("should have conditional logic for student ID field", () => {
      const studentIdField = eventRegistrationFormSchema.fields!.find(
        (f) => f.id === "studentId"
      );
      expect(studentIdField?.conditional).toHaveLength(2);

      const showCondition = studentIdField?.conditional![0];
      expect(showCondition?.field).toBe("ticketType");
      expect(showCondition?.operator).toBe("equals");
      expect(showCondition?.value).toBe("student");
      expect(showCondition?.action).toBe("show");

      const requireCondition = studentIdField?.conditional![1];
      expect(requireCondition?.action).toBe("require");
    });

    it("should have conditional logic for senior verification", () => {
      const seniorField = eventRegistrationFormSchema.fields!.find(
        (f) => f.id === "seniorVerification"
      );
      expect(seniorField?.type).toBe("checkbox");
      expect(seniorField?.conditional).toHaveLength(2);

      const conditions = seniorField?.conditional!;
      expect(conditions[0].field).toBe("ticketType");
      expect(conditions[0].value).toBe("senior");
      expect(conditions[0].action).toBe("show");
      expect(conditions[1].action).toBe("require");
    });

    it("should have proper validation patterns", () => {
      const phoneField = eventRegistrationFormSchema.fields!.find(
        (f) => f.id === "phone"
      );
      expect(phoneField?.validation?.pattern).toBe(
        "^\\+?1?-?\\(?\\d{3}\\)?-?\\d{3}-?\\d{4}$"
      );

      const studentIdField = eventRegistrationFormSchema.fields!.find(
        (f) => f.id === "studentId"
      );
      expect(studentIdField?.validation?.pattern).toBe("^STU-\\d{6}$");
    });

    it("should have accommodation fields with conditional logic", () => {
      const accommodationField = eventRegistrationFormSchema.fields!.find(
        (f) => f.id === "accommodationNeeded"
      );
      expect(accommodationField?.type).toBe("radio");
      expect(accommodationField?.options).toHaveLength(2);

      const nightsField = eventRegistrationFormSchema.fields!.find(
        (f) => f.id === "nights"
      );
      expect(nightsField?.conditional).toHaveLength(2);
      expect(nightsField?.conditional![0].field).toBe("accommodationNeeded");
      expect(nightsField?.conditional![0].value).toBe("yes");

      const roomTypeField = eventRegistrationFormSchema.fields!.find(
        (f) => f.id === "roomType"
      );
      expect(roomTypeField?.options).toHaveLength(3);
      expect(roomTypeField?.options![0]).toEqual({
        label: "Single - $100/night",
        value: "single",
      });
    });

    it("should have computed fields for pricing calculations", () => {
      const ticketPriceField = eventRegistrationFormSchema.fields!.find(
        (f) => f.id === "ticketPrice"
      );
      expect(ticketPriceField?.computed).toBeDefined();
      expect(ticketPriceField?.computed?.dependencies).toContain("ticketType");
      expect(ticketPriceField?.computed?.precision).toBe(2);
      expect(ticketPriceField?.disabled).toBe(true);

      const subtotalField = eventRegistrationFormSchema.fields!.find(
        (f) => f.id === "ticketSubtotal"
      );
      expect(subtotalField?.computed?.dependencies).toEqual([
        "ticketPrice",
        "numberOfTickets",
      ]);
      expect(subtotalField?.computed?.formula).toBe(
        "ticketPrice * numberOfTickets"
      );

      const totalField = eventRegistrationFormSchema.fields!.find(
        (f) => f.id === "totalCost"
      );
      expect(totalField?.computed?.dependencies).toEqual([
        "ticketSubtotal",
        "accommodationCost",
      ]);
      expect(totalField?.computed?.formula).toBe(
        "ticketSubtotal + accommodationCost"
      );
    });

    it("should have dietary restrictions as multi-select checkbox", () => {
      const dietaryField = eventRegistrationFormSchema.fields!.find(
        (f) => f.id === "dietaryRestrictions"
      );
      expect(dietaryField?.type).toBe("checkbox");
      expect(dietaryField?.options).toHaveLength(6);
      expect(dietaryField?.options).toContainEqual({
        label: "Vegetarian",
        value: "vegetarian",
      });
      expect(dietaryField?.options).toContainEqual({
        label: "None",
        value: "none",
      });
    });

    it("should have special meal request with conditional logic", () => {
      const mealRequestField = eventRegistrationFormSchema.fields!.find(
        (f) => f.id === "specialMealRequest"
      );
      expect(mealRequestField?.type).toBe("textarea");
      expect(mealRequestField?.conditional).toHaveLength(1);
      expect(mealRequestField?.conditional![0].field).toBe(
        "dietaryRestrictions"
      );
      expect(mealRequestField?.conditional![0].operator).toBe("notEmpty");
      expect(mealRequestField?.conditional![0].action).toBe("show");
      expect(mealRequestField?.validation?.maxLength).toBe(500);
    });

    it("should have emergency contact fields", () => {
      const emergencyNameField = eventRegistrationFormSchema.fields!.find(
        (f) => f.id === "emergencyContact"
      );
      const emergencyPhoneField = eventRegistrationFormSchema.fields!.find(
        (f) => f.id === "emergencyPhone"
      );

      expect(emergencyNameField?.validation?.required).toBe(true);
      expect(emergencyNameField?.validation?.minLength).toBe(3);

      expect(emergencyPhoneField?.validation?.required).toBe(true);
      expect(emergencyPhoneField?.validation?.pattern).toBe(
        "^\\+?1?-?\\(?\\d{3}\\)?-?\\d{3}-?\\d{4}$"
      );
    });

    it("should have terms acceptance as required checkbox", () => {
      const termsField = eventRegistrationFormSchema.fields!.find(
        (f) => f.id === "termsAccepted"
      );
      expect(termsField?.type).toBe("checkbox");
      expect(termsField?.validation?.required).toBe(true);
      expect(termsField?.validation?.min).toBe(1);
      expect(termsField?.options).toHaveLength(1);
      expect(termsField?.options![0]).toEqual({
        label: "I agree to the event terms and conditions",
        value: "accepted",
      });
    });

    it("should have proper number field constraints", () => {
      const ageField = eventRegistrationFormSchema.fields!.find(
        (f) => f.id === "age"
      );
      expect(ageField?.validation?.min).toBe(13);
      expect(ageField?.validation?.max).toBe(100);

      const ticketsField = eventRegistrationFormSchema.fields!.find(
        (f) => f.id === "numberOfTickets"
      );
      expect(ticketsField?.validation?.min).toBe(1);
      expect(ticketsField?.validation?.max).toBe(10);

      const nightsField = eventRegistrationFormSchema.fields!.find(
        (f) => f.id === "nights"
      );
      expect(nightsField?.validation?.min).toBe(1);
      expect(nightsField?.validation?.max).toBe(7);
    });

    it("should have all computed fields marked as disabled", () => {
      const computedFieldIds = [
        "ticketPrice",
        "ticketSubtotal",
        "accommodationCost",
        "totalCost",
      ];
      computedFieldIds.forEach((fieldId) => {
        const field = eventRegistrationFormSchema.fields!.find(
          (f) => f.id === fieldId
        );
        expect(field?.disabled).toBe(true);
        expect(field?.computed).toBeDefined();
      });
    });

    it("should have complex accommodation cost computation", () => {
      const accommodationCostField = eventRegistrationFormSchema.fields!.find(
        (f) => f.id === "accommodationCost"
      );
      expect(accommodationCostField?.computed?.dependencies).toEqual([
        "accommodationNeeded",
        "roomType",
        "nights",
      ]);
      expect(accommodationCostField?.computed?.formula).toContain(
        "accommodationNeeded !== 'yes'"
      );
      expect(accommodationCostField?.computed?.formula).toContain("roomPrices");
    });
  });

  describe("exampleSchemas export", () => {
    it("should export all schemas correctly", () => {
      expect(exampleSchemas.contact).toBe(contactFormSchema);
      expect(exampleSchemas.survey).toBe(surveyFormSchema);
      expect(exampleSchemas.jobApplication).toBe(jobApplicationSchema);
      expect(exampleSchemas.quiz).toBe(quizSchema);
      expect(exampleSchemas.eventRegistration).toBe(
        eventRegistrationFormSchema
      );
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
