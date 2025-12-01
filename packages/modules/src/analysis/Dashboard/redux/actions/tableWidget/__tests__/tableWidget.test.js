import sinon from 'sinon';
import colors from '@kitman/common/src/variables/colors';
import {
  openTableColumnFormattingPanel,
  openScorecardTableFormattingPanel,
  toggleTableFormattingPanel,
  addEditTableRowLoading,
  addTableRowSuccess,
  addTableRowFailure,
  addTableColumnSuccess,
  addTableColumnFailure,
  setTableColumnTimePeriodLength,
  setTableColumnTimePeriodLengthOffset,
  deleteTableColumnLoading,
  deleteTableColumnSuccess,
  deleteTableColumnFailure,
  deleteTableRowLoading,
  deleteTableRowFailure,
  deleteTableRowSuccess,
  updateFormattingRuleType,
  updateFormattingRuleCondition,
  updateFormattingRuleValue,
  updateFormattingRuleColor,
  addFormattingRule,
  removeFormattingRule,
  saveTableFormattingLoading,
  saveScorecardTableFormattingSuccess,
  saveTableFormattingFailure,
  saveComparisonTableFormatting,
  saveScorecardTableFormatting,
  changeColumnSummaryLoading,
  changeColumnSummarySuccess,
  changeColumnSummaryFailure,
  changeColumnSummary,
  lockColumnPivotLoading,
  lockColumnPivotSuccess,
  lockColumnPivotFailure,
  lockColumnPivot,
  deleteTableColumn,
  deleteTableRow,
  updateTableNameSuccess,
  updateTableNameFailure,
  updateTableName,
  updateSummaryVisibilityLoading,
  updateSummaryVisibilitySuccess,
  updateSummaryVisibilityFailure,
  updateSummaryVisibility,
  duplicateColumnIsLoading,
  duplicateColumnSuccess,
  duplicateColumnError,
  clearDuplicateColumnError,
  duplicateTableColumn,
  setColumnWidthType,
  setColumnWidthTypeRequest,
  setTableSortOrder,
  setTableSortOrderRequest,
  updateColumnConfig,
  updateColumnConfigRequest,
  updateRowConfig,
  updateRowConfigRequest,
  setTableElementFilter,
  addMultipleTableRowSuccess,
} from '../index';
/* eslint-disable jest/no-mocks-import */
import {
  COMPARISON_WIDGET_MOCK,
  LONGITUDINAL_WIDGET_MOCK,
  SCORECARD_WIDGET_MOCK,
} from '../../../__mocks__/tableWidget';

describe('Table Widget Actions', () => {
  it('has the correct action OPEN_TABLE_COLUMN_FORMATTING_PANEL', () => {
    const expectedAction = {
      type: 'OPEN_TABLE_COLUMN_FORMATTING_PANEL',
      payload: {
        existingTableColumns: [
          {
            id: 1,
            name: 'test',
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
        tableContainerId: 123,
        tableType: 'COMPARISON',
        widgetId: 312,
        columnId: 1,
        columnName: 'Sleep',
        columnUnit: 'hours',
        appliedFormat: [
          {
            type: 'numeric',
            condition: 'equal_to',
            value: 300,
            color: colors.black_100,
          },
        ],
      },
    };

    expect(
      openTableColumnFormattingPanel(
        [
          {
            id: 1,
            name: 'test',
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
        123,
        'COMPARISON',
        312,
        1,
        'Sleep',
        'hours',
        [
          {
            type: 'numeric',
            condition: 'equal_to',
            value: 300,
            color: colors.black_100,
          },
        ]
      )
    ).toStrictEqual(expectedAction);
  });

  it('has the correct action OPEN_SCORECARD_TABLE_FORMATTING_PANEL', () => {
    const expectedAction = {
      type: 'OPEN_SCORECARD_TABLE_FORMATTING_PANEL',
      payload: {
        existingTableMetrics: [
          {
            id: 1,
            name: 'test',
            source: 'kitman:tv',
            variable: 'variable',
            summary: 'mean',
          },
        ],
        tableContainerId: 123,
        widgetId: 312,
        rowMetricId: 1,
        metricName: 'Sleep',
        metricUnit: 'hours',
        appliedFormat: [
          {
            type: 'numeric',
            condition: 'equal_to',
            value: 300,
            color: colors.black_100,
          },
        ],
      },
    };

    expect(
      openScorecardTableFormattingPanel(
        [
          {
            id: 1,
            name: 'test',
            source: 'kitman:tv',
            variable: 'variable',
            summary: 'mean',
          },
        ],
        123,
        312,
        1,
        'Sleep',
        'hours',
        [
          {
            type: 'numeric',
            condition: 'equal_to',
            value: 300,
            color: colors.black_100,
          },
        ]
      )
    ).toStrictEqual(expectedAction);
  });

  it('has the correct action TOGGLE_TABLE_FORMATTING_PANEL', () => {
    const expectedAction = {
      type: 'TOGGLE_TABLE_FORMATTING_PANEL',
    };

    expect(toggleTableFormattingPanel()).toStrictEqual(expectedAction);
  });

  it('has the correct action ADD_EDIT_TABLE_ROW_LOADING', () => {
    const expectedAction = {
      type: 'ADD_EDIT_TABLE_ROW_LOADING',
    };

    expect(addEditTableRowLoading()).toStrictEqual(expectedAction);
  });

  it('has the correct action ADD_TABLE_ROW_FAILURE', () => {
    const expectedAction = {
      type: 'ADD_TABLE_ROW_FAILURE',
    };

    expect(addTableRowFailure()).toStrictEqual(expectedAction);
  });

  it('has the correct action ADD_TABLE_ROW_SUCCESS', () => {
    const expectedAction = {
      type: 'ADD_TABLE_ROW_SUCCESS',
      payload: {
        widgetId: 1,
        newRow: {
          config: null,
          id: 23,
          name: 'Test Name',
          order: 1,
          population: {
            applies_to_squad: true,
            position_groups: [],
            positions: [],
            athletes: [],
            all_squads: false,
            squads: [],
          },
          row_id: '123456787654323456',
          table_element: null,
          time_scope: {
            end_time: null,
            start_time: null,
            time_period: 'this_season',
            time_period_length: null,
            time_period_length_offset: null,
          },
        },
      },
    };

    expect(
      addTableRowSuccess(1, {
        config: null,
        id: 23,
        name: 'Test Name',
        order: 1,
        population: {
          applies_to_squad: true,
          position_groups: [],
          positions: [],
          athletes: [],
          all_squads: false,
          squads: [],
        },
        row_id: '123456787654323456',
        table_element: null,
        time_scope: {
          end_time: null,
          start_time: null,
          time_period: 'this_season',
          time_period_length: null,
          time_period_length_offset: null,
        },
      })
    ).toStrictEqual(expectedAction);
  });

  it('has the correct action ADD_MULTIPLE_TABLE_ROW_SUCCESS', () => {
    const newRows = [
      {
        config: null,
        id: 23,
        name: 'Test Name',
        order: 1,
        population: {
          applies_to_squad: true,
          position_groups: [],
          positions: [],
          athletes: [],
          all_squads: false,
          squads: [],
        },
        row_id: '123456787654323456',
        table_element: null,
        time_scope: {
          end_time: null,
          start_time: null,
          time_period: 'this_season',
          time_period_length: null,
          time_period_length_offset: null,
        },
      },
      {
        config: null,
        id: 23,
        name: 'Test Name 2',
        order: 2,
        population: {
          applies_to_squad: true,
          position_groups: [],
          positions: [],
          athletes: [],
          all_squads: false,
          squads: [],
        },
        row_id: '123456787654323457',
        table_element: null,
        time_scope: {
          end_time: null,
          start_time: null,
          time_period: 'this_season',
          time_period_length: null,
          time_period_length_offset: null,
        },
      },
    ];
    const expectedAction = {
      type: 'ADD_MULTIPLE_TABLE_ROW_SUCCESS',
      payload: {
        widgetId: 1,
        newRows: [...newRows],
      },
    };

    expect(addMultipleTableRowSuccess(1, newRows)).toStrictEqual(
      expectedAction
    );
  });

  it('has the correct action ADD_TABLE_COLUMN_SUCCESS', () => {
    const expectedAction = {
      type: 'ADD_TABLE_COLUMN_SUCCESS',
      payload: {
        widgetId: 90,
        newColumn: { id: 12 },
      },
    };

    expect(addTableColumnSuccess(90, { id: 12 })).toStrictEqual(expectedAction);
  });

  it('has the correct action ADD_TABLE_COLUMN_FAILURE', () => {
    const expectedAction = {
      type: 'ADD_TABLE_COLUMN_FAILURE',
    };

    expect(addTableColumnFailure()).toStrictEqual(expectedAction);
  });

  it('has the correct action SET_TABLE_ELEMENT_FILTER', () => {
    expect(
      setTableElementFilter('column', 'competitions', [123])
    ).toStrictEqual({
      type: 'SET_TABLE_ELEMENT_FILTER',
      payload: {
        panel: 'column',
        filter: 'competitions',
        value: [123],
      },
    });

    expect(setTableElementFilter('row', 'event_types', ['game'])).toStrictEqual(
      {
        type: 'SET_TABLE_ELEMENT_FILTER',
        payload: {
          panel: 'row',
          filter: 'event_types',
          value: ['game'],
        },
      }
    );
  });

  it('has the correct action SET_TABLE_COLUMN_TIME_PERIOD_LENGTH', () => {
    const expectedAction = {
      type: 'SET_TABLE_COLUMN_TIME_PERIOD_LENGTH',
      payload: {
        timePeriodLength: 3,
      },
    };

    expect(setTableColumnTimePeriodLength(3)).toStrictEqual(expectedAction);
  });

  it('has the correct action SET_TABLE_COLUMN_TIME_PERIOD_LENGTH_OFFSET', () => {
    const expectedAction = {
      type: 'SET_TABLE_COLUMN_TIME_PERIOD_LENGTH_OFFSET',
      payload: {
        timePeriodLengthOffset: 33,
      },
    };

    expect(setTableColumnTimePeriodLengthOffset(33)).toStrictEqual(
      expectedAction
    );
  });

  it('has the correct action DELETE_TABLE_COLUMN_LOADING', () => {
    const expectedAction = {
      type: 'DELETE_TABLE_COLUMN_LOADING',
    };

    expect(deleteTableColumnLoading()).toStrictEqual(expectedAction);
  });

  it('has the correct action DELETE_TABLE_COLUMN_SUCCESS', () => {
    const expectedAction = {
      type: 'DELETE_TABLE_COLUMN_SUCCESS',
      payload: {
        widgetId: 123,
        columnId: 1,
      },
    };

    expect(deleteTableColumnSuccess(123, 1)).toStrictEqual(expectedAction);
  });

  it('has the correct action DELETE_TABLE_COLUMN_FAILURE', () => {
    const expectedAction = {
      type: 'DELETE_TABLE_COLUMN_FAILURE',
    };

    expect(deleteTableColumnFailure()).toStrictEqual(expectedAction);
  });

  it('has the correct action DELETE_TABLE_ROW_LOADING', () => {
    const expectedAction = {
      type: 'DELETE_TABLE_ROW_LOADING',
    };

    expect(deleteTableRowLoading()).toStrictEqual(expectedAction);
  });

  it('has the correct action DELETE_TABLE_ROW_FAILURE', () => {
    const expectedAction = {
      type: 'DELETE_TABLE_ROW_FAILURE',
    };

    expect(deleteTableRowFailure()).toStrictEqual(expectedAction);
  });

  it('has the correct action DELETE_TABLE_ROW_SUCCESS', () => {
    const expectedAction = {
      type: 'DELETE_TABLE_ROW_SUCCESS',
      payload: {
        widgetId: 999,
        rowId: 123456,
      },
    };

    expect(deleteTableRowSuccess(999, 123456)).toStrictEqual(expectedAction);
  });

  it('has the correct action UPDATE_FORMATTING_RULE_TYPE', () => {
    const expectedAction = {
      type: 'UPDATE_FORMATTING_RULE_TYPE',
      payload: {
        type: 'numeric',
        index: 0,
      },
    };

    expect(updateFormattingRuleType('numeric', 0)).toStrictEqual(
      expectedAction
    );
  });

  it('has the correct action UPDATE_FORMATTING_RULE_CONDITION', () => {
    const expectedAction = {
      type: 'UPDATE_FORMATTING_RULE_CONDITION',
      payload: {
        condition: 'less_than',
        index: 1,
      },
    };

    expect(updateFormattingRuleCondition('less_than', 1)).toStrictEqual(
      expectedAction
    );
  });

  it('has the correct action UPDATE_FORMATTING_RULE_VALUE', () => {
    const expectedAction = {
      type: 'UPDATE_FORMATTING_RULE_VALUE',
      payload: {
        value: 102,
        index: 1,
      },
    };

    expect(updateFormattingRuleValue(102, 1)).toStrictEqual(expectedAction);
  });

  it('has the correct action UPDATE_FORMATTING_RULE_COLOR', () => {
    const expectedAction = {
      type: 'UPDATE_FORMATTING_RULE_COLOR',
      payload: {
        color: colors.black_100,
        index: 0,
      },
    };

    expect(updateFormattingRuleColor(colors.black_100, 0)).toStrictEqual(
      expectedAction
    );
  });

  it('has the correct action ADD_FORMATTING_RULE', () => {
    const expectedAction = {
      type: 'ADD_FORMATTING_RULE',
    };

    expect(addFormattingRule()).toStrictEqual(expectedAction);
  });

  it('has the correct action REMOVE_FORMATTING_RULE', () => {
    const expectedAction = {
      type: 'REMOVE_FORMATTING_RULE',
      payload: {
        index: 1,
      },
    };

    expect(removeFormattingRule(1)).toStrictEqual(expectedAction);
  });

  it('has the correct action SAVE_TABLE_FORMATTING_LOADING', () => {
    const expectedAction = {
      type: 'SAVE_TABLE_FORMATTING_LOADING',
    };

    expect(saveTableFormattingLoading()).toStrictEqual(expectedAction);
  });

  it('has the correct action SAVE_SCORECARD_TABLE_FORMATTING_SUCCESS', () => {
    const expectedAction = {
      type: 'SAVE_SCORECARD_TABLE_FORMATTING_SUCCESS',
      payload: {
        appliedRules: [
          {
            ruleType: 'numeric',
            ruleCondition: 'less_than',
            value: 9,
            color: colors.black_100,
          },
        ],
      },
    };

    expect(
      saveScorecardTableFormattingSuccess([
        {
          ruleType: 'numeric',
          ruleCondition: 'less_than',
          value: 9,
          color: colors.black_100,
        },
      ])
    ).toStrictEqual(expectedAction);
  });

  it('has the correct action SAVE_TABLE_FORMATTING_FAILURE', () => {
    const expectedAction = {
      type: 'SAVE_TABLE_FORMATTING_FAILURE',
    };

    expect(saveTableFormattingFailure()).toStrictEqual(expectedAction);
  });

  it('has the correct action CHANGE_COLUMN_SUMMARY_LOADING', () => {
    const expectedAction = {
      type: 'CHANGE_COLUMN_SUMMARY_LOADING',
    };

    expect(changeColumnSummaryLoading()).toStrictEqual(expectedAction);
  });

  it('has the correct action CHANGE_COLUMN_SUMMARY_SUCCESS', () => {
    const existingColumns = [
      {
        id: 1,
        name: 'test',
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
    ];
    const expectedAction = {
      type: 'CHANGE_COLUMN_SUMMARY_SUCCESS',
      payload: {
        existingTableColumns: existingColumns,
        columnId: 1,
        summaryCalc: 'standardDeviation',
      },
    };

    expect(
      changeColumnSummarySuccess(existingColumns, 1, 'standardDeviation')
    ).toStrictEqual(expectedAction);
  });

  it('has the correct action CHANGE_COLUMN_SUMMARY_FAILURE', () => {
    const expectedAction = {
      type: 'CHANGE_COLUMN_SUMMARY_FAILURE',
    };

    expect(changeColumnSummaryFailure()).toStrictEqual(expectedAction);
  });

  it('has the correct action LOCK_COLUMN_PIVOT_LOADING', () => {
    const expectedAction = {
      type: 'LOCK_COLUMN_PIVOT_LOADING',
    };

    expect(lockColumnPivotLoading()).toStrictEqual(expectedAction);
  });

  it('has the correct action LOCK_COLUMN_PIVOT_SUCCESS', () => {
    const existingColumns = [
      {
        id: 1,
        name: 'test',
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
    ];
    const expectedAction = {
      type: 'LOCK_COLUMN_PIVOT_SUCCESS',
      payload: {
        existingTableColumns: existingColumns,
        columnId: 1,
        pivotLocked: true,
      },
    };

    expect(lockColumnPivotSuccess(existingColumns, 1, true)).toStrictEqual(
      expectedAction
    );
  });

  it('has the correct action LOCK_COLUMN_PIVOT_FAILURE', () => {
    const expectedAction = {
      type: 'LOCK_COLUMN_PIVOT_FAILURE',
    };

    expect(lockColumnPivotFailure()).toStrictEqual(expectedAction);
  });

  it('has the correct action UPDATE_TABLE_NAME_SUCCESS', () => {
    const expectedAction = {
      type: 'UPDATE_TABLE_NAME_SUCCESS',
    };

    expect(updateTableNameSuccess()).toStrictEqual(expectedAction);
  });

  it('has the correct action UPDATE_TABLE_NAME_FAILURE', () => {
    const expectedAction = {
      type: 'UPDATE_TABLE_NAME_FAILURE',
    };

    expect(updateTableNameFailure()).toStrictEqual(expectedAction);
  });

  it('has the correct action UPDATE_TABLE_SUMMARY_VISIBILITY_LOADING', () => {
    const expectedAction = {
      type: 'UPDATE_TABLE_SUMMARY_VISIBILITY_LOADING',
    };

    expect(updateSummaryVisibilityLoading()).toStrictEqual(expectedAction);
  });

  it('has the correct action UPDATE_SUMMARY_VISIBILITY_SUCCESS', () => {
    const expectedAction = {
      type: 'UPDATE_TABLE_SUMMARY_VISIBILITY_SUCCESS',
      payload: {
        updatedWidget: {
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
              name: 'Table Name',
              config: {
                table_type: 'COMPARISON',
                show_summary: true,
              },
            },
          },
        },
      },
    };

    expect(
      updateSummaryVisibilitySuccess({
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
            name: 'Table Name',
            config: {
              table_type: 'COMPARISON',
              show_summary: true,
            },
          },
        },
      })
    ).toStrictEqual(expectedAction);
  });

  it('has the correct action UPDATE_TABLE_SUMMARY_VISIBILITY_FAILURE', () => {
    const expectedAction = {
      type: 'UPDATE_TABLE_SUMMARY_VISIBILITY_FAILURE',
    };

    expect(updateSummaryVisibilityFailure()).toStrictEqual(expectedAction);
  });

  it('has the correct action DUPLICATE_COLUMN_IS_LOADING', () => {
    const expectedAction = {
      type: 'DUPLICATE_COLUMN_IS_LOADING',
      payload: {
        columnId: 1,
      },
    };

    expect(duplicateColumnIsLoading(1)).toStrictEqual(expectedAction);
  });

  it('has the correct action DUPLICATE_COLUMN_SUCCESS', () => {
    const expectedAction = {
      type: 'DUPLICATE_COLUMN_SUCCESS',
      payload: {
        columnId: 1,
      },
    };

    expect(duplicateColumnSuccess(1)).toStrictEqual(expectedAction);
  });

  it('has the correct action DUPLICATE_COLUMN_ERROR', () => {
    const expectedAction = {
      type: 'DUPLICATE_COLUMN_ERROR',
      payload: {
        columnId: 1,
      },
    };

    expect(duplicateColumnError(1)).toStrictEqual(expectedAction);
  });

  it('has the correct action CLEAR_DUPLICATE_COLUMN_ERROR', () => {
    const expectedAction = {
      type: 'CLEAR_DUPLICATE_COLUMN_ERROR',
      payload: {
        columnId: 1,
      },
    };

    expect(clearDuplicateColumnError(1)).toStrictEqual(expectedAction);
  });

  it('has the correct action SET_COLUMN_WIDTH_TYPE', () => {
    const expectedAction = {
      type: 'SET_COLUMN_WIDTH_TYPE',
      payload: {
        widgetId: 1,
        columnWidthType: 'NARROW',
      },
    };

    expect(setColumnWidthType(1, 'NARROW')).toStrictEqual(expectedAction);
  });

  it('has the correct action SET_TABLE_SORT_ORDER', () => {
    const expectedAction = {
      type: 'SET_TABLE_SORT_ORDER',
      payload: {
        widgetId: 1,
        columnId: 123,
        order: 'HIGH_LOW',
      },
    };

    expect(setTableSortOrder(1, 123, 'HIGH_LOW')).toStrictEqual(expectedAction);
  });

  it('has the correct action UPDATE_COLUMN_CONFIG', () => {
    const expectedAction = {
      type: 'UPDATE_COLUMN_CONFIG',
      payload: {
        widgetId: 1,
        columnId: 2,
        newConfig: {
          conditional_formatting: [],
          summary_calculation: 'summary',
          pivot_locked: false,
        },
      },
    };

    expect(
      updateColumnConfig(1, 2, {
        conditional_formatting: [],
        summary_calculation: 'summary',
        pivot_locked: false,
      })
    ).toStrictEqual(expectedAction);
  });

  it('has the correct action UPDATE_ROW_CONFIG', () => {
    const expectedAction = {
      type: 'UPDATE_ROW_CONFIG',
      payload: {
        widgetId: 1,
        rowId: 2,
        newConfig: {
          conditional_formatting: [],
          summary_calculation: 'summary',
          pivot_locked: false,
        },
      },
    };

    expect(
      updateRowConfig(1, 2, {
        conditional_formatting: [],
        summary_calculation: 'summary',
        pivot_locked: false,
      })
    ).toStrictEqual(expectedAction);
  });

  describe('when saving a summary calculation to a column', () => {
    let origXhr;
    let xhr;
    let request;
    const getState = sinon.stub();

    beforeEach(() => {
      origXhr = window.XMLHttpRequest;
      xhr = sinon.useFakeXMLHttpRequest();
      window.XMLHttpRequest = xhr;
      request = '';
      xhr.onCreate = (req) => {
        request = req;
      };
    });

    afterEach(() => {
      xhr.restore();
      window.XMLHttpRequest = origXhr;
    });

    it('sends the correct data for comparison table', () => {
      getState.returns({
        dashboard: {
          widgets: [COMPARISON_WIDGET_MOCK],
        },
      });
      const thunk = changeColumnSummary(
        1967,
        5991,
        'percentageEmpty',
        42611,
        COMPARISON_WIDGET_MOCK.widget.table_container.columns
      );

      const dispatcher = sinon.spy();
      thunk(dispatcher, getState);

      expect(dispatcher.args[0][0].type).toBe('CHANGE_COLUMN_SUMMARY_LOADING');

      expect(request.url).toBe('/table_containers/1967/table_columns/5991');
      expect(request.method).toBe('PUT');
      expect(JSON.parse(request.requestBody)).toStrictEqual({
        data_source_type: 'TableMetric',
        input_params: {
          source: 'combination',
          variable: '%_difference',
        },
        summary: 'sum_absolute',
        time_scope: {
          time_period: 'this_season',
          start_time: null,
          end_time: null,
          time_period_length: null,
          time_period_length_offset: null,
        },
        config: {
          summary_calculation: 'percentageEmpty',
        },
      });
    });

    it('sends the correct data for longitudinal table', () => {
      getState.returns({
        dashboard: {
          widgets: [LONGITUDINAL_WIDGET_MOCK],
        },
      });
      const thunk = changeColumnSummary(
        1969,
        6005,
        'percentageEmpty',
        42613,
        LONGITUDINAL_WIDGET_MOCK.widget.table_container.columns
      );

      const dispatcher = sinon.spy();
      thunk(dispatcher, getState);

      expect(dispatcher.args[0][0].type).toBe('CHANGE_COLUMN_SUMMARY_LOADING');

      expect(request.url).toBe('/table_containers/1969/table_columns/6005');
      expect(request.method).toBe('PUT');
      expect(JSON.parse(request.requestBody)).toStrictEqual({
        data_source_type: 'TableMetric',
        input_params: {
          source: 'kitman:injury_risk',
          variable: 'e7a27f18-51cf-4882-97ad-e2bc59b5fb67',
        },
        summary: 'sum',
        population: {
          athletes: [],
          positions: [],
          position_groups: [],
          squads: [],
          applies_to_squad: true,
          all_squads: false,
        },
        config: {
          pivot_locked: false,
          summary_calculation: 'percentageEmpty',
        },
      });
    });

    it('sends the correct data for scorecard table', () => {
      getState.returns({
        dashboard: {
          widgets: [SCORECARD_WIDGET_MOCK],
        },
      });
      const thunk = changeColumnSummary(
        1968,
        6012,
        'percentageEmpty',
        42612,
        SCORECARD_WIDGET_MOCK.widget.table_container.columns
      );

      const dispatcher = sinon.spy();
      thunk(dispatcher, getState);

      expect(dispatcher.args[0][0].type).toBe('CHANGE_COLUMN_SUMMARY_LOADING');

      expect(request.url).toBe('/table_containers/1968/table_columns/6012');
      expect(request.method).toBe('PUT');
      expect(JSON.parse(request.requestBody)).toStrictEqual({
        time_scope: {
          time_period: 'this_season',
          start_time: null,
          end_time: null,
          time_period_length: null,
          time_period_length_offset: null,
        },
        population: {
          athletes: [],
          positions: [],
          position_groups: [],
          squads: [],
          applies_to_squad: true,
          all_squads: false,
        },
        config: {
          summary_calculation: 'percentageEmpty',
        },
      });
    });
  });

  describe('updateTableName', () => {
    let origXhr;
    let xhr;
    let request;
    const getState = sinon.stub();

    beforeEach(() => {
      origXhr = window.XMLHttpRequest;
      xhr = sinon.useFakeXMLHttpRequest();
      window.XMLHttpRequest = xhr;
      request = '';
      xhr.onCreate = (req) => {
        request = req;
      };
    });

    afterEach(() => {
      xhr.restore();
      window.XMLHttpRequest = origXhr;
    });

    it('sends the correct data', () => {
      getState.returns({
        dashboard: {
          activeDashboard: {
            id: 912,
          },
        },
        staticData: { containerType: 'AnalyticalDashboard' },
      });
      const thunk = updateTableName(199, 'New Table Name', {
        table_type: 'COMPARISON',
        show_summary: false,
      });

      const dispatcher = sinon.spy();
      thunk(dispatcher, getState);

      expect(request.url).toBe('/widgets/199');
      expect(request.method).toBe('PUT');
      expect(request.requestBody).toBe(
        JSON.stringify({
          container_type: 'AnalyticalDashboard',
          container_id: 912,
          widget: {
            name: 'New Table Name',
            config: { table_type: 'COMPARISON', show_summary: false },
          },
        })
      );
    });
  });

  describe('when saving a format to a comparison table column', () => {
    let origXhr;
    let xhr;
    let request;
    const getState = sinon.stub();
    const dashboardMock = {
      dashboard: {
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
                config: { table_type: 'COMPARISON', show_summary: true },
                definitions: [],
                columns: [
                  {
                    id: 1,
                    name: 'aBJ (cm)',
                    population: null,
                    config: null,
                    time_scope: {
                      time_period: 'this_week',
                      start_time: null,
                      end_time: null,
                      time_period_length: null,
                      time_period_length_offset: null,
                    },
                    table_element: {
                      data_source: {
                        type: 'TableMetric',
                        source: 'kitman:tv',
                        variable: 'bj',
                        unit: 'cm',
                      },
                      calculation: 'mean',
                    },
                    order: 1,
                  },
                  {
                    id: 3029,
                    name: 'CounterMovement',
                    population: null,
                    config: {
                      pivot_locked: true,
                    },
                    metric: {
                      key_name:
                        'combination|countermovement_jump_minus_body_weight_lbs',
                      unit: '',
                    },
                    time_scope: {
                      time_period: 'this_season',
                      start_time: null,
                      end_time: null,
                      time_period_length: null,
                      time_period_length_offset: null,
                    },
                    summary: 'sum',
                    order: 5,
                  },
                ],
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
      },
    };

    beforeEach(() => {
      origXhr = window.XMLHttpRequest;
      xhr = sinon.useFakeXMLHttpRequest();
      window.XMLHttpRequest = xhr;
      request = '';
      xhr.onCreate = (req) => {
        request = req;
      };
    });

    afterEach(() => {
      xhr.restore();
      window.XMLHttpRequest = origXhr;
    });

    it('sends the correct data', () => {
      getState.returns({
        tableWidget: {
          appliedColumns: [],
          appliedPopulation: {
            applies_to_squad: false,
            position_groups: [123],
            positions: [3333],
            athletes: [],
            all_squads: false,
            squads: [],
          },
          formattingPanel: {
            formattableId: 1,
            appliedFormat: [
              {
                type: 'numeric',
                condition: 'less_than',
                value: 9,
                color: colors.s14,
              },
            ],
          },
          tableContainerId: 9876,
        },
        staticData: { containerType: 'AnalyticalDashboard' },
        ...dashboardMock,
      });

      const thunk = saveComparisonTableFormatting();

      const dispatcher = sinon.spy();
      thunk(dispatcher, getState);

      expect(dispatcher.args[0][0].type).toBe('SAVE_TABLE_FORMATTING_LOADING');

      expect(request.url).toBe('/table_containers/9876/table_columns/1');
      expect(request.method).toBe('PUT');
      expect(JSON.parse(request.requestBody)).toStrictEqual({
        data_source_type: 'TableMetric',
        input_params: {
          source: 'kitman:tv',
          variable: 'bj',
        },
        summary: 'mean',
        population: null,
        time_scope: {
          time_period: 'this_week',
          start_time: null,
          end_time: null,
          time_period_length: null,
          time_period_length_offset: null,
        },
        config: {
          conditional_formatting: [
            {
              type: 'numeric',
              condition: 'less_than',
              value: 9,
              color: colors.s14,
            },
          ],
        },
      });
    });

    it('sends the correct data when there is already a config', () => {
      getState.returns({
        tableWidget: {
          appliedColumns: [
            {
              id: 1,
              name: 'test',
              metric: {
                key_name: 'combination|%_difference',
                name: '% Difference',
                description: 'combination',
              },
              summary: 'mean',
              time_scope: {
                time_period: 'today',
              },
              config: {
                summary_calculation: 'percentageEmpty',
                conditional_formatting: [
                  {
                    type: 'numeric',
                    condition: 'less_than',
                    value: 9,
                    color: colors.s14,
                  },
                ],
              },
            },
          ],
          appliedPopulation: {
            applies_to_squad: false,
            position_groups: [123],
            positions: [3333],
            athletes: [],
            all_squads: false,
            squads: [],
          },
          formattingPanel: {
            formattableId: 1,
            appliedFormat: [
              {
                type: 'numeric',
                condition: 'less_than',
                value: 9,
                color: colors.s14,
              },
              {
                type: 'numeric',
                condition: 'greater_than',
                value: 9,
                color: colors.red_100_20,
              },
            ],
          },
          tableContainerId: 9876,
        },
        staticData: { containerType: 'AnalyticalDashboard' },
        ...dashboardMock,
      });

      const thunk = saveComparisonTableFormatting();

      const dispatcher = sinon.spy();
      thunk(dispatcher, getState);

      expect(dispatcher.args[0][0].type).toBe('SAVE_TABLE_FORMATTING_LOADING');

      expect(request.url).toBe('/table_containers/9876/table_columns/1');
      expect(request.method).toBe('PUT');
      expect(JSON.parse(request.requestBody)).toStrictEqual({
        data_source_type: 'TableMetric',
        input_params: {
          source: 'kitman:tv',
          variable: 'bj',
        },
        summary: 'mean',
        population: null,
        time_scope: {
          time_period: 'this_week',
          start_time: null,
          end_time: null,
          time_period_length: null,
          time_period_length_offset: null,
        },
        config: {
          conditional_formatting: [
            {
              type: 'numeric',
              condition: 'less_than',
              value: 9,
              color: colors.s14,
            },
            {
              type: 'numeric',
              condition: 'greater_than',
              value: 9,
              color: colors.red_100_20,
            },
          ],
        },
      });
    });
  });

  describe('when saving a format to a scorecard table row', () => {
    let origXhr;
    let xhr;
    let request;
    const getState = sinon.stub();

    beforeEach(() => {
      origXhr = window.XMLHttpRequest;
      xhr = sinon.useFakeXMLHttpRequest();
      window.XMLHttpRequest = xhr;
      request = '';
      xhr.onCreate = (req) => {
        request = req;
      };
    });

    afterEach(() => {
      // we must clean up when tampering with globals.
      xhr.restore();
      window.XMLHttpRequest = origXhr;
    });

    it('sends the correct data', () => {
      getState.returns({
        dashboard: {
          widgets: [SCORECARD_WIDGET_MOCK],
        },
        tableWidget: {
          appliedColumns: [],
          appliedRows: [
            {
              id: 75986,
              name: 'test',
              source: 'kitman:tv',
              variable: 'variable',
              summary: 'mean',
              table_element: {
                calculation: 'mean',
                data_source: {
                  key_name: 'kitman:tv',
                },
              },
            },
          ],
          appliedPopulation: {
            applies_to_squad: false,
            position_groups: [123],
            positions: [3333],
            athletes: [],
            all_squads: false,
            squads: [],
          },
          formattingPanel: {
            formattableId: 75986,
            appliedFormat: [
              {
                type: 'numeric',
                condition: 'less_than',
                value: 9,
                color: colors.s14,
              },
            ],
          },
          tableContainerId: 1968,
          widgetId: 42612,
        },
        staticData: { containerType: 'AnalyticalDashboard' },
      });

      const thunk = saveScorecardTableFormatting();

      const dispatcher = sinon.spy();
      thunk(dispatcher, getState);

      expect(dispatcher.args[0][0].type).toBe('SAVE_TABLE_FORMATTING_LOADING');

      const configRequest = dispatcher.args[1][0];
      configRequest(dispatcher, getState);

      expect(request.url).toBe('/table_containers/1968/table_rows/75986');
    });
  });

  describe('when updating a columns pivot lock', () => {
    let origXhr;
    let xhr;
    let request;
    const getState = sinon.stub();

    beforeEach(() => {
      origXhr = window.XMLHttpRequest;
      xhr = sinon.useFakeXMLHttpRequest();
      window.XMLHttpRequest = xhr;
      request = '';
      xhr.onCreate = (req) => {
        request = req;
      };
    });

    afterEach(() => {
      xhr.restore();
      window.XMLHttpRequest = origXhr;
    });

    it('sends the correct data for comparison table', () => {
      getState.returns({
        dashboard: {
          widgets: [COMPARISON_WIDGET_MOCK],
        },
      });
      const thunk = lockColumnPivot(
        1967,
        5991,
        true,
        42611,
        COMPARISON_WIDGET_MOCK.widget.table_container.columns
      );

      const dispatcher = sinon.spy();
      thunk(dispatcher, getState);

      expect(dispatcher.args[0][0].type).toBe('LOCK_COLUMN_PIVOT_LOADING');

      expect(request.url).toBe('/table_containers/1967/table_columns/5991');
      expect(request.method).toBe('PUT');
      expect(JSON.parse(request.requestBody)).toStrictEqual({
        data_source_type: 'TableMetric',
        input_params: {
          source: 'combination',
          variable: '%_difference',
        },
        summary: 'sum_absolute',
        time_scope: {
          time_period: 'this_season',
          start_time: null,
          end_time: null,
          time_period_length: null,
          time_period_length_offset: null,
        },
        config: {
          pivot_locked: true,
        },
      });
    });

    it('sends the correct data for longitudinal table', () => {
      getState.returns({
        dashboard: {
          widgets: [LONGITUDINAL_WIDGET_MOCK],
        },
      });
      const thunk = lockColumnPivot(
        1969,
        6005,
        true,
        42613,
        LONGITUDINAL_WIDGET_MOCK.widget.table_container.columns
      );

      const dispatcher = sinon.spy();
      thunk(dispatcher, getState);

      expect(dispatcher.args[0][0].type).toBe('LOCK_COLUMN_PIVOT_LOADING');

      expect(request.url).toBe('/table_containers/1969/table_columns/6005');
      expect(request.method).toBe('PUT');
      expect(JSON.parse(request.requestBody)).toStrictEqual({
        data_source_type: 'TableMetric',
        input_params: {
          source: 'kitman:injury_risk',
          variable: 'e7a27f18-51cf-4882-97ad-e2bc59b5fb67',
        },
        summary: 'sum',
        population: {
          athletes: [],
          positions: [],
          position_groups: [],
          squads: [],
          applies_to_squad: true,
          all_squads: false,
        },
        config: { summary_calculation: 'range', pivot_locked: true },
      });
    });

    it('sends the correct data for scorecard table', () => {
      getState.returns({
        dashboard: {
          widgets: [SCORECARD_WIDGET_MOCK],
        },
      });
      const thunk = lockColumnPivot(
        1968,
        6012,
        true,
        42612,
        SCORECARD_WIDGET_MOCK.widget.table_container.columns
      );

      const dispatcher = sinon.spy();
      thunk(dispatcher, getState);

      expect(dispatcher.args[0][0].type).toBe('LOCK_COLUMN_PIVOT_LOADING');

      expect(request.url).toBe('/table_containers/1968/table_columns/6012');
      expect(request.method).toBe('PUT');
      expect(JSON.parse(request.requestBody)).toStrictEqual({
        time_scope: {
          time_period: 'this_season',
          start_time: null,
          end_time: null,
          time_period_length: null,
          time_period_length_offset: null,
        },
        population: {
          athletes: [],
          positions: [],
          position_groups: [],
          squads: [],
          applies_to_squad: true,
          all_squads: false,
        },
        config: {
          pivot_locked: true,
        },
      });
    });
  });

  describe('deleteTableColumn', () => {
    let origXhr;
    let xhr;
    let request;
    const getState = sinon.stub();

    beforeEach(() => {
      origXhr = window.XMLHttpRequest;
      xhr = sinon.useFakeXMLHttpRequest();
      window.XMLHttpRequest = xhr;
      request = '';
      xhr.onCreate = (req) => {
        request = req;
      };
    });

    afterEach(() => {
      // we must clean up when tampering with globals.
      xhr.restore();
      window.XMLHttpRequest = origXhr;
    });

    it('sends the correct data', () => {
      const thunk = deleteTableColumn(123, 5, 1);

      const dispatcher = sinon.spy();
      thunk(dispatcher, getState);

      expect(dispatcher.args[0][0].type).toBe('DELETE_TABLE_COLUMN_LOADING');

      expect(request.url).toBe('/table_containers/5/table_columns/1');
      expect(request.method).toBe('DELETE');
    });
  });

  describe('deleteTableRow', () => {
    let origXhr;
    let xhr;
    let request;
    const getState = sinon.stub();

    beforeEach(() => {
      origXhr = window.XMLHttpRequest;
      xhr = sinon.useFakeXMLHttpRequest();
      window.XMLHttpRequest = xhr;
      request = '';
      xhr.onCreate = (req) => {
        request = req;
      };
    });

    afterEach(() => {
      // we must clean up when tampering with globals.
      xhr.restore();
      window.XMLHttpRequest = origXhr;
    });

    it('sends the correct data', () => {
      const thunk = deleteTableRow(123, 5, 1);

      const dispatcher = sinon.spy();
      thunk(dispatcher, getState);

      expect(dispatcher.args[0][0].type).toBe('DELETE_TABLE_ROW_LOADING');

      expect(request.url).toBe('/table_containers/5/table_rows/1');
      expect(request.method).toBe('DELETE');
    });
  });

  describe('when updating the table summary visibility', () => {
    let origXhr;
    let xhr;
    let request;
    const getState = sinon.stub();

    beforeEach(() => {
      origXhr = window.XMLHttpRequest;
      xhr = sinon.useFakeXMLHttpRequest();
      window.XMLHttpRequest = xhr;
      request = '';
      xhr.onCreate = (req) => {
        request = req;
      };
    });

    afterEach(() => {
      // we must clean up when tampering with globals.
      xhr.restore();
      window.XMLHttpRequest = origXhr;
    });

    it('sends the correct data', () => {
      getState.returns({
        dashboard: {
          activeDashboard: {
            id: 123,
            name: 'Dashboard',
          },
        },
        tableWidget: {},
        staticData: { containerType: 'AnalyticalDashboard' },
      });

      const thunk = updateSummaryVisibility(
        9876,
        'Table Name',
        'COMPARISON',
        false
      );

      const dispatcher = sinon.spy();
      thunk(dispatcher, getState);

      expect(dispatcher.args[0][0].type).toBe(
        'UPDATE_TABLE_SUMMARY_VISIBILITY_LOADING'
      );

      expect(request.url).toBe('/widgets/9876');
      expect(request.method).toBe('PUT');
      expect(request.requestBody).toBe(
        JSON.stringify({
          container_type: 'AnalyticalDashboard',
          container_id: 123,
          widget: {
            name: 'Table Name',
            config: {
              table_type: 'COMPARISON',
              show_summary: false,
            },
          },
        })
      );
    });
  });

  describe('when duplicating a column', () => {
    it('sends the correct request details', () => {
      const getState = sinon.stub();
      const origXhr = window.XMLHttpRequest;
      const xhr = sinon.useFakeXMLHttpRequest();
      window.XMLHttpRequest = xhr;

      let request = '';
      xhr.onCreate = (req) => {
        request = req;
      };

      getState.returns({
        dashboard: {
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
                  config: { table_type: 'COMPARISON', show_summary: true },
                  definitions: [],
                  columns: [
                    {
                      id: 3026,
                      name: 'aBJ (cm)',
                      population: null,
                      config: null,
                      table_element: {
                        calculation: 'mean',
                        data_source: {
                          source: 'kitman:tv',
                          variable: 'bj',
                          type: 'TableMetric',
                          unit: 'cm',
                        },
                      },
                      time_scope: {
                        time_period: 'this_week',
                        start_time: null,
                        end_time: null,
                        time_period_length: null,
                        time_period_length_offset: null,
                      },
                      order: 1,
                    },
                    {
                      id: 3029,
                      name: 'CounterMovement',
                      population: null,
                      config: {
                        pivot_locked: true,
                      },
                      table_element: {
                        calculation: 'sum',
                        data_source: {
                          source: 'combination',
                          variable:
                            'bjcountermovement_jump_minus_body_weight_lbs',
                          type: 'TableMetric',
                          unit: 'cm',
                        },
                      },
                      time_scope: {
                        time_period: 'this_season',
                        start_time: null,
                        end_time: null,
                        time_period_length: null,
                        time_period_length_offset: null,
                      },
                      order: 2,
                    },
                  ],
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
        },
      });

      const thunk = duplicateTableColumn(10, 3026);

      const dispatcher = sinon.spy();
      thunk(dispatcher, getState);

      expect(dispatcher.args[0][0].type).toBe('CLEAR_DUPLICATE_COLUMN_ERROR');

      expect(dispatcher.args[1][0].type).toBe('DUPLICATE_COLUMN_IS_LOADING');

      expect(request.url).toBe('/table_containers/123/table_columns');
      expect(request.method).toBe('POST');
      expect(JSON.parse(request.requestBody)).toStrictEqual({
        name: 'aBJ (cm) copy',
        data_source_type: 'TableMetric',
        input_params: {
          source: 'kitman:tv',
          variable: 'bj',
        },
        summary: 'mean',
        time_scope: {
          time_period: 'this_week',
          start_time: null,
          end_time: null,
          time_period_length: null,
          time_period_length_offset: null,
        },
        order: 2,
      });

      // we must clean up when tampering with globals.
      xhr.restore();
      window.XMLHttpRequest = origXhr;
    });
  });

  describe('when setting column width type', () => {
    let origXhr;
    let xhr;
    let request;
    const getState = sinon.stub();

    beforeEach(() => {
      origXhr = window.XMLHttpRequest;
      xhr = sinon.useFakeXMLHttpRequest();
      window.XMLHttpRequest = xhr;
      request = '';
      xhr.onCreate = (req) => {
        request = req;
      };
    });

    afterEach(() => {
      // we must clean up when tampering with globals.
      xhr.restore();
      window.XMLHttpRequest = origXhr;
    });

    it('sends correct request for setColumnWidthTypeRequest', () => {
      getState.returns({
        dashboard: {
          activeDashboard: {
            id: 912,
          },
          widgets: [
            {
              cols: 6,
              rows: 2,
              horizontal_position: 0,
              vertical_position: 0,
              id: 10,
              widget: {
                id: 902,
                table_container: {
                  id: 123,
                  config: { table_type: 'COMPARISON', show_summary: true },
                  definitions: [],
                  columns: [],
                  population: {
                    athletes: [1],
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
              widget_render: { name: 'Test: Comparison Table dsdsd' },
              widget_type: 'table',
            },
          ],
        },
        staticData: { containerType: 'AnalyticalDashboard' },
      });

      const thunk = setColumnWidthTypeRequest(10, 'NARROW');

      const dispatcher = sinon.spy();

      thunk(dispatcher, getState);

      expect(dispatcher.args[0][0].type).toBe('SET_COLUMN_WIDTH_TYPE');

      expect(request.url).toBe('/widgets/10');
      expect(request.method).toBe('PUT');
      expect(JSON.parse(request.requestBody)).toStrictEqual({
        container_type: 'AnalyticalDashboard',
        container_id: 912,
        widget: {
          name: 'Test: Comparison Table dsdsd',
          config: {
            table_type: 'COMPARISON',
            show_summary: true,
            column_width_type: 'NARROW',
          },
          population: {
            athletes: [1],
            positions: [],
            position_groups: [],
            squads: [],
            applies_to_squad: true,
            all_squads: false,
          },
        },
      });
    });
  });

  describe('persisting column sort', () => {
    let origXhr;
    let xhr;
    let request;
    const getState = sinon.stub();

    beforeEach(() => {
      origXhr = window.XMLHttpRequest;
      xhr = sinon.useFakeXMLHttpRequest();
      window.XMLHttpRequest = xhr;
      request = '';
      xhr.onCreate = (req) => {
        request = req;
      };
    });

    afterEach(() => {
      xhr.restore();
      window.XMLHttpRequest = origXhr;
    });

    it('sends correct request for setTableSortOrderRequest', () => {
      getState.returns({
        dashboard: {
          activeDashboard: {
            id: 912,
          },
          widgets: [
            {
              cols: 6,
              rows: 2,
              horizontal_position: 0,
              vertical_position: 0,
              id: 10,
              widget: {
                id: 902,
                table_container: {
                  id: 123,
                  config: { table_type: 'COMPARISON', show_summary: true },
                  definitions: [],
                  columns: [],
                  population: {
                    athletes: [1],
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
              widget_render: { name: 'Test: Comparison Table dsdsd' },
              widget_type: 'table',
            },
          ],
        },
        staticData: { containerType: 'AnalyticalDashboard' },
      });

      const thunk = setTableSortOrderRequest(10, 123, 'HIGH_LOW');

      const dispatcher = sinon.spy();

      thunk(dispatcher, getState);

      expect(dispatcher.args[0][0].type).toBe('SET_TABLE_SORT_ORDER');

      expect(request.url).toBe('/widgets/10');
      expect(request.method).toBe('PUT');
      expect(JSON.parse(request.requestBody)).toStrictEqual({
        container_type: 'AnalyticalDashboard',
        container_id: 912,
        widget: {
          name: 'Test: Comparison Table dsdsd',
          config: {
            table_type: 'COMPARISON',
            show_summary: true,
            table_sort: [
              {
                column_id: 123,
                order_direction: 'HIGH_LOW',
              },
            ],
          },
          population: {
            athletes: [1],
            positions: [],
            position_groups: [],
            squads: [],
            applies_to_squad: true,
            all_squads: false,
          },
        },
      });
    });
  });

  describe('when updating column config', () => {
    let origXhr;
    let xhr;
    let request;
    const getState = jest.fn();

    beforeEach(() => {
      origXhr = window.XMLHttpRequest;
      xhr = sinon.useFakeXMLHttpRequest();
      window.XMLHttpRequest = xhr;
      request = '';
      xhr.onCreate = (req) => {
        request = req;
      };
    });

    afterEach(() => {
      // we must clean up when tampering with globals.
      xhr.restore();
      window.XMLHttpRequest = origXhr;
    });

    it('has the correct action for UPDATE_COLUMN_CONFIG', () => {
      const expectedAction = {
        type: 'UPDATE_COLUMN_CONFIG',
        payload: {
          widgetId: 1,
          columnId: 2,
          newConfig: {
            conditional_formatting: [],
            summary_calculation: 'summary',
            pivot_locked: false,
          },
        },
      };

      expect(
        updateColumnConfig(1, 2, {
          conditional_formatting: [],
          summary_calculation: 'summary',
          pivot_locked: false,
        })
      ).toStrictEqual(expectedAction);
    });

    it('sends the correct data for comparison table', () => {
      getState.mockReturnValue({
        dashboard: {
          widgets: [COMPARISON_WIDGET_MOCK],
        },
      });
      const thunk = updateColumnConfigRequest(42611, 5991, {
        pivot_locked: true,
      });

      const dispatcher = jest.fn();
      thunk(dispatcher, getState);

      expect(dispatcher.mock.calls[0][0].type).toStrictEqual(
        'UPDATE_COLUMN_CONFIG'
      );

      expect(request.url).toStrictEqual(
        '/table_containers/1967/table_columns/5991'
      );
      expect(request.method).toStrictEqual('PUT');
      expect(JSON.parse(request.requestBody)).toStrictEqual({
        data_source_type: 'TableMetric',
        input_params: {
          source: 'combination',
          variable: '%_difference',
        },
        summary: 'sum_absolute',
        time_scope: {
          time_period: 'this_season',
          start_time: null,
          end_time: null,
          time_period_length: null,
          time_period_length_offset: null,
        },
        config: {
          pivot_locked: true,
        },
      });
    });

    it('sends the correct data for longitudinal table', () => {
      getState.mockReturnValue({
        dashboard: {
          widgets: [LONGITUDINAL_WIDGET_MOCK],
        },
      });
      const thunk = updateColumnConfigRequest(42613, 5995, {
        pivot_locked: true,
      });

      const dispatcher = jest.fn();
      thunk(dispatcher, getState);

      expect(dispatcher.mock.calls[0][0].type).toStrictEqual(
        'UPDATE_COLUMN_CONFIG'
      );
      expect(request.url).toStrictEqual(
        '/table_containers/1969/table_columns/5995'
      );
      expect(request.method).toStrictEqual('PUT');
      expect(JSON.parse(request.requestBody)).toStrictEqual({
        data_source_type: 'TableMetric',
        input_params: {
          source: 'combination',
          variable: 'cmj_difference',
        },
        summary: 'sum',
        population: {
          athletes: [],
          positions: [],
          position_groups: [],
          squads: [],
          applies_to_squad: true,
          all_squads: false,
        },
        config: {
          conditional_formatting: [
            {
              type: 'numeric',
              condition: 'greater_than',
              value: 2,
              color: colors.red_100_20,
            },
          ],
          pivot_locked: true,
          summary_calculation: 'percentageFilled',
        },
      });
    });

    it('sends the correct data for scorecard table', () => {
      getState.mockReturnValue({
        dashboard: {
          widgets: [SCORECARD_WIDGET_MOCK],
        },
      });
      const thunk = updateColumnConfigRequest(42612, 5993, {
        pivot_locked: true,
      });

      const dispatcher = jest.fn();
      thunk(dispatcher, getState);

      expect(dispatcher.mock.calls[0][0].type).toStrictEqual(
        'UPDATE_COLUMN_CONFIG'
      );
      expect(request.url).toStrictEqual(
        '/table_containers/1968/table_columns/5993'
      );
      expect(request.method).toStrictEqual('PUT');
      expect(JSON.parse(request.requestBody)).toStrictEqual({
        time_scope: {
          time_period: 'this_season',
          start_time: null,
          end_time: null,
          time_period_length: null,
          time_period_length_offset: null,
        },
        population: {
          athletes: [],
          positions: [],
          position_groups: [25],
          squads: [],
          applies_to_squad: false,
          all_squads: false,
        },
        config: {
          pivot_locked: true,
        },
      });
    });
  });

  describe('when updating row config', () => {
    let origXhr;
    let xhr;
    let request;
    const getState = jest.fn();

    beforeEach(() => {
      origXhr = window.XMLHttpRequest;
      xhr = sinon.useFakeXMLHttpRequest();
      window.XMLHttpRequest = xhr;
      request = '';
      xhr.onCreate = (req) => {
        request = req;
      };
    });

    afterEach(() => {
      // we must clean up when tampering with globals.
      xhr.restore();
      window.XMLHttpRequest = origXhr;
    });

    it('has the correct action for UPDATE_ROW_CONFIG', () => {
      const expectedAction = {
        type: 'UPDATE_ROW_CONFIG',
        payload: {
          widgetId: 1,
          rowId: 2,
          newConfig: {
            conditional_formatting: [],
            summary_calculation: 'summary',
            pivot_locked: false,
          },
        },
      };

      expect(
        updateRowConfig(1, 2, {
          conditional_formatting: [],
          summary_calculation: 'summary',
          pivot_locked: false,
        })
      ).toStrictEqual(expectedAction);
    });

    it('sends the correct data for comparison table', () => {
      getState.mockReturnValue({
        dashboard: {
          widgets: [COMPARISON_WIDGET_MOCK],
        },
      });
      const thunk = updateRowConfigRequest(42611, 75985, {
        ranking_calculation: {
          direction: 'HIGH_LOW',
          type: 'RANK',
        },
      });
      const dispatcher = jest.fn();
      thunk(dispatcher, getState);
      expect(dispatcher.mock.calls[0][0].type).toStrictEqual(
        'UPDATE_ROW_CONFIG'
      );
      expect(request.url).toStrictEqual(
        '/table_containers/1967/table_rows/75985'
      );
      expect(request.method).toStrictEqual('PUT');
      expect(JSON.parse(request.requestBody)).toStrictEqual({
        population: {
          athletes: [36479],
          positions: [],
          position_groups: [],
          squads: [],
          applies_to_squad: false,
          all_squads: false,
        },
        config: {
          ranking_calculation: {
            direction: 'HIGH_LOW',
            type: 'RANK',
          },
        },
      });
    });

    it('sends the correct data for longitudinal table', () => {
      getState.mockReturnValue({
        dashboard: {
          widgets: [LONGITUDINAL_WIDGET_MOCK],
        },
      });
      const thunk = updateRowConfigRequest(42613, 75989, {
        ranking_calculation: {
          direction: 'HIGH_LOW',
          type: 'RANK',
        },
      });
      const dispatcher = jest.fn();
      thunk(dispatcher, getState);
      expect(dispatcher.mock.calls[0][0].type).toStrictEqual(
        'UPDATE_ROW_CONFIG'
      );
      expect(request.url).toStrictEqual(
        '/table_containers/1969/table_rows/75989'
      );
      expect(request.method).toStrictEqual('PUT');
      expect(JSON.parse(request.requestBody)).toStrictEqual({
        time_scope: {
          time_period: 'this_season',
          start_time: null,
          end_time: null,
          time_period_length: null,
          time_period_length_offset: null,
        },
        config: {
          ranking_calculation: {
            direction: 'HIGH_LOW',
            type: 'RANK',
          },
        },
      });
    });

    it('sends the correct data for scorecard table', () => {
      getState.mockReturnValue({
        dashboard: {
          widgets: [SCORECARD_WIDGET_MOCK],
        },
      });
      const thunk = updateRowConfigRequest(42612, 75987, {
        ranking_calculation: {
          direction: 'HIGH_LOW',
          type: 'RANK',
        },
      });
      const dispatcher = jest.fn();
      thunk(dispatcher, getState);
      expect(dispatcher.mock.calls[0][0].type).toStrictEqual(
        'UPDATE_ROW_CONFIG'
      );
      expect(request.url).toStrictEqual(
        '/table_containers/1968/table_rows/75987'
      );
      expect(request.method).toStrictEqual('PUT');
      expect(JSON.parse(request.requestBody)).toStrictEqual({
        data_source_type: 'TableMetric',
        input_params: {
          source: 'combination',
          variable: 'left_thigh_stiffness',
        },
        summary: 'max',
        config: {
          ranking_calculation: {
            direction: 'HIGH_LOW',
            type: 'RANK',
          },
          summary_calculation: 'empty',
        },
      });
    });
  });
});
