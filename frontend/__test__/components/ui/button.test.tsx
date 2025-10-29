import { render, screen } from "@testing-library/react";
import { Button } from "../../../src/components/ui/button";

describe("Button UI component", () => {
  it("renders children and can be clicked", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    screen.getByText("Click Me").click();
    expect(handleClick).toHaveBeenCalled();
  });
});
