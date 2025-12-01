import moment from 'moment-timezone';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
// eslint-disable-next-line jest/no-mocks-import
import {
  everyMonthNeverEndingRRule,
  customRRuleWithCount,
} from '@kitman/modules/src/PlanningEventSidePanel/src/components/common/RepeatEvent/RepeatEventCustomConfigModal/utils/__mocks__/config-helpers';
import { keyboardkeys } from '@kitman/common/src/variables';
import {
  getRepeatEveryOptions,
  getRepeatEveryTranslations,
  isInvalidNumberForNumericInput,
  isInvalidRepeatOnConfig,
  regenerateRRuleWithUpdatedDateTime,
  isValidForPositiveInteger,
  getRemainingDaysInRecurrence,
} from '../helpers';

describe('helpers', () => {
  const t = i18nextTranslateStub();
  describe('getRepeatEveryOptions', () => {
    const translations = getRepeatEveryTranslations(t);
    it('should return options in singular', () => {
      const options = getRepeatEveryOptions(translations, 1);
      expect(options[0].label).toBe(translations.day);
      expect(options[1].label).toBe(translations.week);
      expect(options[2].label).toBe(translations.month);
      expect(options[3].label).toBe(translations.year);
    });

    it('should return options in plural', () => {
      const options = getRepeatEveryOptions(translations, 2);
      expect(options[0].label).toBe(translations.days);
      expect(options[1].label).toBe(translations.weeks);
      expect(options[2].label).toBe(translations.months);
      expect(options[3].label).toBe(translations.years);
    });
    it('should return options in singular for 0', () => {
      const options = getRepeatEveryOptions(translations, 0);
      expect(options[0].label).toBe(translations.day);
      expect(options[1].label).toBe(translations.week);
      expect(options[2].label).toBe(translations.month);
      expect(options[3].label).toBe(translations.year);
    });
  });

  describe('isInvalidNumberForNumericInput', () => {
    it('should return true for 0', () => {
      expect(isInvalidNumberForNumericInput(0)).toBe(true);
    });
    it('should return true for null', () => {
      expect(isInvalidNumberForNumericInput('')).toBe(true);
    });
    it('should return false for num > 0', () => {
      expect(isInvalidNumberForNumericInput(3)).toBe(false);
    });
    it('should return false for num being a string and num > 0', () => {
      expect(isInvalidNumberForNumericInput('3')).toBe(false);
    });
  });

  describe('isInvalidRepeatOnConfig', () => {
    it('should return true for false for all days', () => {
      const repeatOnConfig = {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
      };
      expect(isInvalidRepeatOnConfig(repeatOnConfig)).toBe(true);
    });
    it('should return false for one day selected', () => {
      const repeatOnConfig = {
        monday: true,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
      };
      expect(isInvalidRepeatOnConfig(repeatOnConfig)).toBe(false);
    });
    it('should return false for two days selected', () => {
      const repeatOnConfig = {
        monday: true,
        tuesday: false,
        wednesday: true,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
      };
      expect(isInvalidRepeatOnConfig(repeatOnConfig)).toBe(false);
    });
    it('should return false for all days selected', () => {
      const repeatOnConfig = {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: true,
        sunday: true,
      };
      expect(isInvalidRepeatOnConfig(repeatOnConfig)).toBe(false);
    });
  });

  describe('regenerateRRuleWithUpdatedDateTime', () => {
    const previousRule = everyMonthNeverEndingRRule;
    it('should return RRule with updated date time', () => {
      const newRule = regenerateRRuleWithUpdatedDateTime(
        everyMonthNeverEndingRRule,
        '2024-05-07T14:45:00+01:00'
      );
      const parsedDateTime = moment('2024-05-07T14:45:00+01:00').utc().toDate();

      expect(newRule.options.dtstart).toEqual(parsedDateTime);
      expect(newRule.options.dtstart).not.toEqual(previousRule.options.dtstart);
    });
  });

  describe('isValidForPositiveInteger', () => {
    it.each([
      { key: keyboardkeys.backspace, expected: true },
      { key: keyboardkeys.delete, expected: true },
      { key: keyboardkeys.tab, expected: true },
      { key: keyboardkeys.esc, expected: true },
      { key: keyboardkeys.enter, expected: true },
      { key: keyboardkeys.upArrow, expected: true },
      { key: keyboardkeys.rightArrow, expected: true },
      { key: keyboardkeys.downArrow, expected: true },
      { key: keyboardkeys.leftArrow, expected: true },
      { key: '0', expected: true },
      { key: '1', expected: true },
      { key: '2', expected: true },
      { key: '3', expected: true },
      { key: '4', expected: true },
      { key: '5', expected: true },
      { key: '6', expected: true },
      { key: '7', expected: true },
      { key: '8', expected: true },
      { key: '9', expected: true },
      // No negative values.
      { key: '-', expected: false },
      // No floating-point values.
      { key: ',', expected: false },
      { key: keyboardkeys.period, expected: false },
      // No special symbols
      { key: keyboardkeys.forwardSlash, expected: false },
      { key: '|', expected: false },
      { key: keyboardkeys.backSlash, expected: false },
      { key: '?', expected: false },
      { key: '!', expected: false },
      { key: '@', expected: false },
      { key: '$', expected: false },
      { key: '%', expected: false },
      { key: '^', expected: false },
      { key: '&', expected: false },
      { key: '*', expected: false },
      { key: '(', expected: false },
      { key: ')', expected: false },
      { key: '=', expected: false },
      { key: '+', expected: false },
      { key: keyboardkeys.graveAccent, expected: false },
      { key: '~', expected: false },
      { key: '<', expected: false },
      { key: '>', expected: false },
      { key: ':', expected: false },
      { key: ';', expected: false },
      { key: keyboardkeys.openBracket, expected: false },
      { key: keyboardkeys.closeBracket, expected: false },
      { key: '{', expected: false },
      { key: '}', expected: false },
      { key: keyboardkeys.space, expected: false },
      { key: keyboardkeys.singleQuote, expected: false },
    ])('returns $expected when the passed key is $key', ({ key, expected }) => {
      expect(isValidForPositiveInteger(key)).toBe(expected);
    });
  });

  describe('getRemainingDaysInRecurrence', () => {
    const mockRRuleInstances = [
      new Date(2023, 11, 4),
      new Date(2023, 11, 5),
      new Date(2023, 11, 6),
    ];

    it('should return null if rrule_instances does not exist', () => {
      expect(
        getRemainingDaysInRecurrence({
          id: 1,
          start_time: new Date(2023, 11, 4),
          recurrence: { rule: customRRuleWithCount, rrule_instances: null },
        })
      ).toEqual(null);
    });

    it('should return remainder, if rrule_instances exists and there is a match', () => {
      expect(
        getRemainingDaysInRecurrence({
          id: 1,
          start_time: new Date(2023, 11, 4),
          recurrence: {
            rule: customRRuleWithCount,
            rrule_instances: mockRRuleInstances,
          },
        })
      ).toEqual(mockRRuleInstances.length);
    });
  });
});
