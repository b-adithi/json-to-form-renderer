// __tests__/models/users.test.js

// Mock mongoose first with inline mock functions
const mockSave = jest.fn();
const mockFindOne = jest.fn();

const mockUser = jest.fn().mockImplementation(function (data) {
  this.username = data.username;
  this.password = data.password;
  this.createdOn = data.createdOn;
  this.updatedOn = data.updatedOn;
  this.save = mockSave;
  return this;
});

// Set up static methods on the constructor
mockUser.findOne = mockFindOne;

jest.mock("mongoose", () => ({
  model: jest.fn(() => mockUser),
  Schema: jest.fn(),
}));

// Mock the User model
jest.mock("../../schemas/user", () => ({}));

// Now require the module after mocks are set up
const userModel = require("../../models/users");

describe("User Model", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default mocks
    const mongoose = require("mongoose");
    mongoose.model.mockReturnValue({
      findOne: mockFindOne,
    });

    // Mock the User constructor
    global.User = mockUser;

    // Mock mongoose.model to return our mocked User
    const originalModel = mongoose.model;
    mongoose.model.mockImplementation((name, schema) => {
      if (name === "User") {
        return {
          findOne: mockFindOne,
          prototype: mockUser.prototype,
        };
      }
      return originalModel(name, schema);
    });
  });

  describe("create", () => {
    it("should create a new user successfully", async () => {
      mockFindOne.mockResolvedValue(null); // User doesn't exist
      mockSave.mockResolvedValue(true);

      const userData = {
        username: "test@example.com",
        password: "password123",
      };
      const result = await userModel.create(userData);

      expect(mockFindOne).toHaveBeenCalledWith({ username: userData.username });
      expect(mockSave).toHaveBeenCalled();
      expect(result.username).toBe(userData.username);
      expect(result.password).toBe(userData.password);
      expect(result.createdOn).toBeInstanceOf(Date);
      expect(result.updatedOn).toBeInstanceOf(Date);
    });

    it("should return error when user already exists", async () => {
      const existingUser = {
        username: "test@example.com",
        password: "existing",
      };
      mockFindOne.mockResolvedValue(existingUser);

      const userData = {
        username: "test@example.com",
        password: "password123",
      };
      const result = await userModel.create(userData);

      expect(mockFindOne).toHaveBeenCalledWith({ username: userData.username });
      expect(mockSave).not.toHaveBeenCalled();
      expect(result).toEqual({ error: "User already exists" });
    });

    it("should handle database errors during save", async () => {
      mockFindOne.mockResolvedValue(null);
      const saveError = new Error("Database error");
      mockSave.mockRejectedValue(saveError);

      const userData = {
        username: "test@example.com",
        password: "password123",
      };

      await expect(userModel.create(userData)).rejects.toThrow(
        "Database error"
      );
      expect(mockFindOne).toHaveBeenCalledWith({ username: userData.username });
      expect(mockSave).toHaveBeenCalled();
    });

    it("should handle database errors during findOne", async () => {
      const findError = new Error("Database connection error");
      mockFindOne.mockRejectedValue(findError);

      const userData = {
        username: "test@example.com",
        password: "password123",
      };

      await expect(userModel.create(userData)).rejects.toThrow(
        "Database connection error"
      );
      expect(mockFindOne).toHaveBeenCalledWith({ username: userData.username });
      expect(mockSave).not.toHaveBeenCalled();
    });

    it("should create user with correct timestamp format", async () => {
      mockFindOne.mockResolvedValue(null);
      mockSave.mockResolvedValue(true);

      const beforeCreate = new Date();
      const userData = {
        username: "test@example.com",
        password: "password123",
      };
      const result = await userModel.create(userData);
      const afterCreate = new Date();

      expect(result.createdOn.getTime()).toBeGreaterThanOrEqual(
        beforeCreate.getTime()
      );
      expect(result.createdOn.getTime()).toBeLessThanOrEqual(
        afterCreate.getTime()
      );
      expect(result.updatedOn.getTime()).toBeGreaterThanOrEqual(
        beforeCreate.getTime()
      );
      expect(result.updatedOn.getTime()).toBeLessThanOrEqual(
        afterCreate.getTime()
      );
    });
  });

  describe("login", () => {
    it("should return success when credentials are valid", async () => {
      const user = {
        _id: "user123",
        username: "test@example.com",
        password: "password123",
      };
      mockFindOne.mockResolvedValue(user);

      const result = await userModel.login({
        username: "test@example.com",
        password: "password123",
      });

      expect(mockFindOne).toHaveBeenCalledWith({
        username: "test@example.com",
        password: "password123",
      });
      expect(result).toEqual({ success: true, user });
    });

    it("should return error when credentials are invalid", async () => {
      mockFindOne.mockResolvedValue(null);

      const result = await userModel.login({
        username: "test@example.com",
        password: "wrongpassword",
      });

      expect(mockFindOne).toHaveBeenCalledWith({
        username: "test@example.com",
        password: "wrongpassword",
      });
      expect(result).toEqual({ success: false, error: "Invalid credentials" });
    });

    it("should return error when user doesn't exist", async () => {
      mockFindOne.mockResolvedValue(null);

      const result = await userModel.login({
        username: "nonexistent@example.com",
        password: "password123",
      });

      expect(mockFindOne).toHaveBeenCalledWith({
        username: "nonexistent@example.com",
        password: "password123",
      });
      expect(result).toEqual({ success: false, error: "Invalid credentials" });
    });

    it("should handle database errors during login", async () => {
      const dbError = new Error("Database connection failed");
      mockFindOne.mockRejectedValue(dbError);

      await expect(
        userModel.login({
          username: "test@example.com",
          password: "password123",
        })
      ).rejects.toThrow("Database connection failed");

      expect(mockFindOne).toHaveBeenCalledWith({
        username: "test@example.com",
        password: "password123",
      });
    });

    it("should handle empty credentials", async () => {
      mockFindOne.mockResolvedValue(null);

      const result = await userModel.login({ username: "", password: "" });

      expect(mockFindOne).toHaveBeenCalledWith({ username: "", password: "" });
      expect(result).toEqual({ success: false, error: "Invalid credentials" });
    });
  });
});
