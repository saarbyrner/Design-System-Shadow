// @flow

import { combineReducers } from 'redux';
import { globalApi } from '@kitman/common/src/redux/global/services/globalApi';
import { medicalApi } from '@kitman/modules/src/Medical/shared/redux/services/medical';
import { medicalSharedApi } from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import addDiagnosticSidePanel from '@kitman/modules/src/Medical/shared/redux/reducers/addDiagnosticSidePanel';
import addMedicalNotePanel from '@kitman/modules/src/Medical/shared/redux/reducers/addMedicalNotePanel';
import addModificationSidePanel from '@kitman/modules/src/Medical/shared/redux/reducers/addModificationSidePanel';
import addTreatmentsSidePanel from '@kitman/modules/src/Medical/shared/redux/reducers/addTreatmentsSidePanel';
import addAllergySidePanel from '@kitman/modules/src/Medical/shared/redux/reducers/addAllergySidePanel';
import addMedicalAlertSidePanel from '@kitman/modules/src/Medical/shared/redux/reducers/addMedicalAlertSidePanel';
import addMedicationSidePanel from '@kitman/modules/src/Medical/shared/redux/reducers/addMedicationSidePanel';
import addProcedureSidePanel from '@kitman/modules/src/Medical/shared/redux/reducers/addProcedureSidePanel';
import addConcussionTestResultsSidePanel from '@kitman/modules/src/Medical/shared/redux/reducers/addConcussionTestResultsSidePanel';
import addConcussionAssessmentSidePanel from '@kitman/modules/src/Medical/shared/redux/reducers/addConcussionAssessmentSidePanel';
import addDiagnosticAttachmentSidePanel from '@kitman/modules/src/Medical/shared/redux/reducers/addDiagnosticAttachmentSidePanel';
import addDiagnosticLinkSidePanel from '@kitman/modules/src/Medical/shared/redux/reducers/addDiagnosticLinkSidePanel';
import addTUESidePanel from '@kitman/modules/src/Medical/shared/redux/reducers/addTUESidePanel';
import selectAthletesSidePanel from '@kitman/modules/src/Medical/shared/redux/reducers/selectAthletesSidePanel';
import treatmentCardList from '@kitman/modules/src/Medical/shared/redux/reducers/treatmentCardList';
import toasts from '@kitman/modules/src/Medical/shared/redux/reducers/toasts';
import addWorkersCompSidePanel from '@kitman/modules/src/Medical/shared/redux/reducers/addWorkersCompSidePanel';
import addOshaFormSidePanel from '@kitman/modules/src/Medical/shared/redux/reducers/addOshaFormSidePanel';
import medicalHistory from '@kitman/modules/src/Medical/shared/redux/reducers/medicalHistory';

export default combineReducers({
  addDiagnosticSidePanel,
  addDiagnosticAttachmentSidePanel,
  addDiagnosticLinkSidePanel,
  addMedicalNotePanel,
  addModificationSidePanel,
  addTreatmentsSidePanel,
  addAllergySidePanel,
  addMedicalAlertSidePanel,
  addMedicationSidePanel,
  addProcedureSidePanel,
  addConcussionTestResultsSidePanel,
  addConcussionAssessmentSidePanel,
  addTUESidePanel,
  selectAthletesSidePanel,
  treatmentCardList,
  toasts,
  globalApi: globalApi.reducer,
  medicalApi: medicalApi.reducer,
  addWorkersCompSidePanel,
  addOshaFormSidePanel,
  medicalSharedApi: medicalSharedApi.reducer,
  medicalHistory,
});
