import duplicateDashboardModalReducer from '../duplicateDashboardModal';

describe('analyticalDashboard - duplicateDashboardModal reducer', () => {
  const defaultState = {
    dashboardName: '',
    isOpen: false,
  };

  it('returns correct state on OPEN_DUPLICATE_DASHBOARD_MODAL', () => {
    const action = {
      type: 'OPEN_DUPLICATE_DASHBOARD_MODAL',
      payload: {
        dashboardName: 'Testing 12345 copy',
      },
    };

    const nextState = duplicateDashboardModalReducer(defaultState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      dashboardName: 'Testing 12345 copy',
      isOpen: true,
    });
  });

  it('returns correct state on CHANGE_DUPLICATE_DASHBOARD_NAME', () => {
    const initialState = {
      ...defaultState,
      isOpen: true,
    };

    const action = {
      type: 'CHANGE_DUPLICATE_DASHBOARD_NAME',
      payload: {
        dashboardName: 'Testing 123456',
      },
    };

    const nextState = duplicateDashboardModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      dashboardName: 'Testing 123456',
      isOpen: true,
    });
  });

  it('returns correct state on CHANGE_DUPLICATE_DASHBOARD_SELECTED_SQUAD', () => {
    const action = {
      type: 'CHANGE_DUPLICATE_DASHBOARD_SELECTED_SQUAD',
      payload: {
        selectedSquad: { id: 1, name: 'Test 999' },
      },
    };

    const nextState = duplicateDashboardModalReducer(defaultState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      selectedSquad: { id: 1, name: 'Test 999' },
    });
  });

  it('returns the correct state on CLOSE_DUPLICATE_DASHBOARD_APP_STATUS', () => {
    const initialState = {
      ...defaultState,
      status: 'success',
    };

    const action = {
      type: 'CLOSE_DUPLICATE_DASHBOARD_APP_STATUS',
    };

    const nextState = duplicateDashboardModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      status: null,
    });
  });

  it('returns correct state on CLOSE_DUPLICATE_DASHBOARD_MODAL', () => {
    const action = {
      type: 'CLOSE_DUPLICATE_DASHBOARD_MODAL',
    };

    const nextState = duplicateDashboardModalReducer(defaultState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      dashboardName: '',
      isOpen: false,
      status: null,
    });
  });

  it('returns the correct state on DUPLICATE_DASHBOARD_LOADING', () => {
    const initialState = {
      ...defaultState,
      status: null,
    };

    const action = {
      type: 'DUPLICATE_DASHBOARD_LOADING',
    };

    const nextState = duplicateDashboardModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      status: 'loading',
    });
  });

  it('returns the correct state on DUPLICATE_DASHBOARD_SUCCESS', () => {
    const initialState = {
      ...defaultState,
      status: 'loading',
    };

    const action = {
      type: 'DUPLICATE_DASHBOARD_SUCCESS',
    };

    const nextState = duplicateDashboardModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      isOpen: false,
      status: 'success',
    });
  });

  it('returns the correct state on DUPLICATE_DASHBOARD_FAILURE', () => {
    const initialState = {
      ...defaultState,
      status: null,
    };

    const action = {
      type: 'DUPLICATE_DASHBOARD_FAILURE',
    };

    const nextState = duplicateDashboardModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      status: 'error',
    });
  });
});
