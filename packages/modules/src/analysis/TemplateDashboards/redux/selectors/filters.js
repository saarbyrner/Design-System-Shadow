// @flow
import { createSelector } from '@reduxjs/toolkit';
import _isEqual from 'lodash/isEqual';
import { type RowData } from '@kitman/modules/src/analysis/TemplateDashboards/components/Table/Column/types';

import type { Store } from '../types';
import {
  REDUCER_KEY,
  getInitialState,
  initialState,
  type FilterKey,
} from '../slices/filters';

export const getActiveTemplateDashboardFilters = (state: Store) =>
  state[REDUCER_KEY].active || getInitialState().active;

export const getEditableTemplateDashboardFilters = (state: Store) =>
  state[REDUCER_KEY].editable || getInitialState().editable;

export const getEditableTemplateDashboardFilterFactory = (
  filterKey: FilterKey
) =>
  createSelector(
    [getEditableTemplateDashboardFilters],
    (filters) => filters[filterKey]
  );

export const getMultipleTemplateDashboardsFilterFactory = (
  filterKeys: FilterKey[]
) =>
  createSelector([getActiveTemplateDashboardFilters], (filters) =>
    filterKeys.reduce((acc, key) => {
      const filter = filters[key];
      return {
        ...acc,
        [`${key}`]: { ...filter },
      };
    }, {})
  );

export const getIfFiltersAreEmpty: boolean = createSelector(
  [getActiveTemplateDashboardFilters],
  (filters) => {
    return (
      _isEqual(initialState.active.population, filters.population) ||
      filters.timescope.time_period === null
    );
  }
);

// G&M report only uses Population Filter.
export const getIfPopulationIsEmpty: boolean = createSelector(
  [getActiveTemplateDashboardFilters],
  (filters) => {
    return _isEqual(initialState.active.population, filters.population);
  }
);

export const getIsPanelOpen = (state: Store): boolean =>
  state[REDUCER_KEY].isPanelOpen;

export const getSortedData = (state: Store): Array<RowData> =>
  state[REDUCER_KEY].sortedData;
