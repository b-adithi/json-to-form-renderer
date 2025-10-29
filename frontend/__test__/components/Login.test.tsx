// IMPORT PACKAGES
import "@testing-library/jest-dom";
import { describe, it, jest } from "@jest/globals";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";
import { toast } from "sonner";

// IMPORT INFRA
import { Login } from "../../src/components/Login";

// Mock sonner toast
jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

const mockToast = toast as jest.Mocked<typeof toast>;

describe("Login Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render login form with all elements", () => {
    const mockOnLogin = jest.fn<any>();
    render(<Login onLogin={mockOnLogin} />);

    // Check main UI elements
    expect(screen.getByText(/sign in to continue/i)).toBeInTheDocument();
    expect(screen.getByText("Form Renderer")).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /try demo account/i })).toBeInTheDocument();
    
    // Check logo
    expect(screen.getByAltText("rForm Logo")).toBeInTheDocument();
  });

  it("should handle email input correctly", async () => {
    const mockOnLogin = jest.fn<any>();
    render(<Login onLogin={mockOnLogin} />);

    const emailInput = screen.getByLabelText(/email/i);
    await userEvent.type(emailInput, "test@example.com");

    expect(emailInput).toHaveValue("test@example.com");
  });

  it("should handle password input correctly", async () => {
    const mockOnLogin = jest.fn<any>();
    render(<Login onLogin={mockOnLogin} />);

    const passwordInput = screen.getByLabelText(/password/i);
    await userEvent.type(passwordInput, "password123");

    expect(passwordInput).toHaveValue("password123");
  });

  it("should call onLogin with correct credentials when form submitted", async () => {
    const mockOnLogin = jest.fn<any>().mockResolvedValue({});
    render(<Login onLogin={mockOnLogin} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith(
        "test@example.com",
        "password123"
      );
    });
  });

  it("should show error toast when email is empty", async () => {
    const mockOnLogin = jest.fn<any>();
    render(<Login onLogin={mockOnLogin} />);

    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    await userEvent.type(passwordInput, "password123");
    await userEvent.click(submitButton);

    expect(mockOnLogin).not.toHaveBeenCalled();
    expect(mockToast.error).toHaveBeenCalledWith("Please fill in all fields");
  });

  it("should show error toast when password is empty", async () => {
    const mockOnLogin = jest.fn<any>();
    render(<Login onLogin={mockOnLogin} />);

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.click(submitButton);

    expect(mockOnLogin).not.toHaveBeenCalled();
    expect(mockToast.error).toHaveBeenCalledWith("Please fill in all fields");
  });

  it("should show error toast when password is too short", async () => {
    const mockOnLogin = jest.fn<any>();
    render(<Login onLogin={mockOnLogin} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "12345"); // 5 characters, less than 6
    await userEvent.click(submitButton);

    expect(mockOnLogin).not.toHaveBeenCalled();
    expect(mockToast.error).toHaveBeenCalledWith("Password must be at least 6 characters");
  });

  it("should validate email format", async () => {
    const mockOnLogin = jest.fn<any>();
    render(<Login onLogin={mockOnLogin} />);

    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/password/i);

    expect(emailInput.type).toBe("email");
    await userEvent.type(emailInput, "invalid-email");
    await userEvent.type(passwordInput, "password123");

    // HTML5 email validation will prevent invalid emails
    expect(emailInput.value).toBe("invalid-email");
  });

  it("should toggle password visibility", async () => {
    const mockOnLogin = jest.fn<any>();
    render(<Login onLogin={mockOnLogin} />);

    const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;
    const toggleButton = screen.getByRole("button", { name: /eyeicon/i });

    expect(passwordInput.type).toBe("password");

    await userEvent.click(toggleButton);
    expect(passwordInput.type).toBe("text");

    await userEvent.click(toggleButton);
    expect(passwordInput.type).toBe("password");
  });

  it("should disable submit button and show loading state while processing", async () => {
    const mockOnLogin = jest.fn<any>(
      () => new Promise((resolve) => setTimeout(() => resolve({}), 100))
    );
    render(<Login onLogin={mockOnLogin} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");
    await userEvent.click(submitButton);

    // Check loading state
    expect(submitButton).toBeDisabled();
    expect(screen.getByText("Signing in...")).toBeInTheDocument();
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it("should handle successful login and show success toast", async () => {
    const mockOnLogin = jest.fn<any>().mockResolvedValue({});
    render(<Login onLogin={mockOnLogin} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockToast.success).toHaveBeenCalledWith("Welcome back!");
    });
  });

  it("should handle login error from response and show error toast", async () => {
    const mockOnLogin = jest.fn<any>().mockResolvedValue({ error: "Invalid credentials" });
    render(<Login onLogin={mockOnLogin} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith("Login failed: Invalid credentials");
    });
  });

  it("should handle login exception and show error toast", async () => {
    const mockOnLogin = jest.fn<any>().mockRejectedValue(new Error("Network error"));
    render(<Login onLogin={mockOnLogin} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith("Login failed: Network error");
    });
  });

  it("should handle demo login successfully", async () => {
    const mockOnLogin = jest.fn<any>().mockResolvedValue({});
    render(<Login onLogin={mockOnLogin} />);

    const demoButton = screen.getByRole("button", { name: /try demo account/i });
    await userEvent.click(demoButton);

    // Check that demo credentials are set
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    await waitFor(() => {
      expect(emailInput).toHaveValue("demo@formrenderer.com");
      expect(passwordInput).toHaveValue("demo123");
    });

    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith("demo@formrenderer.com", "demo123");
      expect(mockToast.success).toHaveBeenCalledWith("Welcome back!");
    });
  });

  it("should handle demo login error and show error toast", async () => {
    const mockOnLogin = jest.fn<any>().mockResolvedValue({ error: "Demo account unavailable" });
    render(<Login onLogin={mockOnLogin} />);

    const demoButton = screen.getByRole("button", { name: /try demo account/i });
    await userEvent.click(demoButton);

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith("Demo login failed: Demo account unavailable");
    });
  });

  it("should handle demo login exception and show error toast", async () => {
    const mockOnLogin = jest.fn<any>().mockRejectedValue(new Error("Demo service error"));
    render(<Login onLogin={mockOnLogin} />);

    const demoButton = screen.getByRole("button", { name: /try demo account/i });
    await userEvent.click(demoButton);

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith("Demo login failed: Demo service error");
    });
  });

  it("should disable inputs while loading", async () => {
    const mockOnLogin = jest.fn<any>(
      () => new Promise((resolve) => setTimeout(() => resolve({}), 100))
    );
    render(<Login onLogin={mockOnLogin} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });
    const demoButton = screen.getByRole("button", { name: /try demo account/i });
    const eyeButton = screen.getByRole("button", { name: /eyeicon/i });

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");
    await userEvent.click(submitButton);

    // Check all elements are disabled during loading
    expect(emailInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
    expect(submitButton).toBeDisabled();
    expect(demoButton).toBeDisabled();
    expect(eyeButton).toBeDisabled();
  });

  it("should display correct loading icon and text", async () => {
    const mockOnLogin = jest.fn<any>(
      () => new Promise((resolve) => setTimeout(() => resolve({}), 100))
    );
    render(<Login onLogin={mockOnLogin} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");
    await userEvent.click(submitButton);

    // Check loading state content
    expect(screen.getByText("Signing in...")).toBeInTheDocument();
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByText("Sign In")).toBeInTheDocument();
    });
  });

  it("should display eye icon correctly when password is hidden", () => {
    const mockOnLogin = jest.fn<any>();
    render(<Login onLogin={mockOnLogin} />);

    // Initially password should be hidden and Eye icon should be shown
    const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;
    expect(passwordInput.type).toBe("password");
  });

  it("should have proper input attributes", () => {
    const mockOnLogin = jest.fn<any>();
    render(<Login onLogin={mockOnLogin} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    expect(emailInput).toHaveAttribute("type", "email");
    expect(emailInput).toHaveAttribute("placeholder", "name@example.com");
    expect(emailInput).toHaveAttribute("autoComplete", "email");

    expect(passwordInput).toHaveAttribute("placeholder", "Enter your password");
    expect(passwordInput).toHaveAttribute("autoComplete", "current-password");
  });
});
