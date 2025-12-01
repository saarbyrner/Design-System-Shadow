import {
  ExpectedHeaders,
  OptionalExpectedHeaders,
} from '@kitman/modules/src/TrainingVariablesImporter/consts';

import { getGuidelines, getValidators } from '../utils';

describe('utils', () => {
  describe('getGuidelines()', () => {
    it('returns a correct array', () => {
      expect(getGuidelines()).toEqual([
        {
          label: ExpectedHeaders.Id,
          acceptedValues: [
            'Please ensure you use the CSV file template to have the correct id',
          ],
        },
        {
          label: ExpectedHeaders.FirstName,
          acceptedValues: [
            'Please ensure you use the CSV file template to have the correct first name',
          ],
        },
        {
          label: ExpectedHeaders.LastName,
          acceptedValues: [
            'Please ensure you use the CSV file template to have the correct last name',
          ],
        },
        {
          label: ExpectedHeaders.TimeMeasured,
          acceptedValues: [
            '2023-10-12T04:25:03Z',
            '2023-10-12',
            '2023-10-12 04:25',
            '2023/10/12',
            '2023/10/12 04:25',
          ],
        },
        {
          label: OptionalExpectedHeaders.MicroCycle,
          acceptedValues: [
            'If filled, the entry must be a whole number: 0 or greater.',
          ],
          isRequired: false,
        },
      ]);
    });
  });

  describe('getValidators()', () => {
    it('returns a correct object', () => {
      const validators = getValidators();

      expect(validators[ExpectedHeaders.Id]('1')).toBe(null);
      expect(validators[ExpectedHeaders.Id]('a')).toBe(
        'Please enter a valid id'
      );

      const firstNameErrorMessage = 'Please enter a valid first name';
      expect(validators[ExpectedHeaders.FirstName]('1')).toBe(
        firstNameErrorMessage
      );
      expect(validators[ExpectedHeaders.FirstName]('a')).toBe(null);
      expect(validators[ExpectedHeaders.FirstName]('')).toBe(
        firstNameErrorMessage
      );

      const lastNameErrorMessage = 'Please enter a valid last name';
      expect(validators[ExpectedHeaders.LastName]('1')).toBe(
        lastNameErrorMessage
      );
      expect(validators[ExpectedHeaders.LastName]('a')).toBe(null);
      expect(validators[ExpectedHeaders.LastName]('')).toBe(
        lastNameErrorMessage
      );

      const timeMeasuredErrorMessage =
        'This format does not match one of the accepted formats: 2023-10-12T04:25:03Z, 2023-10-12, 2023-10-12 04:25, 2023/10/12, 2023/10/12 04:25';
      expect(
        validators[ExpectedHeaders.TimeMeasured]('2023-10-12T04:25:03Z')
      ).toBe(null);
      expect(validators[ExpectedHeaders.TimeMeasured]('2023-10-12')).toBe(null);
      expect(validators[ExpectedHeaders.TimeMeasured]('2023-10-12 12:12')).toBe(
        null
      );
      expect(validators[ExpectedHeaders.TimeMeasured]('2023/10/20')).toBe(null);
      expect(validators[ExpectedHeaders.TimeMeasured]('2023/10/12 12:12')).toBe(
        null
      );
      expect(
        validators[ExpectedHeaders.TimeMeasured]('2023-10-12T04:25:03')
      ).toBe(timeMeasuredErrorMessage);
      expect(validators[ExpectedHeaders.TimeMeasured]('')).toBe(
        timeMeasuredErrorMessage
      );
    });
  });
});
