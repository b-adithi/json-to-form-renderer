// __tests__/forms.test.js
const request = require("supertest");
const jwt = require("jsonwebtoken");

// Mock the forms model
const mockForms = {
  getAll: jest.fn(),
  get: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

jest.mock("../models/forms", () => mockForms);
jest.mock("../models/db", () => jest.fn());
jest.mock("../models/seedDemoUser", () => jest.fn().mockResolvedValue());

const { SECRET } = require("../middleware/auth");
const app = require("../server");

describe("Forms API Routes", () => {
  let validToken;
  let expiredToken;
  let invalidToken;

  beforeAll(() => {
    validToken = jwt.sign({ username: "test@example.com" }, SECRET, {
      expiresIn: "1h",
    });
    expiredToken = jwt.sign({ username: "test@example.com" }, SECRET, {
      expiresIn: "-1h",
    });
    invalidToken = "invalid-token";
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /forms - Get All Forms", () => {
    it("should return all forms with valid token", async () => {
      const mockFormsData = [
        {
          _id: "form1",
          name: "Contact Form",
          status: "published",
          responseCount: 5,
        },
        {
          _id: "form2",
          name: "Survey Form",
          status: "draft",
          responseCount: 0,
        },
      ];

      mockForms.getAll.mockResolvedValue(mockFormsData);

      const response = await request(app)
        .get("/forms")
        .set("Authorization", `Bearer ${validToken}`)
        .expect(200);

      expect(mockForms.getAll).toHaveBeenCalled();
      expect(response.body).toEqual(mockFormsData);
    });

    it("should return 401 without authentication token", async () => {
      await request(app).get("/forms").expect(401);

      expect(mockForms.getAll).not.toHaveBeenCalled();
    });

    it("should return 403 with invalid token", async () => {
      await request(app)
        .get("/forms")
        .set("Authorization", `Bearer ${invalidToken}`)
        .expect(403);

      expect(mockForms.getAll).not.toHaveBeenCalled();
    });

    it("should return 403 with expired token", async () => {
      await request(app)
        .get("/forms")
        .set("Authorization", `Bearer ${expiredToken}`)
        .expect(403);

      expect(mockForms.getAll).not.toHaveBeenCalled();
    });

    it("should handle database errors", async () => {
      mockForms.getAll.mockRejectedValue(new Error("Database error"));

      await request(app)
        .get("/forms")
        .set("Authorization", `Bearer ${validToken}`)
        .expect(500);
    }, 10000);

    it("should return empty array when no forms exist", async () => {
      mockForms.getAll.mockResolvedValue([]);

      const response = await request(app)
        .get("/forms")
        .set("Authorization", `Bearer ${validToken}`)
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe("POST /forms - Create Form", () => {
    const validFormData = {
      name: "Test Form",
      status: "draft",
      url: "/test-form",
      schema: { title: "Test", fields: [] },
    };

    it("should create a new form successfully", async () => {
      const now = new Date().toISOString();
      const createdForm = {
        _id: "form123",
        ...validFormData,
        createdOn: now,
        updatedOn: now,
      };

      mockForms.create.mockResolvedValue(createdForm);

      const response = await request(app)
        .post("/forms")
        .set("Authorization", `Bearer ${validToken}`)
        .send(validFormData)
        .expect(201);

      expect(mockForms.create).toHaveBeenCalledWith(validFormData);
      expect(response.body).toEqual(createdForm);
    });

    it("should return 401 without authentication token", async () => {
      await request(app).post("/forms").send(validFormData).expect(401);

      expect(mockForms.create).not.toHaveBeenCalled();
    });

    it("should return 403 with invalid token", async () => {
      await request(app)
        .post("/forms")
        .set("Authorization", `Bearer ${invalidToken}`)
        .send(validFormData)
        .expect(403);

      expect(mockForms.create).not.toHaveBeenCalled();
    });

    it("should handle empty request body", async () => {
      const createdForm = { _id: "form123" };
      mockForms.create.mockResolvedValue(createdForm);

      const response = await request(app)
        .post("/forms")
        .set("Authorization", `Bearer ${validToken}`)
        .send({})
        .expect(201);

      expect(mockForms.create).toHaveBeenCalledWith({});
      expect(response.body).toEqual(createdForm);
    });

    it("should handle complex schema objects", async () => {
      const complexFormData = {
        name: "Complex Form",
        status: "published",
        schema: {
          title: "Complex Survey",
          fields: [
            {
              type: "text",
              name: "firstName",
              label: "First Name",
              required: true,
            },
            { type: "email", name: "email", label: "Email Address" },
            { type: "select", name: "country", options: ["US", "CA", "UK"] },
          ],
        },
      };

      const createdForm = { _id: "complex123", ...complexFormData };
      mockForms.create.mockResolvedValue(createdForm);

      const response = await request(app)
        .post("/forms")
        .set("Authorization", `Bearer ${validToken}`)
        .send(complexFormData)
        .expect(201);

      expect(mockForms.create).toHaveBeenCalledWith(complexFormData);
      expect(response.body.schema).toEqual(complexFormData.schema);
    });

    it("should handle database errors during creation", async () => {
      mockForms.create.mockRejectedValue(new Error("Database error"));

      await request(app)
        .post("/forms")
        .set("Authorization", `Bearer ${validToken}`)
        .send(validFormData)
        .expect(500);
    }, 10000);
  });

  describe("GET /forms/:id - Get Form by ID", () => {
    it("should return form by ID", async () => {
      const mockForm = {
        _id: "form123",
        name: "Test Form",
        status: "published",
        schema: { title: "Test" },
      };

      mockForms.get.mockResolvedValue(mockForm);

      const response = await request(app)
        .get("/forms/form123")
        .set("Authorization", `Bearer ${validToken}`)
        .expect(200);

      expect(mockForms.get).toHaveBeenCalledWith("form123");
      expect(response.body).toEqual(mockForm);
    });

    it("should return null for non-existent form", async () => {
      mockForms.get.mockResolvedValue(null);

      const response = await request(app)
        .get("/forms/nonexistent")
        .set("Authorization", `Bearer ${validToken}`)
        .expect(200);

      expect(response.body).toBeNull();
    });

    it("should return 401 without authentication token", async () => {
      await request(app).get("/forms/form123").expect(401);

      expect(mockForms.get).not.toHaveBeenCalled();
    });

    it("should handle database errors", async () => {
      mockForms.get.mockRejectedValue(new Error("Database error"));

      await request(app)
        .get("/forms/form123")
        .set("Authorization", `Bearer ${validToken}`)
        .expect(500);
    }, 10000);
  });

  describe("PUT /forms/:id - Update Form", () => {
    const updateData = {
      name: "Updated Form",
      status: "published",
    };

    it("should update form successfully", async () => {
      const updatedForm = {
        _id: "form123",
        ...updateData,
        updatedOn: new Date().toISOString(),
      };

      mockForms.update.mockResolvedValue(updatedForm);

      const response = await request(app)
        .put("/forms/form123")
        .set("Authorization", `Bearer ${validToken}`)
        .send(updateData)
        .expect(200);

      expect(mockForms.update).toHaveBeenCalledWith("form123", updateData);
      expect(response.body).toEqual(updatedForm);
    });

    it("should return null for non-existent form", async () => {
      mockForms.update.mockResolvedValue(null);

      const response = await request(app)
        .put("/forms/nonexistent")
        .set("Authorization", `Bearer ${validToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toBeNull();
    });

    it("should return 401 without authentication token", async () => {
      await request(app).put("/forms/form123").send(updateData).expect(401);

      expect(mockForms.update).not.toHaveBeenCalled();
    });

    it("should handle partial updates", async () => {
      const partialUpdate = { name: "New Name Only" };
      const updatedForm = { _id: "form123", ...partialUpdate };

      mockForms.update.mockResolvedValue(updatedForm);

      const response = await request(app)
        .put("/forms/form123")
        .set("Authorization", `Bearer ${validToken}`)
        .send(partialUpdate)
        .expect(200);

      expect(mockForms.update).toHaveBeenCalledWith("form123", partialUpdate);
    });

    it("should handle empty update data", async () => {
      const updatedForm = { _id: "form123" };
      mockForms.update.mockResolvedValue(updatedForm);

      const response = await request(app)
        .put("/forms/form123")
        .set("Authorization", `Bearer ${validToken}`)
        .send({})
        .expect(200);

      expect(mockForms.update).toHaveBeenCalledWith("form123", {});
    });

    it("should handle database errors during update", async () => {
      mockForms.update.mockRejectedValue(new Error("Database error"));

      await request(app)
        .put("/forms/form123")
        .set("Authorization", `Bearer ${validToken}`)
        .send({ name: "Updated" })
        .expect(500);
    }, 10000);
  });

  describe("DELETE /forms/:id - Delete Form", () => {
    it("should delete form successfully", async () => {
      mockForms.remove.mockResolvedValue({ success: true });

      const response = await request(app)
        .delete("/forms/form123")
        .set("Authorization", `Bearer ${validToken}`)
        .expect(200);

      expect(mockForms.remove).toHaveBeenCalledWith("form123");
      expect(response.body).toEqual({ success: true });
    });

    it("should return success even for non-existent form", async () => {
      mockForms.remove.mockResolvedValue({ success: true });

      const response = await request(app)
        .delete("/forms/nonexistent")
        .set("Authorization", `Bearer ${validToken}`)
        .expect(200);

      expect(response.body).toEqual({ success: true });
    });

    it("should return 401 without authentication token", async () => {
      await request(app).delete("/forms/form123").expect(401);

      expect(mockForms.remove).not.toHaveBeenCalled();
    });

    it("should handle database errors during deletion", async () => {
      mockForms.remove.mockRejectedValue(new Error("Database error"));

      await request(app)
        .delete("/forms/form123")
        .set("Authorization", `Bearer ${validToken}`)
        .expect(500);
    }, 10000);
  });

  describe("Authentication Edge Cases", () => {
    it("should handle malformed authorization header", async () => {
      await request(app)
        .get("/forms")
        .set("Authorization", "InvalidFormat")
        .expect(401);

      expect(mockForms.getAll).not.toHaveBeenCalled();
    });

    it("should handle missing Bearer prefix", async () => {
      await request(app)
        .get("/forms")
        .set("Authorization", validToken)
        .expect(401);

      expect(mockForms.getAll).not.toHaveBeenCalled();
    });

    it("should handle empty authorization header", async () => {
      await request(app).get("/forms").set("Authorization", "").expect(401);

      expect(mockForms.getAll).not.toHaveBeenCalled();
    });
  });

  describe("Request Body Validation", () => {
    it("should handle malformed JSON", async () => {
      await request(app)
        .post("/forms")
        .set("Authorization", `Bearer ${validToken}`)
        .set("Content-Type", "application/json")
        .send("invalid json")
        .expect(400);
    });

    it("should handle very large payloads", async () => {
      const largePayload = {
        name: "Large Form",
        schema: {
          data: "x".repeat(100000),
        },
      };

      const createdForm = { _id: "large123", ...largePayload };
      mockForms.create.mockResolvedValue(createdForm);

      const response = await request(app)
        .post("/forms")
        .set("Authorization", `Bearer ${validToken}`)
        .send(largePayload)
        .expect(201);

      expect(mockForms.create).toHaveBeenCalledWith(largePayload);
    });
  });
});
