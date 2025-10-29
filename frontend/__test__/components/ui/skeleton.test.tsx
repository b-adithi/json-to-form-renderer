import { render, screen } from "@testing-library/react";
import { Skeleton } from "../../../src/components/ui/skeleton";

describe("Skeleton Component", () => {
  it("should render with default classes", () => {
    render(<Skeleton data-testid="skeleton" />);
    
    const skeleton = screen.getByTestId("skeleton");
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveClass("bg-accent", "animate-pulse", "rounded-md");
  });

  it("should accept additional className prop", () => {
    render(<Skeleton className="custom-class" data-testid="skeleton" />);
    
    const skeleton = screen.getByTestId("skeleton");
    expect(skeleton).toHaveClass("bg-accent", "animate-pulse", "rounded-md", "custom-class");
  });

  it("should have data-slot attribute", () => {
    render(<Skeleton data-testid="skeleton" />);
    
    const skeleton = screen.getByTestId("skeleton");
    expect(skeleton).toHaveAttribute("data-slot", "skeleton");
  });

  it("should accept additional props", () => {
    render(<Skeleton data-testid="skeleton" id="custom-id" role="status" />);
    
    const skeleton = screen.getByTestId("skeleton");
    expect(skeleton).toHaveAttribute("id", "custom-id");
    expect(skeleton).toHaveAttribute("role", "status");
  });

  it("should render as a div element", () => {
    render(<Skeleton data-testid="skeleton" />);
    
    const skeleton = screen.getByTestId("skeleton");
    expect(skeleton.tagName).toBe("DIV");
  });

  it("should merge custom classes correctly", () => {
    render(<Skeleton className="w-full h-4" data-testid="skeleton" />);
    
    const skeleton = screen.getByTestId("skeleton");
    expect(skeleton).toHaveClass("bg-accent", "animate-pulse", "rounded-md", "w-full", "h-4");
  });

  it("should render children when provided", () => {
    render(
      <Skeleton data-testid="skeleton">
        <span>Loading...</span>
      </Skeleton>
    );
    
    const skeleton = screen.getByTestId("skeleton");
    expect(skeleton).toContainHTML("<span>Loading...</span>");
  });

  it("should apply style prop correctly", () => {
    render(<Skeleton style={{ width: "100px", height: "20px" }} data-testid="skeleton" />);
    
    const skeleton = screen.getByTestId("skeleton");
    expect(skeleton).toHaveStyle({ width: "100px", height: "20px" });
  });
});