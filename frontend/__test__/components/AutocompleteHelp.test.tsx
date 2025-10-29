import { describe, it } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { AutocompleteHelp } from "../../src/components/AutocompleteHelp";

describe("AutocompleteHelp Component", () => {
  it("renders help trigger button", () => {
    render(<AutocompleteHelp />);
    
    // Should have the help button
    expect(screen.getByText("Autocomplete Guide")).toBeInTheDocument();
  });

  it("has proper accessibility attributes", () => {
    render(<AutocompleteHelp />);
    
    // Should have proper ARIA attributes
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-haspopup", "dialog");
  });

  it("includes help icon", () => {
    render(<AutocompleteHelp />);
    
    // Should have a help icon (circle-help)
    const helpIcon = document.querySelector('.lucide-circle-help');
    expect(helpIcon).toBeInTheDocument();
  });
});