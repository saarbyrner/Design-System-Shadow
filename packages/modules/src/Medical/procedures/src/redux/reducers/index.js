// @flow

import { combineReducers } from 'redux';

import { globalApi } from '@kitman/common/src/redux/global/services/globalApi';
import { medicalApi } from '@kitman/modules/src/Medical/shared/redux/services/medical';
import { medicalSharedApi } from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import addProcedureSidePanel from '@kitman/modules/src/Medical/shared/redux/reducers/addProcedureSidePanel';
import addProcedureAttachmentSidePanel from '@kitman/modules/src/Medical/shared/redux/reducers/addProcedureAttachmentSidePanel';
import addMedicalNotePanel from '@kitman/modules/src/Medical/shared/redux/reducers/addMedicalNotePanel';
import toasts from '@kitman/modules/src/Medical/shared/redux/reducers/toasts';
import medicalHistory from '@kitman/modules/src/Medical/shared/redux/reducers/medicalHistory';

export default combineReducers({
  toasts,
  addProcedureSidePanel,
  addProcedureAttachmentSidePanel,
  addMedicalNotePanel,
  globalApi: globalApi.reducer,
  medicalApi: medicalApi.reducer,
  medicalSharedApi: medicalSharedApi.reducer,
  medicalHistory,
});
