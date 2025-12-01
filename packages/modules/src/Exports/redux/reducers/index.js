// @flow

import { combineReducers } from 'redux';
import { globalApi } from '@kitman/common/src/redux/global/services/globalApi';

export default combineReducers({
  globalApi: globalApi.reducer,
});
