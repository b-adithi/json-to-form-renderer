// __tests__/models/seedDemoUser.test.js

// Mock the User model from collections first
const mockFindOne = jest.fn();
const mockCreate = jest.fn();

jest.mock("../../models/collections", () => ({
  User: {
    findOne: mockFindOne,
    create: mockCreate,
  },
}));

// Now require the module after mocks are set up
const seedDemoUser = require("../../models/seedDemoUser");

// Mock console methods
const originalConsoleLog = console.log;

describe("Seed Demo User", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn();
  });

  afterEach(() => {
    console.log = originalConsoleLog;
  });

  it("should create demo user when it doesn't exist", async () => {
    mockFindOne.mockResolvedValue(null); // User doesn't exist
    mockCreate.mockResolvedValue({
      username: "demo@formrenderer.com",
      password: "demo123",
    });

    await seedDemoUser();

    expect(mockFindOne).toHaveBeenCalledWith({
      username: "demo@formrenderer.com",
    });
    expect(mockCreate).toHaveBeenCalledWith({
      username: "demo@formrenderer.com",
      password: "demo123",
    });
    expect(console.log).toHaveBeenCalledWith("Demo user created");
  });

  it("should not create demo user when it already exists", async () => {
    const existingUser = {
      username: "demo@formrenderer.com",
      password: "demo123",
    };
    mockFindOne.mockResolvedValue(existingUser); // User exists

    await seedDemoUser();

    expect(mockFindOne).toHaveBeenCalledWith({
      username: "demo@formrenderer.com",
    });
    expect(mockCreate).not.toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith("Demo user already exists");
  });

  it("should handle database errors during findOne", async () => {
    const findError = new Error("Database connection failed");
    mockFindOne.mockRejectedValue(findError);

    await expect(seedDemoUser()).rejects.toThrow("Database connection failed");
    expect(mockFindOne).toHaveBeenCalledWith({
      username: "demo@formrenderer.com",
    });
    expect(mockCreate).not.toHaveBeenCalled();
    expect(console.log).not.toHaveBeenCalled();
  });

  it("should handle database errors during create", async () => {
    mockFindOne.mockResolvedValue(null);

    const createError = new Error("Failed to create user");
    mockCreate.mockRejectedValue(createError);

    await expect(seedDemoUser()).rejects.toThrow("Failed to create user");
    expect(mockFindOne).toHaveBeenCalledWith({
      username: "demo@formrenderer.com",
    });
    expect(mockCreate).toHaveBeenCalledWith({
      username: "demo@formrenderer.com",
      password: "demo123",
    });
    expect(console.log).not.toHaveBeenCalled();
  });

  it("should handle null return from findOne correctly", async () => {
    mockFindOne.mockResolvedValue(null);
    mockCreate.mockResolvedValue({
      username: "demo@formrenderer.com",
      password: "demo123",
    });

    await seedDemoUser();

    expect(mockCreate).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith("Demo user created");
  });

  it("should handle undefined return from findOne correctly", async () => {
    mockFindOne.mockResolvedValue(undefined);
    mockCreate.mockResolvedValue({
      username: "demo@formrenderer.com",
      password: "demo123",
    });

    await seedDemoUser();

    expect(mockCreate).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith("Demo user created");
  });

  it("should handle falsy return from findOne correctly", async () => {
    mockFindOne.mockResolvedValue(false);
    mockCreate.mockResolvedValue({
      username: "demo@formrenderer.com",
      password: "demo123",
    });

    await seedDemoUser();

    expect(mockCreate).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith("Demo user created");
  });

  it("should not create user when findOne returns empty object", async () => {
    mockFindOne.mockResolvedValue({}); // Empty object is truthy

    await seedDemoUser();

    expect(mockCreate).not.toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith("Demo user already exists");
  });
});
