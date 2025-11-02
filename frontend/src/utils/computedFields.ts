import { ComputedField } from "../types/schema";

export function evaluateFormula(
  formula: string,
  formData: { [key: string]: any },
  dependencies: string[]
): number | null {
  try {
    // Create a safe evaluation context with all field values and proper types
    const context: { [key: string]: any } = {};

    dependencies.forEach((dep) => {
      const value = formData[dep];
      // Keep original value type for string comparisons, but convert to number when needed
      if (typeof value === "string" && !isNaN(parseFloat(value))) {
        context[dep] = parseFloat(value);
      } else if (typeof value === "number") {
        context[dep] = value;
      } else {
        context[dep] = value || 0;
      }
    });

    // Create a function with the context variables as parameters
    const contextKeys = Object.keys(context);
    const contextValues = contextKeys.map((key) => context[key]);

    // Create the function with proper variable scope
    const evalFunction = new Function(...contextKeys, `return ${formula}`);
    const result = evalFunction(...contextValues);

    return typeof result === "number" && !isNaN(result) ? result : null;
  } catch (error) {
    console.error("Error evaluating formula:", formula, error);
    return null;
  }
}

export function calculateComputedField(
  computed: ComputedField,
  formData: { [key: string]: any }
): number | null {
  const result = evaluateFormula(
    computed.formula,
    formData,
    computed.dependencies
  );

  if (result === null) return null;

  // Apply precision if specified
  if (computed.precision !== undefined) {
    return parseFloat(result.toFixed(computed.precision));
  }

  return result;
}

export function updateComputedFields(
  fields: any[],
  formData: { [key: string]: any }
): { [key: string]: any } {
  const updates: { [key: string]: any } = {};

  fields.forEach((field) => {
    if (field.computed) {
      const value = calculateComputedField(field.computed, formData);
      if (value !== null) {
        updates[field.id] = value;
      }
    }
  });

  return updates;
}
