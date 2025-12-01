// @flow
import { configureStore } from '@reduxjs/toolkit';

import { isDevEnvironment } from '@kitman/common/src/utils';
import rootReducer from '@kitman/components/src/DocumentSplitter/src/shared/redux/reducers';

export default configureStore({
  reducer: rootReducer,
  devTools: isDevEnvironment(),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});
