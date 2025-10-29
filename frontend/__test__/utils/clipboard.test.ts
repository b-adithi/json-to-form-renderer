import { copyToClipboard } from "../../src/utils/clipboard";

describe("clipboard utility", () => {
  let mockTextArea: HTMLTextAreaElement;
  let mockExecCommand: jest.SpyInstance;
  let mockCreateElement: jest.SpyInstance;
  let mockAppendChild: jest.SpyInstance;
  let mockRemoveChild: jest.SpyInstance;
  let mockCreateRange: jest.SpyInstance;
  let mockGetSelection: jest.SpyInstance;

  beforeEach(() => {
    // Create a mock textarea element
    mockTextArea = {
      value: '',
      style: {},
      focus: jest.fn(),
      select: jest.fn(),
      setSelectionRange: jest.fn(),
    } as any;

    // Mock DOM methods
    mockCreateElement = jest.spyOn(document, 'createElement');
    mockCreateElement.mockReturnValue(mockTextArea);

    mockAppendChild = jest.spyOn(document.body, 'appendChild');
    mockAppendChild.mockImplementation(() => mockTextArea);

    mockRemoveChild = jest.spyOn(document.body, 'removeChild');
    mockRemoveChild.mockImplementation(() => mockTextArea);

    // Mock execCommand - add it to document if it doesn't exist
    Object.defineProperty(document, 'execCommand', {
      value: jest.fn(),
      writable: true,
    });
    mockExecCommand = jest.spyOn(document, 'execCommand');

    // Mock Range and Selection APIs
    const mockRange = {
      selectNodeContents: jest.fn(),
    };
    mockCreateRange = jest.spyOn(document, 'createRange');
    mockCreateRange.mockReturnValue(mockRange as any);

    const mockSelection = {
      removeAllRanges: jest.fn(),
      addRange: jest.fn(),
    };
    mockGetSelection = jest.spyOn(window, 'getSelection');
    mockGetSelection.mockReturnValue(mockSelection as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should successfully copy text to clipboard", async () => {
    mockExecCommand.mockReturnValue(true);

    const result = await copyToClipboard("test text");

    expect(result).toBe(true);
    expect(mockCreateElement).toHaveBeenCalledWith('textarea');
    expect(mockTextArea.value).toBe("test text");
    expect(mockAppendChild).toHaveBeenCalledWith(mockTextArea);
    expect(mockTextArea.focus).toHaveBeenCalled();
    expect(mockTextArea.select).toHaveBeenCalled();
    expect(mockTextArea.setSelectionRange).toHaveBeenCalledWith(0, 9);
    expect(mockExecCommand).toHaveBeenCalledWith('copy');
    expect(mockRemoveChild).toHaveBeenCalledWith(mockTextArea);
  });

  it("should set correct styles on textarea", async () => {
    mockExecCommand.mockReturnValue(true);

    await copyToClipboard("test");

    expect(mockTextArea.style.position).toBe('fixed');
    expect(mockTextArea.style.left).toBe('-999999px');
    expect(mockTextArea.style.top).toBe('-999999px');
    expect(mockTextArea.style.opacity).toBe('0');
    expect(mockTextArea.style.pointerEvents).toBe('none');
  });

  it("should handle range selection for iOS compatibility", async () => {
    mockExecCommand.mockReturnValue(true);

    await copyToClipboard("test text");

    expect(mockCreateRange).toHaveBeenCalled();
    expect(mockGetSelection).toHaveBeenCalled();
  });

  it("should handle case when getSelection returns null", async () => {
    mockExecCommand.mockReturnValue(true);
    mockGetSelection.mockReturnValue(null);

    const result = await copyToClipboard("test text");

    expect(result).toBe(true);
    expect(mockCreateRange).toHaveBeenCalled();
    expect(mockGetSelection).toHaveBeenCalled();
  });

  it("should return false when execCommand fails", async () => {
    mockExecCommand.mockReturnValue(false);

    const result = await copyToClipboard("test text");

    expect(result).toBe(false);
    expect(mockExecCommand).toHaveBeenCalledWith('copy');
    expect(mockRemoveChild).toHaveBeenCalledWith(mockTextArea);
  });

  it("should handle execCommand throwing an error", async () => {
    mockExecCommand.mockImplementation(() => {
      throw new Error("execCommand failed");
    });

    const result = await copyToClipboard("test text");

    expect(result).toBe(false);
    expect(mockRemoveChild).toHaveBeenCalledWith(mockTextArea);
  });

  it("should handle DOM manipulation errors", async () => {
    mockCreateElement.mockImplementation(() => {
      throw new Error("Failed to create element");
    });

    const result = await copyToClipboard("test text");

    expect(result).toBe(false);
  });

  it("should handle appendChild errors", async () => {
    mockAppendChild.mockImplementation(() => {
      throw new Error("Failed to append child");
    });

    const result = await copyToClipboard("test text");

    expect(result).toBe(false);
  });

  it("should handle empty text", async () => {
    mockExecCommand.mockReturnValue(true);

    const result = await copyToClipboard("");

    expect(result).toBe(true);
    expect(mockTextArea.value).toBe("");
    expect(mockTextArea.setSelectionRange).toHaveBeenCalledWith(0, 0);
  });

  it("should handle very long text", async () => {
    mockExecCommand.mockReturnValue(true);
    const longText = "a".repeat(10000);

    const result = await copyToClipboard(longText);

    expect(result).toBe(true);
    expect(mockTextArea.value).toBe(longText);
    expect(mockTextArea.setSelectionRange).toHaveBeenCalledWith(0, 10000);
  });

  it("should clean up textarea even if removeChild fails", async () => {
    mockExecCommand.mockReturnValue(true);
    mockRemoveChild.mockImplementation(() => {
      throw new Error("Failed to remove child");
    });

    const result = await copyToClipboard("test text");

    expect(result).toBe(false); // Should return false when cleanup fails
    expect(mockRemoveChild).toHaveBeenCalledWith(mockTextArea);
  });

  it("should handle special characters and unicode", async () => {
    mockExecCommand.mockReturnValue(true);
    const specialText = "Special: !@#$%^&*() 你好 مرحبا";

    const result = await copyToClipboard(specialText);

    expect(result).toBe(true);
    expect(mockTextArea.value).toBe(specialText);
  });
});
