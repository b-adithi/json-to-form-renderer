import { fetchForms, createForm, updateForm, deleteForm } from "../../src/api/forms";
import { apiClient } from "../../src/api/client";
// ...existing code...

describe("forms API", () => {
  beforeEach(() => {
    jest.spyOn(apiClient, "get").mockResolvedValue([]);
    jest.spyOn(apiClient, "post").mockResolvedValue({
      _id: "1",
      name: "Test",
      status: "published",
      schema: {},
    });
    jest.spyOn(apiClient, "put").mockResolvedValue({
      _id: "1",
      name: "Updated",
      status: "draft",
      schema: {},
    });
    jest.spyOn(apiClient, "delete").mockResolvedValue({ success: true });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("fetches forms", async () => {
    const forms = await fetchForms();
    expect(Array.isArray(forms)).toBe(true);
  });

  it("creates a form", async () => {
    const form = await createForm({
      name: "Test",
      status: "published",
      schema: { title: "Test Form" },
    });
    expect(form.name).toBe("Test");
  });

  it("updates a form", async () => {
    const form = await updateForm("1", {
      name: "Updated",
      schema: { title: "Updated Form" },
    });
    expect(form.name).toBe("Updated");
  });

  it("deletes a form", async () => {
    const result = await deleteForm("1");
    expect(result.success).toBe(true);
  });
});
