import {
  exportToJSON,
  exportToCSV,
  downloadFile,
  exportSubmission,
} from "../../src/utils/export";
import {
  FormSubmission,
  FormSchema,
  FieldSchema,
} from "../../src/types/schema";

// Mock DOM APIs
const mockCreateElement = jest.fn();
const mockClick = jest.fn();
const mockAppendChild = jest.fn();
const mockRemoveChild = jest.fn();
const mockCreateObjectURL = jest.fn();
const mockRevokeObjectURL = jest.fn();
const mockBlob = jest.fn();

Object.defineProperty(document, "createElement", {
  value: mockCreateElement,
});

Object.defineProperty(document.body, "appendChild", {
  value: mockAppendChild,
});

Object.defineProperty(document.body, "removeChild", {
  value: mockRemoveChild,
});

Object.defineProperty(URL, "createObjectURL", {
  value: mockCreateObjectURL,
});

Object.defineProperty(URL, "revokeObjectURL", {
  value: mockRevokeObjectURL,
});

Object.defineProperty(global, "Blob", {
  value: mockBlob,
});

describe("export util", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Set up default mock implementation
    const mockLink = {
      href: "",
      download: "",
      click: mockClick,
    };
    mockCreateElement.mockReturnValue(mockLink);
    mockCreateObjectURL.mockReturnValue("blob:test-url");
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
          question2: ["option1", "option2"],
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
          emptyString: "",
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
          normalField: "normal value",
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
          undefinedValue: undefined,
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
          mixedArray: [1, "text", true, null, { key: "value" }],
        },
      };
      const result = exportToCSV(submission);
      expect(result).toContain(
        '"mixedArray","1, text, true, , [object Object]"'
      );
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
      expect(mockCreateElement).toHaveBeenCalledWith("a");
      const mockLink = mockCreateElement.mock.results[0].value;
      expect(mockLink.href).toBe("blob:test-url");
      expect(mockLink.download).toBe(filename);

      // Verify DOM manipulation
      expect(mockAppendChild).toHaveBeenCalledWith(mockLink);
      expect(mockClick).toHaveBeenCalled();
      expect(mockRemoveChild).toHaveBeenCalledWith(mockLink);

      // Verify cleanup
      expect(mockRevokeObjectURL).toHaveBeenCalledWith("blob:test-url");
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
      jest
        .spyOn(Date.prototype, "toISOString")
        .mockReturnValue("2024-01-01T00:00:00.000Z");
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

      exportSubmission(submission, "json");

      expect(mockBlob).toHaveBeenCalledWith(
        [expect.stringContaining('"submissionId": "123"')],
        { type: "application/json" }
      );

      const mockLink = mockCreateElement.mock.results[0].value;
      expect(mockLink.download).toBe(
        "form-submission-2024-01-01T00-00-00-000Z.json"
      );
    });

    it("exports submission as CSV", () => {
      const submission: FormSubmission = {
        submissionId: "123",
        timestamp: "2024-01-01T00:00:00.000Z",
        data: { question: "answer" },
      };

      exportSubmission(submission, "csv");

      expect(mockBlob).toHaveBeenCalledWith(
        [expect.stringContaining('"Field","Value"')],
        { type: "text/csv" }
      );

      const mockLink = mockCreateElement.mock.results[0].value;
      expect(mockLink.download).toBe(
        "form-submission-2024-01-01T00-00-00-000Z.csv"
      );
    });

    it("generates unique filenames with timestamps", () => {
      const submission: FormSubmission = {
        submissionId: "123",
        timestamp: "2024-01-01T00:00:00.000Z",
        data: { question: "answer" },
      };

      // Test with the mocked timestamp
      exportSubmission(submission, "json");
      let mockLink = mockCreateElement.mock.results[0].value;
      expect(mockLink.download).toBe(
        "form-submission-2024-01-01T00-00-00-000Z.json"
      );

      // Test with different format
      exportSubmission(submission, "csv");
      mockLink = mockCreateElement.mock.results[1].value;
      expect(mockLink.download).toBe(
        "form-submission-2024-01-01T00-00-00-000Z.csv"
      );
    });

    it("exports submission with schema", () => {
      const schema: FormSchema = {
        title: "Test Form",
        fields: [
          {
            id: "name",
            type: "text",
            label: "Full Name",
          },
          {
            id: "age",
            type: "number",
            label: "Age",
          },
        ],
        sections: [
          {
            id: "contact",
            title: "Contact Info",
            fields: [
              {
                id: "email",
                type: "email",
                label: "Email Address",
              },
            ],
          },
        ],
      };

      const submission: FormSubmission = {
        submissionId: "123",
        timestamp: "2024-01-01T00:00:00.000Z",
        data: {
          name: "John Doe",
          age: 25,
          email: "john@example.com",
        },
      };

      exportSubmission(submission, "csv", schema);

      // Should use field labels instead of IDs
      const csvContent = mockBlob.mock.calls[0][0][0];
      expect(csvContent).toContain('"Full Name","John Doe"');
      expect(csvContent).toContain('"Age","25"');
      expect(csvContent).toContain('"Email Address","john@example.com"');
    });
  });

  describe("exportToCSV with schema", () => {
    it("uses field labels from schema", () => {
      const schema: FormSchema = {
        title: "Test Form",
        fields: [
          {
            id: "firstName",
            type: "text",
            label: "First Name",
          },
          {
            id: "lastName",
            type: "text",
            label: "Last Name",
          },
        ],
      };

      const submission: FormSubmission = {
        submissionId: "test",
        timestamp: "2024-01-01T00:00:00.000Z",
        data: {
          firstName: "John",
          lastName: "Doe",
        },
      };

      const result = exportToCSV(submission, schema);
      expect(result).toContain('"First Name","John"');
      expect(result).toContain('"Last Name","Doe"');
      expect(result).not.toContain('"firstName"');
      expect(result).not.toContain('"lastName"');
    });

    it("handles nested sections in schema", () => {
      const schema: FormSchema = {
        title: "Test Form",
        fields: [
          {
            id: "name",
            type: "text",
            label: "Name",
          },
        ],
        sections: [
          {
            id: "contact",
            title: "Contact",
            fields: [
              {
                id: "email",
                type: "email",
                label: "Email Address",
              },
              {
                id: "phone",
                type: "tel",
                label: "Phone Number",
              },
            ],
          },
          {
            id: "address",
            title: "Address",
            fields: [
              {
                id: "street",
                type: "text",
                label: "Street Address",
              },
            ],
          },
        ],
      };

      const submission: FormSubmission = {
        submissionId: "test",
        timestamp: "2024-01-01T00:00:00.000Z",
        data: {
          name: "John Doe",
          email: "john@example.com",
          phone: "555-1234",
          street: "123 Main St",
        },
      };

      const result = exportToCSV(submission, schema);
      expect(result).toContain('"Name","John Doe"');
      expect(result).toContain('"Email Address","john@example.com"');
      expect(result).toContain('"Phone Number","555-1234"');
      expect(result).toContain('"Street Address","123 Main St"');
    });

    it("falls back to field ID when label not found", () => {
      const schema: FormSchema = {
        title: "Test Form",
        fields: [
          {
            id: "knownField",
            type: "text",
            label: "Known Field",
          },
        ],
      };

      const submission: FormSubmission = {
        submissionId: "test",
        timestamp: "2024-01-01T00:00:00.000Z",
        data: {
          knownField: "known value",
          unknownField: "unknown value",
        },
      };

      const result = exportToCSV(submission, schema);
      expect(result).toContain('"Known Field","known value"');
      expect(result).toContain('"unknownField","unknown value"');
    });

    it("formats computed field values with precision", () => {
      const schema: FormSchema = {
        title: "Test Form",
        fields: [
          {
            id: "score",
            type: "number",
            label: "Score",
            computed: {
              formula: "field1 + field2",
              dependencies: ["field1", "field2"],
              precision: 3,
            },
          },
          {
            id: "average",
            type: "number",
            label: "Average",
            computed: {
              formula: "(field1 + field2) / 2",
              dependencies: ["field1", "field2"],
              precision: 1,
            },
          },
        ],
      };

      const submission: FormSubmission = {
        submissionId: "test",
        timestamp: "2024-01-01T00:00:00.000Z",
        data: {
          score: 85.123456,
          average: 82.7,
        },
      };

      const result = exportToCSV(submission, schema);
      expect(result).toContain('"Score","85.123"');
      expect(result).toContain('"Average","82.7"');
    });

    it("formats currency fields with 2 decimal places", () => {
      const schema: FormSchema = {
        title: "Test Form",
        fields: [
          {
            id: "price",
            type: "number",
            label: "Price",
          },
          {
            id: "totalCost",
            type: "number",
            label: "Total Cost",
          },
          {
            id: "paymentAmount",
            type: "number",
            label: "Payment Amount",
          },
          {
            id: "processingFee",
            type: "number",
            label: "Processing Fee",
          },
          {
            id: "regularNumber",
            type: "number",
            label: "Regular Number",
          },
        ],
      };

      const submission: FormSubmission = {
        submissionId: "test",
        timestamp: "2024-01-01T00:00:00.000Z",
        data: {
          price: 29.9,
          totalCost: 150.555,
          paymentAmount: 99.1,
          processingFee: 2.95,
          regularNumber: 42.123,
        },
      };

      const result = exportToCSV(submission, schema);
      expect(result).toContain('"Price","29.90"');
      expect(result).toContain('"Total Cost","150.56"');
      expect(result).toContain('"Payment Amount","99.10"');
      expect(result).toContain('"Processing Fee","2.95"');
      expect(result).toContain('"Regular Number","42.123"'); // Not a currency field
    });

    it("handles empty schema gracefully", () => {
      const schema: FormSchema = {
        title: "Empty Form",
      };

      const submission: FormSubmission = {
        submissionId: "test",
        timestamp: "2024-01-01T00:00:00.000Z",
        data: {
          someField: "some value",
        },
      };

      const result = exportToCSV(submission, schema);
      expect(result).toContain('"someField","some value"');
    });

    it("handles null and undefined values with schema", () => {
      const schema: FormSchema = {
        title: "Test Form",
        fields: [
          {
            id: "nullField",
            type: "text",
            label: "Null Field",
          },
          {
            id: "undefinedField",
            type: "text",
            label: "Undefined Field",
          },
        ],
      };

      const submission: FormSubmission = {
        submissionId: "test",
        timestamp: "2024-01-01T00:00:00.000Z",
        data: {
          nullField: null,
          undefinedField: undefined,
        },
      };

      const result = exportToCSV(submission, schema);
      expect(result).toContain('"Null Field",""');
      expect(result).toContain('"Undefined Field",""');
    });

    it("handles complex objects and arrays with schema", () => {
      const schema: FormSchema = {
        title: "Test Form",
        fields: [
          {
            id: "tags",
            type: "checkbox",
            label: "Tags",
          },
          {
            id: "metadata",
            type: "text",
            label: "Metadata",
          },
        ],
      };

      const submission: FormSubmission = {
        submissionId: "test",
        timestamp: "2024-01-01T00:00:00.000Z",
        data: {
          tags: ["tag1", "tag2", "tag3"],
          metadata: { key: "value", nested: { deep: "data" } },
        },
      };

      const result = exportToCSV(submission, schema);
      expect(result).toContain('"Tags","tag1, tag2, tag3"');
      expect(result).toContain(
        '"Metadata","{""key"":""value"",""nested"":{""deep"":""data""}}"'
      );
    });
  });

  describe("edge cases and error handling", () => {
    it("handles schema with only sections and no top-level fields", () => {
      const schema: FormSchema = {
        title: "Section Only Form",
        sections: [
          {
            id: "section1",
            title: "Section 1",
            fields: [
              {
                id: "field1",
                type: "text",
                label: "Field 1",
              },
            ],
          },
          {
            id: "section2",
            title: "Section 2",
            fields: [
              {
                id: "field2",
                type: "text",
                label: "Field 2",
              },
            ],
          },
        ],
      };

      const submission: FormSubmission = {
        submissionId: "test",
        timestamp: "2024-01-01T00:00:00.000Z",
        data: {
          field1: "value1",
          field2: "value2",
        },
      };

      const result = exportToCSV(submission, schema);
      expect(result).toContain('"Field 1","value1"');
      expect(result).toContain('"Field 2","value2"');
    });

    it("handles schema with both fields and sections", () => {
      const schema: FormSchema = {
        title: "Mixed Form",
        fields: [
          {
            id: "topField",
            type: "text",
            label: "Top Level Field",
          },
        ],
        sections: [
          {
            id: "section",
            title: "Section",
            fields: [
              {
                id: "sectionField",
                type: "text",
                label: "Section Field",
              },
            ],
          },
        ],
      };

      const submission: FormSubmission = {
        submissionId: "test",
        timestamp: "2024-01-01T00:00:00.000Z",
        data: {
          topField: "top value",
          sectionField: "section value",
        },
      };

      const result = exportToCSV(submission, schema);
      expect(result).toContain('"Top Level Field","top value"');
      expect(result).toContain('"Section Field","section value"');
    });

    it("handles currency detection case variations", () => {
      const schema: FormSchema = {
        title: "Currency Test",
        fields: [
          {
            id: "itemPrice",
            type: "number",
            label: "Item Price",
          },
          {
            id: "TOTAL_AMOUNT",
            type: "number",
            label: "Total Amount",
          },
          {
            id: "shipping_cost",
            type: "number",
            label: "Shipping Cost",
          },
          {
            id: "service_fee",
            type: "number",
            label: "Service Fee",
          },
        ],
      };

      const submission: FormSubmission = {
        submissionId: "test",
        timestamp: "2024-01-01T00:00:00.000Z",
        data: {
          itemPrice: 25.5,
          TOTAL_AMOUNT: 30.123,
          shipping_cost: 5.99,
          service_fee: 2.1,
        },
      };

      const result = exportToCSV(submission, schema);
      expect(result).toContain('"Item Price","25.50"');
      expect(result).toContain('"Total Amount","30.12"');
      expect(result).toContain('"Shipping Cost","5.99"');
      expect(result).toContain('"Service Fee","2.10"');
    });

    it("handles zero precision in computed fields", () => {
      const schema: FormSchema = {
        title: "Zero Precision Test",
        fields: [
          {
            id: "count",
            type: "number",
            label: "Count",
            computed: {
              formula: "field1 + field2",
              dependencies: ["field1", "field2"],
              precision: 0,
            },
          },
        ],
      };

      const submission: FormSubmission = {
        submissionId: "test",
        timestamp: "2024-01-01T00:00:00.000Z",
        data: {
          count: 42.789,
        },
      };

      const result = exportToCSV(submission, schema);
      expect(result).toContain('"Count","43"');
    });
  });
});
