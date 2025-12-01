import {
  getDatesBetween,
  getWeeksBetween,
  getMonthsBetween,
} from '../dateUtils';

describe('getDatesBetween', () => {
  it('returns an array of dates between two given dates', () => {
    const expected = [
      new Date('January 1, 2024'),
      new Date('January 2, 2024'),
      new Date('January 3, 2024'),
      new Date('January 4, 2024'),
      new Date('January 5, 2024'),
      new Date('January 6, 2024'),
      new Date('January 7, 2024'),
      new Date('January 8, 2024'),
    ];

    const startDate = new Date(expected[0]);
    const endDate = new Date(expected[expected.length - 1]);

    expect(getDatesBetween(startDate, endDate)).toStrictEqual(expected);
  });

  it('returns an array of one date when start and end data is the same', () => {
    const expected = [new Date('January 1, 2024')];

    const startDate = new Date(expected[0]);
    const endDate = new Date(expected[0]);

    expect(getDatesBetween(startDate, endDate)).toStrictEqual(expected);
  });

  it('returns an array of dates over multiple months which inclues the start and end dates', () => {
    // testing dates which causes a bug
    const startDate = new Date('March 3, 2024');
    const endDate = new Date('May 6, 2024');

    const expected = getDatesBetween(startDate, endDate);

    expect(expected[0]).toEqual(new Date('March 3, 2024'));
    expect(expected[expected.length - 1]).toEqual(new Date('May 6, 2024'));
  });
});

describe('getWeeksBetween', () => {
  it('returns an array of dates for the start of the week between two dates, when start date is a Monday', () => {
    const expected = [
      new Date('2024-07-01'),
      new Date('2024-07-08'),
      new Date('2024-07-15'),
      new Date('2024-07-22'),
    ];

    const startDate = new Date('Jul 1 2024 00:00:00 UTC');
    const endDate = new Date('Jul 25 2024 00:00:00 UTC');

    expect(getWeeksBetween(startDate, endDate)).toStrictEqual(expected);
  });

  it('returns an array of dates for the start of the week between two dates, when start date is not a Monday', () => {
    const expected = [
      new Date('2024-05-27'),
      new Date('2024-06-03'),
      new Date('2024-06-10'),
      new Date('2024-06-17'),
    ];

    const startDate = new Date('Jun 2 2024 00:00:00 UTC');
    const endDate = new Date('Jun 23 2024 00:00:00 UTC');

    expect(getWeeksBetween(startDate, endDate)).toStrictEqual(expected);
  });

  it('returns an array of dates for the start of the week between two dates, when end date is a Monday', () => {
    const expected = [
      new Date('2024-07-01'),
      new Date('2024-07-08'),
      new Date('2024-07-15'),
      new Date('2024-07-22'),
    ];

    const startDate = new Date('Jul 5 2024 00:00:00 UTC');
    const endDate = new Date('Jul 22 2024 00:00:00 UTC');

    expect(getWeeksBetween(startDate, endDate)).toStrictEqual(expected);
  });

  it('returns an array of dates for the start of the week between two dates, when end date is not a Monday', () => {
    const expected = [
      new Date('2024-05-27'),
      new Date('2024-06-03'),
      new Date('2024-06-10'),
      new Date('2024-06-17'),
    ];

    const startDate = new Date('May 29 2024 00:00:00 UTC');
    const endDate = new Date('Jun 17 2024 00:00:00 UTC');

    expect(getWeeksBetween(startDate, endDate)).toStrictEqual(expected);
  });

  it('returns an array of one date for the start of the week when start and end dates are within the same week', () => {
    const expected = [new Date('2024-05-27')];

    const startDate = new Date('May 29 2024 00:00:00 UTC');
    const endDate = new Date('Jun 1 2024 00:00:00 UTC');

    expect(getWeeksBetween(startDate, endDate)).toStrictEqual(expected);
  });
});

describe('getMonthsBetween', () => {
  it('returns an array of dates for the start of the month between two dates', () => {
    const expected = [
      new Date('2024-01-01'),
      new Date('2024-02-01'),
      new Date('2024-03-01'),
      new Date('2024-04-01'),
    ];

    const startDate = new Date('Jan 11 2024 00:00:00 UTC');
    const endDate = new Date('Apr 30 2024 00:00:00 UTC');

    expect(getMonthsBetween(startDate, endDate)).toStrictEqual(expected);
  });

  it('returns an array of dates for the start of the month between two dates, when start date is beginning of the month', () => {
    const expected = [
      new Date('2024-01-01'),
      new Date('2024-02-01'),
      new Date('2024-03-01'),
      new Date('2024-04-01'),
    ];

    const startDate = new Date('Jan 1 2024 00:00:00 UTC');
    const endDate = new Date('Apr 30 2024 00:00:00 UTC');

    expect(getMonthsBetween(startDate, endDate)).toStrictEqual(expected);
  });

  it('returns an array of dates for the start of the month between two dates, when end date is beginning of the month', () => {
    const expected = [
      new Date('2024-01-01'),
      new Date('2024-02-01'),
      new Date('2024-03-01'),
      new Date('2024-04-01'),
    ];

    const startDate = new Date('Jan 11 2024 00:00:00 UTC');
    const endDate = new Date('Apr 1 2024 00:00:00 UTC');

    expect(getMonthsBetween(startDate, endDate)).toStrictEqual(expected);
  });

  it('returns an array of one date for the start of the month when start and end dates are within the same month', () => {
    const expected = [new Date('2024-01-01')];

    const startDate = new Date('Jan 11 2024 00:00:00 UTC');
    const endDate = new Date('Jan 22 2024 00:00:00 UTC');

    expect(getMonthsBetween(startDate, endDate)).toStrictEqual(expected);
  });
});
