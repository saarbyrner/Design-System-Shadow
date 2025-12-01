// @flow
import type { AthleteAvailabilities } from '@kitman/common/src/types/Event';
import type { AthleteGameStatus } from '@kitman/modules/src/LeagueOperations/shared/types/common';

export type ID = string | number;

export type GameStatus = {
  status: AthleteGameStatus,
  selectable: boolean,
  description: string | null,
};

export type Athlete = {
  id: ID,
  fullname: string,
  firstname: string,
  lastname: string,
  shortname?: string,
  user_id: ID,
  avatar_url?: string,
  game_status?: GameStatus,
  availability?: AthleteAvailabilities,
  additionalData?: any, // optional used in AthleteAndStaffSelector
  designation?: string,
  squad?: string,
};

export type Position = {
  id: ID,
  name: string,
  athletes: Array<Athlete>,
  order: number,
};

export type PositionGroup = {
  id: ID,
  name: string,
  order: number,
  positions: Array<Position>,
};

export type SquadAthlete = {
  id: ID,
  name: string,
  position_groups: Array<PositionGroup>,
  created_at: string,
  owner_id: number,
};

export type SquadAthletes = Array<SquadAthlete>;

export type Squad = {
  id: ID,
  name: string,
};

export type SquadAthletesSelection = {
  applies_to_squad: boolean,
  all_squads: boolean,
  position_groups: Array<ID>,
  positions: Array<ID>,
  athletes: Array<ID>,
  squads: Array<ID>,
  context_squads?: Array<ID>,
  users?: Array<ID>,
  // marking labels and segments as optional for now as this is a beta feature
  labels?: Array<ID>,
  segments?: Array<ID>,
  // set to true when we want to report on athletes in the squad within the specified time period
  historic?: boolean,
  // set to true when we want to inform the BE that athletes in the athletes attribute may have left the organisation
  past_athletes?: boolean,
};

export type OptionType =
  | 'athletes'
  | 'position_groups'
  | 'positions'
  | 'squads'
  | 'labels'
  | 'segments';

export type SelectorOption = {
  type: OptionType,
  id: ID,
  name: string,

  // Optional fields for when type === 'athlete'
  fullname?: string,
  firstname?: string,
  lastname?: string,
  position?: Position,
  positionGroup?: PositionGroup,
  avatar_url?: string,
};

export type SquadWithOptions = Squad & {
  options: SelectorOption[],
};

export type IsSelectedCallback = (
  id: ID,
  type: OptionType,
  squadId: ?ID
) => boolean;
export type OnOptionClickCallback = (
  id: ID,
  type: OptionType,
  squadId: ?ID,
  option?: SelectorOption
) => void;
export type OnSelectAllClickCallback = (
  options: Array<SelectorOption>,
  squadId: ?ID
) => void;
export type OnClearAllClickCallback = (
  options: Array<SelectorOption>,
  squadId: ?ID
) => void;

export type ItemLeftRenderer = (SelectorOption) => ?Node;

export type UseOptionsReturn = {
  id: ID,
  name: string,
  options: Array<SelectorOption>,
};

export type ReactSelectProps = {|
  menuIsOpen?: boolean,
  onMenuOpen?: () => void,
  onMenuClose?: () => void,
|};
