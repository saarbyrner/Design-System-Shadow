// @flow

export type TrainingSession = {
  date: string,
  duration: number,
  id: number,
  session_type_name: string,
  game_day_minus: ?number,
  game_day_plus: ?number,
};

export type Game = {
  date: string,
  id: number,
  opponent_score: string,
  opponent_team_name: string,
  score: string,
  team_name: string,
  venue_type_name: string,
};

export type TrainingVariable = {
  id: number,
  name: string,
  description: ?string,
  min: number,
  max: number,
};

export type OrganisationTrainingVariables = {
  id: number,
  training_variable: TrainingVariable,
  scale_increment: string,
  is_protected?: boolean,
};
