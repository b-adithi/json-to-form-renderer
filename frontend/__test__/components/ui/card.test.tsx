import { render, screen } from "@testing-library/react";
import { Card } from "../../../src/components/ui/card";

describe("Card UI component", () => {
  it("renders children", () => {
    render(<Card>Test Card</Card>);
    expect(screen.getByText("Test Card")).toBeInTheDocument();
  });
});
