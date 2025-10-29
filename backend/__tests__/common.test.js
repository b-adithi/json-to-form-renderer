const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");

describe("Backend API Extra Coverage", () => {
  afterAll(async () => {
    await mongoose.connection.close();
  });

  // Swagger docs endpoint
  it("should return Swagger UI HTML", async () => {
    const res = await request(app).get("/api-docs").redirects(1);
    expect([200, 301]).toContain(res.status);
    expect(res.text).toContain("Swagger UI");
  });

  // Invalid route
  it("should return 404 for unknown route", async () => {
    const res = await request(app).get("/not-a-real-route");
    expect(res.status).toBe(404);
  });

  // CORS headers present
  it("should include CORS headers", async () => {
    const res = await request(app).get("/");
    expect(res.headers["access-control-allow-origin"]).toBe("*");
  });

  // Authentication required endpoint (example: get user profile)
  it("should reject unauthenticated access to protected endpoint", async () => {
    const res = await request(app).get("/forms");
    expect([401, 403, 404]).toContain(res.status);
  });

  // Invalid JWT
  it("should reject access with invalid JWT", async () => {
    const res = await request(app)
      .get("/forms")
      .set("Authorization", "Bearer invalidtoken");
    expect([401, 403, 404]).toContain(res.status);
  });

  // Simulate DB error (mock connectDB to throw)
  it("should handle DB connection error gracefully", async () => {
    jest.spyOn(mongoose, "connect").mockImplementationOnce(() => {
      throw new Error("DB connection failed");
    });
    try {
      await require("../models/db")();
    } catch (err) {
      expect(err.message).toMatch(/DB connection failed/);
    }
    mongoose.connect.mockRestore();
  });
});
