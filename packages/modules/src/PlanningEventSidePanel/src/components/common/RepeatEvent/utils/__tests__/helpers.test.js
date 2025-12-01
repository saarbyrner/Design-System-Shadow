/* eslint-disable jest/no-mocks-import */
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import {
  getOptions,
  transformCustomRRuleToItsNonCustomEquivalent,
} from '../options-helpers';
import * as mocks from '../__mocks__/helpers.mocks';
import { getDayStringAndRRuleDayEnum } from '../date-helpers';

describe('helpers', () => {
  const t = i18nextTranslateStub();
  describe('getOptions', () => {
    it('should return valid options for the first thursday of the month, November 2nd, 2023', () => {
      expect(getOptions(mocks.firstThursdayDate, t)).toEqual(
        mocks.firstThursdayOptions
      );
    });

    it('should return valid options for the second Tuesday of the month, November 7nd, 2023', () => {
      expect(getOptions(mocks.secondTuesdayDate, t)).toEqual(
        mocks.secondTuesdayOptions
      );
    });

    it('should return valid options (without the weekday option) for the third Sunday of the month, November 19th, 2023', () => {
      expect(getOptions(mocks.thirdSundayDate, t)).toEqual(
        mocks.thirdSundayOptions
      );
    });

    it('should return valid options for the fourth (last) Monday of the month (with 4 Mondays), November 27th, 2023', () => {
      expect(getOptions(mocks.fourthMondayWithFourMondaysDate, t)).toEqual(
        mocks.fourthMondayWithFourMondaysOptions
      );
    });

    it('should return valid options for the fourth Wendesday of the month (with 5 Wednesdays), November 22th, 2023', () => {
      expect(
        getOptions(mocks.fourthWednesdayWithFiveWednesdaysDate, t)
      ).toEqual(mocks.fourthWednesdayWithFiveWednesdaysOptions);
    });

    it('should return valid options (without the weekday option) for the first Saturday of the month, November 4th, 2023', () => {
      expect(getOptions(mocks.firstSaturdayDate, t)).toEqual(
        mocks.firstSaturdayOptions
      );
    });
  });

  describe('getDayStringAndRRuleDayEnum', () => {
    it.each(mocks.getDayStringAndRRuleDayEnumTestCases)(
      'should return the correct rrule day enum and string for each day',
      ({ eventDate, rruleDayEnum, dayString }) => {
        expect(getDayStringAndRRuleDayEnum(eventDate, t)).toEqual({
          dayString,
          rruleDayEnum,
        });
      }
    );
  });

  describe('transformCustomRRuleToItsNonCustomEquivalent', () => {
    const allOptions = getOptions(mocks.transformRRuleEventDate, t);

    it('should return the daily option', () => {
      const dailyOption = allOptions.find((option) => option.label === 'Daily');
      expect(
        transformCustomRRuleToItsNonCustomEquivalent(
          mocks.dailyCustomRule,
          t,
          mocks.transformRRuleEventDate
        )
      ).toEqual(dailyOption.value);
    });

    it('should return the weekly option', () => {
      const weeklyOption = allOptions.find((option) =>
        option.label.includes('Weekly')
      );
      expect(
        transformCustomRRuleToItsNonCustomEquivalent(
          mocks.weeklyCustomRule,
          t,
          mocks.transformRRuleEventDate
        )
      ).toEqual(weeklyOption.value);
    });

    it('should return the monthly option', () => {
      const monthlyOption = allOptions.find((option) =>
        option.label.includes('Monthly')
      );
      expect(
        transformCustomRRuleToItsNonCustomEquivalent(
          mocks.monthlyCustomRule,
          t,
          mocks.transformRRuleEventDate
        )
      ).toEqual(monthlyOption.value);
    });

    it('should return the yearly option', () => {
      const yearlyOption = allOptions.find((option) =>
        option.label.includes('Annually')
      );
      expect(
        transformCustomRRuleToItsNonCustomEquivalent(
          mocks.yearlyCustomRule,
          t,
          mocks.transformRRuleEventDate
        )
      ).toEqual(yearlyOption.value);
    });

    it('should return the weekday option', () => {
      const weekdaysOption = allOptions.find(
        (option) => option.label === 'Every weekday'
      );
      expect(
        transformCustomRRuleToItsNonCustomEquivalent(
          mocks.weekdaysCustomRule,
          t,
          mocks.transformRRuleEventDate
        )
      ).toEqual(weekdaysOption.value);
    });
  });
});
