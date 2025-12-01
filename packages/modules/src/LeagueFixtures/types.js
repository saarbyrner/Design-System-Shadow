// @flow
import type { DateRange } from '@kitman/common/src/types';

export type EventFilters = {
  dateRange: DateRange,
  eventTypes: Array<string>,
  competitions: Array<string>,
  gameDays: Array<string>,
  oppositions: Array<string>,
  search_expression?: string,
  include_game_status?: boolean,
  squad_names?: Array<string>,
  statuses?: Array<string>,
  organisations?: Array<number>,
  supervisor_view?: boolean,
  start_time_asc?: boolean,
};

export type PageView = 'SCHEDULE' | 'TIMELINE' | 'WORKLOAD';
