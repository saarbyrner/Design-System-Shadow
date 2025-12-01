// @flow

import { combineReducers } from 'redux';
import { globalApi } from '@kitman/common/src/redux/global/services/globalApi';
import documentSplitter from '@kitman/components/src/DocumentSplitter/src/shared/redux/reducers';
import { formAnswerSetsApi } from '@kitman/services/src/services/formAnswerSets';
import { conditionalFieldsApi } from '@kitman/modules/src/ConditionalFields/shared/services/conditionalFields';
import userReducer from '@kitman/modules/src/UserMovement/shared/redux/reducers';
import toastsSlice from '@kitman/modules/src/Toasts/toastsSlice';
import addDiagnosticSidePanel from '../../../../shared/redux/reducers/addDiagnosticSidePanel';
import addDiagnosticAttachmentSidePanel from '../../../../shared/redux/reducers/addDiagnosticAttachmentSidePanel';
import addDiagnosticLinkSidePanel from '../../../../shared/redux/reducers/addDiagnosticLinkSidePanel';
import addIssuePanel from './addIssuePanel';
import addMedicalNotePanel from '../../../../shared/redux/reducers/addMedicalNotePanel';
import addModificationSidePanel from '../../../../shared/redux/reducers/addModificationSidePanel';
import addTreatmentsSidePanel from '../../../../shared/redux/reducers/addTreatmentsSidePanel';
import addAllergySidePanel from '../../../../shared/redux/reducers/addAllergySidePanel';
import addMedicalAlertSidePanel from '../../../../shared/redux/reducers/addMedicalAlertSidePanel';
import addProcedureSidePanel from '../../../../shared/redux/reducers/addProcedureSidePanel';
import addVaccinationSidePanel from '../../../../shared/redux/reducers/addVaccinationSidePanel';
import addConcussionTestResultsSidePanel from '../../../../shared/redux/reducers/addConcussionTestResultsSidePanel';
import addTUESidePanel from '../../../../shared/redux/reducers/addTUESidePanel';
import selectAthletesSidePanel from '../../../../shared/redux/reducers/selectAthletesSidePanel';
import treatmentCardList from '../../../../shared/redux/reducers/treatmentCardList';
import toasts from '../../../../shared/redux/reducers/toasts';
import app from './app';
import filters from './filters';
import grid from './grid';
import commentsGrid from './comment';
import commentsFilters from './CommentsFilters';
import { medicalApi } from '../../../../shared/redux/services/medical';
import { medicalSharedApi } from '../../../../shared/redux/services/medicalShared';
import medicalHistory from '../../../../shared/redux/reducers/medicalHistory';

export default combineReducers({
  ...userReducer,
  addDiagnosticSidePanel,
  addDiagnosticAttachmentSidePanel,
  addDiagnosticLinkSidePanel,
  addIssuePanel,
  addMedicalNotePanel,
  addModificationSidePanel,
  addTreatmentsSidePanel,
  addAllergySidePanel,
  addMedicalAlertSidePanel,
  addProcedureSidePanel,
  addVaccinationSidePanel,
  addConcussionTestResultsSidePanel,
  addTUESidePanel,
  ...documentSplitter,
  selectAthletesSidePanel,
  treatmentCardList,
  app,
  filters,
  grid,
  commentsGrid,
  commentsFilters,
  toasts, // These are the legacy toasts added with dispatch addToast
  medicalToasts: toastsSlice.reducer, // These are the toasts added via newer toastsSlice, dispatch add
  globalApi: globalApi.reducer,
  medicalApi: medicalApi.reducer,
  medicalSharedApi: medicalSharedApi.reducer,
  medicalHistory,
  conditionalFieldsApi: conditionalFieldsApi.reducer,
  formAnswerSetsApi: formAnswerSetsApi.reducer,
});
