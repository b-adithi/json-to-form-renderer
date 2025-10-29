import { 
  exportToJSON, 
  exportToCSV, 
  exportToXML, 
  downloadFile, 
  exportSubmission 
} from "../../src/utils/export";
import { FormSubmission } from "../../src/types/schema";

// Mock DOM APIs
const mockCreateElement = jest.fn();
const mockClick = jest.fn();
const mockAppendChild = jest.fn();
const mockRemoveChild = jest.fn();
const mockCreateObjectURL = jest.fn();
const mockRevokeObjectURL = jest.fn();
const mockBlob = jest.fn();

Object.defineProperty(document, 'createElement', {
  value: mockCreateElement
});

Object.defineProperty(document.body, 'appendChild', {
  value: mockAppendChild
});

Object.defineProperty(document.body, 'removeChild', {
  value: mockRemoveChild
});

Object.defineProperty(URL, 'createObjectURL', {
  value: mockCreateObjectURL
});

Object.defineProperty(URL, 'revokeObjectURL', {
  value: mockRevokeObjectURL
});

Object.defineProperty(global, 'Blob', {
  value: mockBlob
});

describe("export util", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Set up default mock implementation
    const mockLink = {
      href: '',
      download: '',
      click: mockClick
    };
    mockCreateElement.mockReturnValue(mockLink);
    mockCreateObjectURL.mockReturnValue('blob:test-url');
  });

  describe("exportToJSON", () => {
    it("exports basic data as JSON", () => {
      const submission: FormSubmission = {
        submissionId: "123",
        timestamp: new Date().toISOString(),
        data: { foo: "bar", arr: [1, 2], obj: { a: 1 } },
      };
      const result = exportToJSON(submission);
      expect(result).toContain("foo");
      expect(result).toContain("bar");
      expect(result).toContain("arr");
      expect(result).toContain("obj");
      
      // Verify it's valid JSON
      expect(() => JSON.parse(result)).not.toThrow();
      
      // Verify it's formatted with indentation
      expect(result).toContain("  "); // Should have 2-space indentation
    });

    it("exports submission with all optional fields", () => {
      const submission: FormSubmission = {
        submissionId: "test-123",
        timestamp: "2024-01-01T00:00:00.000Z",
        userIdentifier: "user-456",
        totalMarks: 85,
        maxMarks: 100,
        data: { 
          question1: "answer1",
          question2: ["option1", "option2"]
        },
      };
      
      const result = exportToJSON(submission);
      const parsed = JSON.parse(result);
      
      expect(parsed.submissionId).toBe("test-123");
      expect(parsed.userIdentifier).toBe("user-456");
      expect(parsed.totalMarks).toBe(85);
      expect(parsed.maxMarks).toBe(100);
      expect(parsed.data.question1).toBe("answer1");
      expect(parsed.data.question2).toEqual(["option1", "option2"]);
    });

    it("handles empty data object", () => {
      const submission: FormSubmission = {
        submissionId: "123",
        timestamp: new Date().toISOString(),
        data: {},
      };
      const result = exportToJSON(submission);
      expect(result).toContain('"data": {}');
    });

    it("handles null and undefined values", () => {
      const submission: FormSubmission = {
        submissionId: "123",
        timestamp: new Date().toISOString(),
        data: { 
          nullValue: null,
          undefinedValue: undefined,
          emptyString: ""
        },
      };
      const result = exportToJSON(submission);
      const parsed = JSON.parse(result);
      expect(parsed.data.nullValue).toBeNull();
      expect(parsed.data.undefinedValue).toBeUndefined();
      expect(parsed.data.emptyString).toBe("");
    });
  });

  describe("exportToCSV", () => {
    it("exports basic data as CSV", () => {
      const submission: FormSubmission = {
        submissionId: "123",
        timestamp: new Date().toISOString(),
        data: { foo: "bar", arr: [1, 2], obj: { a: 1 } },
      };
      const result = exportToCSV(submission);
      expect(result).toContain('"Field","Value"');
      expect(result).toContain('"foo","bar"');
      expect(result).toContain('"arr","1, 2"');
      // Quotes in CSV are escaped as "" per RFC4180
      expect(result).toContain('"obj","{""a"":1}"');
    });

    it("handles empty data object", () => {
      const submission: FormSubmission = {
        submissionId: "123",
        timestamp: new Date().toISOString(),
        data: {},
      };
      const result = exportToCSV(submission);
      expect(result).toBe('"Field","Value"');
    });

    it("escapes quotes in field names and values", () => {
      const submission: FormSubmission = {
        submissionId: "123",
        timestamp: new Date().toISOString(),
        data: { 
          'field"with"quotes': 'value"with"quotes',
          normalField: 'normal value'
        },
      };
      const result = exportToCSV(submission);
      expect(result).toContain('"field""with""quotes","value""with""quotes"');
      expect(result).toContain('"normalField","normal value"');
    });

    it("handles different data types correctly", () => {
      const submission: FormSubmission = {
        submissionId: "123",
        timestamp: new Date().toISOString(),
        data: { 
          stringValue: "text",
          numberValue: 42,
          booleanValue: true,
          arrayValue: ["item1", "item2", "item3"],
          objectValue: { nested: "value" },
          nullValue: null,
          undefinedValue: undefined
        },
      };
      const result = exportToCSV(submission);
      
      expect(result).toContain('"stringValue","text"');
      expect(result).toContain('"numberValue","42"');
      expect(result).toContain('"booleanValue","true"');
      expect(result).toContain('"arrayValue","item1, item2, item3"');
      expect(result).toContain('"objectValue","{""nested"":""value""}"');
      expect(result).toContain('"nullValue","null"');
      expect(result).toContain('"undefinedValue","undefined"');
    });

    it("handles arrays with mixed types", () => {
      const submission: FormSubmission = {
        submissionId: "123",
        timestamp: new Date().toISOString(),
        data: { 
          mixedArray: [1, "text", true, null, { key: "value" }]
        },
      };
      const result = exportToCSV(submission);
      expect(result).toContain('"mixedArray","1, text, true, , [object Object]"');
    });
  });

  describe("exportToXML", () => {
    it("exports basic data as XML", () => {
      const submission: FormSubmission = {
        submissionId: "123",
        timestamp: "2024-01-01T00:00:00.000Z",
        data: { foo: "bar", arr: [1, 2], obj: { a: 1 } },
      };
      const result = exportToXML(submission);
      expect(result).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(result).toContain("<submission>");
      expect(result).toContain("<id>123</id>");
      expect(result).toContain("<timestamp>2024-01-01T00:00:00.000Z</timestamp>");
      expect(result).toContain('<field name="foo">bar</field>');
      expect(result).toContain(
        '<field name="arr">\n      <item>1</item>\n      <item>2</item>\n    </field>'
      );
      // Quotes in XML are escaped as &quot;
      expect(result).toContain('<field name="obj">{&quot;a&quot;:1}</field>');
      expect(result).toContain("</submission>");
    });

    it("includes optional fields when present", () => {
      const submission: FormSubmission = {
        submissionId: "test-123",
        timestamp: "2024-01-01T00:00:00.000Z",
        userIdentifier: "user-456",
        totalMarks: 85,
        maxMarks: 100,
        data: { question: "answer" },
      };
      
      const result = exportToXML(submission);
      expect(result).toContain("<userIdentifier>user-456</userIdentifier>");
      expect(result).toContain("<totalMarks>85</totalMarks>");
      expect(result).toContain("<maxMarks>100</maxMarks>");
    });

    it("omits optional fields when not present", () => {
      const submission: FormSubmission = {
        submissionId: "test-123",
        timestamp: "2024-01-01T00:00:00.000Z",
        data: { question: "answer" },
      };
      
      const result = exportToXML(submission);
      expect(result).not.toContain("<userIdentifier>");
      expect(result).not.toContain("<totalMarks>");
      expect(result).not.toContain("<maxMarks>");
    });

    it("escapes XML special characters", () => {
      const submission: FormSubmission = {
        submissionId: "123",
        timestamp: "2024-01-01T00:00:00.000Z",
        data: { 
          'field&name': 'value&with<special>characters"and\'quotes',
          normalField: "normal value"
        },
      };
      const result = exportToXML(submission);
      expect(result).toContain('field&name');
      expect(result).toContain('value&with<special>characters&quot;and&apos;quotes');
    });

    it("handles empty arrays", () => {
      const submission: FormSubmission = {
        submissionId: "123",
        timestamp: "2024-01-01T00:00:00.000Z",
        data: { emptyArray: [] },
      };
      const result = exportToXML(submission);
      expect(result).toContain('<field name="emptyArray">\n    </field>');
    });

    it("handles single item arrays", () => {
      const submission: FormSubmission = {
        submissionId: "123",
        timestamp: "2024-01-01T00:00:00.000Z",
        data: { singleArray: ["onlyItem"] },
      };
      const result = exportToXML(submission);
      expect(result).toContain('<field name="singleArray">\n      <item>onlyItem</item>\n    </field>');
    });

    it("handles different data types", () => {
      const submission: FormSubmission = {
        submissionId: "123",
        timestamp: "2024-01-01T00:00:00.000Z",
        data: { 
          stringValue: "text",
          numberValue: 42,
          booleanValue: true,
          nullValue: null,
          undefinedValue: undefined
        },
      };
      const result = exportToXML(submission);
      
      expect(result).toContain('<field name="stringValue">text</field>');
      expect(result).toContain('<field name="numberValue">42</field>');
      expect(result).toContain('<field name="booleanValue">true</field>');
      expect(result).toContain('<field name="nullValue">null</field>');
      expect(result).toContain('<field name="undefinedValue">undefined</field>');
    });
  });

  describe("downloadFile", () => {
    it("creates and triggers download", () => {
      const content = "test content";
      const filename = "test.txt";
      const mimeType = "text/plain";
      
      downloadFile(content, filename, mimeType);
      
      // Verify blob creation
      expect(mockBlob).toHaveBeenCalledWith([content], { type: mimeType });
      
      // Verify URL creation
      expect(mockCreateObjectURL).toHaveBeenCalled();
      
      // Verify element creation and setup
      expect(mockCreateElement).toHaveBeenCalledWith('a');
      const mockLink = mockCreateElement.mock.results[0].value;
      expect(mockLink.href).toBe('blob:test-url');
      expect(mockLink.download).toBe(filename);
      
      // Verify DOM manipulation
      expect(mockAppendChild).toHaveBeenCalledWith(mockLink);
      expect(mockClick).toHaveBeenCalled();
      expect(mockRemoveChild).toHaveBeenCalledWith(mockLink);
      
      // Verify cleanup
      expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:test-url');
    });

    it("handles empty content", () => {
      downloadFile("", "empty.txt", "text/plain");
      
      expect(mockBlob).toHaveBeenCalledWith([""], { type: "text/plain" });
      expect(mockClick).toHaveBeenCalled();
    });

    it("handles special characters in filename", () => {
      const filename = "file-with-special-chars_123.txt";
      downloadFile("content", filename, "text/plain");
      
      const mockLink = mockCreateElement.mock.results[0].value;
      expect(mockLink.download).toBe(filename);
    });
  });

  describe("exportSubmission", () => {
    beforeEach(() => {
      // Mock Date.toISOString for consistent timestamps
      jest.spyOn(Date.prototype, 'toISOString').mockReturnValue('2024-01-01T00:00:00.000Z');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("exports submission as JSON", () => {
      const submission: FormSubmission = {
        submissionId: "123",
        timestamp: "2024-01-01T00:00:00.000Z",
        data: { question: "answer" },
      };
      
      exportSubmission(submission, 'json');
      
      expect(mockBlob).toHaveBeenCalledWith(
        [expect.stringContaining('"submissionId": "123"')],
        { type: 'application/json' }
      );
      
      const mockLink = mockCreateElement.mock.results[0].value;
      expect(mockLink.download).toBe('form-submission-2024-01-01T00-00-00-000Z.json');
    });

    it("exports submission as CSV", () => {
      const submission: FormSubmission = {
        submissionId: "123",
        timestamp: "2024-01-01T00:00:00.000Z",
        data: { question: "answer" },
      };
      
      exportSubmission(submission, 'csv');
      
      expect(mockBlob).toHaveBeenCalledWith(
        [expect.stringContaining('"Field","Value"')],
        { type: 'text/csv' }
      );
      
      const mockLink = mockCreateElement.mock.results[0].value;
      expect(mockLink.download).toBe('form-submission-2024-01-01T00-00-00-000Z.csv');
    });

    it("exports submission as XML", () => {
      const submission: FormSubmission = {
        submissionId: "123",
        timestamp: "2024-01-01T00:00:00.000Z",
        data: { question: "answer" },
      };
      
      exportSubmission(submission, 'xml');
      
      expect(mockBlob).toHaveBeenCalledWith(
        [expect.stringContaining('<?xml version="1.0" encoding="UTF-8"?>')],
        { type: 'application/xml' }
      );
      
      const mockLink = mockCreateElement.mock.results[0].value;
      expect(mockLink.download).toBe('form-submission-2024-01-01T00-00-00-000Z.xml');
    });

    it("generates unique filenames with timestamps", () => {
      const submission: FormSubmission = {
        submissionId: "123",
        timestamp: "2024-01-01T00:00:00.000Z",
        data: { question: "answer" },
      };
      
      // Test with the mocked timestamp
      exportSubmission(submission, 'json');
      let mockLink = mockCreateElement.mock.results[0].value;
      expect(mockLink.download).toBe('form-submission-2024-01-01T00-00-00-000Z.json');
      
      // Test with different format
      exportSubmission(submission, 'csv');
      mockLink = mockCreateElement.mock.results[1].value;
      expect(mockLink.download).toBe('form-submission-2024-01-01T00-00-00-000Z.csv');
      
      // Test XML format
      exportSubmission(submission, 'xml');
      mockLink = mockCreateElement.mock.results[2].value;
      expect(mockLink.download).toBe('form-submission-2024-01-01T00-00-00-000Z.xml');
    });
  });
});
