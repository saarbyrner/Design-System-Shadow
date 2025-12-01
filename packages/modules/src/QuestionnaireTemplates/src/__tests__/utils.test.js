import { isAUniqueTemplateName } from '../utils';
import { buildTemplates } from './test_utils';

describe('isAUniqueTemplateName', () => {
  describe('when the template name is unique', () => {
    it('returns a validation object with {isValid} true', () => {
      const templates = buildTemplates(4);
      const value = 'a unique template value';

      const expected = {
        isValid: true,
        errorType: 'unique',
        message: 'Name already in use',
      };

      expect(isAUniqueTemplateName(value, templates)).toEqual(expected);
    });
  });

  describe('when the template name is not unique', () => {
    it('returns a validation object with {isValid} false', () => {
      const templates = buildTemplates(4);
      const firstKey = Object.keys(templates)[0];
      const value = templates[firstKey].name;

      const expected = {
        isValid: false,
        errorType: 'unique',
        message: 'Name already in use',
      };

      expect(isAUniqueTemplateName(value, templates)).toEqual(expected);
    });
  });

  describe('when the template name already exists in another font case', () => {
    it('returns a validation object with {isValid} false', () => {
      const templates = buildTemplates(4);
      const firstKey = Object.keys(templates)[0];
      const value = templates[firstKey].name.toUpperCase();

      const expected = {
        isValid: false,
        errorType: 'unique',
        message: 'Name already in use',
      };

      expect(isAUniqueTemplateName(value, templates)).toEqual(expected);
    });
  });

  describe('when the template name is the same as the {whiteListedName}', () => {
    it('returns a validation object with {isValid} true', () => {
      const templates = buildTemplates(4);
      const firstKey = Object.keys(templates)[0];
      const value = templates[firstKey].name;

      const expected = {
        isValid: true,
        errorType: 'unique',
        message: 'Name already in use',
      };

      // The third argument is the whiteListedName
      expect(isAUniqueTemplateName(value, templates, value)).toEqual(expected);
    });
  });
});
