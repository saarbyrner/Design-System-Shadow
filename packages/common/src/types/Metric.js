// @flow
import type { Athlete } from '@kitman/common/src/types/Athlete';
import type { Status } from '@kitman/common/src/types/Status';
import type { GraphType } from './Graphs';
import type { InjuryCategory, MainCategory } from './Issues';

export type Metric = {
  type: 'metric' | 'medical',
  status: Status,
  main_category: MainCategory,
  category: InjuryCategory,
  category_division: InjuryCategory,
  category_selection: string,
  series: Array<{
    fullname: string,
    name: string,
    color: string,
    seriesData: Array<Array<number>>,
    datapoints: Array<{
      name: string,
      y: number,
      population_type: string,
      population_id: string,
    }>,
    value: string,
    population_type: string,
    population_id: string,
  }>,
  athlete_ids: Array<number>,
  squad_selection: {
    athletes: Array<Athlete>,
    positions: Array<string>,
    position_groups: Array<string>,
    applies_to_squad: boolean,
    all_squads: boolean,
    squads: Array<string>,
  },
  population: string,
  overlays: Array<any>,
  measurement_type: string,
  calculation: string,
  filters: {
    time_loss: Array<string>,
    session_type: Array<string>,
    competitions: Array<string>,
    event_types: Array<string>,
    training_session_types: Array<number>,
  },
  filter_names: {
    time_loss: Array<string>,
    session_type: Array<string>,
    competitions: Array<string>,
    event_types: Array<string>,
    training_session_types: Array<string>,
  },
  time_period_length?: ?number,
  last_x_time_period?: 'weeks' | 'days',
  time_period_length_offset?: ?number,
  last_x_time_period_offset?: 'weeks' | 'days',
  linked_dashboard_id?: ?string,
  metric_style?: ?GraphType,
};
