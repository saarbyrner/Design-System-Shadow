// @flow
import { configureStore } from '@reduxjs/toolkit';
import type { Store } from './types';

import rootReducer from './reducer';

export const setupStore = ({ preloadedStore }: { preloadedStore?: Store }) =>
  configureStore({
    reducer: rootReducer,
    devTools: true,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    ...(preloadedStore ? { preloadedState: preloadedStore } : {}),
  });
