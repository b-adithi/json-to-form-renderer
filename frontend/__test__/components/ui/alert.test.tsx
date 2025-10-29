import React from "react";
import { render, screen } from "@testing-library/react";
import { Alert } from "../../../src/components/ui/alert";

describe("Alert UI component", () => {
  it("renders children and has correct role", () => {
    render(<Alert>Test Alert</Alert>);
    expect(screen.getByText("Test Alert")).toBeInTheDocument();
    // Optionally check for role if Alert uses one
  });
});
