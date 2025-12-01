// @flow
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { isDevEnvironment } from '@kitman/common/src/utils';

import global from '@kitman/common/src/redux/global/reducers';
import globalMiddleware from '@kitman/common/src/redux/global/middleware';

// modules
import planningEvent from '@kitman/modules/src/PlanningEvent/src/redux/reducers';

import massUpload from '@kitman/modules/src/shared/MassUpload/redux/reducer';

import scouts from '@kitman/modules/src/Scouts/shared/redux/reducers';
import scoutsMiddleware from '@kitman/modules/src/Scouts/shared/redux/middlewares';

import athleteManagement from '@kitman/modules/src/AthleteManagement/shared/redux/reducers';
import athleteManagementMiddleware from '@kitman/modules/src/AthleteManagement/shared/redux/middlewares';

import userMovement from '@kitman/modules/src/UserMovement/shared/redux/reducers';
import userMovementMiddleware from '@kitman/modules/src/UserMovement/shared/redux/middlewares';

import leagueOperations from '@kitman/modules/src/LeagueOperations/shared/redux/reducers';
import leagueOperationsMiddleware from '@kitman/modules/src/LeagueOperations/shared/redux/middlewares';

import LeagueFixtures from '@kitman/modules/src/LeagueFixtures/src/redux/reducers';

import type { Store as TemplateDashboardStore } from '@kitman/modules/src/analysis/TemplateDashboards/redux/types';
import templateDashboards from '@kitman/modules/src/analysis/TemplateDashboards/redux/reducer';
import templateDashboardsMiddleware from '@kitman/modules/src/analysis/TemplateDashboards/redux/middleware';

import benchmarkReport from '@kitman/modules/src/analysis/BenchmarkReport/redux/reducer';
import benchmarkReportMiddleware from '@kitman/modules/src/analysis/BenchmarkReport/redux/middleware';

import humanInput from '@kitman/modules/src/HumanInput/shared/redux/reducers';
import staffProfile from '@kitman/modules/src/StaffProfile/shared/redux/reducers';
import emergencyContacts from '@kitman/modules/src/EmergencyContacts/src/redux/reducers';
import permissions from '@kitman/services/src/services/permissions/redux/reducers';
import genericExports from '@kitman/services/src/services/exports/generic/redux/reducers';
import genericDocuments from '@kitman/services/src/services/documents/generic/redux/reducers';
import formTemplates from '@kitman/modules/src/FormTemplates/redux/reducers';
import formAnswerSets from '@kitman/modules/src/FormAnswerSets/redux/reducers';

import conditionalFields from '@kitman/modules/src/ConditionalFields/shared/redux/reducers';
import medicalDocument from '@kitman/modules/src/Medical/document/src/redux/documentSlice';
import playerSelect from '@kitman/modules/src/PlayerSelectSidePanel/redux/reducers';
import eventSwitcher from '@kitman/modules/src/EventSwitcherSidePanel/redux/reducers';
import imports from '@kitman/modules/src/Imports/redux/reducers';
import benchmarkTestValidation from '@kitman/modules/src/Benchmarking/shared/redux/benchmarkTestValidationSlice';
import electronicFiles from '@kitman/modules/src/ElectronicFiles/shared/redux/reducers';
import kitMatrixReducers from '@kitman/modules/src/KitMatrix/src/redux/reducers';
import kitMatrixMiddlewares from '@kitman/modules/src/KitMatrix/src/redux/middlewares';
import contactsReducers from '@kitman/modules/src/Contacts/src/redux/reducers';
import contactsMiddlewares from '@kitman/modules/src/Contacts/src/redux/middlewares';

import emailLogReducers from '@kitman/modules/src/EmailLog/src/redux/reducers';
import emailLogMiddleware from '@kitman/modules/src/EmailLog/src/redux/middlewares';

import lookerDashboardGroupMiddleware from '@kitman/modules/src/analysis/LookerDashboardGroup/redux/middleware';
import lookerDashboardGroup from '@kitman/modules/src/analysis/LookerDashboardGroup/redux/reducer';

// services
import { developmentGoalsApi } from '@kitman/modules/src/AthleteReviews/src/shared/redux/developmentGoals';
import { medicalSharedApi } from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import { importsApi } from '@kitman/modules/src/Imports/services/imports';
import { squadManagementApi } from '@kitman/modules/src/SquadManagement/src/shared/services/squadManagement';
import { humanInputApi } from '@kitman/services/src/services/humanInput/humanInput';
import { formTemplatesApi } from '@kitman/services/src/services/formTemplates';
import { formAnswerSetsApi } from '@kitman/services/src/services/formAnswerSets';
import { staffProfileApi } from '@kitman/modules/src/StaffProfile/shared/redux/services';
import { permissionsDetailsApi } from '@kitman/services/src/services/permissions';
import toastsSlice from '@kitman/modules/src/Toasts/toastsSlice';
import planningEventRtk from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/index';
import { playerSelectApi } from '@kitman/modules/src/PlayerSelectSidePanel/services/api/playerSelectApi';
import { eventSwitchApi } from '@kitman/modules/src/EventSwitcherSidePanel/services/api/eventSwitchApi';
import { benchmarkTestValidationApi } from '@kitman/modules/src/Benchmarking/shared/redux/benchmarkTestValidationApi';
import { emergencyContactsApi } from '@kitman/modules/src/EmergencyContacts/src/redux/services/emergencyContactsApi';
import labels from '@kitman/modules/src/OrganisationSettings/src/components/DynamicCohorts/ManageLabels/redux/reducers';
import segments from '@kitman/modules/src/DynamicCohorts/shared/reducers';
import { electronicFilesApi } from '@kitman/modules/src/ElectronicFiles/shared/services/electronicFiles';
import { labelsApi } from '@kitman/modules/src/OrganisationSettings/src/components/DynamicCohorts/ManageLabels/redux/services/labelsApi';
import { genericExportsApi } from '@kitman/services/src/services/exports/generic';
import { genericDocumentsApi } from '@kitman/services/src/services/documents/generic';
import { massUploadApi } from '@kitman/modules/src/shared/MassUpload/redux/massUploadApi';

import matchMonitors from '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/redux/reducers';
import { matchMonitorReportAPI } from '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/redux/services';
import messaging from '@kitman/modules/src/Messaging/src/redux/reducers/messaging';
import { messagingApi } from '@kitman/modules/src/Messaging/src/redux/services/messaging';
import { conditionalFieldsApi } from '../ConditionalFields/shared/services/conditionalFields';
import officials from '../Officials/shared/redux/reducers/index';
import { officialAPI } from '../Officials/shared/redux/services';
import additionalUsers from '../AdditionalUsers/shared/redux/reducers';
import { additionalUsersAPI } from '../AdditionalUsers/shared/redux/services';
import { segmentsApi } from '../DynamicCohorts/Segments/CreateEditSegment/redux/services/segmentsApi';

export type GlobalStore = {
  ...TemplateDashboardStore,
};

const reducers = {
  medicalDocument: medicalDocument.reducer,
  ...planningEventRtk.reducers,
  ...athleteManagement,
  ...benchmarkReport,
  benchmarkTestValidation: benchmarkTestValidation.reducer,
  benchmarkTestValidationApi: benchmarkTestValidationApi.reducer,
  ...conditionalFields,
  developmentGoalsApi: developmentGoalsApi.reducer,
  ...electronicFiles,
  ...emergencyContacts,
  ...eventSwitcher,
  formTemplatesApi: formTemplatesApi.reducer,
  ...formTemplates,
  formAnswerSetsApi: formAnswerSetsApi.reducer,
  ...formAnswerSets,
  ...global,
  ...humanInput,
  humanInputApi: humanInputApi.reducer,
  ...imports,
  importsApi: importsApi.reducer,
  ...labels,
  labelsApi: labelsApi.reducer,
  ...massUpload,
  medicalSharedApi: medicalSharedApi.reducer,
  officialAPI: officialAPI.reducer,
  ...officials,
  additionalUsersAPI: additionalUsersAPI.reducer,
  ...additionalUsers,
  planningEvent,
  ...playerSelect,
  ...scouts,
  ...segments,
  squadManagementApi: squadManagementApi.reducer,
  ...templateDashboards,
  toastsSlice: toastsSlice.reducer,
  ...userMovement,
  ...leagueOperations,
  ...LeagueFixtures,
  ...staffProfile,
  staffProfileApi: staffProfileApi.reducer,
  ...permissions,
  permissionsDetailsApi: permissionsDetailsApi.reducer,
  ...genericExports,
  genericExportsApi: genericExportsApi.reducer,
  ...genericDocuments,
  genericDocumentsApi: genericDocumentsApi.reducer,
  ...kitMatrixReducers,
  ...contactsReducers,
  ...emailLogReducers,
  matchMonitorReportAPI: matchMonitorReportAPI.reducer,
  ...matchMonitors,
  ...messaging,
  ...lookerDashboardGroup,
};

export const setupStore = (preloadedState: Object) =>
  // For readability in the Redux console, please try and keep this sorted alphabetically
  configureStore({
    devTools: isDevEnvironment(),
    reducer: combineReducers(reducers),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        ...athleteManagementMiddleware,
        ...benchmarkReportMiddleware,
        benchmarkTestValidationApi.middleware,
        conditionalFieldsApi.middleware,
        ...contactsMiddlewares,
        ...emailLogMiddleware,
        developmentGoalsApi.middleware,
        electronicFilesApi.middleware,
        emergencyContactsApi.middleware,
        eventSwitchApi.middleware,
        formTemplatesApi.middleware,
        formAnswerSetsApi.middleware,
        ...globalMiddleware,
        humanInputApi.middleware,
        importsApi.middleware,
        ...kitMatrixMiddlewares,
        labelsApi.middleware,
        massUploadApi.middleware,
        medicalSharedApi.middleware,
        additionalUsersAPI.middleware,
        officialAPI.middleware,
        playerSelectApi.middleware,
        ...planningEventRtk.middlewares,
        ...scoutsMiddleware,
        segmentsApi.middleware,
        squadManagementApi.middleware,
        ...templateDashboardsMiddleware,
        ...userMovementMiddleware,
        ...leagueOperationsMiddleware,
        staffProfileApi.middleware,
        permissionsDetailsApi.middleware,
        genericExportsApi.middleware,
        genericDocumentsApi.middleware,
        matchMonitorReportAPI.middleware,
        messagingApi.middleware,
        ...lookerDashboardGroupMiddleware
      ),
    preloadedState,
  });
