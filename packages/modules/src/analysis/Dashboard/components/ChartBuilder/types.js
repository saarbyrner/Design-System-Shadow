// @flow
import type { SquadAthletesSelection } from '@kitman/components/src/Athletes/types';
import { type KitmanIconName } from '@kitman/playbook/icons';
import type { Timescope } from '@kitman/modules/src/analysis/shared/types';
import type { InputParams } from '@kitman/modules/src/analysis/shared/types/charts';
import type { TableWidgetDataSource } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/types';
import type { IconDataName } from '@kitman/playbook/icons/kitmanIconData';

export type DataSourceFormState = {
  id?: string | number,
  data_source_type: string,
  type?: TableWidgetDataSource,
  input_params: InputParams,
  calculation: string,
  overlays: Object | null,
  population: SquadAthletesSelection,
  time_scope: Timescope,
  config: Object,
};

// This type is the data structure of how modules (e.g. MetricModule) pass the data through to state.
// It will be expanded for other data modules as we add them to charts v2
// Used in a utils function to format input_params
export type DataSourceInput = {
  name?: string,
  key_name?: string,
  ids?: Array<?number>,
  position_ids?: Array<number>,
  formation_ids?: Array<number>,
  kinds?: string | Array<string>,
  result?: string,
  status?: string,
  participation_level_ids?: Array<?number>,
};

export type Grouping = {
  name: string,
  groupings: Array<?string>,
};

export type ErrorType = 'invalidGrouping' | 'invalidFilter';

export type InvalidChartElementMap = {
  chart_element_id: Array<ErrorType>,
};

export type RenderOptionType =
  | 'name'
  | 'type'
  | 'stack_group_elements'
  | 'conditional_formatting'
  | 'axis_config';

export type RenderOptionValue = Array<string | number | boolean>;

export type VisualisationType =
  | 'line'
  | 'column'
  | 'bar'
  | 'area'
  | 'donut'
  | 'pie';

export type VisualisationOption = {
  label: string,
  value: VisualisationType,
  icon?: KitmanIconName,
  customIcon?: IconDataName,
  isEnabled: boolean,
  styling?: string,
};

export type TimeScopeOption =
  | 'start_time'
  | 'end_time'
  | 'time_period'
  | 'time_period_length'
  | 'time_period_length_offset'
  | 'config';

export type AddDataSourceGrouping = {
  index?: number,
  grouping: ?string,
};
