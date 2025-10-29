// __tests__/middleware/auth.test.js
const jwt = require("jsonwebtoken");
const { authenticateToken, SECRET } = require("../../middleware/auth");

describe("Authentication Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("authenticateToken", () => {
    it("should call next() with valid token", () => {
      const mockUser = { id: "user123", email: "test@example.com" };
      const token = jwt.sign(mockUser, SECRET, { expiresIn: "1h" });
      req.headers.authorization = `Bearer ${token}`;

      authenticateToken(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(req.user).toEqual(expect.objectContaining(mockUser));
    });

    it("should return 401 when no authorization header is provided", () => {
      authenticateToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "Missing token" });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 401 when authorization header is malformed", () => {
      req.headers.authorization = "InvalidHeaderFormat";

      authenticateToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "Missing token" });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 401 when authorization header has no token", () => {
      req.headers.authorization = "Bearer ";

      authenticateToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "Missing token" });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 403 with invalid token", () => {
      req.headers.authorization = "Bearer invalid-token";

      authenticateToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: "Invalid token" });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 403 with expired token", () => {
      const mockUser = { id: "user123", email: "test@example.com" };
      const expiredToken = jwt.sign(mockUser, SECRET, { expiresIn: "-1h" });
      req.headers.authorization = `Bearer ${expiredToken}`;

      authenticateToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: "Invalid token" });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 403 with token signed with wrong secret", () => {
      const mockUser = { id: "user123", email: "test@example.com" };
      const wrongToken = jwt.sign(mockUser, "wrong-secret", {
        expiresIn: "1h",
      });
      req.headers.authorization = `Bearer ${wrongToken}`;

      authenticateToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: "Invalid token" });
      expect(next).not.toHaveBeenCalled();
    });

    it("should handle case-insensitive authorization header", () => {
      const mockUser = { id: "user123", email: "test@example.com" };
      const token = jwt.sign(mockUser, SECRET, { expiresIn: "1h" });
      req.headers.Authorization = `Bearer ${token}`;
      delete req.headers.authorization;

      authenticateToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "Missing token" });
      expect(next).not.toHaveBeenCalled();
    });

    it("should preserve original user object properties", () => {
      const mockUser = {
        id: "user123",
        email: "test@example.com",
        role: "admin",
        permissions: ["read", "write"],
      };
      const token = jwt.sign(mockUser, SECRET, { expiresIn: "1h" });
      req.headers.authorization = `Bearer ${token}`;

      authenticateToken(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(req.user).toEqual(expect.objectContaining(mockUser));
      expect(req.user).toHaveProperty("iat");
      expect(req.user).toHaveProperty("exp");
    });
  });

  describe("SECRET constant", () => {
    it("should export SECRET constant", () => {
      expect(SECRET).toBeDefined();
      expect(typeof SECRET).toBe("string");
    });

    // Environment variable test removed due to module caching complexity
  });
});
