// @flow
import type { SquadAthletesSelection } from '@kitman/components/src/types';
import type {
  SquadAthletesSelection as Population,
  OptionType,
  ID,
  SelectorOption,
} from '@kitman/components/src/Athletes/types';
import type { CoreChartType } from '@kitman/modules/src/analysis/Dashboard/components/ChartWidget/types';
import {
  DATA_SOURCES,
  type DataSource,
  DATA_SOURCE_TYPES,
  type DataSourceType,
  type MedicalDataSource,
  type TimeScopeConfig,
  type RegularCalculation,
} from '@kitman/modules/src/analysis/Dashboard/components/types';

import { DATA_STATUS, INHERIT_GROUPING } from './consts';

export type TableWidgetType = 'COMPARISON' | 'SCORECARD' | 'LONGITUDINAL';

export type ColumnSortType = 'HIGH_LOW' | 'LOW_HIGH' | 'DEFAULT';

export type RankingDirection = 'HIGH_LOW' | 'LOW_HIGH' | 'NONE';

export type WidgetType = TableWidgetType | CoreChartType;

export type RankingCalculation =
  | 'NONE'
  | 'RANK'
  | 'QUARTILE'
  | 'PERCENTILE'
  | 'QUINTILE'
  | 'SPLIT_RANK';

export type TableRegularCalculations = RegularCalculation;

export type TableComplexCalculations =
  | 'z_score'
  | 'complex_z_score'
  | 'acute_chronic'
  | 'acute_chronic_ewma'
  | 'training_stress_balance'
  | 'standard_deviation'
  | 'strain'
  | 'monotony'
  | 'average_percentage_change';

export type TableCalculation =
  | TableRegularCalculations
  | TableComplexCalculations;

export type RankingCalculationConfig = {
  type: RankingCalculation,
  direction: RankingDirection,
};

export type TableElementFilter =
  | 'time_loss'
  | 'competitions'
  | 'event_types'
  | 'session_type'
  | 'training_session_types'
  | 'micro_cycle'
  | 'match_days';

export type TableElementFilterValue = Array<string | number>;

export const TABLE_WIDGET_DATA_SOURCE_TYPES = DATA_SOURCE_TYPES;
export type TableWidgetDataSourceType = MedicalDataSource | DataSourceType;

export const TABLE_WIDGET_DATA_SOURCES = DATA_SOURCES;
export type TableWidgetDataSource = DataSource;

export type ColumnWidthType =
  | 'FIT_TO_WIDTH'
  | 'FIT_TO_CONTENT'
  | 'NARROW'
  | 'NORMAL'
  | 'WIDE';

export type TableElementFilters = {|
  time_loss: Array<number>,
  competitions: Array<number>,
  event_types: Array<number>,
  session_type: Array<string>,
  training_session_types: Array<number>,
  micro_cycle: Array<number>,
  match_days: Array<number>,
|};

export type TableWidgetCellValue =
  | null
  | number
  | string
  | {
      numerator?: number,
      denominator?: number,
      status?: string,
    };

export type DynamicRowChildren = Array<{ id: string, value: ?string }>;
export type TableWidgetCellData = {
  id: string | number,
  value: TableWidgetCellValue,
  status?: string,
  children?: DynamicRowChildren,
};

export type TableWidgetAvailabilityStatus = string;

export type TableWidgetParticipationStatus =
  | 'participation_status'
  | 'participation_levels'
  | 'game_involvement';

export type TableWidgetFormatRule = {
  type: 'numeric' | 'string',
  condition: string,
  value: number | string,
  color: string,
};

export type TableWidgetMetric = {
  key_name: string,
  name: string,
  description: string,
};

export type RehabSourceSubTypes = {
  exercise_ids?: Array<number>,
  maintenance?: boolean | null,
  body_area_ids?: Array<number>, // NOTE: overridden in TableWidgetSourceSubtypes
};

export type TableWidgetSourceSubtypes = {
  ...RehabSourceSubTypes,
  osics_pathology_ids?: Array<number>,
  osics_body_area_ids?: Array<number>,
  osics_classification_ids?: Array<number>,
  side_ids?: Array<number>,
  activity_group_ids?: Array<number>,
  activity_ids?: Array<number>,
  bamic_grades?: Array<number>,
  osics_code_ids?: Array<number>,
  onset_ids?: Array<number>,
  position_when_injured_ids?: Array<number>,
  exposure_types?: Array<number>,
  competition_ids?: Array<number>,
  contact_types?: Array<number>,
  recurrence?: boolean | null,
  time_loss?: boolean | null,
  pathology_ids?: Array<number>,
  body_area_ids?: Array<number>,
  classification_ids?: Array<number>,
  code_ids?: Array<number>,
};

export type TableWidgetElementSourceBase = {
  key_name: string,
  config: ?Object,
  id: number,
  ids?: Array<number>,
  kinds?: ?Array<string>,
  result?: ?string,
  source: string,
  type: TableWidgetDataSourceType,
  unit?: string,
  variable: string,
  status?: TableWidgetAvailabilityStatus | TableWidgetParticipationStatus,
  subtypes?: TableWidgetSourceSubtypes,
  data_source_type?: string,
  position_ids?: Array<number | string>,
  formation_ids?: Array<number | string>,
  training_variable_ids?: Array<number>,
  event?: string,
};

export type TableWidgetElementSource = {
  A?: TableWidgetElementSource,
  B?: TableWidgetElementSource,
} & TableWidgetElementSourceBase;

export type TableElementConfig = {
  filters?: ?TableElementFilters,
};

export type TableWidgetElement = {
  id: number,
  name: string,
  config: TableElementConfig,
  calculation: string,
  data_source: TableWidgetElementSource,
  cached_at?: string,
};

export type TableWidgetColumnConfig = {
  conditional_formatting?: Array<TableWidgetFormatRule>,
  summary_calculation?: string,
  pivot_locked?: boolean,
  ranking_calculation?: RankingCalculationConfig,
  filters?: TableElementFilters,
  formula?: string,
};

export type TimeScope = {
  time_period?: ?string,
  start_time?: ?string,
  end_time?: ?string,
  time_period_length?: ?number,
  time_period_length_offset?: ?number,
  config?: TimeScopeConfig,
};

export type TableWidgetColumn = {
  column_id: string,
  config: ?TableWidgetColumnConfig,
  id: number,
  name: ?string,
  data: ?Array<TableWidgetCellData>,
  order: number,
  population: ?SquadAthletesSelection,
  summary: string,
  table_element: ?TableWidgetElement,
  time_scope: TimeScope,
  calculatedCachedAt?: string,
  loadingStatus?: string,
};

export type DynamicTableWidgetRaw = {
  row_id: number,
  id: string,
  isDynamic: boolean,
  value: number,
};

export type TableWidgetRow = {
  config: ?{
    conditional_formatting: Array<TableWidgetFormatRule>,
    summary_calculation: string,
    groupings?: Array<string>,
  },
  id: number,
  name: ?string,
  order: number,
  population: ?SquadAthletesSelection,
  row_id: string,
  table_element: ?TableWidgetElement,
  time_scope: TimeScope,
  isDynamic?: boolean,
  value?: number,
  children?: Array<DynamicTableWidgetRaw>,
  loadingStatus?: string,
  calculatedCachedAt?: string,
};

export type TableWidgetRowConfig = {
  conditional_formatting?: Array<TableWidgetFormatRule>,
  summary_calculation?: string,
  ranking_calculation?: RankingCalculationConfig,
};

export type TableWidgetRowMetric = {
  config?: TableWidgetRowConfig,
  id: number,
  metricable_id: number,
  metricable_type: string,
  name: string,
  source: string,
  summary: string,
  variable: string,
  table_element: ?TableWidgetElement,
  calculatedCachedAt?: string,
};

export type TableWidgetRowTimeScope = {
  config?: {
    conditional_formatting: Array<TableWidgetFormatRule>,
  },
  id: number,
  time_period: string,
  start_time?: string,
  end_time?: string,
  time_period_length?: ?number,
  time_period_length_offset?: ?number,
};

export type TableWidgetColumnData = {
  data: Array<TableWidgetCellData>,
  message: string,
  status: 'PENDING' | 'SUCCESS' | 'FAILURE',
};

export type TableWidgetScorecardColumnData = Array<{
  value: number,
  id: number,
  status: 'PENDING' | 'SUCCESS' | 'FAILURE' | 'FORBIDDEN',
  rowDetails: TableWidgetRowMetric,
}>;

export type TableWidgetRowData = {
  data: Array<TableWidgetCellData>,
  message: string,
  status: 'PENDING' | 'SUCCESS' | 'FAILURE',
};

export type TableWidgetRowDataRender = {
  data: { [key: string]: { value: string } },
  message: string,
  status: 'PENDING' | 'SUCCESS' | 'FAILURE',
};

export type TableWidgetParticipationOption = {
  id: number,
  name: string,
  canonical_participation_level: 'full' | 'partial',
  include_in_group_calculations: boolean,
  default: true,
};

export type ColumnDataStatus = $Values<typeof DATA_STATUS>;
export type ColumnDataItem = {
  id: string,
  value: number,
  children?: DynamicRowChildren,
};
export type ColumnDataArray = Array<ColumnDataItem>;

export type TableWidgetCalculationParams = {
  evaluated_period?: number,
  operator?: 'mean' | 'min' | 'max' | 'sum',
  comparative_period?: number,
  comparative_period_type?: 'custom' | 'all',
  acute?: number,
  chronic?: number,
  type?: 'acute' | 'chronic' | 'ratio',
  second_data_source?: string,
  second_data_source_type?: 'external' | 'internal',
  time_period?: 'last' | 'all_time',
  time_period_length?: number,
  time_period_length_unit?: 'days' | 'weeks',
};

export type FormulaElementConfig = $Shape<{
  filters: TableElementFilters,
  calculation_params: TableWidgetCalculationParams,
  groupings: Object,
}>;

export type AddColumnData = {
  source: TableWidgetDataSource,
  sourceSubtypeId: ?number,
  widgetId: number,
  existingTableColumns: Array<TableWidgetColumn>,
  existingTableRows: Array<TableWidgetRow>,
  tableContainerId: number,
  tableName: string,
  tableType: WidgetType,
  showSummary: boolean,
};

export type TableWidgetFormulaInput = {
  panel_source: ?TableWidgetDataSource,
  dataSource: $Shape<TableWidgetElementSource> | typeof undefined,
  population: ?Population,
  time_scope: ?TimeScope,
  calculation: ?TableCalculation,
  element_config: FormulaElementConfig,
  population_selection: 'inherit' | 'select' | null,
  isPanelFiltersOpen: boolean,
};

export type FormulaInputObject = {
  data_source_type: TableWidgetDataSourceType,
  population: ?Population,
  time_scope: ?TimeScope,
  calculation: ?TableCalculation,
  input_params: Object,
  element_config: ?{
    filters?: TableElementFilters,
    calculation_params?: TableWidgetCalculationParams,
  },
};

export type FormulaInputParamsData = {
  [string]: FormulaInputObject,
  data_source_type?: 'Formula',
};

export type TableFormulaColumnData = {
  name: string,
  column_id?: string,
  data_source_type: TableWidgetDataSourceType,
  input_params: FormulaInputParamsData,
  summary: string,
  time_scope: ?TimeScope,
  element_config: {
    formula: string, // Formulas will be user generated and not have typed values
    formula_id: ?number,
  },
};

export type TableFormulaColumnResponse = {
  ...TableWidgetColumn,
  table_element: {
    id: number,
    name: string,
    calculation: 'formula',
    config: {
      formula: string,
    },
    data_source: FormulaInputParamsData,
  },
};

export type SetupFormulaPanel = {
  formulaId: number,
  tableType: WidgetType,
  widgetId: number,
  tableContainerId: number,
  columnDetails?: TableFormulaColumnResponse,
};

export type UpdateFormulaInput = {
  formulaInputId: string,
  properties: $Shape<TableWidgetFormulaInput>,
};

export type UpdateFormulaInputDataSource = {
  formulaInputId: string,
  properties: $Shape<TableWidgetElementSource>,
};

export type UpdateFormulaInputElementConfig =
  | {
      formulaInputId: string,
      configKey: 'filters',
      properties: $Shape<TableElementFilters>,
    }
  | {
      formulaInputId: string,
      configKey: 'calculation_params',
      properties: $Shape<TableWidgetCalculationParams>,
    }
  | {
      formulaInputId: string,
      configKey: 'groupings',
      properties: { index: number, grouping: string },
    };

export type FormulaInputParams = {
  [string]: TableWidgetFormulaInput,
};

export type DataSourceSubtypeParams = {
  value: string,
  subtypeKey: string,
};

export type UpdateFormulaInputDataSourceSubtype = {
  formulaInputId: string,
  properties: $Shape<DataSourceSubtypeParams>,
};

export type HiddenCalculationOptios = {
  hideProportion?: boolean,
  hideCount?: boolean,
  hidePercentage?: boolean,
};

export type TablePanel = 'column' | 'row' | 'formula';

export type InheritGroupings = $Values<typeof INHERIT_GROUPING>;

export type RowGroupingParams = { [key: string]: string };

export type SelectedGroupingsItem = {
  [key: string]: {
    id: ID,
    type: OptionType,
    squadId: ID,
    grouping: string,
  },
};

export type TableGroupingsConfig = { [key: number]: string };

export type RowPanelConfig = {
  groupings?: Array<string>,
};

export type DynamicRows = { [key: string | number]: string[] };

export type DynamicRowData = { isDynamic: boolean, label?: string };

export type DynamicRowItem = { id: string, value: string };

export type SelectedPopulationItem = {
  id: ID,
  type: OptionType,
  squadId: ?ID,
  contextSquads: ID[],
  option: ?SelectorOption,
  historic?: boolean,
};
export type SelectedPopulationItems = SelectedPopulationItem[];
