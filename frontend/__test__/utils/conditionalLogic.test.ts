import { 
  evaluateCondition, 
  shouldShowField, 
  isFieldRequired, 
  isFieldDisabled 
} from "../../src/utils/conditionalLogic";
import { ConditionalLogic, FieldSchema } from "../../src/types/schema";

describe("conditionalLogic utilities", () => {
  describe("evaluateCondition", () => {
    const formData = {
      name: "John",
      age: 25,
      isStudent: true,
      subjects: ["math", "science"],
      empty: "",
      zero: 0,
      nullValue: null,
      undefinedValue: undefined,
    };

    describe("equals operator", () => {
      it("should return true when values are equal", () => {
        const condition: ConditionalLogic = {
          field: "name",
          operator: "equals",
          value: "John",
          action: "show"
        };
        
        expect(evaluateCondition(condition, formData)).toBe(true);
      });

      it("should return false when values are not equal", () => {
        const condition: ConditionalLogic = {
          field: "name",
          operator: "equals",
          value: "Jane",
          action: "show"
        };
        
        expect(evaluateCondition(condition, formData)).toBe(false);
      });

      it("should handle boolean values", () => {
        const condition: ConditionalLogic = {
          field: "isStudent",
          operator: "equals",
          value: true,
          action: "show"
        };
        
        expect(evaluateCondition(condition, formData)).toBe(true);
      });

      it("should handle zero values", () => {
        const condition: ConditionalLogic = {
          field: "zero",
          operator: "equals",
          value: 0,
          action: "show"
        };
        
        expect(evaluateCondition(condition, formData)).toBe(true);
      });

      it("should handle null values", () => {
        const condition: ConditionalLogic = {
          field: "nullValue",
          operator: "equals",
          value: null,
          action: "show"
        };
        
        expect(evaluateCondition(condition, formData)).toBe(true);
      });
    });

    describe("notEquals operator", () => {
      it("should return false when values are equal", () => {
        const condition: ConditionalLogic = {
          field: "name",
          operator: "notEquals",
          value: "John",
          action: "show"
        };
        
        expect(evaluateCondition(condition, formData)).toBe(false);
      });

      it("should return true when values are not equal", () => {
        const condition: ConditionalLogic = {
          field: "name",
          operator: "notEquals",
          value: "Jane",
          action: "show"
        };
        
        expect(evaluateCondition(condition, formData)).toBe(true);
      });
    });

    describe("contains operator", () => {
      it("should return true when array contains value", () => {
        const condition: ConditionalLogic = {
          field: "subjects",
          operator: "contains",
          value: "math",
          action: "show"
        };
        
        expect(evaluateCondition(condition, formData)).toBe(true);
      });

      it("should return false when array does not contain value", () => {
        const condition: ConditionalLogic = {
          field: "subjects",
          operator: "contains",
          value: "history",
          action: "show"
        };
        
        expect(evaluateCondition(condition, formData)).toBe(false);
      });

      it("should return true when string contains substring", () => {
        const condition: ConditionalLogic = {
          field: "name",
          operator: "contains",
          value: "oh",
          action: "show"
        };
        
        expect(evaluateCondition(condition, formData)).toBe(true);
      });

      it("should return false when string does not contain substring", () => {
        const condition: ConditionalLogic = {
          field: "name",
          operator: "contains",
          value: "xyz",
          action: "show"
        };
        
        expect(evaluateCondition(condition, formData)).toBe(false);
      });

      it("should return false for non-array, non-string values", () => {
        const condition: ConditionalLogic = {
          field: "age",
          operator: "contains",
          value: "25",
          action: "show"
        };
        
        expect(evaluateCondition(condition, formData)).toBe(false);
      });
    });

    describe("greaterThan operator", () => {
      it("should return true when field value is greater", () => {
        const condition: ConditionalLogic = {
          field: "age",
          operator: "greaterThan",
          value: 20,
          action: "show"
        };
        
        expect(evaluateCondition(condition, formData)).toBe(true);
      });

      it("should return false when field value is not greater", () => {
        const condition: ConditionalLogic = {
          field: "age",
          operator: "greaterThan",
          value: 30,
          action: "show"
        };
        
        expect(evaluateCondition(condition, formData)).toBe(false);
      });

      it("should handle string numbers", () => {
        const condition: ConditionalLogic = {
          field: "age",
          operator: "greaterThan",
          value: "20",
          action: "show"
        };
        
        expect(evaluateCondition(condition, formData)).toBe(true);
      });
    });

    describe("lessThan operator", () => {
      it("should return true when field value is less", () => {
        const condition: ConditionalLogic = {
          field: "age",
          operator: "lessThan",
          value: 30,
          action: "show"
        };
        
        expect(evaluateCondition(condition, formData)).toBe(true);
      });

      it("should return false when field value is not less", () => {
        const condition: ConditionalLogic = {
          field: "age",
          operator: "lessThan",
          value: 20,
          action: "show"
        };
        
        expect(evaluateCondition(condition, formData)).toBe(false);
      });
    });

    describe("unknown operator", () => {
      it("should return true for unknown operator", () => {
        const condition = {
          field: "name",
          operator: "unknownOperator" as any,
          value: "John",
          action: "show" as const
        };
        
        expect(evaluateCondition(condition, formData)).toBe(true);
      });
    });
  });

  describe("shouldShowField", () => {
    const formData = { status: "active", role: "admin", age: 25 };

    it("should return true when field has no conditional logic", () => {
      const field: FieldSchema = {
        id: "username",
        type: "text",
        label: "Username"
      };
      
      expect(shouldShowField(field, formData)).toBe(true);
    });

    it("should return true when field has empty conditional array", () => {
      const field: FieldSchema = {
        id: "username",
        type: "text",
        label: "Username",
        conditional: []
      };
      
      expect(shouldShowField(field, formData)).toBe(true);
    });

    it("should show field when show condition is met", () => {
      const field: FieldSchema = {
        id: "adminPanel",
        type: "text",
        label: "Admin Panel",
        conditional: [{
          field: "role",
          operator: "equals",
          value: "admin",
          action: "show"
        }]
      };
      
      expect(shouldShowField(field, formData)).toBe(true);
    });

    it("should hide field when show condition is not met", () => {
      const field: FieldSchema = {
        id: "adminPanel",
        type: "text",
        label: "Admin Panel",
        conditional: [{
          field: "role",
          operator: "equals",
          value: "user",
          action: "show"
        }]
      };
      
      expect(shouldShowField(field, formData)).toBe(false);
    });

    it("should hide field when hide condition is met", () => {
      const field: FieldSchema = {
        id: "regularFeature",
        type: "text",
        label: "Regular Feature",
        conditional: [{
          field: "role",
          operator: "equals",
          value: "admin",
          action: "hide"
        }]
      };
      
      expect(shouldShowField(field, formData)).toBe(false);
    });

    it("should show field when hide condition is not met", () => {
      const field: FieldSchema = {
        id: "regularFeature",
        type: "text",
        label: "Regular Feature",
        conditional: [{
          field: "role",
          operator: "equals",
          value: "user",
          action: "hide"
        }]
      };
      
      expect(shouldShowField(field, formData)).toBe(true);
    });

    it("should handle multiple show conditions (any can be true)", () => {
      const field: FieldSchema = {
        id: "specialFeature",
        type: "text",
        label: "Special Feature",
        conditional: [
          {
            field: "role",
            operator: "equals",
            value: "admin",
            action: "show"
          },
          {
            field: "status",
            operator: "equals",
            value: "premium",
            action: "show"
          }
        ]
      };
      
      expect(shouldShowField(field, formData)).toBe(true);
    });

    it("should hide when hide condition takes precedence", () => {
      const field: FieldSchema = {
        id: "feature",
        type: "text",
        label: "Feature",
        conditional: [
          {
            field: "role",
            operator: "equals",
            value: "admin",
            action: "show"
          },
          {
            field: "status",
            operator: "equals",
            value: "active",
            action: "hide"
          }
        ]
      };
      
      expect(shouldShowField(field, formData)).toBe(false);
    });
  });

  describe("isFieldRequired", () => {
    const formData = { hasDetails: true, isVip: false };

    it("should return base required value when no conditional logic", () => {
      const field: FieldSchema = {
        id: "username",
        type: "text",
        label: "Username",
        validation: { required: true }
      };
      
      expect(isFieldRequired(field, formData)).toBe(true);
    });

    it("should return false when no validation and no conditional", () => {
      const field: FieldSchema = {
        id: "username",
        type: "text",
        label: "Username"
      };
      
      expect(isFieldRequired(field, formData)).toBe(false);
    });

    it("should make field required when require condition is met", () => {
      const field: FieldSchema = {
        id: "details",
        type: "text",
        label: "Details",
        conditional: [{
          field: "hasDetails",
          operator: "equals",
          value: true,
          action: "require"
        }]
      };
      
      expect(isFieldRequired(field, formData)).toBe(true);
    });

    it("should not require field when require condition is not met", () => {
      const field: FieldSchema = {
        id: "details",
        type: "text",
        label: "Details",
        conditional: [{
          field: "isVip",
          operator: "equals",
          value: true,
          action: "require"
        }]
      };
      
      expect(isFieldRequired(field, formData)).toBe(false);
    });

    it("should combine base required with conditional required", () => {
      const field: FieldSchema = {
        id: "details",
        type: "text",
        label: "Details",
        validation: { required: true },
        conditional: [{
          field: "isVip",
          operator: "equals",
          value: false,
          action: "require"
        }]
      };
      
      expect(isFieldRequired(field, formData)).toBe(true);
    });
  });

  describe("isFieldDisabled", () => {
    const formData = { isEditing: true, userRole: "admin", locked: false };

    it("should return base disabled value when no conditional logic", () => {
      const field: FieldSchema = {
        id: "username",
        type: "text",
        label: "Username",
        disabled: true
      };
      
      expect(isFieldDisabled(field, formData)).toBe(true);
    });

    it("should return false when not disabled and no conditional", () => {
      const field: FieldSchema = {
        id: "username",
        type: "text",
        label: "Username"
      };
      
      expect(isFieldDisabled(field, formData)).toBe(false);
    });

    it("should disable field when disable condition is met", () => {
      const field: FieldSchema = {
        id: "username",
        type: "text",
        label: "Username",
        conditional: [{
          field: "locked",
          operator: "equals",
          value: true,
          action: "disable"
        }]
      };
      
      const lockedFormData = { ...formData, locked: true };
      expect(isFieldDisabled(field, lockedFormData)).toBe(true);
    });

    it("should not disable field when disable condition is not met", () => {
      const field: FieldSchema = {
        id: "username",
        type: "text",
        label: "Username",
        conditional: [{
          field: "locked",
          operator: "equals",
          value: true,
          action: "disable"
        }]
      };
      
      expect(isFieldDisabled(field, formData)).toBe(false);
    });

    it("should handle enable conditions", () => {
      const field: FieldSchema = {
        id: "editField",
        type: "text",
        label: "Edit Field",
        conditional: [{
          field: "isEditing",
          operator: "equals",
          value: true,
          action: "enable"
        }]
      };
      
      expect(isFieldDisabled(field, formData)).toBe(false);
    });

    it("should disable when enable condition is not met", () => {
      const field: FieldSchema = {
        id: "editField",
        type: "text",
        label: "Edit Field",
        conditional: [{
          field: "isEditing",
          operator: "equals",
          value: false,
          action: "enable"
        }]
      };
      
      expect(isFieldDisabled(field, formData)).toBe(true);
    });

    it("should prioritize disable over enable", () => {
      const field: FieldSchema = {
        id: "field",
        type: "text",
        label: "Field",
        conditional: [
          {
            field: "isEditing",
            operator: "equals",
            value: true,
            action: "enable"
          },
          {
            field: "locked",
            operator: "equals",
            value: true,
            action: "disable"
          }
        ]
      };
      
      const conflictFormData = { ...formData, locked: true };
      expect(isFieldDisabled(field, conflictFormData)).toBe(true);
    });
  });
});
