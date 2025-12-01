// @flow
import { createListenerMiddleware } from '@reduxjs/toolkit';
import { getActiveTemplateDashboardFilters } from '../selectors/filters';
import { applyFilters, clearFilters } from '../slices/filters';
import { getLocalStorageKey } from '../../utils';

// Create the middleware instance and methods
const filtersLocalStorage = createListenerMiddleware();

// This middleware listens to updates to the filters and commits them to local storage
filtersLocalStorage.startListening({
  actionCreator: applyFilters,
  effect: (action, listenerApi) => {
    window.localStorage.setItem(
      getLocalStorageKey(),
      JSON.stringify(getActiveTemplateDashboardFilters(listenerApi.getState()))
    );
  },
});

filtersLocalStorage.startListening({
  actionCreator: clearFilters,
  effect: () => {
    window.localStorage.setItem(getLocalStorageKey(), '');
  },
});

export default [filtersLocalStorage.middleware];
