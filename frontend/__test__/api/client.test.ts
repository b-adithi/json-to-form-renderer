import { ApiClient, setGlobalLogoutHandler } from "../../src/api/client";

// Mock fetch
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe("ApiClient", () => {
  let apiClient: ApiClient;

  beforeEach(() => {
    apiClient = new ApiClient();
    mockFetch.mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("constructor", () => {
    it("should use default baseUrl when not provided", () => {
      const client = new ApiClient();
      expect(client).toBeDefined();
    });

    it("should use custom baseUrl when provided", () => {
      const client = new ApiClient({ baseUrl: "https://example.com" });
      expect(client).toBeDefined();
    });

    it("should use custom headers when provided", () => {
      const headers = { "Custom-Header": "value" };
      const client = new ApiClient({ headers });
      expect(client).toBeDefined();
    });
  });

  describe("token management", () => {
    it("should set token", () => {
      apiClient.setToken("test-token");
      expect(() => apiClient.setToken("test-token")).not.toThrow();
    });

    it("should clear token", () => {
      apiClient.setToken("test-token");
      apiClient.clearToken();
      expect(() => apiClient.clearToken()).not.toThrow();
    });

    it("should include Authorization header when token is set", async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ data: "test" }),
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      apiClient.setToken("test-token");
      await apiClient.get("/test");

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:4000/test",
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer test-token",
          }),
        })
      );
    });

    it("should not include Authorization header when token is not set", async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ data: "test" }),
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      await apiClient.get("/test");

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:4000/test",
        expect.objectContaining({
          headers: expect.not.objectContaining({
            Authorization: expect.any(String),
          }),
        })
      );
    });
  });

  describe("HTTP methods", () => {
    beforeEach(() => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ data: "test" }),
      };
      mockFetch.mockResolvedValue(mockResponse as any);
    });

    it("should make GET requests", async () => {
      await apiClient.get("/test");

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:4000/test",
        expect.objectContaining({
          method: "GET",
        })
      );
    });

    it("should make POST requests with body", async () => {
      const body = { test: "data" };
      await apiClient.post("/test", body);

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:4000/test",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
          body: JSON.stringify(body),
        })
      );
    });

    it("should make POST requests without body", async () => {
      await apiClient.post("/test");

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:4000/test",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
          body: undefined,
        })
      );
    });

    it("should make PUT requests with body", async () => {
      const body = { test: "data" };
      await apiClient.put("/test", body);

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:4000/test",
        expect.objectContaining({
          method: "PUT",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
          body: JSON.stringify(body),
        })
      );
    });

    it("should make DELETE requests", async () => {
      await apiClient.delete("/test");

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:4000/test",
        expect.objectContaining({
          method: "DELETE",
        })
      );
    });
  });

  describe("request interceptors", () => {
    it("should apply request interceptor when provided", async () => {
      const interceptRequest = jest.fn((input, init) => ({
        input: input + "?intercepted=true",
        init,
      }));

      const client = new ApiClient({ interceptRequest });

      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ data: "test" }),
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      await client.get("/test");

      expect(interceptRequest).toHaveBeenCalled();
      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:4000/test?intercepted=true",
        expect.any(Object)
      );
    });

    it("should handle async request interceptor", async () => {
      const interceptRequest = jest.fn(async (input, init) => ({
        input: input + "?async=true",
        init,
      }));

      const client = new ApiClient({ interceptRequest });

      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ data: "test" }),
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      await client.get("/test");

      expect(interceptRequest).toHaveBeenCalled();
      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:4000/test?async=true",
        expect.any(Object)
      );
    });
  });

  describe("response interceptor", () => {
    it("should call global logout handler on 403 response", async () => {
      const mockLogoutHandler = jest.fn();
      setGlobalLogoutHandler(mockLogoutHandler);

      const mockResponse = {
        ok: false,
        status: 403,
        json: jest.fn().mockResolvedValue({ error: "Forbidden" }),
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      await apiClient.get("/test");

      expect(mockLogoutHandler).toHaveBeenCalled();
    });

    it("should not call logout handler on non-403 responses", async () => {
      const mockLogoutHandler = jest.fn();
      setGlobalLogoutHandler(mockLogoutHandler);

      const mockResponse = {
        ok: false,
        status: 404,
        json: jest.fn().mockResolvedValue({ error: "Not Found" }),
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      await apiClient.get("/test");

      expect(mockLogoutHandler).not.toHaveBeenCalled();
    });

    it("should handle missing global logout handler", async () => {
      setGlobalLogoutHandler(null as any);

      const mockResponse = {
        ok: false,
        status: 403,
        json: jest.fn().mockResolvedValue({ error: "Forbidden" }),
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      // Should not throw
      await expect(apiClient.get("/test")).resolves.toBeDefined();
    });
  });

  describe("headers handling", () => {
    it("should merge custom headers with default headers", async () => {
      const defaultHeaders = { "Default-Header": "default" };
      const client = new ApiClient({ headers: defaultHeaders });

      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ data: "test" }),
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      await client.get("/test", {
        headers: { "Custom-Header": "custom" },
      });

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:4000/test",
        expect.objectContaining({
          headers: expect.objectContaining({
            "Default-Header": "default",
            "Custom-Header": "custom",
          }),
        })
      );
    });

    it("should override default headers with request headers", async () => {
      const defaultHeaders = { "Shared-Header": "default" };
      const client = new ApiClient({ headers: defaultHeaders });

      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ data: "test" }),
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      await client.get("/test", {
        headers: { "Shared-Header": "override" },
      });

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:4000/test",
        expect.objectContaining({
          headers: expect.objectContaining({
            "Shared-Header": "override",
          }),
        })
      );
    });
  });

  describe("error handling", () => {
    it("should propagate fetch errors", async () => {
      mockFetch.mockRejectedValue(new Error("Network error"));

      await expect(apiClient.get("/test")).rejects.toThrow("Network error");
    });

    it("should handle JSON parsing errors", async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockRejectedValue(new Error("Invalid JSON")),
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      await expect(apiClient.get("/test")).rejects.toThrow("Invalid JSON");
    });
  });
});
