import { renderHook, act } from "@testing-library/react";
import { useIsMobile } from "../../../src/components/ui/use-mobile";

// Mock matchMedia
const mockMatchMedia = (matches: boolean) => {
  const mockMql = {
    matches,
    media: "",
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  };

  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation(() => mockMql),
  });

  return mockMql;
};

// Mock window.innerWidth
const mockWindowWidth = (width: number) => {
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: width,
  });
};

describe("useIsMobile hook", () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Clean up
    jest.restoreAllMocks();
  });

  it("should return true when screen width is below mobile breakpoint", () => {
    mockWindowWidth(600); // Below 768px breakpoint
    const mockMql = mockMatchMedia(true);

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(true);
    expect(window.matchMedia).toHaveBeenCalledWith("(max-width: 767px)");
    expect(mockMql.addEventListener).toHaveBeenCalledWith("change", expect.any(Function));
  });

  it("should return false when screen width is above mobile breakpoint", () => {
    mockWindowWidth(1024); // Above 768px breakpoint
    const mockMql = mockMatchMedia(false);

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);
    expect(window.matchMedia).toHaveBeenCalledWith("(max-width: 767px)");
    expect(mockMql.addEventListener).toHaveBeenCalledWith("change", expect.any(Function));
  });

  it("should return false when screen width equals mobile breakpoint", () => {
    mockWindowWidth(768); // Exactly at 768px breakpoint
    const mockMql = mockMatchMedia(false);

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);
  });

  it("should update when window size changes", () => {
    mockWindowWidth(1024);
    const mockMql = mockMatchMedia(false);

    const { result, rerender } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);

    // Simulate window resize to mobile size
    act(() => {
      mockWindowWidth(500);
      const changeHandler = mockMql.addEventListener.mock.calls.find(
        (call) => call[0] === "change"
      )?.[1];
      if (changeHandler) {
        changeHandler();
      }
    });

    rerender();
    expect(result.current).toBe(true);
  });

  it("should clean up event listeners on unmount", () => {
    const mockMql = mockMatchMedia(false);

    const { unmount } = renderHook(() => useIsMobile());

    unmount();

    expect(mockMql.removeEventListener).toHaveBeenCalledWith("change", expect.any(Function));
  });

  it("should handle initial undefined state properly", () => {
    mockWindowWidth(1024);
    mockMatchMedia(false);

    const { result } = renderHook(() => useIsMobile());

    // After initial render, should have a boolean value (not undefined)
    expect(typeof result.current).toBe("boolean");
  });
});