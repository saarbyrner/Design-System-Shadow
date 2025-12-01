import {
  checkWeekStartDayValidity,
  checkDefaultEventDurationValidity,
} from '../helpers';

describe('helpers', () => {
  describe('checkWeekStartDayValidity', () => {
    it('should return true for a valid day', () => {
      expect(checkWeekStartDayValidity('Sunday')).toBe(true);
    });
    it('should return false for an invalid day', () => {
      expect(checkWeekStartDayValidity('Someday')).toBe(false);
    });
  });
  describe('checkDefaultEventDurationValidity', () => {
    it('should return true for a valid value', () => {
      expect(checkDefaultEventDurationValidity(30)).toBe(true);
    });
    it('should return false for an invalid value', () => {
      expect(checkDefaultEventDurationValidity(0)).toBe(false);
    });
    it('should return false for an empty value', () => {
      expect(checkDefaultEventDurationValidity(undefined)).toBe(false);
    });
  });
});
