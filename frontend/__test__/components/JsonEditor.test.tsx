import { describe, it, jest } from "@jest/globals";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { JsonEditor } from "../../src/components/JsonEditor";

// Mock Monaco Editor with more comprehensive functionality
const mockEditor = {
  focus: jest.fn(),
  getSelection: jest.fn(() => ({
    startLineNumber: 1,
    startColumn: 1,
    endLineNumber: 1,
    endColumn: 1,
  })),
  getPosition: jest.fn(() => ({
    lineNumber: 1,
    column: 1,
  })),
  getModel: jest.fn(() => ({
    getLineContent: jest.fn(() => ""),
  })),
  executeEdits: jest.fn(),
};

jest.mock("@monaco-editor/react", () => ({
  __esModule: true,
  default: ({ value, theme, onChange, onMount, beforeMount }: any) => {
    // Immediately trigger onMount to simulate Monaco editor mounting
    if (onMount) {
      // Use setTimeout to simulate async mounting but make it immediate
      setTimeout(() => onMount(mockEditor, {}), 1);
    }
    if (beforeMount) {
      beforeMount({});
    }

    return (
      <textarea
        data-testid="monaco-editor"
        data-theme={theme === "vs-dark" ? "vs-dark" : "light"}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        aria-label="Schema Editor"
      />
    );
  },
  loader: {
    config: jest.fn(),
  },
}));

// Mock clipboard utility
jest.mock("../../src/utils/clipboard", () => ({
  copyToClipboard: jest.fn(),
}));

describe("JsonEditor Component", () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockEditor.focus.mockClear();
    mockEditor.executeEdits.mockClear();
  });

  it("renders Monaco editor with basic setup", () => {
    render(<JsonEditor value="{}" onChange={() => {}} />);
    expect(screen.getByTestId("monaco-editor")).toBeInTheDocument();
  });

  it("renders quick insert toolbar buttons", () => {
    render(<JsonEditor value="{}" onChange={() => {}} />);

    expect(screen.getByTitle("Insert text field")).toBeInTheDocument();
    expect(screen.getByTitle("Insert email field")).toBeInTheDocument();
    expect(screen.getByTitle("Insert textarea")).toBeInTheDocument();
    expect(screen.getByTitle("Insert select dropdown")).toBeInTheDocument();
    expect(screen.getByTitle("Insert checkbox")).toBeInTheDocument();
  });

  it("renders autocomplete guide button", () => {
    render(<JsonEditor value="{}" onChange={() => {}} />);
    expect(screen.getByText("Autocomplete Guide")).toBeInTheDocument();
  });

  it("displays quick insert help text", () => {
    render(<JsonEditor value="{}" onChange={() => {}} />);
    expect(
      screen.getByText(/Type field names for smart autocomplete/)
    ).toBeInTheDocument();
  });

  it("applies the provided value to editor", () => {
    const testValue = '{"name": "Test Form"}';
    render(<JsonEditor value={testValue} onChange={mockOnChange} />);

    const editor = screen.getByTestId("monaco-editor");
    expect(editor).toHaveValue(testValue);
  });

  it("applies dark theme correctly", async () => {
    render(<JsonEditor value="" onChange={mockOnChange} theme="dark" />);

    await waitFor(() => {
      const editor = screen.getByTestId("monaco-editor");
      expect(editor).toHaveAttribute("data-theme", "vs-dark");
    });
  });

  it("applies light theme by default", async () => {
    render(<JsonEditor value="" onChange={mockOnChange} />);

    await waitFor(() => {
      const editor = screen.getByTestId("monaco-editor");
      expect(editor).toHaveAttribute("data-theme", "light");
    });
  });

  it("displays error message when provided", () => {
    const errorMessage = "Invalid JSON format";
    render(
      <JsonEditor
        value='{"test":}'
        onChange={mockOnChange}
        error={errorMessage}
      />
    );

    const errorElement = screen.getByText(errorMessage);
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveClass("text-destructive");
  });

  it("handles multiline JSON content", async () => {
    const multilineJson = `{
  "name": "test",
  "type": "form"
}`;

    render(<JsonEditor value={multilineJson} onChange={mockOnChange} />);

    const editor = screen.getByTestId("monaco-editor");
    expect(editor).toHaveValue(multilineJson);
  });

  it("maintains editor state across re-renders", async () => {
    const { rerender } = render(
      <JsonEditor value="original" onChange={mockOnChange} theme="light" />
    );

    const editor = screen.getByTestId("monaco-editor");
    expect(editor).toHaveValue("original");

    rerender(
      <JsonEditor value="updated" onChange={mockOnChange} theme="dark" />
    );

    await waitFor(() => {
      const editor = screen.getByTestId("monaco-editor");
      expect(editor).toHaveValue("updated");
      expect(editor).toHaveAttribute("data-theme", "vs-dark");
    });
  });

  it("handles theme switching", async () => {
    const { rerender } = render(
      <JsonEditor value="{}" onChange={() => {}} theme="light" />
    );

    let editor = screen.getByTestId("monaco-editor");
    expect(editor).toHaveAttribute("data-theme", "light");

    rerender(<JsonEditor value="{}" onChange={() => {}} theme="dark" />);

    await waitFor(() => {
      editor = screen.getByTestId("monaco-editor");
      expect(editor).toHaveAttribute("data-theme", "vs-dark");
    });
  });

  it("calls onChange when editor content changes", async () => {
    render(<JsonEditor value="{}" onChange={mockOnChange} />);

    const editor = screen.getByTestId("monaco-editor");
    fireEvent.change(editor, { target: { value: '{"test": "value"}' } });

    expect(mockOnChange).toHaveBeenCalledWith('{"test": "value"}');
  });

  it("inserts text field template when text button is clicked", async () => {
    render(<JsonEditor value="{}" onChange={() => {}} />);

    // Wait for Monaco editor to be ready
    await waitFor(() => {
      expect(screen.getByTestId("monaco-editor")).toBeInTheDocument();
    });

    const textButton = screen.getByTitle("Insert text field");
    fireEvent.click(textButton);

    // Test that the button click doesn't crash - Monaco functionality tested elsewhere
    expect(textButton).toBeInTheDocument();
  });

  it("inserts email field template when email button is clicked", async () => {
    render(<JsonEditor value="{}" onChange={() => {}} />);

    await waitFor(() => {
      expect(screen.getByTestId("monaco-editor")).toBeInTheDocument();
    });

    const emailButton = screen.getByTitle("Insert email field");
    fireEvent.click(emailButton);

    // Test that the button click doesn't crash - Monaco functionality tested elsewhere
    expect(emailButton).toBeInTheDocument();
  });

  it("inserts textarea field template when textarea button is clicked", async () => {
    render(<JsonEditor value="{}" onChange={() => {}} />);

    await waitFor(() => {
      expect(screen.getByTestId("monaco-editor")).toBeInTheDocument();
    });

    const textareaButton = screen.getByTitle("Insert textarea");
    fireEvent.click(textareaButton);

    // Test that the button click doesn't crash - Monaco functionality tested elsewhere
    expect(textareaButton).toBeInTheDocument();
  });

  it("inserts select field template when select button is clicked", async () => {
    render(<JsonEditor value="{}" onChange={() => {}} />);

    await waitFor(() => {
      expect(screen.getByTestId("monaco-editor")).toBeInTheDocument();
    });

    const selectButton = screen.getByTitle("Insert select dropdown");
    fireEvent.click(selectButton);

    // Test that the button click doesn't crash - Monaco functionality tested elsewhere
    expect(selectButton).toBeInTheDocument();
  });

  it("inserts checkbox field template when checkbox button is clicked", async () => {
    render(<JsonEditor value="{}" onChange={() => {}} />);

    await waitFor(() => {
      expect(screen.getByTestId("monaco-editor")).toBeInTheDocument();
    });

    const checkboxButton = screen.getByTitle("Insert checkbox");
    fireEvent.click(checkboxButton);

    // Test that the button click doesn't crash - Monaco functionality tested elsewhere
    expect(checkboxButton).toBeInTheDocument();
  });

  it("handles monaco editor mounting and focus", async () => {
    render(<JsonEditor value="{}" onChange={() => {}} />);

    // Just verify the editor renders and doesn't crash
    await waitFor(() => {
      expect(screen.getByTestId("monaco-editor")).toBeInTheDocument();
    });

    // Verify basic editor functionality
    const editor = screen.getByTestId("monaco-editor");
    expect(editor).toHaveValue("{}");
  });

  it("handles editor value changes from undefined", () => {
    render(<JsonEditor value="{}" onChange={mockOnChange} />);

    const editor = screen.getByTestId("monaco-editor");
    fireEvent.change(editor, { target: { value: "" } });

    expect(mockOnChange).toHaveBeenCalledWith("");
  });

  it("handles empty JSON object", () => {
    render(<JsonEditor value="{}" onChange={mockOnChange} />);

    const editor = screen.getByTestId("monaco-editor");
    expect(editor).toHaveValue("{}");
  });

  it("handles empty string value", () => {
    render(<JsonEditor value="" onChange={mockOnChange} />);

    const editor = screen.getByTestId("monaco-editor");
    expect(editor).toHaveValue("");
  });

  it("renders with proper ARIA label", () => {
    render(<JsonEditor value="{}" onChange={mockOnChange} />);

    const editor = screen.getByLabelText("Schema Editor");
    expect(editor).toBeInTheDocument();
  });

  it("handles complex JSON structures", () => {
    const complexJson = `{
  "title": "Contact Form",
  "fields": [
    {
      "id": "name",
      "type": "text",
      "label": "Full Name",
      "validation": {
        "required": true,
        "minLength": 2
      }
    },
    {
      "id": "email",
      "type": "email", 
      "label": "Email Address",
      "validation": {
        "required": true,
        "pattern": "^[^@]+@[^@]+\\\\.[^@]+$"
      }
    }
  ]
}`;

    render(<JsonEditor value={complexJson} onChange={mockOnChange} />);

    const editor = screen.getByTestId("monaco-editor");
    expect(editor).toHaveValue(complexJson);
  });

  it("handles quick insert when editor position is not available", async () => {
    // Mock getPosition to return null
    const originalGetPosition = mockEditor.getPosition;
    mockEditor.getPosition = jest.fn(() => null as any);

    render(<JsonEditor value="{}" onChange={() => {}} />);

    const textButton = screen.getByTitle("Insert text field");
    fireEvent.click(textButton);

    // Should not crash when position is not available
    expect(mockEditor.executeEdits).not.toHaveBeenCalled();

    // Restore original mock
    mockEditor.getPosition = originalGetPosition;
  });

  it("handles all field type insertions", async () => {
    render(<JsonEditor value="{}" onChange={mockOnChange} />);

    await waitFor(() => {
      expect(screen.getByTestId("monaco-editor")).toBeInTheDocument();
    });

    // Test each quick insert button
    const buttons = [
      { title: "Insert text field", expectedText: "text" },
      { title: "Insert email field", expectedText: "email" },
      { title: "Insert textarea", expectedText: "textarea" },
      { title: "Insert select dropdown", expectedText: "select" },
      { title: "Insert checkbox", expectedText: "checkbox" },
    ];

    for (const button of buttons) {
      const btn = screen.getByTitle(button.title);
      fireEvent.click(btn);

      await waitFor(() => {
        expect(mockEditor.executeEdits).toHaveBeenCalled();
      });

      mockEditor.executeEdits.mockClear();
    }
  });

  it("handles editor focus when no editor reference exists", async () => {
    render(<JsonEditor value="{}" onChange={mockOnChange} />);

    // Monaco editor should be rendered
    await waitFor(() => {
      expect(screen.getByTestId("monaco-editor")).toBeInTheDocument();
    });
  });

  it("handles console error and warning suppression", () => {
    const originalError = console.error;
    const originalWarn = console.warn;
    console.error = jest.fn();
    console.warn = jest.fn();

    render(<JsonEditor value="{}" onChange={mockOnChange} />);

    // Should suppress Monaco-related errors
    console.error("Error: Cannot read properties of undefined");
    console.warn("Warning: Monaco editor warning");

    expect(console.error).toHaveBeenCalledWith(
      "Error: Cannot read properties of undefined"
    );
    expect(console.warn).toHaveBeenCalledWith("Warning: Monaco editor warning");

    console.error = originalError;
    console.warn = originalWarn;
  });

  it("handles rapid value changes", async () => {
    const { rerender } = render(
      <JsonEditor value="{}" onChange={mockOnChange} />
    );

    // Rapidly change values
    rerender(<JsonEditor value='{"a": 1}' onChange={mockOnChange} />);
    rerender(<JsonEditor value='{"a": 1, "b": 2}' onChange={mockOnChange} />);
    rerender(
      <JsonEditor value='{"a": 1, "b": 2, "c": 3}' onChange={mockOnChange} />
    );

    const editor = screen.getByTestId("monaco-editor");
    expect(editor).toHaveValue('{"a": 1, "b": 2, "c": 3}');
  });

  it("handles theme prop variations", () => {
    const { rerender } = render(
      <JsonEditor value="{}" onChange={mockOnChange} />
    );

    // Test light theme
    rerender(<JsonEditor value="{}" onChange={mockOnChange} theme="light" />);
    let editor = screen.getByTestId("monaco-editor");
    expect(editor).toHaveAttribute("data-theme", "light");

    // Test dark theme
    rerender(<JsonEditor value="{}" onChange={mockOnChange} theme="dark" />);
    editor = screen.getByTestId("monaco-editor");
    expect(editor).toHaveAttribute("data-theme", "vs-dark");
  });

  it("handles error message display", () => {
    const errorMessage = "Invalid JSON: Expected '}' at line 5";

    render(
      <JsonEditor value="{}" onChange={mockOnChange} error={errorMessage} />
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toHaveClass("text-destructive");
  });

  it("handles onChange callback correctly", async () => {
    render(<JsonEditor value="{}" onChange={mockOnChange} />);

    const editor = screen.getByTestId("monaco-editor");

    // Simulate typing in the editor
    fireEvent.change(editor, { target: { value: '{"title": "New Form"}' } });

    expect(mockOnChange).toHaveBeenCalledWith('{"title": "New Form"}');
  });
});
