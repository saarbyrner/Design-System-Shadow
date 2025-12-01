import moment from 'moment-timezone';
import {
  getDateRangeForToday,
  isDateInRange,
} from '@kitman/common/src/utils/dateRange';

describe('dateRange', () => {
  beforeEach(() => {
    moment.tz.setDefault('UTC');
    jest.useFakeTimers();
  });

  afterEach(() => {
    moment.tz.setDefault();
    jest.useRealTimers();
  });

  describe('getDateRangeForToday', () => {
    it('formats date range for today being 2024-07-10', () => {
      const fakeNowDate = new Date('2024-07-10T15:30:10Z');
      jest.setSystemTime(fakeNowDate);
      expect(getDateRangeForToday()).toEqual({
        end_date: '2024-07-10T23:59:59+00:00',
        start_date: '2024-07-10T00:00:00+00:00',
      });
    });

    it('formats date range for today being 2024-07-11', () => {
      const fakeNowDate = new Date('2024-07-11T21:30:00Z');
      jest.setSystemTime(fakeNowDate);
      expect(getDateRangeForToday()).toEqual({
        end_date: '2024-07-11T23:59:59+00:00',
        start_date: '2024-07-11T00:00:00+00:00',
      });
    });
  });
});

const dateRanges = [
  { start: '2024-07-01', end: '2024-07-10' },
  { start: '2024-07-15', end: '2024-07-20' },
  { start: null, end: '2024-07-05' }, // athlete no start date but end date (sad but happens)
  { start: '2024-08-01', end: null }, // every current athlete has a start date but no end date
];

describe('isDateInRange', () => {
  test.each([
    { date: '2024-07-19', expected: true }, // returns true due to index 1
    { date: '2024-07-05', expected: true }, // returns true due to index 0
    { date: '2024-07-11', expected: false }, // returns false b/c between index 0 & 1, outside of 2 & 3
    { date: '2024-08-02', expected: true }, // returns true due to index 3
    { date: '2023-12-31', expected: true }, // returns true due to index 2
    { date: '2024-09-01', expected: true }, // returns true due to index 3
    { date: '2024-06-30', expected: true }, // this returns true due to index 2
  ])('returns $expected when date is $date', ({ date, expected }) => {
    expect(isDateInRange(moment(date), dateRanges)).toBe(expected);
  });
});
