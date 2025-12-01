import { buildTemplates } from '@kitman/common/src/utils/test_utils';
import { isAUniqueTemplateName } from '../utils';

describe('isAUniqueTemplateName', () => {
  describe('when the template name is unique', () => {
    it('return a validation object with {isValid} true', () => {
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
    it('return a validation object with {isValid} false', () => {
      const templates = buildTemplates(4);
      const value = templates[1].name;
      const expected = {
        isValid: false,
        errorType: 'unique',
        message: 'Name already in use',
      };
      expect(isAUniqueTemplateName(value, templates)).toEqual(expected);
    });
  });

  describe('when the template name already exist in another font case', () => {
    it('return a validation object with {isValid} false', () => {
      const templates = buildTemplates(4);
      const value = templates[1].name.toUpperCase();
      const expected = {
        isValid: false,
        errorType: 'unique',
        message: 'Name already in use',
      };
      expect(isAUniqueTemplateName(value, templates)).toEqual(expected);
    });
  });

  describe('when the template name is the same than the {whiteListedName}', () => {
    it('return a validation object with {isValid} true', () => {
      const templates = buildTemplates(4);
      const value = templates[1].name;
      const expected = {
        isValid: true,
        errorType: 'unique',
        message: 'Name already in use',
      };
      expect(isAUniqueTemplateName(value, templates, value)).toEqual(expected);
    });
  });
});
