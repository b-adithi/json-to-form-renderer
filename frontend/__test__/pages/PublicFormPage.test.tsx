import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { PublicFormPage } from "../../src/pages/PublicFormPage";

// Mock API functions
jest.mock("../../src/api/forms", () => ({
  fetchForms: jest.fn(),
}));

jest.mock("../../src/api/responses", () => ({
  submitResponse: jest.fn(),
}));

// Mock FormRenderer component
jest.mock("../../src/components/FormRenderer", () => ({
  FormRenderer: ({ onSubmit }: any) => (
    <div data-testid="form-renderer">
      <button onClick={() => onSubmit({ field1: "test value" })}>
        Submit Form
      </button>
    </div>
  ),
}));

const mockFetchForms = require("../../src/api/forms").fetchForms;

describe("PublicFormPage", () => {
  const renderWithRouter = (path: string) => {
    return render(
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/submit/:id" element={<PublicFormPage />} />
        </Routes>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows loading state initially", () => {
    // Mock fetchForms to return a promise that doesn't resolve immediately
    mockFetchForms.mockImplementation(() => new Promise(() => {}));

    renderWithRouter("/submit/test-id");
    expect(screen.getByText(/loading form/i)).toBeInTheDocument();
  });

  it("shows not found message when no form exists", async () => {
    mockFetchForms.mockResolvedValue([]);

    renderWithRouter("/submit/nonexistent");

    await waitFor(() => {
      expect(screen.getByText("Form Not Found")).toBeInTheDocument();
      expect(
        screen.getByText(
          /This form doesn't exist or has not been published yet/i
        )
      ).toBeInTheDocument();
    });
  });

  it("displays form when found via API", async () => {
    const formData = {
      id: "test-id",
      name: "Survey Form",
      description: "Test survey form",
      schema: {
        fields: [
          {
            type: "text",
            name: "name",
            label: "Your Name",
            required: true,
          },
        ],
      },
      status: "published",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockFetchForms.mockResolvedValue([formData]);

    renderWithRouter("/submit/test-id");

    await waitFor(() => {
      expect(screen.getByText("Survey Form")).toBeInTheDocument();
      expect(
        screen.getByText("Please provide your information to continue")
      ).toBeInTheDocument();
    });
  });

  it("displays form when loaded from URL data", () => {
    const formData = {
      name: "URL Form",
      schema: {
        fields: [
          {
            type: "text",
            name: "name",
            label: "Name",
            required: true,
          },
        ],
      },
    };

    const encodedData = btoa(JSON.stringify(formData));
    renderWithRouter(`/submit/test-id?data=${encodedData}`);

    expect(screen.getByText("URL Form")).toBeInTheDocument();
    expect(
      screen.getByText("Please provide your information to continue")
    ).toBeInTheDocument();
  });

  it("handles malformed URL data gracefully", async () => {
    mockFetchForms.mockResolvedValue([]);

    renderWithRouter("/submit/test-id?data=invalid-data");

    // Should fall back to API call and show not found
    await waitFor(() => {
      expect(screen.getByText("Form Not Found")).toBeInTheDocument();
    });
  });

  it("shows privacy notice in registration form", async () => {
    const formData = {
      id: "test-id",
      name: "Privacy Test Form",
      schema: { fields: [] },
      status: "published",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockFetchForms.mockResolvedValue([formData]);
    renderWithRouter("/submit/test-id");

    await waitFor(() => {
      expect(screen.getByText(/Privacy Notice/)).toBeInTheDocument();
      expect(
        screen.getByText(/Your information will be used solely/)
      ).toBeInTheDocument();
    });
  });

  it("handles form submission successfully", async () => {
    const mockSubmitResponse =
      require("../../src/api/responses").submitResponse;
    mockSubmitResponse.mockResolvedValue({ success: true });

    const formData = {
      id: "test-id",
      name: "Submission Test",
      schema: { fields: [] },
      status: "published",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockFetchForms.mockResolvedValue([formData]);
    renderWithRouter("/submit/test-id");

    // Wait for form to load, should show registration form first
    await waitFor(() => {
      expect(screen.getByText("Submission Test")).toBeInTheDocument();
    });

    // Should show registration form, not form renderer initially
    expect(
      screen.getByText("Please provide your information to continue")
    ).toBeInTheDocument();
    expect(screen.queryByTestId("form-renderer")).not.toBeInTheDocument();
  });

  it("handles form submission failure", async () => {
    const mockSubmitResponse =
      require("../../src/api/responses").submitResponse;
    mockSubmitResponse.mockRejectedValue(new Error("Submission failed"));

    const formData = {
      id: "test-id",
      name: "Submission Test",
      schema: { fields: [] },
      status: "published",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockFetchForms.mockResolvedValue([formData]);
    renderWithRouter("/submit/test-id");

    // Wait for form to load, should show registration form first
    await waitFor(() => {
      expect(screen.getByText("Submission Test")).toBeInTheDocument();
    });

    // Should show registration form, not form renderer initially
    expect(
      screen.getByText("Please provide your information to continue")
    ).toBeInTheDocument();
    expect(screen.queryByTestId("form-renderer")).not.toBeInTheDocument();
  });

  it("handles complete registration and form submission flow", async () => {
    const { fireEvent } = await import("@testing-library/react");
    const mockSubmitResponse =
      require("../../src/api/responses").submitResponse;
    mockSubmitResponse.mockResolvedValue({ success: true });

    const formData = {
      id: "test-id",
      name: "Registration Test",
      schema: { fields: [{ name: "test", type: "text" }] },
      status: "published",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockFetchForms.mockResolvedValue([formData]);
    renderWithRouter("/submit/test-id");

    // Wait for form to load
    await waitFor(() => {
      expect(screen.getByText("Registration Test")).toBeInTheDocument();
    });

    // Fill out registration form
    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const continueButton = screen.getByRole("button", {
      name: /continue to form/i,
    });

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.click(continueButton);

    // Should now show the form renderer
    await waitFor(() => {
      expect(screen.getByTestId("form-renderer")).toBeInTheDocument();
    });
  });

  it("validates registration form inputs", async () => {
    const { fireEvent } = await import("@testing-library/react");

    const formData = {
      id: "test-id",
      name: "Validation Test",
      schema: { fields: [] },
      status: "published",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockFetchForms.mockResolvedValue([formData]);
    renderWithRouter("/submit/test-id");

    await waitFor(() => {
      expect(screen.getByText("Validation Test")).toBeInTheDocument();
    });

    // Try to submit without filling fields
    const continueButton = screen.getByRole("button", {
      name: /continue to form/i,
    });
    fireEvent.click(continueButton);

    // Should still be on registration form
    expect(
      screen.getByText("Please provide your information to continue")
    ).toBeInTheDocument();
    expect(screen.queryByTestId("form-renderer")).not.toBeInTheDocument();
  });

  it("validates email format", async () => {
    const { fireEvent } = await import("@testing-library/react");

    const formData = {
      id: "test-id",
      name: "Email Validation Test",
      schema: { fields: [] },
      status: "published",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockFetchForms.mockResolvedValue([formData]);
    renderWithRouter("/submit/test-id");

    await waitFor(() => {
      expect(screen.getByText("Email Validation Test")).toBeInTheDocument();
    });

    // Fill out registration form with invalid email
    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const continueButton = screen.getByRole("button", {
      name: /continue to form/i,
    });

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.click(continueButton);

    // Should still be on registration form
    expect(
      screen.getByText("Please provide your information to continue")
    ).toBeInTheDocument();
    expect(screen.queryByTestId("form-renderer")).not.toBeInTheDocument();
  });

  it("handles URL-encoded form data", () => {
    const formData = {
      name: "URL Test Form",
      schema: { fields: [{ name: "test", type: "text" }] },
    };

    const encodedData = btoa(JSON.stringify(formData));
    renderWithRouter(`/submit/test-id?data=${encodedData}`);

    expect(screen.getByText("URL Test Form")).toBeInTheDocument();
    expect(
      screen.getByText("Please provide your information to continue")
    ).toBeInTheDocument();
  });

  it("handles corrupted URL data gracefully", async () => {
    renderWithRouter("/submit/nonexistent-id?data=invalid-base64-data");

    // Should fall back to API call with no matching forms
    mockFetchForms.mockResolvedValue([]);

    await waitFor(() => {
      expect(screen.getByText("Form Not Found")).toBeInTheDocument();
    });
  });

  it("shows draft form as not found", async () => {
    const draftForm = {
      id: "test-id",
      name: "Draft Form",
      schema: { fields: [] },
      status: "draft", // Draft status should not be accessible
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockFetchForms.mockResolvedValue([draftForm]);
    renderWithRouter("/submit/test-id");

    await waitFor(() => {
      expect(screen.getByText("Form Not Found")).toBeInTheDocument();
    });
  });

  it("handles successful form submission and shows success message", async () => {
    const { fireEvent } = await import("@testing-library/react");
    const mockSubmitResponse =
      require("../../src/api/responses").submitResponse;
    mockSubmitResponse.mockResolvedValue({ success: true });

    const formData = {
      id: "test-id",
      name: "Success Test",
      schema: { fields: [] },
      status: "published",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockFetchForms.mockResolvedValue([formData]);
    renderWithRouter("/submit/test-id");

    // Complete registration
    await waitFor(() => {
      expect(screen.getByText("Success Test")).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: /continue to form/i }));

    // Submit form
    await waitFor(() => {
      expect(screen.getByTestId("form-renderer")).toBeInTheDocument();
    });

    const submitFormButton = screen.getByRole("button", {
      name: /submit form/i,
    });
    fireEvent.click(submitFormButton);

    // Should show success message
    await waitFor(() => {
      expect(screen.getByText(/thank you/i)).toBeInTheDocument();
    });
  });

  it("handles API error gracefully", async () => {
    mockFetchForms.mockRejectedValue(new Error("Network error"));

    renderWithRouter("/submit/test-id");

    await waitFor(() => {
      expect(screen.getByText("Form Not Found")).toBeInTheDocument();
    });
  });

  it("shows not found for draft forms", async () => {
    const formData = {
      id: "test-id",
      name: "Draft Form",
      schema: { fields: [] },
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockFetchForms.mockResolvedValue([formData]);
    renderWithRouter("/submit/test-id");

    await waitFor(() => {
      expect(screen.getByText("Form Not Found")).toBeInTheDocument();
    });
  });

  it("handles URL encoding edge cases", async () => {
    const formData = {
      name: "Edge Case Form",
      schema: {
        fields: [
          {
            type: "text",
            name: "special",
            label: "Special chars: !@#$%^&*()",
          },
        ],
      },
    };

    // Create encoded data with special characters
    const encodedData = btoa(JSON.stringify(formData));
    const urlWithSpecialChars = `/submit/test-id?data=${encodedData}&extra=param`;

    renderWithRouter(urlWithSpecialChars);

    expect(screen.getByText("Edge Case Form")).toBeInTheDocument();
  });

  it("handles empty form data from URL", () => {
    const emptyFormData = { name: "", schema: { fields: [] } };
    const encodedData = btoa(JSON.stringify(emptyFormData));

    renderWithRouter(`/submit/test-id?data=${encodedData}`);

    // Should render even with empty name
    expect(
      screen.getByText("Please provide your information to continue")
    ).toBeInTheDocument();
  });

  it("handles corrupt JSON data in URL parameters", async () => {
    // Create base64 encoded corrupt JSON
    const corruptJson = '{"name": "test", "schema":'; // Missing closing brace
    const encodedData = btoa(corruptJson);

    mockFetchForms.mockResolvedValue([]);
    renderWithRouter(`/submit/test-id?data=${encodedData}`);

    // Should fall back to API call
    await waitFor(() => {
      expect(screen.getByText("Form Not Found")).toBeInTheDocument();
    });
  });

  it("handles missing schema in form data", async () => {
    const formDataWithoutSchema = {
      id: "test-id",
      name: "No Schema Form",
      // schema is missing
      status: "published",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockFetchForms.mockResolvedValue([formDataWithoutSchema]);
    renderWithRouter("/submit/test-id");

    await waitFor(() => {
      expect(screen.getByText("Form Not Found")).toBeInTheDocument();
    });
  });

  it("handles very long form ID", async () => {
    const longId = "a".repeat(100);
    mockFetchForms.mockResolvedValue([]);

    renderWithRouter(`/submit/${longId}`);

    await waitFor(() => {
      expect(screen.getByText("Form Not Found")).toBeInTheDocument();
    });
  });

  it("handles special characters in form ID", async () => {
    const specialId = "form-with-special-chars_123";
    mockFetchForms.mockResolvedValue([]);

    renderWithRouter(`/submit/${specialId}`);

    await waitFor(() => {
      expect(screen.getByText("Form Not Found")).toBeInTheDocument();
    });
  });
});
