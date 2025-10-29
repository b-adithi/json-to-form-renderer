import { render, screen, fireEvent } from "@testing-library/react";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "../../../src/components/ui/collapsible";

describe("Collapsible Components", () => {
  describe("Collapsible", () => {
    it("renders root element with correct attributes", () => {
      const { container } = render(<Collapsible />);
      const collapsible = container.querySelector('[data-slot="collapsible"]');
      expect(collapsible).toBeInTheDocument();
    });

    it("passes through additional props", () => {
      render(<Collapsible data-testid="collapsible-root" />);
      expect(screen.getByTestId("collapsible-root")).toBeInTheDocument();
    });

    it("accepts defaultOpen prop", () => {
      const { container } = render(<Collapsible defaultOpen={true} />);
      const collapsible = container.querySelector('[data-slot="collapsible"]');
      expect(collapsible).toBeInTheDocument();
      expect(collapsible).toHaveAttribute("data-state", "open");
    });

    it("starts closed by default", () => {
      const { container } = render(<Collapsible />);
      const collapsible = container.querySelector('[data-slot="collapsible"]');
      expect(collapsible).toHaveAttribute("data-state", "closed");
    });
  });

  describe("CollapsibleTrigger", () => {
    it("renders trigger button with correct attributes", () => {
      render(
        <Collapsible>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        </Collapsible>
      );
      const trigger = screen.getByRole("button");
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveAttribute("data-slot", "collapsible-trigger");
      expect(trigger).toHaveAttribute("type", "button");
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    it("renders trigger content", () => {
      render(
        <Collapsible>
          <CollapsibleTrigger>Toggle Content</CollapsibleTrigger>
        </Collapsible>
      );
      expect(screen.getByText("Toggle Content")).toBeInTheDocument();
    });

    it("passes through additional props", () => {
      render(
        <Collapsible>
          <CollapsibleTrigger className="custom-trigger" data-testid="trigger">
            Toggle
          </CollapsibleTrigger>
        </Collapsible>
      );
      const trigger = screen.getByTestId("trigger");
      expect(trigger).toHaveClass("custom-trigger");
    });
  });

  describe("CollapsibleContent", () => {
    it("renders content element with correct attributes", () => {
      const { container } = render(
        <Collapsible defaultOpen={true}>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );
      const content = container.querySelector('[data-slot="collapsible-content"]');
      expect(content).toBeInTheDocument();
      expect(content).toHaveAttribute("data-state", "open");
    });

    it("renders content text", () => {
      render(
        <Collapsible defaultOpen={true}>
          <CollapsibleContent>Hidden Content</CollapsibleContent>
        </Collapsible>
      );
      expect(screen.getByText("Hidden Content")).toBeInTheDocument();
    });

    it("passes through additional props", () => {
      render(
        <Collapsible defaultOpen={true}>
          <CollapsibleContent className="custom-content" data-testid="content">
            Content
          </CollapsibleContent>
        </Collapsible>
      );
      const content = screen.getByTestId("content");
      expect(content).toHaveClass("custom-content");
    });
  });

  describe("Collapsible Functionality", () => {
    it("toggles content visibility when trigger is clicked", async () => {
      const { container } = render(
        <Collapsible>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Collapsible Content</CollapsibleContent>
        </Collapsible>
      );

      const trigger = screen.getByRole("button");
      const collapsible = container.querySelector('[data-slot="collapsible"]');
      
      // Initially closed
      expect(collapsible).toHaveAttribute("data-state", "closed");
      expect(trigger).toHaveAttribute("aria-expanded", "false");

      // Click to open
      fireEvent.click(trigger);
      expect(collapsible).toHaveAttribute("data-state", "open");
      expect(trigger).toHaveAttribute("aria-expanded", "true");

      // Click to close
      fireEvent.click(trigger);
      expect(collapsible).toHaveAttribute("data-state", "closed");
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    it("starts open when defaultOpen is true", () => {
      const { container } = render(
        <Collapsible defaultOpen={true}>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );

      const trigger = screen.getByRole("button");
      const collapsible = container.querySelector('[data-slot="collapsible"]');
      
      expect(collapsible).toHaveAttribute("data-state", "open");
      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });

    it("calls onOpenChange when state changes", async () => {
      const onOpenChange = jest.fn();
      
      render(
        <Collapsible onOpenChange={onOpenChange}>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );

      const trigger = screen.getByRole("button");
      
      fireEvent.click(trigger);
      expect(onOpenChange).toHaveBeenCalledWith(true);
      
      fireEvent.click(trigger);
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("supports controlled state with open prop", async () => {
      const onOpenChange = jest.fn();
      
      const { rerender } = render(
        <Collapsible open={false} onOpenChange={onOpenChange}>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );

      const trigger = screen.getByRole("button");
      expect(trigger).toHaveAttribute("aria-expanded", "false");

      // Click trigger - should call onOpenChange but not change state until prop changes
      fireEvent.click(trigger);
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(trigger).toHaveAttribute("aria-expanded", "false"); // Still false until parent updates

      // Simulate parent updating the prop
      rerender(
        <Collapsible open={true} onOpenChange={onOpenChange}>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );

      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });

    it("handles disabled state", () => {
      render(
        <Collapsible disabled>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );

      const trigger = screen.getByRole("button");
      expect(trigger).toBeDisabled();
    });
  });

  describe("Complete Collapsible Example", () => {
    it("renders a complete collapsible structure", () => {
      const { container } = render(
        <Collapsible className="border rounded-md" defaultOpen={true}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4">
            <span>Expand Section</span>
            <span>⌄</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="p-4 border-t">
            <p>This is the collapsible content that can be shown or hidden.</p>
            <ul>
              <li>Item 1</li>
              <li>Item 2</li>
              <li>Item 3</li>
            </ul>
          </CollapsibleContent>
        </Collapsible>
      );

      // Verify root structure
      const collapsible = container.querySelector('[data-slot="collapsible"]');
      expect(collapsible).toHaveClass("border", "rounded-md");
      expect(collapsible).toHaveAttribute("data-state", "open");

      // Verify trigger
      const trigger = screen.getByRole("button");
      expect(trigger).toHaveClass("flex", "items-center", "justify-between", "w-full", "p-4");
      expect(trigger).toHaveAttribute("aria-expanded", "true");

      // Verify content is visible
      expect(screen.getByText("Expand Section")).toBeInTheDocument();
      expect(screen.getByText("This is the collapsible content that can be shown or hidden.")).toBeInTheDocument();
      expect(screen.getByText("Item 1")).toBeInTheDocument();
      expect(screen.getByText("Item 2")).toBeInTheDocument();
      expect(screen.getByText("Item 3")).toBeInTheDocument();
    });
  });
});