import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { duplicateNameCustomValidation } from '../helpers';

describe('helpers', () => {
  describe('duplicateNameCustomValidation', () => {
    const t = i18nextTranslateStub();
    const firstName = 'Ash';
    const secondName = 'Gary';
    const uniqueNameSet = new Set(
      [firstName, secondName].map((name) => name.toLocaleLowerCase())
    );

    const validResult = { isValid: true };
    const invalidResult = {
      isValid: false,
      message: t('This name already exists'),
    };
    it('should return true for a new unique name', () => {
      const newName = 'Misty';
      const result = duplicateNameCustomValidation(
        t,
        uniqueNameSet,
        firstName,
        newName
      );
      expect(result).toEqual(validResult);
    });

    it('should return true for sending the same name', () => {
      const result = duplicateNameCustomValidation(
        t,
        uniqueNameSet,
        firstName,
        firstName
      );
      expect(result).toEqual(validResult);
    });

    it('should return true for sending the same name in lowercase', () => {
      const result = duplicateNameCustomValidation(
        t,
        uniqueNameSet,
        firstName,
        firstName.toLocaleLowerCase()
      );
      expect(result).toEqual(validResult);
    });

    it('should return false for sending an existing name', () => {
      const result = duplicateNameCustomValidation(
        t,
        uniqueNameSet,
        firstName,
        secondName
      );
      expect(result).toEqual(invalidResult);
    });

    it('should return false for sending an existing name in lowercase', () => {
      const result = duplicateNameCustomValidation(
        t,
        uniqueNameSet,
        firstName,
        secondName.toLocaleLowerCase()
      );
      expect(result).toEqual(invalidResult);
    });
  });
});
