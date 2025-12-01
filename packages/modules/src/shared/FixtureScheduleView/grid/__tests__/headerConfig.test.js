import { getLeagueScheduleHeaders } from '../headerConfig';

describe('LeagueScheduleHeaders', () => {
  it('includes LeagueMatchDayHeader when showMatchDayHeader is true', () => {
    const headers = getLeagueScheduleHeaders(true);
    const hasMatchDay = headers.some(
      (header) => header.field === 'round_number'
    );
    expect(hasMatchDay).toBe(true);
  });

  it('does NOT include LeagueMatchDayHeader when showMatchDayHeader is false', () => {
    const headers = getLeagueScheduleHeaders(false);
    const hasMatchDay = headers.some(
      (header) => header.field === 'round_number'
    );
    expect(hasMatchDay).toBe(false);
  });

  it('defaults to excluding LeagueMatchDayHeader when no argument is passed', () => {
    const headers = getLeagueScheduleHeaders();
    const hasMatchDay = headers.some(
      (header) => header.field === 'round_number'
    );
    expect(hasMatchDay).toBe(false);
  });
});
