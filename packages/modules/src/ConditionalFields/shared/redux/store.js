// @flow
import { configureStore } from '@reduxjs/toolkit';
import { isDevEnvironment } from '@kitman/common/src/utils';
import rootReducer from './reducers';

import { conditionalFieldsApi } from '../services/conditionalFields';

export default configureStore({
  reducer: rootReducer,
  devTools: isDevEnvironment(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([conditionalFieldsApi.middleware]),
});
