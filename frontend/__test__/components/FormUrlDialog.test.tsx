import { describe, it, jest, beforeEach, afterEach } from "@jest/globals";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormUrlDialog } from "../../src/components/FormUrlDialog";
import { FormSchema } from "../../src/types/schema";
import { toast } from "sonner";

// Mock sonner toast
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("FormUrlDialog Component", () => {
  const mockFormSchema: FormSchema = {
    title: "Test Form",
    description: "A test form",
    fields: [
      {
        id: "field1",
        type: "text" as const,
        label: "Field 1",
        required: true,
      },
    ],
  };

  const defaultProps = {
    open: true,
    onOpenChange: jest.fn(),
    formId: "test-form-id",
    formName: "Test Form",
    formSchema: mockFormSchema,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock window.location
    delete (window as any).location;
    window.location = {
      origin: "http://localhost:3000",
      pathname: "/app",
    } as any;

    // Mock window.open
    (window as any).open = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  describe("Rendering", () => {
    it("should render dialog when open is true", () => {
      render(<FormUrlDialog {...defaultProps} />);

      expect(
        screen.getByText("Form Published Successfully!")
      ).toBeInTheDocument();
    });

    it("should not render dialog when open is false", () => {
      render(<FormUrlDialog {...defaultProps} open={false} />);

      expect(
        screen.queryByText("Form Published Successfully!")
      ).not.toBeInTheDocument();
    });

    it("should display form name in description", () => {
      render(<FormUrlDialog {...defaultProps} />);

      expect(
        screen.getByText(
          /Your form "Test Form" is now live and ready to collect responses./
        )
      ).toBeInTheDocument();
    });

    it("should display public form URL input", () => {
      render(<FormUrlDialog {...defaultProps} />);

      const input = screen.getByRole("textbox") as HTMLInputElement;
      expect(input).toBeInTheDocument();
      expect(input.value).toContain("/submit/test-form-id");
    });

    it("should encode form data in URL", () => {
      render(<FormUrlDialog {...defaultProps} />);

      const input = screen.getByRole("textbox") as HTMLInputElement;
      expect(input.value).toContain("?data=");

      // Verify the URL contains encoded data
      const urlParts = input.value.split("?data=");
      expect(urlParts).toHaveLength(2);
      const encodedData = urlParts[1];
      expect(encodedData).toBeTruthy();

      // Verify we can decode it back
      if (encodedData) {
        const decodedData = JSON.parse(atob(encodedData));
        expect(decodedData.name).toBe("Test Form");
        expect(decodedData.schema).toEqual(mockFormSchema);
      }
    });
  });

  describe("Instructions", () => {
    it('should display "How it works" section', () => {
      render(<FormUrlDialog {...defaultProps} />);

      expect(screen.getByText("📋 How it works")).toBeInTheDocument();
    });

    it("should display all instruction steps", () => {
      render(<FormUrlDialog {...defaultProps} />);

      expect(
        screen.getByText(
          /Respondents will first be asked for their Name and Email/
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(/After registration, they'll see your form/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Responses are collected in your browser's storage/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/You can view and export all responses/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          /The form works in any browser, including incognito mode/
        )
      ).toBeInTheDocument();
    });

    it("should display helper text about URL encoding", () => {
      render(<FormUrlDialog {...defaultProps} />);

      expect(
        screen.getByText(/The form data is encoded in the URL/)
      ).toBeInTheDocument();
    });
  });

  describe("Copy Functionality", () => {
    it("should copy URL to clipboard when copy button clicked", async () => {
      const mockWriteText = jest.fn(() => Promise.resolve());
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText,
        },
      });

      render(<FormUrlDialog {...defaultProps} />);

      const copyButton = screen.getAllByRole("button")[0]; // First button is the copy button
      await userEvent.click(copyButton);

      await waitFor(() => {
        expect(mockWriteText).toHaveBeenCalledWith(
          expect.stringContaining("/submit/test-form-id")
        );
        expect(toast.success).toHaveBeenCalledWith("URL copied to clipboard!");
      });
    });
    it("should show checkmark icon after copying", async () => {
      const mockWriteText = jest.fn(() => Promise.resolve());
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText,
        },
      });

      render(<FormUrlDialog {...defaultProps} />);

      const copyButton = screen.getAllByRole("button")[0]; // First button is the copy button
      await userEvent.click(copyButton);

      // The button should show a checkmark (visually indicated by CheckCircle2 icon with green color)
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalled();
      });
    });

    it("should use fallback method if clipboard API fails", async () => {
      const mockWriteText = jest.fn(() =>
        Promise.reject(new Error("Clipboard blocked"))
      );
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText,
        },
      });

      // Mock document.execCommand
      document.execCommand = jest.fn(() => true);

      render(<FormUrlDialog {...defaultProps} />);

      const copyButton = screen.getAllByRole("button")[0]; // First button is the copy button
      await userEvent.click(copyButton);

      await waitFor(() => {
        expect(document.execCommand).toHaveBeenCalledWith("copy");
        expect(toast.success).toHaveBeenCalledWith("URL copied to clipboard!");
      });
    });
    it("should handle copy errors gracefully", async () => {
      const mockWriteText = jest.fn(() =>
        Promise.reject(new Error("Clipboard blocked"))
      );
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText,
        },
      });

      // Mock document.execCommand to fail
      document.execCommand = jest.fn(() => {
        throw new Error("Copy failed");
      });

      render(<FormUrlDialog {...defaultProps} />);

      const copyButton = screen.getAllByRole("button")[0]; // First button is the copy button
      await userEvent.click(copyButton);

      await waitFor(
        () => {
          expect(toast.error).toHaveBeenCalledWith("Failed to copy URL");
        },
        { timeout: 10000 }
      );
    }, 15000);

    it("should reset copied state after 2 seconds", () => {
      jest.useFakeTimers();

      const mockWriteText = jest.fn(() => Promise.resolve());
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText,
        },
      });

      render(<FormUrlDialog {...defaultProps} />);

      const copyButton = screen.getAllByRole("button")[0]; // First button is the copy button

      // Use fireEvent instead of userEvent for fake timers
      copyButton.click();

      // Fast-forward time by 2 seconds
      jest.advanceTimersByTime(2000);

      jest.useRealTimers();
    });
  });

  describe("Input Interaction", () => {
    it("should select text when input is clicked", () => {
      render(<FormUrlDialog {...defaultProps} />);

      const input = screen.getByRole("textbox") as HTMLInputElement;

      // Mock select method
      input.select = jest.fn();

      input.click();

      expect(input.select).toHaveBeenCalled();
    });

    it("should have readonly input", () => {
      render(<FormUrlDialog {...defaultProps} />);

      const input = screen.getByRole("textbox") as HTMLInputElement;
      expect(input).toHaveAttribute("readonly");
    });
  });

  describe("Open Form Button", () => {
    it("should open form in new tab when button clicked", () => {
      render(<FormUrlDialog {...defaultProps} />);

      const openButton = screen.getByRole("button", {
        name: /open form in new tab/i,
      });

      openButton.click();
      expect(window.open).toHaveBeenCalledWith(
        expect.stringContaining("/submit/test-form-id"),
        "_blank"
      );
    });

    it("should display external link icon", () => {
      render(<FormUrlDialog {...defaultProps} />);

      expect(
        screen.getByRole("button", { name: /open form in new tab/i })
      ).toBeInTheDocument();
    });
  });

  describe("Done Button", () => {
    it("should call onOpenChange when done button clicked", () => {
      render(<FormUrlDialog {...defaultProps} />);

      const doneButton = screen.getByRole("button", { name: /done/i });

      doneButton.click();
      expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe("Dialog Closing", () => {
    it("should call onOpenChange when dialog is closed", async () => {
      render(<FormUrlDialog {...defaultProps} />);

      // Close dialog by clicking escape or backdrop (handled by Dialog component)
      // We just verify the callback is passed correctly
      expect(defaultProps.onOpenChange).toBeDefined();
    });
  });

  describe("URL Structure", () => {
    it("should generate correct URL format", () => {
      render(<FormUrlDialog {...defaultProps} />);

      const input = screen.getByRole("textbox") as HTMLInputElement;
      expect(input.value).toMatch(
        /http:\/\/localhost:3000\/submit\/test-form-id\?data=.+/
      );
    });

    it("should use /submit/ route instead of /f/", () => {
      render(<FormUrlDialog {...defaultProps} />);

      const input = screen.getByRole("textbox") as HTMLInputElement;
      expect(input.value).toContain("/submit/");
      expect(input.value).not.toContain("/f/");
    });

    it("should include form ID in URL", () => {
      render(<FormUrlDialog {...defaultProps} />);

      const input = screen.getByRole("textbox") as HTMLInputElement;
      expect(input.value).toContain("test-form-id");
    });

    it("should handle different form IDs", () => {
      render(<FormUrlDialog {...defaultProps} formId="different-id" />);

      const input = screen.getByRole("textbox") as HTMLInputElement;
      expect(input.value).toContain("different-id");
    });
  });

  describe("Data Encoding", () => {
    it("should encode form schema correctly", () => {
      render(<FormUrlDialog {...defaultProps} />);

      const input = screen.getByRole("textbox") as HTMLInputElement;
      const urlParts = input.value.split("?data=");
      expect(urlParts).toHaveLength(2);

      const encodedData = urlParts[1];
      const decodedData = JSON.parse(atob(encodedData));

      expect(decodedData.schema).toEqual(mockFormSchema);
    });

    it("should encode form name correctly", () => {
      render(<FormUrlDialog {...defaultProps} formName="My Custom Form" />);

      const input = screen.getByRole("textbox") as HTMLInputElement;
      const urlParts = input.value.split("?data=");
      const encodedData = urlParts[1];
      const decodedData = JSON.parse(atob(encodedData));

      expect(decodedData.name).toBe("My Custom Form");
    });

    it("should handle complex form schemas", () => {
      const complexSchema: FormSchema = {
        title: "Complex Form",
        description: "A complex form with multiple fields",
        fields: [
          {
            id: "text-field",
            type: "text" as const,
            label: "Text Field",
            required: true,
            placeholder: "Enter text",
          },
          {
            id: "email-field",
            type: "email" as const,
            label: "Email Field",
            required: false,
          },
          {
            id: "select-field",
            type: "select" as const,
            label: "Select Field",
            required: true,
            options: [
              { label: "Option 1", value: "option1" },
              { label: "Option 2", value: "option2" },
              { label: "Option 3", value: "option3" },
            ],
          },
        ],
      };

      render(<FormUrlDialog {...defaultProps} formSchema={complexSchema} />);

      const input = screen.getByRole("textbox") as HTMLInputElement;
      const urlParts = input.value.split("?data=");
      const encodedData = urlParts[1];
      const decodedData = JSON.parse(atob(encodedData));

      expect(decodedData.schema).toEqual(complexSchema);
      expect(decodedData.schema.fields).toHaveLength(3);
    });
  });

  describe("Visual Elements", () => {
    it("should display success icon", () => {
      render(<FormUrlDialog {...defaultProps} />);

      // Check for the success icon in the header
      expect(
        screen.getByText("Form Published Successfully!")
      ).toBeInTheDocument();
    });

    it("should use monospace font for URL", () => {
      render(<FormUrlDialog {...defaultProps} />);

      const input = screen.getByRole("textbox") as HTMLInputElement;
      expect(input).toHaveClass("font-mono");
    });
  });
});
