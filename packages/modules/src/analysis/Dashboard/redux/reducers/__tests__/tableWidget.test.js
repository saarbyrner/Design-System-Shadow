import { DATA_SOURCE_TYPES } from '@kitman/modules/src/analysis/Dashboard/components/types';
import tableWidgetReducer from '../tableWidget';

describe('analyticalDashboard - tableWidget reducer', () => {
  const defaultState = {};

  it('returns the correct state on ADD_TABLE_ROW_LOADING', () => {
    const initialState = {
      ...defaultState,
      status: null,
    };

    const action = {
      type: 'ADD_TABLE_ROW_LOADING',
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      status: 'loading',
    });
  });

  it('returns the correct state on ADD_TABLE_ROW_FAILURE', () => {
    const initialState = {
      ...defaultState,
      status: null,
    };

    const action = {
      type: 'ADD_TABLE_ROW_FAILURE',
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      status: 'error',
    });
  });

  it('returns the correct state on ADD_TABLE_COLUMN_LOADING', () => {
    const initialState = {
      ...defaultState,
      status: null,
    };

    const action = {
      type: 'ADD_TABLE_COLUMN_LOADING',
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      status: 'loading',
    });
  });

  it('returns the correct state on ADD_TABLE_COLUMN_FAILURE', () => {
    const initialState = {
      ...defaultState,
      status: null,
    };

    const action = {
      type: 'ADD_TABLE_COLUMN_FAILURE',
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      status: 'error',
    });
  });

  it('returns the correct state on DELETE_TABLE_COLUMN_LOADING', () => {
    const initialState = {
      ...defaultState,
      status: null,
    };

    const action = {
      type: 'DELETE_TABLE_COLUMN_LOADING',
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      status: 'loading',
    });
  });

  it('returns the correct state on EDIT_TABLE_COLUMN_LOADING', () => {
    const initialState = {
      ...defaultState,
      status: null,
    };

    const action = {
      type: 'EDIT_TABLE_COLUMN_LOADING',
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      status: 'loading',
    });
  });

  it('returns the correct state on DELETE_TABLE_COLUMN_FAILURE', () => {
    const initialState = {
      ...defaultState,
      status: null,
    };

    const action = {
      type: 'DELETE_TABLE_COLUMN_FAILURE',
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      status: 'error',
    });
  });

  it('returns the correct state on EDIT_TABLE_COLUMN_FAILURE', () => {
    const initialState = {
      ...defaultState,
      status: null,
    };

    const action = {
      type: 'EDIT_TABLE_COLUMN_FAILURE',
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      status: 'error',
    });
  });

  it('returns the correct state on SAVE_TABLE_FORMATTING_LOADING', () => {
    const initialState = {
      ...defaultState,
      status: null,
    };

    const action = {
      type: 'SAVE_TABLE_FORMATTING_LOADING',
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      status: 'loading',
    });
  });

  it('returns the correct state on SAVE_SCORECARD_TABLE_FORMATTING_SUCCESS', () => {
    const initialState = {
      ...defaultState,
      status: 'loading',
      appliedMetrics: [
        {
          id: 1,
          name: 'Reducer Test',
          source: 'kitman:tv',
          variable: 'testVariable',
        },
      ],
      formattingPanel: {
        formattableId: 1,
      },
    };

    const action = {
      type: 'SAVE_SCORECARD_TABLE_FORMATTING_SUCCESS',
      payload: {
        appliedRules: [
          {
            type: 'numeric',
            condition: 'greater_than',
            value: 9,
            color: '#123dfd',
          },
        ],
      },
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      status: null,
      appliedMetrics: [
        {
          id: 1,
          name: 'Reducer Test',
          source: 'kitman:tv',
          variable: 'testVariable',
          config: {
            conditional_formatting: [
              {
                type: 'numeric',
                condition: 'greater_than',
                value: 9,
                color: '#123dfd',
              },
            ],
          },
        },
      ],
      formattingPanel: {
        formattableId: 1,
      },
    });
  });

  it('returns the correct state on SAVE_TABLE_FORMATTING_FAILURE', () => {
    const initialState = {
      ...defaultState,
      status: null,
    };

    const action = {
      type: 'SAVE_TABLE_FORMATTING_FAILURE',
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      status: 'error',
    });
  });

  it('returns the correct state on CHANGE_COLUMN_SUMMARY_LOADING', () => {
    const initialState = {
      ...defaultState,
      status: null,
    };

    const action = {
      type: 'CHANGE_COLUMN_SUMMARY_LOADING',
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      status: 'loading',
    });
  });

  it('returns the correct state on CHANGE_COLUMN_SUMMARY_SUCCESS', () => {
    const initialState = {
      ...defaultState,
      status: 'loading',
      appliedColumns: [],
    };

    const action = {
      type: 'CHANGE_COLUMN_SUMMARY_SUCCESS',
      payload: {
        existingTableColumns: [
          {
            id: 1,
            name: 'Reducer Test',
            metric: { key_name: 'kitman|blah|test' },
            config: {
              conditional_formatting: [
                {
                  type: 'numeric',
                  condition: 'greater_than',
                  value: 9,
                  color: '#123dfd',
                },
              ],
            },
          },
        ],
        columnId: 1,
        summaryCalc: 'max',
      },
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      status: null,
      appliedColumns: [
        {
          id: 1,
          name: 'Reducer Test',
          metric: { key_name: 'kitman|blah|test' },
          config: {
            conditional_formatting: [
              {
                type: 'numeric',
                condition: 'greater_than',
                value: 9,
                color: '#123dfd',
              },
            ],
            summary_calculation: 'max',
          },
        },
      ],
    });
  });

  it('returns the correct state on CHANGE_COLUMN_SUMMARY_FAILURE', () => {
    const initialState = {
      ...defaultState,
      status: null,
    };

    const action = {
      type: 'CHANGE_COLUMN_SUMMARY_FAILURE',
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      status: 'error',
    });
  });

  it('returns the correct state on LOCK_COLUMN_PIVOT_LOADING', () => {
    const initialState = {
      ...defaultState,
      status: null,
    };

    const action = {
      type: 'LOCK_COLUMN_PIVOT_LOADING',
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      status: 'loading',
    });
  });

  it('returns the correct state on LOCK_COLUMN_PIVOT_FAILURE', () => {
    const initialState = {
      ...defaultState,
      status: null,
    };

    const action = {
      type: 'LOCK_COLUMN_PIVOT_FAILURE',
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      status: 'error',
    });
  });

  it('returns the correct state on CHANGE_ROW_SUMMARY_LOADING', () => {
    const initialState = {
      ...defaultState,
      status: null,
    };

    const action = {
      type: 'CHANGE_ROW_SUMMARY_LOADING',
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      status: 'loading',
    });
  });

  it('returns the correct state on CHANGE_ROW_SUMMARY_SUCCESS', () => {
    const initialState = {
      ...defaultState,
      status: 'loading',
    };

    const action = {
      type: 'CHANGE_ROW_SUMMARY_SUCCESS',
      payload: {
        existingTableRows: [
          {
            config: {
              conditional_formatting: [
                {
                  type: 'numeric',
                  condition: 'greater_than',
                  value: 9,
                  color: '#123dfd',
                },
              ],
            },
            id: 1,
            name: 'test row',
            metric: {
              key_name: 'combination|%_difference',
              name: '% Difference',
              description: 'combination',
            },
            summary: 'mean',
            time_scope: {
              time_period: 'today',
            },
          },
        ],
        rowId: 1,
        summaryCalc: 'max',
      },
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      status: null,
    });
  });

  it('returns the correct state on CHANGE_ROW_SUMMARY_FAILURE', () => {
    const initialState = {
      ...defaultState,
      status: null,
    };

    const action = {
      type: 'CHANGE_ROW_SUMMARY_FAILURE',
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      status: 'error',
    });
  });

  it('returns the correct state on OPEN_TABLE_COLUMN_FORMATTING_PANEL', () => {
    const initialState = {
      ...defaultState,
      formattingPanel: {
        formattableId: null,
        panelName: null,
        ruleUnit: null,
        appliedFormat: [],
      },
      tableContainerId: 1234,
      tableType: null,
      widgetId: null,
    };

    const action = {
      type: 'OPEN_TABLE_COLUMN_FORMATTING_PANEL',
      payload: {
        existingTableColumns: [
          {
            id: 1,
            name: 'Reducer Test',
            metric: { key_name: 'kitman|blah|test' },
          },
        ],
        tableContainerId: 999,
        tableType: 'COMPARISON',
        columnId: 1,
        columnName: 'Fatigue',
        columnUnit: 'mins',
        widgetId: 123,
        appliedFormat: [],
      },
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      appliedColumns: [
        {
          id: 1,
          name: 'Reducer Test',
          metric: { key_name: 'kitman|blah|test' },
        },
      ],
      formattingPanel: {
        formattableId: 1,
        panelName: 'Fatigue',
        ruleUnit: 'mins',
        appliedFormat: [],
      },
      tableContainerId: 999,
      tableType: 'COMPARISON',
      widgetId: 123,
    });
  });

  it('returns the correct state on OPEN_SCORECARD_TABLE_FORMATTING_PANEL', () => {
    const initialState = {
      ...defaultState,
      formattingPanel: {
        formattableId: null,
        panelName: null,
        ruleUnit: null,
        appliedFormat: [],
      },
      tableContainerId: 1234,
      widgetId: null,
    };

    const action = {
      type: 'OPEN_SCORECARD_TABLE_FORMATTING_PANEL',
      payload: {
        existingTableMetrics: [
          {
            id: 1,
            name: 'Reducer Test',
            source: 'kitman:tv',
            variable: 'tests',
          },
        ],
        tableContainerId: 999,
        rowMetricId: 1,
        metricName: 'Fatigue',
        metricUnit: 'mins',
        widgetId: 123,
        appliedFormat: [],
      },
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      appliedMetrics: [
        {
          id: 1,
          name: 'Reducer Test',
          source: 'kitman:tv',
          variable: 'tests',
        },
      ],
      formattingPanel: {
        formattableId: 1,
        panelName: 'Fatigue',
        ruleUnit: 'mins',
        appliedFormat: [],
      },
      tableContainerId: 999,
      tableType: 'SCORECARD',
      widgetId: 123,
    });
  });

  it('returns the correct state on UPDATE_FORMATTING_RULE_TYPE', () => {
    const initialState = {
      ...defaultState,
      formattingPanel: {
        formattableId: 1,
        panelName: 'Fatigue',
        ruleUnit: 'mins',
        widgetId: 123,
        appliedFormat: [
          { type: null, condition: null, value: null, color: '#f3d2d5' },
        ],
      },
    };

    const action = {
      type: 'UPDATE_FORMATTING_RULE_TYPE',
      payload: {
        type: 'numeric',
        index: 0,
      },
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      formattingPanel: {
        formattableId: 1,
        panelName: 'Fatigue',
        ruleUnit: 'mins',
        widgetId: 123,
        appliedFormat: [
          { type: 'numeric', condition: null, value: null, color: '#f3d2d5' },
        ],
      },
    });
  });

  it('returns the correct state on UPDATE_FORMATTING_RULE_CONDITION', () => {
    const initialState = {
      ...defaultState,
      formattingPanel: {
        formattableId: 1,
        panelName: 'Fatigue',
        ruleUnit: 'mins',
        widgetId: 123,
        appliedFormat: [
          { type: null, condition: null, value: null, color: '#f3d2d5' },
        ],
      },
    };

    const action = {
      type: 'UPDATE_FORMATTING_RULE_CONDITION',
      payload: {
        condition: 'greater_than',
        index: 0,
      },
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      formattingPanel: {
        formattableId: 1,
        panelName: 'Fatigue',
        ruleUnit: 'mins',
        widgetId: 123,
        appliedFormat: [
          {
            type: null,
            condition: 'greater_than',
            value: null,
            color: '#f3d2d5',
          },
        ],
      },
    });
  });

  it('returns the correct state on UPDATE_FORMATTING_RULE_VALUE', () => {
    const initialState = {
      ...defaultState,
      formattingPanel: {
        formattableId: 1,
        panelName: 'Fatigue',
        ruleUnit: 'mins',
        widgetId: 123,
        appliedFormat: [
          { type: null, condition: null, value: null, color: '#f3d2d5' },
        ],
      },
    };

    const action = {
      type: 'UPDATE_FORMATTING_RULE_VALUE',
      payload: {
        value: 900,
        index: 0,
      },
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      formattingPanel: {
        formattableId: 1,
        panelName: 'Fatigue',
        ruleUnit: 'mins',
        widgetId: 123,
        appliedFormat: [
          {
            type: null,
            condition: null,
            value: 900,
            color: '#f3d2d5',
          },
        ],
      },
    });
  });

  it('returns the correct state on UPDATE_FORMATTING_RULE_COLOR', () => {
    const initialState = {
      ...defaultState,
      formattingPanel: {
        formattableId: 1,
        panelName: 'Fatigue',
        ruleUnit: 'mins',
        widgetId: 123,
        appliedFormat: [
          { type: null, condition: null, value: null, color: '#f3d2d5' },
        ],
      },
    };

    const action = {
      type: 'UPDATE_FORMATTING_RULE_COLOR',
      payload: {
        color: '#000000',
        index: 0,
      },
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      formattingPanel: {
        formattableId: 1,
        panelName: 'Fatigue',
        ruleUnit: 'mins',
        widgetId: 123,
        appliedFormat: [
          {
            type: null,
            condition: null,
            value: null,
            color: '#000000',
          },
        ],
      },
    });
  });

  it('returns the correct state on ADD_FORMATTING_RULE', () => {
    const initialState = {
      ...defaultState,
      formattingPanel: {
        formattableId: 1,
        panelName: 'Fatigue',
        ruleUnit: 'mins',
        widgetId: 123,
        appliedFormat: [
          {
            type: 'numeric',
            condition: 'less_than',
            value: 901,
            color: '#000000',
          },
        ],
      },
    };

    const action = {
      type: 'ADD_FORMATTING_RULE',
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      formattingPanel: {
        formattableId: 1,
        panelName: 'Fatigue',
        ruleUnit: 'mins',
        widgetId: 123,
        appliedFormat: [
          {
            type: 'numeric',
            condition: 'less_than',
            value: 901,
            color: '#000000',
          },
          {
            type: 'numeric',
            condition: null,
            value: null,
            color: '#f3d2d5',
          },
        ],
      },
    });
  });

  it('returns the correct state on REMOVE_FORMATTING_RULE', () => {
    const initialState = {
      ...defaultState,
      formattingPanel: {
        formattableId: 1,
        panelName: 'Fatigue',
        ruleUnit: 'mins',
        widgetId: 123,
        appliedFormat: [
          {
            type: 'numeric',
            condition: 'less_than',
            value: 901,
            color: '#000000',
          },
          {
            type: 'numeric',
            condition: null,
            value: null,
            color: '#f3d2d5',
          },
        ],
      },
    };

    const action = {
      type: 'REMOVE_FORMATTING_RULE',
      payload: {
        index: 0,
      },
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      formattingPanel: {
        formattableId: 1,
        panelName: 'Fatigue',
        ruleUnit: 'mins',
        widgetId: 123,
        appliedFormat: [
          {
            type: 'numeric',
            condition: null,
            value: null,
            color: '#f3d2d5',
          },
        ],
      },
    });
  });

  it('returns the correct state on OPEN_TABLE_COLUMN_PANEL', () => {
    const initialState = {
      ...defaultState,
      appliedColumns: [],
      appliedRows: [],
      columnPanel: {
        source: 'metric',
        isEditMode: true,
      },
      tableContainerId: 1234,
      tableName: '',
      tableType: '',
      showSummary: true,
      widgetId: null,
    };

    const action = {
      type: 'OPEN_TABLE_COLUMN_PANEL',
      payload: {
        source: 'metric',
        existingTableColumns: [
          { name: 'Reducer Test', metric: { key_name: 'kitman|blah|test' } },
        ],
        existingTableRows: [
          {
            id: 1,
            name: 'test row',
            metric: {
              key_name: 'combination|%_difference',
              name: '% Difference',
              description: 'combination',
            },
            summary: 'mean',
            time_scope: {
              time_period: 'today',
            },
            population: {
              applies_to_squad: false,
              position_groups: [123],
              positions: [],
              athletes: [],
              all_squads: false,
              squads: [],
            },
          },
        ],
        tableContainerId: 1234,
        tableName: 'Table Name',
        tableType: 'COMPARISON',
        showSummary: true,
        widgetId: 123,
      },
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      appliedColumns: [
        { name: 'Reducer Test', metric: { key_name: 'kitman|blah|test' } },
      ],
      appliedRows: [
        {
          id: 1,
          name: 'test row',
          metric: {
            key_name: 'combination|%_difference',
            name: '% Difference',
            description: 'combination',
          },
          summary: 'mean',
          time_scope: {
            time_period: 'today',
          },
          population: {
            applies_to_squad: false,
            position_groups: [123],
            positions: [],
            athletes: [],
            all_squads: false,
            squads: [],
          },
        },
      ],
      columnPanel: {
        calculation: '',
        dataSource: {},
        source: 'metric',
        isEditMode: false,
      },
      tableContainerId: 1234,
      tableName: 'Table Name',
      tableType: 'COMPARISON',
      showSummary: true,
      widgetId: 123,
    });
  });

  it('returns the correct state on OPEN_TABLE_ROW_PANEL', () => {
    const initialState = {
      ...defaultState,
      rowPanel: {},
      appliedColumns: [],
      appliedRows: [],
      tableContainerId: null,
      tableName: '',
      tableType: '',
      showSummary: false,
      widgetId: null,
    };

    const action = {
      type: 'OPEN_TABLE_ROW_PANEL',
      payload: {
        source: 'metric',
        existingTableColumns: [
          { name: 'Reducer Test', metric: { key_name: 'kitman|blah|test' } },
        ],
        existingTableRows: [
          {
            id: 1,
            name: 'test row',
            metric: {
              key_name: 'combination|%_difference',
              name: '% Difference',
              description: 'combination',
            },
            population: {
              applies_to_squad: false,
              position_groups: [123],
              positions: [],
              athletes: [],
              all_squads: false,
              squads: [],
            },
            summary: 'mean',
            time_scope: {
              time_period: 'today',
            },
          },
        ],
        tableContainerId: 1234,
        tableName: 'Table Name',
        tableType: 'SCORECARD',
        showSummary: false,
        widgetId: 9,
      },
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      appliedColumns: [
        { name: 'Reducer Test', metric: { key_name: 'kitman|blah|test' } },
      ],
      appliedRows: [
        {
          id: 1,
          name: 'test row',
          metric: {
            key_name: 'combination|%_difference',
            name: '% Difference',
            description: 'combination',
          },
          population: {
            applies_to_squad: false,
            position_groups: [123],
            positions: [],
            athletes: [],
            all_squads: false,
            squads: [],
          },
          summary: 'mean',
          time_scope: {
            time_period: 'today',
          },
        },
      ],
      tableContainerId: 1234,
      tableName: 'Table Name',
      tableType: 'SCORECARD',
      rowPanel: {
        source: 'metric',
        isEditMode: false,
        calculation: '',
        dataSource: {},
      },
      showSummary: false,
      widgetId: 9,
    });
  });

  it('returns the correct state on EDIT_COMPARISON_TABLE_COLUMN', () => {
    const initialState = {
      ...defaultState,
      appliedColumns: [],
      appliedRows: [],
      columnPanel: {},
    };

    const action = {
      type: 'EDIT_COMPARISON_TABLE_COLUMN',
      payload: {
        existingTableColumns: [
          { name: 'Reducer Test', metric: { key_name: 'kitman|blah|test' } },
        ],
        columnDetails: {
          id: 555,
          table_element: {
            calculation: 'sum',
            config: {
              calculation_params: {
                comparative_period: 2,
              },
            },
            data_source: {
              type: 'ParticipationLevel',
              source: 'participation',
              variable: 'variable',
              status: undefined,
              id: null,
              ids: [1, 2, 3],
              involvement_event_type: 'game',
            },
          },
          name: 'Test',
          time_scope: {
            time_period: 'today',
          },
        },
        tableContainerId: 134,
        tableType: 'COMPARISON',
        widgetId: 9013,
      },
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      appliedColumns: [
        { name: 'Reducer Test', metric: { key_name: 'kitman|blah|test' } },
      ],
      appliedRows: [],
      columnPanel: {
        columnId: 555,
        isEditMode: true,
        filters: {},
        dataSource: {
          type: 'ParticipationLevel',
          subtypes: {},
          key_name: 'participation|variable',
          source: 'participation',
          variable: 'variable',
          status: 'game_involvement',
          id: null,
          ids: [1, 2, 3],
          kinds: undefined,
          result: undefined,
          position_ids: undefined,
          formation_ids: undefined,
          event: 'game',
        },
        name: 'Test',
        source: 'participation',
        calculation: 'sum',
        calculation_params: {
          comparative_period: 2,
        },
        tableElement: {
          calculation: 'sum',
          data_source: {
            source: 'participation',
            type: 'ParticipationLevel',
            variable: 'variable',
            status: undefined,
            id: null,
            ids: [1, 2, 3],
            involvement_event_type: 'game',
          },
          config: {
            calculation_params: {
              comparative_period: 2,
            },
          },
        },
        time_scope: {
          time_period: 'today',
        },
      },
      tableContainerId: 134,
      tableType: 'COMPARISON',
      widgetId: 9013,
    });
  });

  it('returns the correct state on EDIT_COMPARISON_TABLE_COLUMN with medical datasource', () => {
    const initialState = {
      ...defaultState,
      appliedColumns: [],
      appliedRows: [],
      columnPanel: {},
    };

    const action = {
      type: 'EDIT_COMPARISON_TABLE_COLUMN',
      payload: {
        existingTableColumns: [
          { name: 'Reducer Test', metric: { key_name: 'kitman|blah|test' } },
        ],
        columnDetails: {
          id: 555,
          table_element: {
            calculation: 'sum',
            config: {
              calculation_params: {
                comparative_period: 2,
              },
            },
            data_source: {
              type: 'RehabSessionExercise',
              source: 'source',
              variable: 'variable',
              id: null,
            },
          },
          name: 'Test',
          time_scope: {
            time_period: 'today',
          },
        },
        tableContainerId: 134,
        tableType: 'COMPARISON',
        widgetId: 9013,
      },
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      appliedColumns: [
        { name: 'Reducer Test', metric: { key_name: 'kitman|blah|test' } },
      ],
      appliedRows: [],
      columnPanel: {
        columnId: 555,
        isEditMode: true,
        filters: {},
        dataSource: {
          event: undefined,
          ids: undefined,
          status: undefined,
          type: 'RehabSessionExercise',
          subtypes: {},
          key_name: 'source|variable',
          variable: 'variable',
          source: 'source',
          id: null,
          kinds: undefined,
          result: undefined,
          position_ids: undefined,
          formation_ids: undefined,
        },
        name: 'Test',
        source: 'medical',
        calculation: 'sum',
        calculation_params: {
          comparative_period: 2,
        },
        tableElement: {
          calculation: 'sum',
          data_source: {
            id: null,
            source: 'source',
            type: 'RehabSessionExercise',
            variable: 'variable',
          },
          config: {
            calculation_params: {
              comparative_period: 2,
            },
          },
        },
        time_scope: {
          time_period: 'today',
        },
      },
      tableContainerId: 134,
      tableType: 'COMPARISON',
      widgetId: 9013,
    });
  });

  it('returns the correct state on EDIT_SCORECARD_TABLE_COLUMN', () => {
    const initialState = {
      ...defaultState,
      appliedColumns: [],
      columnPanel: {},
    };

    const action = {
      type: 'EDIT_SCORECARD_TABLE_COLUMN',
      payload: {
        existingTableColumns: [
          { name: 'Reducer Test', metric: { key_name: 'kitman|blah|test' } },
        ],
        columnDetails: {
          id: 555,
          population: {
            applies_to_squad: false,
            position_groups: [],
            positions: [123],
            athletes: [],
            all_squads: false,
            squads: [],
          },
          name: 'Test',
          time_scope: {
            time_period: 'today',
          },
        },
        tableContainerId: 134,
        tableType: 'SCORECARD',
        widgetId: 9013,
      },
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      appliedColumns: [
        { name: 'Reducer Test', metric: { key_name: 'kitman|blah|test' } },
      ],
      columnPanel: {
        columnId: 555,
        isEditMode: true,
        population: {
          applies_to_squad: false,
          position_groups: [],
          positions: [123],
          athletes: [],
          all_squads: false,
          squads: [],
        },
        name: 'Test',
        time_scope: {
          time_period: 'today',
        },
      },
      tableContainerId: 134,
      tableType: 'SCORECARD',
      widgetId: 9013,
    });
  });

  it('returns the correct state on EDIT_LONGITUDINAL_TABLE_COLUMN', () => {
    const initialState = {
      ...defaultState,
      appliedColumns: [],
      appliedRows: [],
      columnPanel: {},
    };

    const action = {
      type: 'EDIT_LONGITUDINAL_TABLE_COLUMN',
      payload: {
        existingTableColumns: [
          { name: 'Reducer Test', metric: { key_name: 'kitman|blah|test' } },
        ],
        columnDetails: {
          id: 555,
          name: 'Test',
          population: null,
          table_element: {
            calculation: 'sum',
            data_source: {
              type: 'TableMetric',
              source: 'source',
              variable: 'variable',
              status: 'available',
              id: null,
              ids: [1, 2, 4],
            },
            config: {
              calculation_params: {
                comparative_period: 2,
              },
            },
          },
          time_scope: {
            time_period: 'today',
          },
        },
        tableContainerId: 134,
        tableType: 'LONGITUDINAL',
        widgetId: 9013,
      },
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      appliedColumns: [
        { name: 'Reducer Test', metric: { key_name: 'kitman|blah|test' } },
      ],
      appliedRows: [],
      columnPanel: {
        source: 'metric',
        calculation: 'sum',
        calculation_params: {
          comparative_period: 2,
        },
        columnId: 555,
        isEditMode: true,
        dataSource: {
          type: 'TableMetric',
          subtypes: {},
          key_name: 'source|variable',
          source: 'source',
          variable: 'variable',
          status: 'available',
          id: null,
          ids: [1, 2, 4],
          kinds: undefined,
          result: undefined,
          position_ids: undefined,
          formation_ids: undefined,
          event: undefined,
        },
        filters: {},
        name: 'Test',
        population: null,
      },
      tableContainerId: 134,
      tableType: 'LONGITUDINAL',
      widgetId: 9013,
    });
  });

  it('returns the correct state on EDIT_LONGITUDINAL_TABLE_COLUMN with medical datasource', () => {
    const initialState = {
      ...defaultState,
      appliedColumns: [],
      appliedRows: [],
      columnPanel: {},
    };

    const action = {
      type: 'EDIT_LONGITUDINAL_TABLE_COLUMN',
      payload: {
        existingTableColumns: [
          { name: 'Reducer Test', metric: { key_name: 'kitman|blah|test' } },
        ],
        columnDetails: {
          id: 555,
          name: 'Test',
          population: null,
          table_element: {
            calculation: 'sum',
            data_source: {
              type: 'RehabSessionExercise',
              source: 'source',
              variable: 'variable',
              status: null,
              id: null,
              ids: null,
            },
            config: {
              calculation_params: {
                comparative_period: 2,
              },
            },
          },
          time_scope: {
            time_period: 'today',
          },
        },
        tableContainerId: 134,
        tableType: 'LONGITUDINAL',
        widgetId: 9013,
      },
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      appliedColumns: [
        { name: 'Reducer Test', metric: { key_name: 'kitman|blah|test' } },
      ],
      appliedRows: [],
      columnPanel: {
        source: 'medical',
        calculation: 'sum',
        calculation_params: {
          comparative_period: 2,
        },
        columnId: 555,
        isEditMode: true,
        dataSource: {
          type: 'RehabSessionExercise',
          subtypes: {},
          key_name: 'source|variable',
          source: 'source',
          variable: 'variable',
          status: null,
          id: null,
          ids: null,
          kinds: undefined,
          result: undefined,
          position_ids: undefined,
          formation_ids: undefined,
          event: undefined,
        },
        filters: {},
        name: 'Test',
        population: null,
      },
      tableContainerId: 134,
      tableType: 'LONGITUDINAL',
      widgetId: 9013,
    });
  });

  it('returns the correct state on EDIT_TABLE_ROW', () => {
    const initialState = {
      ...defaultState,
      rowPanel: {},
    };

    const action = {
      type: 'EDIT_TABLE_ROW',
      payload: {
        row: {
          id: 1,
          name: 'test row',
          population: {
            applies_to_squad: false,
            position_groups: [],
            positions: [123],
            athletes: [],
            all_squads: false,
            squads: [],
          },
          table_element: {
            calculation: 'mean',
            data_source: {
              type: 'TableMetric',
              source: 'testing',
              variable: 'variable',
              status: 'available',
              id: null,
              ids: [1, 2, 3],
            },
            config: {
              calculation_params: {
                comparative_period: 2,
              },
            },
            name: 'Testing 123',
          },
          time_scope: {
            time_period: 'today',
          },
        },
        tableContainerId: 183,
        tableType: 'SCORECARD',
        widgetId: 9013,
      },
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      rowPanel: {
        calculation: 'mean',
        calculation_params: {
          comparative_period: 2,
        },
        isEditMode: true,
        rowId: 1,
        source: 'metric',
        dataSource: {
          key_name: 'testing|variable',
          name: 'Testing 123',
          source: 'testing',
          variable: 'variable',
          type: 'TableMetric',
          subtypes: {},
          status: 'available',
          id: null,
          ids: [1, 2, 3],
          kinds: undefined,
          result: undefined,
          position_ids: undefined,
          formation_ids: undefined,
          event: undefined,
        },
        population: [
          {
            applies_to_squad: false,
            position_groups: [],
            positions: [123],
            athletes: [],
            all_squads: false,
            squads: [],
          },
        ],
        time_scope: {
          time_period: 'today',
        },
        filters: {},
        config: {},
      },
      tableContainerId: 183,
      tableType: 'SCORECARD',
      widgetId: 9013,
    });
  });

  it('returns the correct state on EDIT_TABLE_ROW with medical datasource', () => {
    const initialState = {
      ...defaultState,
      rowPanel: {},
    };

    const action = {
      type: 'EDIT_TABLE_ROW',
      payload: {
        row: {
          id: 1,
          name: 'test row',
          population: {
            applies_to_squad: false,
            position_groups: [],
            positions: [123],
            athletes: [],
            all_squads: false,
            squads: [],
          },
          table_element: {
            calculation: 'mean',
            data_source: {
              type: 'RehabSessionExercise',
              source: 'testing',
              variable: 'variable',
              status: 'available',
              id: null,
              ids: [1, 2, 3],
            },
            config: {
              calculation_params: {
                comparative_period: 2,
              },
            },
            name: 'Testing 123',
          },
          time_scope: {
            time_period: 'today',
          },
        },
        tableContainerId: 183,
        tableType: 'SCORECARD',
        widgetId: 9013,
      },
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      rowPanel: {
        calculation: 'mean',
        calculation_params: {
          comparative_period: 2,
        },
        isEditMode: true,
        rowId: 1,
        source: 'medical',
        dataSource: {
          key_name: 'testing|variable',
          name: 'Testing 123',
          source: 'testing',
          variable: 'variable',
          type: 'RehabSessionExercise',
          subtypes: {},
          status: 'available',
          id: null,
          ids: [1, 2, 3],
          kinds: undefined,
          result: undefined,
          position_ids: undefined,
          formation_ids: undefined,
          event: undefined,
        },
        population: [
          {
            applies_to_squad: false,
            position_groups: [],
            positions: [123],
            athletes: [],
            all_squads: false,
            squads: [],
          },
        ],
        time_scope: {
          time_period: 'today',
        },
        filters: {},
        config: {},
      },
      tableContainerId: 183,
      tableType: 'SCORECARD',
      widgetId: 9013,
    });
  });

  it('returns the correct state on SET_TABLE_COLUMN_CALCULATION', () => {
    const initialState = {
      ...defaultState,
      columnPanel: {},
    };

    const action = {
      type: 'SET_TABLE_COLUMN_CALCULATION',
      payload: {
        calculation: 'mean',
      },
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      columnPanel: {
        calculation: 'mean',
      },
    });
  });

  it('returns the correct state on SET_TABLE_COLUMN_CALCULATION_PARAM', () => {
    const initialState = {
      ...defaultState,
      columnPanel: {},
    };

    const action = {
      type: 'SET_TABLE_COLUMN_CALCULATION_PARAM',
      payload: {
        calculationParam: 'time_period',
        value: 'last',
      },
    };

    const firstState = tableWidgetReducer(initialState, action);
    expect(firstState).toEqual({
      ...defaultState,
      columnPanel: {
        calculation_params: {
          time_period: 'last',
        },
      },
    });

    const secondState = tableWidgetReducer(initialState, {
      type: 'SET_TABLE_COLUMN_CALCULATION_PARAM',
      payload: {
        calculationParam: 'time_period_length',
        value: 2,
      },
    });
    expect(secondState).toEqual({
      ...defaultState,
      columnPanel: {
        calculation_params: {
          time_period_length: 2,
        },
      },
    });
  });

  it('returns the correct state on SET_TABLE_COLUMN_DATE_RANGE', () => {
    const initialState = {
      ...defaultState,
      columnPanel: {},
    };

    const action = {
      type: 'SET_TABLE_COLUMN_DATE_RANGE',
      payload: {
        range: {
          start_date: '20/8/20',
          end_date: '23/8/20',
        },
      },
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      columnPanel: {
        time_scope: {
          start_time: '20/8/20',
          end_time: '23/8/20',
        },
      },
    });
  });

  it('returns the correct state on SET_TABLE_COLUMN_METRICS', () => {
    const initialState = {
      ...defaultState,
      columnPanel: {},
    };

    const action = {
      type: 'SET_TABLE_COLUMN_METRICS',
      payload: {
        metric: [{ key_name: 'test|Metric', name: 'Test Metric' }],
      },
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      columnPanel: {
        dataSource: {
          key_name: 'test|Metric',
          source: 'test',
          variable: 'Metric',
          type: 'TableMetric',
        },
        name: 'Test Metric',
      },
    });
  });

  it('returns the correct state on SET_TABLE_COLUMN_ACTIVITY', () => {
    const initialState = {
      ...defaultState,
      columnPanel: {},
    };

    const action = {
      type: 'SET_TABLE_COLUMN_ACTIVITY',
      payload: {
        ids: [123],
        type: 'Principle',
      },
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      columnPanel: {
        dataSource: {
          ids: [123],
          type: 'Principle',
        },
      },
    });
  });

  it('returns the correct state on SET_TABLE_COLUMN_DATASOURCE_TYPE', () => {
    const initialState = {
      ...defaultState,
      columnPanel: {},
    };

    const action = {
      type: 'SET_TABLE_COLUMN_DATASOURCE_TYPE',
      payload: {
        type: 'ParticipationLevels',
      },
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      columnPanel: {
        dataSource: {
          type: 'ParticipationLevels',
        },
      },
    });
  });

  it('returns the correct state on SET_TABLE_COLUMN_DATASOURCE_IDS', () => {
    const initialState = {
      ...defaultState,
      columnPanel: {},
    };

    const action = {
      type: 'SET_TABLE_COLUMN_DATASOURCE_IDS',
      payload: {
        ids: [1, 2, 3],
        type: 'ParticipationLevels',
      },
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      columnPanel: {
        dataSource: {
          ids: [1, 2, 3],
          type: 'ParticipationLevels',
        },
      },
    });
  });

  it('returns the correct state on SET_TABLE_COLUMN_STATUS', () => {
    const initialState = {
      ...defaultState,
      columnPanel: {},
    };

    const action = {
      type: 'SET_TABLE_COLUMN_STATUS',
      payload: {
        status: 'available',
        type: 'Availability',
      },
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      columnPanel: {
        dataSource: {
          status: 'available',
          type: 'Availability',
        },
      },
    });
  });

  it('returns the correct state on SET_TABLE_COLUMN_SUBTYPE', () => {
    const initialState = {
      ...defaultState,
      columnPanel: { dataSource: {} },
    };

    const action = {
      type: 'SET_TABLE_COLUMN_SUBTYPE',
      payload: {
        subtype: 'side_ids',
        value: [1, 2],
      },
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      columnPanel: {
        dataSource: {
          subtypes: {
            side_ids: [1, 2],
          },
        },
      },
    });
  });

  it('returns the correct state on SET_TABLE_COLUMN_TITLE', () => {
    const initialState = {
      ...defaultState,
      columnPanel: {},
    };

    const action = {
      type: 'SET_TABLE_COLUMN_TITLE',
      payload: {
        title: 'Test',
      },
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      columnPanel: {
        name: 'Test',
      },
    });
  });

  it('returns the correct state on SET_TABLE_COLUMN_TIME_PERIOD', () => {
    const initialState = {
      ...defaultState,
      columnPanel: {},
    };

    const action = {
      type: 'SET_TABLE_COLUMN_TIME_PERIOD',
      payload: {
        timePeriod: 'this_season',
      },
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      columnPanel: {
        time_scope: {
          time_period: 'this_season',
        },
      },
    });
  });

  it('returns the correct state on SET_TABLE_COLUMN_TIME_PERIOD_LENGTH', () => {
    const initialState = {
      ...defaultState,
      columnPanel: {},
    };

    const action = {
      type: 'SET_TABLE_COLUMN_TIME_PERIOD_LENGTH',
      payload: {
        timePeriodLength: 23,
      },
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      columnPanel: {
        time_scope: {
          time_period_length: 23,
        },
      },
    });
  });

  it('returns the correct state on SET_TABLE_COLUMN_TIME_PERIOD_LENGTH_OFFSET', () => {
    const initialState = {
      ...defaultState,
      columnPanel: {},
    };

    const action = {
      type: 'SET_TABLE_COLUMN_TIME_PERIOD_LENGTH_OFFSET',
      payload: {
        timePeriodLengthOffset: 5,
      },
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      columnPanel: {
        time_scope: {
          time_period_length_offset: 5,
        },
      },
    });
  });

  describe('when the SET_TABLE_ELEMENT_FILTER action is fired', () => {
    const emptyFilters = {
      time_loss: [],
      session_type: [],
      competitions: [],
      event_types: [],
      training_session_types: [],
    };
    const initialState = {
      ...defaultState,
      columnPanel: {
        filters: {
          ...emptyFilters,
        },
      },
      rowPanel: {
        filters: {
          ...emptyFilters,
        },
      },
    };
    it('updates the correct state when using a row', () => {
      const action = {
        type: 'SET_TABLE_ELEMENT_FILTER',
        payload: {
          panel: 'row',
          filter: 'event_types',
          value: ['game'],
        },
      };

      const nextState = tableWidgetReducer({ ...initialState }, action);
      expect(nextState).toEqual({
        ...initialState,
        rowPanel: {
          filters: {
            ...emptyFilters,
            event_types: ['game'],
          },
        },
      });
    });

    it('updates the correct state when using a column', () => {
      const action = {
        type: 'SET_TABLE_ELEMENT_FILTER',
        payload: {
          panel: 'column',
          filter: 'event_types',
          value: ['game'],
        },
      };

      const nextState = tableWidgetReducer({ ...initialState }, action);
      expect(nextState).toEqual({
        ...initialState,
        columnPanel: {
          filters: {
            ...emptyFilters,
            event_types: ['game'],
          },
        },
      });
    });

    it('updates the correct filter and value', () => {
      expect(
        tableWidgetReducer(
          { ...initialState },
          {
            type: 'SET_TABLE_ELEMENT_FILTER',
            payload: {
              panel: 'column',
              filter: 'event_types',
              value: ['game'],
            },
          }
        )
      ).toEqual({
        ...initialState,
        columnPanel: {
          filters: {
            ...emptyFilters,
            event_types: ['game'],
          },
        },
      });

      expect(
        tableWidgetReducer(
          { ...initialState },
          {
            type: 'SET_TABLE_ELEMENT_FILTER',
            payload: {
              panel: 'column',
              filter: 'training_session_types',
              value: [1, 2],
            },
          }
        )
      ).toEqual({
        ...initialState,
        columnPanel: {
          filters: {
            ...emptyFilters,
            training_session_types: [1, 2],
          },
        },
      });
    });
  });

  it('returns the correct state on SET_TABLE_ROW_CALCULATION', () => {
    const initialState = {
      ...defaultState,
      rowPanel: {},
    };

    const action = {
      type: 'SET_TABLE_ROW_CALCULATION',
      payload: {
        calculation: 'mean',
      },
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      rowPanel: {
        calculation: 'mean',
      },
    });
  });

  it('returns the correct state on SET_TABLE_ROW_CALCULATION_PARAM', () => {
    const initialState = {
      ...defaultState,
      rowPanel: {},
    };

    const action = {
      type: 'SET_TABLE_ROW_CALCULATION_PARAM',
      payload: {
        calculationParam: 'time_period',
        value: 'last',
      },
    };

    const firstState = tableWidgetReducer(initialState, action);
    expect(firstState).toEqual({
      ...defaultState,
      rowPanel: {
        calculation_params: {
          time_period: 'last',
        },
      },
    });

    const secondState = tableWidgetReducer(initialState, {
      type: 'SET_TABLE_ROW_CALCULATION_PARAM',
      payload: {
        calculationParam: 'time_period_length',
        value: 2,
      },
    });
    expect(secondState).toEqual({
      ...defaultState,
      rowPanel: {
        calculation_params: {
          time_period_length: 2,
        },
      },
    });
  });

  it('returns the correct state on SET_TABLE_ROW_DATE_RANGE', () => {
    const initialState = {
      ...defaultState,
      rowPanel: {},
    };

    const action = {
      type: 'SET_TABLE_ROW_DATE_RANGE',
      payload: {
        range: {
          start_date: '20/8/20',
          end_date: '23/8/20',
        },
      },
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      rowPanel: {
        time_scope: {
          start_time: '20/8/20',
          end_time: '23/8/20',
        },
      },
    });
  });

  it('returns the correct state on SET_TABLE_ROW_TITLE', () => {
    const initialState = {
      ...defaultState,
      rowPanel: {},
    };

    const action = {
      type: 'SET_TABLE_ROW_TITLE',
      payload: {
        title: 'abc123',
      },
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      rowPanel: {
        name: 'abc123',
        dataSource: {
          name: 'abc123',
        },
      },
    });
  });

  it('returns the correct state on SET_TABLE_ROW_METRICS', () => {
    const initialState = {
      ...defaultState,
      rowPanel: {},
    };

    const action = {
      type: 'SET_TABLE_ROW_METRICS',
      payload: {
        metric: [{ key_name: 'test|metric', name: 'Test Metric' }],
      },
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      rowPanel: {
        dataSource: {
          key_name: 'test|metric',
          source: 'test',
          variable: 'metric',
          name: 'Test Metric',
          type: 'TableMetric',
        },
      },
    });
  });

  it('returns the correct state on SET_TABLE_ROW_ACTIVITY', () => {
    const initialState = {
      ...defaultState,
      rowPanel: {},
    };

    const action = {
      type: 'SET_TABLE_ROW_ACTIVITY',
      payload: {
        ids: [123],
        type: 'Principle',
        name: 'Principle name',
      },
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      rowPanel: {
        dataSource: {
          ids: [123],
          type: 'Principle',
          name: 'Principle name',
        },
      },
    });
  });

  it('returns the correct state on SET_TABLE_ROW_DATASOURCE_TYPE', () => {
    const initialState = {
      ...defaultState,
      rowPanel: {},
    };

    const action = {
      type: 'SET_TABLE_ROW_DATASOURCE_TYPE',
      payload: {
        type: 'ParticipationLevels',
      },
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      rowPanel: {
        dataSource: {
          type: 'ParticipationLevels',
        },
      },
    });
  });

  it('returns the correct state on SET_TABLE_ROW_DATASOURCE_IDS', () => {
    const initialState = {
      ...defaultState,
      rowPanel: {},
    };

    const action = {
      type: 'SET_TABLE_ROW_DATASOURCE_IDS',
      payload: {
        ids: [1, 2, 3],
        type: 'ParticipationLevels',
        name: 'Participation name',
      },
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      rowPanel: {
        dataSource: {
          ids: [1, 2, 3],
          type: 'ParticipationLevels',
          name: 'Participation name',
        },
      },
    });
  });

  it('returns the correct state on SET_TABLE_ROW_STATUS', () => {
    const initialState = {
      ...defaultState,
      rowPanel: {},
    };

    const action = {
      type: 'SET_TABLE_ROW_STATUS',
      payload: {
        status: 'available',
        name: 'Available',
        type: 'Availability',
      },
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      rowPanel: {
        dataSource: {
          name: 'Available',
          status: 'available',
          type: 'Availability',
        },
      },
    });
  });

  it('returns the correct state on SET_TABLE_ROW_TIME_PERIOD', () => {
    const initialState = {
      ...defaultState,
      rowPanel: {},
    };

    const action = {
      type: 'SET_TABLE_ROW_TIME_PERIOD',
      payload: {
        timePeriod: 'this_season',
      },
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      rowPanel: {
        time_scope: {
          time_period: 'this_season',
          start_time: null,
          end_time: null,
        },
      },
    });
  });

  it('returns the correct state on SET_TABLE_ROW_TIME_PERIOD_LENGTH', () => {
    const initialState = {
      ...defaultState,
      rowPanel: {},
    };

    const action = {
      type: 'SET_TABLE_ROW_TIME_PERIOD_LENGTH',
      payload: {
        timePeriodLength: 23,
      },
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      rowPanel: {
        time_scope: {
          time_period_length: 23,
        },
      },
    });
  });

  it('returns the correct state on SET_TABLE_ROW_TIME_PERIOD_LENGTH_OFFSET', () => {
    const initialState = {
      ...defaultState,
      rowPanel: {},
    };

    const action = {
      type: 'SET_TABLE_ROW_TIME_PERIOD_LENGTH_OFFSET',
      payload: {
        timePeriodLengthOffset: 5,
      },
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      rowPanel: {
        time_scope: {
          time_period_length_offset: 5,
        },
      },
    });
  });

  it('returns the correct state on SET_TABLE_ROW_SUBTYPE', () => {
    const initialState = {
      ...defaultState,
      rowPanel: {
        dataSource: {},
      },
    };

    const action = {
      type: 'SET_TABLE_ROW_SUBTYPE',
      payload: {
        subtype: 'side_ids',
        value: [1, 2],
      },
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      rowPanel: {
        dataSource: {
          subtypes: {
            side_ids: [1, 2],
          },
        },
      },
    });
  });

  it('returns the correct state on TOGGLE_TABLE_COLUMN_PANEL', () => {
    const initialState = {
      ...defaultState,
      appliedColumns: [
        { name: 'Reducer Test', metric: { key_name: 'kitman|blah|test' } },
      ],
      appliedRows: [
        {
          id: 1,
          name: 'test row',
          population: {
            applies_to_squad: false,
            position_groups: [],
            positions: [123],
            athletes: [],
            all_squads: false,
            squads: [],
          },
          table_element: {
            calculation: 'mean',
            data_source: {
              key_name: 'testing|variable',
              description: 'combination',
            },
            name: 'Testing 123',
          },
          time_scope: {
            time_period: 'today',
          },
        },
      ],
      columnPanel: {
        source: 'metric',
        columnId: 123,
        isEditMode: true,
        name: 'Test',
        dataSource: { key_name: '1234556' },
        population: {
          applies_to_squad: true,
          position_groups: [123],
          positions: [],
          athletes: [],
          all_squads: false,
          squads: [],
        },
        calculation: 'sum',
        time_scope: {
          time_period: 'today',
          start_time: undefined,
          end_time: undefined,
          time_period_length: undefined,
        },
      },
      tableContainerId: 33,
      tableName: 'Table Name',
      tableType: 'SCORECARD',
      widgetId: 1234,
    };

    const action = {
      type: 'TOGGLE_TABLE_COLUMN_PANEL',
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      appliedColumns: [],
      appliedRows: [],
      columnPanel: {
        source: null,
        calculation: '',
        columnId: null,
        dataSource: {},
        isEditMode: false,
        name: '',
        population: {
          applies_to_squad: false,
          position_groups: [],
          positions: [],
          athletes: [],
          all_squads: false,
          squads: [],
        },
        time_scope: {
          time_period: '',
          start_time: undefined,
          end_time: undefined,
          time_period_length: undefined,
        },
        filters: {
          competitions: [],
          event_types: [],
          match_days: [],
          session_type: [],
          time_loss: [],
          training_session_types: [],
        },
        requestStatus: {
          data: {},
          status: 'dormant',
        },
      },
      tableContainerId: null,
      tableName: '',
      tableType: '',
      widgetId: null,
    });
  });

  it('returns the correct state on TOGGLE_TABLE_ROW_PANEL', () => {
    const initialState = {
      ...defaultState,
      appliedColumns: [
        { name: 'Reducer Test', metric: { key_name: 'kitman|blah|test' } },
      ],
      appliedRows: [
        {
          id: 1,
          name: 'test row',
          population: {
            applies_to_squad: false,
            position_groups: [],
            positions: [123],
            athletes: [],
            all_squads: false,
            squads: [],
          },
          table_element: {
            calculation: 'mean',
            data_source: {
              key_name: 'testing|variable',
              description: 'combination',
            },
            name: 'Testing 123',
          },
          time_scope: {
            time_period: 'today',
          },
        },
      ],
      rowPanel: {
        source: 'metric',
        calculation: 'mean',
        isEditMode: true,
        dataSource: {},
        time_scope: {
          time_period: 'daily',
          start_time: undefined,
          end_time: undefined,
          time_period_length: undefined,
        },
        filters: {
          competitions: [],
          event_types: [],
          session_type: [],
          time_loss: [],
          training_session_types: [],
        },
        requestStatus: {
          data: {},
          status: 'dormant',
        },
      },
      tableContainerId: 119,
      tableName: 'Table Name',
      tableType: 'COMPARISON',
      widgetId: 1234,
    };

    const action = {
      type: 'TOGGLE_TABLE_ROW_PANEL',
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      appliedColumns: [],
      appliedRows: [],
      rowPanel: {
        source: null,
        calculation: '',
        isEditMode: false,
        dataSource: {},
        population: [],
        time_scope: {
          time_period: '',
          start_time: undefined,
          end_time: undefined,
          time_period_length: undefined,
        },
        filters: {
          competitions: [],
          event_types: [],
          session_type: [],
          time_loss: [],
          training_session_types: [],
        },
        requestStatus: {
          data: {},
          status: 'dormant',
        },
      },
      tableContainerId: null,
      tableName: '',
      tableType: '',
      widgetId: null,
    });
  });

  it('returns the correct state for DUPLICATE_COLUMN_IS_LOADING', () => {
    const initialState = {
      ...defaultState,
      duplicateColumn: {
        loading: [1],
        error: [],
      },
    };

    const action = {
      type: 'DUPLICATE_COLUMN_IS_LOADING',
      payload: {
        columnId: 2,
      },
    };

    const nextState = tableWidgetReducer(initialState, action);

    expect(nextState).toEqual({
      ...initialState,
      duplicateColumn: {
        loading: [1, 2],
        error: [],
      },
    });
  });

  it('returns the correct state for DUPLICATE_COLUMN_SUCCESS', () => {
    const initialState = {
      ...defaultState,
      duplicateColumn: {
        loading: [1, 2],
        error: [],
      },
    };
    const action = {
      type: 'DUPLICATE_COLUMN_SUCCESS',
      payload: {
        columnId: 2,
      },
    };

    const nextState = tableWidgetReducer(initialState, action);

    expect(nextState).toEqual({
      ...initialState,
      duplicateColumn: {
        loading: [1],
        error: [],
      },
    });
  });
  it('returns the correct state for DUPLICATE_COLUMN_ERROR', () => {
    const initialState = {
      ...defaultState,
      duplicateColumn: {
        loading: [],
        error: [1],
      },
    };

    const action = {
      type: 'DUPLICATE_COLUMN_ERROR',
      payload: {
        columnId: 2,
      },
    };

    const nextState = tableWidgetReducer(initialState, action);

    expect(nextState).toEqual({
      ...initialState,
      duplicateColumn: {
        loading: [],
        error: [1, 2],
      },
    });
  });

  it('returns the correct state for CLEAR_DUPLICATE_COLUMN_ERROR', () => {
    const initialState = {
      ...defaultState,
      duplicateColumn: {
        loading: [],
        error: [1, 2],
      },
    };
    const action = {
      type: 'CLEAR_DUPLICATE_COLUMN_ERROR',
      payload: {
        columnId: 2,
      },
    };

    const nextState = tableWidgetReducer(initialState, action);

    expect(nextState).toEqual({
      ...initialState,
      duplicateColumn: {
        loading: [],
        error: [1],
      },
    });
  });

  it('returns the correct state for ADD_EDIT_TABLE_COLUMN_LOADING', () => {
    const initialState = {
      ...defaultState,
      columnPanel: {
        isLoading: false,
      },
    };
    const action = {
      type: 'ADD_EDIT_TABLE_COLUMN_LOADING',
    };

    const nextState = tableWidgetReducer(initialState, action);

    expect(nextState).toEqual({
      ...initialState,
      columnPanel: {
        isLoading: true,
      },
    });
  });

  it('returns the correct state for ADD_TABLE_COLUMN_SUCCESS', () => {
    const initialState = {
      ...defaultState,
      columnPanel: {
        isLoading: true,
      },
    };
    const action = {
      type: 'ADD_TABLE_COLUMN_SUCCESS',
    };

    const nextState = tableWidgetReducer(initialState, action);

    expect(nextState).toEqual({
      ...initialState,
      columnPanel: {
        isLoading: false,
      },
    });
  });

  it('returns the correct state for ADD_EDIT_TABLE_ROW_LOADING', () => {
    const initialState = {
      ...defaultState,
      rowPanel: {
        isLoading: false,
      },
    };
    const action = {
      type: 'ADD_EDIT_TABLE_ROW_LOADING',
    };

    const nextState = tableWidgetReducer(initialState, action);

    expect(nextState).toEqual({
      ...initialState,
      rowPanel: {
        isLoading: true,
      },
    });
  });

  it('returns the correct state for ADD_TABLE_ROW_SUCCESS', () => {
    const initialState = {
      ...defaultState,
      rowPanel: {
        isLoading: true,
      },
    };
    const action = {
      type: 'ADD_TABLE_ROW_SUCCESS',
    };

    const nextState = tableWidgetReducer(initialState, action);

    expect(nextState).toEqual({
      ...initialState,
      rowPanel: {
        isLoading: false,
      },
    });
  });

  it('returns the correct state on SET_TABLE_COLUMN_GAME_KINDS', () => {
    const initialState = {
      ...defaultState,
      columnPanel: {},
    };

    const action = {
      type: 'SET_TABLE_COLUMN_GAME_KINDS',
      payload: {
        kinds: ['kinds'],
        type: 'GameActivity',
      },
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      columnPanel: {
        dataSource: {
          kinds: ['kinds'],
          type: 'GameActivity',
        },
      },
    });
  });

  it('returns the correct state on SET_TABLE_ROW_GAME_KINDS', () => {
    const initialState = {
      ...defaultState,
      rowPanel: {},
    };

    const action = {
      type: 'SET_TABLE_ROW_GAME_KINDS',
      payload: {
        kinds: ['kinds'],
        type: 'GameActivity',
      },
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      rowPanel: {
        dataSource: {
          kinds: ['kinds'],
          type: 'GameActivity',
        },
      },
    });
  });

  it('returns the correct state on SET_TABLE_COLUMN_GAME_RESULT', () => {
    const initialState = {
      ...defaultState,
      columnPanel: {},
    };

    const action = {
      type: 'SET_TABLE_COLUMN_GAME_RESULT',
      payload: {
        result: 'win',
        type: 'GameResultAthlete',
      },
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      columnPanel: {
        dataSource: {
          result: 'win',
          type: 'GameResultAthlete',
        },
      },
    });
  });

  it('returns the correct state on SET_TABLE_ROW_GAME_RESULT', () => {
    const initialState = {
      ...defaultState,
      rowPanel: {
        dataSource: {
          name: 'test name',
        },
      },
    };

    const action = {
      type: 'SET_TABLE_ROW_GAME_RESULT',
      payload: {
        result: 'win',
        type: 'GameResultAthlete',
      },
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      rowPanel: {
        dataSource: {
          result: 'win',
          type: 'GameResultAthlete',
          name: 'test name',
        },
      },
    });
  });

  it('returns the correct state on SET_TABLE_COLUMN_TIME_IN_POSITIONS', () => {
    const initialState = {
      ...defaultState,
      columnPanel: {
        dataSource: {
          name: 'test name',
        },
      },
    };

    const action = {
      type: 'SET_TABLE_COLUMN_TIME_IN_POSITIONS',
      payload: {
        positions: [1, 2, 3],
      },
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      columnPanel: {
        dataSource: {
          position_ids: [1, 2, 3],
          name: 'test name',
        },
      },
    });
  });

  it('returns the correct state on SET_TABLE_ROW_TIME_IN_POSITIONS', () => {
    const initialState = {
      ...defaultState,
      rowPanel: {
        dataSource: {
          name: 'test name',
        },
      },
    };

    const action = {
      type: 'SET_TABLE_ROW_TIME_IN_POSITIONS',
      payload: {
        positions: [1, 2, 3],
      },
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      rowPanel: {
        dataSource: {
          position_ids: [1, 2, 3],
          name: 'test name',
        },
      },
    });
  });

  it('returns the correct state on SET_TABLE_COLUMN_EVENT_TYPE', () => {
    const initialState = {
      ...defaultState,
      columnPanel: {
        dataSource: {
          event: null,
          type: null,
        },
      },
    };

    const action = {
      type: 'SET_TABLE_COLUMN_EVENT_TYPE',
      payload: {
        event: 'events',
        type: 'EventActivity',
      },
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      columnPanel: {
        dataSource: {
          event: 'events',
          type: 'EventActivity',
        },
      },
    });
  });

  it('returns the correct state on SET_TABLE_ROW_EVENT_TYPE', () => {
    const initialState = {
      ...defaultState,
      rowPanel: {
        dataSource: {
          event: null,
          type: null,
        },
      },
    };

    const action = {
      type: 'SET_TABLE_ROW_EVENT_TYPE',
      payload: {
        event: 'minutes',
        type: 'EventActivity',
      },
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      rowPanel: {
        dataSource: {
          event: 'minutes',
          type: 'EventActivity',
        },
      },
    });
  });

  it('returns the correct state on SET_COLUMN_PANEL_INPUT_PARAMS | Metric', () => {
    const initialState = {
      ...defaultState,
      columnPanel: {
        dataSource: {},
      },
    };

    const action = {
      type: 'SET_COLUMN_PANEL_INPUT_PARAMS',
      payload: {
        params: {
          data: [{ name: 'Metric Name', key_name: 'source|variable' }],
          type: DATA_SOURCE_TYPES.tableMetric,
        },
      },
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      columnPanel: {
        dataSource: {
          key_name: 'source|variable',
          source: 'source',
          type: 'TableMetric',
          variable: 'variable',
        },
        name: 'Metric Name',
      },
    });
  });

  it('returns the correct state on SET_COLUMN_PANEL_INPUT_PARAMS | Principle', () => {
    const initialState = {
      ...defaultState,
      columnPanel: {
        dataSource: {},
      },
    };

    const action = {
      type: 'SET_COLUMN_PANEL_INPUT_PARAMS',
      payload: {
        params: {
          data: [{ ids: [1, 2, 3], type: 'Principle' }],
          type: DATA_SOURCE_TYPES.principle,
        },
      },
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      columnPanel: {
        dataSource: {
          ids: [1, 2, 3],
          type: 'Principle',
        },
      },
    });
  });

  it('returns the correct state on SET_COLUMN_PANEL_INPUT_PARAMS | ParticipationLevels', () => {
    const initialState = {
      ...defaultState,
      columnPanel: {
        dataSource: {},
      },
    };

    const action = {
      type: 'SET_COLUMN_PANEL_INPUT_PARAMS',
      payload: {
        params: {
          data: [{ event: 'event', ids: [1, 2, 3], status: 'status' }],
          type: DATA_SOURCE_TYPES.participationLevel,
        },
      },
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      columnPanel: {
        dataSource: {
          event: null,
          ids: [1, 2, 3],
          status: 'status',
          type: DATA_SOURCE_TYPES.participationLevel,
        },
      },
    });
  });

  it('returns the correct state on SET_COLUMN_PANEL_INPUT_PARAMS | GameActivity', () => {
    const initialState = {
      ...defaultState,
      columnPanel: {
        dataSource: {},
      },
    };

    const action = {
      type: 'SET_COLUMN_PANEL_INPUT_PARAMS',
      payload: {
        params: {
          data: [
            {
              kinds: ['kinds'],
              formation_ids: [1, 2, 3],
              position_ids: [4, 5, 6],
            },
          ],
          type: DATA_SOURCE_TYPES.gameActivity,
        },
      },
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      columnPanel: {
        dataSource: {
          formation_ids: [1, 2, 3],
          kinds: ['kinds'],
          position_ids: [4, 5, 6],
          type: DATA_SOURCE_TYPES.gameActivity,
        },
      },
    });
  });

  it('returns the correct state on SET_COLUMN_PANEL_INPUT_PARAMS | GameResultAthlete', () => {
    const initialState = {
      ...defaultState,
      columnPanel: {
        dataSource: {},
      },
    };

    const action = {
      type: 'SET_COLUMN_PANEL_INPUT_PARAMS',
      payload: {
        params: {
          data: [{ result: 'win' }],
          type: DATA_SOURCE_TYPES.gameResultAthlete,
        },
      },
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      columnPanel: {
        dataSource: {
          result: 'win',
          type: DATA_SOURCE_TYPES.gameResultAthlete,
          kinds: undefined,
        },
      },
    });
  });

  it('returns the correct state on SET_COLUMN_PANEL_INPUT_PARAMS | Availability', () => {
    const initialState = {
      ...defaultState,
      columnPanel: {
        dataSource: {},
      },
    };

    const action = {
      type: 'SET_COLUMN_PANEL_INPUT_PARAMS',
      payload: {
        params: {
          data: [{ status: 'available' }],
          type: DATA_SOURCE_TYPES.availability,
        },
      },
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      columnPanel: {
        dataSource: {
          status: 'available',
          type: DATA_SOURCE_TYPES.availability,
        },
      },
    });
  });

  it('returns the correct state on SET_ROW_PANEL_INPUT_PARAMS | Metric', () => {
    const initialState = {
      ...defaultState,
      rowPanel: {
        dataSource: {},
      },
    };

    const action = {
      type: 'SET_ROW_PANEL_INPUT_PARAMS',
      payload: {
        params: {
          data: [{ name: 'Metric Name', key_name: 'source|variable' }],
          type: DATA_SOURCE_TYPES.tableMetric,
        },
      },
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      rowPanel: {
        dataSource: {
          key_name: 'source|variable',
          source: 'source',
          type: 'TableMetric',
          variable: 'variable',
        },
        name: 'Metric Name',
      },
    });
  });

  it('returns the correct state on SET_ROW_PANEL_INPUT_PARAMS | Availability', () => {
    const initialState = {
      ...defaultState,
      rowPanel: {
        dataSource: {},
      },
    };

    const action = {
      type: 'SET_ROW_PANEL_INPUT_PARAMS',
      payload: {
        params: {
          data: [{ status: 'available' }],
          type: DATA_SOURCE_TYPES.availability,
        },
      },
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      rowPanel: {
        dataSource: {
          status: 'available',
          type: DATA_SOURCE_TYPES.availability,
        },
      },
    });
  });

  it('returns the correct state on SET_TABLE_ROW_GROUPING', () => {
    const initialState = {
      ...defaultState,
      rowPanel: {
        config: {
          groupings: [],
        },
      },
    };

    const action = {
      type: 'SET_TABLE_ROW_GROUPING',
      payload: {
        groupings: ['group1', 'group2'],
      },
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      rowPanel: {
        config: {
          groupings: ['group1', 'group2'],
        },
      },
    });
  });

  it('returns the correct state on SET_TABLE_COLUMN_TIME_PERIOD_CONFIG', () => {
    const initialState = {
      ...defaultState,
      columnPanel: {
        time_scope: {
          time_period: 'last_x_events',
          time_period_length: 7,
        },
      },
    };

    const action = {
      type: 'SET_TABLE_COLUMN_TIME_PERIOD_CONFIG',
      payload: {
        config: { event_types: ['training_session', 'game'] },
      },
    };

    const nextState = tableWidgetReducer(initialState, action);
    expect(nextState).toEqual({
      ...defaultState,
      columnPanel: {
        time_scope: {
          time_period: 'last_x_events',
          time_period_length: 7,
          config: { event_types: ['training_session', 'game'] },
        },
      },
    });
  });
});
