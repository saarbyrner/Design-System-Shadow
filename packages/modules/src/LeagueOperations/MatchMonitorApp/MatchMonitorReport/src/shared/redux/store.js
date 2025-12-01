// @flow
import { configureStore } from '@reduxjs/toolkit';
import { isDevEnvironment } from '@kitman/common/src/utils';
import rootReducer from './reducers';

export default configureStore({
  reducer: rootReducer,
  devTools: isDevEnvironment(),
});
