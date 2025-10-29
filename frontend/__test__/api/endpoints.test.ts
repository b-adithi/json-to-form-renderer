import { ENDPOINTS } from "../../src/api/endpoints";

describe("API Endpoints", () => {
  describe("ENDPOINTS object", () => {
    it("should define forms endpoint", () => {
      expect(ENDPOINTS.forms).toBe("/forms");
    });

    it("should define responses endpoint", () => {
      expect(ENDPOINTS.responses).toBe("/responses");
    });

    it("should define login endpoint", () => {
      expect(ENDPOINTS.login).toBe("/login");
    });

    it("should define form function that generates endpoint with id", () => {
      expect(typeof ENDPOINTS.form).toBe("function");
    });

    it("should generate correct form endpoint with id", () => {
      const formId = "test-form-123";
      expect(ENDPOINTS.form(formId)).toBe(`/forms/${formId}`);
    });

    it("should handle empty string id", () => {
      expect(ENDPOINTS.form("")).toBe("/forms/");
    });

    it("should handle special characters in id", () => {
      const specialId = "form-123!@#$%";
      expect(ENDPOINTS.form(specialId)).toBe(`/forms/${specialId}`);
    });

    it("should handle numeric id as string", () => {
      const numericId = "12345";
      expect(ENDPOINTS.form(numericId)).toBe(`/forms/${numericId}`);
    });
  });

  describe("Endpoint structure", () => {
    it("should have all expected endpoint properties", () => {
      expect(ENDPOINTS).toHaveProperty("forms");
      expect(ENDPOINTS).toHaveProperty("form");
      expect(ENDPOINTS).toHaveProperty("responses");
      expect(ENDPOINTS).toHaveProperty("login");
    });

    it("should have correct number of properties", () => {
      const keys = Object.keys(ENDPOINTS);
      expect(keys).toHaveLength(4);
    });

    it("should maintain consistent endpoint naming", () => {
      expect(ENDPOINTS.forms.startsWith("/")).toBe(true);
      expect(ENDPOINTS.responses.startsWith("/")).toBe(true);
      expect(ENDPOINTS.login.startsWith("/")).toBe(true);
      expect(ENDPOINTS.form("test").startsWith("/")).toBe(true);
    });
  });
});
