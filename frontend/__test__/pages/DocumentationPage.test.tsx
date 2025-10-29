import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DocumentationPage } from "../../src/pages/DocumentationPage";

// Mock sonner toast
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock clipboard utility
jest.mock("../../src/utils/clipboard", () => ({
  copyToClipboard: jest.fn(),
}));

const mockCopyToClipboard = require("../../src/utils/clipboard").copyToClipboard;
const mockToast = require("sonner").toast;

describe("DocumentationPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders documentation title and description", () => {
    render(<DocumentationPage />);
    
    expect(screen.getByText("Documentation")).toBeInTheDocument();
    expect(screen.getByText(/learn how to create your own form schemas/i)).toBeInTheDocument();
  });

  // Basic Section Tests
  it("displays smart autocomplete section", () => {
    render(<DocumentationPage />);
    
    expect(screen.getByText("Smart Autocomplete - The Easy Way!")).toBeInTheDocument();
    expect(screen.getByText(/no need to write json from scratch/i)).toBeInTheDocument();
  });

  it("shows autocomplete field types", () => {
    render(<DocumentationPage />);
    
    // Check for field type examples
    expect(screen.getByText("text")).toBeInTheDocument();
    expect(screen.getByText("email")).toBeInTheDocument();
    expect(screen.getByText("textarea")).toBeInTheDocument();
    expect(screen.getByText("select")).toBeInTheDocument();
    expect(screen.getByText("checkbox")).toBeInTheDocument();
  });

  it("displays autocomplete step instructions", () => {
    render(<DocumentationPage />);
    
    expect(screen.getByText("STEP 1")).toBeInTheDocument();
    expect(screen.getByText("STEP 2")).toBeInTheDocument();  
    expect(screen.getByText("STEP 3")).toBeInTheDocument();
    expect(screen.getByText("Type a field name in the editor")).toBeInTheDocument();
    expect(screen.getByText("Press Enter or Tab")).toBeInTheDocument();
    expect(screen.getByText("Customize the placeholders")).toBeInTheDocument();
  });

  it("shows magic feature information", () => {
    render(<DocumentationPage />);
    
    expect(screen.getByText(/Magic Feature/)).toBeInTheDocument();
    expect(screen.getByText(/automatically wrap your field in a complete form/i)).toBeInTheDocument();
  });

  it("displays all autocomplete field type descriptions", () => {
    render(<DocumentationPage />);
    
    // Check detailed field descriptions using getAllByText for duplicates
    expect(screen.getAllByText("text-field")[0]).toBeInTheDocument();
    expect(screen.getAllByText("email-field")[0]).toBeInTheDocument();
    expect(screen.getAllByText("password-field")[0]).toBeInTheDocument();
    expect(screen.getAllByText("number-field")[0]).toBeInTheDocument();
    expect(screen.getAllByText("tel-field")[0]).toBeInTheDocument();
    expect(screen.getAllByText("url-field")[0]).toBeInTheDocument();
    expect(screen.getAllByText("date-field")[0]).toBeInTheDocument();
    expect(screen.getAllByText("textarea-field")[0]).toBeInTheDocument();
    expect(screen.getAllByText("select-field")[0]).toBeInTheDocument();
    expect(screen.getAllByText("radio-field")[0]).toBeInTheDocument();
    expect(screen.getAllByText("checkbox-field")[0]).toBeInTheDocument();
    expect(screen.getAllByText("file-field")[0]).toBeInTheDocument();
    expect(screen.getAllByText("rating-field")[0]).toBeInTheDocument();
  });

  it("displays basic schema structure section", () => {
    render(<DocumentationPage />);
    
    expect(screen.getByText("Basic Schema Structure")).toBeInTheDocument();
    expect(screen.getByText(/every form starts with a json schema/i)).toBeInTheDocument();
  });

  it("shows supported field types section", () => {
    render(<DocumentationPage />);
    
    expect(screen.getByText("Supported Field Types")).toBeInTheDocument();
    expect(screen.getByText(/choose from a variety of field types/i)).toBeInTheDocument();
    
    // Check for various field type options in the grid
    expect(screen.getByText("text")).toBeInTheDocument();
    expect(screen.getByText("email")).toBeInTheDocument();
    expect(screen.getByText("textarea")).toBeInTheDocument();
    expect(screen.getByText("select")).toBeInTheDocument();
    expect(screen.getByText("checkbox")).toBeInTheDocument();
    expect(screen.getByText("radio")).toBeInTheDocument();
    expect(screen.getByText("multiselect")).toBeInTheDocument();
    expect(screen.getByText("date")).toBeInTheDocument();
    expect(screen.getByText("time")).toBeInTheDocument();
    expect(screen.getByText("datetime")).toBeInTheDocument();
    expect(screen.getByText("file")).toBeInTheDocument();
    expect(screen.getByText("rating")).toBeInTheDocument();
    expect(screen.getByText("range")).toBeInTheDocument();
    expect(screen.getByText("matrix")).toBeInTheDocument();
  });

  it("displays validation documentation", () => {
    render(<DocumentationPage />);
    
    expect(screen.getByText("Validation Rules")).toBeInTheDocument();
    expect(screen.getByText(/add validation to ensure data quality/i)).toBeInTheDocument();
  });

  it("shows conditional logic documentation", () => {
    render(<DocumentationPage />);
    
    expect(screen.getByText("Conditional Logic")).toBeInTheDocument();
    expect(screen.getByText(/show or hide fields based on user input/i)).toBeInTheDocument();
  });

  it("displays conditional logic operators", () => {
    render(<DocumentationPage />);
    
    expect(screen.getByText("Available operators:")).toBeInTheDocument();
    expect(screen.getByText("equals")).toBeInTheDocument();
    expect(screen.getByText("notEquals")).toBeInTheDocument();
    expect(screen.getByText("contains")).toBeInTheDocument();
    expect(screen.getByText("greaterThan")).toBeInTheDocument();
    expect(screen.getByText("lessThan")).toBeInTheDocument();
  });

  it("shows computed fields documentation", () => {
    render(<DocumentationPage />);
    
    expect(screen.getByText("Computed Fields")).toBeInTheDocument();
    expect(screen.getByText(/create calculated fields that automatically update/i)).toBeInTheDocument();
    expect(screen.getByText(/Perfect for calculators, pricing forms/i)).toBeInTheDocument();
  });

  it("displays complete example section", () => {
    render(<DocumentationPage />);
    
    expect(screen.getByText("Complete Example")).toBeInTheDocument();
    expect(screen.getByText(/a full form schema with multiple field types/i)).toBeInTheDocument();
    expect(screen.getByText(/Event Registration/)).toBeInTheDocument();
  });

  // Copy Functionality Tests
  it("handles basic schema copy to clipboard successfully", async () => {
    mockCopyToClipboard.mockResolvedValue(true);
    
    render(<DocumentationPage />);
    
    const copyButtons = screen.getAllByRole("button", { name: /copy/i });
    const basicSchemaCopyButton = copyButtons[0]; // First copy button should be basic schema
    
    fireEvent.click(basicSchemaCopyButton);
    
    await waitFor(() => {
      expect(mockCopyToClipboard).toHaveBeenCalledWith(expect.stringContaining('"title": "My Form"'));
      expect(mockToast.success).toHaveBeenCalledWith("Code copied to clipboard!");
    });
  });

  it("handles validation schema copy to clipboard successfully", async () => {
    mockCopyToClipboard.mockResolvedValue(true);
    
    render(<DocumentationPage />);
    
    const copyButtons = screen.getAllByRole("button", { name: /copy/i });
    const validationCopyButton = copyButtons[1]; // Second copy button should be validation
    
    fireEvent.click(validationCopyButton);
    
    await waitFor(() => {
      expect(mockCopyToClipboard).toHaveBeenCalledWith(expect.stringContaining('"validation"'));
      expect(mockToast.success).toHaveBeenCalledWith("Code copied to clipboard!");
    });
  });

  it("handles conditional logic copy to clipboard successfully", async () => {
    mockCopyToClipboard.mockResolvedValue(true);
    
    render(<DocumentationPage />);
    
    const copyButtons = screen.getAllByRole("button", { name: /copy/i });
    const conditionalCopyButton = copyButtons[2]; // Third copy button should be conditional
    
    fireEvent.click(conditionalCopyButton);
    
    await waitFor(() => {
      expect(mockCopyToClipboard).toHaveBeenCalledWith(expect.stringContaining('"conditional"'));
      expect(mockToast.success).toHaveBeenCalledWith("Code copied to clipboard!");
    });
  });

  it("handles computed fields copy to clipboard successfully", async () => {
    mockCopyToClipboard.mockResolvedValue(true);
    
    render(<DocumentationPage />);
    
    const copyButtons = screen.getAllByRole("button", { name: /copy/i });
    const computedCopyButton = copyButtons[3]; // Fourth copy button should be computed
    
    fireEvent.click(computedCopyButton);
    
    await waitFor(() => {
      expect(mockCopyToClipboard).toHaveBeenCalledWith(expect.stringContaining('"computed"'));
      expect(mockToast.success).toHaveBeenCalledWith("Code copied to clipboard!");
    });
  });

  it("handles complete example copy to clipboard successfully", async () => {
    mockCopyToClipboard.mockResolvedValue(true);
    
    render(<DocumentationPage />);
    
    const copyButtons = screen.getAllByRole("button", { name: /copy/i });
    const completeCopyButton = copyButtons[4]; // Fifth copy button should be complete example
    
    fireEvent.click(completeCopyButton);
    
    await waitFor(() => {
      expect(mockCopyToClipboard).toHaveBeenCalledWith(expect.stringContaining('Event Registration'));
      expect(mockToast.success).toHaveBeenCalledWith("Code copied to clipboard!");
    });
  });

  it("handles copy to clipboard failures gracefully", async () => {
    mockCopyToClipboard.mockResolvedValue(false);
    
    render(<DocumentationPage />);
    
    const copyButtons = screen.getAllByRole("button", { name: /copy/i });
    
    fireEvent.click(copyButtons[0]);
    
    await waitFor(() => {
      expect(mockCopyToClipboard).toHaveBeenCalled();
      expect(mockToast.error).toHaveBeenCalledWith("Failed to copy code");
    });
  });

  it("tests all copy buttons for error handling", async () => {
    mockCopyToClipboard.mockResolvedValue(false);
    
    render(<DocumentationPage />);
    
    const copyButtons = screen.getAllByRole("button", { name: /copy/i });
    
    // Test each copy button handles errors
    for (const button of copyButtons) {
      fireEvent.click(button);
    }
    
    await waitFor(() => {
      expect(mockCopyToClipboard).toHaveBeenCalledTimes(copyButtons.length);
      expect(mockToast.error).toHaveBeenCalledTimes(copyButtons.length);
    });
  });

  // Content Structure Tests
  it("displays all required JSON schema properties", () => {
    render(<DocumentationPage />);
    
    // Check for common JSON schema properties in code examples (using getAllByText for multiple occurrences)
    expect(screen.getAllByText(/"title":/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/"fields":/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/"id":/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/"type":/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/"label":/)[0]).toBeInTheDocument();
  });

  it("shows all validation properties", () => {
    render(<DocumentationPage />);
    
    // Check for validation properties (using getAllByText for multiple occurrences)
    expect(screen.getAllByText(/"required": true/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/"minLength"/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/"maxLength"/)[0]).toBeInTheDocument();
    expect(screen.getByText(/"pattern"/)).toBeInTheDocument();
  });

  it("displays conditional logic properties", () => {
    render(<DocumentationPage />);
    
    // Check for conditional properties in code examples (using getAllByText for multiple occurrences)
    expect(screen.getAllByText(/"conditional"/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/"field":/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/"operator":/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/"value":/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/"action":/)[0]).toBeInTheDocument();
  });

  it("shows computed field properties", () => {
    render(<DocumentationPage />);
    
    expect(screen.getByText(/"formula":/)).toBeInTheDocument();
    expect(screen.getByText(/"dependencies":/)).toBeInTheDocument();
    expect(screen.getByText(/"precision":/)).toBeInTheDocument();
  });

  it("displays complete form structure in example", () => {
    render(<DocumentationPage />);
    
    // Check event registration form properties
    expect(screen.getByText(/Register for our upcoming event/)).toBeInTheDocument();
    expect(screen.getByText(/"attendanceType"/)).toBeInTheDocument();
    expect(screen.getByText(/"dietaryRestrictions"/)).toBeInTheDocument();
  });

  // Layout and UI Tests
  it("displays proper container structure", () => {
    render(<DocumentationPage />);
    
    // Check for proper container structure
    const container = document.querySelector(".space-y-6");
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass("max-w-5xl");
  });

  it("shows proper code block formatting", () => {
    render(<DocumentationPage />);
    
    // Check that code blocks have proper styling classes
    const codeBlocks = document.querySelectorAll("pre");
    expect(codeBlocks.length).toBeGreaterThan(0);
    
    codeBlocks.forEach(block => {
      expect(block).toHaveClass("bg-slate-900");
    });
  });

  it("displays copy buttons with proper styling and hover states", () => {
    render(<DocumentationPage />);
    
    const copyButtons = screen.getAllByRole("button", { name: /copy/i });
    expect(copyButtons.length).toBeGreaterThan(0);
    
    copyButtons.forEach(button => {
      expect(button).toHaveClass("opacity-0");
      expect(button).toHaveClass("group-hover:opacity-100");
    });
  });

  it("shows grid layout for field types", () => {
    render(<DocumentationPage />);
    
    const gridElements = document.querySelectorAll(".grid");
    expect(gridElements.length).toBeGreaterThan(0);
    
    // Check for responsive grid classes
    const fieldTypeGrid = document.querySelector(".grid-cols-2");
    expect(fieldTypeGrid).toBeInTheDocument();
  });

  it("displays proper card styling for sections", () => {
    render(<DocumentationPage />);
    
    // Check for card components with proper styling
    const cards = document.querySelectorAll('[class*="border"]');
    expect(cards.length).toBeGreaterThan(5); // Multiple cards in the page
  });

  it("shows icons for each section", () => {
    render(<DocumentationPage />);
    
    // Check for icon containers
    const iconContainers = document.querySelectorAll('.w-8.h-8');
    expect(iconContainers.length).toBeGreaterThan(0);
  });

  it("displays helpful tips with proper styling", () => {
    render(<DocumentationPage />);
    
    expect(screen.getByText(/Quick Tip/)).toBeInTheDocument();
    expect(screen.getByText(/Magic Feature/)).toBeInTheDocument();
    expect(screen.getByText(/Use case/)).toBeInTheDocument();
  });

  it("shows navigation sections structure", () => {
    render(<DocumentationPage />);
    
    // Check for section headers that can be used for navigation
    const headings = screen.getAllByRole("heading");
    expect(headings.length).toBeGreaterThan(5);
  });

  // Edge Cases and Error Handling
  it("handles rapid multiple copy button clicks", async () => {
    mockCopyToClipboard.mockResolvedValue(true);
    
    render(<DocumentationPage />);
    
    const copyButtons = screen.getAllByRole("button", { name: /copy/i });
    const firstButton = copyButtons[0];
    
    // Rapidly click the same button multiple times
    fireEvent.click(firstButton);
    fireEvent.click(firstButton);
    fireEvent.click(firstButton);
    
    await waitFor(() => {
      expect(mockCopyToClipboard).toHaveBeenCalledTimes(3);
    });
  });

  it("maintains proper structure with all content sections", () => {
    render(<DocumentationPage />);
    
    // Verify all major sections are present
    expect(screen.getByText("Smart Autocomplete - The Easy Way!")).toBeInTheDocument();
    expect(screen.getByText("Basic Schema Structure")).toBeInTheDocument();
    expect(screen.getByText("Supported Field Types")).toBeInTheDocument();
    expect(screen.getByText("Validation Rules")).toBeInTheDocument();
    expect(screen.getByText("Conditional Logic")).toBeInTheDocument();
    expect(screen.getByText("Computed Fields")).toBeInTheDocument();
    expect(screen.getByText("Complete Example")).toBeInTheDocument();
  });

  it("displays proper accessibility structure", () => {
    render(<DocumentationPage />);
    
    // Check for proper heading hierarchy
    const h2Elements = document.querySelectorAll('h2');
    expect(h2Elements.length).toBeGreaterThan(0);
    
    // Check for proper button labels
    const copyButtons = screen.getAllByRole("button", { name: /copy/i });
    copyButtons.forEach(button => {
      expect(button).toHaveAccessibleName();
    });
  });
});
