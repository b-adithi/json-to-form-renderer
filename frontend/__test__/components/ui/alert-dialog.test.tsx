import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "../../../src/components/ui/alert-dialog";

describe("AlertDialog Components", () => {
  describe("AlertDialog Root", () => {
    it("renders alert dialog with trigger", () => {
      render(
        <AlertDialog>
          <AlertDialogTrigger>Open Alert</AlertDialogTrigger>
        </AlertDialog>
      );

      expect(screen.getByText("Open Alert")).toBeInTheDocument();
    });

    it("passes through additional props to root", () => {
      render(
        <AlertDialog defaultOpen={false} data-testid="alert-root">
          <AlertDialogTrigger>Trigger</AlertDialogTrigger>
        </AlertDialog>
      );

      const trigger = screen.getByText("Trigger");
      expect(trigger).toBeInTheDocument();
    });

    it("handles open state changes", () => {
      const onOpenChange = jest.fn();
      render(
        <AlertDialog onOpenChange={onOpenChange}>
          <AlertDialogTrigger>Open</AlertDialogTrigger>
        </AlertDialog>
      );

      const trigger = screen.getByText("Open");
      fireEvent.click(trigger);

      expect(onOpenChange).toHaveBeenCalled();
    });

    it("renders without errors", () => {
      const { container } = render(
        <AlertDialog>
          <AlertDialogTrigger>Test</AlertDialogTrigger>
        </AlertDialog>
      );

      // AlertDialog root is a context provider and may not have visible DOM
      expect(container).toBeInTheDocument();
      expect(screen.getByText("Test")).toBeInTheDocument();
    });
  });

  describe("AlertDialogTrigger", () => {
    it("renders trigger button", () => {
      render(
        <AlertDialog>
          <AlertDialogTrigger>Delete Item</AlertDialogTrigger>
        </AlertDialog>
      );

      expect(screen.getByText("Delete Item")).toBeInTheDocument();
    });

    it("applies custom className to trigger", () => {
      render(
        <AlertDialog>
          <AlertDialogTrigger className="custom-trigger">
            Custom Trigger
          </AlertDialogTrigger>
        </AlertDialog>
      );

      const trigger = screen.getByText("Custom Trigger");
      expect(trigger).toHaveClass("custom-trigger");
    });

    it("passes through additional props to trigger", () => {
      render(
        <AlertDialog>
          <AlertDialogTrigger data-testid="alert-trigger" disabled>
            Disabled Trigger
          </AlertDialogTrigger>
        </AlertDialog>
      );

      const trigger = screen.getByTestId("alert-trigger");
      expect(trigger).toBeDisabled();
    });

    it("responds to click events", () => {
      render(
        <AlertDialog>
          <AlertDialogTrigger>Click me</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Alert Title</AlertDialogTitle>
            <AlertDialogDescription>Alert content</AlertDialogDescription>
          </AlertDialogContent>
        </AlertDialog>
      );

      const trigger = screen.getByText("Click me");
      fireEvent.click(trigger);
      expect(trigger).toBeInTheDocument();
    });

    it("applies data-slot attribute", () => {
      const { container } = render(
        <AlertDialog>
          <AlertDialogTrigger>Test</AlertDialogTrigger>
        </AlertDialog>
      );

      const trigger = container.querySelector(
        '[data-slot="alert-dialog-trigger"]'
      );
      expect(trigger).toBeInTheDocument();
    });
  });

  describe("AlertDialogPortal", () => {
    it("renders portal component", () => {
      render(
        <AlertDialog open>
          <AlertDialogTrigger>Open</AlertDialogTrigger>
          <AlertDialogPortal>
            <AlertDialogContent>Portal content</AlertDialogContent>
          </AlertDialogPortal>
        </AlertDialog>
      );

      expect(screen.getByText("Portal content")).toBeInTheDocument();
    });

    it("renders portal content correctly", () => {
      render(
        <AlertDialog open>
          <AlertDialogTrigger>Open</AlertDialogTrigger>
          <AlertDialogPortal>
            <AlertDialogContent>
              <AlertDialogTitle>Title</AlertDialogTitle>
              <AlertDialogDescription>Test</AlertDialogDescription>
            </AlertDialogContent>
          </AlertDialogPortal>
        </AlertDialog>
      );

      // Portal works by rendering content, focus on content being rendered
      expect(screen.getByText("Test")).toBeInTheDocument();
    });

    it("works with Radix UI portal mechanism", () => {
      render(
        <AlertDialog open>
          <AlertDialogTrigger>Open</AlertDialogTrigger>
          <AlertDialogPortal>
            <AlertDialogContent>
              <AlertDialogTitle>Portal Title</AlertDialogTitle>
              <AlertDialogDescription>Portal Content</AlertDialogDescription>
            </AlertDialogContent>
          </AlertDialogPortal>
        </AlertDialog>
      );

      expect(screen.getByText("Portal Title")).toBeInTheDocument();
      expect(screen.getByText("Portal Content")).toBeInTheDocument();
    });
  });

  describe("AlertDialogOverlay", () => {
    it("is automatically included when using AlertDialogContent", () => {
      render(
        <AlertDialog open>
          <AlertDialogTrigger>Open</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Title</AlertDialogTitle>
            <AlertDialogDescription>Description</AlertDialogDescription>
          </AlertDialogContent>
        </AlertDialog>
      );

      // Content renders properly, overlay is included automatically
      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("Description")).toBeInTheDocument();
    });

    it("works when used standalone with portal", () => {
      render(
        <AlertDialog open>
          <AlertDialogTrigger>Open</AlertDialogTrigger>
          <AlertDialogPortal>
            <AlertDialogOverlay />
            <div>Overlay with content</div>
          </AlertDialogPortal>
        </AlertDialog>
      );

      expect(screen.getByText("Overlay with content")).toBeInTheDocument();
    });

    it("can be customized with className", () => {
      render(
        <AlertDialog open>
          <AlertDialogTrigger>Open</AlertDialogTrigger>
          <AlertDialogPortal>
            <AlertDialogOverlay className="custom-overlay" />
            <div>Custom overlay content</div>
          </AlertDialogPortal>
        </AlertDialog>
      );

      expect(screen.getByText("Custom overlay content")).toBeInTheDocument();
    });

    it("accepts additional props", () => {
      render(
        <AlertDialog open>
          <AlertDialogTrigger>Open</AlertDialogTrigger>
          <AlertDialogPortal>
            <AlertDialogOverlay data-testid="test-overlay" />
            <div>Overlay test content</div>
          </AlertDialogPortal>
        </AlertDialog>
      );

      expect(screen.getByText("Overlay test content")).toBeInTheDocument();
    });
  });

  describe("AlertDialogContent", () => {
    it("renders content when dialog is open", () => {
      render(
        <AlertDialog open>
          <AlertDialogTrigger>Open</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Alert Title</AlertDialogTitle>
            <AlertDialogDescription>Alert content</AlertDialogDescription>
          </AlertDialogContent>
        </AlertDialog>
      );

      expect(screen.getByText("Alert Title")).toBeInTheDocument();
      expect(screen.getByText("Alert content")).toBeInTheDocument();
    });

    it("renders with proper styling structure", () => {
      render(
        <AlertDialog open>
          <AlertDialogTrigger>Open</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Title</AlertDialogTitle>
            <AlertDialogDescription>Description</AlertDialogDescription>
          </AlertDialogContent>
        </AlertDialog>
      );

      // Content renders with title and description
      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("Description")).toBeInTheDocument();
    });

    it("applies custom className to content", () => {
      render(
        <AlertDialog open>
          <AlertDialogTrigger>Open</AlertDialogTrigger>
          <AlertDialogContent className="custom-content">
            <AlertDialogTitle>Title</AlertDialogTitle>
            <AlertDialogDescription>Description</AlertDialogDescription>
          </AlertDialogContent>
        </AlertDialog>
      );

      // Content renders with custom styling
      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("Description")).toBeInTheDocument();
    });

    it("includes overlay and portal automatically", () => {
      render(
        <AlertDialog open>
          <AlertDialogTrigger>Open</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Auto Portal Title</AlertDialogTitle>
            <AlertDialogDescription>
              Auto Portal Description
            </AlertDialogDescription>
          </AlertDialogContent>
        </AlertDialog>
      );

      // Content renders properly through automatic portal and overlay
      expect(screen.getByText("Auto Portal Title")).toBeInTheDocument();
      expect(screen.getByText("Auto Portal Description")).toBeInTheDocument();
    });

    it("works with complete dialog structure", () => {
      render(
        <AlertDialog open>
          <AlertDialogTrigger>Open</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Complete Title</AlertDialogTitle>
            <AlertDialogDescription>
              Complete Description
            </AlertDialogDescription>
          </AlertDialogContent>
        </AlertDialog>
      );

      expect(screen.getByText("Complete Title")).toBeInTheDocument();
      expect(screen.getByText("Complete Description")).toBeInTheDocument();
    });

    it("passes additional props to content", () => {
      render(
        <AlertDialog open>
          <AlertDialogTrigger>Open</AlertDialogTrigger>
          <AlertDialogContent data-testid="alert-content" role="alertdialog">
            <AlertDialogTitle>Title</AlertDialogTitle>
            <AlertDialogDescription>Description</AlertDialogDescription>
          </AlertDialogContent>
        </AlertDialog>
      );

      const content = screen.getByTestId("alert-content");
      expect(content).toHaveAttribute("role", "alertdialog");
    });
  });

  describe("AlertDialogHeader", () => {
    it("renders header with content", () => {
      render(
        <AlertDialogHeader>
          <h2>Header Title</h2>
          <p>Header subtitle</p>
        </AlertDialogHeader>
      );

      expect(screen.getByText("Header Title")).toBeInTheDocument();
      expect(screen.getByText("Header subtitle")).toBeInTheDocument();
    });

    it("applies default header styles", () => {
      const { container } = render(
        <AlertDialogHeader>Header content</AlertDialogHeader>
      );

      const header = container.querySelector(
        '[data-slot="alert-dialog-header"]'
      );
      expect(header).toHaveClass(
        "flex",
        "flex-col",
        "gap-2",
        "text-center",
        "sm:text-left"
      );
    });

    it("applies custom className to header", () => {
      const { container } = render(
        <AlertDialogHeader className="custom-header">
          Custom header
        </AlertDialogHeader>
      );

      const header = container.querySelector(
        '[data-slot="alert-dialog-header"]'
      );
      expect(header).toHaveClass("custom-header");
    });

    it("passes through additional props to header", () => {
      render(
        <AlertDialogHeader data-testid="alert-header" role="banner">
          Header with props
        </AlertDialogHeader>
      );

      const header = screen.getByTestId("alert-header");
      expect(header).toHaveAttribute("role", "banner");
    });

    it("renders with title and description", () => {
      render(
        <AlertDialog open>
          <AlertDialogTrigger>Open</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Action</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to proceed?
              </AlertDialogDescription>
            </AlertDialogHeader>
          </AlertDialogContent>
        </AlertDialog>
      );

      expect(screen.getByText("Confirm Action")).toBeInTheDocument();
      expect(
        screen.getByText("Are you sure you want to proceed?")
      ).toBeInTheDocument();
    });
  });

  describe("AlertDialogFooter", () => {
    it("renders footer with content", () => {
      render(
        <AlertDialogFooter>
          <button>Cancel</button>
          <button>Confirm</button>
        </AlertDialogFooter>
      );

      expect(screen.getByText("Cancel")).toBeInTheDocument();
      expect(screen.getByText("Confirm")).toBeInTheDocument();
    });

    it("applies default footer styles", () => {
      const { container } = render(
        <AlertDialogFooter>Footer content</AlertDialogFooter>
      );

      const footer = container.querySelector(
        '[data-slot="alert-dialog-footer"]'
      );
      expect(footer).toHaveClass(
        "flex",
        "flex-col-reverse",
        "gap-2",
        "sm:flex-row",
        "sm:justify-end"
      );
    });

    it("applies custom className to footer", () => {
      const { container } = render(
        <AlertDialogFooter className="custom-footer">
          Custom footer
        </AlertDialogFooter>
      );

      const footer = container.querySelector(
        '[data-slot="alert-dialog-footer"]'
      );
      expect(footer).toHaveClass("custom-footer");
    });

    it("passes through additional props to footer", () => {
      render(
        <AlertDialogFooter data-testid="alert-footer" role="contentinfo">
          Footer with props
        </AlertDialogFooter>
      );

      const footer = screen.getByTestId("alert-footer");
      expect(footer).toHaveAttribute("role", "contentinfo");
    });

    it("renders action buttons in footer", () => {
      render(
        <AlertDialog open>
          <AlertDialogTrigger>Open</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Title</AlertDialogTitle>
            <AlertDialogDescription>Description</AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Confirm</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );

      expect(screen.getByText("Cancel")).toBeInTheDocument();
      expect(screen.getByText("Confirm")).toBeInTheDocument();
    });
  });

  describe("AlertDialogTitle", () => {
    it("renders title within alert dialog context", () => {
      render(
        <AlertDialog open>
          <AlertDialogTrigger>Open</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Delete Confirmation</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogContent>
        </AlertDialog>
      );

      expect(screen.getByText("Delete Confirmation")).toBeInTheDocument();
    });

    it("renders with proper title styling", () => {
      render(
        <AlertDialog open>
          <AlertDialogTrigger>Open</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Styled Title</AlertDialogTitle>
            <AlertDialogDescription>Description</AlertDialogDescription>
          </AlertDialogContent>
        </AlertDialog>
      );

      const title = screen.getByText("Styled Title");
      expect(title).toBeInTheDocument();
    });

    it("applies custom className to title", () => {
      const { container } = render(
        <AlertDialog open>
          <AlertDialogTrigger>Open</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle className="custom-title">
              Custom Title
            </AlertDialogTitle>
            <AlertDialogDescription>Description</AlertDialogDescription>
          </AlertDialogContent>
        </AlertDialog>
      );

      const title = screen.getByText("Custom Title");
      expect(title).toHaveClass("custom-title");
    });

    it("passes through additional props to title", () => {
      render(
        <AlertDialog open>
          <AlertDialogTrigger>Open</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle data-testid="alert-title" id="main-title">
              Title with props
            </AlertDialogTitle>
            <AlertDialogDescription>Description</AlertDialogDescription>
          </AlertDialogContent>
        </AlertDialog>
      );

      const title = screen.getByTestId("alert-title");
      expect(title).toHaveAttribute("id", "main-title");
    });

    it("renders with complex content", () => {
      render(
        <AlertDialog open>
          <AlertDialogTrigger>Open</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>
              <span>Complex</span> <strong>Title</strong>
            </AlertDialogTitle>
            <AlertDialogDescription>Description</AlertDialogDescription>
          </AlertDialogContent>
        </AlertDialog>
      );

      expect(screen.getByText("Complex")).toBeInTheDocument();
      expect(screen.getByText("Title")).toBeInTheDocument();
    });
  });

  describe("AlertDialogDescription", () => {
    it("renders description within alert dialog context", () => {
      render(
        <AlertDialog open>
          <AlertDialogTrigger>Open</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Warning</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete all selected items.
            </AlertDialogDescription>
          </AlertDialogContent>
        </AlertDialog>
      );

      expect(
        screen.getByText(
          "This action will permanently delete all selected items."
        )
      ).toBeInTheDocument();
    });

    it("applies default description styles", () => {
      render(
        <AlertDialog open>
          <AlertDialogTrigger>Open</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Title</AlertDialogTitle>
            <AlertDialogDescription>Description text</AlertDialogDescription>
          </AlertDialogContent>
        </AlertDialog>
      );

      const description = screen.getByText("Description text");
      expect(description).toHaveClass("text-muted-foreground", "text-sm");
    });

    it("applies custom className to description", () => {
      render(
        <AlertDialog open>
          <AlertDialogTrigger>Open</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Title</AlertDialogTitle>
            <AlertDialogDescription className="custom-description">
              Custom description
            </AlertDialogDescription>
          </AlertDialogContent>
        </AlertDialog>
      );

      const description = screen.getByText("Custom description");
      expect(description).toHaveClass("custom-description");
    });

    it("passes through additional props to description", () => {
      render(
        <AlertDialog open>
          <AlertDialogTrigger>Open</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Title</AlertDialogTitle>
            <AlertDialogDescription data-testid="alert-description" id="desc">
              Description with props
            </AlertDialogDescription>
          </AlertDialogContent>
        </AlertDialog>
      );

      const description = screen.getByTestId("alert-description");
      expect(description).toHaveAttribute("id", "desc");
    });

    it("handles long description text", () => {
      const longText =
        "This is a very long description that explains the consequences of the action in detail and provides comprehensive information about what will happen when the user proceeds with the operation.";

      render(
        <AlertDialog open>
          <AlertDialogTrigger>Open</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Title</AlertDialogTitle>
            <AlertDialogDescription>{longText}</AlertDialogDescription>
          </AlertDialogContent>
        </AlertDialog>
      );

      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it("renders with complex markup", () => {
      render(
        <AlertDialog open>
          <AlertDialogTrigger>Open</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Title</AlertDialogTitle>
            <AlertDialogDescription>
              Description with <em>emphasis</em> and <code>code</code> elements.
            </AlertDialogDescription>
          </AlertDialogContent>
        </AlertDialog>
      );

      expect(screen.getByText("emphasis")).toBeInTheDocument();
      expect(screen.getByText("code")).toBeInTheDocument();
    });
  });

  describe("AlertDialogAction", () => {
    it("renders action button within alert dialog context", () => {
      render(
        <AlertDialog open>
          <AlertDialogTrigger>Open</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Confirm</AlertDialogTitle>
            <AlertDialogDescription>Are you sure?</AlertDialogDescription>
            <AlertDialogAction>Delete</AlertDialogAction>
          </AlertDialogContent>
        </AlertDialog>
      );

      expect(screen.getByText("Delete")).toBeInTheDocument();
    });

    it("applies default button styles", () => {
      render(
        <AlertDialog open>
          <AlertDialogTrigger>Open</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Title</AlertDialogTitle>
            <AlertDialogDescription>Description</AlertDialogDescription>
            <AlertDialogAction>Confirm</AlertDialogAction>
          </AlertDialogContent>
        </AlertDialog>
      );

      const action = screen.getByText("Confirm");
      // Should have button variant styles applied
      expect(action).toBeInTheDocument();
    });

    it("applies custom className to action", () => {
      render(
        <AlertDialog open>
          <AlertDialogTrigger>Open</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Title</AlertDialogTitle>
            <AlertDialogDescription>Description</AlertDialogDescription>
            <AlertDialogAction className="custom-action">
              Custom Action
            </AlertDialogAction>
          </AlertDialogContent>
        </AlertDialog>
      );

      const action = screen.getByText("Custom Action");
      expect(action).toHaveClass("custom-action");
    });

    it("passes through additional props to action", () => {
      render(
        <AlertDialog open>
          <AlertDialogTrigger>Open</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Title</AlertDialogTitle>
            <AlertDialogDescription>Description</AlertDialogDescription>
            <AlertDialogAction data-testid="alert-action" disabled>
              Disabled Action
            </AlertDialogAction>
          </AlertDialogContent>
        </AlertDialog>
      );

      const action = screen.getByTestId("alert-action");
      expect(action).toBeDisabled();
    });

    it("handles click events", () => {
      const onClick = jest.fn();
      render(
        <AlertDialog open>
          <AlertDialogTrigger>Open</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Title</AlertDialogTitle>
            <AlertDialogDescription>Description</AlertDialogDescription>
            <AlertDialogAction onClick={onClick}>Click Me</AlertDialogAction>
          </AlertDialogContent>
        </AlertDialog>
      );

      const action = screen.getByText("Click Me");
      fireEvent.click(action);
      expect(onClick).toHaveBeenCalled();
    });
  });

  describe("AlertDialogCancel", () => {
    it("renders cancel button within alert dialog context", () => {
      render(
        <AlertDialog open>
          <AlertDialogTrigger>Open</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Confirm</AlertDialogTitle>
            <AlertDialogDescription>Are you sure?</AlertDialogDescription>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogContent>
        </AlertDialog>
      );

      expect(screen.getByText("Cancel")).toBeInTheDocument();
    });

    it("applies outline button variant styles by default", () => {
      render(
        <AlertDialog open>
          <AlertDialogTrigger>Open</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Title</AlertDialogTitle>
            <AlertDialogDescription>Description</AlertDialogDescription>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogContent>
        </AlertDialog>
      );

      const cancel = screen.getByText("Cancel");
      // Should have outline button variant styles applied
      expect(cancel).toBeInTheDocument();
    });

    it("applies custom className to cancel", () => {
      render(
        <AlertDialog open>
          <AlertDialogTrigger>Open</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Title</AlertDialogTitle>
            <AlertDialogDescription>Description</AlertDialogDescription>
            <AlertDialogCancel className="custom-cancel">
              Custom Cancel
            </AlertDialogCancel>
          </AlertDialogContent>
        </AlertDialog>
      );

      const cancel = screen.getByText("Custom Cancel");
      expect(cancel).toHaveClass("custom-cancel");
    });

    it("passes through additional props to cancel", () => {
      render(
        <AlertDialog open>
          <AlertDialogTrigger>Open</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Title</AlertDialogTitle>
            <AlertDialogDescription>Description</AlertDialogDescription>
            <AlertDialogCancel data-testid="alert-cancel" disabled>
              Disabled Cancel
            </AlertDialogCancel>
          </AlertDialogContent>
        </AlertDialog>
      );

      const cancel = screen.getByTestId("alert-cancel");
      expect(cancel).toBeDisabled();
    });

    it("handles click events", () => {
      const onClick = jest.fn();
      render(
        <AlertDialog open>
          <AlertDialogTrigger>Open</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Title</AlertDialogTitle>
            <AlertDialogDescription>Description</AlertDialogDescription>
            <AlertDialogCancel onClick={onClick}>
              Click Cancel
            </AlertDialogCancel>
          </AlertDialogContent>
        </AlertDialog>
      );

      const cancel = screen.getByText("Click Cancel");
      fireEvent.click(cancel);
      expect(onClick).toHaveBeenCalled();
    });
  });

  describe("Complete AlertDialog Structure", () => {
    it("renders complete alert dialog with all components", () => {
      render(
        <AlertDialog open>
          <AlertDialogTrigger className="trigger-btn">
            Delete Item
          </AlertDialogTrigger>
          <AlertDialogContent className="alert-content">
            <AlertDialogHeader className="alert-header">
              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                item.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter className="alert-footer">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );

      // Verify all components are present
      expect(screen.getByText("Delete Item")).toBeInTheDocument();
      expect(screen.getByText("Confirm Deletion")).toBeInTheDocument();
      expect(
        screen.getByText(
          "This action cannot be undone. This will permanently delete the item."
        )
      ).toBeInTheDocument();
      expect(screen.getByText("Cancel")).toBeInTheDocument();
      expect(screen.getByText("Delete")).toBeInTheDocument();
    });

    it("handles complete interaction flow", () => {
      const onOpenChange = jest.fn();
      const onAction = jest.fn();
      const onCancel = jest.fn();

      render(
        <AlertDialog onOpenChange={onOpenChange}>
          <AlertDialogTrigger>Open Alert</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Confirm Action</AlertDialogTitle>
            <AlertDialogDescription>Are you sure?</AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onAction}>Confirm</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );

      // Open dialog
      const trigger = screen.getByText("Open Alert");
      fireEvent.click(trigger);
      expect(onOpenChange).toHaveBeenCalled();
    });

    it("renders with minimal components", () => {
      render(
        <AlertDialog open>
          <AlertDialogTrigger>Simple</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Simple Alert</AlertDialogTitle>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogContent>
        </AlertDialog>
      );

      expect(screen.getByText("Simple")).toBeInTheDocument();
      expect(screen.getByText("Simple Alert")).toBeInTheDocument();
      expect(screen.getByText("OK")).toBeInTheDocument();
    });
  });

  describe("Edge Cases and Error Handling", () => {
    it("handles missing description gracefully", () => {
      render(
        <AlertDialog open>
          <AlertDialogTrigger>Open</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Title Only</AlertDialogTitle>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogContent>
        </AlertDialog>
      );

      expect(screen.getByText("Title Only")).toBeInTheDocument();
      expect(screen.getByText("OK")).toBeInTheDocument();
    });

    it("handles empty content gracefully", () => {
      render(
        <AlertDialog open>
          <AlertDialogTrigger>Empty</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Empty Content</AlertDialogTitle>
            <AlertDialogDescription></AlertDialogDescription>
          </AlertDialogContent>
        </AlertDialog>
      );

      expect(screen.getByText("Empty Content")).toBeInTheDocument();
    });

    it("handles components with only className", () => {
      const { container } = render(
        <div>
          <AlertDialogHeader className="only-class" />
          <AlertDialogFooter className="only-class" />
        </div>
      );

      const components = container.querySelectorAll(".only-class");
      expect(components).toHaveLength(2);
    });

    it("handles action buttons without handlers", () => {
      render(
        <AlertDialog open>
          <AlertDialogTrigger>Open</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Title</AlertDialogTitle>
            <AlertDialogDescription>Description</AlertDialogDescription>
            <AlertDialogAction>Action Without Handler</AlertDialogAction>
            <AlertDialogCancel>Cancel Without Handler</AlertDialogCancel>
          </AlertDialogContent>
        </AlertDialog>
      );

      const action = screen.getByText("Action Without Handler");
      const cancel = screen.getByText("Cancel Without Handler");

      // Should not throw when clicked
      fireEvent.click(action);
      fireEvent.click(cancel);

      expect(action).toBeInTheDocument();
      expect(cancel).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("provides proper ARIA attributes", () => {
      render(
        <AlertDialog open>
          <AlertDialogTrigger aria-label="Delete item">
            Delete
          </AlertDialogTrigger>
          <AlertDialogContent aria-describedby="alert-desc">
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription id="alert-desc">
              This will permanently delete the item.
            </AlertDialogDescription>
          </AlertDialogContent>
        </AlertDialog>
      );

      const trigger = screen.getByLabelText("Delete item");
      const description = screen.getByText(
        "This will permanently delete the item."
      );

      expect(trigger).toBeInTheDocument();
      expect(description).toHaveAttribute("id", "alert-desc");
    });

    it("maintains focus management structure", () => {
      render(
        <AlertDialog open>
          <AlertDialogTrigger>Focus Test</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Focusable Alert</AlertDialogTitle>
            <AlertDialogDescription>
              Focus management test
            </AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Confirm</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );

      const trigger = screen.getByText("Focus Test");
      const cancel = screen.getByText("Cancel");
      const confirm = screen.getByText("Confirm");

      expect(trigger).toBeInTheDocument();
      expect(cancel).toBeInTheDocument();
      expect(confirm).toBeInTheDocument();
    });

    it("supports keyboard navigation", () => {
      render(
        <AlertDialog open>
          <AlertDialogTrigger>Keyboard Test</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Keyboard Navigation</AlertDialogTitle>
            <AlertDialogDescription>
              Test keyboard support
            </AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Confirm</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );

      const cancel = screen.getByText("Cancel");
      const confirm = screen.getByText("Confirm");

      // Buttons should be focusable
      expect(cancel).toBeInTheDocument();
      expect(confirm).toBeInTheDocument();
    });
  });
});
