// @flow
import { createSelector } from '@reduxjs/toolkit';
import { getInitialState } from '../slices/filters';
import { reducerKey } from '../consts';
import type { Store, FilterKey } from '../types';

export const getFilters = (store: { [typeof reducerKey]: Store }) => {
  return store[reducerKey] || getInitialState();
};

export const getFilterFactory = (filterKey: FilterKey) =>
  createSelector([getFilters], (filters) => filters[filterKey]);
