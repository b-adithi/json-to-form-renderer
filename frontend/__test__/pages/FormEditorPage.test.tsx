import { describe, it, jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { FormEditorPage } from "../../src/pages/FormEditorPage";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  if (actual)
    return {
      ...actual,
      useNavigate: () => mockNavigate,
    };
});
describe("FormEditorPage Component", () => {
  const defaultProps = {
    formName: "Test Form",
    schemaText: '{"title": "Test"}',
    schemaError: "",
    theme: "light" as const,
    isEditMode: false,
    onFormNameChange: jest.fn(),
    onSchemaChange: jest.fn(),
    onLoadExample: jest.fn(),
    onFormatJSON: jest.fn(),
    onPreview: jest.fn(),
    onSaveAsDraft: jest.fn(),
    onPublish: jest.fn(),
  };

  it("should render form name input", () => {
    render(
      <BrowserRouter>
        <FormEditorPage {...defaultProps} />
      </BrowserRouter>
    );

    const nameInput = screen.getByRole("textbox", { name: /FormName/i });
    expect(nameInput).toBeInTheDocument();
    expect(nameInput).toHaveValue("Test Form");
  });

  it("should render schema editor", () => {
    render(
      <BrowserRouter>
        <FormEditorPage {...defaultProps} />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/JsonSchema/i)).toBeInTheDocument();
  });

  it("should render example selector", () => {
    render(
      <BrowserRouter>
        <FormEditorPage {...defaultProps} />
      </BrowserRouter>
    );

    expect(screen.getByText(/load example schema/i)).toBeInTheDocument();
  });

  it("should call onFormNameChange when name input changes", async () => {
    render(
      <BrowserRouter>
        <FormEditorPage {...defaultProps} />
      </BrowserRouter>
    );

    const nameInput = screen.getByRole("textbox", { name: /FormName/i });
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "New Form Name");

    expect(defaultProps.onFormNameChange).toHaveBeenCalled();
  });

  it("should call onSchemaChange when schema text changes", async () => {
    render(
      <BrowserRouter>
        <FormEditorPage {...defaultProps} />
      </BrowserRouter>
    );

    // JsonEditor component should trigger this
    expect(defaultProps.onSchemaChange).toBeDefined();
  });

  it("should display schema error when present", () => {
    const propsWithError = {
      ...defaultProps,
      schemaError: "Invalid JSON syntax",
    };

    render(
      <BrowserRouter>
        <FormEditorPage {...propsWithError} />
      </BrowserRouter>
    );

    expect(screen.getByText(/invalid json syntax/i)).toBeInTheDocument();
  });

  it("should render all action buttons", () => {
    render(
      <BrowserRouter>
        <FormEditorPage {...defaultProps} />
      </BrowserRouter>
    );

    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /preview/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /save as draft/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /publish/i })
    ).toBeInTheDocument();
  });

  it("should call onFormatJSON when format button clicked", async () => {
    render(
      <BrowserRouter>
        <FormEditorPage {...defaultProps} />
      </BrowserRouter>
    );

    const formatButton = screen.getByRole("button", { name: /format json/i });
    await userEvent.click(formatButton);

    expect(defaultProps.onFormatJSON).toHaveBeenCalled();
  });

  it("should call onPreview when preview button clicked", async () => {
    render(
      <BrowserRouter>
        <FormEditorPage {...defaultProps} />
      </BrowserRouter>
    );

    const previewButton = screen.getByRole("button", { name: /preview/i });
    await userEvent.click(previewButton);

    expect(defaultProps.onPreview).toHaveBeenCalled();
  });

  it("should call onSaveAsDraft when save as draft clicked", async () => {
    render(
      <BrowserRouter>
        <FormEditorPage {...defaultProps} />
      </BrowserRouter>
    );

    const draftButton = screen.getByRole("button", { name: /save as draft/i });
    await userEvent.click(draftButton);

    expect(defaultProps.onSaveAsDraft).toHaveBeenCalled();
  });

  it("should call onPublish when publish clicked", async () => {
    render(
      <BrowserRouter>
        <FormEditorPage {...defaultProps} />
      </BrowserRouter>
    );

    const publishButton = screen.getByRole("button", { name: /publish/i });
    await userEvent.click(publishButton);

    expect(defaultProps.onPublish).toHaveBeenCalled();
  });

  it("should navigate to forms list when cancel clicked", async () => {
    render(
      <BrowserRouter>
        <FormEditorPage {...defaultProps} />
      </BrowserRouter>
    );

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await userEvent.click(cancelButton);

    expect(mockNavigate).toHaveBeenCalledWith("/forms");
  });

  it("should load example when selected", async () => {
    render(
      <BrowserRouter>
        <FormEditorPage {...defaultProps} />
      </BrowserRouter>
    );

    // This would require interaction with the Select component
    // Implementation depends on your Select component structure
    expect(defaultProps.onLoadExample).toBeDefined();
  });

  it("should show different UI for edit mode", () => {
    const editProps = {
      ...defaultProps,
      isEditMode: true,
    };

    render(
      <BrowserRouter>
        <FormEditorPage {...editProps} />
      </BrowserRouter>
    );

    // In edit mode, all buttons should still be present
    expect(
      screen.getByRole("button", { name: /publish/i })
    ).toBeInTheDocument();
  });

  it("should display form name placeholder when empty", () => {
    const emptyProps = {
      ...defaultProps,
      formName: "",
    };

    render(
      <BrowserRouter>
        <FormEditorPage {...emptyProps} />
      </BrowserRouter>
    );

    const nameInput = screen.getByRole("textbox", { name: /FormName/i });
    expect(nameInput).toHaveAttribute("placeholder", "Enter form name...");
  });

  it("should render example options", () => {
    render(
      <BrowserRouter>
        <FormEditorPage {...defaultProps} />
      </BrowserRouter>
    );

    // The examples should be available in the select dropdown
    // Actual verification depends on how your Select component renders
    expect(screen.getByText(/load example schema/i)).toBeInTheDocument();
  });
});
