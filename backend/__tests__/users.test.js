// __tests__/users.test.js
const request = require("supertest");
const jwt = require("jsonwebtoken");

// Mock the users model
const mockUsers = {
  create: jest.fn(),
  login: jest.fn(),
};

jest.mock("../models/users", () => mockUsers);
jest.mock("../models/db", () => jest.fn());
jest.mock("../models/seedDemoUser", () => jest.fn().mockResolvedValue());

const app = require("../server");

describe("Users API Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /users - User Registration", () => {
    it("should register a new user successfully", async () => {
      const newUser = {
        username: "newuser@example.com",
        password: "password123",
        _id: "user123",
      };

      mockUsers.create.mockResolvedValue(newUser);

      const response = await request(app)
        .post("/users")
        .send({
          username: "newuser@example.com",
          password: "password123",
        })
        .expect(200);

      expect(mockUsers.create).toHaveBeenCalledWith({
        username: "newuser@example.com",
        password: "password123",
      });

      expect(response.body).toHaveProperty("username", "newuser@example.com");
      expect(response.body).toHaveProperty("token");

      // Verify token is valid
      const decoded = jwt.verify(
        response.body.token,
        process.env.JWT_SECRET || "supersecretkey"
      );
      expect(decoded.username).toBe("newuser@example.com");
    });

    it("should return 409 when user already exists", async () => {
      mockUsers.create.mockResolvedValue({
        error: "User already exists",
      });

      const response = await request(app)
        .post("/users")
        .send({
          username: "existing@example.com",
          password: "password123",
        })
        .expect(409);

      expect(response.body).toEqual({
        error: "User already exists",
      });
    });

    it("should handle missing username", async () => {
      mockUsers.create.mockResolvedValue({
        error: "Username is required",
      });

      const response = await request(app)
        .post("/users")
        .send({
          password: "password123",
        })
        .expect(409);

      expect(mockUsers.create).toHaveBeenCalledWith({
        username: undefined,
        password: "password123",
      });
    });

    it("should handle missing password", async () => {
      mockUsers.create.mockResolvedValue({
        error: "Password is required",
      });

      const response = await request(app)
        .post("/users")
        .send({
          username: "user@example.com",
        })
        .expect(409);

      expect(mockUsers.create).toHaveBeenCalledWith({
        username: "user@example.com",
        password: undefined,
      });
    });

    it("should handle database errors during registration", async () => {
      mockUsers.create.mockRejectedValue(
        new Error("Database connection failed")
      );

      await request(app)
        .post("/users")
        .send({
          username: "user@example.com",
          password: "password123",
        })
        .expect(500);
    }, 10000);

    it("should handle empty request body", async () => {
      mockUsers.create.mockResolvedValue({
        error: "Invalid data",
      });

      const response = await request(app).post("/users").send({}).expect(409);

      expect(mockUsers.create).toHaveBeenCalledWith({
        username: undefined,
        password: undefined,
      });
    });

    it("should generate valid JWT token", async () => {
      const newUser = {
        username: "testuser@example.com",
        password: "password123",
      };

      mockUsers.create.mockResolvedValue(newUser);

      const response = await request(app)
        .post("/users")
        .send(newUser)
        .expect(200);

      expect(response.body.token).toBeDefined();

      // Decode and verify token
      const decoded = jwt.verify(
        response.body.token,
        process.env.JWT_SECRET || "supersecretkey"
      );
      expect(decoded.username).toBe(newUser.username);
      expect(decoded.exp).toBeGreaterThan(Date.now() / 1000);
    });
  });

  describe("POST /login - User Authentication", () => {
    it("should login user with valid credentials", async () => {
      mockUsers.login.mockResolvedValue({
        success: true,
        user: {
          username: "demo@formrenderer.com",
          _id: "user123",
        },
      });

      const response = await request(app)
        .post("/login")
        .send({
          username: "demo@formrenderer.com",
          password: "demo123",
        })
        .expect(200);

      expect(mockUsers.login).toHaveBeenCalledWith({
        username: "demo@formrenderer.com",
        password: "demo123",
      });

      expect(response.body).toEqual({
        success: true,
        token: expect.any(String),
      });

      // Verify token
      const decoded = jwt.verify(
        response.body.token,
        process.env.JWT_SECRET || "supersecretkey"
      );
      expect(decoded.username).toBe("demo@formrenderer.com");
    });

    it("should return 401 for invalid credentials", async () => {
      mockUsers.login.mockResolvedValue({
        success: false,
        error: "Invalid credentials",
      });

      const response = await request(app)
        .post("/login")
        .send({
          username: "demo@formrenderer.com",
          password: "wrongpassword",
        })
        .expect(401);

      expect(response.body).toEqual({
        error: "Invalid credentials",
      });
    });

    it("should return 401 for non-existent user", async () => {
      mockUsers.login.mockResolvedValue({
        success: false,
        error: "Invalid credentials",
      });

      const response = await request(app)
        .post("/login")
        .send({
          username: "nonexistent@example.com",
          password: "password123",
        })
        .expect(401);

      expect(response.body).toEqual({
        error: "Invalid credentials",
      });
    });

    it("should handle missing username", async () => {
      mockUsers.login.mockResolvedValue({
        success: false,
        error: "Invalid credentials",
      });

      const response = await request(app)
        .post("/login")
        .send({
          password: "password123",
        })
        .expect(401);

      expect(mockUsers.login).toHaveBeenCalledWith({
        username: undefined,
        password: "password123",
      });
    });

    it("should handle missing password", async () => {
      mockUsers.login.mockResolvedValue({
        success: false,
        error: "Invalid credentials",
      });

      const response = await request(app)
        .post("/login")
        .send({
          username: "user@example.com",
        })
        .expect(401);

      expect(mockUsers.login).toHaveBeenCalledWith({
        username: "user@example.com",
        password: undefined,
      });
    });

    it("should handle database errors during login", async () => {
      mockUsers.login.mockRejectedValue(
        new Error("Database connection failed")
      );

      await request(app)
        .post("/login")
        .send({
          username: "user@example.com",
          password: "password123",
        })
        .expect(500);
    }, 10000);

    it("should handle empty request body", async () => {
      mockUsers.login.mockResolvedValue({
        success: false,
        error: "Invalid credentials",
      });

      const response = await request(app).post("/login").send({}).expect(401);

      expect(mockUsers.login).toHaveBeenCalledWith({
        username: undefined,
        password: undefined,
      });
    });

    it("should generate JWT token with correct expiration", async () => {
      mockUsers.login.mockResolvedValue({
        success: true,
        user: { username: "test@example.com" },
      });

      const beforeLogin = Math.floor(Date.now() / 1000);

      const response = await request(app)
        .post("/login")
        .send({
          username: "test@example.com",
          password: "password123",
        })
        .expect(200);

      const decoded = jwt.verify(
        response.body.token,
        process.env.JWT_SECRET || "supersecretkey"
      );

      // Token should expire in 1 hour (3600 seconds)
      expect(decoded.exp - decoded.iat).toBe(3600);
      expect(decoded.iat).toBeGreaterThanOrEqual(beforeLogin);
    });
  });

  describe("Route Error Handling", () => {
    it("should handle malformed JSON in request body", async () => {
      const response = await request(app)
        .post("/login")
        .set("Content-Type", "application/json")
        .send("invalid json")
        .expect(400);
    });

    it("should handle requests with wrong content-type", async () => {
      // Mock login to fail when undefined values are passed
      mockUsers.login.mockResolvedValue({
        success: false,
        error: "Invalid credentials",
      });

      const response = await request(app)
        .post("/login")
        .set("Content-Type", "text/plain")
        .send("username=test&password=test")
        .expect(401); // Should still process but with undefined values

      // Since body won't be parsed correctly, login should fail
      expect(response.body).toHaveProperty("error");

      // Verify that undefined values were passed to mock
      expect(mockUsers.login).toHaveBeenCalledWith({
        username: undefined,
        password: undefined,
      });
    });

    it("should handle very large request bodies", async () => {
      const largeData = {
        username: "test@example.com",
        password: "password123",
        extraData: "x".repeat(100000),
      };

      mockUsers.login.mockResolvedValue({
        success: false,
        error: "Invalid credentials",
      });

      await request(app).post("/login").send(largeData).expect(401); // Should process but fail authentication
    });
  });
});
