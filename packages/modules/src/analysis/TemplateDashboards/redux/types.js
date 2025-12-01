// @flow
import type { FiltersState, ReducerKeyType } from './slices/filters';

export type Store = {
  templateDashboardsApi: Object,
  [ReducerKeyType]: FiltersState,
};
