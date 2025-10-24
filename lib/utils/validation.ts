/**
 * Validation utilities for form inputs
 * Can be enhanced with Zod or other validation libraries
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validators = {
  /**
   * Validate email format
   */
  email: (email: string): ValidationResult => {
    const errors: string[] = [];

    if (!email) {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Please enter a valid email address');
    }

    return { isValid: errors.length === 0, errors };
  },

  /**
   * Validate password strength
   */
  password: (password: string): ValidationResult => {
    const errors: string[] = [];

    if (!password) {
      errors.push('Password is required');
    } else {
      if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
      }
      if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
      }
      if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
      }
      if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number');
      }
    }

    return { isValid: errors.length === 0, errors };
  },

  /**
   * Validate required field
   */
  required: (value: string, fieldName: string): ValidationResult => {
    const errors: string[] = [];

    if (!value || value.trim() === '') {
      errors.push(`${fieldName} is required`);
    }

    return { isValid: errors.length === 0, errors };
  },

  /**
   * Validate phone number (basic format)
   */
  phone: (phone: string): ValidationResult => {
    const errors: string[] = [];

    if (!phone) {
      errors.push('Phone number is required');
    } else if (!/^[\d\s\-\+\(\)]+$/.test(phone)) {
      errors.push('Please enter a valid phone number');
    } else if (phone.replace(/\D/g, '').length < 10) {
      errors.push('Phone number must be at least 10 digits');
    }

    return { isValid: errors.length === 0, errors };
  },

  /**
   * Validate VAT number format (basic EU format)
   */
  vatNumber: (vat: string): ValidationResult => {
    const errors: string[] = [];

    if (!vat) {
      errors.push('VAT number is required');
    } else if (vat.length < 8) {
      errors.push('VAT number must be at least 8 characters');
    }

    return { isValid: errors.length === 0, errors };
  },
};

/**
 * Validate multiple fields at once
 */
export function validateForm(
  fields: Record<string, { value: string; validator: (value: string) => ValidationResult }>
): { isValid: boolean; errors: Record<string, string[]> } {
  const errors: Record<string, string[]> = {};
  let isValid = true;

  for (const [fieldName, { value, validator }] of Object.entries(fields)) {
    const result = validator(value);
    if (!result.isValid) {
      errors[fieldName] = result.errors;
      isValid = false;
    }
  }

  return { isValid, errors };
}
