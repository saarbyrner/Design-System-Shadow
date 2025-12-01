// @flow
import { configureStore } from '@reduxjs/toolkit';
import { isDevEnvironment } from '@kitman/common/src/utils';
import rootReducer from './reducers';

import { officialAPI } from './services';

export default configureStore({
  reducer: rootReducer,
  devTools: isDevEnvironment(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([officialAPI.middleware]),
});
