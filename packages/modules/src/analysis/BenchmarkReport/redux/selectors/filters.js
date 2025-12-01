// @flow
import { createSelector } from '@reduxjs/toolkit';
import type { Store } from '../types';
import { REDUCER_KEY } from '../slices/filters';
import type { FilterKey } from '../slices/filters';

export const getActiveFilters = (state: Store) => state[REDUCER_KEY].active;

export const getEditableFilters = (state: Store) => state[REDUCER_KEY].editable;

export const getEditableFiltersFactory = (filterKey: FilterKey) =>
  createSelector([getEditableFilters], (filters) => filters[filterKey]);
