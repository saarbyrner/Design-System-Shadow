// @flow
import { configureStore } from '@reduxjs/toolkit';

import { isDevEnvironment } from '@kitman/common/src/utils';
import { calendarFiltersApi } from './services/filters';
import rootReducer from './reducer';
import type { Store } from './types';

export const setupStore = ({ preloadedStore }: { preloadedStore?: Store }) =>
  configureStore({
    reducer: rootReducer,
    devTools: isDevEnvironment(),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat([calendarFiltersApi.middleware]),
    ...(preloadedStore ? { preloadedState: preloadedStore } : {}),
  });
