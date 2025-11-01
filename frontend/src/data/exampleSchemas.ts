import { FormSchema } from "../types/schema";

export const contactFormSchema: FormSchema = {
  title: "Contact Form",
  description: "A simple contact form with validation",
  submitButton: "Send Message",
  fields: [
    {
      id: "fullName",
      type: "text",
      label: "Full Name",
      placeholder: "John Doe",
      validation: {
        required: true,
        minLength: 2,
        maxLength: 50,
        message: "Please enter your full name",
      },
    },
    {
      id: "email",
      type: "email",
      label: "Email Address",
      placeholder: "john@example.com",
      validation: {
        required: true,
        email: true,
      },
    },
    {
      id: "phone",
      type: "tel",
      label: "Phone Number",
      placeholder: "+1 (555) 000-0000",
      validation: {
        pattern: "^\\+?[1-9]\\d{1,14}$",
        message: "Please enter a valid phone number",
      },
    },
    {
      id: "subject",
      type: "select",
      label: "Subject",
      options: [
        { label: "General Inquiry", value: "general" },
        { label: "Technical Support", value: "support" },
        { label: "Sales", value: "sales" },
        { label: "Feedback", value: "feedback" },
      ],
      validation: {
        required: true,
      },
    },
    {
      id: "message",
      type: "textarea",
      label: "Message",
      placeholder: "Tell us how we can help you...",
      validation: {
        required: true,
        minLength: 10,
        maxLength: 500,
      },
    },
  ],
};

export const surveyFormSchema: FormSchema = {
  title: "Customer Satisfaction Survey",
  description: "Help us improve by sharing your feedback",
  submitButton: "Submit Survey",
  enableMarks: false,
  sections: [
    {
      id: "section1",
      title: "Personal Information",
      description: "Tell us about yourself",
      fields: [
        {
          id: "age",
          type: "number",
          label: "Age",
          validation: {
            required: true,
            min: 18,
            max: 120,
          },
        },
        {
          id: "gender",
          type: "radio",
          label: "Gender",
          options: [
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
            { label: "Other", value: "other" },
            { label: "Prefer not to say", value: "none" },
          ],
          validation: {
            required: true,
          },
        },
      ],
    },
    {
      id: "section2",
      title: "Service Rating",
      description: "Rate your experience with our service",
      fields: [
        {
          id: "overallRating",
          type: "rating",
          label: "Overall Satisfaction",
          maxRating: 5,
          validation: {
            required: true,
          },
        },
        {
          id: "recommend",
          type: "range",
          label: "How likely are you to recommend us? (0-10)",
          validation: {
            required: true,
            min: 0,
            max: 10,
          },
          step: 1,
        },
        {
          id: "improvements",
          type: "checkbox",
          label: "What could we improve? (Select all that apply)",
          options: [
            { label: "Customer Service", value: "service" },
            { label: "Product Quality", value: "quality" },
            { label: "Pricing", value: "pricing" },
            { label: "Delivery Speed", value: "delivery" },
            { label: "Website Experience", value: "website" },
          ],
          validation: {
            min: 1,
          },
        },
      ],
    },
  ],
};

export const jobApplicationSchema: FormSchema = {
  title: "Job Application Form",
  description: "Apply for a position at our company",
  submitButton: "Submit Application",
  uniqueField: "email",
  fields: [
    {
      id: "firstName",
      type: "text",
      label: "First Name",
      validation: {
        required: true,
        minLength: 2,
      },
    },
    {
      id: "lastName",
      type: "text",
      label: "Last Name",
      validation: {
        required: true,
        minLength: 2,
      },
    },
    {
      id: "email",
      type: "email",
      label: "Email",
      validation: {
        required: true,
        email: true,
      },
    },
    {
      id: "position",
      type: "select",
      label: "Position Applying For",
      options: [
        { label: "Frontend Developer", value: "frontend" },
        { label: "Backend Developer", value: "backend" },
        { label: "Full Stack Developer", value: "fullstack" },
        { label: "UI/UX Designer", value: "designer" },
        { label: "Product Manager", value: "pm" },
      ],
      validation: {
        required: true,
      },
    },
    {
      id: "experience",
      type: "radio",
      label: "Years of Experience",
      options: [
        { label: "0-2 years", value: "junior" },
        { label: "3-5 years", value: "mid" },
        { label: "6-10 years", value: "senior" },
        { label: "10+ years", value: "expert" },
      ],
      validation: {
        required: true,
      },
    },
    {
      id: "hasPortfolio",
      type: "radio",
      label: "Do you have a portfolio?",
      options: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
      ],
      validation: {
        required: true,
      },
    },
    {
      id: "portfolioUrl",
      type: "url",
      label: "Portfolio URL",
      placeholder: "https://yourportfolio.com",
      conditional: [
        {
          field: "hasPortfolio",
          operator: "equals",
          value: "yes",
          action: "show",
        },
        {
          field: "hasPortfolio",
          operator: "equals",
          value: "yes",
          action: "require",
        },
      ],
      validation: {
        url: true,
      },
    },
    {
      id: "coverLetter",
      type: "textarea",
      label: "Cover Letter",
      placeholder: "Tell us why you're a great fit for this position...",
      validation: {
        required: true,
        minLength: 100,
        maxLength: 1000,
      },
    },
    {
      id: "availableDate",
      type: "date",
      label: "Earliest Start Date",
      validation: {
        required: true,
      },
    },
  ],
};

export const quizSchema: FormSchema = {
  title: "JavaScript Knowledge Quiz",
  description: "Test your JavaScript knowledge with this quick quiz",
  submitButton: "Submit Quiz",
  enableMarks: true,
  answerSequence: "any",
  sections: [
    {
      id: "quiz",
      title: "Quiz Questions",
      fields: [
        {
          id: "q1",
          type: "radio",
          label: "What is the correct way to declare a variable in JavaScript?",
          options: [
            { label: "var x = 5;", value: "a" },
            { label: "variable x = 5;", value: "b" },
            { label: "v x = 5;", value: "c" },
            { label: "x := 5;", value: "d" },
          ],
          validation: {
            required: true,
          },
          enableMarks: true,
          maxMarks: 10,
        },
        {
          id: "q2",
          type: "checkbox",
          label:
            "Which of the following are JavaScript data types? (Select all that apply)",
          options: [
            { label: "String", value: "string" },
            { label: "Number", value: "number" },
            { label: "Boolean", value: "boolean" },
            { label: "Character", value: "character" },
          ],
          validation: {
            required: true,
            min: 1,
          },
          enableMarks: true,
          maxMarks: 10,
        },
        {
          id: "q3",
          type: "textarea",
          label:
            "Explain the difference between 'let' and 'const' in JavaScript",
          placeholder: "Your answer...",
          validation: {
            required: true,
            minLength: 20,
          },
          enableMarks: true,
          maxMarks: 15,
        },
      ],
    },
  ],
};

export const calculatorFormSchema: FormSchema = {
  title: "Loan Calculator",
  description: "Calculate your monthly loan payment",
  submitButton: "Calculate",
  fields: [
    {
      id: "loanAmount",
      type: "number",
      label: "Loan Amount ($)",
      placeholder: "10000",
      validation: {
        required: true,
        min: 1000,
        max: 1000000,
      },
    },
    {
      id: "interestRate",
      type: "number",
      label: "Annual Interest Rate (%)",
      placeholder: "5.5",
      validation: {
        required: true,
        min: 0,
        max: 100,
      },
      step: 0.1,
    },
    {
      id: "loanTerm",
      type: "number",
      label: "Loan Term (years)",
      placeholder: "5",
      validation: {
        required: true,
        min: 1,
        max: 30,
      },
    },
    {
      id: "monthlyPayment",
      type: "number",
      label: "Estimated Monthly Payment ($)",
      disabled: true,
      computed: {
        formula:
          "(loanAmount * (interestRate / 100 / 12) * Math.pow(1 + (interestRate / 100 / 12), loanTerm * 12)) / (Math.pow(1 + (interestRate / 100 / 12), loanTerm * 12) - 1)",
        dependencies: ["loanAmount", "interestRate", "loanTerm"],
        precision: 2,
      },
    },
    {
      id: "totalPayment",
      type: "number",
      label: "Total Payment Over Life of Loan ($)",
      disabled: true,
      computed: {
        formula: "monthlyPayment * loanTerm * 12",
        dependencies: ["monthlyPayment", "loanTerm"],
        precision: 2,
      },
    },
  ],
};

export const eventRegistrationFormSchema: FormSchema = {
  title: "Event Registration with Advanced Features",
  description:
    "Comprehensive example showcasing conditional logic, validation, and computed fields",
  submitButton: "Complete Registration",
  fields: [
    {
      id: "participantName",
      type: "text",
      label: "Full Name",
      placeholder: "John Smith",
      validation: {
        required: true,
        minLength: 3,
        maxLength: 50,
        message: "Name must be between 3 and 50 characters",
      },
    },
    {
      id: "email",
      type: "email",
      label: "Email Address",
      placeholder: "john.smith@example.com",
      validation: {
        required: true,
        email: true,
        pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
        message: "Please enter a valid email address",
      },
    },
    {
      id: "phone",
      type: "tel",
      label: "Phone Number",
      placeholder: "+1-555-123-4567",
      validation: {
        required: true,
        pattern: "^\\+?1?-?\\(?\\d{3}\\)?-?\\d{3}-?\\d{4}$",
        message: "Phone must be in format: +1-555-123-4567 or (555) 123-4567",
      },
    },
    {
      id: "age",
      type: "number",
      label: "Age",
      validation: {
        required: true,
        min: 13,
        max: 100,
        message: "Participants must be between 13 and 100 years old",
      },
    },
    {
      id: "ticketType",
      type: "select",
      label: "Ticket Type",
      options: [
        {
          label: "General Admission - $50",
          value: "general",
        },
        {
          label: "VIP - $150",
          value: "vip",
        },
        {
          label: "Student - $25",
          value: "student",
        },
        {
          label: "Senior (65+) - $30",
          value: "senior",
        },
      ],
      validation: {
        required: true,
        message: "Please select a ticket type",
      },
    },
    {
      id: "studentId",
      type: "text",
      label: "Student ID Number",
      placeholder: "STU-123456",
      conditional: [
        {
          field: "ticketType",
          operator: "equals",
          value: "student",
          action: "show",
        },
        {
          field: "ticketType",
          operator: "equals",
          value: "student",
          action: "require",
        },
      ],
      validation: {
        pattern: "^STU-\\d{6}$",
        message: "Student ID must be in format: STU-123456",
      },
    },
    {
      id: "seniorVerification",
      type: "checkbox",
      label: "Age Verification (Required for Senior tickets)",
      options: [
        {
          label: "I confirm I am 65 years or older",
          value: "confirmed",
        },
      ],
      conditional: [
        {
          field: "ticketType",
          operator: "equals",
          value: "senior",
          action: "show",
        },
        {
          field: "ticketType",
          operator: "equals",
          value: "senior",
          action: "require",
        },
      ],
      validation: {
        min: 1,
        message: "You must confirm your age to purchase a senior ticket",
      },
    },
    {
      id: "numberOfTickets",
      type: "number",
      label: "Number of Tickets",
      validation: {
        required: true,
        min: 1,
        max: 10,
        message: "You can purchase between 1 and 10 tickets",
      },
    },
    {
      id: "dietaryRestrictions",
      type: "checkbox",
      label: "Dietary Restrictions (Select all that apply)",
      options: [
        {
          label: "Vegetarian",
          value: "vegetarian",
        },
        {
          label: "Vegan",
          value: "vegan",
        },
        {
          label: "Gluten-Free",
          value: "gluten_free",
        },
        {
          label: "Nut Allergies",
          value: "nut_allergies",
        },
        {
          label: "Dairy-Free",
          value: "dairy_free",
        },
        {
          label: "None",
          value: "none",
        },
      ],
    },
    {
      id: "specialMealRequest",
      type: "textarea",
      label: "Special Meal Request Details",
      placeholder: "Please describe your specific dietary needs...",
      conditional: [
        {
          field: "dietaryRestrictions",
          operator: "notEmpty",
          action: "show",
        },
      ],
      validation: {
        maxLength: 500,
        message: "Special requests cannot exceed 500 characters",
      },
    },
    {
      id: "accommodationNeeded",
      type: "radio",
      label: "Do you require hotel accommodation?",
      options: [
        {
          label: "Yes",
          value: "yes",
        },
        {
          label: "No",
          value: "no",
        },
      ],
      validation: {
        required: true,
      },
    },
    {
      id: "nights",
      type: "number",
      label: "Number of Nights",
      conditional: [
        {
          field: "accommodationNeeded",
          operator: "equals",
          value: "yes",
          action: "show",
        },
        {
          field: "accommodationNeeded",
          operator: "equals",
          value: "yes",
          action: "require",
        },
      ],
      validation: {
        min: 1,
        max: 7,
        message: "You can book between 1 and 7 nights",
      },
    },
    {
      id: "roomType",
      type: "select",
      label: "Room Type",
      options: [
        {
          label: "Single - $100/night",
          value: "single",
        },
        {
          label: "Double - $150/night",
          value: "double",
        },
        {
          label: "Suite - $250/night",
          value: "suite",
        },
      ],
      conditional: [
        {
          field: "accommodationNeeded",
          operator: "equals",
          value: "yes",
          action: "show",
        },
        {
          field: "accommodationNeeded",
          operator: "equals",
          value: "yes",
          action: "require",
        },
      ],
    },
    {
      id: "ticketPrice",
      type: "number",
      label: "Ticket Price ($)",
      disabled: true,
      computed: {
        formula:
          "\n          (() => {\n            const prices = { general: 50, vip: 150, student: 25, senior: 30 };\n            return prices[ticketType] || 0;\n          })()\n        ",
        dependencies: ["ticketType"],
        precision: 2,
      },
    },
    {
      id: "ticketSubtotal",
      type: "number",
      label: "Tickets Subtotal ($)",
      disabled: true,
      computed: {
        formula: "ticketPrice * numberOfTickets",
        dependencies: ["ticketPrice", "numberOfTickets"],
        precision: 2,
      },
    },
    {
      id: "accommodationCost",
      type: "number",
      label: "Accommodation Cost ($)",
      disabled: true,
      computed: {
        formula:
          "\n          (() => {\n            if (accommodationNeeded !== 'yes') return 0;\n            const roomPrices = { single: 100, double: 150, suite: 250 };\n            const pricePerNight = roomPrices[roomType] || 0;\n            return pricePerNight * (nights || 0);\n          })()\n        ",
        dependencies: ["accommodationNeeded", "roomType", "nights"],
        precision: 2,
      },
    },
    {
      id: "totalCost",
      type: "number",
      label: "Total Cost ($)",
      disabled: true,
      computed: {
        formula: "ticketSubtotal + accommodationCost",
        dependencies: ["ticketSubtotal", "accommodationCost"],
        precision: 2,
      },
    },
    {
      id: "emergencyContact",
      type: "text",
      label: "Emergency Contact Name",
      placeholder: "Jane Smith",
      validation: {
        required: true,
        minLength: 3,
      },
    },
    {
      id: "emergencyPhone",
      type: "tel",
      label: "Emergency Contact Phone",
      placeholder: "+1-555-987-6543",
      validation: {
        required: true,
        pattern: "^\\+?1?-?\\(?\\d{3}\\)?-?\\d{3}-?\\d{4}$",
        message: "Phone must be in format: +1-555-123-4567",
      },
    },
    {
      id: "termsAccepted",
      type: "checkbox",
      label: "Terms and Conditions",
      options: [
        {
          label: "I agree to the event terms and conditions",
          value: "accepted",
        },
      ],
      validation: {
        required: true,
        min: 1,
        message: "You must accept the terms and conditions to register",
      },
    },
  ],
};

export const exampleSchemas = {
  contact: contactFormSchema,
  survey: surveyFormSchema,
  jobApplication: jobApplicationSchema,
  quiz: quizSchema,
  calculator: calculatorFormSchema,
  eventRegistration: eventRegistrationFormSchema,
};
