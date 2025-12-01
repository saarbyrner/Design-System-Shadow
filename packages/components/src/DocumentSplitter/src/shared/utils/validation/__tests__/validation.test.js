import {
  getValidationMessageInPriority,
  validateDocumentDetails,
  validateSplitOptions,
  validateRows,
} from '@kitman/components/src/DocumentSplitter/src/shared/utils/validation';
import {
  GRID_ROW_FIELD_KEYS,
  SPLIT_DOCUMENT_MODES,
} from '@kitman/components/src/DocumentSplitter/src/shared/consts';

// Mock i18n for translation
jest.mock('@kitman/common/src/utils/i18n', () => ({
  t: jest.fn((key) => key), // Simple mock that returns the key
}));

describe('validation', () => {
  const totalPages = 10;
  const noProblems = {
    errors: {},
    hasErrors: false,
  };
  const required = ['Required'];

  describe('getValidationMessageInPriority', () => {
    it('should return the correct message for pages validation error', () => {
      const validationResults = {
        [GRID_ROW_FIELD_KEYS.pages]: { 1: false },
      };
      expect(getValidationMessageInPriority(validationResults)).toBe(
        'Error: A valid page range is required'
      );
    });

    it('should return the correct message for player validation error', () => {
      const validationResults = {
        [GRID_ROW_FIELD_KEYS.player]: { 1: false },
      };
      expect(getValidationMessageInPriority(validationResults)).toBe(
        'Error: A player must be selected'
      );
    });

    it('should return the correct message for categories validation error', () => {
      const validationResults = {
        [GRID_ROW_FIELD_KEYS.categories]: { 1: false },
      };
      expect(getValidationMessageInPriority(validationResults)).toBe(
        'Error: A category selection is required'
      );
    });

    it('should return the correct message for fileName validation error', () => {
      const validationResults = {
        [GRID_ROW_FIELD_KEYS.fileName]: { 1: false },
      };
      expect(getValidationMessageInPriority(validationResults)).toBe(
        'Error: A file name is required'
      );
    });

    it('should return the correct message for dateOfDocument validation error', () => {
      const validationResults = {
        [GRID_ROW_FIELD_KEYS.dateOfDocument]: { 1: false },
      };
      expect(getValidationMessageInPriority(validationResults)).toBe(
        'Error: A document date is required'
      );
    });

    it('should return the correct message for hasConstraintsError validation error', () => {
      const validationResults = {
        [GRID_ROW_FIELD_KEYS.hasConstraintsError]: { 1: false },
      };
      expect(getValidationMessageInPriority(validationResults)).toBe(
        'Error: Date does not match player movement records '
      );
    });

    it('should return the default error message if no specific validation error is present', () => {
      const validationResults = {};
      expect(getValidationMessageInPriority(validationResults)).toBe(
        'Error! Complete required fields'
      );
    });

    it('should return the message based on priority if multiple errors exist', () => {
      const validationResults = {
        [GRID_ROW_FIELD_KEYS.player]: { 1: false },
        [GRID_ROW_FIELD_KEYS.pages]: { 1: false },
      };
      expect(getValidationMessageInPriority(validationResults)).toBe(
        'Error: A valid page range is required'
      );
    });
  });

  describe('validateDocumentDetails', () => {
    const noValuesData = {};

    it('returns no problems when allowValidation is false', () => {
      const result = validateDocumentDetails(noValuesData, false);
      expect(result).toEqual(noProblems);
    });

    it('can validate DocumentDetailsData with missing fields', () => {
      const result = validateDocumentDetails(noValuesData, true);

      expect(result).toEqual({
        errors: {
          fileName: required,
          documentDate: ['Date is required'],
          documentCategories: required,
          players: required,
        },
        hasErrors: true,
      });
    });

    it('can validate DocumentDetailsData with empty fileName', () => {
      const result = validateDocumentDetails({ fileName: '  ' }, true);

      expect(result).toEqual({
        errors: {
          fileName: required,
          documentDate: ['Date is required'],
          documentCategories: required,
          players: required,
        },
        hasErrors: true,
      });
    });

    it('can validate DocumentDetailsData with invalid fields', () => {
      const someValuesData = {
        fileName: 'ValidFileName.png', // Valid
        documentDate: '2024-04-03T00:00:00+00:00', // Valid
        documentCategories: [], // Invalid as empty
        players: [], // Invalid as empty
      };
      const result = validateDocumentDetails(someValuesData, true);

      expect(result).toEqual({
        errors: {
          documentCategories: required,
          players: required,
        },
        hasErrors: true,
      });
    });

    it('validates date is valid', () => {
      const someValuesData = {
        fileName: 'ValidFileName.png', // Valid
        documentDate: '1969-04-03T00:00:00+00:00', // invalid
        documentCategories: [{ id: 1, label: 'Valid category' }], // Valid
        players: [{ id: 1, label: 'Valid player' }], // Valid
      };
      const result = validateDocumentDetails(someValuesData, true);

      expect(result).toEqual({
        errors: {
          documentDate: ['Valid date is required'],
        },
        hasErrors: true,
      });
    });

    it('can validate DocumentDetailsData without errors', () => {
      const someValuesData = {
        fileName: 'ValidFileName.png', // Valid
        documentDate: '2024-04-03T00:00:00+00:00', // Valid
        documentCategories: [{ id: 1, label: 'Valid category' }], // Valid
        players: [{ id: 1, label: 'Valid player' }], // Valid
      };
      const result = validateDocumentDetails(someValuesData, true);

      expect(result).toEqual(noProblems);
    });
  });

  describe('validateSplitOptions', () => {
    it('returns no problems when allowValidation is false', () => {
      const result = validateSplitOptions(
        { splitDocument: SPLIT_DOCUMENT_MODES.intoSections },
        totalPages,
        false
      );
      expect(result).toEqual(noProblems);
    });

    it('can validate SplitOptionsData missing numberOfSections and splitFrom', () => {
      const result = validateSplitOptions(
        { splitDocument: SPLIT_DOCUMENT_MODES.intoSections },
        totalPages,
        true
      );
      const expectedResult = {
        errors: {
          numberOfSections: required,
          splitFrom: required,
        },
        hasErrors: true,
      };

      expect(result).toEqual(expectedResult);

      const result2 = validateSplitOptions(
        {
          splitDocument: SPLIT_DOCUMENT_MODES.intoSections,
          numberOfSections: '',
        }, // Invalid as numberOfSections is empty
        totalPages,
        true
      );

      expect(result2).toEqual(expectedResult);

      const result3 = validateSplitOptions(
        {
          splitDocument: SPLIT_DOCUMENT_MODES.intoSections,
          numberOfSections: 'a',
        }, // Invalid as numberOfSections NAN
        totalPages,
        true
      );

      expect(result3).toEqual(expectedResult);
    });

    it('can validate SplitOptionsData when mode is SPLIT_DOCUMENT_MODES.everyX', () => {
      const result = validateSplitOptions(
        {
          splitDocument: SPLIT_DOCUMENT_MODES.everyX,
          numberOfSections: '3',
          splitEvery: null, // Invalid
          splitFrom: 'a', // Invalid
        },
        totalPages,
        true
      );

      expect(result).toEqual({
        errors: {
          splitEvery: required,
          splitFrom: required,
        },
        hasErrors: true,
      });
    });

    it('can validate SplitOptionsData without errors', () => {
      const result = validateSplitOptions(
        {
          splitDocument: true,
          numberOfSections: '3',
          splitEvery: '3',
          splitFrom: '1',
        },
        totalPages,
        true
      );

      expect(result).toEqual(noProblems);
    });
  });

  describe('validateRows', () => {
    const testRow1 = {
      id: 1,
      pages: '1-2',
      player: { id: 1, label: 'some player 1' },
      categories: [{ id: 1, label: 'some category 1' }],
      fileName: 'test row 1',
      dateOfDocument: '2024-04-03T00:00:00+00:00',
      hasConstraintsError: false,
    };

    const testRow2 = {
      id: 2,
      pages: '3-5',
      player: { id: 2, label: 'some player 2' },
      categories: [{ id: 2, label: 'some category 2' }],
      fileName: 'test row 2',
      dateOfDocument: '2024-04-03T00:00:00+00:00',
      hasConstraintsError: false,
    };

    it('returns no problems when data is good', () => {
      const result = validateRows([testRow1, testRow2], totalPages);
      expect(result).toEqual({});
    });

    it('validates the page range meets regex', () => {
      const invalidPagesRow = { ...testRow2, pages: '1-a' };
      const result = validateRows([testRow1, invalidPagesRow], totalPages);
      expect(result).toEqual({
        pages: {
          2: false, // Invalid pages for row with id 2
        },
      });
    });

    it('validates the page range values when less than total pages', () => {
      const invalidPagesRow = { ...testRow2, pages: '1-3,4-10,10' };
      const result = validateRows([testRow1, invalidPagesRow], totalPages);
      expect(result).toEqual({});
    });

    it('validates complex page range values must not exceed total pages', () => {
      const invalidPagesRow = { ...testRow2, pages: '1-3,4-12,10' };
      const result = validateRows([testRow1, invalidPagesRow], totalPages);
      expect(result).toEqual({
        pages: {
          2: false, // Invalid pages for row with id 2. 12 > 10
        },
      });
    });

    it('validates single page range values must not exceed total pages', () => {
      const invalidPagesRow = { ...testRow2, pages: '11' };
      const result = validateRows([testRow1, invalidPagesRow], totalPages);
      expect(result).toEqual({
        pages: {
          2: false, // Invalid pages for row with id 2, 11 > 10
        },
      });
    });

    it('validates player is required', () => {
      const invalidPagesRow = { ...testRow2, player: null };
      const result = validateRows([testRow1, invalidPagesRow], totalPages);
      expect(result).toEqual({
        player: {
          2: false, // Invalid player for row with id 2
        },
      });
    });

    it('validates categories has an entry', () => {
      const invalidCategoriesRow = { ...testRow2, categories: [] };
      const result = validateRows([testRow1, invalidCategoriesRow], totalPages);
      expect(result).toEqual({
        categories: {
          2: false, // Invalid categories (as empty array) for row with id 2
        },
      });
    });

    it('validates filename and date are entered', () => {
      const invalidFieldsRow = {
        ...testRow2,
        dateOfDocument: null,
        fileName: '  ',
      };

      const result = validateRows([testRow1, invalidFieldsRow], totalPages);
      expect(result).toEqual({
        dateOfDocument: {
          2: false,
        },
        fileName: {
          2: false,
        },
      });
    });

    it('validates date is valid', () => {
      const invalidFieldsRow = {
        ...testRow2,
        dateOfDocument: '1969-04-03T00:00:00+00:00',
      };

      const result = validateRows([testRow1, invalidFieldsRow], totalPages);
      expect(result).toEqual({
        dateOfDocument: {
          2: false,
        },
      });
    });

    it('validates there are no constraints errors', () => {
      const invalidFieldsRow = {
        ...testRow2,
        hasConstraintsError: true,
      };

      const result = validateRows([testRow1, invalidFieldsRow], totalPages);
      expect(result).toEqual({
        dateOfDocument: {
          2: false,
        },
      });
    });
  });
});
