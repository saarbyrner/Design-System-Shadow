// @flow
import type {
  GameEventOption,
  DetailedGameEventOption,
  TrainingSessionEventOption,
  DetailedTrainingSessionEventOption,
  OtherEventOption,
} from '../../types';

export type GameAndTrainingOptions = {
  games: Array<GameEventOption>,
  training_sessions: Array<TrainingSessionEventOption>,
  other_events?: Array<OtherEventOption>,
};

export type DetailedGameAndTrainingOptions = {
  games: Array<DetailedGameEventOption>,
  training_sessions: Array<DetailedTrainingSessionEventOption>,
  other_events?: Array<OtherEventOption>,
};
