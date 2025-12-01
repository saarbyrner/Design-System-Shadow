import unitsHelper from '../unitsHelper';

// Note: These tests assume a global mock/stub for `i18n.t()` is configured in the test environment (e.g., via Jest's setupFilesAfterEnv).
// The mock is expected to return the translation key itself, so `i18n.t('second')` returns `'second'`.

describe('unitsHelper', () => {
  describe('Time Units', () => {
    it('returns the correct translation for seconds and minutes', () => {
      // Singular
      expect(unitsHelper('secs', 1)).toEqual('second');
      expect(unitsHelper('seconds', 1)).toEqual('second');
      expect(unitsHelper('minutes', 1)).toEqual('minute');

      // Plural
      expect(unitsHelper('secs', 2)).toEqual('seconds');
      expect(unitsHelper('minutes', 0)).toEqual('minutes');
      expect(unitsHelper('minutes', 5)).toEqual('minutes');

      // Shortened
      expect(unitsHelper('seconds', 1, true)).toEqual('sec');
      expect(unitsHelper('seconds', 2, true)).toEqual('secs');
      expect(unitsHelper('minutes', 1, true)).toEqual('min');
      expect(unitsHelper('minutes', 2, true)).toEqual('mins');
    });

    it('returns the correct translation for hours, days, weeks, months, and years', () => {
      expect(unitsHelper('hours', 1)).toEqual('hour');
      expect(unitsHelper('hours', 2)).toEqual('hours');

      expect(unitsHelper('days', 1)).toEqual('day');
      expect(unitsHelper('days', 2)).toEqual('days');

      expect(unitsHelper('weeks', 1)).toEqual('week');
      expect(unitsHelper('weeks', 2)).toEqual('weeks');

      expect(unitsHelper('months', 1)).toEqual('month');
      expect(unitsHelper('months', 2)).toEqual('months');

      expect(unitsHelper('years', 1)).toEqual('year');
      expect(unitsHelper('years', 2)).toEqual('years');
    });
  });

  describe('Distance Units', () => {
    it('returns the correct translation for imperial distance units', () => {
      expect(unitsHelper('inches', 1)).toEqual('inch');
      expect(unitsHelper('inches', 2)).toEqual('inches');

      expect(unitsHelper('feet', 1)).toEqual('foot');
      expect(unitsHelper('feet', 2)).toEqual('feet');

      expect(unitsHelper('miles', 1)).toEqual('mile');
      expect(unitsHelper('miles', 2)).toEqual('miles');
    });

    it('returns the correct translation for metric distance units', () => {
      expect(unitsHelper('centimeters', 1)).toEqual('centimeter');
      expect(unitsHelper('centimeters', 2)).toEqual('centimeters');
      expect(unitsHelper('centimeters', 1, true)).toEqual('cm');

      expect(unitsHelper('meters', 1)).toEqual('meter');
      expect(unitsHelper('meters', 2)).toEqual('meters');
      expect(unitsHelper('meters', 5, true)).toEqual('m');

      expect(unitsHelper('kilometers', 1)).toEqual('kilometer');
      expect(unitsHelper('kilometers', 10, true)).toEqual('km');
    });

    it('VERIFICATION: returns the correct translation for "yards" (bug fix)', () => {
      expect(unitsHelper('yards', 1)).not.toEqual('year');
      expect(unitsHelper('yards', 2)).not.toEqual('years');

      expect(unitsHelper('yards', 1)).toEqual('yard');
      expect(unitsHelper('yards', 2)).toEqual('yards');
    });
  });

  describe('Weight Units', () => {
    it('returns the correct translation for imperial weight units', () => {
      expect(unitsHelper('pounds', 1)).toEqual('pound');
      expect(unitsHelper('pounds', 5)).toEqual('pounds');
      expect(unitsHelper('pounds', 1, true)).toEqual('lb');
      expect(unitsHelper('pounds', 10, true)).toEqual('lbs');
    });

    it('returns the correct translation for metric weight units', () => {
      expect(unitsHelper('kilograms', 1)).toEqual('kilogram');
      expect(unitsHelper('kilograms', 50)).toEqual('kilograms');
      expect(unitsHelper('kilograms', 1, true)).toEqual('kg');
      expect(unitsHelper('kilograms', 10, true)).toEqual('kg');
    });
  });

  describe('Edge Cases and Fallbacks', () => {
    it('is case-insensitive to the input unit', () => {

      expect(unitsHelper('Seconds', 1)).toEqual('second');
      expect(unitsHelper('FEET', 2)).toEqual('feet');
      expect(unitsHelper('kIlOgRaMs', 1, true)).toEqual('kg');
    });

    it('handles the fallback for units not in the dictionary', () => {
      // The helper should fall back to i18n.t(key, { count }) for unknown units
      expect(unitsHelper('calories', 1)).toEqual('calories');
      expect(unitsHelper('calories', 10)).toEqual('calories');
      expect(unitsHelper('joules', 100)).toEqual('joules');
    });
  });
});