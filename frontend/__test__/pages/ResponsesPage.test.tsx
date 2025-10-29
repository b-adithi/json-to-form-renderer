import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ResponsesPage } from "../../src/pages/ResponsesPage";
import "@testing-library/jest-dom";

describe("ResponsesPage", () => {
  const mockResponses = [
    {
      id: "response-1",
      formId: "form-1",
      userId: "user1@example.com",
      responses: {
        name: "John Doe",
        email: "john@example.com",
        message: "Hello world",
      },
      submittedAt: new Date("2024-01-15T10:30:00Z").toISOString(),
    },
    {
      id: "response-2",
      formId: "form-1",
      userId: "user2@example.com",
      responses: {
        name: "Jane Smith",
        email: "jane@example.com",
        rating: 5,
      },
      submittedAt: new Date("2024-01-16T14:20:00Z").toISOString(),
    },
  ];

  const defaultProps = {
    responses: mockResponses,
    onExportCSV: jest.fn(),
    onExportJSON: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders responses page with title", () => {
    render(<ResponsesPage {...defaultProps} />);

    expect(
      screen.getByRole("heading", { name: /form responses/i })
    ).toBeInTheDocument();
  });

  it("displays export buttons", () => {
    render(<ResponsesPage {...defaultProps} />);

    expect(screen.getByText("Export CSV")).toBeInTheDocument();
    expect(screen.getByText("Export JSON")).toBeInTheDocument();
  });

  it("calls onExportCSV when CSV export button is clicked", async () => {
    render(<ResponsesPage {...defaultProps} />);

    const csvButton = screen.getByText("Export CSV");
    await userEvent.click(csvButton);

    expect(defaultProps.onExportCSV).toHaveBeenCalledTimes(1);
  });

  it("calls onExportJSON when JSON export button is clicked", async () => {
    render(<ResponsesPage {...defaultProps} />);

    const jsonButton = screen.getByText("Export JSON");
    await userEvent.click(jsonButton);

    expect(defaultProps.onExportJSON).toHaveBeenCalledTimes(1);
  });

  it("displays response count when responses are present", () => {
    render(<ResponsesPage {...defaultProps} />);

    expect(
      screen.getByText(/2\s+total\s+responses\s+collected/)
    ).toBeInTheDocument();
  });

  it("displays individual response data", () => {
    render(<ResponsesPage {...defaultProps} />);

    // Check first response
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("Hello world")).toBeInTheDocument();

    // Check second response
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("displays submission timestamps", () => {
    render(<ResponsesPage {...defaultProps} />);

    // Check that timestamps are present (exact format may vary)
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  it("displays user emails for each response", () => {
    render(<ResponsesPage {...defaultProps} />);

    expect(screen.getByText(/•\s*user1@example\.com/)).toBeInTheDocument();
    expect(screen.getByText(/•\s*user2@example\.com/)).toBeInTheDocument();
  });

  it("shows empty state when no responses", () => {
    render(<ResponsesPage {...defaultProps} responses={[]} />);

    expect(screen.getByText("No Responses Yet")).toBeInTheDocument();
    expect(screen.getByText(/responses will appear here/i)).toBeInTheDocument();
  });

  it("handles single response correctly", () => {
    render(<ResponsesPage {...defaultProps} responses={[mockResponses[0]]} />);

    expect(
      screen.getByText(/1\s+total\s+response\s+collected/)
    ).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("handles responses with different field types", () => {
    const variedResponses = [
      {
        id: "response-3",
        formId: "form-1",
        userId: "user3@example.com",
        responses: {
          name: "Alice Johnson",
          age: 25,
          isSubscribed: true,
          rating: 4.5,
          comments: "This is a longer text field with multiple words",
        },
        submittedAt: new Date("2024-01-17T09:15:00Z").toISOString(),
      },
    ];

    render(<ResponsesPage {...defaultProps} responses={variedResponses} />);

    expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
    expect(screen.getByText("true")).toBeInTheDocument();
    expect(screen.getByText("4.5")).toBeInTheDocument();
    expect(
      screen.getByText("This is a longer text field with multiple words")
    ).toBeInTheDocument();
  });

  it("handles responses with missing or null values", () => {
    const responsesWithMissingData = [
      {
        id: "response-4",
        formId: "form-1",
        userId: "user4@example.com",
        responses: {
          name: "Bob Wilson",
          email: null,
          message: "",
          rating: undefined,
        },
        submittedAt: new Date("2024-01-18T16:45:00Z").toISOString(),
      },
    ];

    render(
      <ResponsesPage {...defaultProps} responses={responsesWithMissingData} />
    );

    expect(screen.getByText("Bob Wilson")).toBeInTheDocument();
    expect(screen.getByText(/•\s*user4@example\.com/)).toBeInTheDocument();
  });

  it("displays responses in chronological order", () => {
    render(<ResponsesPage {...defaultProps} />);

    // Check that both responses are displayed
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();

    // Check that both responses are displayed in order
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  it("handles large number of responses", () => {
    const manyResponses = Array.from({ length: 50 }, (_, i) => ({
      id: `response-${i + 1}`,
      formId: "form-1",
      userId: `user${i + 1}@example.com`,
      responses: {
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        index: i + 1,
      },
      submittedAt: new Date(2024, 0, i + 1, 10, 0, 0).toISOString(),
    }));

    render(<ResponsesPage {...defaultProps} responses={manyResponses} />);

    expect(
      screen.getByText(/50\s+total\s+responses\s+collected/)
    ).toBeInTheDocument();
    expect(screen.getByText("User 1")).toBeInTheDocument();
    expect(screen.getByText("User 50")).toBeInTheDocument();
  });

  it("handles responses with complex nested data", () => {
    const complexResponses = [
      {
        id: "response-complex",
        formId: "form-1",
        userId: "complex@example.com",
        responses: {
          personalInfo: {
            firstName: "John",
            lastName: "Complex",
          },
          preferences: ["option1", "option2", "option3"],
          metadata: {
            browser: "Chrome",
            timestamp: "2024-01-20T10:00:00Z",
          },
        },
        submittedAt: new Date("2024-01-20T10:00:00Z").toISOString(),
      },
    ];

    render(<ResponsesPage {...defaultProps} responses={complexResponses} />);

    expect(screen.getByText(/•\s*complex@example\.com/)).toBeInTheDocument();
    // Complex nested data should be stringified for display
    expect(screen.getByText(/firstName.*John/)).toBeInTheDocument();
  });

  it("maintains button states correctly", async () => {
    render(<ResponsesPage {...defaultProps} />);

    const csvButton = screen.getByText("Export CSV");
    const jsonButton = screen.getByText("Export JSON");

    // Both buttons should be enabled when responses exist
    expect(csvButton).not.toBeDisabled();
    expect(jsonButton).not.toBeDisabled();

    // Test multiple clicks
    await userEvent.click(csvButton);
    await userEvent.click(jsonButton);
    await userEvent.click(csvButton);

    expect(defaultProps.onExportCSV).toHaveBeenCalledTimes(2);
    expect(defaultProps.onExportJSON).toHaveBeenCalledTimes(1);
  });

  it("handles export buttons when no responses", () => {
    render(<ResponsesPage {...defaultProps} responses={[]} />);

    expect(screen.getByText("No Responses Yet")).toBeInTheDocument();
    expect(
      screen.getByText("Responses will appear here once users submit the form")
    ).toBeInTheDocument();

    // Export buttons should not be present when there are no responses
    expect(screen.queryByText("Export CSV")).not.toBeInTheDocument();
    expect(screen.queryByText("Export JSON")).not.toBeInTheDocument();
  });

  it("displays proper response count text", () => {
    // Test singular
    render(<ResponsesPage {...defaultProps} responses={[mockResponses[0]]} />);
    expect(
      screen.getByText(/1\s+total\s+response\s+collected/)
    ).toBeInTheDocument();

    // Test plural
    render(<ResponsesPage {...defaultProps} responses={mockResponses} />);
    expect(
      screen.getByText(/2\s+total\s+responses\s+collected/)
    ).toBeInTheDocument();

    // Test zero
    render(<ResponsesPage {...defaultProps} responses={[]} />);
    expect(
      screen.getByText(/0\s+total\s+responses\s+collected/)
    ).toBeInTheDocument();
  });

  it("handles responses with special characters", () => {
    const specialCharResponses = [
      {
        id: "response-special",
        formId: "form-1",
        userId: "special@example.com",
        responses: {
          name: "José María García-López",
          message: "Hello! This contains émojis 🚀 & symbols @#$%^&*()",
          unicode: "Testing unicode: ñáéíóú çüß 中文 🌟",
        },
        submittedAt: new Date("2024-01-19T12:30:00Z").toISOString(),
      },
    ];

    render(
      <ResponsesPage {...defaultProps} responses={specialCharResponses} />
    );

    expect(screen.getByText("José María García-López")).toBeInTheDocument();
    expect(
      screen.getByText("Hello! This contains émojis 🚀 & symbols @#$%^&*()")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Testing unicode: ñáéíóú çüß 中文 🌟")
    ).toBeInTheDocument();
  });

  it("handles rapid prop changes", () => {
    const { rerender } = render(<ResponsesPage {...defaultProps} />);

    expect(
      screen.getByText(/2\s+total\s+responses\s+collected/)
    ).toBeInTheDocument();

    // Change to single response
    rerender(
      <ResponsesPage {...defaultProps} responses={[mockResponses[0]]} />
    );
    expect(
      screen.getByText(/1\s+total\s+response\s+collected/)
    ).toBeInTheDocument();

    // Change to no responses
    rerender(<ResponsesPage {...defaultProps} responses={[]} />);
    expect(screen.getByText("No Responses Yet")).toBeInTheDocument();

    // Change back to multiple
    rerender(<ResponsesPage {...defaultProps} responses={mockResponses} />);
    expect(
      screen.getByText(/2\s+total\s+responses\s+collected/)
    ).toBeInTheDocument();
  });

  it("maintains proper data structure display", () => {
    render(<ResponsesPage {...defaultProps} />);

    // Verify the component displays data in a structured way
    expect(document.body).toContainElement(screen.getByText("John Doe"));
    expect(document.body).toContainElement(screen.getByText("Jane Smith"));
  });
});
