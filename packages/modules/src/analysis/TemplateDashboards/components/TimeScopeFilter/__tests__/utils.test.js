import { getDateRanges, getDevelopmentJourneyDateRanges } from '../utils';

describe('getDateRanges', () => {
  it('returns correct date range options', () => {
    const expected = [
      'today',
      'yesterday',
      'this_week',
      'last_week',
      'last_month',
      'this_season_so_far',
      'this_season',
      'this_pre_season',
      'this_in_season',
      'last_x_days',
      'custom_date_range',
      'all_time',
    ];
    const dates = getDateRanges().map((date) => date.value);
    expect(dates).toEqual(expected);
  });
});

describe('getDevelopmentJourneyDateRanges', () => {
  it('returns correct date range options', () => {
    const expected = [
      'today',
      'yesterday',
      'this_week',
      'last_week',
      'last_month',
      'this_season_so_far',
      'last_x_days',
      'custom_date_range',
      'all_time',
    ];
    const dates = getDevelopmentJourneyDateRanges().map((date) => date.value);
    expect(dates).toEqual(expected);
  });
});
