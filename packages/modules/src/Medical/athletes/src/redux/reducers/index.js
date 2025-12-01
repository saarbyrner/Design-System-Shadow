// @flow

import { combineReducers } from 'redux';
import { globalApi } from '@kitman/common/src/redux/global/services/globalApi';
import documentSplitter from '@kitman/components/src/DocumentSplitter/src/shared/redux/reducers';
import { formAnswerSetsApi } from '@kitman/services/src/services/formAnswerSets';
import { medicalApi } from '@kitman/modules/src/Medical/shared/redux/services/medical';
import { medicalSharedApi } from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import addDiagnosticSidePanel from '@kitman/modules/src/Medical/shared/redux/reducers/addDiagnosticSidePanel';
import addDiagnosticAttachmentSidePanel from '@kitman/modules/src/Medical/shared/redux/reducers/addDiagnosticAttachmentSidePanel';
import addDiagnosticLinkSidePanel from '@kitman/modules/src/Medical/shared/redux/reducers/addDiagnosticLinkSidePanel';
import addIssuePanel from '@kitman/modules/src/Medical/rosters/src/redux/reducers/addIssuePanel';
import addMedicalNotePanel from '@kitman/modules/src/Medical/shared/redux/reducers/addMedicalNotePanel';
import addModificationSidePanel from '@kitman/modules/src/Medical/shared/redux/reducers/addModificationSidePanel';
import addTreatmentsSidePanel from '@kitman/modules/src/Medical/shared/redux/reducers/addTreatmentsSidePanel';
import addMedicalAlertSidePanel from '@kitman/modules/src/Medical/shared/redux/reducers/addMedicalAlertSidePanel';
import addMedicationSidePanel from '@kitman/modules/src/Medical/shared/redux/reducers/addMedicationSidePanel';
import addProcedureSidePanel from '@kitman/modules/src/Medical/shared/redux/reducers/addProcedureSidePanel';
import addProcedureAttachmentSidePanel from '@kitman/modules/src/Medical/shared/redux/reducers/addProcedureAttachmentSidePanel';
import addAllergySidePanel from '@kitman/modules/src/Medical/shared/redux/reducers/addAllergySidePanel';
import addVaccinationSidePanel from '@kitman/modules/src/Medical/shared/redux/reducers/addVaccinationSidePanel';
import addConcussionTestResultsSidePanel from '@kitman/modules/src/Medical/shared/redux/reducers/addConcussionTestResultsSidePanel';
import addTUESidePanel from '@kitman/modules/src/Medical/shared/redux/reducers/addTUESidePanel';
import selectAthletesSidePanel from '@kitman/modules/src/Medical/shared/redux/reducers/selectAthletesSidePanel';
import treatmentCardList from '@kitman/modules/src/Medical/shared/redux/reducers/treatmentCardList';
import toasts from '@kitman/modules/src/Medical/shared/redux/reducers/toasts';
import medicalHistory from '@kitman/modules/src/Medical/shared/redux/reducers/medicalHistory';

export default combineReducers({
  addDiagnosticSidePanel,
  addDiagnosticAttachmentSidePanel,
  addDiagnosticLinkSidePanel,
  addIssuePanel,
  addMedicalNotePanel,
  addModificationSidePanel,
  addTreatmentsSidePanel,
  addAllergySidePanel,
  addMedicalAlertSidePanel,
  addMedicationSidePanel,
  addProcedureSidePanel,
  addProcedureAttachmentSidePanel,
  addVaccinationSidePanel,
  addConcussionTestResultsSidePanel,
  addTUESidePanel,
  ...documentSplitter,
  selectAthletesSidePanel,
  treatmentCardList,
  toasts,
  globalApi: globalApi.reducer,
  medicalApi: medicalApi.reducer,
  medicalSharedApi: medicalSharedApi.reducer,
  medicalHistory,
  formAnswerSetsApi: formAnswerSetsApi.reducer,
});
