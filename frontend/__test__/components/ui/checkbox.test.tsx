import { render, screen } from "@testing-library/react";
import { Checkbox } from "../../../src/components/ui/checkbox";

describe("Checkbox UI component", () => {
  it("renders and can be checked", () => {
    render(<Checkbox checked={true} />);
    // Check for input element
    expect(screen.getByRole("checkbox")).toBeChecked();
  });
});
