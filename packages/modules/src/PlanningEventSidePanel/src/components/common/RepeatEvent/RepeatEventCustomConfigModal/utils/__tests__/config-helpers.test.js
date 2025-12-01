/* eslint-disable jest/no-mocks-import */
/** @typedef {import('../types').CustomConfig} CustomConfig */
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import * as mocks from '../__mocks__/config-helpers';
import {
  getDefaultCustomConfig,
  createRRuleFromModalConfig,
  createModalConfigFromRRule,
  interpolateRRuleIntoDisplayableText,
  isRRuleCustom,
  getDateEnding,
} from '../config-helpers';

describe('config-helpers', () => {
  const t = i18nextTranslateStub();
  describe('getDefaultCustomConfig', () => {
    it('should return the default config, in which the day of the event is selected', () => {
      /** @type {CustomConfig} */

      expect(getDefaultCustomConfig(mocks.eventDate)).toEqual(
        mocks.expectedDefaultConfig
      );
    });
  });

  describe('createRRuleFromModalConfig', () => {
    it('should create the right RRule for every 4 days, 21 times', () => {
      expect(
        createRRuleFromModalConfig(
          mocks.every4DaysAfter21OccurrencesConfig,
          mocks.eventDate
        )
      ).toEqual(mocks.every4DaysAfter21OccurrencesRRule);
    });

    it('should create the right RRule for every 3 months, until June 1st, 2026', () => {
      expect(
        createRRuleFromModalConfig(
          mocks.every3MonthsUntil1June2026Config,
          mocks.eventDate
        )
      ).toEqual(mocks.every3MonthsUntil1June2026RRule);
    });

    it('should create the right RRule for every 2 years, never ending', () => {
      expect(
        createRRuleFromModalConfig(
          mocks.every2YearsNeverEndingConfig,
          mocks.eventDate
        )
      ).toEqual(mocks.every2YearsNeverEndingRRule);
    });

    it('should create the right RRule for every week, Monday, Tuesday and Thursday, never ending', () => {
      expect(
        createRRuleFromModalConfig(
          mocks.everyWeekOnMondayTuesdayThursdayNeverEndingConfig,
          mocks.eventDate
        )
      ).toEqual(mocks.everyWeekOnMondayTuesdayThursdayNeverEndingRRule);
    });
  });

  describe('createModalConfigFromRRule', () => {
    it('should create the right config for every 4 days, 21 times', () => {
      expect(
        createModalConfigFromRRule(mocks.every4DaysAfter21OccurrencesRRule)
      ).toEqual(mocks.every4DaysAfter21OccurrencesConfig);
    });

    it('should create the right config for every 3 months, until June 1st, 2026', () => {
      expect(
        createModalConfigFromRRule(mocks.every3MonthsUntil1June2026RRule)
      ).toEqual(mocks.every3MonthsUntil1June2026Config);
    });

    it('should create the right config for every 2 years, never ending', () => {
      expect(
        createModalConfigFromRRule(mocks.every2YearsNeverEndingRRule)
      ).toEqual(mocks.every2YearsNeverEndingConfig);
    });

    it('should create the right config for every week, Monday, Tuesday and Thursday, never ending', () => {
      expect(
        createModalConfigFromRRule(
          mocks.everyWeekOnMondayTuesdayThursdayNeverEndingRRule
        )
      ).toEqual(mocks.everyWeekOnMondayTuesdayThursdayNeverEndingConfig);
    });
  });

  describe('interpolateRRuleIntoDisplayableText', () => {
    it('should interpolate the right text for every 4 days, 21 times', () => {
      expect(
        interpolateRRuleIntoDisplayableText(
          mocks.every4DaysAfter21OccurrencesRRule,
          t,
          mocks.eventDate
        )
      ).toEqual(mocks.every4DaysAfter21OccurrencesInterpolatedText);
    });

    it('should interpolate the right text for every 3 months, until June 1st, 2026', () => {
      expect(
        interpolateRRuleIntoDisplayableText(
          mocks.every3MonthsUntil1June2026RRule,
          t,
          mocks.eventDate
        )
      ).toEqual(mocks.every3MonthsUntil1June2026InterpolatedText);
    });

    it('should interpolate the right text for every 2 years, never ending', () => {
      expect(
        interpolateRRuleIntoDisplayableText(
          mocks.every2YearsNeverEndingRRule,
          t,
          mocks.eventDate
        )
      ).toEqual(mocks.every2YearsNeverEndingInterpolatedText);
    });

    it('should interpolate the right text for every week, Monday, Tuesday and Thursday, never ending', () => {
      expect(
        interpolateRRuleIntoDisplayableText(
          mocks.everyWeekOnMondayTuesdayThursdayNeverEndingRRule,
          t,
          mocks.eventDate
        )
      ).toEqual(
        mocks.everyWeekOnMondayTuesdayThursdayNeverEndingInterpolatedText
      );
    });

    it('should interpolate the right text for every 2 weeks, Monday, Tuesday and Thursday, never ending', () => {
      expect(
        interpolateRRuleIntoDisplayableText(
          mocks.every2WeeksOnMondayTuesdayThursdayNeverEndingRRule,
          t,
          mocks.eventDate
        )
      ).toEqual(
        mocks.every2WeeksOnMondayTuesdayThursdayNeverEndingInterpolatedText
      );
    });

    it('should interpolate the right text for every day, until June 1st, 2026', () => {
      expect(
        interpolateRRuleIntoDisplayableText(
          mocks.everyDayUntil1June2026RRule,
          t,
          mocks.eventDate
        )
      ).toEqual(mocks.everyDayUntil1June2026InterpolatedText);
    });

    it('should interpolate the right text for every year, 15 times', () => {
      expect(
        interpolateRRuleIntoDisplayableText(
          mocks.everyYearAfter15OccurrencesRRule,
          t,
          mocks.eventDate
        )
      ).toEqual(mocks.everyYearAfter15OccurrencesInterpolatedText);
    });

    it('should interpolate the right text for every month, never ending', () => {
      expect(
        interpolateRRuleIntoDisplayableText(
          mocks.everyMonthNeverEndingRRule,
          t,
          mocks.eventDate
        )
      ).toEqual(mocks.everyMonthNeverEndingInterpolatedText);
    });

    it('should interpolate the right text for weekly, without interval', () => {
      expect(
        interpolateRRuleIntoDisplayableText(
          mocks.everyWeekWithoutIntervalWithUntil,
          t,
          mocks.eventDate
        )
      ).toEqual(mocks.everyWeekWithoutIntervalInterpolatedText);
    });

    it('should interpolate the right text for yearly, without interval', () => {
      expect(
        interpolateRRuleIntoDisplayableText(
          mocks.everyYearWithoutIntervalWithUntil,
          t,
          mocks.eventDate
        )
      ).toEqual(mocks.everyYearWithoutIntervalInterpolatedText);
    });

    it('should interpolate the right text for daily, without interval', () => {
      expect(
        interpolateRRuleIntoDisplayableText(
          mocks.everyDayWithoutIntervalWithUntil,
          t,
          mocks.eventDate
        )
      ).toEqual(mocks.everyDayWithoutIntervalInterpolatedText);
    });

    it('should interpolate the right text for monthly, without interval', () => {
      expect(
        interpolateRRuleIntoDisplayableText(
          mocks.everyMonthWithoutIntervalWithUntil,
          t,
          mocks.eventDate
        )
      ).toEqual(mocks.everyMonthWithoutIntervalInterpolatedText);
    });

    describe('nth day text', () => {
      it('should interpolate the right text for first day of month', () => {
        expect(
          interpolateRRuleIntoDisplayableText(
            mocks.firstDayOfMonthMonthNeverEndingRRule,
            t,
            mocks.eventDate
          )
        ).toEqual(mocks.firstDayOfMonthMonthNeverEndingInterpolatedText);
      });

      it('should interpolate the right text for second day of month', () => {
        expect(
          interpolateRRuleIntoDisplayableText(
            mocks.secondDayOfMonthMonthNeverEndingRRule,
            t,
            mocks.eventDate
          )
        ).toEqual(mocks.secondDayOfMonthMonthNeverEndingInterpolatedText);
      });

      it('should interpolate the right text for third day of month', () => {
        expect(
          interpolateRRuleIntoDisplayableText(
            mocks.thirdDayOfMonthMonthNeverEndingRRule,
            t,
            mocks.eventDate
          )
        ).toEqual(mocks.thirdDayOfMonthMonthNeverEndingInterpolatedText);
      });

      it('should interpolate the right text for fourth day of month', () => {
        expect(
          interpolateRRuleIntoDisplayableText(
            mocks.fourthDayOfMonthMonthNeverEndingRRule,
            t,
            mocks.eventDate
          )
        ).toEqual(mocks.fourthDayOfMonthMonthNeverEndingInterpolatedText);
      });

      it('should interpolate the right text for last day of month', () => {
        expect(
          interpolateRRuleIntoDisplayableText(
            mocks.lastDayOfMonthMonthNeverEndingRRule,
            t,
            mocks.eventDate
          )
        ).toEqual(mocks.lastDayOfMonthMonthNeverEndingInterpolatedText);
      });
    });
  });

  describe('isRRuleCustom', () => {
    it('should return true for config with until', () => {
      expect(
        isRRuleCustom(mocks.customRRuleWithUntil, t, mocks.eventDate)
      ).toBe(true);
    });

    it('should return true for config with count', () => {
      expect(
        isRRuleCustom(mocks.customRRuleWithCount, t, mocks.eventDate)
      ).toBe(true);
    });

    it('should return true for config with interval > 1', () => {
      expect(
        isRRuleCustom(
          mocks.customRRuleWithIntervalLargerThan1,
          t,
          mocks.eventDate
        )
      ).toBe(true);
    });

    it('should return false for config with every weekday', () => {
      expect(
        isRRuleCustom(mocks.customRRuleEveryWeekday, t, mocks.eventDate)
      ).toBe(false);
    });

    it('should return true for weekly config not every weekday', () => {
      expect(
        isRRuleCustom(
          mocks.customRRuleWeeklyNotEveryWeekday,
          t,
          mocks.eventDate
        )
      ).toBe(true);
    });

    it('should return true for weekly config that does not include the event day', () => {
      expect(
        isRRuleCustom(
          mocks.customRRuleWeeklyEventDayNotSelected,
          t,
          mocks.eventDate
        )
      ).toBe(true);
    });

    it('should return false for daily rule that is in string form', () => {
      expect(
        isRRuleCustom(mocks.nonCustomRRuleInStringForm, t, mocks.eventDate)
      ).toBe(false);
    });

    // This happens after the request to the backend fires, and the side panel hasn't been
    // destroyed. DTSTART has to be removed for the BE.
    it('should return false for weekly config that comes in string form without dtstart', () => {
      expect(
        isRRuleCustom(
          mocks.weeklyRuleInStringFormWithoutDtstart,
          t,
          mocks.eventDate
        )
      ).toBe(false);
    });
  });

  describe('getDateEnding', () => {
    const daysEndingInSt = [1, 21];
    const daysEndingInNd = [2, 22];
    const daysEndingInRd = [3, 23];
    const daysEndingInTh = [
      4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 24, 25, 26,
      27, 28, 29, 30,
    ];

    it.each(daysEndingInSt)('should return st ending for %d', (date) => {
      expect(getDateEnding(date)).toEqual(`${date}st`);
    });

    it.each(daysEndingInNd)('should return nd ending for %d', (date) => {
      expect(getDateEnding(date)).toEqual(`${date}nd`);
    });

    it.each(daysEndingInRd)('should return rd ending for %d', (date) => {
      expect(getDateEnding(date)).toEqual(`${date}rd`);
    });

    it.each(daysEndingInTh)('should return th ending for %d', (date) => {
      expect(getDateEnding(date)).toEqual(`${date}th`);
    });
  });
});
