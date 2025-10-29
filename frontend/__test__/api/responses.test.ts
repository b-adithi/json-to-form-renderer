import { fetchResponses, submitResponse } from "../../src/api/responses";
import { apiClient } from "../../src/api/client";

describe("responses API", () => {
  beforeEach(() => {
    jest.spyOn(apiClient, "get").mockResolvedValue([
      {
        _id: "r1",
        userId: "u1",
        formId: "f1",
        responses: {},
        submittedOn: "2025-10-27",
      },
    ]);
    jest.spyOn(apiClient, "post").mockResolvedValue({
      _id: "r2",
      userId: "u2",
      formId: "f2",
      responses: { foo: "bar" },
      submittedOn: "2025-10-27",
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("fetches responses for a form", async () => {
    const responses = await fetchResponses("f1");
    expect(Array.isArray(responses)).toBe(true);
    expect(responses[0].formId).toBe("f1");
  });

  it("submits a response", async () => {
    const response = await submitResponse({
      userId: "u2",
      formId: "f2",
      responses: { foo: "bar" },
    });
    expect(response.responses.foo).toBe("bar");
  });
});
