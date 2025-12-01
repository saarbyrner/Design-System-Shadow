// @flow
import type {
  TableWidgetAvailabilityStatus,
  TableWidgetParticipationStatus,
} from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/types';
import { FORMULA_SUBTYPES } from '@kitman/modules/src/analysis/shared/constants';

export type BackgroundColourValue =
  | 'transparent'
  | 'custom'
  | 'organisation_branding';

export const MEDICAL_DATA_SOURCES_TYPES = {
  medicalIllness: 'MedicalIllness',
  medicalInjury: 'MedicalInjury',
  rehabSessionExercise: 'RehabSessionExercise',
};

export type MedicalDataSource = $Values<typeof MEDICAL_DATA_SOURCES_TYPES>;

export const DATA_SOURCE_TYPES = {
  tableMetric: 'TableMetric',
  principle: 'Principle',
  eventActivityType: 'EventActivityType',
  eventActivityTypeCategory: 'EventActivityTypeCategory',
  principleType: 'PrincipleType',
  principleCategory: 'PrincipleCategory',
  principlePhase: 'PrinciplePhase',
  availability: 'Availability',
  participationLevel: 'ParticipationLevel',
  eventActivityDrillLabel: 'EventActivityDrillLabel',
  gameActivity: 'GameActivity',
  gameResultAthlete: 'GameResultAthlete',
  formula: 'Formula',
  maturityEstimate: 'MaturityEstimate',
};

export type DataSourceType =
  | MedicalDataSource
  | $Values<typeof DATA_SOURCE_TYPES>;

export const DATA_SOURCES = {
  metric: 'metric',
  activity: 'activity',
  availability: 'availability',
  participation: 'participation',
  medical: 'medical',
  games: 'games',
  formula: 'formula',
  growthAndMaturation: 'growthAndMaturation',
};
export type DataSource = $Values<typeof DATA_SOURCES>;

export type RegularCalculation =
  | 'sum_absolute'
  | 'sum'
  | 'min_absolute'
  | 'min'
  | 'max_absolute'
  | 'max'
  | 'mean'
  | 'mean_absolute'
  | 'count'
  | 'count_absolute'
  | 'last';

export type ComplexCalculation =
  | 'z_score'
  | 'complex_z_score'
  | 'acute_chronic'
  | 'acute_chronic_ewma'
  | 'training_stress_balance'
  | 'standard_deviation'
  | 'strain'
  | 'monotony'
  | 'training_efficiency_index'
  | 'average_percentage_change';

export type Calculation = RegularCalculation | ComplexCalculation;

export type CalculationParams = {
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

export type InputParamsStatus = {
  ...TableWidgetAvailabilityStatus,
  ...TableWidgetParticipationStatus,
};

export type InputParams = {
  source: string,
  variable: string,
  ids: Array<number>,
  type: DataSource,
  status: InputParamsStatus,
  position_ids: Array<string>,
  formation_ids: Array<string>,
  kinds: string | Array<string>,
  result: ?string,
  event: string,
  key_name: string,
};

export type DataSourceInputParams = {
  type: DataSourceType,
  data: Array<$Shape<InputParams>>,
};

export const PANEL_TYPES = {
  row: 'row',
  column: 'column',
  formula: 'formula',
};

export type PanelType = $Values<typeof PANEL_TYPES>;

export const PARTICIPATION_STATUS = {
  participationStatus: 'participation_status',
  participationLevels: 'participation_levels',
  gameInvolvement: 'game_involvement',
};

export type ParticipationStatus = $Values<typeof PARTICIPATION_STATUS>;

export type OnSetCalculationParam = (
  key: string,
  value: string | number | null
) => void;

export type OnSetCalculation = (calculation: string | number | null) => void;

export type FormulaSubtype = $Values<typeof FORMULA_SUBTYPES>;

export type TimeScopeConfig = {
  event_types: Array<string>,
};
