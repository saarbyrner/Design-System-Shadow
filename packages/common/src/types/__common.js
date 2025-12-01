// @flow
export type ExposureType = 'game' | 'training_session' | 'all';
export type PlatformType = 'msk' | 'capture' | 'well_being' | 'gym_scores';
export type AlarmFilterOptions = 'inAlarm' | 'noAlarms';
export type AvailabilityFilterOptions =
  | 'unavailable'
  | 'injured_or_ill'
  | 'returning_from_injury_or_illness'
  | 'available';
export type AthleteFilterOptions = {
  title: string,
  id: number | string,
};
export type PositionsHash = {
  position_group_order: Array<number>,
  position_groups: Object,
  position_order: Array<number>,
  positions: Object,
};
export type Squad = {
  created: string,
  created_by: ?string,
  duration: ?string,
  id: number,
  is_default: ?number,
  name: string,
  updated: string,
};

export type DivisionSquad = {
  id: number,
  name: string,
  duration: ?string,
  is_default: ?boolean,
  created_by: ?number,
  created: string,
  updated: string,
  sport_id: ?number,
  is_locked: boolean,
  parent_squad_id: ?number,
  division?: {
    id: number,
    name: string,
    parent_division_id: ?number,
  },
};
