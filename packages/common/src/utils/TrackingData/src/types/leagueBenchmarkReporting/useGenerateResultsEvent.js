// @flow
import { type GetBenchmarkReportParams } from '@kitman/services/src/services/benchmarking/getBenchmarkingReport';

export type GenerateResultsEventParams = {
  ...GetBenchmarkReportParams,
  IsCat1: boolean,
};

export type GenerateResultsEventReturnValue = {
  ...GenerateResultsEventParams,
  TrainingVariables: Array<string>,
  Seasons: Array<string>,
  TestingWindows: Array<string>,
  AgeGroups: Array<string>,
  MaturationStatuses: Array<string>,
  Positions: Array<string>,
  ComparedAgainst: {
    NumberOfAthletes: number | typeof undefined,
    Seasons: Array<string> | typeof undefined,
    TestingWindows: Array<string>,
  },
};
