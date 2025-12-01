// @flow
import { combineReducers } from 'redux';

import { medicalApi } from '@kitman/modules/src/Medical/shared/redux/services/medical';
import toasts from '@kitman/modules/src/Medical/shared/redux/reducers/toasts';
import medicalHistory from '@kitman/modules/src/Medical/shared/redux/reducers/medicalHistory';

export default combineReducers({
  toasts,
  medicalApi: medicalApi.reducer,
  medicalHistory,
});
