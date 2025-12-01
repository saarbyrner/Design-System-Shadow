// @flow
import $ from 'jquery';
import _find from 'lodash/find';
import { arrayMove } from 'react-sortable-hoc';
import { fetchWidgetContent } from '@kitman/modules/src/analysis/Dashboard/redux/actions/widgets';
import {
  getTableColumnByIdFactory,
  getTableContainerByWidgetId,
  getTableRowByIdFactory,
  getWidgetById,
} from '@kitman/modules/src/analysis/Dashboard/redux/selectors';
import {
  getInputParamsFromDataSource,
  getDataSourceType,
} from '@kitman/modules/src/analysis/Dashboard/utils';

// Types
import type {
  Action,
  ThunkAction,
} from '@kitman/modules/src/analysis/Dashboard/redux/types/actions';
import type { WidgetData } from '@kitman/modules/src/analysis/Dashboard/types';
import type {
  ColumnSortType,
  ColumnWidthType,
  RankingCalculationConfig,
  TableElementFilter,
  TableElementFilterValue,
  TableFormulaColumnResponse,
  TableWidgetColumn,
  TableWidgetColumnConfig,
  TableWidgetFormatRule,
  TableWidgetRow,
  TableWidgetRowConfig,
  TableWidgetRowMetric,
  TableWidgetType,
} from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/types';

export const openTableColumnFormattingPanel = (
  existingTableColumns: Array<TableWidgetColumn>,
  tableContainerId: number,
  tableType: TableWidgetType,
  widgetId: number,
  columnId: number,
  columnName: string,
  columnUnit: string,
  appliedFormat: Array<TableWidgetFormatRule>
): Action => ({
  type: 'OPEN_TABLE_COLUMN_FORMATTING_PANEL',
  payload: {
    existingTableColumns,
    tableContainerId,
    tableType,
    widgetId,
    columnId,
    columnName,
    columnUnit,
    appliedFormat,
  },
});
export const openScorecardTableFormattingPanel = (
  existingTableMetrics: Array<TableWidgetRowMetric>,
  tableContainerId: number,
  widgetId: number,
  rowMetricId: number,
  metricName: string,
  metricUnit: string,
  appliedFormat: Array<TableWidgetFormatRule>
): Action => ({
  type: 'OPEN_SCORECARD_TABLE_FORMATTING_PANEL',
  payload: {
    existingTableMetrics,
    tableContainerId,
    widgetId,
    rowMetricId,
    metricName,
    metricUnit,
    appliedFormat,
  },
});

export const updateColumnConfig = (
  widgetId: number,
  columnId: number,
  newConfig: TableWidgetColumnConfig
) => ({
  type: 'UPDATE_COLUMN_CONFIG',
  payload: {
    widgetId,
    columnId,
    newConfig,
  },
});

export const updateRowConfig = (
  widgetId: number,
  rowId: number,
  newConfig: TableWidgetRowConfig
) => ({
  type: 'UPDATE_ROW_CONFIG',
  payload: {
    widgetId,
    rowId,
    newConfig,
  },
});

export const updateRowConfigRequest =
  (
    widgetId: number,
    rowId: number,
    newConfig: {
      conditional_formatting?: Array<TableWidgetFormatRule>,
      summary_calculation?: string,
      ranking_calculation?: RankingCalculationConfig,
    },
    onSuccess?: Function,
    onError?: Function
  ): ThunkAction =>
  (dispatch: (action: Action) => Action, getState: Function) => {
    const codingSystemKey = getState().dashboard?.codingSystemKey;
    const tableContainer = getTableContainerByWidgetId(getState(), widgetId);
    const tableType = tableContainer.config.table_type;

    const existingRow = getTableRowByIdFactory(rowId)(getState());
    const existingRowConfig = existingRow?.config || {};

    const updatedConfig = Object.assign({}, existingRowConfig, newConfig);

    dispatch(updateRowConfig(widgetId, rowId, updatedConfig));

    const getParams = () => {
      switch (tableType) {
        case 'COMPARISON':
          return {
            population: existingRow.population,
          };
        case 'LONGITUDINAL':
          return {
            time_scope: existingRow.time_scope,
          };
        case 'SCORECARD':
          return {
            data_source_type: getDataSourceType(
              existingRow.table_element?.data_source
            ),
            input_params: getInputParamsFromDataSource(
              existingRow.table_element?.data_source,
              codingSystemKey
            ),
            summary: existingRow.table_element?.calculation,
          };
        default:
          return {};
      }
    };

    $.ajax({
      method: 'PUT',
      url: `/table_containers/${tableContainer.id}/table_rows/${rowId}`,
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
      },
      contentType: 'application/json',
      data: JSON.stringify({
        config: updatedConfig,
        ...getParams(),
      }),
    })
      .done(onSuccess)
      .fail(onError);
  };

export const toggleTableFormattingPanel = (): Action => ({
  type: 'TOGGLE_TABLE_FORMATTING_PANEL',
});

export const addEditTableRowLoading = (): Action => ({
  type: 'ADD_EDIT_TABLE_ROW_LOADING',
});

export const addTableRowSuccess = (
  widgetId: number,
  newRow: TableWidgetRow
): Action => ({
  type: 'ADD_TABLE_ROW_SUCCESS',
  payload: {
    widgetId,
    newRow,
  },
});

export const addMultipleTableRowSuccess = (
  widgetId: number,
  newRows: Array<TableWidgetRow>
): Action => ({
  type: 'ADD_MULTIPLE_TABLE_ROW_SUCCESS',
  payload: {
    widgetId,
    newRows,
  },
});

export const addTableRowFailure = (): Action => ({
  type: 'ADD_TABLE_ROW_FAILURE',
});

export const addTableColumnSuccess = (
  widgetId: number,
  newColumn: TableWidgetColumn | TableFormulaColumnResponse
): Action => ({
  type: 'ADD_TABLE_COLUMN_SUCCESS',
  payload: {
    widgetId,
    newColumn,
  },
});

export const addTableColumnFailure = (): Action => ({
  type: 'ADD_TABLE_COLUMN_FAILURE',
});

export const setTableElementFilter = (
  panel: 'column' | 'row',
  filter: TableElementFilter,
  value: TableElementFilterValue
): Action => ({
  type: 'SET_TABLE_ELEMENT_FILTER',
  payload: {
    panel,
    filter,
    value,
  },
});

export const setTableColumnTimePeriodLength = (
  timePeriodLength: number
): Action => ({
  type: 'SET_TABLE_COLUMN_TIME_PERIOD_LENGTH',
  payload: {
    timePeriodLength,
  },
});

export const setTableColumnTimePeriodLengthOffset = (
  timePeriodLengthOffset: number
): Action => ({
  type: 'SET_TABLE_COLUMN_TIME_PERIOD_LENGTH_OFFSET',
  payload: {
    timePeriodLengthOffset,
  },
});

export const deleteTableColumnLoading = (): Action => ({
  type: 'DELETE_TABLE_COLUMN_LOADING',
});

export const deleteTableColumnSuccess = (
  widgetId: number,
  columnId: number
): Action => ({
  type: 'DELETE_TABLE_COLUMN_SUCCESS',
  payload: {
    widgetId,
    columnId,
  },
});

export const deleteTableColumnFailure = (): Action => ({
  type: 'DELETE_TABLE_COLUMN_FAILURE',
});

export const deleteTableRowLoading = (): Action => ({
  type: 'DELETE_TABLE_ROW_LOADING',
});

export const deleteTableRowFailure = (): Action => ({
  type: 'DELETE_TABLE_ROW_FAILURE',
});

export const deleteTableRowSuccess = (
  widgetId: number,
  rowId: number
): Action => ({
  type: 'DELETE_TABLE_ROW_SUCCESS',
  payload: {
    widgetId,
    rowId,
  },
});

export const updateFormattingRuleType = (
  type: string,
  index: number
): Action => ({
  type: 'UPDATE_FORMATTING_RULE_TYPE',
  payload: {
    type,
    index,
  },
});

export const updateFormattingRuleCondition = (
  condition: string,
  index: number
): Action => ({
  type: 'UPDATE_FORMATTING_RULE_CONDITION',
  payload: {
    condition,
    index,
  },
});

export const updateFormattingRuleValue = (
  value: number,
  index: number
): Action => ({
  type: 'UPDATE_FORMATTING_RULE_VALUE',
  payload: {
    value,
    index,
  },
});

export const updateFormattingRuleColor = (
  color: string,
  index: number
): Action => ({
  type: 'UPDATE_FORMATTING_RULE_COLOR',
  payload: {
    color,
    index,
  },
});

export const setRowCalculatedCachedAtUpdate = (
  widgetId: number,
  rowId: number
): Action => ({
  type: 'SET_ROW_CALCULATED_CACHED_AT_UPDATE',
  payload: {
    widgetId,
    rowId,
  },
});

export const setRowCalculatedCachedAtRefreshCache = (
  widgetId: number
): Action => ({
  type: 'SET_ROW_CALCULATED_CACHED_AT_REFRESH_CACHE',
  payload: {
    widgetId,
  },
});

export const setColumnCalculatedCachedAtUpdate = (
  widgetId: number,
  columnId: number
): Action => ({
  type: 'SET_COLUMN_CALCULATED_CACHED_AT_UPDATE',
  payload: {
    widgetId,
    columnId,
  },
});

export const setColumnLoadingStatus = (
  tableContainerId: number,
  columnId: number,
  loadingStatus: string
): Action => ({
  type: 'SET_COLUMN_LOADING_STATUS',
  payload: {
    tableContainerId,
    columnId,
    loadingStatus,
  },
});

export const setRowLoadingStatus = (
  tableContainerId: number,
  rowId: number,
  loadingStatus: string
): Action => ({
  type: 'SET_ROW_LOADING_STATUS',
  payload: {
    tableContainerId,
    rowId,
    loadingStatus,
  },
});

export const setColumnCalculatedCachedAtRefreshCache = (
  widgetId: number
): Action => ({
  type: 'SET_COLUMN_CALCULATED_CACHED_AT_REFRESH_CACHE',
  payload: {
    widgetId,
  },
});

export const addFormattingRule = (): Action => ({
  type: 'ADD_FORMATTING_RULE',
});

export const removeFormattingRule = (index: number): Action => ({
  type: 'REMOVE_FORMATTING_RULE',
  payload: {
    index,
  },
});

export const saveTableFormattingLoading = (): Action => ({
  type: 'SAVE_TABLE_FORMATTING_LOADING',
});

export const saveScorecardTableFormattingSuccess = (
  appliedRules: Array<TableWidgetFormatRule>
): Action => ({
  type: 'SAVE_SCORECARD_TABLE_FORMATTING_SUCCESS',
  payload: {
    appliedRules,
  },
});

export const saveTableFormattingFailure = (): Action => ({
  type: 'SAVE_TABLE_FORMATTING_FAILURE',
});

export const saveComparisonTableFormatting =
  (): ThunkAction =>
  (dispatch: (action: Action) => Action, getState: Function) => {
    dispatch(saveTableFormattingLoading());
    const codingSystemKey = getState().dashboard?.codingSystemKey;
    const {
      widgetId,
      formattingPanel: { formattableId: columnId, appliedFormat: appliedRules },
    } = getState().tableWidget;
    const existingColumn = getTableColumnByIdFactory(columnId)(getState());
    const existingColumnConfig = existingColumn?.config || {};
    let config = Object.assign({}, existingColumnConfig, {
      conditional_formatting: appliedRules,
    });

    if (appliedRules.length === 0) {
      // Stripping out conditional_formatting field if empty
      // eslint-disable-next-line camelcase
      const { conditional_formatting, ...rest } = config;

      config = {
        ...rest,
      };
    }

    $.ajax({
      method: 'PUT',
      url: `/table_containers/${
        getState().tableWidget.tableContainerId
      }/table_columns/${columnId}`,
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
      },
      contentType: 'application/json',
      data: JSON.stringify({
        data_source_type: getDataSourceType(
          existingColumn.table_element?.data_source
        ),
        input_params: getInputParamsFromDataSource(
          existingColumn.table_element?.data_source,
          codingSystemKey
        ),
        summary: existingColumn.table_element?.calculation,
        ...(Object.keys(existingColumn.time_scope).length && {
          time_scope: existingColumn.time_scope,
        }),
        population: existingColumn.population,
        element_config: existingColumn.table_element?.config,
        config,
      }),
    })
      .done(() => {
        dispatch(updateColumnConfig(widgetId, columnId, config));
        dispatch(
          // $FlowFixMe
          fetchWidgetContent(getState().tableWidget.widgetId, 'table')
        );
        dispatch(toggleTableFormattingPanel());
      })
      .fail(() => {
        dispatch(saveTableFormattingFailure());
      });
  };

export const saveScorecardTableFormatting =
  (): ThunkAction =>
  (dispatch: (action: Action) => Action, getState: Function) => {
    dispatch(saveTableFormattingLoading());

    const widgetId = getState().tableWidget.widgetId;
    const rowId = getState().tableWidget.formattingPanel.formattableId;
    const appliedRules = getState().tableWidget.formattingPanel.appliedFormat;

    dispatch(
      // $FlowFixMe
      updateRowConfigRequest(
        widgetId,
        rowId,
        {
          conditional_formatting: appliedRules,
        },
        () => {
          dispatch(toggleTableFormattingPanel());
          dispatch(saveScorecardTableFormattingSuccess(appliedRules));
          dispatch(
            // $FlowFixMe
            fetchWidgetContent(getState().tableWidget.widgetId, 'table')
          );
        },
        () => {
          dispatch(saveTableFormattingFailure());
        }
      )
    );
  };

export const changeColumnSummaryLoading = (): Action => ({
  type: 'CHANGE_COLUMN_SUMMARY_LOADING',
});

export const changeColumnSummarySuccess = (
  existingTableColumns: Array<TableWidgetColumn>,
  columnId: number,
  summaryCalc: string
): Action => ({
  type: 'CHANGE_COLUMN_SUMMARY_SUCCESS',
  payload: {
    existingTableColumns,
    columnId,
    summaryCalc,
  },
});

export const changeColumnSummaryFailure = (): Action => ({
  type: 'CHANGE_COLUMN_SUMMARY_FAILURE',
});

export const changeColumnSummary =
  (
    tableContainerId: number,
    columnId: number,
    summaryCalc: string,
    widgetId: number,
    existingTableColumns: Array<TableWidgetColumn>
  ): ThunkAction =>
  (dispatch: (action: Action) => Action, getState: Function) => {
    dispatch(changeColumnSummaryLoading());
    const codingSystemKey = getState().dashboard?.codingSystemKey;
    const tableContainer = getTableContainerByWidgetId(getState(), widgetId);
    const tableType = tableContainer.config.table_type;

    const existingColumn = getTableColumnByIdFactory(columnId)(getState());
    const existingColumnConfig = existingColumn?.config || {};

    const getParams = () => {
      switch (tableType) {
        case 'COMPARISON':
          return {
            data_source_type: getDataSourceType(
              existingColumn.table_element?.data_source
            ),
            input_params: getInputParamsFromDataSource(
              existingColumn.table_element?.data_source,
              codingSystemKey
            ),
            summary: existingColumn.table_element?.calculation,
            time_scope: existingColumn.time_scope,
          };
        case 'LONGITUDINAL':
          return {
            data_source_type: getDataSourceType(
              existingColumn.table_element?.data_source
            ),
            input_params: getInputParamsFromDataSource(
              existingColumn.table_element?.data_source,
              codingSystemKey
            ),
            summary: existingColumn.table_element?.calculation,
            population: existingColumn.population,
          };
        case 'SCORECARD':
          return {
            time_scope: existingColumn.time_scope,
            population: existingColumn.population,
          };
        default:
          return {};
      }
    };

    $.ajax({
      method: 'PUT',
      url: `/table_containers/${tableContainerId}/table_columns/${columnId}`,
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
      },
      contentType: 'application/json',
      data: JSON.stringify({
        config: Object.assign({}, existingColumnConfig, {
          summary_calculation: summaryCalc,
        }),
        ...getParams(),
      }),
    })
      .done(() => {
        dispatch(
          changeColumnSummarySuccess(
            existingTableColumns,
            columnId,
            summaryCalc
          )
        );
        dispatch(
          // $FlowFixMe
          fetchWidgetContent(widgetId, 'table')
        );
      })
      .fail(() => {
        dispatch(changeColumnSummaryFailure());
      });
  };

export const lockColumnPivotLoading = (): Action => ({
  type: 'LOCK_COLUMN_PIVOT_LOADING',
});

export const lockColumnPivotSuccess = (
  existingTableColumns: Array<TableWidgetColumn>,
  columnId: number,
  pivotLocked: boolean
): Action => ({
  type: 'LOCK_COLUMN_PIVOT_SUCCESS',
  payload: {
    existingTableColumns,
    columnId,
    pivotLocked,
  },
});

export const lockColumnPivotFailure = (): Action => ({
  type: 'LOCK_COLUMN_PIVOT_FAILURE',
});

export const lockColumnPivot =
  (
    tableContainerId: number,
    columnId: number,
    pivotLocked: boolean,
    widgetId: number
  ): ThunkAction =>
  (dispatch: (action: Action) => Action, getState: Function) => {
    dispatch(lockColumnPivotLoading());
    const codingSystemKey = getState().dashboard?.codingSystemKey;
    const tableContainer = getTableContainerByWidgetId(getState(), widgetId);
    const tableType = tableContainer.config.table_type;

    const existingColumn = getTableColumnByIdFactory(columnId)(getState());
    const existingColumnConfig = existingColumn?.config;

    const getParams = () => {
      switch (tableType) {
        case 'COMPARISON':
          return {
            data_source_type: getDataSourceType(
              existingColumn.table_element?.data_source
            ),
            input_params: getInputParamsFromDataSource(
              existingColumn.table_element?.data_source,
              codingSystemKey
            ),
            summary: existingColumn.table_element?.calculation,
            time_scope: existingColumn.time_scope,
          };
        case 'LONGITUDINAL':
          return {
            data_source_type: getDataSourceType(
              existingColumn.table_element?.data_source
            ),
            input_params: getInputParamsFromDataSource(
              existingColumn.table_element?.data_source,
              codingSystemKey
            ),
            summary: existingColumn.table_element?.calculation,
            population: existingColumn.population,
          };
        case 'SCORECARD':
          return {
            time_scope: existingColumn.time_scope,
            population: existingColumn.population,
          };
        default:
          return {};
      }
    };

    const newConfig = Object.assign({}, existingColumnConfig, {
      pivot_locked: pivotLocked,
    });

    $.ajax({
      method: 'PUT',
      url: `/table_containers/${tableContainerId}/table_columns/${columnId}`,
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
      },
      contentType: 'application/json',
      data: JSON.stringify({
        config: newConfig,
        ...getParams(),
      }),
    })
      .done(() => {
        dispatch(updateColumnConfig(widgetId, columnId, newConfig));
        dispatch(
          // $FlowFixMe
          fetchWidgetContent(widgetId, 'table')
        );
      })
      .fail(() => {
        dispatch(lockColumnPivotFailure());
      });
  };

export const deleteTableColumn =
  (widgetId: number, tableContainerId: number, columnId: number): ThunkAction =>
  (dispatch: (action: Action) => Action) => {
    dispatch(deleteTableColumnLoading());

    $.ajax({
      method: 'DELETE',
      url: `/table_containers/${tableContainerId}/table_columns/${columnId}`,
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
      },
    })
      .done(() => {
        dispatch(deleteTableColumnSuccess(widgetId, columnId));
      })
      .fail(() => {
        dispatch(deleteTableColumnFailure());
      });
  };

export const deleteTableRow =
  (widgetId: number, tableContainerId: number, rowId: number): ThunkAction =>
  (dispatch: (action: Action) => Action) => {
    dispatch(deleteTableRowLoading());

    $.ajax({
      method: 'DELETE',
      url: `/table_containers/${tableContainerId}/table_rows/${rowId}`,
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
      },
    })
      .done(() => {
        dispatch(deleteTableRowSuccess(widgetId, rowId));
      })
      .fail(() => {
        dispatch(deleteTableRowFailure());
      });
  };

export const updateTableNameSuccess = (): Action => ({
  type: 'UPDATE_TABLE_NAME_SUCCESS',
});

export const updateTableNameFailure = (): Action => ({
  type: 'UPDATE_TABLE_NAME_FAILURE',
});

export const updateTableName =
  (
    widgetId: number,
    tableName: string,
    tableConfig: { table_type: string, show_summary: boolean }
  ): ThunkAction =>
  (dispatch: (action: Action) => Action, getState: Function) => {
    $.ajax({
      method: 'PUT',
      url: `/widgets/${widgetId}`,
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
      },
      contentType: 'application/json',
      data: JSON.stringify({
        container_type: getState().staticData.containerType,
        container_id: getState().dashboard.activeDashboard.id,
        widget: {
          name: tableName,
          config: tableConfig,
        },
      }),
    })
      .done(() => {
        dispatch(updateTableNameSuccess());
      })
      .fail(() => {
        dispatch(updateTableNameFailure());
      });
  };

export const updateSummaryVisibilityLoading = (): Action => ({
  type: 'UPDATE_TABLE_SUMMARY_VISIBILITY_LOADING',
});

export const updateSummaryVisibilitySuccess = (
  updatedWidget: WidgetData
): Action => ({
  type: 'UPDATE_TABLE_SUMMARY_VISIBILITY_SUCCESS',
  payload: {
    updatedWidget,
  },
});

export const updateSummaryVisibilityFailure = (): Action => ({
  type: 'UPDATE_TABLE_SUMMARY_VISIBILITY_FAILURE',
});

export const updateSummaryVisibility =
  (
    widgetId: number,
    tableName: string,
    tableType: TableWidgetType,
    showSummary: boolean
  ): ThunkAction =>
  (dispatch: (action: Action) => Action, getState: Function) => {
    dispatch(updateSummaryVisibilityLoading());

    $.ajax({
      method: 'PUT',
      url: `/widgets/${widgetId}`,
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
      },
      contentType: 'application/json',
      data: JSON.stringify({
        container_type: getState().staticData.containerType,
        container_id: getState().dashboard.activeDashboard.id,
        widget: {
          name: tableName,
          config: {
            table_type: tableType,
            show_summary: showSummary,
          },
        },
      }),
    })
      .done((response) => {
        dispatch(updateSummaryVisibilitySuccess(response.container_widget));
        dispatch(
          // $FlowFixMe
          fetchWidgetContent(response.container_widget.id, 'table')
        );
      })
      .fail(() => {
        dispatch(updateSummaryVisibilityFailure());
      });
  };

const updateTableColumnOrder = (
  columnId: number,
  widgetId: number,
  newOrder: number
): Action => ({
  type: 'UPDATE_COLUMN_ORDER',
  payload: {
    columnId,
    newOrder,
    widgetId,
  },
});

const updateTableColumnOrderFailure = (): Action => ({
  type: 'UPDATE_COLUMN_ORDER_FAILURE',
});

const updateTableColumnOrderRequest =
  (
    widgetId: number,
    columnId: number,
    tableContainerId: number,
    newOrder: number
  ) =>
  (dispatch: (action: Action) => Promise<>, getState: Function) => {
    const codingSystemKey = getState().dashboard?.codingSystemKey;
    const tableContainer = getTableContainerByWidgetId(getState(), widgetId);
    const tableType = tableContainer.config.table_type;

    const existingColumn = getTableColumnByIdFactory(columnId)(getState());

    const getParams = () => {
      switch (tableType) {
        case 'COMPARISON':
          return {
            data_source_type: getDataSourceType(
              existingColumn.table_element?.data_source
            ),
            input_params: getInputParamsFromDataSource(
              existingColumn.table_element?.data_source,
              codingSystemKey
            ),
            summary: existingColumn.table_element?.calculation,
            time_scope: existingColumn.time_scope,
          };
        case 'LONGITUDINAL':
          return {
            data_source_type: getDataSourceType(
              existingColumn.table_element?.data_source
            ),
            input_params: getInputParamsFromDataSource(
              existingColumn.table_element?.data_source,
              codingSystemKey
            ),
            summary: existingColumn.table_element?.calculation,
            population: existingColumn.population,
          };
        case 'SCORECARD':
          return {
            time_scope: existingColumn.time_scope,
            population: existingColumn.population,
          };
        default:
          return {};
      }
    };

    return $.ajax({
      method: 'PUT',
      url: `/table_containers/${tableContainerId}/table_columns/${columnId}`,
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
      },
      contentType: 'application/json',
      data: JSON.stringify({
        order: newOrder,
        ...getParams(),
      }),
    })
      .done(() => {
        dispatch(updateTableColumnOrder(columnId, widgetId, newOrder));
      })
      .fail(() => {
        dispatch(updateTableColumnOrderFailure());
      });
  };

export const updateTableColumns =
  (
    widgetId: number,
    oldColumnIndex: number,
    newColumnIndex: number
  ): ThunkAction =>
  (dispatch: (action: Action | ThunkAction) => Action, getState: Function) => {
    const extractOrders = (columns) => {
      return columns.reduce((acc, currentColumn) => {
        return {
          ...acc,
          [currentColumn.id]: currentColumn.order,
        };
      }, {});
    };

    const tableContainer = getTableContainerByWidgetId(getState(), widgetId);
    const previousColumns = tableContainer.columns;
    const tableContainerId = tableContainer.id;
    const updatedColumns = arrayMove(
      previousColumns,
      oldColumnIndex,
      newColumnIndex
    ).map((col, index) => {
      return {
        ...col,
        order: index + 1,
      };
    });

    const updatedOrders = extractOrders(updatedColumns);
    const previousOrders = extractOrders(previousColumns);

    Object.keys(previousOrders).forEach((columnId) => {
      const previousOrder = previousOrders[columnId];
      const updatedOrder = updatedOrders[columnId];

      if (updatedOrder !== previousOrder) {
        dispatch(
          updateTableColumnOrderRequest(
            widgetId,
            parseInt(columnId, 10),
            tableContainerId,
            updatedOrder
          )
        );
      }
    });
  };

export const duplicateColumnIsLoading = (columnId: number): Action => ({
  type: 'DUPLICATE_COLUMN_IS_LOADING',
  payload: {
    columnId,
  },
});

export const duplicateColumnError = (columnId: number): Action => ({
  type: 'DUPLICATE_COLUMN_ERROR',
  payload: {
    columnId,
  },
});

export const duplicateColumnSuccess = (columnId: number): Action => ({
  type: 'DUPLICATE_COLUMN_SUCCESS',
  payload: {
    columnId,
  },
});

export const clearDuplicateColumnError = (columnId: number): Action => ({
  type: 'CLEAR_DUPLICATE_COLUMN_ERROR',
  payload: {
    columnId,
  },
});

export const duplicateTableColumn =
  (widgetId: number, columnId: number): ThunkAction =>
  (dispatch: (action: Action | ThunkAction) => Action, getState: Function) => {
    const codingSystemKey = getState().dashboard?.codingSystemKey;
    const tableContainer = getTableContainerByWidgetId(getState(), widgetId);
    const columnToDuplicate =
      _find(tableContainer.columns, { id: columnId }) || {};

    dispatch(clearDuplicateColumnError(columnId));
    dispatch(duplicateColumnIsLoading(columnId));

    let params = {};
    const duplicateColumnName = `${columnToDuplicate.name} copy`;
    switch (tableContainer.config.table_type) {
      case 'COMPARISON':
        params = {
          name: duplicateColumnName,
          data_source_type: getDataSourceType(
            columnToDuplicate.table_element?.data_source
          ),
          input_params: getInputParamsFromDataSource(
            columnToDuplicate.table_element?.data_source,
            codingSystemKey
          ),
          summary: columnToDuplicate.table_element.calculation,
          time_scope: columnToDuplicate.time_scope,
          order: columnToDuplicate.order + 1,
        };
        break;
      case 'LONGITUDINAL':
        params = {
          name: duplicateColumnName,
          data_source_type: getDataSourceType(
            columnToDuplicate.table_element?.data_source
          ),
          input_params: getInputParamsFromDataSource(
            columnToDuplicate.table_element?.data_source,
            codingSystemKey
          ),
          summary: columnToDuplicate.table_element.calculation,
          population: columnToDuplicate.population,
          order: columnToDuplicate.order + 1,
        };
        break;
      case 'SCORECARD':
        params = {
          population: columnToDuplicate.population,
          time_scope: columnToDuplicate.time_scope,
          order: columnToDuplicate.order + 1,
        };
        break;

      default:
        break;
    }

    $.ajax({
      method: 'POST',
      url: `/table_containers/${tableContainer.id}/table_columns`,
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
      },
      contentType: 'application/json',
      data: JSON.stringify(params),
    })
      .done((response) => {
        const updatedColumnRequests = [];

        // Updating the order of all the columns to the "right" of the new colulm
        tableContainer.columns.forEach((column) => {
          if (column.order >= response.order) {
            updatedColumnRequests.push(
              dispatch(
                updateTableColumnOrderRequest(
                  widgetId,
                  parseInt(column.id, 10),
                  tableContainer.id,
                  column.order + 1
                )
              )
            );
          }
        });

        // BE returns `null` values for `name` and `table_element`
        // TODO: Temporary fix - Remove the snippet below whenever the response is updated from the API.
        const updatedResponse = {
          ...response,
          name: params.name || columnToDuplicate.name,
          table_element: columnToDuplicate.table_element,
        };

        Promise.all(updatedColumnRequests).then(() => {
          dispatch(addTableColumnSuccess(widgetId, updatedResponse));
          dispatch(duplicateColumnSuccess(columnId));
        });
      })
      .fail(() => {
        dispatch(duplicateColumnError(columnId));
      });
  };

export const setColumnWidthType = (
  widgetId: number,
  columnWidthType: ColumnWidthType
): Action => ({
  type: 'SET_COLUMN_WIDTH_TYPE',
  payload: {
    widgetId,
    columnWidthType,
  },
});

export const setColumnWidthTypeRequest =
  (widgetId: number, columnWidthType: ColumnWidthType): ThunkAction =>
  (dispatch: (action: Action | ThunkAction) => Action, getState: Function) => {
    dispatch(setColumnWidthType(widgetId, columnWidthType));

    const widget = getWidgetById(getState(), widgetId);
    const tableContainer = getTableContainerByWidgetId(getState(), widgetId);

    $.ajax({
      method: 'PUT',
      url: `/widgets/${widgetId}`,
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
      },
      contentType: 'application/json',
      data: JSON.stringify({
        container_type: getState().staticData.containerType,
        container_id: getState().dashboard.activeDashboard.id,
        widget: {
          population: tableContainer.population,
          name: widget.widget_render.name,
          config: {
            ...tableContainer.config,
            column_width_type: columnWidthType,
          },
        },
      }),
    });
  };

export const setTableSortOrder = (
  widgetId: number,
  columnId: number,
  order: ColumnSortType
): Action => ({
  type: 'SET_TABLE_SORT_ORDER',
  payload: {
    widgetId,
    columnId,
    order,
  },
});

export const setTableSortOrderRequest =
  (widgetId: number, columnId: number, order: ColumnSortType): ThunkAction =>
  (dispatch: (action: Action | ThunkAction) => Action, getState: Function) => {
    dispatch(setTableSortOrder(widgetId, columnId, order));

    const widget = getWidgetById(getState(), widgetId);
    const tableContainer = getTableContainerByWidgetId(getState(), widgetId);

    $.ajax({
      method: 'PUT',
      url: `/widgets/${widgetId}`,
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
      },
      contentType: 'application/json',
      data: JSON.stringify({
        container_type: getState().staticData.containerType,
        container_id: getState().dashboard.activeDashboard.id,
        widget: {
          population: tableContainer.population,
          name: widget.widget_render.name,
          config: {
            ...tableContainer.config,
            table_sort: [
              {
                column_id: columnId,
                order_direction: order,
              },
            ],
          },
        },
      }),
    });
  };

export const setRefreshWidgetCacheStatus = (
  widgetId: number,
  status: boolean
): Action => ({
  type: 'SET_REFRESH_WIDGET_CACHE_STATUS',
  payload: {
    widgetId,
    status,
  },
});

export const updateColumnConfigRequest =
  (
    widgetId: number,
    columnId: number,
    newConfig: {
      conditional_formatting?: Array<TableWidgetFormatRule>,
      summary_calculation?: string,
      pivot_locked?: boolean,
      ranking_calculation?: RankingCalculationConfig,
    }
  ): ThunkAction =>
  (dispatch: (action: Action) => Action, getState: Function) => {
    const codingSystemKey = getState().dashboard?.codingSystemKey;
    const tableContainer = getTableContainerByWidgetId(getState(), widgetId);
    const tableType = tableContainer.config.table_type;

    const existingColumn = getTableColumnByIdFactory(columnId)(getState());
    const existingColumnConfig = existingColumn?.config || {};

    const updatedConfig = Object.assign({}, existingColumnConfig, newConfig);

    dispatch(updateColumnConfig(widgetId, columnId, updatedConfig));

    const getParams = () => {
      switch (tableType) {
        case 'COMPARISON':
          return {
            data_source_type: getDataSourceType(
              existingColumn.table_element?.data_source
            ),
            input_params: getInputParamsFromDataSource(
              existingColumn.table_element?.data_source,
              codingSystemKey
            ),
            summary: existingColumn.table_element?.calculation,
            time_scope: existingColumn.time_scope,
          };
        case 'LONGITUDINAL':
          return {
            data_source_type: getDataSourceType(
              existingColumn.table_element?.data_source
            ),
            input_params: getInputParamsFromDataSource(
              existingColumn.table_element?.data_source,
              codingSystemKey
            ),
            summary: existingColumn.table_element?.calculation,
            population: existingColumn.population,
          };
        case 'SCORECARD':
          return {
            time_scope: existingColumn.time_scope,
            population: existingColumn.population,
          };
        default:
          return {};
      }
    };

    $.ajax({
      method: 'PUT',
      url: `/table_containers/${tableContainer.id}/table_columns/${columnId}`,
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
      },
      contentType: 'application/json',
      data: JSON.stringify({
        config: updatedConfig,
        ...getParams(),
      }),
    });
  };
