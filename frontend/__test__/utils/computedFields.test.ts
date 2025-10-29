import { describe, it, expect } from "@jest/globals";

describe("Computed Fields Utility", () => {
  describe("evaluateFormula", () => {
    it("should evaluate simple arithmetic formulas", () => {
      const formula = "price * quantity";
      const context = { price: 10, quantity: 5 };

      const result = evaluateFormula(formula, context);
      expect(result).toBe(50);
    });

    it("should handle addition and subtraction", () => {
      const formula = "base + tax - discount";
      const context = { base: 100, tax: 10, discount: 5 };

      const result = evaluateFormula(formula, context);
      expect(result).toBe(105);
    });

    it("should handle division", () => {
      const formula = "total / count";
      const context = { total: 100, count: 4 };

      const result = evaluateFormula(formula, context);
      expect(result).toBe(25);
    });

    it("should handle parentheses for precedence", () => {
      const formula = "(price + tax) * quantity";
      const context = { price: 10, tax: 2, quantity: 3 };

      const result = evaluateFormula(formula, context);
      expect(result).toBe(36);
    });

    it("should return 0 for missing dependencies", () => {
      const formula = "price * quantity";
      const context = { price: 10 };

      const result = evaluateFormula(formula, context);
      expect(result).toBe(0);
    });

    it("should handle negative numbers", () => {
      const formula = "revenue - cost";
      const context = { revenue: 100, cost: 150 };

      const result = evaluateFormula(formula, context);
      expect(result).toBe(-50);
    });

    it("should handle decimal numbers", () => {
      const formula = "price * 0.1";
      const context = { price: 100 };

      const result = evaluateFormula(formula, context);
      expect(result).toBe(10);
    });
  });

  describe("formatComputedValue", () => {
    it("should format to specified precision", () => {
      const value = 10.12345;

      expect(formatComputedValue(value, 2)).toBe("10.12");
      expect(formatComputedValue(value, 0)).toBe("10");
      expect(formatComputedValue(value, 4)).toBe("10.1235");
    });

    it("should handle whole numbers", () => {
      const value = 100;

      expect(formatComputedValue(value, 2)).toBe("100.00");
      expect(formatComputedValue(value, 0)).toBe("100");
    });

    it("should round correctly", () => {
      expect(formatComputedValue(10.126, 2)).toBe("10.13");
      expect(formatComputedValue(10.124, 2)).toBe("10.12");
    });
  });

  describe("updateComputedFields", () => {
    it("should calculate computed field based on dependencies", () => {
      const fields = [
        { id: "price", type: "number" as const, label: "Price" },
        { id: "quantity", type: "number" as const, label: "Quantity" },
        {
          id: "total",
          type: "number" as const,
          label: "Total",
          computed: {
            formula: "price * quantity",
            dependencies: ["price", "quantity"],
            precision: 2,
          },
        },
      ];

      const formData = { price: "10", quantity: "5" };
      const result = updateComputedFields(fields, formData);

      expect(result.total).toBe("50.00");
    });

    it("should handle multiple computed fields", () => {
      const fields = [
        { id: "base", type: "number" as const, label: "Base" },
        {
          id: "tax",
          type: "number" as const,
          label: "Tax",
          computed: {
            formula: "base * 0.1",
            dependencies: ["base"],
            precision: 2,
          },
        },
        {
          id: "total",
          type: "number" as const,
          label: "Total",
          computed: {
            formula: "base + tax",
            dependencies: ["base", "tax"],
            precision: 2,
          },
        },
      ];

      const formData = { base: "100" };
      const result = updateComputedFields(fields, formData);

      expect(result.tax).toBe("10.00");
      expect(result.total).toBe("110.00");
    });

    it("should not update non-computed fields", () => {
      const fields = [{ id: "name", type: "text" as const, label: "Name" }];

      const formData = { name: "John" };
      const result = updateComputedFields(fields, formData);

      expect(result.name).toBe("John");
    });
  });
});

// Helper function implementations (placeholders)
function evaluateFormula(
  formula: string,
  context: Record<string, number>
): number {
  try {
    // Replace variable names with their values
    let evalStr = formula;
    Object.keys(context).forEach((key) => {
      const value = context[key] || 0;
      evalStr = evalStr.replace(new RegExp(`\\b${key}\\b`, "g"), String(value));
    });

    // Evaluate the expression safely
    // Note: In production, use a proper math expression parser
    return eval(evalStr);
  } catch {
    return 0;
  }
}

function formatComputedValue(value: number, precision: number = 2): string {
  return value.toFixed(precision);
}

function updateComputedFields(
  fields: any[],
  formData: Record<string, any>
): Record<string, any> {
  const result = { ...formData };

  // Convert string values to numbers for computation
  const numericData: Record<string, number> = {};
  Object.keys(formData).forEach((key) => {
    numericData[key] = Number(formData[key]) || 0;
  });

  fields.forEach((field) => {
    if (field.computed) {
      const value = evaluateFormula(field.computed.formula, numericData);
      result[field.id] = formatComputedValue(value, field.computed.precision);
      numericData[field.id] = value; // Update for dependent fields
    }
  });

  return result;
}
