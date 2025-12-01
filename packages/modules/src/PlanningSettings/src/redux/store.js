/* eslint-disable flowtype/require-valid-file-annotation */

import { configureStore } from '@reduxjs/toolkit';
import { isDevEnvironment } from '@kitman/common/src/utils';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './reducers';

const initialStore = {
  app: {
    assessmentTemplates: [],
    requestStatus: 'LOADING',
  },
  sessionAssessments: {
    data: [],
    editedSessionAssessments: {},
    requestStatus: 'LOADING',
  },
  gameTemplates: {
    assessmentTemplates: [],
    editedGameTemplates: null,
    requestStatus: 'LOADING',
  },
};

export default configureStore({
  reducer: rootReducer,
  preloadedState: initialStore,
  devTools: isDevEnvironment(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([thunkMiddleware]),
});
