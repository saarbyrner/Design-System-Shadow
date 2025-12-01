// @flow
import { configureStore } from '@reduxjs/toolkit';
import { isDevEnvironment } from '@kitman/common/src/utils';
import rootReducer from './reducers';

import { additionalUsersAPI } from './services';

export default configureStore({
  reducer: rootReducer,
  devTools: isDevEnvironment(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([additionalUsersAPI.middleware]),
});
