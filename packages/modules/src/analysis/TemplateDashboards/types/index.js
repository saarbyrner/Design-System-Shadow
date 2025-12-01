// @flow
import type { TimePeriods } from '@kitman/modules/src/analysis/shared/types';

export type TemplateDashboardKey =
  | 'coaching_summary'
  | 'development_journey'
  | 'medical'
  | 'growth_and_maturation'
  | 'staff_development';

export type Timescope = {
  time_period: ?TimePeriods,
  start_time?: string,
  end_time?: string,
  time_period_length?: ?number,
  time_period_length_offset?: ?number,
};
