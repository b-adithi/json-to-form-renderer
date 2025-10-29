import { render, screen } from "@testing-library/react";
import { ExamplesPage } from "../../src/pages/ExamplesPage";

describe("ExamplesPage", () => {
  const mockOnClone = jest.fn();
  const mockOnPreview = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders examples page", () => {
    render(<ExamplesPage onClone={mockOnClone} onPreview={mockOnPreview} />);
    expect(screen.getByText(/example schemas/i)).toBeInTheDocument();
    expect(
      screen.getByText(/explore pre-built form schemas/i)
    ).toBeInTheDocument();
  });
});
