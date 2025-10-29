import { ConditionalLogic, FieldSchema } from '../types/schema';

export function evaluateCondition(
  condition: ConditionalLogic,
  formData: { [key: string]: any }
): boolean {
  const fieldValue = formData[condition.field];
  const conditionValue = condition.value;

  switch (condition.operator) {
    case 'equals':
      return fieldValue === conditionValue;
    case 'notEquals':
      return fieldValue !== conditionValue;
    case 'contains':
      if (Array.isArray(fieldValue)) {
        return fieldValue.includes(conditionValue);
      }
      if (typeof fieldValue === 'string') {
        return fieldValue.includes(conditionValue);
      }
      return false;
    case 'greaterThan':
      return Number(fieldValue) > Number(conditionValue);
    case 'lessThan':
      return Number(fieldValue) < Number(conditionValue);
    default:
      return true;
  }
}

export function shouldShowField(
  field: FieldSchema,
  formData: { [key: string]: any }
): boolean {
  if (!field.conditional || field.conditional.length === 0) {
    return true;
  }

  // Evaluate all conditions
  const showConditions = field.conditional.filter(c => c.action === 'show');
  const hideConditions = field.conditional.filter(c => c.action === 'hide');

  // If there are hide conditions, check them first
  if (hideConditions.length > 0) {
    const shouldHide = hideConditions.some(condition =>
      evaluateCondition(condition, formData)
    );
    if (shouldHide) return false;
  }

  // If there are show conditions, at least one must be true
  if (showConditions.length > 0) {
    return showConditions.some(condition =>
      evaluateCondition(condition, formData)
    );
  }

  return true;
}

export function isFieldRequired(
  field: FieldSchema,
  formData: { [key: string]: any }
): boolean {
  const baseRequired = field.validation?.required || false;

  if (!field.conditional) {
    return baseRequired;
  }

  const requireConditions = field.conditional.filter(c => c.action === 'require');
  
  if (requireConditions.length > 0) {
    const shouldRequire = requireConditions.some(condition =>
      evaluateCondition(condition, formData)
    );
    return baseRequired || shouldRequire;
  }

  return baseRequired;
}

export function isFieldDisabled(
  field: FieldSchema,
  formData: { [key: string]: any }
): boolean {
  const baseDisabled = field.disabled || false;

  if (!field.conditional) {
    return baseDisabled;
  }

  const disableConditions = field.conditional.filter(c => c.action === 'disable');
  const enableConditions = field.conditional.filter(c => c.action === 'enable');

  if (disableConditions.length > 0) {
    const shouldDisable = disableConditions.some(condition =>
      evaluateCondition(condition, formData)
    );
    if (shouldDisable) return true;
  }

  if (enableConditions.length > 0) {
    const shouldEnable = enableConditions.some(condition =>
      evaluateCondition(condition, formData)
    );
    if (!shouldEnable) return true;
  }

  return baseDisabled;
}
