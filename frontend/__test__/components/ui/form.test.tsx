import React from "react";
import { render, screen } from "@testing-library/react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  useFormField,
} from "../../../src/components/ui/form";

// Test component wrapper for useFormField hook
function UseFormFieldTestComponent() {
  const formField = useFormField();
  return (
    <div data-testid="form-field-data">
      <span data-testid="id">{formField.id}</span>
      <span data-testid="name">{formField.name}</span>
      <span data-testid="form-item-id">{formField.formItemId}</span>
      <span data-testid="form-description-id">{formField.formDescriptionId}</span>
      <span data-testid="form-message-id">{formField.formMessageId}</span>
      <span data-testid="error">{formField.error ? "true" : "false"}</span>
      <span data-testid="invalid">{formField.invalid ? "true" : "false"}</span>
    </div>
  );
}

// Test wrapper component with form context
function FormWrapper({ children, defaultValues = {}, errors = {} }: any) {
  const form = useForm({ defaultValues });
  
  // Simulate form errors if provided
  React.useEffect(() => {
    Object.keys(errors).forEach(fieldName => {
      form.setError(fieldName, { message: errors[fieldName] });
    });
  }, [form, errors]);

  return (
    <Form {...form}>
      <form>{children}</form>
    </Form>
  );
}

describe("Form Components", () => {
  describe("Form", () => {
    it("should render as FormProvider", () => {
      const TestFormComponent = () => {
        const form = useForm();
        return (
          <Form {...form}>
            <div data-testid="form-content">Form content</div>
          </Form>
        );
      };

      render(<TestFormComponent />);
      
      expect(screen.getByTestId("form-content")).toBeInTheDocument();
    });
  });

  describe("FormField", () => {
    it("should render controlled field with context", () => {
      render(
        <FormWrapper defaultValues={{ testField: "test value" }}>
          <FormField
            name="testField"
            render={({ field }) => (
              <input {...field} data-testid="test-input" />
            )}
          />
        </FormWrapper>
      );

      const input = screen.getByTestId("test-input");
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue("test value");
    });

    it("should provide field context to children", () => {
      render(
        <FormWrapper>
          <FormField
            name="testField"
            render={() => (
              <FormItem>
                <UseFormFieldTestComponent />
              </FormItem>
            )}
          />
        </FormWrapper>
      );

      expect(screen.getByTestId("name")).toHaveTextContent("testField");
    });
  });

  describe("FormItem", () => {
    it("should render div with correct className", () => {
      render(
        <FormWrapper>
          <FormField
            name="test"
            render={() => (
              <FormItem data-testid="form-item">
                <div>Content</div>
              </FormItem>
            )}
          />
        </FormWrapper>
      );

      const formItem = screen.getByTestId("form-item");
      expect(formItem).toBeInTheDocument();
      expect(formItem).toHaveClass("grid", "gap-2");
      expect(formItem).toHaveAttribute("data-slot", "form-item");
    });

    it("should accept custom className", () => {
      render(
        <FormWrapper>
          <FormField
            name="test"
            render={() => (
              <FormItem className="custom-class" data-testid="form-item">
                <div>Content</div>
              </FormItem>
            )}
          />
        </FormWrapper>
      );

      const formItem = screen.getByTestId("form-item");
      expect(formItem).toHaveClass("grid", "gap-2", "custom-class");
    });

    it("should provide unique id context", () => {
      render(
        <FormWrapper>
          <FormField
            name="test"
            render={() => (
              <FormItem>
                <UseFormFieldTestComponent />
              </FormItem>
            )}
          />
        </FormWrapper>
      );

      const id = screen.getByTestId("id").textContent;
      expect(id).toBeTruthy();
      expect(id).not.toBe("");
    });
  });

  describe("FormLabel", () => {
    it("should render label with correct attributes", () => {
      render(
        <FormWrapper>
          <FormField
            name="test"
            render={() => (
              <FormItem>
                <FormLabel data-testid="form-label">Test Label</FormLabel>
              </FormItem>
            )}
          />
        </FormWrapper>
      );

      const label = screen.getByTestId("form-label");
      expect(label).toBeInTheDocument();
      expect(label).toHaveTextContent("Test Label");
      expect(label).toHaveAttribute("data-slot", "form-label");
      expect(label).toHaveAttribute("data-error", "false");
    });

    it("should show error state when field has error", () => {
      render(
        <FormWrapper errors={{ test: "Test error" }}>
          <FormField
            name="test"
            render={() => (
              <FormItem>
                <FormLabel data-testid="form-label">Test Label</FormLabel>
              </FormItem>
            )}
          />
        </FormWrapper>
      );

      const label = screen.getByTestId("form-label");
      expect(label).toHaveAttribute("data-error", "true");
      expect(label).toHaveClass("data-[error=true]:text-destructive");
    });

    it("should accept custom className", () => {
      render(
        <FormWrapper>
          <FormField
            name="test"
            render={() => (
              <FormItem>
                <FormLabel className="custom-label" data-testid="form-label">
                  Test Label
                </FormLabel>
              </FormItem>
            )}
          />
        </FormWrapper>
      );

      const label = screen.getByTestId("form-label");
      expect(label).toHaveClass("custom-label");
    });
  });

  describe("FormControl", () => {
    it("should render with correct accessibility attributes", () => {
      render(
        <FormWrapper>
          <FormField
            name="test"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <input {...field} data-testid="form-control" />
                </FormControl>
              </FormItem>
            )}
          />
        </FormWrapper>
      );

      const input = screen.getByTestId("form-control");
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("data-slot", "form-control");
      expect(input).toHaveAttribute("aria-invalid", "false");
      expect(input.getAttribute("aria-describedby")).toBeTruthy();
    });

    it("should set aria-invalid when field has error", () => {
      render(
        <FormWrapper errors={{ test: "Test error" }}>
          <FormField
            name="test"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <input {...field} data-testid="form-control" />
                </FormControl>
              </FormItem>
            )}
          />
        </FormWrapper>
      );

      const input = screen.getByTestId("form-control");
      expect(input).toHaveAttribute("aria-invalid", "true");
    });

    it("should include message id in aria-describedby when there's an error", () => {
      render(
        <FormWrapper errors={{ test: "Test error" }}>
          <FormField
            name="test"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <input {...field} data-testid="form-control" />
                </FormControl>
                <UseFormFieldTestComponent />
              </FormItem>
            )}
          />
        </FormWrapper>
      );

      const input = screen.getByTestId("form-control");
      const formMessageId = screen.getByTestId("form-message-id").textContent;
      const formDescriptionId = screen.getByTestId("form-description-id").textContent;
      
      const ariaDescribedBy = input.getAttribute("aria-describedby");
      expect(ariaDescribedBy).toContain(formDescriptionId);
      expect(ariaDescribedBy).toContain(formMessageId);
    });
  });

  describe("FormDescription", () => {
    it("should render description with correct attributes", () => {
      render(
        <FormWrapper>
          <FormField
            name="test"
            render={() => (
              <FormItem>
                <FormDescription data-testid="form-description">
                  Test description
                </FormDescription>
              </FormItem>
            )}
          />
        </FormWrapper>
      );

      const description = screen.getByTestId("form-description");
      expect(description).toBeInTheDocument();
      expect(description).toHaveTextContent("Test description");
      expect(description).toHaveAttribute("data-slot", "form-description");
      expect(description).toHaveClass("text-muted-foreground", "text-sm");
    });

    it("should accept custom className", () => {
      render(
        <FormWrapper>
          <FormField
            name="test"
            render={() => (
              <FormItem>
                <FormDescription className="custom-desc" data-testid="form-description">
                  Test description
                </FormDescription>
              </FormItem>
            )}
          />
        </FormWrapper>
      );

      const description = screen.getByTestId("form-description");
      expect(description).toHaveClass("text-muted-foreground", "text-sm", "custom-desc");
    });

    it("should have correct id from form field context", () => {
      render(
        <FormWrapper>
          <FormField
            name="test"
            render={() => (
              <FormItem>
                <FormDescription data-testid="form-description">
                  Test description
                </FormDescription>
                <UseFormFieldTestComponent />
              </FormItem>
            )}
          />
        </FormWrapper>
      );

      const description = screen.getByTestId("form-description");
      const expectedId = screen.getByTestId("form-description-id").textContent;
      expect(description).toHaveAttribute("id", expectedId);
    });
  });

  describe("FormMessage", () => {
    it("should not render when no error", () => {
      render(
        <FormWrapper>
          <FormField
            name="test"
            render={() => (
              <FormItem>
                <FormMessage data-testid="form-message" />
              </FormItem>
            )}
          />
        </FormWrapper>
      );

      expect(screen.queryByTestId("form-message")).not.toBeInTheDocument();
    });

    it("should render error message when field has error", () => {
      render(
        <FormWrapper errors={{ test: "This is an error message" }}>
          <FormField
            name="test"
            render={() => (
              <FormItem>
                <FormMessage data-testid="form-message" />
              </FormItem>
            )}
          />
        </FormWrapper>
      );

      const message = screen.getByTestId("form-message");
      expect(message).toBeInTheDocument();
      expect(message).toHaveTextContent("This is an error message");
      expect(message).toHaveAttribute("data-slot", "form-message");
      expect(message).toHaveClass("text-destructive", "text-sm");
    });

    it("should render custom children when no error", () => {
      render(
        <FormWrapper>
          <FormField
            name="test"
            render={() => (
              <FormItem>
                <FormMessage data-testid="form-message">
                  Custom message
                </FormMessage>
              </FormItem>
            )}
          />
        </FormWrapper>
      );

      const message = screen.getByTestId("form-message");
      expect(message).toBeInTheDocument();
      expect(message).toHaveTextContent("Custom message");
    });

    it("should prioritize error message over children", () => {
      render(
        <FormWrapper errors={{ test: "Error message" }}>
          <FormField
            name="test"
            render={() => (
              <FormItem>
                <FormMessage data-testid="form-message">
                  Custom message
                </FormMessage>
              </FormItem>
            )}
          />
        </FormWrapper>
      );

      const message = screen.getByTestId("form-message");
      expect(message).toHaveTextContent("Error message");
      expect(message).not.toHaveTextContent("Custom message");
    });

    it("should accept custom className", () => {
      render(
        <FormWrapper errors={{ test: "Error" }}>
          <FormField
            name="test"
            render={() => (
              <FormItem>
                <FormMessage className="custom-error" data-testid="form-message" />
              </FormItem>
            )}
          />
        </FormWrapper>
      );

      const message = screen.getByTestId("form-message");
      expect(message).toHaveClass("text-destructive", "text-sm", "custom-error");
    });

    it("should have correct id from form field context", () => {
      render(
        <FormWrapper errors={{ test: "Error" }}>
          <FormField
            name="test"
            render={() => (
              <FormItem>
                <FormMessage data-testid="form-message" />
                <UseFormFieldTestComponent />
              </FormItem>
            )}
          />
        </FormWrapper>
      );

      const message = screen.getByTestId("form-message");
      const expectedId = screen.getByTestId("form-message-id").textContent;
      expect(message).toHaveAttribute("id", expectedId);
    });
  });

  describe("useFormField", () => {
    it("should throw error when used outside FormField", () => {
      // Suppress console.error for this test
      const originalError = console.error;
      console.error = jest.fn();

      expect(() => {
        render(<UseFormFieldTestComponent />);
      }).toThrow();

      console.error = originalError;
    });

    it("should provide correct field information", () => {
      render(
        <FormWrapper>
          <FormField
            name="testField"
            render={() => (
              <FormItem>
                <UseFormFieldTestComponent />
              </FormItem>
            )}
          />
        </FormWrapper>
      );

      expect(screen.getByTestId("name")).toHaveTextContent("testField");
      expect(screen.getByTestId("error")).toHaveTextContent("false");
      expect(screen.getByTestId("invalid")).toHaveTextContent("false");
      
      const id = screen.getByTestId("id").textContent;
      expect(screen.getByTestId("form-item-id")).toHaveTextContent(`${id}-form-item`);
      expect(screen.getByTestId("form-description-id")).toHaveTextContent(`${id}-form-item-description`);
      expect(screen.getByTestId("form-message-id")).toHaveTextContent(`${id}-form-item-message`);
    });

    it("should provide correct error state", () => {
      render(
        <FormWrapper errors={{ testField: "Test error" }}>
          <FormField
            name="testField"
            render={() => (
              <FormItem>
                <UseFormFieldTestComponent />
              </FormItem>
            )}
          />
        </FormWrapper>
      );

      expect(screen.getByTestId("error")).toHaveTextContent("true");
      expect(screen.getByTestId("invalid")).toHaveTextContent("true");
    });
  });
});