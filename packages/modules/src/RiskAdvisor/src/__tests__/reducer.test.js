import {
  injuryVariableSettings as injuryVariableSettingsReducer,
  generateMetricStatus as generateMetricStatusReducer,
  appStatus as appStatusReducer,
} from '../reducer';
import injuryVariablesDummyData from '../../resources/injuryVariablesDummyData';

describe('Risk Advisor reducer', () => {
  const defaultState = {
    allVariables: [...injuryVariablesDummyData],
    currentVariable: { ...injuryVariablesDummyData[0] },
    staticData: {
      tsStart: '2020-01-23T23:00:00Z',
      tsEnd: '2020-07-23T22:59:59Z',
      defaultPipelineArn: 'multivariate_analysis_experimental_state_machine',
    },
    renameVariableModal: {
      isOpen: false,
      isTriggeredBySave: false,
    },
    dataSourcePanel: {
      isOpen: false,
    },
    toast: {
      statusItem: null,
    },
    graphData: {
      summary: null,
      value: null,
      totalInjuries: null,
    },
    tcfGraphData: {
      isLoading: false,
      graphData: [],
    },
  };

  it('returns correct state on SELECT_INJURY_VARIABLE', () => {
    const responseVariable = {
      ...injuryVariablesDummyData[1],
      snapshot: {
        summary: { graph_group: 'summary_bar' },
        value: { graph_group: 'value_visualisation' },
        totalInjuries: 65,
      },
    };
    const newVariables = [{ ...injuryVariablesDummyData[0] }, responseVariable];
    const initialState = {
      ...defaultState,
      allVariables: newVariables,
    };

    const action = {
      type: 'SELECT_INJURY_VARIABLE',
      payload: {
        variableId: '5678',
      },
    };

    const nextState = injuryVariableSettingsReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      currentVariable: { ...responseVariable },
      graphData: {
        summary: { graph_group: 'summary_bar' },
        value: { graph_group: 'value_visualisation' },
        totalInjuries: 65,
      },
    });
  });

  it('returns correct state on ADD_NEW_INJURY_VARIABLE', () => {
    const initialState = {
      ...defaultState,
      currentVariable: { ...injuryVariablesDummyData[0] },
    };

    const action = {
      type: 'ADD_NEW_INJURY_VARIABLE',
    };

    const nextState = injuryVariableSettingsReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      currentVariable: {
        id: null,
        name: 'Untitled Metric',
        date_range: {
          start_date: initialState.staticData.tsStart,
          end_date: initialState.staticData.tsEnd,
        },
        filter: {
          position_group_ids: [],
          exposure_types: [],
          mechanisms: [],
          osics_body_area_ids: [],
          severity: [],
        },
        excluded_sources: [],
        excluded_variables: [],
        enabled_for_prediction: true,
        created_by: {
          id: null,
          fullname: null,
        },
        created_at: null,
        archived: false,
        status: null,
        last_prediction_status: null,
        is_hidden: false,
        pipeline_arn: 'multivariate_analysis_experimental_state_machine',
      },
    });
  });

  it('returns correct state on CONFIRM_CANCEL_EDIT_INJURY_VARIABLE', () => {
    const initialState = {
      ...defaultState,
      currentVariable: { ...injuryVariablesDummyData[0], name: 'New metric' },
      graphData: {
        summary: { graph_group: 'summary_bar' },
        value: { graphGroup: 'value_visualisation' },
        totalInjuries: 65,
      },
    };

    const action = {
      type: 'CONFIRM_CANCEL_EDIT_INJURY_VARIABLE',
    };

    const nextState = injuryVariableSettingsReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      currentVariable: { ...injuryVariablesDummyData[0] },
      graphData: {
        summary: injuryVariablesDummyData[0].snapshot.summary,
        value: injuryVariablesDummyData[0].snapshot.value,
        totalInjuries: 65,
      },
    });
  });

  it('returns correct state on CONFIRM_CANCEL_EDIT_INJURY_VARIABLE when there are no saved variables', () => {
    const initialState = {
      ...defaultState,
      allVariables: [],
      currentVariable: { ...injuryVariablesDummyData[0], name: 'New metric' },
      graphData: {
        summary: { graph_group: 'summary_bar' },
        value: { graphGroup: 'value_visualisation' },
        totalInjuries: 65,
      },
    };

    const action = {
      type: 'CONFIRM_CANCEL_EDIT_INJURY_VARIABLE',
    };

    const nextState = injuryVariableSettingsReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      currentVariable: {
        id: null,
        name: '',
        date_range: {
          start_date: initialState.staticData.tsStart,
          end_date: initialState.staticData.tsEnd,
        },
        filter: {
          position_group_ids: [],
          exposure_types: [],
          mechanisms: [],
          osics_body_area_ids: [],
          severity: [],
        },
        excluded_sources: [],
        excluded_variables: [],
        enabled_for_prediction: true,
        created_by: {
          id: null,
          fullname: null,
        },
        created_at: null,
        archived: false,
        status: null,
        last_prediction_status: null,
        snapshot: {
          summary: null,
          value: null,
          totalInjuries: null,
        },
        is_hidden: false,
        pipeline_arn: 'multivariate_analysis_experimental_state_machine',
      },
      graphData: {
        summary: null,
        value: null,
        totalInjuries: null,
      },
    });
  });

  it('returns correct state on OPEN_RENAME_VARIABLE_MODAL', () => {
    const initialState = {
      ...defaultState,
    };

    const action = {
      type: 'OPEN_RENAME_VARIABLE_MODAL',
      payload: {
        isTriggeredBySave: true,
        variableName: 'New Metric',
      },
    };

    const nextState = injuryVariableSettingsReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      renameVariableModal: {
        ...initialState.renameVariableModal,
        isOpen: true,
        isTriggeredBySave: true,
        variableName: 'New Metric',
      },
    });
  });

  it('returns correct state on TOGGLE_DATA_SOURCE_PANEL', () => {
    const initialState = {
      ...defaultState,
    };

    const action = {
      type: 'TOGGLE_DATA_SOURCE_PANEL',
    };

    const nextState = injuryVariableSettingsReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      dataSourcePanel: {
        ...initialState.dataSourcePanel,
        isOpen: true,
      },
    });
  });

  it('returns correct state on SAVE_DATA_SOURCES', () => {
    const initialState = {
      ...defaultState,
    };

    const action = {
      type: 'SAVE_DATA_SOURCES',
      payload: {
        excludedSources: ['kitman', 'catapult'],
      },
    };

    const nextState = injuryVariableSettingsReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      currentVariable: {
        ...initialState.currentVariable,
        excluded_sources: ['kitman', 'catapult'],
      },
    });
  });

  it('returns correct state on CLOSE_RENAME_VARIABLE_MODAL', () => {
    const initialState = {
      ...defaultState,
      renameVariableModal: {
        ...defaultState.renameVariableModal,
        isOpen: true,
        isTriggeredBySave: true,
        variableName: 'Metric name',
      },
    };

    const action = {
      type: 'CLOSE_RENAME_VARIABLE_MODAL',
    };

    const nextState = injuryVariableSettingsReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      renameVariableModal: {
        ...initialState.renameVariableModal,
        isOpen: false,
        isTriggeredBySave: false,
        variableName: null,
      },
    });
  });

  it('returns correct state on CHANGE_DATE_RANGE', () => {
    const initialState = {
      ...defaultState,
      currentVariable: { ...injuryVariablesDummyData[0] },
    };

    const action = {
      type: 'CHANGE_DATE_RANGE',
      payload: {
        dateRange: {
          start_date: '2020-08-10T23:00:00Z',
          end_date: '2020-08-23T22:59:59Z',
        },
      },
    };

    const nextState = injuryVariableSettingsReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      currentVariable: {
        ...initialState.currentVariable,
        date_range: {
          start_date: '2020-08-10T23:00:00Z',
          end_date: '2020-08-23T22:59:59Z',
        },
      },
    });
  });

  it('returns correct state on SELECT_POSITION_GROUPS', () => {
    const initialState = {
      ...defaultState,
      currentVariable: { ...injuryVariablesDummyData[0] },
    };

    const action = {
      type: 'SELECT_POSITION_GROUPS',
      payload: {
        positionGroupId: [23],
      },
    };

    const nextState = injuryVariableSettingsReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      currentVariable: {
        ...initialState.currentVariable,
        filter: {
          ...initialState.currentVariable.filter,
          position_group_ids: [23],
        },
      },
    });
  });

  it('returns correct state on SELECT_SEVERITIES', () => {
    const initialState = {
      ...defaultState,
      currentVariable: { ...injuryVariablesDummyData[0] },
    };

    const action = {
      type: 'SELECT_SEVERITIES',
      payload: {
        severityId: ['minimal'],
      },
    };

    const nextState = injuryVariableSettingsReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      currentVariable: {
        ...initialState.currentVariable,
        filter: {
          ...initialState.currentVariable.filter,
          severity: ['minimal'],
        },
      },
    });
  });

  it('returns correct state on SELECT_EXPOSURES', () => {
    const initialState = {
      ...defaultState,
      currentVariable: { ...injuryVariablesDummyData[0] },
    };

    const action = {
      type: 'SELECT_EXPOSURES',
      payload: {
        exposureId: ['fixtures'],
      },
    };

    const nextState = injuryVariableSettingsReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      currentVariable: {
        ...initialState.currentVariable,
        filter: {
          ...initialState.currentVariable.filter,
          exposure_types: ['fixtures'],
        },
      },
    });
  });

  it('returns correct state on SELECT_MECHANISMS', () => {
    const initialState = {
      ...defaultState,
      currentVariable: { ...injuryVariablesDummyData[0] },
    };

    const action = {
      type: 'SELECT_MECHANISMS',
      payload: {
        mechanismId: ['contact'],
      },
    };

    const nextState = injuryVariableSettingsReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      currentVariable: {
        ...initialState.currentVariable,
        filter: {
          ...initialState.currentVariable.filter,
          mechanisms: ['contact'],
        },
      },
    });
  });

  it('returns correct state on SELECT_BODY_AREA', () => {
    const initialState = {
      ...defaultState,
      currentVariable: { ...injuryVariablesDummyData[0] },
    };

    const action = {
      type: 'SELECT_BODY_AREA',
      payload: {
        bodyAreaId: [1],
      },
    };

    const nextState = injuryVariableSettingsReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      currentVariable: {
        ...initialState.currentVariable,
        filter: {
          ...initialState.currentVariable.filter,
          osics_body_area_ids: [1],
        },
      },
    });
  });

  it('returns correct state on TOGGLE_HIDE_VARIABLE', () => {
    const initialState = {
      ...defaultState,
      currentVariable: { ...injuryVariablesDummyData[0], is_hidden: false },
    };

    const action = {
      type: 'TOGGLE_HIDE_VARIABLE',
      payload: {
        isChecked: true,
      },
    };

    const nextState = injuryVariableSettingsReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      currentVariable: {
        ...initialState.currentVariable,
        is_hidden: true,
      },
    });
  });

  it('returns correct state on SELECT_PIPELINE_ARN', () => {
    const initialState = {
      ...defaultState,
      currentVariable: { ...injuryVariablesDummyData[0] },
    };

    const action = {
      type: 'SELECT_PIPELINE_ARN',
      payload: {
        arn: 'new ARN',
      },
    };

    const nextState = injuryVariableSettingsReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      currentVariable: {
        ...initialState.currentVariable,
        pipeline_arn: 'new ARN',
      },
    });
  });

  it('returns correct state on UPDATE_VARIABLE_NAME', () => {
    const initialState = {
      ...defaultState,
      currentVariable: { ...injuryVariablesDummyData[0] },
    };

    const action = {
      type: 'UPDATE_VARIABLE_NAME',
      payload: {
        variableName: 'New Name',
      },
    };

    const nextState = injuryVariableSettingsReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      currentVariable: {
        ...initialState.currentVariable,
        name: 'New Name',
      },
    });
  });

  it('returns correct state on UPDATE_RENAME_VARIABLE_NAME', () => {
    const initialState = {
      ...defaultState,
      currentVariable: { ...injuryVariablesDummyData[0] },
    };

    const action = {
      type: 'UPDATE_RENAME_VARIABLE_NAME',
      payload: {
        variableName: 'New Name',
      },
    };

    const nextState = injuryVariableSettingsReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      renameVariableModal: {
        ...initialState.renameVariableModal,
        variableName: 'New Name',
      },
    });
  });

  it('returns correct state on TRIGGER_TOAST_PROGRESS', () => {
    const initialState = {
      ...defaultState,
    };

    const action = {
      type: 'TRIGGER_TOAST_PROGRESS',
    };

    const nextState = injuryVariableSettingsReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      toast: {
        ...initialState.toast,
        statusItem: {
          text: 'Injury Risk metric is being set up',
          status: 'PROGRESS',
          id: 0,
        },
      },
    });
  });

  it('returns correct state on TRIGGER_TOAST_ERROR', () => {
    const initialState = {
      ...defaultState,
    };

    const action = {
      type: 'TRIGGER_TOAST_ERROR',
    };

    const nextState = injuryVariableSettingsReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      toast: {
        ...initialState.toast,
        statusItem: {
          text: 'There was an error when saving the metric.',
          status: 'ERROR',
          id: 0,
        },
      },
    });
  });

  it('returns correct state on CLOSE_TOAST_ITEM', () => {
    const initialState = {
      ...defaultState,
    };

    const action = {
      type: 'CLOSE_TOAST_ITEM',
    };

    const nextState = injuryVariableSettingsReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      toast: {
        ...initialState.toast,
        statusItem: null,
      },
    });
  });

  it('returns correct state on SET_VARIABLE_STATUS', () => {
    const initialState = {
      ...defaultState,
      currentVariable: { ...injuryVariablesDummyData[0] },
    };

    const action = {
      type: 'SET_VARIABLE_STATUS',
      payload: {
        status: 'in_progress',
      },
    };

    const nextState = injuryVariableSettingsReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      currentVariable: {
        ...initialState.currentVariable,
        status: 'in_progress',
      },
    });
  });

  it('returns correct state on UPDATE_VARIABLE_SUCCESS', () => {
    const initialState = {
      ...defaultState,
      currentVariable: { ...injuryVariablesDummyData[0] },
    };

    const action = {
      type: 'UPDATE_VARIABLE_SUCCESS',
      payload: {
        isArchived: true,
        newVariableName: 'new name',
      },
    };

    const nextState = injuryVariableSettingsReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      currentVariable: {
        ...initialState.currentVariable,
        archived: true,
        name: 'new name',
      },
    });
  });

  it('returns correct state on FETCH_VARIABLES_SUCCESS', () => {
    const initialState = {
      ...defaultState,
      allVariables: [],
      currentVariable: {
        id: null,
      },
    };

    const newVariables = [{ name: 'new variable', id: 1234 }];

    const action = {
      type: 'FETCH_VARIABLES_SUCCESS',
      payload: {
        newVariables,
        responseVariable: { id: 1234 },
      },
    };

    const nextState = injuryVariableSettingsReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      allVariables: newVariables,
      currentVariable: { id: 1234 },
    });
  });

  it('returns correct state on BUILD_VARIABLE_GRAPHS_LOADING', () => {
    const initialState = {
      ...defaultState,
    };

    const action = {
      type: 'BUILD_VARIABLE_GRAPHS_LOADING',
    };

    const nextState = injuryVariableSettingsReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      graphData: {
        ...initialState.graphData,
        isLoading: true,
      },
    });
  });

  it('returns correct state on BUILD_VARIABLE_GRAPHS_SUCCESS', () => {
    const initialState = {
      ...defaultState,
      graphData: {
        ...defaultState.graphData,
        isLoading: true,
      },
    };

    const action = {
      type: 'BUILD_VARIABLE_GRAPHS_SUCCESS',
      payload: {
        graphData: {
          summary: {
            date_range: {
              end_date: '2020-12-17T23:59:59Z',
              start_date: '2020-11-05T00:00:00Z',
            },
            graph_group: 'summary_bar',
          },
          value: {
            date_range: {
              end_date: '2020-12-15T23:59:59Z',
              start_date: '2020-01-31T00:00:00Z',
            },
            graphGroup: 'value_visualisation',
          },
          total_injuries_no_filtering: 65,
        },
      },
    };

    const nextState = injuryVariableSettingsReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      graphData: {
        ...initialState.graphData,
        isLoading: false,
        summary: {
          date_range: {
            end_date: '2020-12-17T23:59:59Z',
            start_date: '2020-11-05T00:00:00Z',
          },
          graph_group: 'summary_bar',
        },
        value: {
          date_range: {
            end_date: '2020-12-15T23:59:59Z',
            start_date: '2020-01-31T00:00:00Z',
          },
          graphGroup: 'value_visualisation',
        },
        totalInjuries: 65,
      },
    });
  });

  it('returns correct state on FETCH_TCF_GRAPH_DATA_LOADING', () => {
    const initialState = {
      ...defaultState,
      tcfGraphData: {
        ...defaultState.tcfGraphData,
        isLoading: false,
      },
    };

    const action = {
      type: 'FETCH_TCF_GRAPH_DATA_LOADING',
    };

    const nextState = injuryVariableSettingsReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      tcfGraphData: {
        ...initialState.tcfGraphData,
        isLoading: true,
      },
    });
  });

  it('returns correct state on FETCH_TCF_GRAPH_DATA_ERROR', () => {
    const initialState = {
      ...defaultState,
      tcfGraphData: {
        ...defaultState.tcfGraphData,
        isLoading: true,
      },
    };

    const action = {
      type: 'FETCH_TCF_GRAPH_DATA_ERROR',
    };

    const nextState = injuryVariableSettingsReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      tcfGraphData: {
        ...initialState.tcfGraphData,
        isLoading: false,
      },
    });
  });

  it('returns correct state on FETCH_TCF_GRAPH_DATA_SUCCESS', () => {
    const initialState = {
      ...defaultState,
      tcfGraphData: {
        ...defaultState.tcfGraphData,
        isLoading: true,
      },
    };

    const action = {
      type: 'FETCH_TCF_GRAPH_DATA_SUCCESS',
      payload: {
        graphData: [
          {
            name: 'Game time - Acute:Chronic (EWMA) from today - 28:365',
          },
        ],
      },
    };

    const nextState = injuryVariableSettingsReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      tcfGraphData: {
        ...initialState.tcfGraphData,
        isLoading: false,
        graphData: [
          {
            name: 'Game time - Acute:Chronic (EWMA) from today - 28:365',
          },
        ],
      },
    });
  });
});

describe('Risk Advisor Appstatus reducer', () => {
  const defaultState = {
    message: null,
    status: null,
  };

  it('returns correct state on GENERATE_METRIC_LOADING', () => {
    const initialState = {
      ...defaultState,
    };

    const action = {
      type: 'GENERATE_METRIC_LOADING',
    };

    const nextState = appStatusReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      status: 'loading',
    });
  });

  it('returns correct state on TRIGGER_MANUAL_RUN_LOADING', () => {
    const initialState = {
      ...defaultState,
    };

    const action = {
      type: 'TRIGGER_MANUAL_RUN_LOADING',
    };

    const nextState = appStatusReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      status: 'loading',
      message: 'Working...',
    });
  });

  it('returns correct state on GENERATE_METRIC_SUCCESS', () => {
    const initialState = {
      ...defaultState,
    };

    const action = {
      type: 'GENERATE_METRIC_SUCCESS',
    };

    const nextState = appStatusReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      status: 'success',
      message: 'Running...',
    });
  });

  it('returns correct state on UPDATE_VARIABLE_SUCCESS', () => {
    const initialState = {
      ...defaultState,
    };

    const action = {
      type: 'UPDATE_VARIABLE_SUCCESS',
    };

    const nextState = appStatusReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      status: 'success',
      message: 'Metric is updated.',
    });
  });

  it('returns correct state on TRIGGER_MANUAL_RUN_SUCCESS', () => {
    const initialState = {
      ...defaultState,
    };

    const action = {
      type: 'TRIGGER_MANUAL_RUN_SUCCESS',
    };

    const nextState = appStatusReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      status: 'success',
      message: 'Running...',
    });
  });

  it('returns correct state on GENERATE_METRIC_ERROR', () => {
    const initialState = {
      ...defaultState,
    };

    const action = {
      type: 'GENERATE_METRIC_ERROR',
    };

    const nextState = appStatusReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      status: 'error',
    });
  });

  it('returns correct state on HIDE_APP_STATUS', () => {
    const initialState = {
      ...defaultState,
    };

    const action = {
      type: 'HIDE_APP_STATUS',
    };

    const nextState = appStatusReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      status: null,
      message: null,
    });
  });
});

describe('Risk Advisor Generate Metric Status reducer', () => {
  const defaultState = {
    message: null,
    status: null,
  };

  it('returns correct state on SHOW_GENERATE_METRIC_CONFIRMATION', () => {
    const initialState = {
      ...defaultState,
    };

    const action = {
      type: 'SHOW_GENERATE_METRIC_CONFIRMATION',
    };

    const nextState = generateMetricStatusReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      status: 'confirmWithTitle',
      title: 'Generate Injury risk metric',
      message:
        'This multivariate analysis could take a number of hours. You will not be able to create any metrics whilst the metric is being generated.',
    });
  });

  it('returns correct state on HIDE_APP_STATUS', () => {
    const initialState = {
      ...defaultState,
    };

    const action = {
      type: 'HIDE_APP_STATUS',
    };

    const nextState = generateMetricStatusReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      status: null,
      message: null,
      title: null,
    });
  });
});
