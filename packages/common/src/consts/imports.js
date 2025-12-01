// @flow
export const IMPORT_STATUS = {
  Completed: 'completed',
  Pending: 'pending',
  Running: 'running',
  Errored: 'errored',
  Deleting: 'deleting',
};

export const IMPORT_TYPES = {
  AthleteImport: 'athlete_import',
  UserImport: 'user_import',
  OfficialImport: 'official_import',
  ScoutImport: 'scout_import',
  OfficialAssignmentImport: 'official_assignment_import',
  GrowthAndMaturationImport: 'growth_and_maturation_import',
  BaselinesImport: 'baselines_import',
  LeagueBenchmarkingImport: 'league_benchmarking_import',
  TrainingVariableAnswerImport: 'training_variable_answer_import',
  AdditionalUserImport: 'additional_user_import',
};
