import $ from 'jquery';

import {
  selectInjuryVariable,
  addNewInjuryVariable,
  confirmCancelEditInjuryVariable,
  changeDateRange,
  selectPositionGroups,
  selectExposures,
  selectMechanisms,
  selectBodyArea,
  openRenameVariableModal,
  closeRenameVariableModal,
  updateVariableName,
  generateMetric,
  updateVariable,
  triggerToastProgress,
  triggerToastError,
  setVariableStatus,
  updateRenameVariableName,
  buildVariableGraphsSuccess,
  buildVariableGraphs,
  fetchVariables,
  updateVariableSuccess,
  fetchVariablesSuccess,
  triggerManualRun,
  toggleHideVariable,
  selectPipelineArn,
  toggleDataSourcePanel,
  saveDataSources,
  fetchTCFGraphDataSuccess,
  fetchTCFGraphData,
  selectSeverities,
} from '../actions';

import injuryVariablesDummyData from '../../resources/injuryVariablesDummyData';
import {
  summaryBarDummyData,
  valueVisualisationDummyData,
} from '../../resources/graphDummyData';

// Mock jQuery
jest.mock('jquery', () => {
  const mockJQuery = jest.fn().mockReturnValue({
    attr: jest.fn().mockReturnValue('mock-csrf-token'),
  });
  mockJQuery.ajax = jest.fn();
  return mockJQuery;
});

describe('Risk Advisor Actions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Action Creators', () => {
    it('has the correct action SELECT_INJURY_VARIABLE', () => {
      const expectedAction = {
        type: 'SELECT_INJURY_VARIABLE',
        payload: {
          variableId: '1234',
        },
      };

      expect(selectInjuryVariable('1234')).toEqual(expectedAction);
    });

    it('has the correct action ADD_NEW_INJURY_VARIABLE', () => {
      const expectedAction = {
        type: 'ADD_NEW_INJURY_VARIABLE',
      };

      expect(addNewInjuryVariable()).toEqual(expectedAction);
    });

    it('has the correct action CONFIRM_CANCEL_EDIT_INJURY_VARIABLE', () => {
      const expectedAction = {
        type: 'CONFIRM_CANCEL_EDIT_INJURY_VARIABLE',
      };

      expect(confirmCancelEditInjuryVariable()).toEqual(expectedAction);
    });

    it('has the correct action OPEN_RENAME_VARIABLE_MODAL', () => {
      const expectedAction = {
        type: 'OPEN_RENAME_VARIABLE_MODAL',
        payload: {
          isTriggeredBySave: false,
          variableName: 'Metric 1',
        },
      };

      expect(openRenameVariableModal(false, 'Metric 1')).toEqual(
        expectedAction
      );
    });

    it('has the correct action TOGGLE_DATA_SOURCE_PANEL', () => {
      const expectedAction = {
        type: 'TOGGLE_DATA_SOURCE_PANEL',
      };

      expect(toggleDataSourcePanel()).toEqual(expectedAction);
    });

    it('has the correct action SAVE_DATA_SOURCES', () => {
      const expectedAction = {
        type: 'SAVE_DATA_SOURCES',
        payload: {
          excludedSources: ['kitman', 'catapult'],
        },
      };

      expect(saveDataSources(['kitman', 'catapult'])).toEqual(expectedAction);
    });

    it('has the correct action CLOSE_RENAME_VARIABLE_MODAL', () => {
      const expectedAction = {
        type: 'CLOSE_RENAME_VARIABLE_MODAL',
      };

      expect(closeRenameVariableModal()).toEqual(expectedAction);
    });

    it('has the correct action CHANGE_DATE_RANGE', () => {
      const expectedAction = {
        type: 'CHANGE_DATE_RANGE',
        payload: {
          dateRange: {
            start_date: '2020-06-10T23:00:00Z',
            end_date: '2020-07-23T22:59:59Z',
          },
        },
      };

      expect(
        changeDateRange({
          start_date: '2020-06-10T23:00:00Z',
          end_date: '2020-07-23T22:59:59Z',
        })
      ).toEqual(expectedAction);
    });

    it('has the correct action SELECT_POSITION_GROUPS', () => {
      const expectedAction = {
        type: 'SELECT_POSITION_GROUPS',
        payload: {
          positionGroupId: [23],
        },
      };

      expect(selectPositionGroups([23])).toEqual(expectedAction);
    });

    it('has the correct action SELECT_SEVERITIES', () => {
      const expectedAction = {
        type: 'SELECT_SEVERITIES',
        payload: {
          severityId: ['severe'],
        },
      };

      expect(selectSeverities(['severe'])).toEqual(expectedAction);
    });

    it('has the correct action SELECT_EXPOSURES', () => {
      const expectedAction = {
        type: 'SELECT_EXPOSURES',
        payload: {
          exposureId: ['fixtures'],
        },
      };

      expect(selectExposures(['fixtures'])).toEqual(expectedAction);
    });

    it('has the correct action SELECT_MECHANISMS', () => {
      const expectedAction = {
        type: 'SELECT_MECHANISMS',
        payload: {
          mechanismId: ['contact'],
        },
      };

      expect(selectMechanisms(['contact'])).toEqual(expectedAction);
    });

    it('has the correct action SELECT_BODY_AREA', () => {
      const expectedAction = {
        type: 'SELECT_BODY_AREA',
        payload: {
          bodyAreaId: [1, 2],
        },
      };

      expect(selectBodyArea([1, 2])).toEqual(expectedAction);
    });

    it('has the correct action UPDATE_VARIABLE_NAME', () => {
      const expectedAction = {
        type: 'UPDATE_VARIABLE_NAME',
        payload: {
          variableName: 'New Name',
        },
      };

      expect(updateVariableName('New Name')).toEqual(expectedAction);
    });

    it('has the correct action TOGGLE_HIDE_VARIABLE', () => {
      const expectedAction = {
        type: 'TOGGLE_HIDE_VARIABLE',
        payload: {
          isChecked: true,
        },
      };

      expect(toggleHideVariable(true)).toEqual(expectedAction);
    });

    it('has the correct action SELECT_PIPELINE_ARN', () => {
      const expectedAction = {
        type: 'SELECT_PIPELINE_ARN',
        payload: {
          arn: 'new ARN',
        },
      };

      expect(selectPipelineArn('new ARN')).toEqual(expectedAction);
    });

    it('has the correct action UPDATE_RENAME_VARIABLE_NAME', () => {
      const expectedAction = {
        type: 'UPDATE_RENAME_VARIABLE_NAME',
        payload: {
          variableName: 'New Name',
        },
      };

      expect(updateRenameVariableName('New Name')).toEqual(expectedAction);
    });

    it('has the correct action TRIGGER_TOAST_PROGRESS', () => {
      const expectedAction = {
        type: 'TRIGGER_TOAST_PROGRESS',
      };

      expect(triggerToastProgress()).toEqual(expectedAction);
    });

    it('has the correct action TRIGGER_TOAST_ERROR', () => {
      const expectedAction = {
        type: 'TRIGGER_TOAST_ERROR',
      };

      expect(triggerToastError()).toEqual(expectedAction);
    });

    it('has the correct action SET_VARIABLE_STATUS', () => {
      const expectedAction = {
        type: 'SET_VARIABLE_STATUS',
        payload: {
          status: 'PROGRESS',
        },
      };

      expect(setVariableStatus('PROGRESS')).toEqual(expectedAction);
    });

    it('has the correct action UPDATE_VARIABLE_SUCCESS', () => {
      const expectedAction = {
        type: 'UPDATE_VARIABLE_SUCCESS',
        payload: {
          isArchived: true,
          newVariableName: 'new name',
        },
      };

      expect(updateVariableSuccess(true, 'new name')).toEqual(expectedAction);
    });

    it('has the correct action FETCH_VARIABLES_SUCCESS', () => {
      const expectedAction = {
        type: 'FETCH_VARIABLES_SUCCESS',
        payload: {
          newVariables: [{ name: 'new variable', id: 1234 }],
          responseVariable: { id: 1, variable_uuid: 1234 },
        },
      };

      expect(
        fetchVariablesSuccess([{ name: 'new variable', id: 1234 }], {
          id: 1,
          variable_uuid: 1234,
        })
      ).toEqual(expectedAction);
    });

    it('has the correct action BUILD_VARIABLE_GRAPHS_SUCCESS', () => {
      const responseData = {
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
      };
      const expectedAction = {
        type: 'BUILD_VARIABLE_GRAPHS_SUCCESS',
        payload: {
          graphData: responseData,
        },
      };

      expect(buildVariableGraphsSuccess(responseData)).toEqual(expectedAction);
    });

    it('has the correct action FETCH_TCF_GRAPH_DATA_SUCCESS', () => {
      const expectedAction = {
        type: 'FETCH_TCF_GRAPH_DATA_SUCCESS',
        payload: {
          graphData: [
            { name: 'Game time - Acute:Chronic (EWMA) from today - 28:365' },
          ],
        },
      };

      expect(
        fetchTCFGraphDataSuccess([
          { name: 'Game time - Acute:Chronic (EWMA) from today - 28:365' },
        ])
      ).toEqual(expectedAction);
    });
  });

  describe('Thunk Actions', () => {
    describe('when generating a metric from a variable', () => {
      const mockGetState = jest.fn();
      const mockDispatch = jest.fn();
      const currentVariableData = { ...injuryVariablesDummyData[0] };

      beforeEach(() => {
        $.ajax = jest.fn();
        jest.clearAllMocks();
      });

      it('sends the correct data when the user is not kitman admin', () => {
        mockGetState.mockReturnValue({
          injuryVariableSettings: {
            allVariables: [...injuryVariablesDummyData],
            currentVariable: currentVariableData,
            staticData: {
              isKitmanAdmin: false,
            },
            graphData: {
              summary: {
                date_range: {
                  end_date: '2020-12-17T23:59:59Z',
                  start_date: '2020-11-05T00:00:00Z',
                },
                graph_group: 'summary_bar',
                metrics: [
                  {
                    series: [
                      {
                        datapoints: [
                          { name: 'Nov', y: 0 },
                          { name: 'Dec', y: 0 },
                        ],
                        name: 'No of injuries',
                      },
                    ],
                    type: 'metric',
                  },
                ],
              },
              value: {
                date_range: {
                  end_date: '2020-12-15T23:59:59Z',
                  start_date: '2020-01-31T00:00:00Z',
                },
                graphGroup: 'value_visualisation',
                metrics: [
                  {
                    series: [
                      {
                        name: 'Total_injuries',
                        population_id: null,
                        population_type: null,
                        value: 0,
                      },
                    ],
                    type: 'metric',
                  },
                ],
              },
            },
          },
        });

        $.ajax.mockImplementation(() => ({
          done: (callback) => {
            callback('OK');
            return { fail: () => {} };
          },
          fail: () => {},
        }));

        const thunk = generateMetric();
        thunk(mockDispatch, mockGetState);

        expect(mockDispatch).toHaveBeenCalledWith({
          type: 'GENERATE_METRIC_LOADING',
        });

        expect($.ajax).toHaveBeenCalledWith({
          method: 'POST',
          url: '/settings/injury_risk_variables',
          headers: {
            'X-CSRF-Token': 'mock-csrf-token',
          },
          contentType: 'application/json',
          data: JSON.stringify({
            name: currentVariableData.name,
            excluded_sources: [],
            excluded_variables: [],
            filter: {
              position_group_ids: currentVariableData.filter.position_group_ids,
              exposure_types: currentVariableData.filter.exposure_types,
              mechanisms: currentVariableData.filter.mechanisms,
              osics_body_area_ids:
                currentVariableData.filter.osics_body_area_ids,
              severity: currentVariableData.filter.severity,
            },
            enabled_for_prediction: currentVariableData.enabled_for_prediction,
            date_range: {
              start_date: currentVariableData.date_range.start_date,
              end_date: currentVariableData.date_range.end_date,
            },
            snapshot: {
              filter: null,
              summary: mockGetState().injuryVariableSettings.graphData.summary,
              value: mockGetState().injuryVariableSettings.graphData.value,
              total_injuries_no_filtering: undefined,
            },
            is_hidden: currentVariableData.is_hidden,
            pipeline_arn: null,
          }),
        });

        expect(mockDispatch).toHaveBeenCalledWith({
          type: 'GENERATE_METRIC_SUCCESS',
        });
      });

      it('sends the correct data when the user is kitman admin', () => {
        mockGetState.mockReturnValue({
          injuryVariableSettings: {
            allVariables: [...injuryVariablesDummyData],
            currentVariable: currentVariableData,
            staticData: {
              isKitmanAdmin: true,
            },
            graphData: {
              summary: {
                date_range: {
                  end_date: '2020-12-17T23:59:59Z',
                  start_date: '2020-11-05T00:00:00Z',
                },
                graph_group: 'summary_bar',
                metrics: [
                  {
                    series: [
                      {
                        datapoints: [
                          { name: 'Nov', y: 0 },
                          { name: 'Dec', y: 0 },
                        ],
                        name: 'No of injuries',
                      },
                    ],
                    type: 'metric',
                  },
                ],
              },
              value: {
                date_range: {
                  end_date: '2020-12-15T23:59:59Z',
                  start_date: '2020-01-31T00:00:00Z',
                },
                graphGroup: 'value_visualisation',
                metrics: [
                  {
                    series: [
                      {
                        name: 'Total_injuries',
                        population_id: null,
                        population_type: null,
                        value: 0,
                      },
                    ],
                    type: 'metric',
                  },
                ],
              },
            },
          },
        });

        $.ajax.mockImplementation(() => ({
          done: (callback) => {
            callback('OK');
            return { fail: () => {} };
          },
          fail: () => {},
        }));

        const thunk = generateMetric();
        thunk(mockDispatch, mockGetState);

        const ajaxCallConfig = $.ajax.mock.calls[0][0];
        const sentData = JSON.parse(ajaxCallConfig.data);

        expect(sentData.pipeline_arn).toBe(currentVariableData.pipeline_arn);
      });
    });

    describe('When generating a metric from variable fails', () => {
      const mockGetState = jest.fn();
      const mockDispatch = jest.fn();
      const currentVariableData = { ...injuryVariablesDummyData[0] };

      beforeEach(() => {
        $.ajax = jest.fn();
        jest.clearAllMocks();
      });

      it('dispatches the correct action', () => {
        mockGetState.mockReturnValue({
          injuryVariableSettings: {
            allVariables: [...injuryVariablesDummyData],
            currentVariable: currentVariableData,
            staticData: {
              isKitmanAdmin: false,
            },
            graphData: {
              summary: {
                date_range: {
                  end_date: '2020-12-17T23:59:59Z',
                  start_date: '2020-11-05T00:00:00Z',
                },
                graph_group: 'summary_bar',
                metrics: [
                  {
                    series: [
                      {
                        datapoints: [
                          { name: 'Nov', y: 0 },
                          { name: 'Dec', y: 0 },
                        ],
                        name: 'No of injuries',
                      },
                    ],
                    type: 'metric',
                  },
                ],
              },
              value: {
                date_range: {
                  end_date: '2020-12-15T23:59:59Z',
                  start_date: '2020-01-31T00:00:00Z',
                },
                graphGroup: 'value_visualisation',
                metrics: [
                  {
                    series: [
                      {
                        name: 'Total_injuries',
                        population_id: null,
                        population_type: null,
                        value: 0,
                      },
                    ],
                    type: 'metric',
                  },
                ],
              },
            },
          },
        });

        $.ajax.mockImplementation(() => ({
          done: () => ({ fail: (callback) => callback() }),
          fail: (callback) => callback(),
        }));

        const thunk = generateMetric();
        thunk(mockDispatch, mockGetState);

        expect(mockDispatch).toHaveBeenCalledWith({
          type: 'GENERATE_METRIC_LOADING',
        });
        expect(mockDispatch).toHaveBeenCalledWith({
          type: 'GENERATE_METRIC_ERROR',
        });
        expect(mockDispatch).toHaveBeenCalledWith({
          type: 'SET_VARIABLE_STATUS',
          payload: { status: 'failed' },
        });
      });
    });

    describe('when updating a variable', () => {
      const mockGetState = jest.fn();
      const mockDispatch = jest.fn();
      const currentVariableData = { ...injuryVariablesDummyData[0] };

      beforeEach(() => {
        $.ajax = jest.fn();
        jest.clearAllMocks();
      });

      it('sends the correct data', () => {
        mockGetState.mockReturnValue({
          injuryVariableSettings: {
            allVariables: [...injuryVariablesDummyData],
            currentVariable: currentVariableData,
            renameVariableModal: {
              isOpen: false,
              isTriggeredBySave: false,
              variableName: null,
            },
          },
        });

        $.ajax.mockImplementation(() => ({
          done: (callback) => {
            callback('OK');
            return { fail: () => {} };
          },
          fail: () => {},
        }));

        const thunk = updateVariable('SET_ARCHIVED');
        thunk(mockDispatch, mockGetState);

        expect(mockDispatch).toHaveBeenCalledWith({
          type: 'UPDATE_VARIABLE_LOADING',
        });

        expect($.ajax).toHaveBeenCalledWith({
          method: 'PUT',
          url: `/settings/injury_risk_variables/${currentVariableData.id}`,
          headers: {
            'X-CSRF-Token': 'mock-csrf-token',
          },
          contentType: 'application/json',
          data: JSON.stringify({
            archived: !currentVariableData.archived,
            name: currentVariableData.name,
          }),
        });

        expect(mockDispatch).toHaveBeenCalledWith({
          type: 'UPDATE_VARIABLE_SUCCESS',
          payload: {
            isArchived: !currentVariableData.archived,
            newVariableName: currentVariableData.name,
          },
        });
      });
    });

    describe('When updating a variable fails', () => {
      const mockGetState = jest.fn();
      const mockDispatch = jest.fn();
      const currentVariableData = { ...injuryVariablesDummyData[0] };

      beforeEach(() => {
        $.ajax = jest.fn();
        jest.clearAllMocks();
      });

      it('dispatches the correct action', () => {
        mockGetState.mockReturnValue({
          injuryVariableSettings: {
            allVariables: [...injuryVariablesDummyData],
            currentVariable: currentVariableData,
            renameVariableModal: {
              isOpen: false,
              isTriggeredBySave: false,
              variableName: null,
            },
          },
        });

        $.ajax.mockImplementation(() => ({
          done: () => ({ fail: (callback) => callback() }),
          fail: (callback) => callback(),
        }));

        const thunk = updateVariable();
        thunk(mockDispatch, mockGetState);

        expect(mockDispatch).toHaveBeenCalledWith({
          type: 'UPDATE_VARIABLE_LOADING',
        });
        expect(mockDispatch).toHaveBeenCalledWith({
          type: 'UPDATE_VARIABLE_ERROR',
        });
      });
    });

    describe('when building a graph', () => {
      const mockGetState = jest.fn();
      const mockDispatch = jest.fn();
      const currentVariableData = { ...injuryVariablesDummyData[0] };

      beforeEach(() => {
        $.ajax = jest.fn();
        jest.clearAllMocks();
      });

      it('sends the correct data', () => {
        mockGetState.mockReturnValue({
          injuryVariableSettings: {
            allVariables: [...injuryVariablesDummyData],
            currentVariable: currentVariableData,
            graphData: {
              summary: null,
              value: null,
            },
          },
        });

        $.ajax.mockImplementation(() => ({
          done: (callback) => {
            callback({
              summary: summaryBarDummyData,
              value: valueVisualisationDummyData,
            });
            return { fail: () => {} };
          },
          fail: () => {},
        }));

        const thunk = buildVariableGraphs();
        thunk(mockDispatch, mockGetState);

        expect(mockDispatch).toHaveBeenCalledWith({
          type: 'BUILD_VARIABLE_GRAPHS_LOADING',
        });

        expect($.ajax).toHaveBeenCalledWith({
          method: 'POST',
          url: '/settings/injury_risk_variables/build',
          headers: {
            'X-CSRF-Token': 'mock-csrf-token',
          },
          contentType: 'application/json',
          data: JSON.stringify({
            filter: {
              position_group_ids: currentVariableData.filter.position_group_ids,
              exposure_types: currentVariableData.filter.exposure_types,
              mechanisms: currentVariableData.filter.mechanisms,
              osics_body_area_ids:
                currentVariableData.filter.osics_body_area_ids,
              severity: currentVariableData.filter.severity,
            },
            date_range: {
              start_date: currentVariableData.date_range.start_date,
              end_date: currentVariableData.date_range.end_date,
            },
          }),
        });

        expect(mockDispatch).toHaveBeenCalledWith({
          type: 'BUILD_VARIABLE_GRAPHS_SUCCESS',
          payload: {
            graphData: {
              summary: summaryBarDummyData,
              value: valueVisualisationDummyData,
            },
          },
        });
      });
    });

    describe('When building a graph fails', () => {
      const mockGetState = jest.fn();
      const mockDispatch = jest.fn();
      const currentVariableData = { ...injuryVariablesDummyData[0] };

      beforeEach(() => {
        $.ajax = jest.fn();
        jest.clearAllMocks();
      });

      it('dispatches the correct action', () => {
        mockGetState.mockReturnValue({
          injuryVariableSettings: {
            allVariables: [...injuryVariablesDummyData],
            currentVariable: currentVariableData,
            graphData: {
              summary: null,
              value: null,
            },
          },
        });

        $.ajax.mockImplementation(() => ({
          done: () => ({ fail: (callback) => callback() }),
          fail: (callback) => callback(),
        }));

        const thunk = buildVariableGraphs();
        thunk(mockDispatch, mockGetState);

        expect(mockDispatch).toHaveBeenCalledWith({
          type: 'BUILD_VARIABLE_GRAPHS_LOADING',
        });
        expect(mockDispatch).toHaveBeenCalledWith({
          type: 'BUILD_VARIABLE_GRAPHS_ERROR',
        });
      });
    });

    describe('when fetching variable data', () => {
      const mockGetState = jest.fn();
      const mockDispatch = jest.fn();

      beforeEach(() => {
        $.ajax = jest.fn();
        jest.clearAllMocks();
      });

      it('sends the correct data', () => {
        mockGetState.mockReturnValue({
          injuryVariableSettings: {
            allVariables: [],
            currentVariable: {
              id: null,
              name: '',
              date_range: {
                start_date: '2020-06-10T23:00:00Z',
                end_date: '2020-06-15T23:00:00Z',
              },
              filter: {
                position_group_ids: [],
                exposure_types: [],
                mechanisms: [],
                osics_body_area_ids: [],
              },
              enabled_for_prediction: true,
              created_by: {
                id: null,
                fullname: null,
              },
              created_at: null,
              archived: false,
              status: null,
            },
            graphData: {
              summary: null,
              value: null,
            },
          },
        });

        $.ajax.mockImplementation(() => ({
          done: (callback) => {
            callback([{ ...injuryVariablesDummyData }]);
            return { fail: () => {} };
          },
          fail: () => {},
        }));

        const thunk = fetchVariables();
        thunk(mockDispatch, mockGetState);

        expect(mockDispatch).toHaveBeenCalledWith({
          type: 'FETCH_VARIABLES_LOADING',
        });

        expect($.ajax).toHaveBeenCalledWith({
          method: 'GET',
          url: '/settings/injury_risk_variables',
          contentType: 'application/json',
        });

        expect(mockDispatch).toHaveBeenCalledWith({
          type: 'FETCH_VARIABLES_SUCCESS',
          payload: {
            newVariables: [{ ...injuryVariablesDummyData }],
            responseVariable: undefined,
          },
        });
      });
    });

    describe('When fetching variable data fails', () => {
      const mockGetState = jest.fn();
      const mockDispatch = jest.fn();

      beforeEach(() => {
        $.ajax = jest.fn();
        jest.clearAllMocks();
      });

      it('dispatches the correct action', () => {
        mockGetState.mockReturnValue({
          injuryVariableSettings: {
            allVariables: [],
            currentVariable: {
              id: null,
              name: '',
              date_range: {
                start_date: '2020-06-10T23:00:00Z',
                end_date: '2020-06-15T23:00:00Z',
              },
              filter: {
                position_group_ids: [],
                exposure_types: [],
                mechanisms: [],
                osics_body_area_ids: [],
              },
              enabled_for_prediction: true,
              created_by: {
                id: null,
                fullname: null,
              },
              created_at: null,
              archived: false,
              status: null,
            },
            graphData: {
              summary: null,
              value: null,
            },
          },
        });

        $.ajax.mockImplementation(() => ({
          done: () => ({ fail: (callback) => callback() }),
          fail: (callback) => callback(),
        }));

        const thunk = fetchVariables();
        thunk(mockDispatch, mockGetState);

        expect(mockDispatch).toHaveBeenCalledWith({
          type: 'FETCH_VARIABLES_LOADING',
        });
        expect(mockDispatch).toHaveBeenCalledWith({
          type: 'FETCH_VARIABLES_ERROR',
        });
      });
    });

    describe('when running the predictions manually', () => {
      const mockGetState = jest.fn();
      const mockDispatch = jest.fn();

      beforeEach(() => {
        $.ajax = jest.fn();
        jest.clearAllMocks();
      });

      it('sends the correct data', () => {
        const currentVariable = { id: '123' };
        mockGetState.mockReturnValue({
          injuryVariableSettings: {
            currentVariable,
          },
        });

        $.ajax.mockImplementation(() => ({
          done: (callback) => {
            callback({ injury_risk_variable: { id: '123' } });
            return { fail: () => {} };
          },
          fail: () => {},
        }));

        const thunk = triggerManualRun();
        thunk(mockDispatch, mockGetState);

        expect(mockDispatch).toHaveBeenCalledWith({
          type: 'TRIGGER_MANUAL_RUN_LOADING',
        });

        expect($.ajax).toHaveBeenCalledWith({
          method: 'POST',
          url: `/settings/injury_risk_variables/${currentVariable.id}/start_prediction`,
          headers: {
            'X-CSRF-Token': 'mock-csrf-token',
          },
          contentType: 'application/json',
        });

        expect(mockDispatch).toHaveBeenCalledWith({
          type: 'TRIGGER_MANUAL_RUN_SUCCESS',
        });
      });
    });

    describe('When running the predictions manually fails', () => {
      const mockGetState = jest.fn();
      const mockDispatch = jest.fn();

      beforeEach(() => {
        $.ajax = jest.fn();
        jest.clearAllMocks();
      });

      it('dispatches the correct action', () => {
        const currentVariable = { id: '123' };
        mockGetState.mockReturnValue({
          injuryVariableSettings: {
            currentVariable,
          },
        });

        $.ajax.mockImplementation(() => ({
          done: () => ({ fail: (callback) => callback() }),
          fail: (callback) => callback(),
        }));

        const thunk = triggerManualRun();
        thunk(mockDispatch, mockGetState);

        expect(mockDispatch).toHaveBeenCalledWith({
          type: 'TRIGGER_MANUAL_RUN_LOADING',
        });
        expect(mockDispatch).toHaveBeenCalledWith({
          type: 'TRIGGER_MANUAL_RUN_ERROR',
        });
      });
    });

    describe('when fetching Top Contributing Factors graph data', () => {
      const mockDispatch = jest.fn();
      const injuryRiskVariableUuid = 'test-uuid';

      beforeEach(() => {
        $.ajax = jest.fn();
        jest.clearAllMocks();
      });

      it('sends the correct data', () => {
        $.ajax.mockImplementation(() => ({
          done: (callback) => {
            callback([{ name: 'test factor' }]);
            return { fail: () => {} };
          },
          fail: () => {},
        }));

        const thunk = fetchTCFGraphData(injuryRiskVariableUuid);
        thunk(mockDispatch);

        expect(mockDispatch).toHaveBeenCalledWith({
          type: 'FETCH_TCF_GRAPH_DATA_LOADING',
        });

        expect($.ajax).toHaveBeenCalledWith({
          method: 'GET',
          url: `/administration/injury_risk_variables/${injuryRiskVariableUuid}/injury_risk_top_contributing_factors`,
          contentType: 'application/json',
        });

        expect(mockDispatch).toHaveBeenCalledWith({
          type: 'FETCH_TCF_GRAPH_DATA_SUCCESS',
          payload: {
            graphData: [{ name: 'test factor' }],
          },
        });
      });
    });

    describe('When fetching Top Contributing Factors graph data fails', () => {
      const mockDispatch = jest.fn();
      const injuryRiskVariableUuid = 'test-uuid';

      beforeEach(() => {
        $.ajax = jest.fn();
        jest.clearAllMocks();
      });

      it('dispatches the correct action', () => {
        $.ajax.mockImplementation(() => ({
          done: () => ({ fail: (callback) => callback() }),
          fail: (callback) => callback(),
        }));

        const thunk = fetchTCFGraphData(injuryRiskVariableUuid);
        thunk(mockDispatch);

        expect(mockDispatch).toHaveBeenCalledWith({
          type: 'FETCH_TCF_GRAPH_DATA_LOADING',
        });
        expect(mockDispatch).toHaveBeenCalledWith({
          type: 'FETCH_TCF_GRAPH_DATA_ERROR',
        });
      });
    });
  });
});
