import CommentsFilters from '../CommentsFilters';

describe('<CommentsFilters />', () => {
  const initialState = {
    athlete_name: '',
    positions: [],
    squads: [],
    availabilities: [],
    issues: [],
  };

  it('returns correct state on UPDATE_COACHES_REPORT_FILTERS', () => {
    const action = {
      type: 'UPDATE_COACHES_REPORT_FILTERS',
      payload: {
        filters: {
          athlete_name: 'Hulk Hogan',
          squads: [1, 2, 8, 9],
          availabilities: [3, 4, 5],
          issues: ['open_issues', 'no_open_issues'],
        },
      },
    };

    const nextState = CommentsFilters(initialState, action);
    expect(nextState).toMatchObject({
      ...initialState,
      athlete_name: 'Hulk Hogan',
      squads: [1, 2, 8, 9],
      availabilities: [3, 4, 5],
      issues: ['open_issues', 'no_open_issues'],
    });
  });
});
