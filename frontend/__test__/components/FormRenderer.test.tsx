import { describe, it, jest } from "@jest/globals";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormRenderer } from "../../src/components/FormRenderer";

describe("FormRenderer Component", () => {
  const basicSchema = {
    title: "Test Form",
    description: "A test form",
    fields: [
      {
        id: "name",
        type: "text" as const,
        label: "Name",
        validation: { required: true },
      },
      {
        id: "email",
        type: "email" as const,
        label: "Email",
        validation: { required: true },
      },
    ],
  };

  it("should render form with title and description", () => {
    const mockOnSubmit = jest.fn();
    render(<FormRenderer schema={basicSchema} onSubmit={mockOnSubmit} />);

    expect(screen.getByText("Test Form")).toBeInTheDocument();
    expect(screen.getByText("A test form")).toBeInTheDocument();
  });

  it("should render all form fields", () => {
    const mockOnSubmit = jest.fn();
    render(<FormRenderer schema={basicSchema} onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it("should show validation errors for required fields", async () => {
    const mockOnSubmit = jest.fn();
    render(<FormRenderer schema={basicSchema} onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole("button", { name: /submit/i });
    await userEvent.click(submitButton);

    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("should submit form with valid data", async () => {
    const mockOnSubmit = jest.fn();
    render(<FormRenderer schema={basicSchema} onSubmit={mockOnSubmit} />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole("button", { name: /submit/i });

    await userEvent.type(nameInput, "John Doe");
    await userEvent.type(emailInput, "john@example.com");
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            name: "John Doe",
            email: "john@example.com",
          }),
        })
      );
    });
  });

  it("should handle sections", () => {
    const schemaWithSections = {
      title: "Sectioned Form",
      sections: [
        {
          id: "personal",
          title: "Personal Information",
          fields: [{ id: "name", type: "text" as const, label: "Name" }],
        },
        {
          id: "contact",
          title: "Contact Information",
          fields: [{ id: "email", type: "email" as const, label: "Email" }],
        },
      ],
    };

    const mockOnSubmit = jest.fn();
    render(
      <FormRenderer schema={schemaWithSections} onSubmit={mockOnSubmit} />
    );

    expect(screen.getByText("Personal Information")).toBeInTheDocument();
    expect(screen.getByText("Contact Information")).toBeInTheDocument();
  });

  it("should handle conditional fields", async () => {
    const schemaWithConditional = {
      title: "Conditional Form",
      fields: [
        {
          id: "hasDetails",
          type: "radio" as const,
          label: "Include Details?",
          options: [
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ],
        },
        {
          id: "details",
          type: "textarea" as const,
          label: "Details",
          conditional: [
            {
              field: "hasDetails",
              operator: "equals" as const,
              value: "yes",
              action: "show" as const,
            },
          ],
        },
      ],
    };

    const mockOnSubmit = jest.fn();
    render(
      <FormRenderer schema={schemaWithConditional} onSubmit={mockOnSubmit} />
    );

    // Details field should not be visible initially
    expect(screen.queryByLabelText("Details")).not.toBeInTheDocument();

    // Select "Yes"
    const yesOption = screen.getByLabelText("Yes");
    await userEvent.click(yesOption);

    // Details field should now be visible
    expect(screen.getByLabelText("Details")).toBeInTheDocument();
  });

  it("should handle computed fields", async () => {
    const schemaWithComputed = {
      title: "Calculator Form",
      fields: [
        {
          id: "price",
          type: "number" as const,
          label: "Price",
        },
        {
          id: "quantity",
          type: "number" as const,
          label: "Quantity",
        },
        {
          id: "total",
          type: "number" as const,
          label: "Total",
          computed: {
            formula: "price * quantity",
            dependencies: ["price", "quantity"],
            precision: 2,
          },
        },
      ],
    };

    const mockOnSubmit = jest.fn();
    render(
      <FormRenderer schema={schemaWithComputed} onSubmit={mockOnSubmit} />
    );

    const priceInput = screen.getByLabelText("Price");
    const quantityInput = screen.getByLabelText("Quantity");
    const totalInput = screen.getByLabelText("Total");

    await userEvent.type(priceInput, "10");
    await userEvent.type(quantityInput, "5");

    await waitFor(() => {
      expect(totalInput).toHaveValue(50);
    });
  });

  it("should handle quiz mode with scoring", async () => {
    const quizSchema = {
      title: "Quiz",
      enableMarks: true,
      fields: [
        {
          id: "q1",
          type: "radio" as const,
          label: "What is 2+2?",
          options: [
            { label: "3", value: "3" },
            { label: "4", value: "4" },
            { label: "5", value: "5" },
          ],
          enableMarks: true,
          maxMarks: 10,
        },
      ],
    };

    const mockOnSubmit = jest.fn();
    render(<FormRenderer schema={quizSchema} onSubmit={mockOnSubmit} />);

    const answer = screen.getByLabelText("4");
    await userEvent.click(answer);

    const submitButton = screen.getByRole("button", { name: /submit/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          totalMarks: expect.any(Number),
          maxMarks: expect.any(Number),
        })
      );
    });
  });

  it("should handle file upload fields", async () => {
    const schemaWithFile = {
      title: "Upload Form",
      fields: [
        {
          id: "document",
          type: "file" as const,
          label: "Upload Document",
          accept: ".pdf,.doc,.docx",
        },
      ],
    };

    const mockOnSubmit = jest.fn();
    render(<FormRenderer schema={schemaWithFile} onSubmit={mockOnSubmit} />);

    const fileInput = screen.getByLabelText(/upload document/i);
    expect(fileInput).toHaveAttribute("accept", ".pdf,.doc,.docx");
  });

  it("should handle default values", () => {
    const schemaWithDefaults = {
      title: "Form with Defaults",
      fields: [
        {
          id: "name",
          type: "text" as const,
          label: "Name",
          defaultValue: "John Doe",
        },
        {
          id: "country",
          type: "select" as const,
          label: "Country",
          options: [
            { label: "USA", value: "us" },
            { label: "Canada", value: "ca" },
          ],
          defaultValue: "us",
        },
      ],
    };

    const mockOnSubmit = jest.fn();
    render(
      <FormRenderer schema={schemaWithDefaults} onSubmit={mockOnSubmit} />
    );

    const nameInput = screen.getByLabelText("Name") as HTMLInputElement;
    expect(nameInput.value).toBe("John Doe");
  });

  it("should handle custom submit button text", () => {
    const schemaWithCustomButton = {
      ...basicSchema,
      submitButton: "Send Form",
    };

    const mockOnSubmit = jest.fn();
    render(
      <FormRenderer schema={schemaWithCustomButton} onSubmit={mockOnSubmit} />
    );

    expect(
      screen.getByRole("button", { name: "Send Form" })
    ).toBeInTheDocument();
  });
});
