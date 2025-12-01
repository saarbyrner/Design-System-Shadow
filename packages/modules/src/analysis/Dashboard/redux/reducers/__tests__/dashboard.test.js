import {
  openTableColumnFormulaPanel,
  toggleTableColumnFormulaPanel,
} from '@kitman/modules/src/analysis/Dashboard/redux/actions/tableWidget/panel';
import { colors } from '@kitman/common/src/variables';
// eslint-disable-next-line jest/no-mocks-import
import {
  COMPARISON_WIDGET_MOCK,
  SCORECARD_WIDGET_MOCK,
  LONGITUDINAL_WIDGET_MOCK,
} from '../../__mocks__/tableWidget';
import dashboardReducer from '../dashboard';

// Freeze time and return a stable ISO string for assertions
const freezeTime = (iso = '2025-01-01T00:00:00.000Z') => {
  jest.useFakeTimers();
  const frozen = new Date(iso);
  jest.setSystemTime(frozen);
  return frozen.toISOString();
};

describe('analyticalDashboard - dashboard reducer', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  const defaultState = {
    isTableColumnPanelOpen: false,
    isTableRowPanelOpen: false,
    isTableColumnFormulaPanelOpen: false,
    activeDashboard: {},
    appStatusText: '',
    status: null,
    widgets: [],
    toast: [],
  };

  it('returns correct state on FETCH_WIDGETS_LOADING', () => {
    const action = {
      type: 'FETCH_WIDGETS_LOADING',
    };
    const nextState = dashboardReducer(defaultState, action);
    expect(nextState).toEqual({
      ...defaultState,
      status: 'loading',
      appStatusText: 'Loading...',
    });
  });

  it('returns correct state on FETCH_WIDGETS_SUCCESS', () => {
    const action = {
      type: 'FETCH_WIDGETS_SUCCESS',
      payload: {
        widgets: [
          {
            cols: 6,
            rows: 2,
            horizontal_position: 0,
            vertical_position: 0,
            id: 9,
            widget: {},
            widget_render: {},
            widget_type: 'header',
          },
        ],
      },
    };
    const nextState = dashboardReducer(defaultState, action);
    expect(nextState).toEqual({
      ...defaultState,
      widgets: [
        {
          cols: 6,
          rows: 2,
          horizontal_position: 0,
          vertical_position: 0,
          id: 9,
          widget: {},
          widget_render: {},
          widget_type: 'header',
        },
      ],
      status: null,
    });
  });

  it('returns correct state on SAVE_DEVELOPMENT_GOAL_WIDGET_FAILURE', () => {
    const action = {
      type: 'SAVE_DEVELOPMENT_GOAL_WIDGET_FAILURE',
    };
    const nextState = dashboardReducer(defaultState, action);
    expect(nextState).toEqual({
      ...defaultState,
      status: 'error',
      appStatusText: null,
    });
  });

  it('returns correct state on FETCH_WIDGETS_FAILURE', () => {
    const action = {
      type: 'FETCH_WIDGETS_FAILURE',
    };
    const nextState = dashboardReducer(defaultState, action);
    expect(nextState).toEqual({
      ...defaultState,
      status: 'error',
      appStatusText: 'Could not load dashboard',
    });
  });

  it('returns correct state on FETCH_WIDGET_CONTENT_LOADING', () => {
    const initialState = {
      ...defaultState,
      widgets: [
        {
          id: 1,
          widget_render: {
            error: false,
            isLoading: false,
          },
        },
        {
          id: 2,
          widget_render: {
            error: false,
            isLoading: false,
          },
        },
      ],
    };
    const action = {
      type: 'FETCH_WIDGET_CONTENT_LOADING',
      payload: {
        widgetId: 1,
      },
    };
    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      widgets: [
        {
          id: 1,
          widget_render: {
            error: false,
            isLoading: true,
          },
        },
        {
          id: 2,
          widget_render: {
            error: false,
            isLoading: false,
          },
        },
      ],
    });
  });

  it('returns correct state on FETCH_WIDGET_CONTENT_SUCCESS', () => {
    const initialState = {
      ...defaultState,
      widgets: [
        {
          id: 1,
          widget_render: {
            error: false,
            isLoading: false,
          },
        },
        {
          id: 2,
          widget_render: {
            error: false,
            isLoading: false,
          },
        },
      ],
    };
    const action = {
      type: 'FETCH_WIDGET_CONTENT_SUCCESS',
      payload: {
        widgetId: 1,
        widgetContent: {
          type: 'graph',
          metrics: [],
        },
      },
    };
    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      widgets: [
        {
          id: 1,
          widget_render: {
            type: 'graph',
            metrics: [],
            isLoading: false,
            error: false,
          },
        },
        {
          id: 2,
          widget_render: {
            error: false,
            isLoading: false,
          },
        },
      ],
    });
  });

  it('returns correct state on FETCH_WIDGET_CONTENT_FORBIDDEN', () => {
    const initialState = {
      ...defaultState,
      widgets: [
        {
          id: 1,
          widget_render: {
            error: false,
            isLoading: true,
          },
        },
        {
          id: 2,
          widget_render: {
            error: false,
            isLoading: false,
          },
        },
      ],
    };
    const action = {
      type: 'FETCH_WIDGET_CONTENT_FORBIDDEN',
      payload: {
        widgetId: 1,
      },
    };
    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      widgets: [
        {
          id: 1,
          widget_render: {
            isLoading: false,
            error: false,
            forbidden: true,
          },
        },
        {
          id: 2,
          widget_render: {
            error: false,
            isLoading: false,
          },
        },
      ],
    });
  });

  it('returns correct state on FETCH_WIDGET_CONTENT_FAILURE', () => {
    const initialState = {
      ...defaultState,
      widgets: [
        {
          id: 1,
          widget_render: {
            error: false,
            isLoading: false,
          },
        },
        {
          id: 2,
          widget_render: {
            error: false,
            isLoading: false,
          },
        },
      ],
    };
    const action = {
      type: 'FETCH_WIDGET_CONTENT_FAILURE',
      payload: {
        widgetId: 1,
        errorMessage: 'Error message',
      },
    };
    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      widgets: [
        {
          id: 1,
          widget_render: {
            isLoading: false,
            error: true,
            errorMessage: 'Error message',
          },
        },
        {
          id: 2,
          widget_render: {
            error: false,
            isLoading: false,
          },
        },
      ],
    });
  });

  it('returns correct state on UPDATE_EXISTING_WIDGET_Y_POSITION', () => {
    const initialState = {
      ...defaultState,
      widgets: [
        {
          id: 1,
          widget_type: 'graph',
          vertical_position: 0,
          horizontal_position: 0,
        },
        {
          id: 2,
          widget_type: 'header',
          vertical_position: 3,
          horizontal_position: 0,
        },
        {
          id: 3,
          widget_type: 'graph',
          vertical_position: 4,
          horizontal_position: 0,
        },
      ],
    };
    const action = {
      type: 'UPDATE_EXISTING_WIDGET_Y_POSITION',
      payload: {
        widget: {
          widget_type: 'athlete_profile',
          id: 4,
          vertical_position: 0,
          horizontal_position: 0,
          rows: 3,
        },
      },
    };

    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      widgets: [
        {
          id: 1,
          widget_type: 'graph',
          vertical_position: 3,
          horizontal_position: 0,
        },
        {
          id: 2,
          widget_type: 'header',
          vertical_position: 6,
          horizontal_position: 0,
        },
        {
          id: 3,
          widget_type: 'graph',
          vertical_position: 7,
          horizontal_position: 0,
        },
      ],
    });
  });

  it('returns correct state on SAVE_WIDGET_SUCCESS', () => {
    const initialState = {
      ...defaultState,
      widgets: [
        {
          id: 1,
          widget_type: 'graph',
        },
      ],
    };

    const action = {
      type: 'SAVE_WIDGET_SUCCESS',
      payload: {
        widget: {
          widget_type: 'header',
          id: 90,
        },
      },
    };

    const nextState = dashboardReducer(initialState, action);

    expect(nextState).toEqual({
      ...defaultState,
      widgets: [
        {
          id: 1,
          widget_type: 'graph',
        },
        {
          widget_type: 'header',
          id: 90,
        },
      ],
    });
  });

  it('returns correct state on EDIT_WIDGET_SUCCESS', () => {
    const initialState = {
      ...defaultState,
      widgets: [
        {
          id: 1,
          widget_type: 'graph',
        },
        {
          id: 2,
          widget_type: 'header',
          widget_render: {
            widget_name: 'test',
            background_color: colors.white,
            population: {
              applies_to_squad: false,
              position_groups: [],
              positions: [],
              athletes: [],
              all_squads: false,
              squads: [],
            },
          },
        },
      ],
    };
    const action = {
      type: 'EDIT_WIDGET_SUCCESS',
      payload: {
        widget: {
          widget_type: 'header',
          id: 2,
          widget_render: {
            widget_name: 'Edited test widget',
            background_color: colors.black_100,
            population: {
              applies_to_squad: true,
              position_groups: [1],
              positions: [22],
              athletes: [3345],
              all_squads: false,
              squads: [],
            },
          },
        },
      },
    };

    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      widgets: [
        {
          id: 1,
          widget_type: 'graph',
        },
        {
          widget_type: 'header',
          id: 2,
          widget_render: {
            widget_name: 'Edited test widget',
            background_color: colors.black_100,
            population: {
              applies_to_squad: true,
              position_groups: [1],
              positions: [22],
              athletes: [3345],
              all_squads: false,
              squads: [],
            },
          },
        },
      ],
    });
  });

  it('returns correct state on UPDATE_ANNOTATION', () => {
    const initialState = {
      ...defaultState,
      widgets: [
        {
          id: 1,
          widget_type: 'graph',
        },
        {
          id: 2,
          widget_type: 'annotation',
          widget_render: {
            annotations: [{ id: 123, title: 'abc' }],
          },
        },
      ],
    };
    const action = {
      type: 'UPDATE_ANNOTATION',
      payload: {
        widgetId: 2,
        annotation: {
          id: 123,
          title: 'def',
        },
      },
    };

    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      widgets: [
        {
          id: 1,
          widget_type: 'graph',
        },
        {
          id: 2,
          widget_type: 'annotation',
          widget_render: {
            annotations: [{ id: 123, title: 'def' }],
          },
        },
      ],
    });
  });

  it('returns the correct state on ADD_TABLE_ROW_SUCCESS', () => {
    const initialState = {
      ...defaultState,
      widgets: [
        {
          id: 1,
          widget_type: 'table',
          widget: {
            table_container: {
              rows: [{ id: 1 }],
            },
          },
        },
      ],
    };

    const action = {
      type: 'ADD_TABLE_ROW_SUCCESS',
      payload: {
        widgetId: 1,
        newRow: {
          id: 2,
        },
      },
    };

    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      status: null,
      widgets: [
        {
          id: 1,
          widget_type: 'table',
          widget: {
            table_container: {
              rows: [{ id: 1 }, { id: 2 }],
            },
          },
        },
      ],
    });
  });

  it('returns the correct state on ADD_MULTIPLE_TABLE_ROW_SUCCESS', () => {
    const initialState = {
      ...defaultState,
      widgets: [
        {
          id: 1,
          widget_type: 'table',
          widget: {
            table_container: {
              rows: [{ id: 1 }],
            },
          },
        },
      ],
    };

    const action = {
      type: 'ADD_MULTIPLE_TABLE_ROW_SUCCESS',
      payload: {
        widgetId: 1,
        newRows: [
          {
            id: 2,
          },
          {
            id: 3,
          },
        ],
      },
    };

    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      status: null,
      widgets: [
        {
          id: 1,
          widget_type: 'table',
          widget: {
            table_container: {
              rows: [{ id: 1 }, { id: 2 }, { id: 3 }],
            },
          },
        },
      ],
    });
  });

  it('returns the correct state on EDIT_SCORECARD_TABLE_ROW_SUCCESS', () => {
    const initialState = {
      ...defaultState,
      widgets: [
        {
          id: 123,
          widget_type: 'table',
          widget: {
            table_container: {
              columns: [],
              population: {
                applies_to_squad: false,
                position_groups: [],
                positions: [],
                athletes: [],
                all_squads: false,
                squads: [],
              },
              rows: [
                {
                  id: 1,
                  name: 'Old Variable',
                  table_element: {
                    calculation: 'mean',
                    name: 'Old Variable',
                    data_source: {
                      ids: [1],
                      source: 'oldSource',
                      variable: 'oldVariable',
                    },
                  },
                },
                {
                  id: 2,
                  name: 'Variable Test',
                  table_element: {
                    calculation: 'mean',
                    name: 'Variable Test',
                    data_source: {
                      ids: [2],
                      source: 'testSource',
                      variable: 'variableTest',
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    };

    const action = {
      type: 'EDIT_SCORECARD_TABLE_ROW_SUCCESS',
      payload: {
        widgetId: 123,
        rowPanelDetails: {
          calculation: 'mean',
          rowId: 1,
          dataSource: {
            ids: [1, 2],
            source: 'newSource',
            variable: 'newVariable',
            name: 'New Variable',
          },
        },
      },
    };

    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      status: null,
      widgets: [
        {
          id: 123,
          widget_type: 'table',
          widget: {
            table_container: {
              columns: [],
              population: {
                applies_to_squad: false,
                position_groups: [],
                positions: [],
                athletes: [],
                all_squads: false,
                squads: [],
              },
              rows: [
                {
                  id: 1,
                  name: 'New Variable',
                  table_element: {
                    calculation: 'mean',
                    config: { filters: {}, calculation_params: {} },
                    name: 'New Variable',
                    data_source: {
                      data_source_type: undefined,
                      participation_level_ids: [1, 2],
                      ids: [1, 2],
                      source: 'newSource',
                      status: undefined,
                      variable: 'newVariable',
                      kinds: undefined,
                    },
                  },
                },
                {
                  id: 2,
                  name: 'Variable Test',
                  table_element: {
                    calculation: 'mean',
                    name: 'Variable Test',
                    data_source: {
                      ids: [2],
                      source: 'testSource',
                      variable: 'variableTest',
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    });
  });

  it('returns the correct state on UPDATE_TABLE_SUMMARY_VISIBILITY_SUCCESS', () => {
    const initialState = {
      ...defaultState,
      widgets: [
        {
          id: 1,
          widget_type: 'table',
          widget: {
            table_container: {
              columns: [],
              population: {
                applies_to_squad: true,
                position_groups: [123],
                positions: [333],
                athletes: [],
                all_squads: false,
                squads: [],
              },
              config: {
                table_type: 'COMPARISON',
              },
            },
          },
        },
      ],
    };

    const action = {
      type: 'UPDATE_TABLE_SUMMARY_VISIBILITY_SUCCESS',
      payload: {
        updatedWidget: {
          id: 1,
          widget_type: 'table',
          widget: {
            table_container: {
              columns: [],
              population: {
                applies_to_squad: true,
                position_groups: [123],
                positions: [333],
                athletes: [],
                all_squads: false,
                squads: [],
              },
              config: {
                table_type: 'COMPARISON',
                show_summary: false,
              },
            },
          },
        },
      },
    };

    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      status: null,
      widgets: [
        {
          id: 1,
          widget_type: 'table',
          widget: {
            table_container: {
              columns: [],
              population: {
                applies_to_squad: true,
                position_groups: [123],
                positions: [333],
                athletes: [],
                all_squads: false,
                squads: [],
              },
              config: {
                table_type: 'COMPARISON',
                show_summary: false,
              },
            },
          },
        },
      ],
    });
  });

  it('returns the correct state on ADD_TABLE_COLUMN_SUCCESS', () => {
    const initialState = {
      ...defaultState,
      widgets: [
        {
          id: 1,
          widget_type: 'table',
          widget: {
            table_container: {
              columns: [],
              population: {
                applies_to_squad: true,
                position_groups: [123],
                positions: [333],
                athletes: [],
                all_squads: false,
                squads: [],
              },
            },
          },
        },
      ],
    };

    const action = {
      type: 'ADD_TABLE_COLUMN_SUCCESS',
      payload: {
        widgetId: 1,
        newColumn: { id: 123 },
      },
    };

    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      status: null,
      widgets: [
        {
          id: 1,
          widget_type: 'table',
          widget: {
            table_container: {
              columns: [{ id: 123 }],
              population: {
                applies_to_squad: true,
                position_groups: [123],
                positions: [333],
                athletes: [],
                all_squads: false,
                squads: [],
              },
            },
          },
        },
      ],
    });
  });

  it('returns the correct state on EDIT_COMPARISON_TABLE_COLUMN_SUCCESS', () => {
    const initialState = {
      ...defaultState,
      widgets: [
        {
          id: 1,
          widget_type: 'table',
          widget: {
            table_container: {
              columns: [
                {
                  id: 123,
                  name: 'Blah',
                  table_element: {
                    calculation: 'mean',
                    data_source: {
                      id: 234,
                      source: 'source',
                      variable: 'metric_variable',
                      config: null,
                      key_name: 'source|metric_variable',
                      unit: '',
                      type: 'metric',
                    },
                    id: 22423,
                    name: 'Blah',
                    config: null,
                  },
                  time_scope: {
                    start_time: undefined,
                    end_time: undefined,
                    time_period: 'daily',
                    time_period_length: undefined,
                  },
                },
                { id: 490 },
              ],
              population: {
                applies_to_squad: true,
                position_groups: [123],
                positions: [333],
                athletes: [],
                all_squads: false,
                squads: [],
              },
            },
          },
        },
      ],
    };

    const action = {
      type: 'EDIT_COMPARISON_TABLE_COLUMN_SUCCESS',
      payload: {
        widgetId: 1,
        columnPanelDetails: {
          columnId: 123,
          name: 'New Column',
          dataSource: {
            id: 678,
            source: 'new_source',
            variable: 'new_metric',
            config: null,
            key_name: 'new_source|new_metric',
            unit: '',
            type: 'metric',
          },
          calculation: 'sum',
          time_scope: {
            start_time: undefined,
            end_time: undefined,
            time_period: 'this_season',
            time_period_length: undefined,
          },
        },
      },
    };

    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      status: null,
      widgets: [
        {
          id: 1,
          widget_type: 'table',
          widget: {
            table_container: {
              columns: [
                {
                  id: 123,
                  name: 'New Column',
                  time_scope: {
                    start_time: undefined,
                    end_time: undefined,
                    time_period: 'this_season',
                    time_period_length: undefined,
                  },
                  table_element: {
                    calculation: 'sum',
                    data_source: {
                      id: 678,
                      source: 'new_source',
                      variable: 'new_metric',
                      config: null,
                      key_name: 'new_source|new_metric',
                      unit: '',
                      type: 'metric',
                    },
                    config: { filters: {}, calculation_params: {} },
                    id: 22423,
                    name: 'New Column',
                  },
                },
                { id: 490 },
              ],
              population: {
                applies_to_squad: true,
                position_groups: [123],
                positions: [333],
                athletes: [],
                all_squads: false,
                squads: [],
              },
            },
          },
        },
      ],
    });
  });

  it('returns the correct state on EDIT_SCORECARD_TABLE_COLUMN_SUCCESS', () => {
    const initialState = {
      ...defaultState,
      widgets: [
        {
          id: 1,
          widget_type: 'table',
          widget: {
            table_container: {
              columns: [
                {
                  id: 123,
                  time_scope: {
                    start_time: undefined,
                    end_time: undefined,
                    time_period: 'daily',
                    time_period_length: undefined,
                  },
                },
                { id: 490 },
              ],
            },
          },
        },
      ],
    };

    const action = {
      type: 'EDIT_SCORECARD_TABLE_COLUMN_SUCCESS',
      payload: {
        widgetId: 1,
        columnPanelDetails: {
          columnId: 123,
          time_scope: {
            start_time: undefined,
            end_time: undefined,
            time_period: 'this_season',
            time_period_length: undefined,
          },
          population: {
            applies_to_squad: true,
            position_groups: [],
            positions: [],
            athletes: [],
            all_squads: false,
            squads: [],
          },
          column_id: 123,
        },
      },
    };

    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      status: null,
      widgets: [
        {
          id: 1,
          widget_type: 'table',
          widget: {
            table_container: {
              columns: [
                {
                  id: 123,
                  time_scope: {
                    start_time: undefined,
                    end_time: undefined,
                    time_period: 'this_season',
                    time_period_length: undefined,
                  },
                  population: {
                    applies_to_squad: true,
                    position_groups: [],
                    positions: [],
                    athletes: [],
                    all_squads: false,
                    squads: [],
                  },
                  column_id: 123,
                },
                { id: 490 },
              ],
            },
          },
        },
      ],
    });
  });

  it('returns the correct state on EDIT_LONGITUDINAL_TABLE_COLUMN_SUCCESS', () => {
    const initialState = {
      ...defaultState,
      widgets: [
        {
          id: 1,
          widget_type: 'table',
          widget: {
            table_container: {
              columns: [
                {
                  id: 123,
                  name: 'Test',
                  table_element: {
                    calculation: 'sum',
                    data_source: { key_name: 'Test Metric' },
                    name: 'Test',
                  },
                  population: {
                    applies_to_squad: true,
                    position_groups: [],
                    positions: [],
                    athletes: [],
                    all_squads: false,
                    squads: [],
                  },
                },
                { id: 490 },
              ],
            },
          },
        },
      ],
    };

    const action = {
      type: 'EDIT_LONGITUDINAL_TABLE_COLUMN_SUCCESS',
      payload: {
        widgetId: 1,
        columnPanelDetails: {
          columnId: 123,
          dataSource: { key_name: 'New Test Metric', unit: 'kg' },
          name: 'New Test',
          calculation: 'mean',
          population: {
            applies_to_squad: true,
            position_groups: [],
            positions: [],
            athletes: [],
            all_squads: false,
            squads: [],
          },
        },
      },
    };

    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      status: null,
      widgets: [
        {
          id: 1,
          widget_type: 'table',
          widget: {
            table_container: {
              columns: [
                {
                  id: 123,
                  name: 'New Test',
                  population: {
                    applies_to_squad: true,
                    position_groups: [],
                    positions: [],
                    athletes: [],
                    all_squads: false,
                    squads: [],
                  },
                  table_element: {
                    calculation: 'mean',
                    config: {
                      filters: {},
                      calculation_params: {},
                    },
                    name: 'New Test',
                    data_source: {
                      key_name: 'New Test Metric',
                      unit: 'kg',
                    },
                  },
                },
                { id: 490 },
              ],
            },
          },
        },
      ],
    });
  });

  it('returns the correct state on DELETE_TABLE_COLUMN_SUCCESS', () => {
    const initialState = {
      ...defaultState,
      widgets: [
        {
          id: 1,
          widget_type: 'table',
          widget: {
            table_container: {
              columns: [{ id: 123 }, { id: 456 }],
              population: {
                applies_to_squad: true,
                position_groups: [123],
                positions: [333],
                athletes: [],
                all_squads: false,
                squads: [],
              },
            },
          },
        },
      ],
    };

    const action = {
      type: 'DELETE_TABLE_COLUMN_SUCCESS',
      payload: {
        widgetId: 1,
        columnId: 123,
      },
    };

    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      status: null,
      widgets: [
        {
          id: 1,
          widget_type: 'table',
          widget: {
            table_container: {
              columns: [{ id: 456 }],
              population: {
                applies_to_squad: true,
                position_groups: [123],
                positions: [333],
                athletes: [],
                all_squads: false,
                squads: [],
              },
            },
          },
        },
      ],
    });
  });

  it('returns the correct state on DELETE_TABLE_ROW_SUCCESS', () => {
    const initialState = {
      ...defaultState,
      widgets: [
        {
          id: 1,
          widget_type: 'table',
          widget: {
            table_container: {
              columns: [{ id: 123 }, { id: 456 }],
              rows: [
                {
                  id: 1,
                },
                {
                  id: 2,
                },
              ],
            },
          },
        },
      ],
    };

    const action = {
      type: 'DELETE_TABLE_ROW_SUCCESS',
      payload: {
        widgetId: 1,
        rowId: 1,
      },
    };

    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      status: null,
      widgets: [
        {
          id: 1,
          widget_type: 'table',
          widget: {
            table_container: {
              columns: [{ id: 123 }, { id: 456 }],
              rows: [
                {
                  id: 2,
                },
              ],
            },
          },
        },
      ],
    });
  });

  it('returns the correct state on SORT_GRAPH_WIDGET_SUCCESS', () => {
    const initialState = {
      ...defaultState,
      widgets: [
        {
          id: 1,
          widget_type: 'graph',
          widget: {
            configuration: {
              sorting: {
                enabled: false,
                order: 'asc',
              },
            },
          },
        },
      ],
    };

    const action = {
      type: 'SORT_GRAPH_WIDGET_SUCCESS',
      payload: {
        widgetId: 1,
        sortOptions: {
          enabled: true,
          order: 'desc',
          metricIndex: 0,
        },
      },
    };

    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      status: null,
      widgets: [
        {
          id: 1,
          widget_type: 'graph',
          widget: {
            configuration: {
              sorting: {
                enabled: true,
                order: 'desc',
                metricIndex: 0,
              },
            },
          },
        },
      ],
    });
  });

  it('returns the correct state on SORT_GRAPH_WIDGET_FAILURE', () => {
    const initialState = {
      ...defaultState,
      widgets: [
        {
          id: 13,
          widget_type: 'graph',
          widget_render: {
            isLoading: true,
            error: false,
            errorMessage: '',
          },
        },
      ],
    };

    const action = {
      type: 'SORT_GRAPH_WIDGET_FAILURE',
      payload: {
        widgetId: 13,
      },
    };

    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      status: null,
      widgets: [
        {
          id: 13,
          widget_type: 'graph',
          widget_render: {
            isLoading: false,
            error: true,
            errorMessage: 'Error sorting graph',
          },
        },
      ],
    });
  });

  it('returns correct state on UPDATE_NOTES', () => {
    const initialState = {
      ...defaultState,
      widgets: [
        {
          id: 1,
          widget_type: 'graph',
        },
        {
          id: 2,
          widget_type: 'annotation',
          widget_render: {
            annotations: [
              { id: 1, title: 'abc' },
              { id: 2, title: 'def' },
            ],
          },
        },
      ],
    };
    const action = {
      type: 'UPDATE_NOTES',
      payload: {
        widgetId: 2,
        nextNotes: [{ id: 3, title: 'ghi' }],
        nextPage: null,
      },
    };

    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      widgets: [
        {
          id: 1,
          widget_type: 'graph',
        },
        {
          id: 2,
          widget_type: 'annotation',
          widget_render: {
            annotations: [
              { id: 1, title: 'abc' },
              { id: 2, title: 'def' },
              { id: 3, title: 'ghi' },
            ],
            next_page: null,
          },
        },
      ],
    });
  });

  it('returns correct state on UPDATE_ACTIONS', () => {
    const initialState = {
      ...defaultState,
      widgets: [
        {
          id: 1,
          widget_type: 'graph',
        },
        {
          id: 2,
          widget_type: 'action',
          widget_render: {
            actions: [
              { id: 1, content: 'abc' },
              { id: 2, content: 'def' },
            ],
          },
        },
      ],
    };
    const action = {
      type: 'UPDATE_ACTIONS',
      payload: {
        widgetId: 2,
        actions: [{ id: 3, content: 'ghi' }],
        nextId: null,
      },
    };

    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      widgets: [
        {
          id: 1,
          widget_type: 'graph',
        },
        {
          id: 2,
          widget_type: 'action',
          widget_render: {
            actions: [
              { id: 1, content: 'abc' },
              { id: 2, content: 'def' },
              { id: 3, content: 'ghi' },
            ],
            next_id: null,
            isLoading: false,
          },
        },
      ],
    });
  });

  it('returns correct state on ON_DELETE_DEVELOPMENT_GOAL_SUCCESS', () => {
    const initialState = {
      ...defaultState,
      widgets: [
        {
          id: 1,
          widget_type: 'graph',
        },
        {
          id: 2,
          widget_type: 'development_goal',
          widget_render: { development_goals: [{ id: 1 }, { id: 2 }] },
        },
      ],
    };
    const action = {
      type: 'ON_DELETE_DEVELOPMENT_GOAL_SUCCESS',
      payload: {
        developmentGoalId: 2,
      },
    };

    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      widgets: [
        {
          id: 1,
          widget_type: 'graph',
        },
        {
          id: 2,
          widget_type: 'development_goal',
          widget_render: { development_goals: [{ id: 1 }] },
        },
      ],
    });
  });

  it('returns correct state on EDIT_DEVELOPMENT_GOAL_SUCCESS', () => {
    const initialState = {
      ...defaultState,
      widgets: [
        {
          id: 1,
          widget_type: 'graph',
        },
        {
          id: 2,
          widget_type: 'development_goal',
          widget_render: {
            development_goals: [
              {
                id: 1,
                athlete: { id: 10 },
                description: 'Development goal description',
                development_goal_types: [{ id: 20 }, { id: 21 }],
                principles: [{ id: 30 }, { id: 31 }],
                start_time: '2020-04-14T07:00:48Z',
                close_time: '2020-05-14T07:00:48Z',
              },
              { id: 2 },
            ],
          },
        },
      ],
    };
    const action = {
      type: 'EDIT_DEVELOPMENT_GOAL_SUCCESS',
      payload: {
        developmentGoal: {
          id: 1,
          athlete: { id: 100 },
          description: 'Development goal - updated description',
          development_goal_types: [{ id: 200 }, { id: 210 }],
          principles: [{ id: 300 }, { id: 310 }],
          start_time: '2020-10-14T07:00:48Z',
          close_time: '2020-11-14T07:00:48Z',
        },
      },
    };

    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      widgets: [
        {
          id: 1,
          widget_type: 'graph',
        },
        {
          id: 2,
          widget_type: 'development_goal',
          widget_render: {
            development_goals: [
              {
                id: 1,
                athlete: { id: 100 },
                description: 'Development goal - updated description',
                development_goal_types: [{ id: 200 }, { id: 210 }],
                principles: [{ id: 300 }, { id: 310 }],
                start_time: '2020-10-14T07:00:48Z',
                close_time: '2020-11-14T07:00:48Z',
              },
              { id: 2 },
            ],
          },
        },
      ],
    });
  });

  it('returns correct state on UPDATE_DEVELOPMENT_GOALS', () => {
    const initialState = {
      ...defaultState,
      widgets: [
        {
          id: 1,
          widget_type: 'graph',
        },
        {
          id: 2,
          widget_type: 'development_goal',
          widget_render: { development_goals: [{ id: 1 }, { id: 2 }] },
        },
      ],
    };
    const action = {
      type: 'UPDATE_DEVELOPMENT_GOALS',
      payload: {
        widgetId: 2,
        nextDevelopmentGoals: [{ id: 3 }, { id: 4 }],
        nextId: 5,
      },
    };

    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      widgets: [
        {
          id: 1,
          widget_type: 'graph',
        },
        {
          id: 2,
          widget_type: 'development_goal',
          widget_render: {
            development_goals: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
            next_id: 5,
          },
        },
      ],
    });
  });

  it('returns correct state on UPDATE_ACTION', () => {
    const initialState = {
      ...defaultState,
      widgets: [
        {
          id: 1,
          widget_type: 'graph',
        },
        {
          id: 2,
          widget_type: 'action',
          widget_render: {
            actions: [
              { id: 1, content: 'abc', completed: true },
              { id: 2, content: 'def', completed: true },
            ],
          },
        },
      ],
    };
    const action = {
      type: 'UPDATE_ACTION',
      payload: {
        action: { id: 2, content: 'def', completed: false },
      },
    };

    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      widgets: [
        {
          id: 1,
          widget_type: 'graph',
        },
        {
          id: 2,
          widget_type: 'action',
          widget_render: {
            actions: [
              { id: 1, content: 'abc', completed: true },
              { id: 2, content: 'def', completed: false },
            ],
          },
        },
      ],
    });
  });

  it('returns correct state on RESET_ACTION_LIST', () => {
    const initialState = {
      ...defaultState,
      widgets: [
        {
          id: 1,
          widget_type: 'graph',
        },
        {
          id: 2,
          widget_type: 'action',
          widget_render: {
            actions: [
              { id: 1, content: 'abc', completed: true },
              { id: 2, content: 'def', completed: true },
            ],
          },
        },
      ],
    };
    const action = {
      type: 'RESET_ACTION_LIST',
      payload: { widgetId: 2 },
    };

    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      widgets: [
        {
          id: 1,
          widget_type: 'graph',
        },
        {
          id: 2,
          widget_type: 'action',
          widget_render: {
            actions: [],
          },
        },
      ],
    });
  });

  it('returns correct state on FETCH_ACTIONS_LOADING', () => {
    const initialState = {
      ...defaultState,
      widgets: [
        {
          id: 1,
          widget_type: 'graph',
        },
        {
          id: 2,
          widget_type: 'action',
          widget_render: {
            actions: [],
          },
        },
      ],
    };
    const action = {
      type: 'FETCH_ACTIONS_LOADING',
      payload: {
        widgetId: 2,
      },
    };

    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      widgets: [
        {
          id: 1,
          widget_type: 'graph',
        },
        {
          id: 2,
          widget_type: 'action',
          widget_render: {
            actions: [],
            isLoading: true,
          },
        },
      ],
    });
  });

  it('returns correct state on ARCHIVE_NOTE_SUCCESS', () => {
    const initialState = {
      ...defaultState,
      widgets: [
        {
          id: 1,
          widget_type: 'graph',
        },
        {
          id: 2,
          widget_type: 'annotation',
          widget_render: {
            annotations: [
              { id: 7, title: 'abc', archived: false },
              { id: 8, title: 'def', archived: false },
            ],
            total_count: 2,
          },
        },
      ],
    };
    const action = {
      type: 'ARCHIVE_NOTE_SUCCESS',
      payload: {
        noteId: 8,
      },
    };

    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      widgets: [
        {
          id: 1,
          widget_type: 'graph',
        },
        {
          id: 2,
          widget_type: 'annotation',
          widget_render: {
            annotations: [
              { id: 7, title: 'abc', archived: false },
              { id: 8, title: 'def', archived: true },
            ],
            total_count: 1,
          },
        },
      ],
    });
  });

  it('returns correct state on RESTORE_NOTE_SUCCESS', () => {
    const initialState = {
      ...defaultState,
      widgets: [
        {
          id: 1,
          widget_type: 'graph',
        },
        {
          id: 2,
          widget_type: 'annotation',
          widget_render: {
            annotations: [
              { id: 7, title: 'abc', archived: false },
              { id: 8, title: 'def', archived: true },
            ],
          },
        },
      ],
    };
    const action = {
      type: 'RESTORE_NOTE_SUCCESS',
      payload: {
        noteId: 8,
      },
    };

    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      widgets: [
        {
          id: 1,
          widget_type: 'graph',
        },
        {
          id: 2,
          widget_type: 'annotation',
          widget_render: {
            annotations: [
              { id: 7, title: 'abc', archived: false },
              { id: 8, title: 'def', archived: false },
            ],
          },
        },
      ],
    });
  });

  it('returns the correct state on GET_DASHBOARD_LAYOUT', () => {
    const initialState = {
      ...defaultState,
      dashboardLayout: [],
    };

    const action = {
      type: 'GET_DASHBOARD_LAYOUT',
      payload: {
        widgets: [
          {
            cols: 6,
            rows: 1,
            horizontal_position: 0,
            vertical_position: 0,
            print_cols: 5,
            print_rows: 1,
            print_horizontal_position: 1,
            print_vertical_position: 3,
            rows_range: [1, 1],
            cols_range: [2, 7],
            id: 9,
            widget: {},
            widget_render: {},
            widget_type: 'header',
          },
        ],
      },
    };
    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      dashboardLayout: [
        {
          i: '9',
          x: 0,
          y: 0,
          w: 6,
          h: 1,
          minH: 1,
          maxH: 1,
          minW: 2,
          maxW: 7,
        },
      ],
      dashboardPrintLayout: [
        {
          i: '9',
          x: 1,
          y: 3,
          w: 5,
          h: 1,
          minH: 1,
          maxH: 1,
          minW: 2,
          maxW: 7,
        },
      ],
      widgets: [
        {
          cols: 6,
          rows: 1,
          horizontal_position: 0,
          vertical_position: 0,
          print_cols: 5,
          print_rows: 1,
          print_horizontal_position: 1,
          print_vertical_position: 3,
          rows_range: [1, 1],
          cols_range: [2, 7],
          id: 9,
          widget: {},
          widget_render: {},
          widget_type: 'header',
        },
      ],
    });
  });

  it('returns the correct state on GET_DASHBOARD_LAYOUT when there is already one widget layout saved', () => {
    const initialState = {
      ...defaultState,
      dashboardLayout: [
        {
          i: '64',
          x: 0,
          y: 0,
          w: 6,
          h: 1,
          minH: 1,
          maxH: 1,
          minW: 6,
          maxW: 6,
        },
      ],
      dashboardPrintLayout: [
        {
          i: '64',
          x: 1,
          y: 3,
          w: 5,
          h: 1,
          minH: 1,
          maxH: 1,
          minW: 6,
          maxW: 6,
        },
      ],
    };

    const action = {
      type: 'GET_DASHBOARD_LAYOUT',
      payload: {
        widgets: [
          {
            cols: 6,
            rows: 1,
            horizontal_position: 0,
            vertical_position: 0,
            print_cols: 5,
            print_rows: 1,
            print_horizontal_position: 1,
            print_vertical_position: 3,
            rows_range: [1, 1],
            cols_range: [6, 6],
            id: 64,
            widget: {},
            widget_render: {},
            widget_type: 'header',
          },
          {
            cols: 6,
            rows: 5,
            horizontal_position: 0,
            vertical_position: 0,
            print_cols: 5,
            print_rows: 6,
            print_horizontal_position: 1,
            print_vertical_position: 3,
            rows_range: [2, 7],
            cols_range: [1, 6],
            id: 65,
            widget: {},
            widget_render: {},
            widget_type: 'graph',
          },
        ],
      },
    };
    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      dashboardLayout: [
        {
          i: '65',
          x: 0,
          y: 0,
          w: 6,
          h: 5,
          minH: 2,
          maxH: 7,
          minW: 1,
          maxW: 6,
        },
        {
          i: '64',
          x: 0,
          y: 0,
          w: 6,
          h: 1,
          minH: 1,
          maxH: 1,
          minW: 6,
          maxW: 6,
        },
      ],
      dashboardPrintLayout: [
        {
          i: '65',
          x: 1,
          y: 3,
          w: 5,
          h: 6,
          minH: 2,
          maxH: 7,
          minW: 1,
          maxW: 6,
        },
        {
          i: '64',
          x: 1,
          y: 3,
          w: 5,
          h: 1,
          minH: 1,
          maxH: 1,
          minW: 6,
          maxW: 6,
        },
      ],
      widgets: [
        {
          cols: 6,
          rows: 5,
          horizontal_position: 0,
          vertical_position: 0,
          print_cols: 5,
          print_rows: 6,
          print_horizontal_position: 1,
          print_vertical_position: 3,
          rows_range: [2, 7],
          cols_range: [1, 6],
          id: 65,
          widget: {},
          widget_render: {},
          widget_type: 'graph',
        },
        {
          cols: 6,
          rows: 1,
          horizontal_position: 0,
          vertical_position: 0,
          print_cols: 5,
          print_rows: 1,
          print_horizontal_position: 1,
          print_vertical_position: 3,
          rows_range: [1, 1],
          cols_range: [6, 6],
          id: 64,
          widget: {},
          widget_render: {},
          widget_type: 'header',
        },
      ],
    });
  });

  it('returns correct state on UPDATE_DASHBOARD_LAYOUT one widget', () => {
    const initialState = {
      ...defaultState,
      dashboardLayout: [
        {
          i: '1',
          x: 0,
          y: 0,
          h: 5,
          w: 6,
          maxH: 7,
          minH: 2,
        },
      ],
    };

    const action = {
      type: 'UPDATE_DASHBOARD_LAYOUT',
      payload: {
        dashboardLayout: [
          {
            i: '1',
            x: 0,
            y: 0,
            h: 5,
            w: 6,
            maxH: 7,
            minH: 2,
          },
          {
            i: '2',
            x: 0,
            y: 0,
            h: 5,
            w: 6,
            maxH: 7,
            minH: 2,
          },
        ],
      },
    };

    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      dashboardLayout: [
        {
          i: '1',
          x: 0,
          y: 0,
          h: 5,
          w: 6,
          maxH: 7,
          minH: 2,
        },
        {
          i: '2',
          x: 0,
          y: 0,
          h: 5,
          w: 6,
          maxH: 7,
          minH: 2,
        },
      ],
    });
  });

  it('returns correct state on UPDATE_DASHBOARD_PRINT_LAYOUT', () => {
    const initialState = {
      ...defaultState,
      dashboardPrintLayout: [
        {
          i: '1',
          x: 0,
          y: 0,
          h: 5,
          w: 6,
          maxH: 7,
          minH: 2,
        },
      ],
    };

    const action = {
      type: 'UPDATE_DASHBOARD_PRINT_LAYOUT',
      payload: {
        dashboardPrintLayout: [
          {
            i: '1',
            x: 0,
            y: 0,
            h: 5,
            w: 6,
            maxH: 7,
            minH: 2,
          },
          {
            i: '2',
            x: 0,
            y: 0,
            h: 5,
            w: 6,
            maxH: 7,
            minH: 2,
          },
        ],
      },
    };

    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      dashboardPrintLayout: [
        {
          i: '1',
          x: 0,
          y: 0,
          h: 5,
          w: 6,
          maxH: 7,
          minH: 2,
        },
        {
          i: '2',
          x: 0,
          y: 0,
          h: 5,
          w: 6,
          maxH: 7,
          minH: 2,
        },
      ],
    });
  });

  it('returns correct state on CLOSE_REORDER_MODAL', () => {
    const initialState = {
      ...defaultState,
      isReorderModalOpen: true,
    };

    const action = {
      type: 'CLOSE_REORDER_MODAL',
    };

    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      isReorderModalOpen: false,
    });
  });

  it('returns correct state on OPEN_REORDER_MODAL', () => {
    const initialState = {
      ...defaultState,
      isReorderModalOpen: false,
    };

    const action = {
      type: 'OPEN_REORDER_MODAL',
    };

    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      isReorderModalOpen: true,
    });
  });

  it('returns correct state on OPEN_TABLE_COLUMN_FORMATTING_PANEL', () => {
    const initialState = {
      ...defaultState,
      isTableFormattingPanelOpen: false,
    };

    const action = {
      type: 'OPEN_TABLE_COLUMN_FORMATTING_PANEL',
    };

    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      isTableFormattingPanelOpen: true,
    });
  });

  it('returns correct state on OPEN_SCORECARD_TABLE_FORMATTING_PANEL', () => {
    const initialState = {
      ...defaultState,
      isTableFormattingPanelOpen: false,
    };

    const action = {
      type: 'OPEN_SCORECARD_TABLE_FORMATTING_PANEL',
    };

    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      isTableFormattingPanelOpen: true,
    });
  });

  it('returns correct state on OPEN_TABLE_COLUMN_PANEL', () => {
    const initialState = {
      ...defaultState,
      isTableColumnPanelOpen: false,
    };

    const action = {
      type: 'OPEN_TABLE_COLUMN_PANEL',
    };

    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      isTableColumnPanelOpen: true,
    });
  });

  it('returns correct state on OPEN_TABLE_COLUMN_FORMULA_PANEL', () => {
    const initialState = {
      ...defaultState,
      isTableRowPanelOpen: true,
      isTableColumnPanelOpen: true,
    };

    const nextState = dashboardReducer(
      initialState,
      openTableColumnFormulaPanel()
    );
    expect(nextState).toEqual({
      ...initialState,
      isTableColumnFormulaPanelOpen: true,
      isTableRowPanelOpen: false,
      isTableColumnPanelOpen: false,
    });
  });

  it('returns correct state on TOGGLE_TABLE_COLUMN_FORMULA_PANEL', () => {
    const initialState = {
      ...defaultState,
      isTableColumnFormulaPanelOpen: true,
    };

    const nextState = dashboardReducer(
      initialState,
      toggleTableColumnFormulaPanel()
    );
    expect(nextState).toEqual({
      ...initialState,
      isTableColumnFormulaPanelOpen: false,
    });
  });

  it('returns correct state on EDIT_COMPARISON_TABLE_COLUMN', () => {
    const initialState = {
      ...defaultState,
      isTableColumnPanelOpen: false,
    };

    const action = {
      type: 'EDIT_COMPARISON_TABLE_COLUMN',
    };

    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      isTableColumnPanelOpen: true,
    });
  });

  it('returns correct state on EDIT_SCORECARD_TABLE_COLUMN', () => {
    const initialState = {
      ...defaultState,
      isTableColumnPanelOpen: false,
    };

    const action = {
      type: 'EDIT_SCORECARD_TABLE_COLUMN',
    };

    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      isTableColumnPanelOpen: true,
    });
  });

  it('returns correct state on EDIT_LONGITUDINAL_TABLE_COLUMN', () => {
    const initialState = {
      ...defaultState,
      isTableColumnPanelOpen: false,
    };

    const action = {
      type: 'EDIT_LONGITUDINAL_TABLE_COLUMN',
    };

    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      isTableColumnPanelOpen: true,
    });
  });

  it('returns correct state on OPEN_TABLE_ROW_PANEL', () => {
    const initialState = {
      ...defaultState,
      isTableRowPanelOpen: false,
    };

    const action = {
      type: 'OPEN_TABLE_ROW_PANEL',
    };

    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      isTableRowPanelOpen: true,
    });
  });

  it('returns correct state on TOGGLE_TABLE_FORMATTING_PANEL', () => {
    const initialState = {
      ...defaultState,
      isTableFormattingPanelOpen: true,
    };

    const action = {
      type: 'TOGGLE_TABLE_FORMATTING_PANEL',
    };

    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      isTableFormattingPanelOpen: false,
    });
  });

  it('returns correct state on TOGGLE_TABLE_COLUMN_PANEL', () => {
    const initialState = {
      ...defaultState,
      isTableColumnPanelOpen: true,
    };

    const action = {
      type: 'TOGGLE_TABLE_COLUMN_PANEL',
    };

    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      isTableColumnPanelOpen: false,
    });
  });

  it('returns correct state on TOGGLE_TABLE_ROW_PANEL', () => {
    const initialState = {
      ...defaultState,
      isTableRowPanelOpen: true,
    };

    const action = {
      type: 'TOGGLE_TABLE_ROW_PANEL',
    };

    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      isTableRowPanelOpen: false,
    });
  });

  it('returns correct state on TOGGLE_SLIDING_PANEL', () => {
    const initialState = {
      ...defaultState,
      isSlidingPanelOpen: false,
    };

    const action = {
      type: 'TOGGLE_SLIDING_PANEL',
    };

    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      isSlidingPanelOpen: true,
    });
  });

  it('returns correct state on UPDATE_DASHBOARD', () => {
    const initialState = {
      ...defaultState,
      activeDashboard: {
        id: '4',
        name: 'Dashboard Name',
        layout: {
          graphs: [],
        },
      },
    };

    const action = {
      type: 'UPDATE_DASHBOARD',
      payload: {
        dashboard: {
          id: '4',
          name: 'Changed Dashboard Name',
        },
      },
    };

    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      activeDashboard: {
        id: '4',
        name: 'Changed Dashboard Name',
      },
    });
  });

  it('returns correct state on UPDATE_DASHBOARD_LAYOUT', () => {
    const initialState = {
      ...defaultState,
      dashboardLayout: [
        {
          i: '1',
          x: 0,
          y: 0,
          h: 5,
          w: 6,
          maxH: 7,
          minH: 2,
        },
        {
          i: '3',
          x: 0,
          y: 0,
          h: 2,
          w: 2,
          maxH: 4,
          minH: 2,
        },
      ],
      widgets: [
        {
          cols: 6,
          rows: 2,
          horizontal_position: 0,
          vertical_position: 0,
          id: 1,
          widget: {},
          widget_render: {},
          widget_type: 'header',
        },
        {
          cols: 2,
          rows: 2,
          horizontal_position: 0,
          vertical_position: 0,
          id: 3,
          widget: {},
          widget_render: {},
          widget_type: 'graph',
        },
      ],
    };

    const action = {
      type: 'UPDATE_DASHBOARD_LAYOUT',
      payload: {
        dashboardLayout: [
          {
            i: '1',
            x: 0,
            y: 0,
            h: 5,
            w: 6,
            maxH: 7,
            minH: 2,
          },
          {
            i: '3',
            x: 0,
            y: 2,
            h: 2,
            w: 4,
            maxH: 2,
            minH: 4,
          },
        ],
      },
    };

    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      dashboardLayout: [
        {
          i: '1',
          x: 0,
          y: 0,
          h: 5,
          w: 6,
          maxH: 7,
          minH: 2,
        },
        {
          i: '3',
          x: 0,
          y: 2,
          h: 2,
          w: 4,
          maxH: 2,
          minH: 4,
        },
      ],
      widgets: [
        {
          cols: 6,
          rows: 5,
          horizontal_position: 0,
          vertical_position: 0,
          id: 1,
          widget: {},
          widget_render: {},
          widget_type: 'header',
        },
        {
          cols: 4,
          rows: 2,
          horizontal_position: 0,
          vertical_position: 2,
          id: 3,
          widget: {},
          widget_render: {},
          widget_type: 'graph',
        },
      ],
    });
  });

  it('returns correct state on CREATE_GRAPH_LINKS_SUCCESS', () => {
    const initialState = {
      ...defaultState,
      widgets: [
        {
          id: 1,
          widget_type: 'graph',
          widget_render: {
            id: 400,
            name: 'Graph 1',
            metrics: [],
          },
        },
        {
          id: 2,
          widget_type: 'graph',
          widget_render: {
            id: 401,
            name: 'Graph 2',
            metrics: [{}, { linked_dashboard_id: 1 }, {}],
          },
        },
      ],
    };

    const action = {
      type: 'CREATE_GRAPH_LINKS_SUCCESS',
      payload: {
        graphId: 401,
        graphLinks: [
          {
            dashboardId: 3,
            metrics: [0, 2],
          },
        ],
      },
    };

    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      widgets: [
        {
          id: 1,
          widget_type: 'graph',
          widget_render: {
            id: 400,
            name: 'Graph 1',
            metrics: [],
          },
        },
        {
          id: 2,
          widget_type: 'graph',
          widget_render: {
            id: 401,
            name: 'Graph 2',
            metrics: [
              {
                linked_dashboard_id: 3,
              },
              { linked_dashboard_id: null },
              { linked_dashboard_id: 3 },
            ],
          },
        },
      ],
    });
  });

  it('returns correct state on UPDATE_AGGREGATION_PERIOD', () => {
    const initialState = {
      ...defaultState,
      widgets: [
        {
          id: 4,
          type: 'graph',
          widget_render: {
            id: 1,
            name: 'Graph 1',
            aggregationPeriod: 'day',
          },
        },
        {
          id: 5,
          type: 'graph',
          widget_render: {
            id: 2,
            name: 'Graph 2',
            aggregationPeriod: 'day',
          },
        },
      ],
    };

    const action = {
      type: 'UPDATE_AGGREGATION_PERIOD',
      payload: {
        graphId: 2,
        aggregationPeriod: 'month',
      },
    };

    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      widgets: [
        {
          id: 4,
          type: 'graph',
          widget_render: {
            id: 1,
            name: 'Graph 1',
            aggregationPeriod: 'day',
          },
        },
        {
          id: 5,
          type: 'graph',
          widget_render: {
            id: 2,
            name: 'Graph 2',
            aggregationPeriod: 'month',
          },
        },
      ],
    });
  });

  it('returns correct state on ADD_DASHBOARD_TOAST', () => {
    const initialState = {
      ...defaultState,
    };

    const action = {
      type: 'ADD_DASHBOARD_TOAST',
      payload: {
        item: {
          title: 'Test',
          status: 'PROGRESS',
          id: 1,
        },
      },
    };

    const nextState = dashboardReducer(initialState, action);

    expect(nextState).toEqual({
      ...initialState,
      toast: [
        {
          title: 'Test',
          status: 'PROGRESS',
          id: 1,
        },
      ],
    });
  });

  it('returns correct state on UPDATE_DASHBOARD_TOAST', () => {
    const initialState = {
      ...defaultState,
      toast: [
        {
          title: 'Test',
          status: 'PROGRESS',
          id: 1,
        },
      ],
    };

    const action = {
      type: 'UPDATE_DASHBOARD_TOAST',
      payload: {
        itemId: 1,
        item: {
          title: 'Test',
          status: 'SUCCESS',
          id: 1,
        },
      },
    };

    const nextState = dashboardReducer(initialState, action);

    expect(nextState).toEqual({
      ...initialState,
      toast: [
        {
          title: 'Test',
          status: 'SUCCESS',
          id: 1,
        },
      ],
    });
  });

  it('returns correct state on UPDATE_DASHBOARD_TOAST if toast item to update is missing', () => {
    const initialState = {
      ...defaultState,
      toast: [
        {
          title: 'Test',
          status: 'PROGRESS',
          id: 1,
        },
      ],
    };

    const action = {
      type: 'UPDATE_DASHBOARD_TOAST',
      payload: {
        itemId: 2,
        item: {
          title: 'Test',
          status: 'SUCCESS',
          id: 1,
        },
      },
    };

    const nextState = dashboardReducer(initialState, action);

    expect(nextState).toEqual({
      ...initialState,
      toast: [
        {
          title: 'Test',
          status: 'PROGRESS',
          id: 1,
        },
      ],
    });
  });

  it('returns correct state on CLOSE_TOAST_ITEM', () => {
    const initialState = {
      ...defaultState,
      toast: [
        {
          title: 'Test',
          status: 'PROGRESS',
          id: 1,
        },
      ],
    };

    const action = {
      type: 'CLOSE_TOAST_ITEM',
      payload: {
        itemId: 1,
      },
    };

    const nextState = dashboardReducer(initialState, action);

    expect(nextState).toEqual({
      ...initialState,
      toast: [],
    });
  });

  it('returns the correct state on UPDATE_PRINT_ORIENTATION', () => {
    const initialState = {
      ...defaultState,
      activeDashboard: {
        ...defaultState.activeDashboard,
        print_orientation: 'portrait',
      },
    };

    const action = {
      type: 'UPDATE_PRINT_ORIENTATION',
      payload: {
        printOrientation: 'landscape',
      },
    };

    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      activeDashboard: {
        ...defaultState.activeDashboard,
        print_orientation: 'landscape',
      },
    });
  });

  it('returns the correct state on UPDATE_PAPER_TYPE', () => {
    const initialState = {
      ...defaultState,
      activeDashboard: {
        ...defaultState.activeDashboard,
        print_paper_size: 'a_4',
      },
    };

    const action = {
      type: 'UPDATE_PRINT_PAPER_SIZE',
      payload: {
        printPaperSize: 'us_letter',
      },
    };

    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      activeDashboard: {
        ...defaultState.activeDashboard,
        print_paper_size: 'us_letter',
      },
    });
  });

  it('returns the correct state on UPDATE_NOTES_NAME_SUCCESS', () => {
    const initialState = {
      ...defaultState,
      widgets: [
        {
          id: 1,
          widget_type: 'graph',
        },
        {
          id: 2,
          widget_type: 'annotation',
          widget: {
            name: 'Old Name',
          },
          widget_render: {
            annotations: [{ id: 123, title: 'abc' }],
          },
        },
      ],
    };
    const action = {
      type: 'UPDATE_NOTES_NAME_SUCCESS',
      payload: {
        widgetId: 2,
        widgetName: 'New Name',
      },
    };

    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      widgets: [
        {
          id: 1,
          widget_type: 'graph',
        },
        {
          id: 2,
          widget_type: 'annotation',
          widget: {
            name: 'New Name',
          },
          widget_render: {
            annotations: [{ id: 123, title: 'abc' }],
          },
        },
      ],
    });
  });

  it('returns the correct state on SET_COLUMN_WIDTH_TYPE', () => {
    const getWidgets = (widthType) => ({
      widgets: [
        {
          cols: 6,
          rows: 2,
          horizontal_position: 0,
          vertical_position: 0,
          id: 9,
          widget: {},
          widget_render: {},
          widget_type: 'header',
        },
        {
          cols: 6,
          rows: 2,
          horizontal_position: 0,
          vertical_position: 0,
          id: 10,
          widget: {
            id: 902,
            name: 'Test: Comparison Table dsdsd',
            table_container: {
              id: 123,
              config: {
                table_type: 'COMPARISON',
                show_summary: true,
                column_width_type: widthType,
              },
              definitions: [],
              columns: [],
              population: {
                athletes: [],
                positions: [],
                position_groups: [],
                squads: [],
                applies_to_squad: true,
                all_squads: false,
              },
              table_metrics: [],
              time_scopes: [],
            },
          },
          widget_render: {},
          widget_type: 'table',
        },
      ],
    });

    const initialState = {
      ...defaultState,
      ...getWidgets('FIT_TO_WIDTH'),
    };

    const action = {
      type: 'SET_COLUMN_WIDTH_TYPE',
      payload: {
        widgetId: 10,
        columnWidthType: 'NARROW',
      },
    };

    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      ...getWidgets('NARROW'),
    });
  });

  it('returns the correct state on SET_TABLE_SORT_ORDER', () => {
    const getWidgets = (columnId, order) => ({
      widgets: [
        {
          cols: 6,
          rows: 2,
          horizontal_position: 0,
          vertical_position: 0,
          id: 9,
          widget: {},
          widget_render: {},
          widget_type: 'header',
        },
        {
          cols: 6,
          rows: 2,
          horizontal_position: 0,
          vertical_position: 0,
          id: 10,
          widget: {
            id: 902,
            name: 'Test: Comparison Table dsdsd',
            table_container: {
              id: 123,
              config: {
                table_type: 'COMPARISON',
                show_summary: true,
                table_sort: [
                  {
                    column_id: columnId,
                    order_direction: order,
                  },
                ],
              },
              definitions: [],
              columns: [],
              population: {
                athletes: [],
                positions: [],
                position_groups: [],
                squads: [],
                applies_to_squad: true,
                all_squads: false,
              },
              table_metrics: [],
              time_scopes: [],
            },
          },
          widget_render: {},
          widget_type: 'table',
        },
      ],
    });

    const initialState = {
      ...defaultState,
      ...getWidgets(321, 'LOW_TO_HIGH'),
    };

    const action = {
      type: 'SET_TABLE_SORT_ORDER',
      payload: {
        widgetId: 10,
        columnId: 123,
        order: 'HIGH_TO_LOW',
      },
    };

    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      ...getWidgets(123, 'HIGH_TO_LOW'),
    });
  });

  it('returns the correct state on UPDATE_COLUMN_CONFIG', () => {
    const getWidgets = () => ({
      widgets: [LONGITUDINAL_WIDGET_MOCK, COMPARISON_WIDGET_MOCK],
    });

    const initialState = {
      ...defaultState,
      ...getWidgets(),
    };

    const action = {
      type: 'UPDATE_COLUMN_CONFIG',
      payload: {
        widgetId: 42611,
        columnId: 5991,
        newConfig: {
          pivot_locked: true,
        },
      },
    };

    const expectedState = {
      ...defaultState,
      ...getWidgets(),
    };

    expectedState.widgets[1].widget.table_container.columns[0].config = {
      pivot_locked: true,
    };

    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns the correct state on UPDATE_ROW_CONFIG', () => {
    const getWidgets = () => ({
      widgets: [LONGITUDINAL_WIDGET_MOCK, COMPARISON_WIDGET_MOCK],
    });

    const initialState = {
      ...defaultState,
      ...getWidgets(),
    };

    const action = {
      type: 'UPDATE_ROW_CONFIG',
      payload: {
        widgetId: 42611,
        rowId: 75985,
        newConfig: {
          ranking_calculation: {
            direction: 'HIGH_LOW',
            type: 'RANK',
          },
        },
      },
    };

    const expectedState = {
      ...defaultState,
      ...getWidgets(),
    };

    expectedState.widgets[1].widget.table_container.rows[1].config = {
      ranking_calculation: {
        direction: 'HIGH_LOW',
        type: 'RANK',
      },
    };

    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns the correct state on SET_COLUMN_LOADING_STATUS', () => {
    const getWidgets = () => ({
      widgets: [LONGITUDINAL_WIDGET_MOCK, COMPARISON_WIDGET_MOCK],
    });

    const initialState = {
      ...defaultState,
      ...getWidgets(),
    };

    const action = {
      type: 'SET_COLUMN_LOADING_STATUS',
      payload: {
        tableContainerId: 42611,
        columnId: 5991,
        loadingStatus: 'CACHING',
      },
    };

    const expectedState = {
      ...defaultState,
      ...getWidgets(),
    };

    expectedState.widgets[1].widget.table_container.columns.find(
      (col) => col.id === action.payload.columnId
    ).loadingStatus = 'CACHING';
    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns the correct state on SET_ROW_LOADING_STATUS', () => {
    const getWidgets = () => ({
      widgets: [LONGITUDINAL_WIDGET_MOCK, SCORECARD_WIDGET_MOCK],
    });

    const initialState = {
      ...defaultState,
      ...getWidgets(),
    };

    const action = {
      type: 'SET_ROW_LOADING_STATUS',
      payload: {
        tableContainerId: 42612,
        rowId: 75986,
        loadingStatus: 'PENDING',
      },
    };

    const expectedState = {
      ...defaultState,
      ...getWidgets(),
    };

    expectedState.widgets[1].widget.table_container.rows.find(
      (row) => row.id === action.payload.rowId
    ).loadingStatus = 'PENDING';
    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns the correct state on SET_REFRESH_WIDGET_CACHE_STATUS', () => {
    const getWidgets = () => ({
      widgets: [LONGITUDINAL_WIDGET_MOCK, COMPARISON_WIDGET_MOCK],
    });

    const initialState = {
      ...defaultState,
      ...getWidgets(),
    };

    const action = {
      type: 'SET_REFRESH_WIDGET_CACHE_STATUS',
      payload: {
        tableContainerId: 42611,
        columnId: 5991,
        status: 'CACHING',
      },
    };

    const expectedState = {
      ...defaultState,
      ...getWidgets(),
    };

    expectedState.widgets[1].widget.table_container.refreshCacheStatus = true;
    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns the correct state on SET_COLUMN_CALCULATED_CACHED_AT_UPDATE', () => {
    const fixedIso = freezeTime();

    const getWidgets = () => ({
      widgets: [LONGITUDINAL_WIDGET_MOCK, COMPARISON_WIDGET_MOCK],
    });

    const initialState = {
      ...defaultState,
      ...getWidgets(),
    };

    const action = {
      type: 'SET_COLUMN_CALCULATED_CACHED_AT_UPDATE',
      payload: {
        widgetId: 42611,
        columnId: 5991,
      },
    };

    const expectedState = {
      ...defaultState,
      ...getWidgets(),
    };

    expectedState.widgets[1].widget.table_container.columns.find(
      (col) => col.id === action.payload.columnId
    ).calculatedCachedAt = fixedIso;
    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual(expectedState);
  });
  it('returns the correct state on SET_COLUMN_CALCULATED_CACHED_AT_REFRESH_CACHE', () => {
    const fixedIso = freezeTime();
    const getWidgets = () => ({
      widgets: [LONGITUDINAL_WIDGET_MOCK, COMPARISON_WIDGET_MOCK],
    });

    const initialState = {
      ...defaultState,
      ...getWidgets(),
    };

    const action = {
      type: 'SET_COLUMN_CALCULATED_CACHED_AT_REFRESH_CACHE',
      payload: {
        widgetId: 42611,
      },
    };

    const expectedState = {
      ...defaultState,
      ...getWidgets(),
    };

    expectedState.widgets[1].widget.table_container.columns =
      expectedState.widgets[1].widget.table_container.columns.map((col) => {
        return {
          ...col,
          calculatedCachedAt: fixedIso,
        };
      });
    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns the correct state on SET_ROW_CALCULATED_CACHED_AT_UPDATE', () => {
    const fixedIso = freezeTime();
    const getWidgets = () => ({
      widgets: [LONGITUDINAL_WIDGET_MOCK, SCORECARD_WIDGET_MOCK],
    });

    const initialState = {
      ...defaultState,
      ...getWidgets(),
    };

    const action = {
      type: 'SET_ROW_CALCULATED_CACHED_AT_UPDATE',
      payload: {
        widgetId: 42612,
        rowId: 75986,
      },
    };

    const expectedState = {
      ...defaultState,
      ...getWidgets(),
    };

    expectedState.widgets[1].widget.table_container.rows.find(
      (row) => row.id === action.payload.rowId
    ).calculatedCachedAt = fixedIso;
    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns the correct state on SET_ROW_CALCULATED_CACHED_AT_REFRESH_CACHE', () => {
    const fixedIso = freezeTime();
    const getWidgets = () => ({
      widgets: [LONGITUDINAL_WIDGET_MOCK, SCORECARD_WIDGET_MOCK],
    });

    const initialState = {
      ...defaultState,
      ...getWidgets(),
    };

    const action = {
      type: 'SET_ROW_CALCULATED_CACHED_AT_REFRESH_CACHE',
      payload: {
        widgetId: 42612,
      },
    };

    const expectedState = {
      ...defaultState,
      ...getWidgets(),
    };

    expectedState.widgets[1].widget.table_container.rows =
      expectedState.widgets[1].widget.table_container.rows.map((row) => {
        return {
          ...row,
          calculatedCachedAt: fixedIso,
        };
      });
    const nextState = dashboardReducer(initialState, action);
    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on SET_CODING_SYSTEM_KEY', () => {
    const action = {
      type: 'SET_CODING_SYSTEM_KEY',
      payload: {
        codingSystemKey: 'coding_system_key',
      },
    };
    const nextState = dashboardReducer(defaultState, action);
    expect(nextState).toEqual({
      ...defaultState,
      codingSystemKey: 'coding_system_key',
    });
  });
});
