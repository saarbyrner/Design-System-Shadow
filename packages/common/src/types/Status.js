// @flow
import type { TrainingSession, Game } from './Workload';
import type { Alarm } from './Alarm';

export type Drill = {
  id: number,
  name: string,
};

export type EventBreakdown = 'SUMMARY' | 'DRILLS';

type Variable = { source: string, variable: string };
type Variables = Array<Variable>;

export type Status = {
  status_id: string,
  name: string,
  is_custom_name: boolean,
  alarms: Alarm[],
  localised_unit: string,
  description: string,
  type:
    | 'number'
    | 'boolean'
    | 'scale'
    | 'sleep_duration'
    | 'hydratation'
    | 'dynamic_movement',
  source_key?: string,
  variables: Variables,
  summary: ?string,
  period_scope: ?string,
  operator?: string,
  second_period_all_time?: boolean,
  second_period_length: ?number,
  period_length?: ?number,
  settings: Object,
  event_type_time_period?: ?string,
  games?: Array<?Game>,
  training_sessions?: Array<?TrainingSession>,
  drills?: Array<?Drill>,
  selected_games?: Array<?Game>,
  selected_training_sessions?: Array<?TrainingSession>,
  event_breakdown?: ?EventBreakdown,
  time_period_length?: ?number,
  last_x_time_period?: 'weeks' | 'days',
  time_period_length_offset?: ?number,
  last_x_time_period_offset?: 'weeks' | 'days',
  injury_risk_threshold?: number,
  injury_risk_variable_uuid?: string,
};
