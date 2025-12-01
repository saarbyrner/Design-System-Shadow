import { expect } from 'chai';
import { transformGame } from '../utils';

describe('transformGame', () => {
  const gameData = {
    id: 1,
    date: '2020-06-20',
    score: '2',
    opponent_score: '3',
    local_timezone: 'Europe/dublin',
    duration: '20',
    is_active: true,
    fixture: {
      id: '1',
      marker_date: '2020-06-20',
      round_number: '32',
      turnaround_prefix: 'ABC',
      venue_type: { id: 1, name: 'venue' },
      organisation_team: { id: 1, name: 'org team' },
      team: { id: 1, name: 'other team' },
      competition: { id: 1, name: 'competition' },
    },
  };

  it('returns the score when the game is active', () => {
    const transformedGame = transformGame({ ...gameData, is_active: true });

    expect(transformedGame.score).to.eq('2');
    expect(transformedGame.opponentScore).to.eq('3');
  });

  it('returns no score when the game is inactive', () => {
    const transformedGame = transformGame({ ...gameData, is_active: false });

    expect(transformedGame.score).to.eq(null);
    expect(transformedGame.opponentScore).to.eq(null);
  });
});
