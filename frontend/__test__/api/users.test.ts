import { loginUser } from "../../src/api/users";
import { apiClient } from "../../src/api/client";

describe("users API", () => {
  beforeEach(() => {
    jest.spyOn(apiClient, "post").mockImplementation((path, body) => {
      if (path === "/login") {
        return Promise.resolve({ success: true });
      }
      if (path === "/users") {
        return Promise.resolve({
          username: body.username,
          password: body.password,
        });
      }
      return Promise.resolve({ error: "Unknown" });
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("logs in a user", async () => {
    const result = await loginUser("testuser", "testpass");
    expect(result.success).toBe(true);
  });
});
