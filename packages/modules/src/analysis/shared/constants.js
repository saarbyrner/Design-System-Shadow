// @flow
import type { SquadAthletesSelection as Population } from '@kitman/components/src/Athletes/types';
import type { MedicalDataSource } from '@kitman/modules/src/analysis/Dashboard/components/types';

export const MEDICAL_DATA_SOURCES: $ReadOnlyArray<MedicalDataSource> = [
  'MedicalInjury',
  'MedicalIllness',
  'RehabSessionExercise',
];

export const TIME_PERIODS = {
  today: 'today',
  yesterday: 'yesterday',
  thisWeek: 'this_week',
  lastWeek: 'last_week',
  lastMonth: 'last_month',
  thisSeasonSoFar: 'this_season_so_far',
  thisSeason: 'this_season',
  thisPreSeason: 'this_pre_season',
  thisInSeason: 'this_in_season',
  lastXDays: 'last_x_days',
  customDateRange: 'custom_date_range',
  allTime: 'all_time',
};

export const EVENT_TIME_PERIODS = {
  ...TIME_PERIODS,
  lastXEvents: 'last_x_events',
  game: 'game',
  trainingSession: 'training_session',
  lastXGames: 'last_x_games',
  lastXSessions: 'last_x_sessions',
  lastXGamesAndSessions: 'last_x_games_and_sessions',
};

export const POPULATION_TYPES = {
  inherit: 'inherit',
  squad: 'squad',
};

export const emptyPopulation: Population = {
  applies_to_squad: false,
  position_groups: [],
  positions: [],
  athletes: [],
  all_squads: false,
  squads: [],
  context_squads: [],
};

export const FORMULA_INPUT_IDS = {
  numerator: 'A',
  denominator: 'B',
};

export const FORMULA_SUBTYPES = {
  percentage: 'Percentage',
  baseline: '% baseline change',
};

export const DEFAULT_COLORS = [
  '#2A6EBB',
  '#E86427',
  '#279C9C',
  '#BB8E11',
  '#AC71F0',
  '#23254D',
  '#52A31D',
  '#CC1D92',
  '#129DE2',
  '#077D55',
  '#949494',
  '#001C8F',
  '#785EF0',
  '#920000',
  '#AB5600',
  '#004949',
];
