// @flow
import type { SquadAthletesSelection } from './types';

export const EMPTY_SELECTION: SquadAthletesSelection = {
  applies_to_squad: false,
  all_squads: false,
  position_groups: [],
  positions: [],
  athletes: [],
  squads: [],
  context_squads: [],
  users: [],
  labels: [],
  segments: [],
};
