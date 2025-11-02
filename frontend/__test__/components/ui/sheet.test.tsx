import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "../../../src/components/ui/sheet";

describe("Sheet Components", () => {
  describe("Sheet Root", () => {
    it("renders sheet root component", () => {
      render(
        <Sheet>
          <SheetTrigger>Open Sheet</SheetTrigger>
        </Sheet>
      );

      expect(screen.getByText("Open Sheet")).toBeInTheDocument();
    });

    it("handles open state changes", () => {
      const onOpenChange = jest.fn();
      render(
        <Sheet onOpenChange={onOpenChange}>
          <SheetTrigger>Open</SheetTrigger>
        </Sheet>
      );

      const trigger = screen.getByText("Open");
      fireEvent.click(trigger);

      expect(onOpenChange).toHaveBeenCalled();
    });
  });

  describe("SheetTrigger", () => {
    it("renders trigger button", () => {
      render(
        <Sheet>
          <SheetTrigger>Open Sheet</SheetTrigger>
        </Sheet>
      );

      expect(screen.getByText("Open Sheet")).toBeInTheDocument();
    });

    it("applies custom className to trigger", () => {
      render(
        <Sheet>
          <SheetTrigger className="custom-trigger">Custom Trigger</SheetTrigger>
        </Sheet>
      );

      const trigger = screen.getByText("Custom Trigger");
      expect(trigger).toHaveClass("custom-trigger");
    });

    it("passes through additional props to trigger", () => {
      render(
        <Sheet>
          <SheetTrigger data-testid="sheet-trigger" disabled>
            Disabled Trigger
          </SheetTrigger>
        </Sheet>
      );

      const trigger = screen.getByTestId("sheet-trigger");
      expect(trigger).toBeDisabled();
    });

    it("responds to click events", () => {
      render(
        <Sheet>
          <SheetTrigger>Click me</SheetTrigger>
          <SheetContent>Sheet content</SheetContent>
        </Sheet>
      );

      const trigger = screen.getByText("Click me");
      fireEvent.click(trigger);
      expect(trigger).toBeInTheDocument();
    });
  });

  describe("SheetClose", () => {
    it("renders close button within sheet context", () => {
      render(
        <Sheet open>
          <SheetTrigger>Open</SheetTrigger>
          <SheetContent>
            <SheetClose>Close Sheet</SheetClose>
          </SheetContent>
        </Sheet>
      );

      expect(screen.getByText("Close Sheet")).toBeInTheDocument();
    });

    it("applies custom className to close button", () => {
      render(
        <Sheet open>
          <SheetTrigger>Open</SheetTrigger>
          <SheetContent>
            <SheetClose className="custom-close">Close Sheet</SheetClose>
          </SheetContent>
        </Sheet>
      );

      const close = screen.getByText("Close Sheet");
      expect(close).toHaveClass("custom-close");
    });

    it("passes through additional props to close button", () => {
      render(
        <Sheet open>
          <SheetTrigger>Open</SheetTrigger>
          <SheetContent>
            <SheetClose data-testid="close-btn">Close Sheet</SheetClose>
          </SheetContent>
        </Sheet>
      );

      const close = screen.getByTestId("close-btn");
      expect(close).toBeInTheDocument();
    });
  });

  describe("SheetContent", () => {
    it("renders content when sheet is open", () => {
      render(
        <Sheet open>
          <SheetTrigger>Open</SheetTrigger>
          <SheetContent>Default content</SheetContent>
        </Sheet>
      );

      expect(screen.getByText("Default content")).toBeInTheDocument();
    });

    it("renders content with different sides", () => {
      const sides = ["top", "right", "bottom", "left"] as const;

      sides.forEach((side) => {
        const { unmount } = render(
          <Sheet open>
            <SheetTrigger>Open {side}</SheetTrigger>
            <SheetContent side={side}>Content for {side}</SheetContent>
          </Sheet>
        );

        expect(screen.getByText(`Content for ${side}`)).toBeInTheDocument();
        unmount();
      });
    });

    it("applies custom className to content", () => {
      render(
        <Sheet open>
          <SheetTrigger>Open</SheetTrigger>
          <SheetContent className="custom-content">Custom content</SheetContent>
        </Sheet>
      );

      const content = screen.getByText("Custom content");
      expect(content.closest('[class*="custom-content"]')).toBeInTheDocument();
    });

    it("passes additional props to content", () => {
      render(
        <Sheet open>
          <SheetTrigger>Open</SheetTrigger>
          <SheetContent data-testid="sheet-content" aria-label="Custom sheet">
            Test content
          </SheetContent>
        </Sheet>
      );

      const content = screen.getByTestId("sheet-content");
      expect(content).toHaveAttribute("aria-label", "Custom sheet");
    });
  });

  describe("SheetHeader", () => {
    it("renders header with content", () => {
      render(<SheetHeader>Header content</SheetHeader>);

      expect(screen.getByText("Header content")).toBeInTheDocument();
    });

    it("applies custom className to header", () => {
      render(
        <SheetHeader className="custom-header">Custom header</SheetHeader>
      );

      const header = screen.getByText("Custom header");
      expect(header).toHaveClass("custom-header");
    });

    it("passes through additional props to header", () => {
      render(
        <SheetHeader data-testid="sheet-header" role="banner">
          Header with props
        </SheetHeader>
      );

      const header = screen.getByTestId("sheet-header");
      expect(header).toHaveAttribute("role", "banner");
    });

    it("renders nested components in header within sheet context", () => {
      render(
        <Sheet open>
          <SheetTrigger>Open</SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Test Title</SheetTitle>
              <SheetDescription>Test Description</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      );

      expect(screen.getByText("Test Title")).toBeInTheDocument();
      expect(screen.getByText("Test Description")).toBeInTheDocument();
    });
  });

  describe("SheetFooter", () => {
    it("renders footer with content", () => {
      render(<SheetFooter>Footer content</SheetFooter>);

      expect(screen.getByText("Footer content")).toBeInTheDocument();
    });

    it("applies custom className to footer", () => {
      render(
        <SheetFooter className="custom-footer">Custom footer</SheetFooter>
      );

      const footer = screen.getByText("Custom footer");
      expect(footer).toHaveClass("custom-footer");
    });

    it("passes through additional props to footer", () => {
      render(
        <SheetFooter data-testid="sheet-footer" role="contentinfo">
          Footer with props
        </SheetFooter>
      );

      const footer = screen.getByTestId("sheet-footer");
      expect(footer).toHaveAttribute("role", "contentinfo");
    });

    it("renders button elements in footer", () => {
      render(
        <SheetFooter>
          <button>Cancel</button>
          <button>Save</button>
        </SheetFooter>
      );

      expect(screen.getByText("Cancel")).toBeInTheDocument();
      expect(screen.getByText("Save")).toBeInTheDocument();
    });
  });

  describe("SheetTitle", () => {
    it("renders title within sheet context", () => {
      render(
        <Sheet open>
          <SheetTrigger>Open</SheetTrigger>
          <SheetContent>
            <SheetTitle>Sheet Title</SheetTitle>
          </SheetContent>
        </Sheet>
      );

      expect(screen.getByText("Sheet Title")).toBeInTheDocument();
    });

    it("applies custom className to title", () => {
      render(
        <Sheet open>
          <SheetTrigger>Open</SheetTrigger>
          <SheetContent>
            <SheetTitle className="custom-title">Custom Title</SheetTitle>
          </SheetContent>
        </Sheet>
      );

      const title = screen.getByText("Custom Title");
      expect(title).toHaveClass("custom-title");
    });

    it("passes through additional props to title", () => {
      render(
        <Sheet open>
          <SheetTrigger>Open</SheetTrigger>
          <SheetContent>
            <SheetTitle data-testid="sheet-title" id="main-title">
              Title with props
            </SheetTitle>
          </SheetContent>
        </Sheet>
      );

      const title = screen.getByTestId("sheet-title");
      expect(title).toHaveAttribute("id", "main-title");
    });
  });

  describe("SheetDescription", () => {
    it("renders description within sheet context", () => {
      render(
        <Sheet open>
          <SheetTrigger>Open</SheetTrigger>
          <SheetContent>
            <SheetDescription>Sheet description text</SheetDescription>
          </SheetContent>
        </Sheet>
      );

      expect(screen.getByText("Sheet description text")).toBeInTheDocument();
    });

    it("applies custom className to description", () => {
      render(
        <Sheet open>
          <SheetTrigger>Open</SheetTrigger>
          <SheetContent>
            <SheetDescription className="custom-description">
              Custom description
            </SheetDescription>
          </SheetContent>
        </Sheet>
      );

      const description = screen.getByText("Custom description");
      expect(description).toHaveClass("custom-description");
    });

    it("passes through additional props to description", () => {
      render(
        <Sheet open>
          <SheetTrigger>Open</SheetTrigger>
          <SheetContent>
            <SheetDescription data-testid="sheet-description" id="desc">
              Description with props
            </SheetDescription>
          </SheetContent>
        </Sheet>
      );

      const description = screen.getByTestId("sheet-description");
      expect(description).toHaveAttribute("id", "desc");
    });

    it("handles long description text", () => {
      const longText =
        "This is a very long description that should be rendered properly and maintain its formatting and readability even with extensive content.";

      render(
        <Sheet open>
          <SheetTrigger>Open</SheetTrigger>
          <SheetContent>
            <SheetDescription>{longText}</SheetDescription>
          </SheetContent>
        </Sheet>
      );

      expect(screen.getByText(longText)).toBeInTheDocument();
    });
  });

  describe("Complete Sheet Structure", () => {
    it("renders complete sheet with all components", () => {
      render(
        <Sheet open>
          <SheetTrigger className="trigger-btn">
            Open Complete Sheet
          </SheetTrigger>
          <SheetContent side="right" className="sheet-content">
            <SheetHeader className="sheet-header">
              <SheetTitle>Complete Sheet Title</SheetTitle>
              <SheetDescription>
                This is a complete sheet with all components.
              </SheetDescription>
            </SheetHeader>

            <div className="sheet-body">Main content area</div>

            <SheetFooter className="sheet-footer">
              <SheetClose>Cancel</SheetClose>
              <button>Save Changes</button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      );

      // Verify content
      expect(screen.getByText("Open Complete Sheet")).toBeInTheDocument();
      expect(screen.getByText("Complete Sheet Title")).toBeInTheDocument();
      expect(
        screen.getByText("This is a complete sheet with all components.")
      ).toBeInTheDocument();
      expect(screen.getByText("Main content area")).toBeInTheDocument();
      expect(screen.getByText("Cancel")).toBeInTheDocument();
      expect(screen.getByText("Save Changes")).toBeInTheDocument();
    });

    it("handles sheet with minimal components", () => {
      render(
        <Sheet>
          <SheetTrigger>Simple</SheetTrigger>
          <SheetContent>Simple content</SheetContent>
        </Sheet>
      );

      expect(screen.getByText("Simple")).toBeInTheDocument();
    });
  });

  describe("Interaction and Event Handling", () => {
    it("handles trigger click interactions", () => {
      const onOpenChange = jest.fn();

      render(
        <Sheet onOpenChange={onOpenChange}>
          <SheetTrigger>Interactive Trigger</SheetTrigger>
          <SheetContent>Content</SheetContent>
        </Sheet>
      );

      const trigger = screen.getByText("Interactive Trigger");
      fireEvent.click(trigger);

      expect(onOpenChange).toHaveBeenCalled();
    });

    it("handles close button interactions", () => {
      render(
        <Sheet open>
          <SheetTrigger>Open</SheetTrigger>
          <SheetContent>
            <SheetClose>Close Sheet</SheetClose>
          </SheetContent>
        </Sheet>
      );

      const closeButton = screen.getByText("Close Sheet");
      fireEvent.click(closeButton);

      expect(closeButton).toBeInTheDocument();
    });
  });

  describe("Edge Cases and Error Handling", () => {
    it("handles empty content gracefully", () => {
      render(
        <Sheet open>
          <SheetTrigger>Empty</SheetTrigger>
          <SheetContent></SheetContent>
        </Sheet>
      );

      expect(screen.getByText("Empty")).toBeInTheDocument();
    });

    it("handles missing title or description", () => {
      render(
        <Sheet open>
          <SheetTrigger>Open</SheetTrigger>
          <SheetContent>
            <SheetHeader>{/* No title or description */}</SheetHeader>
          </SheetContent>
        </Sheet>
      );

      expect(screen.getByText("Open")).toBeInTheDocument();
    });

    it("handles components with only className", () => {
      render(
        <div>
          <SheetHeader className="only-class" />
          <SheetFooter className="only-class" />
        </div>
      );

      const header = document.getElementsByClassName("only-class")[0];
      expect(header).toBeInTheDocument();
    });

    it("handles components with complex children", () => {
      render(
        <Sheet open>
          <SheetTrigger>
            <span>Complex</span> <strong>Trigger</strong>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>
                <span>Complex</span> Title
              </SheetTitle>
              <SheetDescription>
                Description with <em>emphasis</em> and <code>code</code>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      );

      expect(screen.getByText("Trigger")).toBeInTheDocument();
      expect(screen.getByText("emphasis")).toBeInTheDocument();
      expect(screen.getByText("code")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("supports aria labels and descriptions", () => {
      render(
        <Sheet open>
          <SheetTrigger aria-label="Open settings">Settings</SheetTrigger>
          <SheetContent aria-describedby="sheet-desc">
            <SheetDescription id="sheet-desc">
              Settings description
            </SheetDescription>
          </SheetContent>
        </Sheet>
      );

      const trigger = screen.getByLabelText("Open settings");
      const content = screen.getByText("Settings description");

      expect(trigger).toBeInTheDocument();
      expect(content).toHaveAttribute("id", "sheet-desc");
    });

    it("maintains focus management structure", () => {
      render(
        <Sheet open>
          <SheetTrigger>Focus Test</SheetTrigger>
          <SheetContent>
            <SheetTitle>Focusable Title</SheetTitle>
            <button>Focusable Button</button>
            <SheetClose>Close Sheet</SheetClose>
          </SheetContent>
        </Sheet>
      );

      const trigger = screen.getByText("Focus Test");
      const button = screen.getByText("Focusable Button");
      const close = screen.getByText("Close Sheet");

      expect(trigger).toBeInTheDocument();
      expect(button).toBeInTheDocument();
      expect(close).toBeInTheDocument();
    });
  });
});
