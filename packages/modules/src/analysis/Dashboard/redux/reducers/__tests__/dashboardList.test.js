import dashboardListReducer from '../dashboardList';

describe('analyticalDashboard - dashboardList reducer', () => {
  const defaultState = [
    {
      id: 1,
      name: 'Dashboard 1',
    },
    {
      id: 2,
      name: 'Dashboard 2',
    },
  ];

  it('returns correct state on UPDATE_DASHBOARD', () => {
    const action = {
      type: 'UPDATE_DASHBOARD',
      payload: {
        dashboard: {
          id: 2,
          name: 'Updated name',
        },
      },
    };

    const nextState = dashboardListReducer(defaultState, action);
    expect(nextState).toStrictEqual([
      {
        id: 1,
        name: 'Dashboard 1',
      },
      {
        id: 2,
        name: 'Updated name',
      },
    ]);
  });

  it('returns the same state for unknown action types', () => {
    const action = {
      type: 'UNKNOWN_ACTION',
      payload: {},
    };

    const nextState = dashboardListReducer(defaultState, action);
    expect(nextState).toStrictEqual(defaultState);
  });

  it('returns default state when state is undefined', () => {
    const action = {
      type: 'UNKNOWN_ACTION',
      payload: {},
    };

    const nextState = dashboardListReducer(undefined, action);
    expect(nextState).toStrictEqual([]);
  });
});
