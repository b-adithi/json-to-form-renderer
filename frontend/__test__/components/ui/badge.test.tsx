import { render, screen } from "@testing-library/react";
import { Badge } from "../../../src/components/ui/badge";

describe("Badge UI component", () => {
  it("renders children", () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText("Test Badge")).toBeInTheDocument();
  });
});
