import React from "react";
import { render, screen } from "@testing-library/react";
import { RouteLoader } from "../../src/components/RouteLoader";

describe("RouteLoader", () => {
  it("renders loading spinner", () => {
    render(<RouteLoader />);
    // Check for spinner by class
    expect(document.querySelector(".animate-spin")).toBeInTheDocument();
  });
});
