/* eslint-disable flowtype/require-valid-file-annotation */
import { configureStore } from '@reduxjs/toolkit';
import thunkMiddleware from 'redux-thunk';

import { isDevEnvironment } from '@kitman/common/src/utils';
import { medicalApi } from '@kitman/modules/src/Medical/shared/redux/services/medical';
import rootReducer from '@kitman/modules/src/Medical/medicalFlags/src/redux/reducers';

const initialStore = {
  toasts: [],
  medicalHistory: {},
};

export default configureStore({
  reducer: rootReducer,
  preloadedState: initialStore,
  devTools: isDevEnvironment(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([thunkMiddleware, medicalApi.middleware]),
});
