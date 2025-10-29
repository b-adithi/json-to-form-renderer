// __tests__/responses.test.js
const request = require("supertest");
const app = require("../server");

describe("Responses API", () => {
  let token;
  let formId;

  beforeAll(async () => {
    // Login and get JWT token
    const loginRes = await request(app)
      .post("/login")
      .send({ username: "demo@formrenderer.com", password: "demo123" });
    token = loginRes.body.token;

    // Create a form to use for responses
    const formRes = await request(app)
      .post("/forms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Test Form",
        schema: { title: "Test", fields: [] },
        status: "draft",
      });
    formId = formRes.body._id;
  });

  it("should get responses for a form", async () => {
    const res = await request(app)
      .get(`/forms/${formId}/responses`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
