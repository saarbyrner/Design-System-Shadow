import notesWidgetSettingsModalReducer from '../notesWidgetSettingsModal';

describe('analyticalDashboard - notesWidgetSettingsModal reducer', () => {
  const defaultState = {
    isOpen: false,
  };

  it('returns correct state on OPEN_NOTES_WIDGET_SETTINGS_MODAL', () => {
    const action = {
      type: 'OPEN_NOTES_WIDGET_SETTINGS_MODAL',
      payload: {
        widgetId: null,
        widgetName: 'Abc123',
        population: {
          applies_to_squad: true,
          position_groups: [1234],
          positions: [],
          athletes: [98765432],
          all_squads: false,
          squads: [],
        },
        timeScope: {
          time_period: 'this_week',
          start_time: '12345678',
          end_time: '09876543456',
          time_period_length: null,
        },
        annotationTypes: [{ organisation_annotation_type_id: 12 }],
      },
    };

    const nextState = notesWidgetSettingsModalReducer(defaultState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      isOpen: true,
      widgetId: null,
      widgetName: 'Abc123',
      population: {
        applies_to_squad: true,
        position_groups: [1234],
        positions: [],
        athletes: [98765432],
        all_squads: false,
        squads: [],
      },
      time_scope: {
        time_period: 'this_week',
        start_time: '12345678',
        end_time: '09876543456',
        time_period_length: null,
      },
      widget_annotation_types: [{ organisation_annotation_type_id: 12 }],
    });
  });

  it('returns correct state on CLOSE_NOTES_WIDGET_SETTINGS_MODAL', () => {
    const action = {
      type: 'CLOSE_NOTES_WIDGET_SETTINGS_MODAL',
    };

    const nextState = notesWidgetSettingsModalReducer(defaultState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      isOpen: false,
    });
  });

  it('returns correct state on SET_NOTES_WIDGET_SETTINGS_POPULATION', () => {
    const initialState = {
      ...defaultState,
      isOpen: true,
    };

    const action = {
      type: 'SET_NOTES_WIDGET_SETTINGS_POPULATION',
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

    const nextState = notesWidgetSettingsModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      isOpen: true,
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

  it('returns correct state on SET_NOTES_WIDGET_SETTINGS_TIME_PERIOD', () => {
    const initialState = {
      ...defaultState,
      isOpen: true,
    };

    const action = {
      type: 'SET_NOTES_WIDGET_SETTINGS_TIME_PERIOD',
      payload: {
        timePeriod: 'this_week',
      },
    };

    const nextState = notesWidgetSettingsModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      isOpen: true,
      time_scope: {
        time_period: 'this_week',
      },
    });
  });

  it('returns correct state on SET_NOTES_WIDGET_SETTINGS_TIME_PERIOD when timePeriod is last_x_days', () => {
    const initialState = {
      ...defaultState,
      isOpen: true,
    };

    const action = {
      type: 'SET_NOTES_WIDGET_SETTINGS_TIME_PERIOD',
      payload: {
        timePeriod: 'last_x_days',
      },
    };

    const nextState = notesWidgetSettingsModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      isOpen: true,
      time_scope: {
        time_period: 'last_x_days',
      },
    });
  });

  it('returns correct state on SET_NOTES_WIDGET_SETTINGS_TIME_PERIOD when timePeriod is custom_date_range', () => {
    const initialState = {
      ...defaultState,
      isOpen: true,
    };

    const action = {
      type: 'SET_NOTES_WIDGET_SETTINGS_TIME_PERIOD',
      payload: {
        timePeriod: 'custom_date_range',
      },
    };

    const nextState = notesWidgetSettingsModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      isOpen: true,
      time_scope: {
        time_period: 'custom_date_range',
      },
    });
  });

  it('returns correct state on SELECT_ANNOTATION_TYPE', () => {
    const initialState = {
      ...defaultState,
      isOpen: true,
      widget_annotation_types: [],
    };

    const action = {
      type: 'SELECT_ANNOTATION_TYPE',
      payload: {
        annotationTypeId: 45,
      },
    };

    const nextState = notesWidgetSettingsModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      isOpen: true,
      widget_annotation_types: [
        {
          organisation_annotation_type_id: 45,
        },
      ],
    });
  });

  it('returns correct state on UNSELECT_ANNOTATION_TYPE', () => {
    const initialState = {
      ...defaultState,
      isOpen: true,
      widget_annotation_types: [
        {
          organisation_annotation_type_id: 4,
        },
      ],
    };

    const action = {
      type: 'UNSELECT_ANNOTATION_TYPE',
      payload: {
        annotationTypeId: 4,
      },
    };

    const nextState = notesWidgetSettingsModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      isOpen: true,
      widget_annotation_types: [],
    });
  });

  it('returns correct state on UPDATE_NOTES_WIDGET_SETTINGS_DATE_RANGE', () => {
    const initialState = {
      ...defaultState,
      isOpen: true,
    };

    const action = {
      type: 'UPDATE_NOTES_WIDGET_SETTINGS_DATE_RANGE',
      payload: {
        dateRange: {
          start_date: '12345678',
          end_date: '09876543456',
        },
      },
    };

    const nextState = notesWidgetSettingsModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      isOpen: true,
      time_scope: {
        start_time: '12345678',
        end_time: '09876543456',
      },
    });
  });

  it('returns correct state on UPDATE_NOTES_WIDGET_SETTINGS_TIME_PERIOD_LENGTH', () => {
    const initialState = {
      ...defaultState,
      isOpen: true,
    };

    const action = {
      type: 'UPDATE_NOTES_WIDGET_SETTINGS_TIME_PERIOD_LENGTH',
      payload: {
        timePeriodLength: 12,
      },
    };

    const nextState = notesWidgetSettingsModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      isOpen: true,
      time_scope: {
        time_period_length: 12,
      },
    });
  });

  it('returns the correct state on SAVE_NOTES_WIDGET_SETTINGS_LOADING', () => {
    const initialState = {
      ...defaultState,
      status: null,
    };

    const action = {
      type: 'SAVE_NOTES_WIDGET_SETTINGS_LOADING',
    };

    const nextState = notesWidgetSettingsModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      status: 'loading',
    });
  });

  it('returns the correct state on SAVE_NOTES_WIDGET_SETTINGS_SUCCESS', () => {
    const initialState = {
      ...defaultState,
      status: 'loading',
    };

    const action = {
      type: 'SAVE_NOTES_WIDGET_SETTINGS_SUCCESS',
    };

    const nextState = notesWidgetSettingsModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      status: null,
    });
  });

  it('returns the correct state on SAVE_NOTES_WIDGET_SETTINGS_FAILURE', () => {
    const initialState = {
      ...defaultState,
      status: null,
    };

    const action = {
      type: 'SAVE_NOTES_WIDGET_SETTINGS_FAILURE',
    };

    const nextState = notesWidgetSettingsModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      status: 'error',
    });
  });
});
