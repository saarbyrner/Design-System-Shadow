// @flow
import { configureStore } from '@reduxjs/toolkit';
import { isDevEnvironment } from '@kitman/common/src/utils';
import rootReducer from '@kitman/modules/src/ElectronicFiles/shared/redux/reducers';
import { electronicFilesApi } from '@kitman/modules/src/ElectronicFiles/shared/services/electronicFiles';

export default configureStore({
  reducer: rootReducer,
  devTools: isDevEnvironment(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(electronicFilesApi.middleware),
});
