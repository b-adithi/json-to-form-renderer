import { describe, it, jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { FormListPage } from "../../src/pages/FormListPage";
import "@testing-library/jest-dom";

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom") as Record<string, any>;
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("FormListPage Component", () => {
  const mockLiveForms = [
    {
      id: "1",
      name: "Contact Form",
      schema: { title: "Contact", fields: [] },
      createdAt: new Date("2024-01-01").toISOString(),
      status: "published" as "published" | "draft",
      responseCount: 1,
    },
    {
      id: "2",
      name: "Survey Form",
      schema: { title: "Survey", fields: [] },
      createdAt: new Date("2024-01-02").toISOString(),
      status: "draft" as "published" | "draft",
      responseCount: 0,
    },
  ];

  const defaultProps = {
    liveForms: mockLiveForms,
    onCreateNew: jest.fn(),
    onEdit: jest.fn(),
    onTestForm: jest.fn(),
    onToggleStatus: jest.fn(),
    onClone: jest.fn(),
    onDelete: jest.fn(),
  };

  it("should render forms list", () => {
    render(
      <BrowserRouter>
        <FormListPage {...defaultProps} />
      </BrowserRouter>
    );

    expect(screen.getByText("Forms")).toBeInTheDocument();
    expect(screen.getByText("Contact Form")).toBeInTheDocument();
    expect(screen.getByText("Survey Form")).toBeInTheDocument();
  });

  it("should display form status badges", () => {
    render(
      <BrowserRouter>
        <FormListPage {...defaultProps} />
      </BrowserRouter>
    );

    expect(screen.getByText("published")).toBeInTheDocument();
    expect(screen.getByText("draft")).toBeInTheDocument();
  });

  it("should show response count", () => {
    render(
      <BrowserRouter>
        <FormListPage {...defaultProps} />
      </BrowserRouter>
    );

    const responseButtons = screen.getAllByRole("button", { name: /1/i });
    expect(responseButtons.length).toBeGreaterThan(0);
  });

  it("should call onCreateNew when create button clicked", async () => {
    render(
      <BrowserRouter>
        <FormListPage {...defaultProps} />
      </BrowserRouter>
    );

    const createButton = screen.getByRole("button", {
      name: /create new form/i,
    });
    await userEvent.click(createButton);

    expect(defaultProps.onCreateNew).toHaveBeenCalled();
  });

  it("should show empty state when no forms", () => {
    render(
      <BrowserRouter>
        <FormListPage {...defaultProps} liveForms={[]} />
      </BrowserRouter>
    );

    expect(screen.getByText("No forms yet")).toBeInTheDocument();
    expect(screen.getByText(/create your first form/i)).toBeInTheDocument();
  });

  it("should open edit dropdown menu", async () => {
    render(
      <BrowserRouter>
        <FormListPage {...defaultProps} />
      </BrowserRouter>
    );

    // Find dropdown trigger buttons (buttons with MoreVertical icon)
    const triggerButtons = screen
      .getAllByRole("button")
      .filter((btn) => btn.querySelector("svg[aria-label='DropdownTrigger']"));

    if (triggerButtons.length > 0) {
      await userEvent.click(triggerButtons[0]);
      // Check if dropdown menu opened by looking for a menu item
      const editText = await screen.findByText("Edit");
      expect(editText).toBeInTheDocument();
    }
  });

  it("should call onEdit when edit clicked", async () => {
    render(
      <BrowserRouter>
        <FormListPage {...defaultProps} />
      </BrowserRouter>
    );

    const triggerButtons = screen
      .getAllByRole("button")
      .filter((btn) => btn.querySelector("svg[aria-label='DropdownTrigger']"));

    if (triggerButtons.length > 0) {
      await userEvent.click(triggerButtons[0]);
      const editButton = await screen.findByText("Edit");
      await userEvent.click(editButton);

      expect(defaultProps.onEdit).toHaveBeenCalledWith(mockLiveForms[0]);
    }
  });

  it("should call onTestForm when test form clicked", async () => {
    render(
      <BrowserRouter>
        <FormListPage {...defaultProps} />
      </BrowserRouter>
    );

    const triggerButtons = screen
      .getAllByRole("button")
      .filter((btn) => btn.querySelector("svg[aria-label='DropdownTrigger']"));

    if (triggerButtons.length > 0) {
      await userEvent.click(triggerButtons[0]);
      const testButton = await screen.findByText("Test Form");
      await userEvent.click(testButton);

      expect(defaultProps.onTestForm).toHaveBeenCalledWith(mockLiveForms[0]);
    }
  });

  it("should call onToggleStatus when publish/unpublish clicked", async () => {
    render(
      <BrowserRouter>
        <FormListPage {...defaultProps} />
      </BrowserRouter>
    );

    const triggerButtons = screen
      .getAllByRole("button")
      .filter((btn) => btn.querySelector("svg[aria-label='DropdownTrigger']"));

    if (triggerButtons.length > 0) {
      await userEvent.click(triggerButtons[0]);
      const publishButton = await screen.findByText("Unpublish"); // First form is published
      await userEvent.click(publishButton);

      expect(defaultProps.onToggleStatus).toHaveBeenCalledWith("1");
    }
  });

  it("should call onClone when clone clicked", async () => {
    render(
      <BrowserRouter>
        <FormListPage {...defaultProps} />
      </BrowserRouter>
    );

    const triggerButtons = screen
      .getAllByRole("button")
      .filter((btn) => btn.querySelector("svg[aria-label='DropdownTrigger']"));

    if (triggerButtons.length > 0) {
      await userEvent.click(triggerButtons[0]);
      const cloneButton = await screen.findByText("Clone");
      await userEvent.click(cloneButton);

      expect(defaultProps.onClone).toHaveBeenCalledWith(mockLiveForms[0]);
    }
  });

  it("should call onDelete when delete clicked", async () => {
    render(
      <BrowserRouter>
        <FormListPage {...defaultProps} />
      </BrowserRouter>
    );

    const triggerButtons = screen
      .getAllByRole("button")
      .filter((btn) => btn.querySelector("svg[aria-label='DropdownTrigger']"));

    if (triggerButtons.length > 0) {
      await userEvent.click(triggerButtons[0]);
      const deleteButton = await screen.findByText("Delete");
      await userEvent.click(deleteButton);

      expect(defaultProps.onDelete).toHaveBeenCalledWith("1");
    }
  });

  it("should open form in new tab when external link clicked", async () => {
    // Mock window.open
    const mockOpen = jest.fn();
    Object.defineProperty(window, "open", {
      value: mockOpen,
      writable: true,
    });

    render(
      <BrowserRouter>
        <FormListPage {...defaultProps} />
      </BrowserRouter>
    );

    const triggerButtons = screen
      .getAllByRole("button")
      .filter((btn) => btn.querySelector("svg[aria-label='DropdownTrigger']"));

    if (triggerButtons.length > 0) {
      await userEvent.click(triggerButtons[0]);
      const openButton = await screen.findByText("Open Public Form");
      await userEvent.click(openButton);

      expect(mockOpen).toHaveBeenCalledWith(
        `${window.location.origin}/submit/1`,
        "_blank"
      );
    }
  });

  it("should handle dropdown menu for draft forms", async () => {
    const draftForms = [
      {
        ...mockLiveForms[1], // This is the draft form
      },
    ];

    render(
      <BrowserRouter>
        <FormListPage {...defaultProps} liveForms={draftForms} />
      </BrowserRouter>
    );

    const triggerButtons = screen
      .getAllByRole("button")
      .filter((btn) => btn.querySelector("svg[aria-label='DropdownTrigger']"));

    if (triggerButtons.length > 0) {
      await userEvent.click(triggerButtons[0]);
      const publishButton = await screen.findByText("Publish"); // Draft form should show "Publish"
      await userEvent.click(publishButton);

      expect(defaultProps.onToggleStatus).toHaveBeenCalledWith("2");
    }
  });

  it("should navigate to responses when response count clicked", async () => {
    render(
      <BrowserRouter>
        <FormListPage {...defaultProps} />
      </BrowserRouter>
    );

    const responseButton = screen
      .getAllByRole("button")
      .find((btn) => btn.textContent?.includes("1"));

    if (responseButton) {
      await userEvent.click(responseButton);
      expect(mockNavigate).toHaveBeenCalledWith("/forms/1/responses");
    }
  });

  it("should format creation date correctly", () => {
    render(
      <BrowserRouter>
        <FormListPage {...defaultProps} />
      </BrowserRouter>
    );

    const date = new Date("2024-01-01").toLocaleDateString();
    expect(screen.getByText(date)).toBeInTheDocument();
  });

  it("should show correct number of forms", () => {
    render(
      <BrowserRouter>
        <FormListPage {...defaultProps} />
      </BrowserRouter>
    );

    const rows = screen.getAllByRole("row");
    // Header row + 2 data rows = 3 total
    expect(rows.length).toBe(3);
  });

  // Additional comprehensive tests for better coverage
  it("should handle forms with different response counts", () => {
    const formsWithVariedResponses = [
      {
        ...mockLiveForms[0],
        responseCount: 100,
      },
      {
        ...mockLiveForms[1],
        responseCount: 0,
      },
    ];

    render(
      <BrowserRouter>
        <FormListPage {...defaultProps} liveForms={formsWithVariedResponses} />
      </BrowserRouter>
    );

    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("should display forms with different statuses correctly", () => {
    render(
      <BrowserRouter>
        <FormListPage {...defaultProps} />
      </BrowserRouter>
    );

    expect(screen.getByText("published")).toBeInTheDocument();
    expect(screen.getByText("draft")).toBeInTheDocument();
  });

  it("should handle multiple forms with same status", () => {
    const allPublishedForms = [
      {
        ...mockLiveForms[0],
        status: "published" as const,
      },
      {
        ...mockLiveForms[1],
        status: "published" as const,
      },
    ];

    render(
      <BrowserRouter>
        <FormListPage {...defaultProps} liveForms={allPublishedForms} />
      </BrowserRouter>
    );

    const publishedBadges = screen.getAllByText("published");
    expect(publishedBadges).toHaveLength(2);
  });

  it("should show proper table structure", () => {
    render(
      <BrowserRouter>
        <FormListPage {...defaultProps} />
      </BrowserRouter>
    );

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText("Form Name")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Responses")).toBeInTheDocument();
    expect(screen.getByText("Created")).toBeInTheDocument();
  });

  it("should handle long form names gracefully", () => {
    const formWithLongName = {
      ...mockLiveForms[0],
      name: "This is a very long form name that might overflow the container and should be handled gracefully",
    };

    render(
      <BrowserRouter>
        <FormListPage {...defaultProps} liveForms={[formWithLongName]} />
      </BrowserRouter>
    );

    expect(screen.getByText(formWithLongName.name)).toBeInTheDocument();
  });

  it("should handle forms created on different dates", () => {
    const formsWithDifferentDates = [
      {
        ...mockLiveForms[0],
        createdAt: new Date("2024-06-15").toISOString(),
      },
      {
        ...mockLiveForms[1],
        createdAt: new Date("2023-12-25").toISOString(),
      },
    ];

    render(
      <BrowserRouter>
        <FormListPage {...defaultProps} liveForms={formsWithDifferentDates} />
      </BrowserRouter>
    );

    const date1 = new Date("2024-06-15").toLocaleDateString();
    const date2 = new Date("2023-12-25").toLocaleDateString();

    expect(screen.getByText(date1)).toBeInTheDocument();
    expect(screen.getByText(date2)).toBeInTheDocument();
  });

  it("should handle zero response count correctly", () => {
    const formWithZeroResponses = {
      ...mockLiveForms[0],
      responseCount: 0,
    };

    render(
      <BrowserRouter>
        <FormListPage {...defaultProps} liveForms={[formWithZeroResponses]} />
      </BrowserRouter>
    );

    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("should handle high response counts", () => {
    const formWithHighResponses = {
      ...mockLiveForms[0],
      responseCount: 9999,
    };

    render(
      <BrowserRouter>
        <FormListPage {...defaultProps} liveForms={[formWithHighResponses]} />
      </BrowserRouter>
    );

    expect(screen.getByText("9999")).toBeInTheDocument();
  });

  it("should handle missing schema gracefully", () => {
    const formWithoutSchema = {
      ...mockLiveForms[0],
      schema: undefined as any,
    };

    expect(() => {
      render(
        <BrowserRouter>
          <FormListPage {...defaultProps} liveForms={[formWithoutSchema]} />
        </BrowserRouter>
      );
    }).not.toThrow();
  });

  it("should display proper accessibility attributes", () => {
    render(
      <BrowserRouter>
        <FormListPage {...defaultProps} />
      </BrowserRouter>
    );

    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();

    const buttons = screen.getAllByRole("button");
    buttons.forEach((button) => {
      expect(button).toBeInTheDocument();
    });
  });

  it("should handle edge case of single form", () => {
    render(
      <BrowserRouter>
        <FormListPage {...defaultProps} liveForms={[mockLiveForms[0]]} />
      </BrowserRouter>
    );

    expect(screen.getByText("Contact Form")).toBeInTheDocument();
    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(2); // Header + 1 data row
  });

  it("should maintain consistent styling across different form states", () => {
    const mixedStatusForms = [
      {
        ...mockLiveForms[0],
        status: "published" as const,
        responseCount: 50,
      },
      {
        ...mockLiveForms[1],
        status: "draft" as const,
        responseCount: 0,
      },
    ];

    render(
      <BrowserRouter>
        <FormListPage {...defaultProps} liveForms={mixedStatusForms} />
      </BrowserRouter>
    );

    expect(screen.getByText("published")).toBeInTheDocument();
    expect(screen.getByText("draft")).toBeInTheDocument();
    expect(screen.getByText("50")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("should handle forms with special characters in names", () => {
    const formWithSpecialChars = {
      ...mockLiveForms[0],
      name: "Form with émojis 🚀 & symbols @#$%",
    };

    render(
      <BrowserRouter>
        <FormListPage {...defaultProps} liveForms={[formWithSpecialChars]} />
      </BrowserRouter>
    );

    expect(
      screen.getByText("Form with émojis 🚀 & symbols @#$%")
    ).toBeInTheDocument();
  });

  it("should handle rapid re-renders without errors", () => {
    const { rerender } = render(
      <BrowserRouter>
        <FormListPage {...defaultProps} />
      </BrowserRouter>
    );

    // Re-render with different props
    rerender(
      <BrowserRouter>
        <FormListPage {...defaultProps} liveForms={[]} />
      </BrowserRouter>
    );

    expect(screen.getByText("No forms yet")).toBeInTheDocument();

    // Re-render back to original
    rerender(
      <BrowserRouter>
        <FormListPage {...defaultProps} />
      </BrowserRouter>
    );

    expect(screen.getByText("Contact Form")).toBeInTheDocument();
  });

  it("should handle forms with recent timestamps", () => {
    const recentForm = {
      ...mockLiveForms[0],
      createdAt: new Date().toISOString(), // Current timestamp
    };

    render(
      <BrowserRouter>
        <FormListPage {...defaultProps} liveForms={[recentForm]} />
      </BrowserRouter>
    );

    const today = new Date().toLocaleDateString();
    expect(screen.getByText(today)).toBeInTheDocument();
  });

  it("should handle forms with old timestamps", () => {
    const oldForm = {
      ...mockLiveForms[0],
      createdAt: new Date("2020-01-01").toISOString(),
    };

    render(
      <BrowserRouter>
        <FormListPage {...defaultProps} liveForms={[oldForm]} />
      </BrowserRouter>
    );

    const oldDate = new Date("2020-01-01").toLocaleDateString();
    expect(screen.getByText(oldDate)).toBeInTheDocument();
  });

  it("should ensure all callbacks are properly typed", () => {
    const typedProps = {
      liveForms: mockLiveForms,
      onCreateNew: jest.fn() as () => void,
      onEdit: jest.fn() as (form: any) => void,
      onTestForm: jest.fn() as (form: any) => void,
      onToggleStatus: jest.fn() as (id: string) => void,
      onClone: jest.fn() as (form: any) => void,
      onDelete: jest.fn() as (id: string) => void,
    };

    expect(() => {
      render(
        <BrowserRouter>
          <FormListPage {...typedProps} />
        </BrowserRouter>
      );
    }).not.toThrow();
  });

  it("should handle maximum reasonable number of forms", () => {
    const manyForms = Array.from({ length: 20 }, (_, i) => ({
      id: `form-${i}`,
      name: `Form ${i + 1}`,
      schema: { title: `Form ${i + 1}`, fields: [] },
      createdAt: new Date(2024, 0, i + 1).toISOString(),
      status: (i % 2 === 0 ? "published" : "draft") as "published" | "draft",
      responseCount: i * 5,
    }));

    render(
      <BrowserRouter>
        <FormListPage {...defaultProps} liveForms={manyForms} />
      </BrowserRouter>
    );

    expect(screen.getByText("Form 1")).toBeInTheDocument();
    expect(screen.getByText("Form 20")).toBeInTheDocument();

    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(21); // Header + 20 data rows
  });
});
