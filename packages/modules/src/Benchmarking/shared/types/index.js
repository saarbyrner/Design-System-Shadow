// @flow
type DefaultObjectType = {
  id: number,
  name: string,
};

type SelectType = {
  value: number,
  label: string,
};

export type BenchmarkResults = {
  organisation: DefaultObjectType,
  season: number,
  testing_window: DefaultObjectType,
  training_variables: Array<DefaultObjectType>,
  age_group_seasons: Array<DefaultObjectType>,
  validated_training_variables: Array<{
    age_group_season_id: number,
    training_variable_ids: Array<number>,
  }>,
};

export type BenchmarkClubsResponse = Array<DefaultObjectType>;
export type BenchmarkSeasonsResponse = Array<number>;
export type BenchmarkWindowsResponse = Array<DefaultObjectType>;

export type BenchmarkClubs = Array<SelectType>;
export type BenchmarkSeasons = Array<SelectType>;
export type BenchmarkWindows = Array<SelectType>;
