/* eslint-disable no-use-before-define */
// @flow
import type {
  Annotation,
  AnnotationAction,
  AnnotationResponse,
} from '@kitman/common/src/types/Annotation';
import type { Squad } from '@kitman/common/src/types/Squad';
import type { Action as AnnotationsAction } from '@kitman/modules/src/Annotations/components/AnnotationModal/types';
import type {
  SquadAthletesSelection,
  ToastAction,
  ToastItem,
} from '@kitman/components/src/types';
import type { SetCoachingPrinciplesEnabled } from '@kitman/common/src/types';
import type { InjuryVariable } from '@kitman/common/src/types/RiskAdvisor';
import type {
  DevelopmentGoals,
  DevelopmentGoal,
} from '@kitman/modules/src/PlanningHub/src/services/getDevelopmentGoals';

import type {
  PrintOrientation,
  PrintPaperSize,
  Dashboard,
  WidgetLayout,
} from '@kitman/modules/src/analysis/shared/types';
import type {
  InputParams,
  TimeScopeConfig,
} from '@kitman/modules/src/analysis/Dashboard/components/types';

import type { Store } from './store';
import type {
  ContainerType,
  WidgetData,
  Actions,
  Annotation as AnnotationDetail,
  ActionsTableColumn,
} from '../../types';

import type {
  TableFormulaColumnResponse,
  TableWidgetType,
  TableWidgetMetric,
  TableWidgetColumn,
  TableWidgetRow,
  TableWidgetRowMetric,
  TableWidgetFormatRule,
  TableWidgetColumnConfig,
  TableWidgetRowConfig,
  TableWidgetSourceSubtypes,
  ColumnWidthType,
  ColumnSortType,
  TableElementFilter,
  TableElementFilterValue,
  TableWidgetDataSource,
  TableWidgetAvailabilityStatus,
  TableWidgetParticipationStatus,
  TableWidgetCalculationParams,
  WidgetType,
} from '../../components/TableWidget/types';

type openGraphLinksModal = {
  type: 'OPEN_GRAPH_LINKS_MODAL',
};
type closeGraphLinksModal = {
  type: 'CLOSE_GRAPH_LINKS_MODAL',
};
type openDuplicateWidgetModal = {
  type: 'OPEN_DUPLICATE_WIDGET_MODAL',
  payload: {
    isNameEditable: boolean,
    widgetId: number,
    widgetName: string,
    widgetType: string,
  },
};
type changeSelectedDashboard = {
  type: 'CHANGE_SELECTED_DASHBOARD',
  payload: {
    selectedDashboard: Dashboard,
  },
};
type changeSelectedSquad = {
  type: 'CHANGE_SELECTED_SQUAD',
  payload: {
    selectedSquad: Squad,
  },
};
type changeDuplicateDashboardSelectedSquad = {
  type: 'CHANGE_DUPLICATE_DASHBOARD_SELECTED_SQUAD',
  payload: {
    selectedSquad: Squad,
  },
};
type changeDuplicateWidgetName = {
  type: 'CHANGE_DUPLICATE_WIDGET_NAME',
  payload: {
    widgetName: string,
  },
};
type closeDuplicateWidgetAppStatus = {
  type: 'CLOSE_DUPLICATE_WIDGET_APP_STATUS',
};
type closeDuplicateWidgetModal = {
  type: 'CLOSE_DUPLICATE_WIDGET_MODAL',
  payload: {
    activeDashboard: Dashboard,
  },
};
type duplicateWidgetLoading = {
  type: 'DUPLICATE_WIDGET_LOADING',
};

type duplicateWidgetSuccess = {
  type: 'DUPLICATE_WIDGET_SUCCESS',
};

type duplicateWidgetFailure = {
  type: 'DUPLICATE_WIDGET_FAILURE',
};
type openDuplicateDashboardModal = {
  type: 'OPEN_DUPLICATE_DASHBOARD_MODAL',
  payload: {
    dashboardName: string,
  },
};
type changeDuplicateDashboardName = {
  type: 'CHANGE_DUPLICATE_DASHBOARD_NAME',
  payload: {
    dashboardName: string,
  },
};
type closeDuplicateDashboardAppStatus = {
  type: 'CLOSE_DUPLICATE_DASHBOARD_APP_STATUS',
};
type closeDuplicateDashboardModal = {
  type: 'CLOSE_DUPLICATE_DASHBOARD_MODAL',
};
type duplicateDashboardLoading = {
  type: 'DUPLICATE_DASHBOARD_LOADING',
};
type duplicateDashboardSuccess = {
  type: 'DUPLICATE_DASHBOARD_SUCCESS',
};
type duplicateDashboardFailure = {
  type: 'DUPLICATE_DASHBOARD_FAILURE',
};
type openProfileWidgetModal = {
  type: 'OPEN_PROFILE_WIDGET_MODAL',
  payload: {
    widgetId: number,
    athleteId: string,
    showAvailabilityIndicator: boolean,
    showSquadNumber: boolean,
    selectedInfoFields: Array<Object>,
    backgroundColour: string,
  },
};
type closeProfileWidgetModal = {
  type: 'CLOSE_PROFILE_WIDGET_MODAL',
};
type openNoteDetailModal = {
  type: 'OPEN_NOTE_DETAIL_MODAL',
};
type closeNoteDetailModal = {
  type: 'CLOSE_NOTE_DETAIL_MODAL',
};
type fetchNoteDetailSuccess = {
  type: 'FETCH_NOTE_DETAIL_SUCCESS',
  payload: {
    annotation: AnnotationDetail,
  },
};
type fetchNoteDetailError = {
  type: 'FETCH_NOTE_DETAIL_ERROR',
};
type openNotesWidgetSettingsModal = {
  type: 'OPEN_NOTES_WIDGET_SETTINGS_MODAL',
  payload: {
    widgetId: number,
    annotationTypes: Array<Object>,
    population: SquadAthletesSelection,
    timeScope: Object,
  },
};
type closeNotesWidgetSettingsModal = {
  type: 'CLOSE_NOTES_WIDGET_SETTINGS_MODAL',
};
type openHeaderWidgetModal = {
  type: 'OPEN_HEADER_WIDGET_MODAL',
  payload: {
    widgetId: number,
    name: string,
    population: SquadAthletesSelection,
    backgroundColor: string,
  },
};
type closeHeaderWidgetModal = {
  type: 'CLOSE_HEADER_WIDGET_MODAL',
};
type addGraphLinkRow = {
  type: 'ADD_GRAPH_LINK_ROW',
};
type removeGraphLinkRow = {
  type: 'REMOVE_GRAPH_LINK_ROW',
};
type resetGraphLinks = {
  type: 'RESET_GRAPH_LINKS',
};

type closeReorderModal = {
  type: 'CLOSE_REORDER_MODAL',
};

type openReorderModal = {
  type: 'OPEN_REORDER_MODAL',
};

type toggleSlidingPanel = {
  type: 'TOGGLE_SLIDING_PANEL',
};

type updateDashboard = {
  type: 'UPDATE_DASHBOARD',
  payload: {
    dashboard: Dashboard,
  },
};

type sortGraphWidgetSuccess = {
  type: 'SORT_GRAPH_WIDGET_SUCCESS',
  payload: {
    widgetId: number,
    sortOptions: Object,
  },
};

type sortGraphWidgetFailure = {
  type: 'SORT_GRAPH_WIDGET_FAILURE',
  payload: {
    widgetId: number,
  },
};

type addDashboardToast = {
  type: 'ADD_DASHBOARD_TOAST',
  payload: {
    item: ToastItem,
  },
};

type updateDashboardToast = {
  type: 'UPDATE_DASHBOARD_TOAST',
  payload: {
    itemId: number,
    item: ToastItem,
  },
};

type getDashboardLayout = {
  type: 'GET_DASHBOARD_LAYOUT',
  payload: {
    widgets: Array<WidgetData>,
  },
};

type saveDashboardSuccess = {
  type: 'SAVE_DASHBOARD_SUCCESS',
  payload: {
    dashboardId: number,
  },
};

type saveDashboardFailure = {
  type: 'SAVE_DASHBOARD_FAILURE',
  payload: {
    dashboardId: number,
  },
};

type saveDashboardLayoutSuccess = {
  type: 'SAVE_DASHBOARD_LAYOUT_SUCCESS',
  payload: {
    containerType: ContainerType,
    containerId: number,
  },
};

type saveDashboardLayoutFailure = {
  type: 'SAVE_DASHBOARD_LAYOUT_FAILURE',
  payload: {
    containerType: ContainerType,
    containerId: number,
  },
};

type updateDashboardLayout = {
  type: 'UPDATE_DASHBOARD_LAYOUT',
  payload: {
    dashboardLayout: Array<WidgetLayout>,
  },
};

type updateDashboardPrintLayout = {
  type: 'UPDATE_DASHBOARD_PRINT_LAYOUT',
  payload: {
    dashboardPrintLayout: Array<WidgetLayout>,
  },
};

type updateAggregationPeriod = {
  type: 'UPDATE_AGGREGATION_PERIOD',
  payload: {
    graphId: string,
    aggregationPeriod: string,
  },
};

type selectGraphLinkTarget = {
  type: 'SELECT_GRAPH_LINK_TARGET',
  payload: {
    dashboardId: string,
    rowIndex: number,
  },
};

type selectGraphLinkOrigin = {
  type: 'SELECT_GRAPH_LINK_ORIGIN',
  payload: {
    metricIndex: string,
    rowIndex: number,
  },
};

type unselectGraphLinkOrigin = {
  type: 'UNSELECT_GRAPH_LINK_ORIGIN',
  payload: {
    metricIndex: string,
    rowIndex: number,
  },
};

type closeGraphLinksAppStatus = {
  type: 'CLOSE_GRAPH_LINKS_APP_STATUS',
};

type createGraphLinksLoading = {
  type: 'CREATE_GRAPH_LINKS_LOADING',
};

type createGraphLinksSuccess = {
  type: 'CREATE_GRAPH_LINKS_SUCCESS',
};

type createGraphLinksFailure = {
  type: 'CREATE_GRAPH_LINKS_FAILURE',
};

type fetchWidgetContentSuccess = {
  type: 'FETCH_WIDGET_CONTENT_SUCCESS',
  payload: {
    widgetId: number,
    widgetContent: Object,
  },
};

type fetchWidgetContentForbidden = {
  type: 'FETCH_WIDGET_CONTENT_FORBIDDEN',
  payload: {
    widgetId: number,
  },
};

type fetchWidgetContentFailure = {
  type: 'FETCH_WIDGET_CONTENT_FAILURE',
  payload: {
    widgetId: number,
  },
};

type fetchWidgetContentLoading = {
  type: 'FETCH_WIDGET_CONTENT_LOADING',
  payload: {
    widgetId: number,
  },
};

type setHeaderWidgetName = {
  type: 'SET_HEADER_WIDGET_NAME',
  payload: {
    name: string,
  },
};

type setHeaderWidgetPopulation = {
  type: 'SET_HEADER_WIDGET_POPULATION',
  payload: {
    population: SquadAthletesSelection,
  },
};

type setHeaderWidgetBackgroundColor = {
  type: 'SET_HEADER_WIDGET_BACKGROUND_COLOR',
  payload: {
    color: string,
  },
};

type setShowOrganisationLogo = {
  type: 'SET_SHOW_ORGANISATION_LOGO',
  payload: {
    showOrganisationLogo: boolean,
  },
};

type setShowOrganisationName = {
  type: 'SET_SHOW_ORGANISATION_NAME',
  payload: {
    showOrganisationName: boolean,
  },
};

type setHideOrganisationDetails = {
  type: 'SET_HIDE_ORGANISATION_DETAILS',
  payload: {
    hideOrganisationDetails: boolean,
  },
};

type selectAthlete = {
  type: 'SELECT_ATHLETE',
  payload: {
    athleteId: string,
  },
};

type selectWidgetInfoItem = {
  type: 'SELECT_WIDGET_INFO_ITEM',
  payload: {
    index: number,
    itemId: string,
  },
};

type setAvatarAvailability = {
  type: 'SET_AVATAR_AVAILABILITY',
  payload: {
    showAvailabilityIndicator: boolean,
  },
};

type setAvatarSquadNumber = {
  type: 'SET_AVATAR_SQUAD_NUMBER',
  payload: {
    showSquadNumber: boolean,
  },
};

type saveHeaderWidgetLoading = {
  type: 'SAVE_HEADER_WIDGET_LOADING',
};

type saveHeaderWidgetSuccess = {
  type: 'SAVE_HEADER_WIDGET_SUCCESS',
};

type saveHeaderWidgetFailure = {
  type: 'SAVE_HEADER_WIDGET_FAILURE',
};

type editHeaderWidgetSuccess = {
  type: 'EDIT_HEADER_WIDGET_SUCCESS',
};

type editHeaderWidgetFailure = {
  type: 'EDIT_HEADER_WIDGET_FAILURE',
};

type saveProfileWidgetLoading = {
  type: 'SAVE_PROFILE_WIDGET_LOADING',
};

type saveProfileWidgetSuccess = {
  type: 'SAVE_PROFILE_WIDGET_SUCCESS',
};

type saveProfileWidgetFailure = {
  type: 'SAVE_PROFILE_WIDGET_FAILURE',
};

type editProfileWidgetSuccess = {
  type: 'EDIT_PROFILE_WIDGET_SUCCESS',
};

type editProfileWidgetFailure = {
  type: 'EDIT_PROFILE_WIDGET_FAILURE',
};

type openTableWidgetModal = {
  type: 'OPEN_TABLE_WIDGET_MODAL',
};
type closeTableWidgetModal = {
  type: 'CLOSE_TABLE_WIDGET_MODAL',
};

type openActionsWidgetModal = {
  type: 'OPEN_ACTIONS_WIDGET_MODAL',
  payload: {
    widgetId: number,
    annotationTypes: Array<Object>,
    population: SquadAthletesSelection,
    hiddenColumns: Array<ActionsTableColumn>,
  },
};

type closeActionsWidgetModal = {
  type: 'CLOSE_ACTIONS_WIDGET_MODAL',
};

type selectActionsWidgetAnnotationType = {
  type: 'SELECT_ACTIONS_WIDGET_ANNOTATION_TYPE',
  payload: {
    annotationTypeId: number,
  },
};

type unselectActionsWidgetAnnotationType = {
  type: 'UNSELECT_ACTIONS_WIDGET_ANNOTATION_TYPE',
  payload: {
    annotationTypeId: number,
  },
};

type setActionsWidgetPopulation = {
  type: 'SET_ACTIONS_WIDGET_POPULATION',
  payload: {
    population: SquadAthletesSelection,
  },
};

type setActionsWidgetHiddenColumns = {
  type: 'SET_ACTIONS_WIDGET_HIDDEN_COLUMNS',
  payload: {
    hiddenColumns: Array<ActionsTableColumn>,
  },
};

type saveActionsWidgetLoading = {
  type: 'SAVE_ACTIONS_WIDGET_LOADING',
};

type saveActionsWidgetSuccess = {
  type: 'SAVE_ACTIONS_WIDGET_SUCCESS',
};

type saveActionsWidgetFailure = {
  type: 'SAVE_ACTIONS_WIDGET_FAILURE',
};

type closeActionsWidgetAppStatus = {
  type: 'CLOSE_ACTIONS_WIDGET_APP_STATUS',
};

type updateActions = {
  type: 'UPDATE_ACTIONS',
  payload: {
    widgetId: number,
    actions: Array<Actions>,
    nextId: ?number,
  },
};

type resetActionList = {
  type: 'RESET_ACTION_LIST',
  payload: {
    widgetId: number,
  },
};

type fetchActionsLoading = {
  type: 'FETCH_ACTIONS_LOADING',
  payload: {
    widgetId: number,
  },
};

type openTableColumnFormattingPanel = {
  type: 'OPEN_TABLE_COLUMN_FORMATTING_PANEL',
  payload: {
    existingTableColumns: Array<TableWidgetColumn>,
    tableType: TableWidgetType,
    tableContainerId: number,
    widgetId: number,
    columnId: number,
    columnName: string,
    columnUnit: string,
    appliedFormat: Array<TableWidgetFormatRule>,
  },
};

type openScorecardTableFormattingPanel = {
  type: 'OPEN_SCORECARD_TABLE_FORMATTING_PANEL',
  payload: {
    existingTableMetrics: Array<TableWidgetRowMetric>,
    tableContainerId: number,
    widgetId: number,
    rowMetricId: number,
    metricName: string,
    metricUnit: string,
    appliedFormat: Array<TableWidgetFormatRule>,
  },
};

type openTableColumnPanel = {
  type: 'OPEN_TABLE_COLUMN_PANEL',
  payload: {
    source: TableWidgetDataSource,
    widgetId: number,
    existingTableColumns: Array<TableWidgetColumn>,
    existingTableRows: Array<TableWidgetRow>,
    tableName: string,
    tableType: WidgetType,
    showSummary: boolean,
  },
};

type openTableColumnFormulaPanel = {
  type: 'OPEN_TABLE_COLUMN_FORMULA_PANEL',
};

type editComparisonTableColumn = {
  type: 'EDIT_COMPARISON_TABLE_COLUMN',
  payload: {
    widgetId: number,
    existingTableColumns: Array<TableWidgetColumn>,
    tableContainerId: number,
    columnDetails: Object,
    tableType: TableWidgetType,
  },
};

type editScorecardTableColumn = {
  type: 'EDIT_SCORECARD_TABLE_COLUMN',
  payload: {
    widgetId: number,
    existingTableColumns: Array<TableWidgetColumn>,
    tableContainerId: number,
    columnDetails: Object,
    tableType: TableWidgetType,
  },
};

type editLongitudinalTableColumn = {
  type: 'EDIT_LONGITUDINAL_TABLE_COLUMN',
  payload: {
    widgetId: number,
    existingTableColumns: Array<TableWidgetColumn>,
    tableContainerId: number,
    columnDetails: Object,
    tableType: TableWidgetType,
  },
};

type openTableRowPanel = {
  type: 'OPEN_TABLE_ROW_PANEL',
  payload: {
    source: TableWidgetDataSource,
    widgetId: number,
    existingTableColumns: Array<TableWidgetColumn>,
    existingTableRows: Array<TableWidgetRow>,
    tableName: string,
    tableType: TableWidgetType,
    showSummary: boolean,
  },
};

type toggleTableFormattingPanel = {
  type: 'TOGGLE_TABLE_FORMATTING_PANEL',
};

type toggleTableColumnPanel = {
  type: 'TOGGLE_TABLE_COLUMN_PANEL',
};

type toggleTableColumnFormulaPanel = {
  type: 'TOGGLE_TABLE_COLUMN_FORMULA_PANEL',
};

type toggleTableRowPanel = {
  type: 'TOGGLE_TABLE_ROW_PANEL',
};

type addTableWidgetLoading = {
  type: 'ADD_TABLE_WIDGET_LOADING',
};

type addTableWidgetSuccess = {
  type: 'ADD_TABLE_WIDGET_SUCCESS',
};

type addTableWidgetFailure = {
  type: 'ADD_TABLE_WIDGET_FAILURE',
};

type updateSummaryVisibilityLoading = {
  type: 'UPDATE_TABLE_SUMMARY_VISIBILITY_LOADING',
};

type updateSummaryVisibilitySuccess = {
  type: 'UPDATE_TABLE_SUMMARY_VISIBILITY_SUCCESS',
  payload: {
    updatedWidget: WidgetData,
  },
};

type updateSummaryVisibilityFailure = {
  type: 'UPDATE_TABLE_SUMMARY_VISIBILITY_FAILURE',
};

type addEditTableRowLoading = {
  type: 'ADD_EDIT_TABLE_ROW_LOADING',
};

type addTableRowSuccess = {
  type: 'ADD_TABLE_ROW_SUCCESS',
  payload: {
    widgetId: number,
    newRow: TableWidgetRow,
  },
};

type addMultipleTableRowSuccess = {
  type: 'ADD_MULTIPLE_TABLE_ROW_SUCCESS',
  payload: {
    widgetId: number,
    newRows: Array<TableWidgetRow>,
  },
};

type addTableRowFailure = {
  type: 'ADD_TABLE_ROW_FAILURE',
};

type addEditTableColumnLoading = {
  type: 'ADD_EDIT_TABLE_COLUMN_LOADING',
};

type addTableColumnSuccess = {
  type: 'ADD_TABLE_COLUMN_SUCCESS',
  payload: {
    widgetId: number,
    newColumn: TableWidgetColumn | TableFormulaColumnResponse,
  },
};

type addTableColumnFailure = {
  type: 'ADD_TABLE_COLUMN_FAILURE',
};

type editComparisonTableColumnSuccess = {
  type: 'EDIT_COMPARISON_TABLE_COLUMN_SUCCESS',
  payload: {
    widgetId: number,
    columnPanelDetails: Object,
  },
};

type editScorecardTableColumnSuccess = {
  type: 'EDIT_SCORECARD_TABLE_COLUMN_SUCCESS',
  payload: {
    widgetId: number,
    columnPanelDetails: Object,
  },
};

type editLongitudinalTableColumnSuccess = {
  type: 'EDIT_LONGITUDINAL_TABLE_COLUMN_SUCCESS',
  payload: {
    widgetId: number,
    columnPanelDetails: Object,
  },
};

type editTableColumnFailure = {
  type: 'EDIT_TABLE_COLUMN_FAILURE',
};

type editTableRow = {
  type: 'EDIT_TABLE_ROW',
  payload: {
    row: TableWidgetRow,
    tableContainerId: number,
    tableType: TableWidgetType,
    widgetId: number,
  },
};

type editComparisonTableRow = {
  type: 'EDIT_COMPARISON_TABLE_ROW',
  payload: {
    row: TableWidgetRow,
    tableContainerId: number,
    widgetId: number,
  },
};

type editComparisonTableRowSuccess = {
  type: 'EDIT_COMPARISON_TABLE_ROW_SUCCESS',
  payload: {
    rowPanelDetails: Object,
    widgetId: number,
    newRow: Object,
  },
};

type editScorecardTableRow = {
  type: 'EDIT_SCORECARD_TABLE_ROW',
  payload: {
    row: TableWidgetRow,
    tableContainerId: number,
    widgetId: number,
  },
};

type editScorecardTableRowSuccess = {
  type: 'EDIT_SCORECARD_TABLE_ROW_SUCCESS',
  payload: {
    rowPanelDetails: Object,
    widgetId: number,
  },
};

type editLongitudinalTableRow = {
  type: 'EDIT_LONGITUDINAL_TABLE_ROW',
  payload: {
    row: TableWidgetRow,
    tableContainerId: number,
    widgetId: number,
  },
};

type editLongitudinalTableRowSuccess = {
  type: 'EDIT_LONGITUDINAL_TABLE_ROW_SUCCESS',
  payload: {
    rowPanelDetails: Object,
    widgetId: number,
  },
};

type editTableRowLoading = {
  type: 'EDIT_TABLE_ROW_LOADING',
};

type editTableRowFailure = {
  type: 'EDIT_TABLE_ROW_FAILURE',
};

type setTableColumnCalculation = {
  type: 'SET_TABLE_COLUMN_CALCULATION',
  payload: {
    calculation: string,
  },
};

type setTableColumnCalculationParam = {
  type: 'SET_TABLE_COLUMN_CALCULATION_PARAM',
  payload: {
    calculationParam: $Keys<TableWidgetCalculationParams>,
    value: $Values<TableWidgetCalculationParams>,
  },
};

type setTableColumnActivity = {
  type: 'SET_TABLE_COLUMN_ACTIVITY',
  payload: {
    ids: number[] | number,
    type: TableWidgetDataSource,
  },
};

type setTableColumnStatus = {
  type: 'SET_TABLE_COLUMN_STATUS',
  payload: {
    status: TableWidgetAvailabilityStatus | TableWidgetParticipationStatus,
    type: TableWidgetDataSource,
  },
};

type setTableColumnDateRange = {
  type: 'SET_TABLE_COLUMN_DATE_RANGE',
  payload: {
    range: Object,
  },
};

type setTableColumnMetrics = {
  type: 'SET_TABLE_COLUMN_METRICS',
  payload: {
    metric: Array<TableWidgetMetric>,
  },
};

type setTableColumnDataSourceType = {
  type: 'SET_TABLE_COLUMN_DATASOURCE_TYPE',
  payload: {
    type: TableWidgetDataSource,
  },
};

type setTableColumnDataSourceIds = {
  type: 'SET_TABLE_COLUMN_DATASOURCE_IDS',
  payload: {
    ids: Array<number>,
    type: TableWidgetDataSource,
  },
};

type setTableColumnPopulation = {
  type: 'SET_TABLE_COLUMN_POPULATION',
  payload: {
    population: SquadAthletesSelection,
  },
};

type setTableColumnTitle = {
  type: 'SET_TABLE_COLUMN_TITLE',
  payload: {
    title: string,
  },
};

type setTableColumnTimePeriod = {
  type: 'SET_TABLE_COLUMN_TIME_PERIOD',
  payload: {
    timePeriod: string,
  },
};

type setTableColumnTimePeriodConfig = {
  type: 'SET_TABLE_COLUMN_TIME_PERIOD_CONFIG',
  payload: {
    config: TimeScopeConfig,
  },
};

type setTableColumnSubType = {
  type: 'SET_TABLE_COLUMN_SUBTYPE',
  payload: {
    subtype: $Keys<TableWidgetSourceSubtypes>,
    value: $Values<TableWidgetSourceSubtypes>,
  },
};

type setTableColumnTimePeriodLength = {
  type: 'SET_TABLE_COLUMN_TIME_PERIOD_LENGTH',
  payload: {
    timePeriodLength: number,
  },
};

type setTableColumnTimePeriodLengthOffset = {
  type: 'SET_TABLE_COLUMN_TIME_PERIOD_LENGTH_OFFSET',
  payload: {
    timePeriodLengthOffset: number,
  },
};

type setTableElementFilter = {
  type: 'SET_TABLE_ELEMENT_FILTER',
  payload: {
    panel: 'column' | 'row',
    filter: TableElementFilter,
    value: TableElementFilterValue,
  },
};

type deleteTableColumnLoading = {
  type: 'DELETE_TABLE_COLUMN_LOADING',
};

type deleteTableColumnSuccess = {
  type: 'DELETE_TABLE_COLUMN_SUCCESS',
  payload: {
    widgetId: number,
    columnId: number,
  },
};

type deleteTableColumnFailure = {
  type: 'DELETE_TABLE_COLUMN_FAILURE',
};

type deleteTableRowLoading = {
  type: 'DELETE_TABLE_ROW_LOADING',
};

type deleteTableRowSuccess = {
  type: 'DELETE_TABLE_ROW_SUCCESS',
  payload: {
    widgetId: number,
    rowId: number,
  },
};

type deleteTableRowFailure = {
  type: 'DELETE_TABLE_ROW_FAILURE',
};

type setTableRowTitle = {
  type: 'SET_TABLE_ROW_TITLE',
  payload: {
    title: string,
  },
};

type setTableRowCalculation = {
  type: 'SET_TABLE_ROW_CALCULATION',
  payload: {
    calculation: string,
  },
};

type setTableRowCalculationParam = {
  type: 'SET_TABLE_ROW_CALCULATION_PARAM',
  payload: {
    calculationParam: $Keys<TableWidgetCalculationParams>,
    value: $Values<TableWidgetCalculationParams>,
  },
};

type setTableRowDateRange = {
  type: 'SET_TABLE_ROW_DATE_RANGE',
  payload: {
    range: Object,
  },
};

type setTableRowMetrics = {
  type: 'SET_TABLE_ROW_METRICS',
  payload: {
    metric: Array<TableWidgetMetric>,
  },
};
type setTableRowDatasourceType = {
  type: 'SET_TABLE_ROW_DATASOURCE_TYPE',
  payload: {
    type: TableWidgetDataSource,
  },
};

type setTableRowDatasourceIds = {
  type: 'SET_TABLE_ROW_DATASOURCE_IDS',
  payload: {
    ids: Array<number>,
    type: TableWidgetDataSource,
    name: string,
  },
};

type setTableRowPopulation = {
  type: 'SET_TABLE_ROW_POPULATION',
  payload: {
    population: SquadAthletesSelection | SquadAthletesSelection[],
  },
};
type setTableRowGroupings = {
  type: 'SET_TABLE_ROW_GROUPING',
  payload: {
    groupings: { [string]: string },
  },
};

type setTableRowTimePeriod = {
  type: 'SET_TABLE_ROW_TIME_PERIOD',
  payload: {
    timePeriod: string,
  },
};

type setTableRowTimePeriodLength = {
  type: 'SET_TABLE_ROW_TIME_PERIOD_LENGTH',
  payload: {
    timePeriodLength: number,
  },
};

type setTableRowTimePeriodLengthOffset = {
  type: 'SET_TABLE_ROW_TIME_PERIOD_LENGTH_OFFSET',
  payload: {
    timePeriodLengthOffset: number,
  },
};

type setTableRowStatus = {
  type: 'SET_TABLE_ROW_STATUS',
  payload: {
    status: TableWidgetAvailabilityStatus,
    name: string,
    type: TableWidgetDataSource,
  },
};

type setTableRowSubType = {
  type: 'SET_TABLE_ROW_SUBTYPE',
  payload: {
    subtype: $Keys<TableWidgetSourceSubtypes>,
    value: $Values<TableWidgetSourceSubtypes>,
  },
};

type addFormattingRule = {
  type: 'ADD_FORMATTING_RULE',
};

type removeFormattingRule = {
  type: 'REMOVE_FORMATTING_RULE',
  payload: {
    index: number,
  },
};

type updateFormattingRuleType = {
  type: 'UPDATE_FORMATTING_RULE_TYPE',
  payload: {
    type: string,
    index: number,
  },
};

type updateFormattingRuleCondition = {
  type: 'UPDATE_FORMATTING_RULE_CONDITION',
  payload: {
    condition: string,
    index: number,
  },
};

type updateFormattingRuleValue = {
  type: 'UPDATE_FORMATTING_RULE_VALUE',
  payload: {
    value: number,
    index: number,
  },
};

type updateFormattingRuleColor = {
  type: 'UPDATE_FORMATTING_RULE_COLOR',
  payload: {
    color: string,
    index: number,
  },
};

type saveTableFormattingLoading = {
  type: 'SAVE_TABLE_FORMATTING_LOADING',
};

type saveScorecardTableFormattingSuccess = {
  type: 'SAVE_SCORECARD_TABLE_FORMATTING_SUCCESS',
  payload: {
    appliedRules: Array<TableWidgetFormatRule>,
  },
};

type saveTableFormattingFailure = {
  type: 'SAVE_TABLE_FORMATTING_FAILURE',
};

type changeColumnSummaryLoading = {
  type: 'CHANGE_COLUMN_SUMMARY_LOADING',
};

type changeColumnSummarySuccess = {
  type: 'CHANGE_COLUMN_SUMMARY_SUCCESS',
  payload: {
    existingTableColumns: Array<TableWidgetColumn>,
    columnId: number,
    summaryCalc: string,
  },
};

type changeColumnSummaryFailure = {
  type: 'CHANGE_COLUMN_SUMMARY_FAILURE',
};

type lockColumnPivotLoading = {
  type: 'LOCK_COLUMN_PIVOT_LOADING',
};

type lockColumnPivotSuccess = {
  type: 'LOCK_COLUMN_PIVOT_SUCCESS',
  payload: {
    existingTableColumns: Array<TableWidgetColumn>,
    columnId: number,
    pivotLocked: boolean,
  },
};

type lockColumnPivotFailure = {
  type: 'LOCK_COLUMN_PIVOT_FAILURE',
};

type updateTableNameSuccess = {
  type: 'UPDATE_TABLE_NAME_SUCCESS',
};

type updateTableNameFailure = {
  type: 'UPDATE_TABLE_NAME_FAILURE',
};

type updatePreviewSuccess = {
  type: 'UPDATE_PREVIEW_SUCCESS',
  payload: {
    widget: WidgetData,
  },
};

type setProfileBackgroundColour = {
  type: 'SET_PROFILE_BACKGROUND_COLOUR',
  payload: {
    backgroundColour: string,
  },
};

type fetchWidgetsSuccess = {
  type: 'FETCH_WIDGETS_SUCCESS',
  payload: {
    widgets: Array<WidgetData>,
  },
};

type fetchWidgetsFailure = {
  type: 'FETCH_WIDGETS_FAILURE',
};

type fetchWidgetsLoading = {
  type: 'FETCH_WIDGETS_LOADING',
};

type saveWidgetSuccess = {
  type: 'SAVE_WIDGET_SUCCESS',
  payload: {
    widget: WidgetData,
  },
};

type editWidgetSuccess = {
  type: 'EDIT_WIDGET_SUCCESS',
  payload: {
    widget: WidgetData,
  },
};

type deleteWidgetSuccess = {
  type: 'DELETE_WIDGET_SUCCESS',
};

type updateExistingWidgetYPosition = {
  type: 'UPDATE_EXISTING_WIDGET_Y_POSITION',
  payload: {
    widget: WidgetData,
  },
};

type deleteWidgetFailure = {
  type: 'DELETE_WIDGET_FAILURE',
};

type setNotesWidgetSettingsPopulation = {
  type: 'SET_NOTES_WIDGET_SETTINGS_POPULATION',
  payload: {
    population: SquadAthletesSelection,
  },
};

type setNotesWidgetSettingsTimePeriod = {
  type: 'SET_NOTES_WIDGET_SETTINGS_TIME_PERIOD',
  payload: {
    timePeriod: string,
  },
};

type selectAnnotationType = {
  type: 'SELECT_ANNOTATION_TYPE',
  payload: {
    annotationTypeId: number,
  },
};

type unselectAnnotationType = {
  type: 'UNSELECT_ANNOTATION_TYPE',
  payload: {
    annotationTypeId: number,
  },
};

type updateNotesWidgetSettingsDateRange = {
  type: 'UPDATE_NOTES_WIDGET_SETTINGS_DATE_RANGE',
  payload: {
    dateRange: {
      start_date: string,
      end_date: string,
    },
  },
};

type updateNotesWidgetSettingsTimePeriodLength = {
  type: 'UPDATE_NOTES_WIDGET_SETTINGS_TIME_PERIOD_LENGTH',
  payload: {
    timePeriodLength: number,
  },
};

type saveNotesWidgetSettingsLoading = {
  type: 'SAVE_NOTES_WIDGET_SETTINGS_LOADING',
};

type saveNotesWidgetSettingsSuccess = {
  type: 'SAVE_NOTES_WIDGET_SETTINGS_SUCCESS',
};

type saveNotesWidgetSettingsFailure = {
  type: 'SAVE_NOTES_WIDGET_SETTINGS_FAILURE',
};

type editNotesWidgetSettingsSuccess = {
  type: 'EDIT_NOTES_WIDGET_SETTINGS_SUCCESS',
};

type editNotesWidgetSettingsFailure = {
  type: 'EDIT_NOTES_WIDGET_SETTINGS_FAILURE',
};

type addNotesWidgetLoading = {
  type: 'ADD_NOTES_WIDGET_LOADING',
};

type addNotesWidgetSuccess = {
  type: 'ADD_NOTES_WIDGET_SUCCESS',
};

type addNotesWidgetFailure = {
  type: 'ADD_NOTES_WIDGET_FAILURE',
};

type openNoteModal = {
  type: 'OPEN_NOTE_MODAL',
  payload: {
    widgetId: number,
    annotationTypes: Array<Object>,
    population: SquadAthletesSelection,
    timeScope: Object,
  },
};

type populateAthleteDropdownLoading = {
  type: 'POPULATE_ATHLETE_DROPDOWN_LOADING',
};

type populateAthleteDropdownFailure = {
  type: 'POPULATE_ATHLETE_DROPDOWN_FAILURE',
};

type updateAthleteOptions = {
  type: 'UPDATE_ATHLETE_OPTIONS',
  payload: {
    athletes: Array<{ id: number, title: string }>,
  },
};

type updateAction = {
  type: 'UPDATE_ACTION',
  payload: {
    action: AnnotationAction,
  },
};

type updateActionSuccess = {
  type: 'UPDATE_ACTION_SUCCESS',
};

type updateActionFailure = {
  type: 'UPDATE_ACTION_FAILURE',
};

type updateNotes = {
  type: 'UPDATE_NOTES',
  payload: {
    widgetId: number,
    nextNotes: Array<Annotation>,
    nextPage: number,
  },
};

type archiveNoteSuccess = {
  type: 'ARCHIVE_NOTE_SUCCESS',
  payload: {
    noteId: number,
  },
};

type restoreNoteSuccess = {
  type: 'RESTORE_NOTE_SUCCESS',
  payload: {
    noteId: number,
  },
};

type hideAppStatus = {
  type: 'HIDE_APP_STATUS',
};

type confirmFileUploadFailure = {
  type: 'CONFIRM_FILE_UPLOAD_FAILURE',
  payload: {
    fileId: number,
  },
};

type finishFileUpload = {
  type: 'FINISH_FILE_UPLOAD',
  payload: {
    fileId: number,
  },
};

type triggerFileUploadFailure = {
  type: 'TRIGGER_FILE_UPLOAD_FAILURE',
  payload: {
    fileId: number,
  },
};

type triggerToastDisplayProgress = {
  type: 'TRIGGER_TOAST_DISPLAY_PROGRESS',
  payload: {
    fileName: string,
    fileSize: number,
    fileId: number,
  },
};

type confirmDeleteAttachment = {
  type: 'CONFIRM_DELETE_ATTACHMENT',
  payload: {
    annotation: AnnotationResponse,
    fileId: number,
  },
};

type hideNotesWidgetStatus = {
  type: 'HIDE_NOTES_WIDGET_STATUS',
};

type deleteAttachmentLoading = {
  type: 'DELETE_ATTACHMENT_LOADING',
};

type deleteAttachmentFailure = {
  type: 'DELETE_ATTACHMENT_FAILURE',
};

type openPrintBuilder = {
  type: 'OPEN_PRINT_BUILDER',
};

type closePrintBuilder = {
  type: 'CLOSE_PRINT_BUILDER',
};

type updatePrintOrientation = {
  type: 'UPDATE_PRINT_ORIENTATION',
  payload: {
    printOrientation: PrintOrientation,
  },
};

type updatePrintPaperSize = {
  type: 'UPDATE_PRINT_PAPER_SIZE',
  payload: {
    printPaperSize: PrintPaperSize,
  },
};

type updateNotesNameSuccess = {
  type: 'UPDATE_NOTES_NAME_SUCCESS',
  payload: {
    widgetId: number,
    widgetName: string,
  },
};

type updateNotesNameFailure = {
  type: 'UPDATE_NOTES_NAME_FAILURE',
};

type updateTableColumnOrder = {
  type: 'UPDATE_COLUMN_ORDER',
  payload: {
    columnId: number,
    widgetId: number,
    newOrder: number,
  },
};

type updateTableColumnOrderFailure = {
  type: 'UPDATE_COLUMN_ORDER_FAILURE',
};

type duplicateColumnIsLoading = {
  type: 'DUPLICATE_COLUMN_IS_LOADING',
  payload: {
    columnId: number,
  },
};

type duplicateColumnError = {
  type: 'DUPLICATE_COLUMN_ERROR',
  payload: {
    columnId: number,
  },
};

type duplicateColumnSuccess = {
  type: 'DUPLICATE_COLUMN_SUCCESS',
  payload: {
    columnId: number,
  },
};

type clearDuplicateColumnError = {
  type: 'CLEAR_DUPLICATE_COLUMN_ERROR',
  payload: {
    columnId: number,
  },
};

type injuryRiskMetricsIsLoading = {
  type: 'INJURY_METRICS_IS_LOADING',
};

type injuryRiskMetricsHasLoaded = {
  type: 'INJURY_METRICS_HAS_LOADED',
};

type injuryRiskMetricsHasErrored = {
  type: 'INJURY_METRICS_HAS_ERRORED',
};

type setInjuryRiskMetrics = {
  type: 'SET_INJURY_RISK_METRICS',
  payload: Array<InjuryVariable>,
};

type setColumnWidthType = {
  type: 'SET_COLUMN_WIDTH_TYPE',
  payload: {
    widgetId: number,
    columnWidthType: ColumnWidthType,
  },
};

type setTableSortOrder = {
  type: 'SET_TABLE_SORT_ORDER',
  payload: {
    widgetId: number,
    columnId: number,
    order: ColumnSortType,
  },
};

type setTableRowActivity = {
  type: 'SET_TABLE_ROW_ACTIVITY',
  payload: {
    ids: number[] | number,
    type: TableWidgetDataSource,
    name: string,
  },
};

type updateColumnConfig = {
  type: 'UPDATE_COLUMN_CONFIG',
  payload: {
    widgetId: number,
    columnId: number,
    newConfig: TableWidgetColumnConfig,
  },
};

type updateRowConfig = {
  type: 'UPDATE_ROW_CONFIG',
  payload: {
    widgetId: number,
    rowId: number,
    newConfig: TableWidgetRowConfig,
  },
};

type openDevelopmentGoalForm = {
  type: 'OPEN_DEVELOPMENT_GOAL_FORM',
  payload: {
    developmentGoal: ?DevelopmentGoal,
    pivotedAthletes: Array<number>,
  },
};

type closeDevelopmentGoalForm = {
  type: 'CLOSE_DEVELOPMENT_GOAL_FORM',
};

type saveDevelopmentGoalWidgetFailure = {
  type: 'SAVE_DEVELOPMENT_GOAL_WIDGET_FAILURE',
};

type saveDevelopmentGoalLoading = {
  type: 'SAVE_DEVELOPMENT_GOAL_LOADING',
};

type saveDevelopmentGoalFailure = {
  type: 'SAVE_DEVELOPMENT_GOAL_FAILURE',
};

type saveDevelopmentGoalSuccess = {
  type: 'SAVE_DEVELOPMENT_GOAL_SUCCESS',
};

type editDevelopmentGoalSuccess = {
  type: 'EDIT_DEVELOPMENT_GOAL_SUCCESS',
  payload: {
    developmentGoal: DevelopmentGoal,
  },
};

type updateDevelopmentGoals = {
  type: 'UPDATE_DEVELOPMENT_GOALS',
  payload: {
    widgetId: number,
    nextDevelopmentGoals: DevelopmentGoals,
    nextId: ?number,
  },
};

type onDeleteDevelopmentGoalSuccess = {
  type: 'ON_DELETE_DEVELOPMENT_GOAL_SUCCESS',
  payload: {
    developmentGoalId: number,
  },
};

type setCodingSystemKey = {
  type: 'SET_CODING_SYSTEM_KEY',
  payload: {
    codingSystemKey: string,
  },
};

type setTableColumnGameKinds = {
  type: 'SET_TABLE_COLUMN_GAME_KINDS',
  payload: {
    kinds: string | Array<string>,
    type: TableWidgetDataSource,
  },
};

type setTableColumnTimeInPositions = {
  type: 'SET_TABLE_COLUMN_TIME_IN_POSITIONS',
  payload: {
    positions: Array<number | string>,
  },
};

type setTableColumnTimeInFormation = {
  type: 'SET_TABLE_COLUMN_TIME_IN_FORMATION',
  payload: {
    formations: Array<number | string>,
  },
};

type setTableRowTimeInFormation = {
  type: 'SET_TABLE_ROW_TIME_IN_FORMATION',
  payload: {
    formations: Array<number | string>,
  },
};
type setTableRowTimeInPositions = {
  type: 'SET_TABLE_ROW_TIME_IN_POSITIONS',
  payload: {
    positions: Array<number | string>,
  },
};

type setTableRowGameKinds = {
  type: 'SET_TABLE_ROW_GAME_KINDS',
  payload: {
    kinds: string | Array<string>,
    type: TableWidgetDataSource,
  },
};

type setTableColumnGameResults = {
  type: 'SET_TABLE_COLUMN_GAME_RESULT',
  payload: {
    result: string,
    type: TableWidgetDataSource,
  },
};

type setTableRowGameResults = {
  type: 'SET_TABLE_ROW_GAME_RESULT',
  payload: {
    result: string,
    type: TableWidgetDataSource,
  },
};

type setTableColumnEventType = {
  type: 'SET_TABLE_COLUMN_EVENT_TYPE',
  payload: {
    event: string,
    type: TableWidgetDataSource,
  },
};

type setTableRowEventType = {
  type: 'SET_TABLE_ROW_EVENT_TYPE',
  payload: {
    event: string,
    type: TableWidgetDataSource,
  },
};

type setColumnPanelInputParams = {
  type: 'SET_COLUMN_PANEL_INPUT_PARAMS',
  payload: {
    params: InputParams,
  },
};
type setRowPanelInputParams = {
  type: 'SET_ROW_PANEL_INPUT_PARAMS',
  payload: {
    params: InputParams,
  },
};

type setColumnLoadingStatus = {
  type: 'SET_COLUMN_LOADING_STATUS',
  payload: {
    tableContainerId: number,
    columnId: number,
    loadingStatus: string,
  },
};

type setRowLoadingStatus = {
  type: 'SET_ROW_LOADING_STATUS',
  payload: {
    tableContainerId: number,
    rowId: number,
    loadingStatus: string,
  },
};

type setColumnCalculatedCachedAtUpdate = {
  type: 'SET_COLUMN_CALCULATED_CACHED_AT_UPDATE',
  payload: {
    widgetId: number,
    columnId: number,
  },
};

type setColumnCalculatedCachedAtRefreshCache = {
  type: 'SET_COLUMN_CALCULATED_CACHED_AT_REFRESH_CACHE',
  payload: {
    widgetId: number,
  },
};
type setRowCalculatedCachedAtRefreshCache = {
  type: 'SET_ROW_CALCULATED_CACHED_AT_REFRESH_CACHE',
  payload: {
    widgetId: number,
  },
};
type setRowCalculatedCachedAtUpdate = {
  type: 'SET_ROW_CALCULATED_CACHED_AT_UPDATE',
  payload: {
    widgetId: number,
    rowId: number,
  },
};

type setRefreshWidgetCacheStatus = {
  type: 'SET_REFRESH_WIDGET_CACHE_STATUS',
  payload: {
    widgetId: number,
    status: boolean,
  },
};

type refreshDashboard = {
  type: 'REFRESH_DASHBOARD',
  payload: {
    dashboardId: number,
    dashboardCacheRefreshKey: string,
  },
};

export type Action =
  | openPrintBuilder
  | closePrintBuilder
  | updatePrintOrientation
  | updatePrintPaperSize
  | openGraphLinksModal
  | closeGraphLinksModal
  | openDuplicateWidgetModal
  | changeSelectedDashboard
  | changeSelectedSquad
  | changeDuplicateDashboardSelectedSquad
  | changeDuplicateWidgetName
  | closeDuplicateWidgetAppStatus
  | closeDuplicateWidgetModal
  | duplicateWidgetLoading
  | duplicateWidgetSuccess
  | duplicateWidgetFailure
  | openDuplicateDashboardModal
  | changeDuplicateDashboardName
  | closeDuplicateDashboardAppStatus
  | closeDuplicateDashboardModal
  | confirmDeleteAttachment
  | hideNotesWidgetStatus
  | deleteAttachmentLoading
  | deleteAttachmentFailure
  | duplicateDashboardLoading
  | duplicateDashboardSuccess
  | duplicateDashboardFailure
  | openProfileWidgetModal
  | closeProfileWidgetModal
  | openNotesWidgetSettingsModal
  | closeNotesWidgetSettingsModal
  | openHeaderWidgetModal
  | closeHeaderWidgetModal
  | addGraphLinkRow
  | removeGraphLinkRow
  | resetGraphLinks
  | confirmFileUploadFailure
  | finishFileUpload
  | triggerFileUploadFailure
  | triggerToastDisplayProgress
  | fetchWidgetContentSuccess
  | fetchWidgetContentForbidden
  | fetchWidgetContentFailure
  | fetchWidgetContentLoading
  | fetchWidgetsSuccess
  | fetchWidgetsFailure
  | fetchWidgetsLoading
  | saveWidgetSuccess
  | editWidgetSuccess
  | deleteWidgetSuccess
  | updateExistingWidgetYPosition
  | deleteWidgetFailure
  | updateDashboard
  | sortGraphWidgetSuccess
  | sortGraphWidgetFailure
  | addDashboardToast
  | updateDashboardToast
  | getDashboardLayout
  | saveDashboardSuccess
  | saveDashboardFailure
  | saveDashboardLayoutSuccess
  | saveDashboardLayoutFailure
  | updateDashboardLayout
  | updateDashboardPrintLayout
  | closeReorderModal
  | openReorderModal
  | toggleSlidingPanel
  | selectGraphLinkOrigin
  | unselectGraphLinkOrigin
  | updateAggregationPeriod
  | selectGraphLinkTarget
  | closeGraphLinksAppStatus
  | createGraphLinksLoading
  | createGraphLinksSuccess
  | createGraphLinksFailure
  | setHeaderWidgetName
  | setHeaderWidgetPopulation
  | setHeaderWidgetBackgroundColor
  | setShowOrganisationLogo
  | setShowOrganisationName
  | setHideOrganisationDetails
  | selectAthlete
  | selectWidgetInfoItem
  | setAvatarAvailability
  | setAvatarSquadNumber
  | saveHeaderWidgetLoading
  | saveHeaderWidgetSuccess
  | editHeaderWidgetSuccess
  | editHeaderWidgetFailure
  | saveProfileWidgetLoading
  | saveProfileWidgetSuccess
  | saveProfileWidgetFailure
  | editProfileWidgetSuccess
  | editProfileWidgetFailure
  | updatePreviewSuccess
  | addTableWidgetLoading
  | addTableWidgetSuccess
  | addTableWidgetFailure
  | addEditTableRowLoading
  | addTableRowSuccess
  | addMultipleTableRowSuccess
  | addTableRowFailure
  | updateSummaryVisibilityLoading
  | updateSummaryVisibilitySuccess
  | updateSummaryVisibilityFailure
  | addEditTableColumnLoading
  | addTableColumnSuccess
  | addTableColumnFailure
  | editComparisonTableColumn
  | editScorecardTableColumn
  | editLongitudinalTableColumn
  | editTableColumnFailure
  | editComparisonTableColumnSuccess
  | editScorecardTableColumnSuccess
  | editLongitudinalTableColumnSuccess
  | editTableRow
  | editComparisonTableRow
  | editComparisonTableRowSuccess
  | editScorecardTableRow
  | editScorecardTableRowSuccess
  | editLongitudinalTableRow
  | editLongitudinalTableRowSuccess
  | editTableRowLoading
  | editTableRowFailure
  | setTableColumnCalculation
  | setTableColumnCalculationParam
  | setTableColumnDateRange
  | setTableColumnMetrics
  | setTableColumnDataSourceType
  | setTableColumnDataSourceIds
  | setTableColumnPopulation
  | setTableColumnTitle
  | setTableColumnTimePeriod
  | setTableColumnTimePeriodLength
  | setTableColumnTimePeriodLengthOffset
  | setTableColumnTimePeriodConfig
  | setTableColumnSubType
  | deleteTableColumnLoading
  | deleteTableColumnSuccess
  | deleteTableColumnFailure
  | deleteTableRowLoading
  | deleteTableRowSuccess
  | deleteTableRowFailure
  | addFormattingRule
  | removeFormattingRule
  | updateFormattingRuleType
  | updateFormattingRuleCondition
  | updateFormattingRuleValue
  | updateFormattingRuleColor
  | saveTableFormattingLoading
  | saveScorecardTableFormattingSuccess
  | saveTableFormattingFailure
  | changeColumnSummaryLoading
  | changeColumnSummarySuccess
  | changeColumnSummaryFailure
  | lockColumnPivotLoading
  | lockColumnPivotSuccess
  | lockColumnPivotFailure
  | setTableRowTitle
  | setTableRowCalculation
  | setTableRowCalculationParam
  | setTableRowDateRange
  | setTableRowMetrics
  | setTableRowDatasourceIds
  | setTableRowDatasourceType
  | setTableRowPopulation
  | setTableRowTimePeriod
  | setTableRowTimePeriodLength
  | setTableRowTimePeriodLengthOffset
  | setTableRowStatus
  | setTableRowSubType
  | openTableWidgetModal
  | closeTableWidgetModal
  | openActionsWidgetModal
  | closeActionsWidgetModal
  | selectActionsWidgetAnnotationType
  | unselectActionsWidgetAnnotationType
  | setActionsWidgetPopulation
  | setActionsWidgetHiddenColumns
  | saveActionsWidgetLoading
  | saveActionsWidgetSuccess
  | saveActionsWidgetFailure
  | closeActionsWidgetAppStatus
  | updateActions
  | resetActionList
  | fetchActionsLoading
  | updateTableNameSuccess
  | updateTableNameFailure
  | openTableColumnFormattingPanel
  | openScorecardTableFormattingPanel
  | openTableColumnPanel
  | openTableColumnFormulaPanel
  | openTableRowPanel
  | toggleTableFormattingPanel
  | toggleTableColumnPanel
  | toggleTableColumnFormulaPanel
  | toggleTableRowPanel
  | setNotesWidgetSettingsPopulation
  | setNotesWidgetSettingsTimePeriod
  | selectAnnotationType
  | unselectAnnotationType
  | updateNotesWidgetSettingsDateRange
  | updateNotesWidgetSettingsTimePeriodLength
  | saveNotesWidgetSettingsLoading
  | saveNotesWidgetSettingsSuccess
  | saveNotesWidgetSettingsFailure
  | editNotesWidgetSettingsSuccess
  | editNotesWidgetSettingsFailure
  | addNotesWidgetLoading
  | addNotesWidgetSuccess
  | addNotesWidgetFailure
  | openNoteDetailModal
  | closeNoteDetailModal
  | fetchNoteDetailSuccess
  | fetchNoteDetailError
  | openNoteModal
  | populateAthleteDropdownLoading
  | populateAthleteDropdownFailure
  | updateAthleteOptions
  | updateAction
  | updateActionSuccess
  | updateActionFailure
  | updateNotes
  | archiveNoteSuccess
  | restoreNoteSuccess
  | saveHeaderWidgetFailure
  | hideAppStatus
  | updateNotesNameSuccess
  | updateNotesNameFailure
  | updateTableColumnOrder
  | updateTableColumnOrderFailure
  | duplicateColumnIsLoading
  | duplicateColumnError
  | duplicateColumnSuccess
  | clearDuplicateColumnError
  | injuryRiskMetricsIsLoading
  | injuryRiskMetricsHasLoaded
  | injuryRiskMetricsHasErrored
  | setInjuryRiskMetrics
  | setColumnWidthType
  | setTableSortOrder
  | updateColumnConfig
  | updateRowConfig
  | openDevelopmentGoalForm
  | closeDevelopmentGoalForm
  | saveDevelopmentGoalWidgetFailure
  | saveDevelopmentGoalLoading
  | saveDevelopmentGoalFailure
  | saveDevelopmentGoalSuccess
  | editDevelopmentGoalSuccess
  | updateDevelopmentGoals
  | onDeleteDevelopmentGoalSuccess
  | setTableElementFilter
  | setTableColumnActivity
  | setTableColumnStatus
  | setTableRowActivity
  | SetCoachingPrinciplesEnabled
  | setCodingSystemKey
  | setTableColumnGameKinds
  | setTableRowGameKinds
  | setTableColumnGameResults
  | setTableRowGameResults
  | setProfileBackgroundColour
  | setTableColumnTimeInPositions
  | setTableRowTimeInPositions
  | setTableColumnTimeInFormation
  | setTableRowTimeInFormation
  | setTableColumnEventType
  | setTableRowEventType
  | setColumnPanelInputParams
  | setRowPanelInputParams
  | setTableRowGroupings
  | setColumnLoadingStatus
  | setRowLoadingStatus
  | setColumnCalculatedCachedAtUpdate
  | setColumnCalculatedCachedAtRefreshCache
  | setRowCalculatedCachedAtUpdate
  | setRowCalculatedCachedAtRefreshCache
  | setRefreshWidgetCacheStatus
  | refreshDashboard;

// redux specific types for thunk actions
type Dispatch = (
  action: Action | AnnotationsAction | ToastAction | ThunkAction | PromiseAction
) => any;
type GetState = () => Store;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
export type PromiseAction = Promise<Action>;
