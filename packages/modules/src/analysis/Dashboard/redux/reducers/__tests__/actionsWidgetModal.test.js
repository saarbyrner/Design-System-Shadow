import actionsWidgetModalReducer from '../actionsWidgetModal';

describe('analyticalDashboard - actionsWidgetModal reducer', () => {
  const defaultState = {
    isOpen: false,
    widgetId: null,
    organisation_annotation_type_ids: [],
    population: {
      applies_to_squad: false,
      position_groups: [],
      positions: [],
      athletes: [],
      all_squads: false,
      squads: [],
    },
    hidden_columns: [],
  };
  it('returns correct state on OPEN_ACTIONS_WIDGET_MODAL', () => {
    const action = {
      type: 'OPEN_ACTIONS_WIDGET_MODAL',
      payload: {
        widgetId: 123,
        annotationTypes: [12],
        population: {
          applies_to_squad: true,
          position_groups: [1234],
          positions: [],
          athletes: [98765432],
          all_squads: false,
          squads: [],
        },
        hiddenColumns: ['due_date'],
      },
    };

    const nextState = actionsWidgetModalReducer(defaultState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      isOpen: true,
      widgetId: 123,
      organisation_annotation_type_ids: [12],
      population: {
        applies_to_squad: true,
        position_groups: [1234],
        positions: [],
        athletes: [98765432],
        all_squads: false,
        squads: [],
      },
      hidden_columns: ['due_date'],
    });
  });

  it('returns correct state on CLOSE_ACTIONS_WIDGET_MODAL', () => {
    const initialState = {
      ...defaultState,
      isOpen: true,
    };

    const action = {
      type: 'CLOSE_ACTIONS_WIDGET_MODAL',
    };

    const nextState = actionsWidgetModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      isOpen: false,
    });
  });

  it('returns correct state on SELECT_ACTIONS_WIDGET_ANNOTATION_TYPE', () => {
    const initialState = {
      ...defaultState,
      organisation_annotation_type_ids: [],
    };

    const action = {
      type: 'SELECT_ACTIONS_WIDGET_ANNOTATION_TYPE',
      payload: {
        annotationTypeId: 45,
      },
    };

    const nextState = actionsWidgetModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      organisation_annotation_type_ids: [45],
    });
  });

  it('returns correct state on UNSELECT_ACTIONS_WIDGET_ANNOTATION_TYPE', () => {
    const initialState = {
      ...defaultState,
      organisation_annotation_type_ids: [4],
    };

    const action = {
      type: 'UNSELECT_ACTIONS_WIDGET_ANNOTATION_TYPE',
      payload: {
        annotationTypeId: 4,
      },
    };

    const nextState = actionsWidgetModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      organisation_annotation_type_ids: [],
    });
  });

  it('returns correct state on SET_ACTIONS_WIDGET_POPULATION', () => {
    const initialState = {
      ...defaultState,
    };

    const action = {
      type: 'SET_ACTIONS_WIDGET_POPULATION',
      payload: {
        population: {
          applies_to_squad: true,
          position_groups: [1234],
          positions: [],
          athletes: [98765432],
          all_squads: false,
          squads: [],
        },
      },
    };

    const nextState = actionsWidgetModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      population: {
        applies_to_squad: true,
        position_groups: [1234],
        positions: [],
        athletes: [98765432],
        all_squads: false,
        squads: [],
      },
    });
  });

  it('returns correct state on SET_ACTIONS_WIDGET_HIDDEN_COLUMNS', () => {
    const initialState = {
      ...defaultState,
      hidden_columns: [],
    };

    const action = {
      type: 'SET_ACTIONS_WIDGET_HIDDEN_COLUMNS',
      payload: {
        hiddenColumns: ['due_date'],
      },
    };

    const nextState = actionsWidgetModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      hidden_columns: ['due_date'],
    });
  });

  it('returns correct state on SAVE_ACTIONS_WIDGET_SUCCESS', () => {
    const initialState = {
      ...defaultState,
      isOpen: true,
      status: 'loading',
    };

    const action = {
      type: 'SAVE_ACTIONS_WIDGET_SUCCESS',
    };

    const nextState = actionsWidgetModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      isOpen: false,
      status: null,
    });
  });

  it('returns correct state on SAVE_ACTIONS_WIDGET_LOADING', () => {
    const initialState = {
      ...defaultState,
      status: null,
    };

    const action = {
      type: 'SAVE_ACTIONS_WIDGET_LOADING',
    };

    const nextState = actionsWidgetModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      status: 'loading',
    });
  });

  it('returns correct state on SAVE_ACTIONS_WIDGET_FAILURE', () => {
    const initialState = {
      ...defaultState,
      status: 'loading',
    };

    const action = {
      type: 'SAVE_ACTIONS_WIDGET_FAILURE',
    };

    const nextState = actionsWidgetModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      status: 'error',
    });
  });

  it('returns correct state on CLOSE_ACTIONS_WIDGET_APP_STATUS', () => {
    const initialState = {
      ...defaultState,
      status: 'error',
    };

    const action = {
      type: 'CLOSE_ACTIONS_WIDGET_APP_STATUS',
    };

    const nextState = actionsWidgetModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      status: null,
    });
  });
});
