// @flow
import type { LabelPopulation } from '@kitman/services/src/services/analysis/labels';
import type { GroupPopulation } from '@kitman/services/src/services/analysis/groups';
import type { Athlete } from '../Athletes/types';

export type Position = {
  id: number,
  name: string,
  order?: number,
  athletes: Array<Athlete>,
};

export type PositionGroup = {
  id: number,
  name: string,
  order?: number,
  positions: Array<Position>,
};

export type SquadAthletes = {
  position_groups: Array<PositionGroup>,
};

export type SquadAthletesSelection = {
  applies_to_squad: boolean,
  position_groups: Array<$PropertyType<PositionGroup, 'id'>>,
  positions: Array<$PropertyType<Position, 'id'>>,
  athletes: Array<$PropertyType<Athlete, 'id'>>,
  all_squads: boolean,
  squads: Array<string>,
  context_squads?: Array<string>,
  users?: Array<string | number>,
  labels?: Array<$PropertyType<LabelPopulation, 'id'>>,
  segments?: Array<$PropertyType<GroupPopulation, 'id'>>,
  historic?: boolean,
};
