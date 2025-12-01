// @flow
import $ from 'jquery';
import { fetchWidgetContent } from '@kitman/modules/src/analysis/Dashboard/redux/actions/widgets';
import {
  addTableRowSuccess,
  addTableRowFailure,
  addTableColumnSuccess,
  addTableColumnFailure,
  addEditTableRowLoading,
  setColumnCalculatedCachedAtUpdate,
  setRowCalculatedCachedAtUpdate,
  addMultipleTableRowSuccess,
} from '@kitman/modules/src/analysis/Dashboard/redux/actions/tableWidget';
import {
  formatPopulationPayload,
  getInputParamsFromDataSource,
  getNonEmptyParams,
} from '@kitman/modules/src/analysis/Dashboard/utils';
import {
  reset as resetColumnFormulaPanel,
  setLoading as setFormulaPanelLoading,
} from '@kitman/modules/src/analysis/Dashboard/redux/slices/columnFormulaPanelSlice';
import {
  addTableFormulaColumn,
  updateTableFormulaColumn,
} from '@kitman/services/src/services/analysis';
import { prepareColumnFormulaSubmissionData } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/utils';

// Types
import type { SquadAthletesSelection } from '@kitman/components/src/types';
import type {
  Action,
  ThunkAction,
} from '@kitman/modules/src/analysis/Dashboard/redux/types/actions';
import type {
  TableElementFilters,
  TableWidgetAvailabilityStatus,
  TableWidgetCalculationParams,
  TableWidgetColumn,
  TableWidgetDataSource,
  TableWidgetMetric,
  TableWidgetParticipationStatus,
  TableWidgetRow,
  TableWidgetSourceSubtypes,
  TableWidgetType,
  WidgetType,
} from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/types';
import type { FormulaDetails } from '@kitman/modules/src/analysis/shared/types';
import type {
  InputParams,
  TimeScopeConfig,
} from '@kitman/modules/src/analysis/Dashboard/components/types';

// BE returns `null` values for `name` and `table_element`. So we use local values to update the UI.
const updateMissingColumnResponse = (response, columnDetails) => {
  const dataSource = columnDetails.dataSource;
  let columnDataSource = { ...dataSource };

  const columnConfig: {
    calculation_params?: TableWidgetCalculationParams,
    filters?: TableElementFilters,
  } = {
    filters: columnDetails.filters,
  };

  if (columnDetails.source === 'participation') {
    columnDataSource = {
      data_source_type: dataSource?.type,
      participation_level_ids: dataSource?.ids,
      name: dataSource?.name,
      status: dataSource?.status,
      involvement_event_type: dataSource?.event,
    };
  }

  if (columnDetails.source === 'metric') {
    columnConfig.calculation_params = columnDetails.calculation_params;
  }

  return {
    ...response,
    name: response.name || columnDetails.name,
    table_element: {
      calculation: columnDetails.calculation,
      config: columnConfig,
      data_source: columnDataSource,
      id: response.id,
      name: columnDetails.name,
    },
  };
};

// BE returns `null` values for `name` and `table_element`. So we use local values to update the UI.
const updateMissingRowResponse = (response, rowDetails) => {
  const dataSource = rowDetails.dataSource;
  let rowDataSource = { ...dataSource };

  const rowConfig: {
    calculation_params?: TableWidgetCalculationParams,
    filters?: TableElementFilters,
  } = {
    filters: rowDetails.filters,
  };

  if (rowDetails.source === 'participation') {
    rowDataSource = {
      data_source_type: dataSource?.type,
      participation_level_ids: dataSource?.ids,
      name: dataSource?.name,
      status: dataSource?.status,
    };
  }

  if (rowDetails.source === 'metric') {
    rowConfig.calculation_params = rowDetails.calculation_params;
  }

  return {
    ...response,
    name: response.name || rowDetails.dataSource.name,
    table_element: {
      calculation: rowDetails.calculation,
      config: {
        filters: rowDetails.filters,
      },
      data_source: rowDataSource,
      id: response.id,
      name: rowDetails.name,
    },
  };
};

export const openTableColumnPanel = (
  source: TableWidgetDataSource,
  widgetId: number,
  existingTableColumns: Array<TableWidgetColumn>,
  existingTableRows: Array<TableWidgetRow>,
  tableContainerId: number,
  tableName: string,
  tableType: WidgetType,
  showSummary: boolean
): Action => ({
  type: 'OPEN_TABLE_COLUMN_PANEL',
  payload: {
    source,
    widgetId,
    existingTableColumns,
    existingTableRows,
    tableContainerId,
    tableName,
    tableType,
    showSummary,
  },
});

export const openTableColumnFormulaPanel = (): Action => ({
  type: 'OPEN_TABLE_COLUMN_FORMULA_PANEL',
});

export const openTableRowPanel = (
  source: TableWidgetDataSource,
  widgetId: number,
  existingTableColumns: Array<TableWidgetColumn>,
  existingTableRows: Array<TableWidgetRow>,
  tableContainerId: number,
  tableName: string,
  tableType: TableWidgetType,
  showSummary: boolean
): Action => ({
  type: 'OPEN_TABLE_ROW_PANEL',
  payload: {
    source,
    widgetId,
    existingTableColumns,
    existingTableRows,
    tableContainerId,
    tableName,
    tableType,
    showSummary,
  },
});

export const toggleTableRowPanel = (): Action => ({
  type: 'TOGGLE_TABLE_ROW_PANEL',
});

export const toggleTableColumnPanel = (): Action => ({
  type: 'TOGGLE_TABLE_COLUMN_PANEL',
});

export const toggleTableColumnFormulaPanel = (): Action => ({
  type: 'TOGGLE_TABLE_COLUMN_FORMULA_PANEL',
});

export const addEditTableColumnLoading = (): Action => ({
  type: 'ADD_EDIT_TABLE_COLUMN_LOADING',
});

export const editComparisonTableColumn = (
  widgetId: number,
  existingTableColumns: Array<TableWidgetColumn>,
  tableContainerId: number,
  columnDetails: Object,
  tableType: TableWidgetType
): Action => ({
  type: 'EDIT_COMPARISON_TABLE_COLUMN',
  payload: {
    widgetId,
    existingTableColumns,
    tableContainerId,
    columnDetails,
    tableType,
  },
});

export const editScorecardTableColumn = (
  widgetId: number,
  existingTableColumns: Array<TableWidgetColumn>,
  tableContainerId: number,
  columnDetails: Object,
  tableType: TableWidgetType
): Action => ({
  type: 'EDIT_SCORECARD_TABLE_COLUMN',
  payload: {
    widgetId,
    existingTableColumns,
    tableContainerId,
    columnDetails,
    tableType,
  },
});

export const editLongitudinalTableColumn = (
  widgetId: number,
  existingTableColumns: Array<TableWidgetColumn>,
  tableContainerId: number,
  columnDetails: Object,
  tableType: TableWidgetType
): Action => ({
  type: 'EDIT_LONGITUDINAL_TABLE_COLUMN',
  payload: {
    widgetId,
    existingTableColumns,
    tableContainerId,
    columnDetails,
    tableType,
  },
});

export const editTableRow = (
  row: TableWidgetRow,
  tableContainerId: number,
  tableType: TableWidgetType,
  widgetId: number
): Action => ({
  type: 'EDIT_TABLE_ROW',
  payload: {
    row,
    tableContainerId,
    tableType,
    widgetId,
  },
});

export const editScorecardTableRowSuccess = (
  rowPanelDetails: Object,
  widgetId: number
): Action => ({
  type: 'EDIT_SCORECARD_TABLE_ROW_SUCCESS',
  payload: {
    rowPanelDetails,
    widgetId,
  },
});

export const editComparisonTableColumnSuccess = (
  widgetId: number,
  columnPanelDetails: Object
): Action => ({
  type: 'EDIT_COMPARISON_TABLE_COLUMN_SUCCESS',
  payload: {
    widgetId,
    columnPanelDetails,
  },
});

export const editLongitudinalTableRowSuccess = (
  rowPanelDetails: Object,
  widgetId: number
): Action => ({
  type: 'EDIT_LONGITUDINAL_TABLE_ROW_SUCCESS',
  payload: {
    rowPanelDetails,
    widgetId,
  },
});

export const editLongitudinalTableColumnSuccess = (
  widgetId: number,
  columnPanelDetails: Object
): Action => ({
  type: 'EDIT_LONGITUDINAL_TABLE_COLUMN_SUCCESS',
  payload: {
    widgetId,
    columnPanelDetails,
  },
});

export const editScorecardTableColumnSuccess = (
  widgetId: number,
  columnPanelDetails: Object
): Action => ({
  type: 'EDIT_SCORECARD_TABLE_COLUMN_SUCCESS',
  payload: {
    widgetId,
    columnPanelDetails,
  },
});

export const editComparisonTableRowSuccess = (
  rowPanelDetails: Object,
  widgetId: number,
  newRow: Object
): Action => ({
  type: 'EDIT_COMPARISON_TABLE_ROW_SUCCESS',
  payload: {
    rowPanelDetails,
    widgetId,
    newRow,
  },
});

export const editTableRowLoading = (): Action => ({
  type: 'EDIT_TABLE_ROW_LOADING',
});

export const editTableRowFailure = (): Action => ({
  type: 'EDIT_TABLE_ROW_FAILURE',
});

export const editTableColumnFailure = (): Action => ({
  type: 'EDIT_TABLE_COLUMN_FAILURE',
});

export const clickComparisonTableRowPanelApply =
  (): ThunkAction =>
  (dispatch: (action: Action) => Action, getState: Function) => {
    const { tableContainerId, widgetId, rowPanel } = getState().tableWidget;
    const { population, config, isEditMode, rowId } = rowPanel;

    const populationPayload = formatPopulationPayload(
      population,
      config,
      isEditMode
    );

    dispatch(addEditTableRowLoading());
    $.ajax({
      method: isEditMode ? 'PUT' : 'POST',
      url: isEditMode
        ? `/table_containers/${tableContainerId}/table_rows/${rowId}`
        : `/table_containers/${tableContainerId}/table_rows/bulk_population`,
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
      },
      contentType: 'application/json',
      data: JSON.stringify(populationPayload),
    })
      .done((response) => {
        if (isEditMode) {
          dispatch(editComparisonTableRowSuccess(rowPanel, widgetId, response));
        } else {
          dispatch(addMultipleTableRowSuccess(widgetId, [...response]));
        }
        dispatch(
          // $FlowFixMe
          fetchWidgetContent(getState().tableWidget.widgetId, 'table')
        );
        dispatch(toggleTableRowPanel());
      })
      .fail(() => {
        dispatch(addTableRowFailure());
      });
  };

export const setTableRowCalculation = (calculation: string): Action => ({
  type: 'SET_TABLE_ROW_CALCULATION',
  payload: {
    calculation,
  },
});

export const setTableRowCalculationParam = (
  calculationParam: $Keys<TableWidgetCalculationParams>,
  value: $Values<TableWidgetCalculationParams>
): Action => ({
  type: 'SET_TABLE_ROW_CALCULATION_PARAM',
  payload: {
    calculationParam,
    value,
  },
});

export const setTableRowDateRange = (range: Object): Action => ({
  type: 'SET_TABLE_ROW_DATE_RANGE',
  payload: {
    range,
  },
});

export const setTableRowMetrics = (
  metric: Array<TableWidgetMetric>
): Action => ({
  type: 'SET_TABLE_ROW_METRICS',
  payload: {
    metric,
  },
});

export const setTableRowTitle = (title: string): Action => ({
  type: 'SET_TABLE_ROW_TITLE',
  payload: {
    title,
  },
});

export const setTableRowDataSourceIds = (
  ids: Array<number>,
  type: TableWidgetDataSource,
  name: string
): Action => ({
  type: 'SET_TABLE_ROW_DATASOURCE_IDS',
  payload: {
    ids,
    type,
    name,
  },
});

export const setTableRowDataSourceType = (
  type: TableWidgetDataSource
): Action => ({
  type: 'SET_TABLE_ROW_DATASOURCE_TYPE',
  payload: {
    type,
  },
});

export const setTableRowActivity = (
  ids: number[] | number,
  type: TableWidgetDataSource,
  name: string
): Action => ({
  type: 'SET_TABLE_ROW_ACTIVITY',
  payload: {
    ids,
    type,
    name,
  },
});

export const setTableRowStatus = (
  status: TableWidgetAvailabilityStatus,
  name: string,
  type: TableWidgetDataSource
): Action => ({
  type: 'SET_TABLE_ROW_STATUS',
  payload: {
    status,
    name,
    type,
  },
});

export const setTableRowPopulation = (
  population: SquadAthletesSelection | Array<SquadAthletesSelection>
): Action => ({
  type: 'SET_TABLE_ROW_POPULATION',
  payload: {
    population,
  },
});

export const setTableRowGroupings = (groupings: {
  [key: string]: string,
}): Action => ({
  type: 'SET_TABLE_ROW_GROUPING',
  payload: {
    groupings,
  },
});

export const setTableRowTimePeriod = (timePeriod: string): Action => ({
  type: 'SET_TABLE_ROW_TIME_PERIOD',
  payload: {
    timePeriod,
  },
});

export const setTableRowTimePeriodLength = (
  timePeriodLength: number
): Action => ({
  type: 'SET_TABLE_ROW_TIME_PERIOD_LENGTH',
  payload: {
    timePeriodLength,
  },
});
export const setTableRowTimePeriodLengthOffset = (
  timePeriodLengthOffset: number
): Action => ({
  type: 'SET_TABLE_ROW_TIME_PERIOD_LENGTH_OFFSET',
  payload: {
    timePeriodLengthOffset,
  },
});

export const setTableRowSubtype = (
  subtype: $Keys<TableWidgetSourceSubtypes>,
  value: $Values<TableWidgetSourceSubtypes>
): Action => ({
  type: 'SET_TABLE_ROW_SUBTYPE',
  payload: {
    subtype,
    value,
  },
});

export const clickLongitudinalTableRowPanelApply =
  (addAnother: boolean): ThunkAction =>
  (dispatch: (action: Action) => Action, getState: Function) => {
    const rowPanelDetails = getState().tableWidget.rowPanel;
    const tableContainerId = getState().tableWidget.tableContainerId;
    const widgetId = getState().tableWidget.widgetId;

    dispatch(addEditTableRowLoading());

    $.ajax({
      method: rowPanelDetails.isEditMode ? 'PUT' : 'POST',
      url: rowPanelDetails.isEditMode
        ? `/table_containers/${tableContainerId}/table_rows/${rowPanelDetails.rowId}`
        : `/table_containers/${tableContainerId}/table_rows`,
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
      },
      contentType: 'application/json',
      data: JSON.stringify({ time_scope: rowPanelDetails.time_scope }),
    })
      .done((response) => {
        if (rowPanelDetails.isEditMode) {
          dispatch(editLongitudinalTableRowSuccess(rowPanelDetails, widgetId));
        } else {
          dispatch(addTableRowSuccess(widgetId, response));
        }
        dispatch(
          // $FlowFixMe
          fetchWidgetContent(widgetId, 'table')
        );

        if (!addAnother) dispatch(toggleTableRowPanel());
      })
      .fail(() => {
        dispatch(addTableRowFailure());
      });
  };

export const clickScorecardTableRowPanelApply =
  (addAnother: boolean): ThunkAction =>
  (dispatch: (action: Action) => Action, getState: Function) => {
    const codingSystemKey = getState().dashboard?.codingSystemKey;
    const rowPanelDetails = getState().tableWidget.rowPanel;
    const tableContainerId = getState().tableWidget.tableContainerId;
    const widgetId = getState().tableWidget.widgetId;

    dispatch(addEditTableRowLoading());

    $.ajax({
      method: rowPanelDetails.isEditMode ? 'PUT' : 'POST',
      url: rowPanelDetails.isEditMode
        ? `/table_containers/${tableContainerId}/table_rows/${rowPanelDetails.rowId}`
        : `/table_containers/${tableContainerId}/table_rows`,
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
      },
      contentType: 'application/json',
      data: JSON.stringify({
        data_source_type: rowPanelDetails.dataSource.type,
        input_params: getInputParamsFromDataSource(
          rowPanelDetails.dataSource,
          codingSystemKey
        ),
        name: rowPanelDetails.dataSource.name,
        summary: rowPanelDetails.calculation,
        element_config: {
          ...getNonEmptyParams('filters', rowPanelDetails.filters),
          ...getNonEmptyParams(
            'calculation_params',
            rowPanelDetails.calculation_params
          ),
        },
      }),
    })
      .done((response) => {
        if (rowPanelDetails.isEditMode) {
          dispatch(editScorecardTableRowSuccess(rowPanelDetails, widgetId));
        } else {
          dispatch(
            addTableRowSuccess(
              widgetId,
              updateMissingRowResponse(response, rowPanelDetails)
            )
          );
        }
        dispatch(
          // $FlowFixMe
          fetchWidgetContent(widgetId, 'table')
        );
        dispatch(setRowCalculatedCachedAtUpdate(widgetId, response?.id));
        if (!addAnother) dispatch(toggleTableRowPanel());
      })
      .fail(() => {
        dispatch(addTableRowFailure());
      });
  };

export const setTableColumnCalculation = (calculation: string): Action => ({
  type: 'SET_TABLE_COLUMN_CALCULATION',
  payload: {
    calculation,
  },
});

export const setTableColumnCalculationParam = (
  calculationParam: $Keys<TableWidgetCalculationParams>,
  value: $Values<TableWidgetCalculationParams>
): Action => ({
  type: 'SET_TABLE_COLUMN_CALCULATION_PARAM',
  payload: {
    calculationParam,
    value,
  },
});

export const setTableColumnDateRange = (range: Object): Action => ({
  type: 'SET_TABLE_COLUMN_DATE_RANGE',
  payload: {
    range,
  },
});

export const setTableColumnActivity = (
  ids: number[] | number,
  type: TableWidgetDataSource
): Action => ({
  type: 'SET_TABLE_COLUMN_ACTIVITY',
  payload: {
    ids,
    type,
  },
});

export const setTableColumnStatus = (
  status: TableWidgetAvailabilityStatus | TableWidgetParticipationStatus,
  type: TableWidgetDataSource
): Action => ({
  type: 'SET_TABLE_COLUMN_STATUS',
  payload: {
    status,
    type,
  },
});

export const setTableColumnDataSourceType = (
  type: TableWidgetDataSource
): Action => ({
  type: 'SET_TABLE_COLUMN_DATASOURCE_TYPE',
  payload: {
    type,
  },
});

export const setTableColumnDataSourceIds = (
  ids: Array<number>,
  type: TableWidgetDataSource
): Action => ({
  type: 'SET_TABLE_COLUMN_DATASOURCE_IDS',
  payload: {
    ids,
    type,
  },
});

export const setTableColumnMetrics = (
  metric: Array<TableWidgetMetric>
): Action => ({
  type: 'SET_TABLE_COLUMN_METRICS',
  payload: {
    metric,
  },
});

export const setTableColumnPopulation = (
  population: SquadAthletesSelection
): Action => ({
  type: 'SET_TABLE_COLUMN_POPULATION',
  payload: {
    population,
  },
});

export const setTableColumnTitle = (title: string): Action => ({
  type: 'SET_TABLE_COLUMN_TITLE',
  payload: {
    title,
  },
});

export const setTableColumnTimeInPositions = (
  positions: Array<number | string>
): Action => ({
  type: 'SET_TABLE_COLUMN_TIME_IN_POSITIONS',
  payload: {
    positions,
  },
});

export const setTableRowTimeInPositions = (
  positions: Array<number | string>
): Action => ({
  type: 'SET_TABLE_ROW_TIME_IN_POSITIONS',
  payload: {
    positions,
  },
});

export const setTableColumnTimeInFormation = (
  formations: Array<number | string>
): Action => ({
  type: 'SET_TABLE_COLUMN_TIME_IN_FORMATION',
  payload: {
    formations,
  },
});

export const setTableRowTimeInFormation = (
  formations: Array<number | string>
): Action => ({
  type: 'SET_TABLE_ROW_TIME_IN_FORMATION',
  payload: {
    formations,
  },
});

export const setTableColumnTimePeriod = (timePeriod: string): Action => ({
  type: 'SET_TABLE_COLUMN_TIME_PERIOD',
  payload: {
    timePeriod,
  },
});

export const setTableColumnTimePeriodConfig = (config: TimeScopeConfig) => ({
  type: 'SET_TABLE_COLUMN_TIME_PERIOD_CONFIG',
  payload: {
    config,
  },
});

export const setTableColumnSubType = (
  subtype: $Keys<TableWidgetSourceSubtypes>,
  value: $Values<TableWidgetSourceSubtypes>
): Action => ({
  type: 'SET_TABLE_COLUMN_SUBTYPE',
  payload: {
    subtype,
    value,
  },
});

export const setTableColumnGameKinds = (
  kinds: string | Array<string>,
  type: TableWidgetDataSource
): Action => ({
  type: 'SET_TABLE_COLUMN_GAME_KINDS',
  payload: {
    kinds,
    type,
  },
});

export const setTableRowGameKinds = (
  kinds: string | Array<string>,
  type: TableWidgetDataSource
): Action => ({
  type: 'SET_TABLE_ROW_GAME_KINDS',
  payload: {
    kinds,
    type,
  },
});

export const setTableColumnGameResult = (
  result: string,
  type: TableWidgetDataSource
): Action => ({
  type: 'SET_TABLE_COLUMN_GAME_RESULT',
  payload: {
    result,
    type,
  },
});

export const setTableRowGameResult = (
  result: string,
  type: TableWidgetDataSource
): Action => ({
  type: 'SET_TABLE_ROW_GAME_RESULT',
  payload: {
    result,
    type,
  },
});

export const setTableColumnEventType = (
  event: string,
  type: TableWidgetDataSource
): Action => ({
  type: 'SET_TABLE_COLUMN_EVENT_TYPE',
  payload: {
    event,
    type,
  },
});

export const setTableRowEventType = (
  event: string,
  type: TableWidgetDataSource
): Action => ({
  type: 'SET_TABLE_ROW_EVENT_TYPE',
  payload: {
    event,
    type,
  },
});

export const clickComparisonTableColumnPanelApply =
  (addAnother: boolean): ThunkAction =>
  (dispatch: (action: Action) => Action, getState: Function) => {
    const codingSystemKey = getState().dashboard?.codingSystemKey;
    const columnPanelDetails = getState().tableWidget.columnPanel;
    const tableContainerId = getState().tableWidget.tableContainerId;
    const widgetId = getState().tableWidget.widgetId;

    dispatch(addEditTableColumnLoading());

    $.ajax({
      method: columnPanelDetails.isEditMode ? 'PUT' : 'POST',
      url: columnPanelDetails.isEditMode
        ? `/table_containers/${tableContainerId}/table_columns/${columnPanelDetails.columnId}`
        : `/table_containers/${tableContainerId}/table_columns`,
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
      },
      contentType: 'application/json',
      data: JSON.stringify({
        name: columnPanelDetails.name,
        data_source_type: columnPanelDetails.dataSource.type,
        input_params: getInputParamsFromDataSource(
          columnPanelDetails.dataSource,
          codingSystemKey
        ),
        summary: columnPanelDetails.calculation,
        time_scope: columnPanelDetails.time_scope,
        element_config: {
          ...getNonEmptyParams('filters', columnPanelDetails.filters),
          ...getNonEmptyParams(
            'calculation_params',
            columnPanelDetails.calculation_params
          ),
        },
      }),
    })
      .done((response) => {
        if (columnPanelDetails.isEditMode) {
          dispatch(
            editComparisonTableColumnSuccess(widgetId, columnPanelDetails)
          );
        } else {
          dispatch(
            addTableColumnSuccess(
              widgetId,
              updateMissingColumnResponse(response, columnPanelDetails)
            )
          );
        }
        dispatch(
          // $FlowFixMe
          fetchWidgetContent(widgetId, 'table')
        );

        dispatch(setColumnCalculatedCachedAtUpdate(widgetId, response?.id));
        if (!addAnother) {
          dispatch(toggleTableColumnPanel());
        }
      })
      .fail(() => {
        dispatch(editTableColumnFailure());
      });
  };

export const clickScorecardTableColumnPanelApply =
  (addAnother: boolean): ThunkAction =>
  (dispatch: (action: Action) => Action, getState: Function) => {
    const columnPanelDetails = getState().tableWidget.columnPanel;
    const tableContainerId = getState().tableWidget.tableContainerId;
    const widgetId = getState().tableWidget.widgetId;

    dispatch(addEditTableColumnLoading());

    $.ajax({
      method: columnPanelDetails.isEditMode ? 'PUT' : 'POST',
      url: columnPanelDetails.isEditMode
        ? `/table_containers/${tableContainerId}/table_columns/${columnPanelDetails.columnId}`
        : `/table_containers/${tableContainerId}/table_columns`,
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
      },
      contentType: 'application/json',
      data: JSON.stringify({
        population: columnPanelDetails.population,
        time_scope: columnPanelDetails.time_scope,
      }),
    })
      .done((response) => {
        if (columnPanelDetails.isEditMode) {
          dispatch(
            editScorecardTableColumnSuccess(widgetId, {
              ...columnPanelDetails,
              column_id: response.column_id,
            })
          );
        } else {
          dispatch(addTableColumnSuccess(widgetId, response));
        }
        dispatch(
          // $FlowFixMe
          fetchWidgetContent(widgetId, 'table')
        );
        if (!addAnother) {
          dispatch(toggleTableColumnPanel());
        }
      })
      .fail(() => {
        dispatch(addTableColumnFailure());
      });
  };

export const clickLongitudinalTableColumnPanelApply =
  (addAnother: boolean): ThunkAction =>
  (dispatch: (action: Action) => Action, getState: Function) => {
    const codingSystemKey = getState().dashboard?.codingSystemKey;
    const columnPanelDetails = getState().tableWidget.columnPanel;
    const tableContainerId = getState().tableWidget.tableContainerId;
    const widgetId = getState().tableWidget.widgetId;

    dispatch(addEditTableColumnLoading());

    $.ajax({
      method: columnPanelDetails.isEditMode ? 'PUT' : 'POST',
      url: columnPanelDetails.isEditMode
        ? `/table_containers/${tableContainerId}/table_columns/${columnPanelDetails.columnId}`
        : `/table_containers/${tableContainerId}/table_columns`,
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
      },
      contentType: 'application/json',
      data: JSON.stringify({
        name: columnPanelDetails.name,
        data_source_type: columnPanelDetails.dataSource.type,
        input_params: getInputParamsFromDataSource(
          columnPanelDetails.dataSource,
          codingSystemKey
        ),
        summary: columnPanelDetails.calculation,
        population: columnPanelDetails.population,
        element_config: {
          ...getNonEmptyParams('filters', columnPanelDetails.filters),
          ...getNonEmptyParams(
            'calculation_params',
            columnPanelDetails.calculation_params
          ),
        },
      }),
    })
      .done((response) => {
        if (columnPanelDetails.isEditMode) {
          dispatch(
            editLongitudinalTableColumnSuccess(widgetId, columnPanelDetails)
          );
        } else {
          dispatch(
            addTableColumnSuccess(
              widgetId,
              updateMissingColumnResponse(response, columnPanelDetails)
            )
          );
        }
        dispatch(
          // $FlowFixMe
          fetchWidgetContent(widgetId, 'table')
        );
        dispatch(setColumnCalculatedCachedAtUpdate(widgetId, response?.id));
        if (!addAnother) {
          dispatch(toggleTableColumnPanel());
        }
      })
      .fail(() => {
        dispatch(editTableColumnFailure());
      });
  };

export const applyComparisonTableColumnFormula =
  (activeFormula: ?FormulaDetails): ThunkAction =>
  async (dispatch: (action: Action) => Action, getState: Function) => {
    dispatch(setFormulaPanelLoading(true));
    const codingSystemKey = getState().dashboard?.codingSystemKey || '';
    const columnPanelDetails = getState().columnFormulaPanel;
    const tableContainerId = columnPanelDetails.tableContainerId;
    const widgetId = columnPanelDetails.widgetId;
    try {
      const columnData = prepareColumnFormulaSubmissionData(
        columnPanelDetails,
        codingSystemKey,
        activeFormula
      );
      if (columnPanelDetails.isEditMode) {
        const columnId = columnPanelDetails.columnId;
        const response = await updateTableFormulaColumn({
          tableContainerId,
          columnId,
          columnData,
        });

        dispatch(editComparisonTableColumnSuccess(widgetId, response));
      } else {
        const response = await addTableFormulaColumn({
          tableContainerId,
          columnData,
        });
        dispatch(addTableColumnSuccess(widgetId, response));
      }
      dispatch(
        // $FlowFixMe
        fetchWidgetContent(widgetId, 'table')
      );
      dispatch(setFormulaPanelLoading(false));
      dispatch(toggleTableColumnFormulaPanel());
      dispatch(resetColumnFormulaPanel());
    } catch {
      dispatch(editTableColumnFailure());
      dispatch(setFormulaPanelLoading(false));
    }
  };

export const setColumnPanelInputParams = (params: InputParams): Action => ({
  type: 'SET_COLUMN_PANEL_INPUT_PARAMS',
  payload: {
    params,
  },
});

export const setRowPanelInputParams = (params: InputParams): Action => ({
  type: 'SET_ROW_PANEL_INPUT_PARAMS',
  payload: {
    params,
  },
});
