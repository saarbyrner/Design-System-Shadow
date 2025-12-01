// @flow
import type { FiltersState, ReducerKeyType } from './slices/filters';

export type Store = {
  benchmarkReportApi: Object,
  [ReducerKeyType]: FiltersState,
};
