// __tests__/models/responses.test.js

// Mock mongoose methods
const mockFind = jest.fn();
const mockFindById = jest.fn();
const mockSave = jest.fn();

const mockResponse = jest.fn().mockImplementation(function (data) {
  Object.assign(this, data);
  this.save = mockSave;
  return this;
});

// Set up static methods on the mockResponse constructor
mockResponse.find = mockFind;
mockResponse.findById = mockFindById;

jest.mock("mongoose", () => ({
  model: jest.fn(() => mockResponse),
  Schema: jest.fn(),
}));

jest.mock("../../schemas/response", () => ({}));

// Now require the module after mocks are set up
const responseModel = require("../../models/responses");

describe("Response Model", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const mongoose = require("mongoose");
    mongoose.model.mockImplementation((name, schema) => {
      if (name === "Response") {
        return {
          find: mockFind,
          findById: mockFindById,
        };
      }
      return {};
    });

    global.Response = mockResponse;
  });

  describe("getAll", () => {
    it("should return all responses", async () => {
      const mockResponses = [
        { _id: "resp1", userId: "user1", formId: "form1" },
        { _id: "resp2", userId: "user2", formId: "form2" },
      ];

      mockFind.mockResolvedValue(mockResponses);

      const result = await responseModel.getAll();

      expect(mockFind).toHaveBeenCalledWith();
      expect(result).toEqual(mockResponses);
    });

    it("should return empty array when no responses exist", async () => {
      mockFind.mockResolvedValue([]);

      const result = await responseModel.getAll();

      expect(mockFind).toHaveBeenCalledWith();
      expect(result).toEqual([]);
    });

    it("should handle database errors", async () => {
      const dbError = new Error("Database connection failed");
      mockFind.mockRejectedValue(dbError);

      await expect(responseModel.getAll()).rejects.toThrow(
        "Database connection failed"
      );
    });
  });

  describe("get", () => {
    it("should return a response by ID", async () => {
      const mockResponse = {
        _id: "resp123",
        userId: "user1",
        formId: "form1",
        responses: { field1: "value1" },
      };
      mockFindById.mockResolvedValue(mockResponse);

      const result = await responseModel.get("resp123");

      expect(mockFindById).toHaveBeenCalledWith("resp123");
      expect(result).toEqual(mockResponse);
    });

    it("should return null for non-existent response", async () => {
      mockFindById.mockResolvedValue(null);

      const result = await responseModel.get("nonexistent");

      expect(mockFindById).toHaveBeenCalledWith("nonexistent");
      expect(result).toBeNull();
    });

    it("should handle database errors", async () => {
      const dbError = new Error("Database error");
      mockFindById.mockRejectedValue(dbError);

      await expect(responseModel.get("resp123")).rejects.toThrow(
        "Database error"
      );
    });
  });

  describe("getByFormId", () => {
    it("should return responses for a specific form", async () => {
      const mockResponses = [
        { _id: "resp1", userId: "user1", formId: "form123" },
        { _id: "resp2", userId: "user2", formId: "form123" },
      ];

      mockFind.mockResolvedValue(mockResponses);

      const result = await responseModel.getByFormId("form123");

      expect(mockFind).toHaveBeenCalledWith({ formId: "form123" });
      expect(result).toEqual(mockResponses);
    });

    it("should return empty array when no responses exist for form", async () => {
      mockFind.mockResolvedValue([]);

      const result = await responseModel.getByFormId("form123");

      expect(mockFind).toHaveBeenCalledWith({ formId: "form123" });
      expect(result).toEqual([]);
    });

    it("should handle database errors", async () => {
      const dbError = new Error("Database query failed");
      mockFind.mockRejectedValue(dbError);

      await expect(responseModel.getByFormId("form123")).rejects.toThrow(
        "Database query failed"
      );
    });

    it("should handle null or undefined formId", async () => {
      mockFind.mockResolvedValue([]);

      const resultNull = await responseModel.getByFormId(null);
      expect(mockFind).toHaveBeenCalledWith({ formId: null });
      expect(resultNull).toEqual([]);

      const resultUndefined = await responseModel.getByFormId(undefined);
      expect(mockFind).toHaveBeenCalledWith({ formId: undefined });
      expect(resultUndefined).toEqual([]);
    });
  });

  describe("create", () => {
    it("should create a new response successfully", async () => {
      const responseData = {
        userId: "user123",
        formId: "form123",
        responses: {
          field1: "value1",
          field2: "value2",
        },
      };

      mockSave.mockResolvedValue(true);

      const result = await responseModel.create(responseData);

      expect(mockSave).toHaveBeenCalled();
      expect(result.userId).toBe(responseData.userId);
      expect(result.formId).toBe(responseData.formId);
      expect(result.responses).toEqual(responseData.responses);
      expect(result.submittedOn).toBeInstanceOf(Date);
    });

    it("should handle save errors", async () => {
      const responseData = {
        userId: "user123",
        formId: "form123",
        responses: { field1: "value1" },
      };

      const saveError = new Error("Save failed");
      mockSave.mockRejectedValue(saveError);

      await expect(responseModel.create(responseData)).rejects.toThrow(
        "Save failed"
      );
    });

    it("should create response with current timestamp", async () => {
      const responseData = {
        userId: "user123",
        formId: "form123",
        responses: { field1: "value1" },
      };

      mockSave.mockResolvedValue(true);

      const beforeCreate = new Date();
      const result = await responseModel.create(responseData);
      const afterCreate = new Date();

      expect(result.submittedOn.getTime()).toBeGreaterThanOrEqual(
        beforeCreate.getTime()
      );
      expect(result.submittedOn.getTime()).toBeLessThanOrEqual(
        afterCreate.getTime()
      );
    });

    it("should handle empty responses object", async () => {
      const responseData = {
        userId: "user123",
        formId: "form123",
        responses: {},
      };

      mockSave.mockResolvedValue(true);

      const result = await responseModel.create(responseData);

      expect(result.responses).toEqual({});
      expect(result.userId).toBe(responseData.userId);
      expect(result.formId).toBe(responseData.formId);
    });

    it("should handle complex response data", async () => {
      const responseData = {
        userId: "user123",
        formId: "form123",
        responses: {
          textField: "Some text",
          numberField: 42,
          booleanField: true,
          arrayField: ["option1", "option2"],
          objectField: {
            nestedProperty: "nested value",
            nestedNumber: 123,
          },
        },
      };

      mockSave.mockResolvedValue(true);

      const result = await responseModel.create(responseData);

      expect(result.responses).toEqual(responseData.responses);
    });

    it("should handle missing required fields", async () => {
      const incompleteData = {
        userId: "user123",
        // Missing formId and responses
      };

      mockSave.mockResolvedValue(true);

      const result = await responseModel.create(incompleteData);

      expect(result.userId).toBe(incompleteData.userId);
      expect(result.formId).toBeUndefined();
      expect(result.responses).toBeUndefined();
      expect(result.submittedOn).toBeInstanceOf(Date);
    });
  });
});
