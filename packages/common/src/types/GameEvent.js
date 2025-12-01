// @flow
import type { Option } from '@kitman/components/src/Select';
import {
  eventTypes,
  pitchViewFormats,
  timeCellFormat,
} from '@kitman/common/src/consts/gameEventConsts';
import type {
  FormationCoordinates,
  InFieldPlayers,
} from '@kitman/common/src/types/PitchView';

import type { EventAthlete, EventUser } from './Event';

export type TimeCellFormatType = $Values<typeof timeCellFormat>;
export type PitchViewFormatType = $Values<typeof pitchViewFormats>;
export type EventActivityTypes = $Values<typeof eventTypes>;

export type GameActivityKind =
  | 'formation_position_view_change'
  | 'position_change'
  | 'formation_complete'
  | 'yellow_card'
  | 'red_card'
  | 'goal'
  | 'own_goal'
  | 'assist'
  | 'formation_change'
  | 'position_swap'
  | 'substitution'
  | 'total_time'
  | 'penalty_shootout'
  | 'no_goal'
  | 'captain_assigned';

export type GameStatus =
  | 'awaiting_officials'
  | 'awaiting_rosters'
  | 'match_report_submitted_by_id'
  | 'roster_available'
  | 'awaiting_report'
  | 'disciplinary_issue'
  | 'report_available';

export type GameActivity = {
  id?: number,
  kind: GameActivityKind,
  minute: number,
  athlete_id?: ?number,
  relation?: {
    id: ?number | ?string,
    name?: string,
    number_of_players?: number,
  },
  game_period_id?: ?number,
  absolute_minute: number,
  delete?: boolean,
  activityIndex?: number,
  game_activity_id?: number,
  game_activities?: ?Array<GameActivity>,
  additional_minute?: number,
  user_id?: number,
  organisation_id?: number,
};

export type GamePeriod = {
  id: number,
  name: string,
  duration: number,
  additional_duration?: ?number,
  order: number,
  absolute_duration_start?: number,
  absolute_duration_end?: number,
  localId?: number,
  delete?: boolean,
};

export type AthletePlayTime = {
  game_period_id: number,
  athlete_id: number,
  minutes: number,
  position_id?: number,
};

export type DisciplinaryReasonOptions = {
  yellow_options: Array<Option>,
  red_options: Array<Option>,
};

export type ActivityDisciplinaryReason = {
  id: number,
  penalty_card: string,
  description: string,
};

export type GameScores = {
  orgScore: number,
  opponentScore: number,
};

export type GamePeriodStorage = {
  localEventPeriods: Array<Object>,
  apiEventPeriods: Array<GamePeriod>,
};

export type GameActivityStorage = {
  localGameActivities: Array<Object>,
  apiGameActivities: Array<GameActivity>,
};

export type AthletePlayTimesStorage = {
  localAthletePlayTimes: Array<AthletePlayTime>,
  apiAthletePlayTimes: Array<AthletePlayTime>,
};

type TeamPitchInfo = {
  formation: ?Object,
  formationCoordinates: FormationCoordinates,
  positions: Array<GameActivity>,
  inFieldPlayers: InFieldPlayers,
  players: Array<EventAthlete>,
  listPlayers: Array<EventAthlete>,
  staff: Array<EventUser>,
};

export type TeamsPitchInfo = {
  home: TeamPitchInfo,
  away: TeamPitchInfo,
};

export type TeamsPlayers = {
  homePlayers: Array<EventAthlete>,
  awayPlayers: Array<EventAthlete>,
};

export type TeamsPenalties = {
  homePenalties: Array<GameActivity>,
  awayPenalties: Array<GameActivity>,
};

export type MatchReportPenaltyListStorage = {
  localPenaltyLists: TeamsPenalties,
  apiPenaltyLists: TeamsPenalties,
};

export type MatchReportNoteStorage = {
  apiNotes: string,
  localNotes: string,
};
