import moment from 'moment-timezone';
import {
  formatDate,
  formatTime,
  gameStatuses,
  getAwayTeam,
  getFormattedScore,
  getFormattedStartDate,
  getFormattedStartTime,
  getGameStatusData,
} from '../helpers';

describe('getFormattedScore', () => {
  it('should return "--" when both scores are null', () => {
    const game = {
      score: null,
      opponent_score: null,
    };
    const expected = '-';
    const result = getFormattedScore(game);
    expect(result).toBe(expected);
  });

  it('should format scores when they are not null', () => {
    const game = {
      score: 3,
      opponent_score: 2,
    };
    const expected = '3 : 2';
    const result = getFormattedScore(game);
    expect(result).toBe(expected);
  });

  it('should handle null scores appropriately', () => {
    const game = {
      score: null,
      opponent_score: 2,
    };
    const expected = '0 : 2';
    const result = getFormattedScore(game);
    expect(result).toBe(expected);
  });
});

describe('getAwayTeam', () => {
  it('should return default values when opponent_squad and opponent_team are null', () => {
    const game = {
      opponent_squad: null,
      opponent_team: null,
    };
    const opponent = game.opponent_squad || game.opponent_team;
    const expected = {
      id: '',
      name: '',
      logo_full_path: undefined,
    };
    const result = getAwayTeam(opponent);
    expect(result).toEqual(expected);
  });

  it('should get values from opponent_squad when available', () => {
    const game = {
      opponent_squad: {
        id: 'opponent-squad-id',
        name: 'Opponent Squad',
        logo_full_path: 'opponent-squad-logo-url',
      },
      opponent_team: null,
    };
    const opponent = game.opponent_squad || game.opponent_team;
    const expected = {
      id: 'opponent-squad-id',
      name: 'Opponent Squad',
      logo_full_path: 'opponent-squad-logo-url',
    };
    const result = getAwayTeam(opponent);
    expect(result).toEqual(expected);
  });

  it('should get values from opponent_team when opponent_squad is null', () => {
    const game = {
      opponent_squad: null,
      opponent_team: {
        id: 'opponent-team-id',
        name: 'Opponent Team',
        logo_full_path: 'opponent-team-logo-url',
      },
    };
    const opponent = game.opponent_squad || game.opponent_team;
    const expected = {
      id: 'opponent-team-id',
      name: 'Opponent Team',
      logo_full_path: 'opponent-team-logo-url',
    };
    const result = getAwayTeam(opponent);
    expect(result).toEqual(expected);
  });

  it('should prioritize opponent_squad over opponent_team when both are available', () => {
    const game = {
      opponent_squad: {
        id: 'opponent-squad-id',
        name: 'Opponent Squad',
        logo_full_path: 'opponent-squad-logo-url',
      },
      opponent_team: {
        id: 'opponent-team-id',
        name: 'Opponent Team',
        logo_full_path: 'opponent-team-logo-url',
      },
    };
    const opponent = game.opponent_squad || game.opponent_team;
    const expected = {
      id: 'opponent-squad-id',
      name: 'Opponent Squad',
      logo_full_path: 'opponent-squad-logo-url',
    };
    const result = getAwayTeam(opponent);
    expect(result).toEqual(expected);
  });
});

describe('formatDate', () => {
  it('should use standard date formatting when the flag is enabled', () => {
    window.featureFlags['standard-date-formatting'] = true;
    const date = moment('2023-08-24T12:00:00');
    const result = formatDate(date);
    expect(result).toBe('Aug 24, 2023');
  });

  it('should format date using fallback when the flag is disabled', () => {
    window.featureFlags['standard-date-formatting'] = false;
    const date = moment('2023-08-24T12:00:00');
    const result = formatDate(date);
    expect(result).toBe('24 Aug, Thu');
  });
});

describe('formatTime', () => {
  it('should use standard time formatting when the flag is enabled', () => {
    window.featureFlags['standard-date-formatting'] = true;
    const date = moment('2023-08-24T15:30:00');
    const result = formatTime(date);
    expect(result).toBe('3:30 PM');
  });

  it('should format time using fallback when the flag is disabled', () => {
    window.featureFlags['standard-date-formatting'] = false;
    const date = moment('2023-08-24T15:30:00');
    const result = formatTime(date);
    expect(result).toBe('3:30 pm');
  });
});

describe('getFormattedStartDate', () => {
  it('should format start date based on org timezone when local timezone is the same', () => {
    window.featureFlags['standard-date-formatting'] = true;
    const game = {
      start_date: '2023-08-24T12:00:00Z',
      local_timezone: 'Europe/London',
    };
    const result = getFormattedStartDate(game);
    expect(result).toBe('Aug 24, 2023');
  });
});

describe('getFormattedStartTime', () => {
  it('should format start time based on org timezone when local timezone is the same', () => {
    window.featureFlags['standard-date-formatting'] = true;
    const game = {
      start_date: '2023-08-24T15:30:00Z',
      local_timezone: 'Europe/London',
    };
    const result = getFormattedStartTime(game);
    expect(result).toBe('4:30 PM (Europe/London)');
  });
});

describe('getGameStatusData function', () => {
  it.each(Object.values(gameStatuses))(
    `should return correct data for $value`,
    ({ value, label, style }) => {
      const result = getGameStatusData(value);
      expect(result).toEqual({
        name: label,
        style,
      });
    }
  );

  it('should return null for unknown status', () => {
    const result = getGameStatusData('unknown_status');
    expect(result).toBeNull();
  });
});
