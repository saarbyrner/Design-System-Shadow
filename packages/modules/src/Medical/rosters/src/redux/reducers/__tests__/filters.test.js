import filtersReducer from '../filters';

describe('filters reducer', () => {
  const initialState = {
    athlete_name: '',
    positions: [],
    squads: [],
    availabilities: [],
  };

  test('returns correct state on UPDATE_FILTERS', () => {
    const action = {
      type: 'UPDATE_FILTERS',
      payload: {
        filters: {
          athlete_name: 'ABC',
          squads: [1, 2],
          availabilities: [3, 4],
        },
      },
    };

    const nextState = filtersReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      athlete_name: 'ABC',
      squads: [1, 2],
      availabilities: [3, 4],
    });
  });
});
