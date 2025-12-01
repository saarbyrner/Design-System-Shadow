import i18n from '@kitman/common/src/utils/i18n';
import {
  getIsIntegerValid,
  isDateValid,
  isEmailValid,
  parseBoolean,
} from '@kitman/modules/src/shared/MassUpload/utils';

import {
  generateInvalidListErrorMessage,
  createListValidator,
  createIntegerValidator,
  createDateValidator,
  createBooleanValidator,
  createEmailValidator,
} from '../common/utils';

jest.mock('@kitman/common/src/utils/i18n', () => ({
  t: jest.fn((key, params) => {
    if (params) {
      return `${key} ${JSON.stringify(params)}`;
    }
    return key;
  }),
}));

jest.mock('@kitman/modules/src/shared/MassUpload/utils', () => ({
  getIsIntegerValid: jest.fn(),
  isDateValid: jest.fn(),
  isEmailValid: jest.fn(),
  isInList: jest.fn(),
  parseBoolean: jest.fn(),
}));

describe('Validation Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateInvalidListErrorMessage', () => {
    it('should return a generic message when the accepted values list is empty', () => {
      const expectedMessage =
        'Incorrect value. No accepted values are available.';
      i18n.t.mockReturnValue(expectedMessage);
      const message = generateInvalidListErrorMessage([]);
      expect(i18n.t).toHaveBeenCalledWith(
        'Incorrect value. No accepted values are available.'
      );
      expect(message).toBe(expectedMessage);
    });

    it('should return a message with a list of accepted values', () => {
      const acceptedValues = ['Admin', 'Coach', 'Player'];
      const expectedMessage =
        'Invalid input. Accepted values: Admin, Coach, Player';
      i18n.t.mockReturnValue(expectedMessage);
      const message = generateInvalidListErrorMessage(acceptedValues);
      expect(i18n.t).toHaveBeenCalledWith(
        'Invalid input. Accepted values: {{values}}',
        {
          interpolation: {
            escapeValue: false,
          },
          values: 'Admin, Coach, Player',
        }
      );
      expect(message).toBe(expectedMessage);
    });
  });

  describe('createListValidator', () => {
    const options = ['Option A', 'Option B'];

    it('should return null for an optional field with no value', () => {
      const validator = createListValidator(options, { isRequired: false });
      expect(validator('')).toBeNull();
    });

    it('should return a "required" error for a required field with no value', () => {
      i18n.t.mockReturnValue('Field is required.');
      const validator = createListValidator(options, { isRequired: true });
      expect(validator('')).toBe('Field is required.');
      expect(i18n.t).toHaveBeenCalledWith('Field is required.');
    });

    it('should return an error for an invalid single value', () => {
      i18n.t.mockReturnValue(
        'Invalid input. Accepted values: Option A, Option B'
      );
      const validator = createListValidator(options);
      expect(validator('Option C')).toBe(
        'Invalid input. Accepted values: Option A, Option B'
      );
    });

    it('should return a custom error message for an invalid single value when provided', () => {
      const validator = createListValidator(options, {
        customMessage: 'Custom error!',
      });
      expect(validator('Option C')).toBe('Custom error!');
    });

    it('should return null for valid multiple values', () => {
      // Mock `isInList` to return true for valid options
      const validator = createListValidator(options, { isMultiple: true });
      expect(validator('Option A,Option B')).toBeNull();
    });

    it('should return an error if any of the multiple values is invalid', () => {
      i18n.t.mockReturnValue(
        'Invalid input. Accepted values: Option A, Option B'
      );
      const validator = createListValidator(options, { isMultiple: true });
      expect(validator('Option A,Option C')).toBe(
        'Invalid input. Accepted values: Option A, Option B'
      );
    });
  });

  describe('createDateValidator', () => {
    const acceptedDateFormats = ['YYYY-MM-DD'];
    const validator = createDateValidator({ acceptedDateFormats });

    it('should return null for a valid date format', () => {
      isDateValid.mockReturnValue(true);
      expect(validator('2025-09-30')).toBeNull();
      expect(isDateValid).toHaveBeenCalledWith({
        date: '2025-09-30',
        acceptedFormats: acceptedDateFormats,
      });
    });

    it('should return an error for an invalid date format', () => {
      isDateValid.mockReturnValue(false);
      i18n.t.mockReturnValue('Invalid date format.');
      expect(validator('30-09-2025')).toBe('Invalid date format.');
    });
  });

  describe('createIntegerValidator', () => {
    it('should return null for an optional field with no value', () => {
      const validator = createIntegerValidator({ isRequired: false });
      expect(validator('')).toBeNull();
    });

    it('should return null for a valid integer', () => {
      getIsIntegerValid.mockReturnValue(true);
      const validator = createIntegerValidator({ isRequired: true });
      expect(validator('123')).toBeNull();
    });

    it('should return an error for an invalid integer', () => {
      getIsIntegerValid.mockReturnValue(false);
      i18n.t.mockReturnValue('Invalid number.');
      const validator = createIntegerValidator({ isRequired: true });
      expect(validator('abc')).toBe('Invalid number.');
    });
  });

  describe('createEmailValidator', () => {
    it('should return null for an optional field with no value', () => {
      const validator = createEmailValidator({ isRequired: false });
      expect(validator('')).toBeNull();
    });

    it('should return null for a valid email', () => {
      isEmailValid.mockReturnValue(true);
      const validator = createEmailValidator({ isRequired: true });
      expect(validator('test@example.com')).toBeNull();
    });

    it('should return an error for an invalid email', () => {
      isEmailValid.mockReturnValue(false);
      i18n.t.mockReturnValue('Invalid email address.');
      const validator = createEmailValidator({ isRequired: true });
      expect(validator('invalid-email')).toBe('Invalid email address.');
    });
  });

  describe('createBooleanValidator', () => {
    it('should return null for an optional field with no value', () => {
      const validator = createBooleanValidator({ isRequired: false });
      expect(validator('')).toBeNull();
    });

    it('should return null for a valid boolean string like "true"', () => {
      parseBoolean.mockReturnValue(true);
      const validator = createBooleanValidator({ isRequired: true });
      expect(validator('true')).toBeNull();
    });

    it('should return null for a valid boolean string like "no"', () => {
      parseBoolean.mockReturnValue(false);
      const validator = createBooleanValidator({ isRequired: true });
      expect(validator('no')).toBeNull();
    });

    it('should return an error for an invalid value', () => {
      parseBoolean.mockReturnValue(undefined);
      i18n.t.mockReturnValue('Invalid value.');
      const validator = createBooleanValidator({ isRequired: true });
      expect(validator('maybe')).toBe('Invalid value.');
    });
  });
});
