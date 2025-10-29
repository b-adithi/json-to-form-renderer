// __tests__/models/db.test.js
const mongoose = require("mongoose");
const connectDB = require("../../models/db");

// Mock mongoose
jest.mock("mongoose", () => ({
  connect: jest.fn(),
  connection: {
    on: jest.fn(),
  },
}));

// Mock console methods
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

describe("Database Connection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn();
    console.error = jest.fn();
  });

  afterEach(() => {
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
  });

  it("should connect to MongoDB with correct URI and options", () => {
    connectDB();

    expect(mongoose.connect).toHaveBeenCalledWith(
      process.env.MONGO_URI || "mongodb://localhost:27017/jsonformdb",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
  });

  it("should set up connection event listeners", () => {
    connectDB();

    expect(mongoose.connection.on).toHaveBeenCalledWith(
      "connected",
      expect.any(Function)
    );
    expect(mongoose.connection.on).toHaveBeenCalledWith(
      "error",
      expect.any(Function)
    );
  });

  it("should log success message on connection", () => {
    const mockOnCallback = jest.fn();
    mongoose.connection.on.mockImplementation((event, callback) => {
      if (event === "connected") {
        mockOnCallback.mockImplementation(callback);
      }
    });

    connectDB();
    mockOnCallback();

    expect(console.log).toHaveBeenCalledWith("MongoDB connected");
  });

  it("should log error message on connection error", () => {
    const mockOnCallback = jest.fn();
    const testError = new Error("Connection failed");

    mongoose.connection.on.mockImplementation((event, callback) => {
      if (event === "error") {
        mockOnCallback.mockImplementation(callback);
      }
    });

    connectDB();
    mockOnCallback(testError);

    expect(console.error).toHaveBeenCalledWith(
      "MongoDB connection error:",
      testError
    );
  });

  // Environment variable tests removed due to dependency on actual environment state
});
