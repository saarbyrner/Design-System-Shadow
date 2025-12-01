// @flow
import { configureStore } from '@reduxjs/toolkit';
import { isDevEnvironment } from '@kitman/common/src/utils';
import rootReducer from './reducers';

import { importsApi } from '../services/imports';

export default configureStore({
  reducer: rootReducer,
  devTools: isDevEnvironment(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([importsApi.middleware]),
});
