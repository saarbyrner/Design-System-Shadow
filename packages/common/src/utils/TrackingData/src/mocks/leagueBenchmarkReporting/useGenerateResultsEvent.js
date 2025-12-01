// @flow
import type {
  GenerateResultsEventParams,
  GenerateResultsEventReturnValue,
} from '@kitman/common/src/utils/TrackingData/src/types/leagueBenchmarkReporting';

export const useGenerateResultsEventParams: GenerateResultsEventParams = {
  age_group_ids: [2],
  bio_band_range: [69, 100],
  club_results: true,
  compare_to: {
    athlete_ids: [190076],
    seasons: [2022],
    testing_window_ids: [6],
  },
  maturation_status_ids: [1],
  national_results: true,
  position_ids: [2],
  seasons: [2023],
  testing_window_ids: [4],
  training_variable_ids: [1],
  IsCat1: true,
};

export const useGenerateResultsEventReturnValue: GenerateResultsEventReturnValue =
  {
    ...useGenerateResultsEventParams,
    AgeGroups: ['U10'],
    ComparedAgainst: {
      NumberOfAthletes: 1,
      Seasons: ['2022/2023'],
      TestingWindows: ['Test Window 1'],
    },
    MaturationStatuses: ['Very Early'],
    Positions: ['Position group 2'],
    Seasons: ['2023/2024'],
    TestingWindows: ['Test Window 1'],
    TrainingVariables: ['metric_1'],
  };
