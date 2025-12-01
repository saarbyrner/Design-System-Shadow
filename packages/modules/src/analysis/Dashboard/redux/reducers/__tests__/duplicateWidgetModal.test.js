import duplicateWidgetModalReducer from '../duplicateWidgetModal';

describe('analyticalDashboard - duplicateWidgetModal reducer', () => {
  const defaultState = {
    isOpen: false,
    widgetType: '',
  };

  it('returns correct state on OPEN_DUPLICATE_WIDGET_MODAL', () => {
    const action = {
      type: 'OPEN_DUPLICATE_WIDGET_MODAL',
      payload: {
        isNameEditable: true,
        widgetId: 1234,
        widgetType: 'Graph',
        widgetName: 'Sleep/Soreness copy',
      },
    };

    const nextState = duplicateWidgetModalReducer(defaultState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      isNameEditable: true,
      isOpen: true,
      widgetId: 1234,
      widgetType: 'Graph',
      widgetName: 'Sleep/Soreness copy',
    });
  });

  it('returns correct state on CHANGE_SELECTED_DASHBOARD', () => {
    const action = {
      type: 'CHANGE_SELECTED_DASHBOARD',
      payload: {
        selectedDashboard: { id: 1, name: 'Test 999' },
      },
    };

    const nextState = duplicateWidgetModalReducer(defaultState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      selectedDashboard: { id: 1, name: 'Test 999' },
    });
  });

  it('returns correct state on CHANGE_SELECTED_SQUAD', () => {
    const action = {
      type: 'CHANGE_SELECTED_SQUAD',
      payload: {
        selectedSquad: { id: 1, name: 'Test 999' },
      },
    };

    const nextState = duplicateWidgetModalReducer(defaultState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      selectedSquad: { id: 1, name: 'Test 999' },
    });
  });

  it('returns correct state on CHANGE_DUPLICATE_WIDGET_NAME', () => {
    const action = {
      type: 'CHANGE_DUPLICATE_WIDGET_NAME',
      payload: {
        widgetName: 'Test Duplicate Name',
      },
    };

    const nextState = duplicateWidgetModalReducer(defaultState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      widgetName: 'Test Duplicate Name',
    });
  });

  it('returns correct state on CLOSE_DUPLICATE_WIDGET_APP_STATUS', () => {
    const initialState = {
      ...defaultState,
      status: 'error',
    };

    const action = {
      type: 'CLOSE_DUPLICATE_WIDGET_APP_STATUS',
    };

    const nextState = duplicateWidgetModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      status: null,
    });
  });

  it('returns correct state on CLOSE_DUPLICATE_WIDGET_MODAL', () => {
    const action = {
      type: 'CLOSE_DUPLICATE_WIDGET_MODAL',
      payload: {
        activeDashboard: { id: 123, name: 'Testing' },
      },
    };

    const nextState = duplicateWidgetModalReducer(defaultState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      isOpen: false,
      selectedDashboard: { id: 123, name: 'Testing' },
      status: null,
      widgetId: null,
      widgetName: '',
      widgetType: '',
    });
  });

  it('returns the correct state on DUPLICATE_WIDGET_LOADING', () => {
    const initialState = {
      ...defaultState,
      status: null,
    };

    const action = {
      type: 'DUPLICATE_WIDGET_LOADING',
    };

    const nextState = duplicateWidgetModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      status: 'loading',
    });
  });

  it('returns the correct state on DUPLICATE_WIDGET_SUCCESS', () => {
    const initialState = {
      ...defaultState,
      status: 'loading',
    };

    const action = {
      type: 'DUPLICATE_WIDGET_SUCCESS',
    };

    const nextState = duplicateWidgetModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      status: 'success',
    });
  });

  it('returns the correct state on DUPLICATE_WIDGET_FAILURE', () => {
    const initialState = {
      ...defaultState,
      status: null,
    };

    const action = {
      type: 'DUPLICATE_WIDGET_FAILURE',
    };

    const nextState = duplicateWidgetModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      status: 'error',
    });
  });
});
