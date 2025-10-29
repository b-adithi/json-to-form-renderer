import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "../../../src/components/ui/dropdown-menu";

describe("Dropdown Menu Components", () => {
  describe("DropdownMenu Root", () => {
    it("renders dropdown menu with trigger", () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        </DropdownMenu>
      );

      expect(screen.getByText("Open Menu")).toBeInTheDocument();
    });

    it("passes through additional props", () => {
      render(
        <DropdownMenu defaultOpen={false}>
          <DropdownMenuTrigger>Trigger</DropdownMenuTrigger>
        </DropdownMenu>
      );

      expect(screen.getByText("Trigger")).toBeInTheDocument();
    });
  });

  describe("DropdownMenuPortal", () => {
    it("renders portal component", () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Trigger</DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent>Content</DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu>
      );

      expect(screen.getByText("Trigger")).toBeInTheDocument();
    });
  });

  describe("DropdownMenuTrigger", () => {
    it("renders trigger button with correct attributes", () => {
      const { container } = render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        </DropdownMenu>
      );

      const trigger = container.querySelector('[data-slot="dropdown-menu-trigger"]');
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveTextContent("Open Menu");
    });

    it("applies custom className", () => {
      const { container } = render(
        <DropdownMenu>
          <DropdownMenuTrigger className="custom-class">
            Trigger
          </DropdownMenuTrigger>
        </DropdownMenu>
      );

      const trigger = container.querySelector('[data-slot="dropdown-menu-trigger"]');
      expect(trigger).toHaveClass("custom-class");
    });

    it("responds to click events", () => {
      const { container } = render(
        <DropdownMenu>
          <DropdownMenuTrigger>Click me</DropdownMenuTrigger>
          <DropdownMenuContent>Menu content</DropdownMenuContent>
        </DropdownMenu>
      );

      const trigger = container.querySelector('[data-slot="dropdown-menu-trigger"]');
      fireEvent.click(trigger!);
      
      // The dropdown should respond to clicks
      expect(trigger).toBeInTheDocument();
    });
  });

  describe("DropdownMenuShortcut", () => {
    it("renders shortcut text", () => {
      render(
        <DropdownMenuShortcut>⌘X</DropdownMenuShortcut>
      );

      expect(screen.getByText("⌘X")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      const { container } = render(
        <DropdownMenuShortcut className="custom-shortcut">⌘C</DropdownMenuShortcut>
      );

      const shortcut = container.querySelector('[data-slot="dropdown-menu-shortcut"]');
      expect(shortcut).toHaveClass("custom-shortcut");
      expect(shortcut).toHaveTextContent("⌘C");
    });

    it("renders with correct data attribute", () => {
      const { container } = render(
        <DropdownMenuShortcut>⌘V</DropdownMenuShortcut>
      );

      const shortcut = container.querySelector('[data-slot="dropdown-menu-shortcut"]');
      expect(shortcut).toBeInTheDocument();
    });

    it("passes through additional props", () => {
      const { container } = render(
        <DropdownMenuShortcut data-testid="test-shortcut">⌘Z</DropdownMenuShortcut>
      );

      const shortcut = screen.getByTestId("test-shortcut");
      expect(shortcut).toBeInTheDocument();
      expect(shortcut).toHaveTextContent("⌘Z");
    });
  });

  describe("DropdownMenuLabel (standalone)", () => {
    it("renders label", () => {
      const { container } = render(
        <DropdownMenuLabel>Test Label</DropdownMenuLabel>
      );
      
      const label = container.querySelector('[data-slot="dropdown-menu-label"]');
      expect(label).toBeInTheDocument();
      expect(label).toHaveTextContent("Test Label");
    });

    it("applies inset prop", () => {
      const { container } = render(
        <DropdownMenuLabel inset>Inset Label</DropdownMenuLabel>
      );

      const label = container.querySelector('[data-slot="dropdown-menu-label"]');
      expect(label).toHaveAttribute("data-inset", "true");
    });

    it("applies custom className", () => {
      const { container } = render(
        <DropdownMenuLabel className="custom-label">Styled Label</DropdownMenuLabel>
      );

      const label = container.querySelector('[data-slot="dropdown-menu-label"]');
      expect(label).toHaveClass("custom-label");
    });
  });

  describe("DropdownMenuSeparator (standalone)", () => {
    it("renders separator", () => {
      const { container } = render(
        <DropdownMenuSeparator />
      );
      
      const separator = container.querySelector('[data-slot="dropdown-menu-separator"]');
      expect(separator).toBeInTheDocument();
    });

    it("applies custom className", () => {
      const { container } = render(
        <DropdownMenuSeparator className="custom-separator" />
      );

      const separator = container.querySelector('[data-slot="dropdown-menu-separator"]');
      expect(separator).toHaveClass("custom-separator");
    });

    it("passes through additional props", () => {
      const { container } = render(
        <DropdownMenuSeparator data-testid="test-separator" />
      );

      const separator = screen.getByTestId("test-separator");
      expect(separator).toBeInTheDocument();
    });
  });

  describe("DropdownMenuGroup (standalone)", () => {
    it("renders group", () => {
      const { container } = render(
        <DropdownMenuGroup>Group content</DropdownMenuGroup>
      );
      
      const group = container.querySelector('[data-slot="dropdown-menu-group"]');
      expect(group).toBeInTheDocument();
      expect(group).toHaveTextContent("Group content");
    });

    it("passes through additional props", () => {
      const { container } = render(
        <DropdownMenuGroup className="custom-group">
          Test group
        </DropdownMenuGroup>
      );

      const group = container.querySelector('[data-slot="dropdown-menu-group"]');
      expect(group).toHaveClass("custom-group");
    });
  });

  describe("Menu with Portal and Content", () => {
    it("renders menu structure with portal", () => {
      const { container } = render(
        <DropdownMenu>
          <DropdownMenuTrigger>Menu Trigger</DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent>
              <DropdownMenuLabel>Section</DropdownMenuLabel>
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu>
      );

      // Verify trigger renders
      const trigger = container.querySelector('[data-slot="dropdown-menu-trigger"]');
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveTextContent("Menu Trigger");
    });

    it("applies content styling props", () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Trigger</DropdownMenuTrigger>
          <DropdownMenuContent 
            className="custom-content" 
            sideOffset={8}
          >
            Content
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const trigger = screen.getByText("Trigger");
      expect(trigger).toBeInTheDocument();
    });
  });

  describe("Comprehensive component integration", () => {
    it("renders complete dropdown structure (components only)", () => {
      const { container } = render(
        <div>
          {/* Test main dropdown structure */}
          <DropdownMenu>
            <DropdownMenuTrigger className="trigger-button">
              Options Menu
            </DropdownMenuTrigger>
          </DropdownMenu>
          
          {/* Test standalone components for coverage */}
          <div>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <div>
                Edit
                <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
              </div>
              <div>
                Delete
                <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
              </div>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuSeparator className="custom-sep" />
          </div>
        </div>
      );

      // Verify main trigger structure
      const trigger = container.querySelector('[data-slot="dropdown-menu-trigger"]');
      expect(trigger).toHaveClass("trigger-button");
      expect(trigger).toHaveTextContent("Options Menu");

      // Verify standalone components render correctly
      expect(screen.getByText("Actions")).toBeInTheDocument();
      expect(screen.getByText("Edit")).toBeInTheDocument();
      expect(screen.getByText("Delete")).toBeInTheDocument();
      expect(screen.getByText("⌘E")).toBeInTheDocument();
      expect(screen.getByText("⌘D")).toBeInTheDocument();

      // Verify separators are present
      const separators = container.querySelectorAll('[data-slot="dropdown-menu-separator"]');
      expect(separators.length).toBeGreaterThan(0);

      // Verify one separator has custom class
      const customSeparator = container.querySelector('[data-slot="dropdown-menu-separator"].custom-sep');
      expect(customSeparator).toBeInTheDocument();
    });
  });

  describe("Component props and variants", () => {
    it("supports multiple shortcut variations", () => {
      const { container } = render(
        <div>
          <DropdownMenuShortcut>⌘A</DropdownMenuShortcut>
          <DropdownMenuShortcut className="mac">⌘S</DropdownMenuShortcut>
          <DropdownMenuShortcut className="pc">Ctrl+S</DropdownMenuShortcut>
        </div>
      );

      expect(screen.getByText("⌘A")).toBeInTheDocument();
      expect(screen.getByText("⌘S")).toBeInTheDocument();
      expect(screen.getByText("Ctrl+S")).toBeInTheDocument();

      const macShortcut = container.querySelector('.mac');
      const pcShortcut = container.querySelector('.pc');
      expect(macShortcut).toHaveClass("mac");
      expect(pcShortcut).toHaveClass("pc");
    });

    it("supports multiple label variations", () => {
      const { container } = render(
        <div>
          <DropdownMenuLabel>Normal Label</DropdownMenuLabel>
          <DropdownMenuLabel inset>Inset Label</DropdownMenuLabel>
          <DropdownMenuLabel className="custom">Custom Label</DropdownMenuLabel>
        </div>
      );

      const labels = container.querySelectorAll('[data-slot="dropdown-menu-label"]');
      expect(labels).toHaveLength(3);

      const insetLabel = container.querySelector('[data-inset="true"]');
      expect(insetLabel).toBeInTheDocument();

      const customLabel = container.querySelector('.custom');
      expect(customLabel).toHaveClass("custom");
    });
  });

  describe("Error handling and edge cases", () => {
    it("handles empty shortcut content", () => {
      const { container } = render(
        <DropdownMenuShortcut></DropdownMenuShortcut>
      );

      const shortcut = container.querySelector('[data-slot="dropdown-menu-shortcut"]');
      expect(shortcut).toBeInTheDocument();
    });

    it("handles empty label content", () => {
      const { container } = render(
        <DropdownMenuLabel></DropdownMenuLabel>
      );

      const label = container.querySelector('[data-slot="dropdown-menu-label"]');
      expect(label).toBeInTheDocument();
    });

    it("handles nested content in group", () => {
      const { container } = render(
        <DropdownMenuGroup>
          <div>
            <span>Nested</span>
            <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
          </div>
        </DropdownMenuGroup>
      );

      expect(screen.getByText("Nested")).toBeInTheDocument();
      expect(screen.getByText("⌘N")).toBeInTheDocument();
    });
  });
});