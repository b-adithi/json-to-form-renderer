import { FormSchema } from '../types/schema';

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
        message: "Please enter your full name"
      }
    },
    {
      id: "email",
      type: "email",
      label: "Email Address",
      placeholder: "john@example.com",
      validation: {
        required: true,
        email: true
      }
    },
    {
      id: "phone",
      type: "tel",
      label: "Phone Number",
      placeholder: "+1 (555) 000-0000",
      validation: {
        pattern: "^\\+?[1-9]\\d{1,14}$",
        message: "Please enter a valid phone number"
      }
    },
    {
      id: "subject",
      type: "select",
      label: "Subject",
      options: [
        { label: "General Inquiry", value: "general" },
        { label: "Technical Support", value: "support" },
        { label: "Sales", value: "sales" },
        { label: "Feedback", value: "feedback" }
      ],
      validation: {
        required: true
      }
    },
    {
      id: "message",
      type: "textarea",
      label: "Message",
      placeholder: "Tell us how we can help you...",
      validation: {
        required: true,
        minLength: 10,
        maxLength: 500
      }
    }
  ]
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
            max: 120
          }
        },
        {
          id: "gender",
          type: "radio",
          label: "Gender",
          options: [
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
            { label: "Other", value: "other" },
            { label: "Prefer not to say", value: "none" }
          ],
          validation: {
            required: true
          }
        }
      ]
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
            required: true
          }
        },
        {
          id: "recommend",
          type: "range",
          label: "How likely are you to recommend us? (0-10)",
          validation: {
            required: true,
            min: 0,
            max: 10
          },
          step: 1
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
            { label: "Website Experience", value: "website" }
          ],
          validation: {
            min: 1
          }
        }
      ]
    }
  ]
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
        minLength: 2
      }
    },
    {
      id: "lastName",
      type: "text",
      label: "Last Name",
      validation: {
        required: true,
        minLength: 2
      }
    },
    {
      id: "email",
      type: "email",
      label: "Email",
      validation: {
        required: true,
        email: true
      }
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
        { label: "Product Manager", value: "pm" }
      ],
      validation: {
        required: true
      }
    },
    {
      id: "experience",
      type: "radio",
      label: "Years of Experience",
      options: [
        { label: "0-2 years", value: "junior" },
        { label: "3-5 years", value: "mid" },
        { label: "6-10 years", value: "senior" },
        { label: "10+ years", value: "expert" }
      ],
      validation: {
        required: true
      }
    },
    {
      id: "hasPortfolio",
      type: "radio",
      label: "Do you have a portfolio?",
      options: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" }
      ],
      validation: {
        required: true
      }
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
          action: "show"
        },
        {
          field: "hasPortfolio",
          operator: "equals",
          value: "yes",
          action: "require"
        }
      ],
      validation: {
        url: true
      }
    },
    {
      id: "coverLetter",
      type: "textarea",
      label: "Cover Letter",
      placeholder: "Tell us why you're a great fit for this position...",
      validation: {
        required: true,
        minLength: 100,
        maxLength: 1000
      }
    },
    {
      id: "availableDate",
      type: "date",
      label: "Earliest Start Date",
      validation: {
        required: true
      }
    }
  ]
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
            { label: "x := 5;", value: "d" }
          ],
          validation: {
            required: true
          },
          enableMarks: true,
          maxMarks: 10
        },
        {
          id: "q2",
          type: "checkbox",
          label: "Which of the following are JavaScript data types? (Select all that apply)",
          options: [
            { label: "String", value: "string" },
            { label: "Number", value: "number" },
            { label: "Boolean", value: "boolean" },
            { label: "Character", value: "character" }
          ],
          validation: {
            required: true,
            min: 1
          },
          enableMarks: true,
          maxMarks: 10
        },
        {
          id: "q3",
          type: "textarea",
          label: "Explain the difference between 'let' and 'const' in JavaScript",
          placeholder: "Your answer...",
          validation: {
            required: true,
            minLength: 20
          },
          enableMarks: true,
          maxMarks: 15
        }
      ]
    }
  ]
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
        max: 1000000
      }
    },
    {
      id: "interestRate",
      type: "number",
      label: "Annual Interest Rate (%)",
      placeholder: "5.5",
      validation: {
        required: true,
        min: 0,
        max: 100
      },
      step: 0.1
    },
    {
      id: "loanTerm",
      type: "number",
      label: "Loan Term (years)",
      placeholder: "5",
      validation: {
        required: true,
        min: 1,
        max: 30
      }
    },
    {
      id: "monthlyPayment",
      type: "number",
      label: "Estimated Monthly Payment ($)",
      disabled: true,
      computed: {
        formula: "(loanAmount * (interestRate / 100 / 12) * Math.pow(1 + (interestRate / 100 / 12), loanTerm * 12)) / (Math.pow(1 + (interestRate / 100 / 12), loanTerm * 12) - 1)",
        dependencies: ["loanAmount", "interestRate", "loanTerm"],
        precision: 2
      }
    },
    {
      id: "totalPayment",
      type: "number",
      label: "Total Payment Over Life of Loan ($)",
      disabled: true,
      computed: {
        formula: "monthlyPayment * loanTerm * 12",
        dependencies: ["monthlyPayment", "loanTerm"],
        precision: 2
      }
    }
  ]
};

export const exampleSchemas = {
  contact: contactFormSchema,
  survey: surveyFormSchema,
  jobApplication: jobApplicationSchema,
  quiz: quizSchema,
  calculator: calculatorFormSchema
};
