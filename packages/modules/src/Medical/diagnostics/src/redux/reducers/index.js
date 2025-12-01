// @flow

import { combineReducers } from 'redux';
import { globalApi } from '@kitman/common/src/redux/global/services/globalApi';
import { medicalApi } from '@kitman/modules/src/Medical/shared/redux/services/medical';
import { medicalSharedApi } from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import addDiagnosticSidePanel from '@kitman/modules/src/Medical/shared/redux/reducers/addDiagnosticSidePanel';
import addDiagnosticAttachmentSidePanel from '@kitman/modules/src/Medical/shared/redux/reducers/addDiagnosticAttachmentSidePanel';
import addDiagnosticLinkSidePanel from '@kitman/modules/src/Medical/shared/redux/reducers/addDiagnosticLinkSidePanel';
import addMedicalNotePanel from '@kitman/modules/src/Medical/shared/redux/reducers/addMedicalNotePanel';
import toasts from '@kitman/modules/src/Medical/shared/redux/reducers/toasts';
import medicalHistory from '@kitman/modules/src/Medical/shared/redux/reducers/medicalHistory';

export default combineReducers({
  addDiagnosticSidePanel,
  addDiagnosticAttachmentSidePanel,
  addDiagnosticLinkSidePanel,
  addMedicalNotePanel,
  toasts,
  globalApi: globalApi.reducer,
  medicalApi: medicalApi.reducer,
  medicalSharedApi: medicalSharedApi.reducer,
  medicalHistory,
});
