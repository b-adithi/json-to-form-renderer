import { ComputedField } from '../types/schema';

export function evaluateFormula(
  formula: string,
  formData: { [key: string]: any },
  dependencies: string[]
): number | null {
  try {
    // Create a safe evaluation context with only the necessary field values
    const context: { [key: string]: number } = {};
    
    dependencies.forEach(dep => {
      const value = formData[dep];
      context[dep] = typeof value === 'number' ? value : parseFloat(value) || 0;
    });

    // Replace field references in formula with actual values
    let processedFormula = formula;
    dependencies.forEach(dep => {
      const regex = new RegExp(`\\b${dep}\\b`, 'g');
      processedFormula = processedFormula.replace(regex, context[dep].toString());
    });

    // Evaluate the formula safely
    // eslint-disable-next-line no-new-func
    const result = new Function(`return ${processedFormula}`)();
    
    return typeof result === 'number' && !isNaN(result) ? result : null;
  } catch (error) {
    console.error('Error evaluating formula:', error);
    return null;
  }
}

export function calculateComputedField(
  computed: ComputedField,
  formData: { [key: string]: any }
): number | null {
  const result = evaluateFormula(computed.formula, formData, computed.dependencies);
  
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
  
  fields.forEach(field => {
    if (field.computed) {
      const value = calculateComputedField(field.computed, formData);
      if (value !== null) {
        updates[field.id] = value;
      }
    }
  });
  
  return updates;
}
