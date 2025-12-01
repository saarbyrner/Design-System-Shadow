// @flow
export const IMPORT_TYPES = {
  GrowthAndMaturation: 'growth_and_maturation',
  Baselines: 'baselines',
  LeagueBenchmarking: 'league_benchmarking',
  TrainingVariablesAnswer: 'training_variable_answer',
  EventData: 'event_data',
  LeagueGame: 'league_game',
  KitMatrix: 'kit_matrix',
};

export const IMPORT_TYPES_WITH_TEMPLATE = [
  IMPORT_TYPES.GrowthAndMaturation,
  IMPORT_TYPES.Baselines,
  IMPORT_TYPES.LeagueBenchmarking,
  IMPORT_TYPES.TrainingVariablesAnswer,
  IMPORT_TYPES.LeagueGame,
  IMPORT_TYPES.KitMatrix,
];

export const IMPORT_TYPES_WITH_BACK_BUTTON = [
  IMPORT_TYPES.GrowthAndMaturation,
  IMPORT_TYPES.Baselines,
];

export const IMPORT_TYPES_WITH_DELETE = [
  IMPORT_TYPES.GrowthAndMaturation,
  IMPORT_TYPES.LeagueBenchmarking,
  IMPORT_TYPES.TrainingVariablesAnswer,
  IMPORT_TYPES.KitMatrix,
];

// Note: Column headers need to be mapped to match the column headers in the CSV file
// otherwise editable features will not work.
export const IMPORT_TYPES_WITH_EDITABLE_FEATURES = [
  IMPORT_TYPES.EventData,
  IMPORT_TYPES.LeagueBenchmarking,
  IMPORT_TYPES.TrainingVariablesAnswer,
  IMPORT_TYPES.GrowthAndMaturation,
  IMPORT_TYPES.Baselines,
  IMPORT_TYPES.KitMatrix,
];

export const TOGGLE_OPTIONS = {
  All: 'all',
  Valid: 'valid',
  Invalid: 'invalid',
};
