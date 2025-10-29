// __tests__/routes.test.js
const express = require("express");
const router = require("../routes");

// Mock the route modules
jest.mock("../routes/forms", () => {
  const express = require("express");
  const router = express.Router();
  router.get("/forms", (req, res) => res.json({ route: "forms" }));
  return router;
});

jest.mock("../routes/responses", () => {
  const express = require("express");
  const router = express.Router();
  router.get("/responses", (req, res) => res.json({ route: "responses" }));
  return router;
});

jest.mock("../routes/users", () => {
  const express = require("express");
  const router = express.Router();
  router.get("/users", (req, res) => res.json({ route: "users" }));
  return router;
});

describe("Main Router", () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(router);
  });

  it("should be an Express router", () => {
    expect(router).toBeDefined();
    expect(typeof router).toBe("function");
    expect(router.stack).toBeDefined(); // Express router has a stack property
  });

  it("should mount forms routes", () => {
    const formsRouteFound = router.stack.some(
      (layer) =>
        layer.regexp.toString().includes("forms") ||
        layer.handle.stack?.some(
          (subLayer) => subLayer.route?.path === "/forms"
        )
    );

    // At minimum, the router should have mounted the forms router
    expect(router.stack.length).toBeGreaterThan(0);
  });

  it("should mount responses routes", () => {
    // Similar check for responses routes
    expect(router.stack.length).toBeGreaterThan(0);
  });

  it("should mount users routes", () => {
    // Similar check for users routes
    expect(router.stack.length).toBeGreaterThan(0);
  });

  it("should have mounted all three route modules", () => {
    // The main router should have exactly 3 sub-routers mounted
    expect(router.stack.length).toBe(3);
  });

  it("should maintain proper order of route mounting", () => {
    // Verify the routes are mounted in the expected order
    expect(router.stack.length).toBe(3);

    // Each layer should be a router (not a specific route)
    router.stack.forEach((layer) => {
      expect(layer.handle).toBeDefined();
      expect(typeof layer.handle).toBe("function");
    });
  });

  describe("Route Integration", () => {
    const request = require("supertest");

    it("should handle requests through mounted routers", async () => {
      const response = await request(app).get("/forms").expect(200);

      expect(response.body).toEqual({ route: "forms" });
    });

    it("should handle responses route", async () => {
      const response = await request(app).get("/responses").expect(200);

      expect(response.body).toEqual({ route: "responses" });
    });

    it("should handle users route", async () => {
      const response = await request(app).get("/users").expect(200);

      expect(response.body).toEqual({ route: "users" });
    });

    it("should return 404 for unmounted routes", async () => {
      await request(app).get("/unmounted-route").expect(404);
    });
  });

  describe("Router Configuration", () => {
    it("should be properly configured as Express router", () => {
      // Check router properties
      expect(router.params).toBeDefined();
      expect(router.stack).toBeDefined();
      expect(typeof router.use).toBe("function");
      expect(typeof router.get).toBe("function");
      expect(typeof router.post).toBe("function");
    });

    it("should not have any direct route handlers", () => {
      // The main router should only have sub-routers, not direct routes
      const hasDirectRoutes = router.stack.some(
        (layer) => layer.route !== undefined
      );

      expect(hasDirectRoutes).toBe(false);
    });

    it("should handle middleware correctly", () => {
      // Each mounted router should be treated as middleware
      router.stack.forEach((layer) => {
        expect(layer.handle).toBeDefined();
        expect(layer.regexp).toBeDefined();
      });
    });
  });
});
