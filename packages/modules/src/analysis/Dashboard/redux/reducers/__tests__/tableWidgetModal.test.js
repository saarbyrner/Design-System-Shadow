import tableWidgetModalReducer from '../tableWidgetModal';

describe('analyticalDashboard - tableWidgetModal reducer', () => {
  const defaultState = {
    isOpen: false,
  };

  it('returns correct state on OPEN_TABLE_WIDGET_MODAL', () => {
    const action = {
      type: 'OPEN_TABLE_WIDGET_MODAL',
    };

    const nextState = tableWidgetModalReducer(defaultState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      isOpen: true,
    });
  });

  it('returns correct state on CLOSE_TABLE_WIDGET_MODAL', () => {
    const initialState = {
      ...defaultState,
      isOpen: true,
    };

    const action = {
      type: 'CLOSE_TABLE_WIDGET_MODAL',
    };

    const nextState = tableWidgetModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      isOpen: false,
    });
  });

  it('returns the correct state on ADD_TABLE_WIDGET_LOADING', () => {
    const initialState = {
      ...defaultState,
      status: null,
    };

    const action = {
      type: 'ADD_TABLE_WIDGET_LOADING',
    };

    const nextState = tableWidgetModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      status: 'loading',
    });
  });

  it('returns the correct state on ADD_TABLE_WIDGET_SUCCESS', () => {
    const initialState = {
      ...defaultState,
      status: 'loading',
    };

    const action = {
      type: 'ADD_TABLE_WIDGET_SUCCESS',
    };

    const nextState = tableWidgetModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      status: null,
    });
  });

  it('returns the correct state on ADD_TABLE_WIDGET_FAILURE', () => {
    const initialState = {
      ...defaultState,
      status: null,
    };

    const action = {
      type: 'ADD_TABLE_WIDGET_FAILURE',
    };

    const nextState = tableWidgetModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      status: 'error',
    });
  });
});
