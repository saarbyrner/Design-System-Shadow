import { renderHook } from '@testing-library/react-hooks';
import usePlayersByGroups from '../usePlayersByGroups';

const player = {
  id: 1,
  user_id: 101,
  firstname: 'John',
  lastname: 'Doe',
  fullname: 'John Doe',
  position: {
    abbreviation: 'GK',
    name: 'Goalkeeper',
    position_group: {
      name: 'Goalkeepers',
      order: 1,
    },
  },
};

const mockTeam = {
  inFieldPlayers: {},
  players: [player],
};

describe('usePlayersByGroups', () => {
  it('should return players grouped by position groups', () => {
    const { result } = renderHook(() => usePlayersByGroups(mockTeam));
    const { groups, allPlayers } = result.current;

    expect(groups).toEqual({ Goalkeepers: [player] });
    expect(allPlayers).toEqual([player]);
  });
});
