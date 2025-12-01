// @flow
import type { OrganisationFormat } from '@kitman/services/src/services/planning/getOrganisationFormats';
import type {
  GameActivity,
  TeamsPitchInfo,
} from '@kitman/common/src/types/GameEvent';
import type { Athlete } from '@kitman/common/src/types/Event';

export type Field = {
  id: number,
  name: string,
  columns: number,
  rows: number,
  width: number,
  height: number,
  cellSize: number,
};

export type Position = {
  id: ?number,
  abbreviation?: string,
};

export type PositionData = {
  id: ?number,
  position: Position,
};

export type PlayerWithPosition = {
  player?: Athlete,
  positionData?: PositionData,
};

export type Coordinate = {
  ...PositionData,
  field_id: number,
  formation_id: number,
  order: number,
  position_id: number,
  x: number,
  y: number,
  player?: Athlete,
  dirty?: boolean,
};

export type FormationCoordinates = {
  [positionId: string]: Coordinate,
};

export type Formation = {
  id: number,
  name: string, // 5-4-1
  number_of_players: number,
};

export type InFieldPlayers = {
  [positionId: string]: Athlete,
};

export type Team = {
  inFieldPlayers: InFieldPlayers,
  players: Array<Athlete>,
};

export type PitchViewContextType = {
  sport: string,
  field: Field,
  team: Team,
  formations?: Array<Formation>,
  selectedFormation: Formation | null,
  eventId?: number,
  selectedGameFormat: OrganisationFormat | null,
  formationCoordinates: FormationCoordinates,
  setSelectedFormation?: (formation: Formation | null) => void,
  setTeam: (Team) => void,
  setSelectedGameFormat?: (gameFormat: OrganisationFormat) => void,
  setFormationCoordinates?: (coordinates: FormationCoordinates) => void,
  setField: (field: $Shape<Field>) => void,
  activeEventSelection: string,
  setActiveEventSelection: (string) => void,
  pitchActivities: Array<GameActivity>,
  gameFormats?: Array<OrganisationFormat>,
  selectedPitchPlayer: ?PlayerWithPosition,
  setSelectedPitchPlayer: (?PlayerWithPosition) => void,
  isLoading: boolean,
  setIsLoading: (boolean) => void,
};

export type PitchViewInitialState = {
  field: Field,
  team: Team,
  teams: TeamsPitchInfo,
  selectedFormation: Formation | null,
  eventId?: number,
  selectedGameFormat: OrganisationFormat | null,
  formationCoordinates: FormationCoordinates,
  activeEventSelection: string,
  pitchActivities: Array<GameActivity>,
  selectedPitchPlayer: ?PlayerWithPosition,
  isLoading: boolean,
};

export type UpdatePosition = {
  from: Coordinate,
  to: Coordinate,
};

export type OnPlayerPitchClickProps = {
  player: Athlete,
  eventType: string,
  positionData?: PositionData,
};
