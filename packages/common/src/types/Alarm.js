// @flow
import type { Athlete } from './Athlete';

type AlarmColours =
  | 'colour1'
  | 'colour2'
  | 'colour3'
  | 'colour4'
  | 'colour5'
  | 'colour6'
  | 'colour7'
  | 'colour8';

export type AlarmCalculation = 'sum' | 'mean' | 'max' | 'min' | 'count';

export type Alarm = {
  alarm_id: string,
  label: string,
  name: string,
  colour: AlarmColours,
  condition: 'less_than' | 'greater_than' | 'equals',
  value: number,
  positions: Array<string>,
  position_groups: Array<string>,
  athletes: Array<Athlete>,
  applies_to_squad: boolean,
  percentage_alarm_definition?: {
    calculation?: ?AlarmCalculation,
    period_length?: ?number,
    period_scope?: ?string,
    percentage?: ?string,
  },
  alarm_type: 'percentage' | 'numeric',
};
