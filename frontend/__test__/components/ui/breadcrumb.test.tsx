import { render, screen } from "@testing-library/react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "../../../src/components/ui/breadcrumb";

describe("Breadcrumb Components", () => {
  describe("Breadcrumb", () => {
    it("renders nav element with correct attributes", () => {
      render(<Breadcrumb />);
      const nav = screen.getByRole("navigation");
      expect(nav).toBeInTheDocument();
      expect(nav).toHaveAttribute("aria-label", "breadcrumb");
      expect(nav).toHaveAttribute("data-slot", "breadcrumb");
    });

    it("passes through additional props", () => {
      render(<Breadcrumb className="custom-class" id="breadcrumb-nav" />);
      const nav = screen.getByRole("navigation");
      expect(nav).toHaveClass("custom-class");
      expect(nav).toHaveAttribute("id", "breadcrumb-nav");
    });
  });

  describe("BreadcrumbList", () => {
    it("renders ordered list with correct classes", () => {
      render(<BreadcrumbList />);
      const list = screen.getByRole("list");
      expect(list).toBeInTheDocument();
      expect(list).toHaveAttribute("data-slot", "breadcrumb-list");
      expect(list).toHaveClass(
        "text-muted-foreground",
        "flex",
        "flex-wrap",
        "items-center",
        "gap-1.5",
        "text-sm",
        "break-words",
        "sm:gap-2.5"
      );
    });

    it("merges custom className with default classes", () => {
      render(<BreadcrumbList className="custom-list-class" />);
      const list = screen.getByRole("list");
      expect(list).toHaveClass("custom-list-class");
      expect(list).toHaveClass("text-muted-foreground"); // Still has default classes
    });

    it("passes through additional props", () => {
      render(<BreadcrumbList data-testid="breadcrumb-list" />);
      expect(screen.getByTestId("breadcrumb-list")).toBeInTheDocument();
    });
  });

  describe("BreadcrumbItem", () => {
    it("renders list item with correct classes", () => {
      render(
        <BreadcrumbList>
          <BreadcrumbItem>Item</BreadcrumbItem>
        </BreadcrumbList>
      );
      const listItem = screen.getByRole("listitem");
      expect(listItem).toBeInTheDocument();
      expect(listItem).toHaveAttribute("data-slot", "breadcrumb-item");
      expect(listItem).toHaveClass("inline-flex", "items-center", "gap-1.5");
    });

    it("merges custom className with default classes", () => {
      render(
        <BreadcrumbList>
          <BreadcrumbItem className="custom-item-class">Item</BreadcrumbItem>
        </BreadcrumbList>
      );
      const listItem = screen.getByRole("listitem");
      expect(listItem).toHaveClass("custom-item-class");
      expect(listItem).toHaveClass("inline-flex"); // Still has default classes
    });

    it("renders children content", () => {
      render(
        <BreadcrumbList>
          <BreadcrumbItem>Custom Content</BreadcrumbItem>
        </BreadcrumbList>
      );
      expect(screen.getByText("Custom Content")).toBeInTheDocument();
    });
  });

  describe("BreadcrumbLink", () => {
    it("renders anchor element by default", () => {
      render(<BreadcrumbLink href="/test">Test Link</BreadcrumbLink>);
      const link = screen.getByRole("link");
      expect(link).toBeInTheDocument();
      expect(link.tagName).toBe("A");
      expect(link).toHaveAttribute("href", "/test");
      expect(link).toHaveAttribute("data-slot", "breadcrumb-link");
      expect(link).toHaveClass("hover:text-foreground", "transition-colors");
    });

    it("merges custom className with default classes", () => {
      render(<BreadcrumbLink href="/test" className="custom-link-class">Link</BreadcrumbLink>);
      const link = screen.getByRole("link");
      expect(link).toHaveClass("custom-link-class");
      expect(link).toHaveClass("hover:text-foreground"); // Still has default classes
    });

    it("renders as Slot when asChild is true", () => {
      render(
        <BreadcrumbLink asChild>
          <button>Custom Element</button>
        </BreadcrumbLink>
      );
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute("data-slot", "breadcrumb-link");
    });

    it("renders link content", () => {
      render(<BreadcrumbLink>Link Text</BreadcrumbLink>);
      expect(screen.getByText("Link Text")).toBeInTheDocument();
    });
  });

  describe("BreadcrumbPage", () => {
    it("renders span element with correct attributes", () => {
      render(<BreadcrumbPage>Current Page</BreadcrumbPage>);
      const page = screen.getByText("Current Page");
      expect(page).toBeInTheDocument();
      expect(page.tagName).toBe("SPAN");
      expect(page).toHaveAttribute("data-slot", "breadcrumb-page");
      expect(page).toHaveAttribute("role", "link");
      expect(page).toHaveAttribute("aria-disabled", "true");
      expect(page).toHaveAttribute("aria-current", "page");
      expect(page).toHaveClass("text-foreground", "font-normal");
    });

    it("merges custom className with default classes", () => {
      render(<BreadcrumbPage className="custom-page-class">Page</BreadcrumbPage>);
      const page = screen.getByText("Page");
      expect(page).toHaveClass("custom-page-class");
      expect(page).toHaveClass("text-foreground"); // Still has default classes
    });

    it("renders page content", () => {
      render(<BreadcrumbPage>Current Page Content</BreadcrumbPage>);
      expect(screen.getByText("Current Page Content")).toBeInTheDocument();
    });
  });

  describe("BreadcrumbSeparator", () => {
    it("renders list item with ChevronRight icon by default", () => {
      const { container } = render(
        <BreadcrumbList>
          <BreadcrumbSeparator />
        </BreadcrumbList>
      );
      const separator = container.querySelector('[data-slot="breadcrumb-separator"]');
      expect(separator).toBeInTheDocument();
      expect(separator?.tagName).toBe("LI");
      expect(separator).toHaveAttribute("aria-hidden", "true");
      expect(separator).toHaveClass("[&>svg]:size-3.5");
      
      // ChevronRight icon should be present
      const svg = separator?.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("renders custom children instead of default icon", () => {
      render(
        <BreadcrumbList>
          <BreadcrumbSeparator>
            <span data-testid="custom-separator">/</span>
          </BreadcrumbSeparator>
        </BreadcrumbList>
      );
      expect(screen.getByTestId("custom-separator")).toBeInTheDocument();
      expect(screen.getByText("/")).toBeInTheDocument();
    });

    it("merges custom className with default classes", () => {
      const { container } = render(
        <BreadcrumbList>
          <BreadcrumbSeparator className="custom-separator-class" />
        </BreadcrumbList>
      );
      const separator = container.querySelector('[data-slot="breadcrumb-separator"]');
      expect(separator).toHaveClass("custom-separator-class");
      expect(separator).toHaveClass("[&>svg]:size-3.5"); // Still has default classes
    });
  });

  describe("BreadcrumbEllipsis", () => {
    it("renders span element with MoreHorizontal icon", () => {
      const { container } = render(<BreadcrumbEllipsis />);
      const ellipsis = container.querySelector('[data-slot="breadcrumb-ellipsis"]');
      expect(ellipsis).toBeInTheDocument();
      expect(ellipsis?.tagName).toBe("SPAN");
      expect(ellipsis).toHaveAttribute("aria-hidden", "true");
      expect(ellipsis).toHaveClass(
        "flex",
        "size-9",
        "items-center",
        "justify-center"
      );
      
      // MoreHorizontal icon should be present
      const svg = ellipsis?.querySelector("svg");
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveClass("size-4");
      
      // Screen reader text should be present
      expect(screen.getByText("More")).toBeInTheDocument();
      const srText = screen.getByText("More");
      expect(srText).toHaveClass("sr-only");
    });

    it("merges custom className with default classes", () => {
      const { container } = render(<BreadcrumbEllipsis className="custom-ellipsis-class" />);
      const ellipsis = container.querySelector('[data-slot="breadcrumb-ellipsis"]');
      expect(ellipsis).toHaveClass("custom-ellipsis-class");
      expect(ellipsis).toHaveClass("flex"); // Still has default classes
    });

    it("passes through additional props", () => {
      render(<BreadcrumbEllipsis data-testid="ellipsis" />);
      expect(screen.getByTestId("ellipsis")).toBeInTheDocument();
    });
  });

  describe("Complete Breadcrumb Example", () => {
    it("renders a complete breadcrumb navigation", () => {
      const { container } = render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/docs">Documentation</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbEllipsis />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Current Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );

      // Verify navigation structure
      const navigation = screen.getByRole("navigation");
      expect(navigation).toBeInTheDocument();

      // Verify links
      expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
      expect(screen.getByRole("link", { name: "Documentation" })).toHaveAttribute("href", "/docs");

      // Verify current page
      const currentPage = screen.getByText("Current Page");
      expect(currentPage).toHaveAttribute("aria-current", "page");

      // Verify separators and ellipsis using querySelector
      const separators = container.querySelectorAll('[data-slot="breadcrumb-separator"]');
      const ellipsis = container.querySelector('[data-slot="breadcrumb-ellipsis"]');
      expect(separators).toHaveLength(3); // 3 separators
      expect(ellipsis).toBeInTheDocument(); // 1 ellipsis
    });
  });
});