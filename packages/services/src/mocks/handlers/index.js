// @flow
import archiveMedicalNoteHandler from '@kitman/services/src/mocks/handlers/medical/archiveMedicalNote';
import athleteManagementHandlers from '@kitman/modules/src/AthleteManagement/shared/redux/services/mocks/handlers';
import athleteReviewsHandlers from '@kitman/modules/src/AthleteReviews/src/shared/services/mocks/handlers/handlers';
import conditionalFieldsHandlers from '@kitman/modules/src/ConditionalFields/shared/services/mocks/handlers/handlers';
import electronicFilesHandlers from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/handlers/handlers';
import humanInputHandlers from '@kitman/services/src/services/humanInput/api/mocks/handlers/handlers';
import formAnswerSetsHandlers from '@kitman/services/src/services/formAnswerSets/api/mocks/handlers/handlers';
import formTemplatesHandlers from '@kitman/services/src/services/formTemplates/api/mocks/handlers/handlers';
import importHandlers from '@kitman/modules/src/Imports/services/mocks/handlers/handlers';
import matchMonitorReportHandlers from '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/redux/services/mocks/handlers/handlers';
import manageAdditionalUsersHandlers from '@kitman/modules/src/AdditionalUsers/shared/redux/services/mocks/handlers/handlers';
import manageOfficialHandlers from '@kitman//modules/src/Officials/shared/redux/services/mocks/handlers/handlers';
import manageScoutHandlers from '@kitman/modules/src/Scouts/shared/redux/services/mocks/handlers/handlers';
import planningHubHandlers from '@kitman/modules/src/PlanningHub/src/services/mocks/handlers/handlers';
import leagueOperationsHandlers from '@kitman/modules/src/LeagueOperations/shared/services/mocks/handlers/handlers';
import squadManagementHandlers from '@kitman/modules/src/SquadManagement/src/shared/services/mocks/handlers/handlers';
import userMovementHandlers from '@kitman/modules/src/UserMovement/shared/redux/services/mocks/handlers/handlers';
import staffProfileHandlers from '@kitman/modules/src/StaffProfile/shared/redux/services/mocks/handlers/handlers';
import updateFormationPositionViewsHandler from '@kitman/services/src/services/planning/updateFormationPositionViews/handler';
import updateAthleteAttributesHandler from '@kitman/services/src/services/athlete/updateAthleteAttributes/handler';
import formationsHandler from '@kitman/modules/src/PlanningEvent/src/services/formations/handler';
import gameActivitiesHandler from '@kitman/modules/src/PlanningEvent/src/services/gameActivities/handler';
import updateEventPeriodsHandler from '@kitman/modules/src/PlanningEvent/src/services/updateEventPeriods/handler';
import permissionsHandler from '@kitman/services/src/services/permissions/redux/services/mocks/handlers/handlers';
import genericExportsHandler from '@kitman/services/src/services/exports/generic/redux/services/mocks/handlers/handlers';
import genericDocumentsHandler from '@kitman/services/src/services/documents/generic/redux/services/mocks/handlers/handlers';
import { handler as getTurnarounds } from '@kitman/services/src/mocks/handlers/planning/getTurnarounds';
import createKitMatrixHandler from '@kitman/services/src/services/kitMatrix/createKitMatrix/handler';
import updateKitMatrixHandler from '@kitman/services/src/services/kitMatrix/updateKitMatrix/handler';
import searchKitMatricesHandler from '@kitman/services/src/services/kitMatrix/searchKitMatrices/handler';
import getKitMatrixColorsHandler from '@kitman/services/src/services/kitMatrix/getKitMatrixColors/handler';
import getLeagueSeasonsHandler from '@kitman/services/src/services/kitMatrix/getLeagueSeasons/handler';
import sendMatchNoticeEmailHandler from '@kitman/services/src/services/notifications/sendMatchNoticeEmail/handler';
import getEmailRecipients from '@kitman/services/src/services/notifications/getEmailRecipients/handler';
import getParticipants from '@kitman/services/src/services/notifications/getParticipants/handler';
import searchEmailLogs from '@kitman/services/src/services/notifications/searchEmails/handler';
import { handler as massUploadHandler } from '@kitman/modules/src/shared/MassUpload/services/mocks/handlers/massUpload';
import deleteMassUploadHandler from '@kitman/modules/src/shared/MassUpload/services/mocks/handlers/deleteMassUpload';
import { handler as getSourceFormDataHandler } from '@kitman/modules/src/shared/MassUpload/services/mocks/handlers/getSourceFormData';
import { handler as getIntegrationDataHandler } from '@kitman/modules/src/shared/MassUpload/services/mocks/handlers/getIntegrationData';
import { handler as getThirdPartyImports } from '@kitman/modules/src/shared/MassUpload/services/mocks/handlers/getThirdPartyImports';
import { handlers as scanningHandlers } from '@kitman/services/src/mocks/handlers/medical/scanning/handlers';
import searchContactsHandler from '@kitman/services/src/services/contacts/searchContacts/handler';
import getContactRolesHandler from '@kitman/services/src/services/contacts/getContactRoles/handler';
import createContactHandler from '@kitman/services/src/services/contacts/createContact/handler';
import updateContactHandler from '@kitman/services/src/services/contacts/updateContact/handler';
import updateFormAnswersSetLinkedIssuesHandler from '@kitman/services/src/mocks/handlers/medical/forms/updateFormAnswersSetLinkedIssues';
import getGameOfficialsHandler from '@kitman/services/src/services/gameOfficials/getGameOfficials/handler';
import getGameKitMatricesHandler from '@kitman/services/src/services/kitMatrix/getGameKitMatrices/handler';
import updateGameInformationHandler from '@kitman/modules/src/PlanningHub/src/services/updateGameInformation/handler';
import setGameOfficialsHandler from '@kitman/services/src/services/gameOfficials/setGameOfficials/handler';
import getTvChannelsHandler from '@kitman/services/src/services/planning/tvChannels/getTvChannels/handler';
import getClubSquadsHandler from '@kitman/services/src/services/getClubSquads/handler';
import createLeagueFixtureHandler from '@kitman/services/src/services/planning/createLeagueFixture/handler';
import createMatchDayPdfHandler from '@kitman/services/src/services/planning/createMatchDayPdf/handler';
import { handler as getOfficialUsersHandler } from '@kitman/services/src/mocks/handlers/planning/getOfficialUsers';
import getEventGameContactsHandler from '@kitman/services/src/services/contacts/getEventGameContacts/handler';
import updateGamedayRolesHandler from '@kitman/services/src/services/contacts/updateGamedayRoles/handler';
import { handler as getDocumentNoteCategoriesHandler } from '@kitman/services/src/mocks/handlers/getDocumentNoteCategories';
import { handler as getNotificationTriggersHandler } from '@kitman/services/src/services/OrganisationSettings/Notifications/api/handlers/getNotificationTriggers';
import { handler as updateNotificationTriggersHandler } from '@kitman/services/src/services/OrganisationSettings/Notifications/api/handlers/updateNotificationTriggers';
import { handler as bulkUpdateNotificationTriggersHandler } from '@kitman/services/src/services/OrganisationSettings/Notifications/api/handlers/bulkUpdateNotificationTriggers';
import { handler as getExternalAccessUsers } from '@kitman/modules/src/LeagueFixtures/src/services/mocks/handlers/searchExternalAccessUsers';
import { handler as assignMatchMonitorHandler } from '@kitman/services/src/mocks/handlers/leaguefixtures/assignMatchMonitorsHandler';
import { handler as getInjuryTypesHandler } from '@kitman/services/src/mocks/handlers/medical/getInjuryTypes';
import { handler as getAthletesAvailabilitiesHandler } from '@kitman/services/src/mocks/handlers/medical/getAthletesAvailabilities';
import updateDiagnosticHandler from '@kitman/services/src/services/medical/updateDiagnostic/handler';
import { handler as getC3LogixAthleteSingleSignOnHandler } from './medical/getC3LogixAthleteSingleSignOn';
import { handler as getC3LogixSingleSignOnHandler } from './medical/getC3LogixSingleSignOn';
import { handler as addGroupsToRehabSessionExercise } from './rehab/addGroupsToRehabSessionExercise';
import { handler as archiveAllergyHandler } from './allergies/archiveAllergy';
import { handler as archiveAttachmentHandler } from './medical/entityAttachments/archiveAttachment';
import { handler as bulkUpdateNotesHandler } from './medical/bulkUpdateNotes';
import { handler as copyRehabSessionExercisesHandler } from './rehab/copyRehabSessionExercises';
import { handler as createAssessmentGroup } from './AssessmentGroups/createAssessmentGroup';
import { handler as createCustomDrug } from './medical/createCustomDrug';
import { handler as createIssueEventHandler } from './medical/createIssueEvent';
import { handler as createOfficialHandler } from './createOfficial';
import { handler as createRehabSessionHandler } from './rehab/createRehabSession';
import { handler as createRehabGroupHandler } from './rehab/createRehabGroup';
import { handler as deleteDocumentHandler } from './documents/deleteDocument';
import { handler as deleteExerciseHandler } from './rehab/deleteExercise';
import { handler as deleteFavoriteHandler } from './favoriting/deleteFavorite';
import { handler as deleteRehabSession } from './rehab/deleteSession';
import { handler as dispenseMedicationHandler } from './medical/dispenseMedication';
import { handler as editOfficialHandler } from './editOfficial';
import { handler as expireNoteBillingHandler } from './medical/expireNote';
import { handler as exportBulkAthleteMedicalData } from './medical/exportBulkAthleteMedicalData';
import { handler as exportCombinedAnkleSupport } from './medical/exportCombinedAnkleSupport';
import { handler as exportConcussionBaselineHandler } from './exports/exportConcussionBaselineAudit';
import { handler as exportDiagnosticBillingHandler } from './exports/exportDiagnosticBilling';
import { handler as exportDiagnosticsRecordsHandler } from './exports/exportDiagnosticsRecords';
import { handler as exportFormAnswerSets } from './medical/exportFormAnswerSets';
import { handler as exportHapAuthStatusHandler } from './exports/exportHapAuthStatus';
import { handler as exportHapCovidBranchHandler } from './exports/exportHapCovidBranch';
import { handler as exportInjuryDetailReportHandler } from './medical/exportInjuryDetailReport';
import { handler as exportInjuryMedicationReportHandler } from './exports/exportInjuryMedicationReport';
import { handler as exportMedicationsReportHandler } from './exports/exportMedicationsReport';
import { handler as exportMedicationRecordsHandler } from './exports/exportMedicationRecords';
import { handler as exportMultiDocument } from './exports/exportMultiDocument';
import { handler as exportNullDataReportHandler } from './exports/exportNullDataReport';
import { handler as exportOsha300ReportHandler } from './exports/exportOsha300Report';
import { handler as exportPlayerDetailReportHandler } from './medical/exportPlayerDetailReport';
import { handler as exportParticipantExposureHandler } from './exports/exportParticipantExposure';
import { handler as exportQualityReportsHandler } from './exports/exportQualityReports';
import { handler as exportInjurySurveillanceReportHandler } from './exports/exportInjurySurveillanceReport';
import { handler as exportTimeLossAllActivitiesReportHandler } from './exports/exportTimeLossAllActivitiesReport';
import { handler as exportTimeLossBodyPartReportHandler } from './exports/exportTimeLossBodyPartReport';
import { handler as exportTreatmentBillingHandler } from './exports/exportTreatmentBilling';
import { handler as exportStaffHandler } from './exports/exportStaff';
import { handlers as exportCardsHandler } from './exports/exportCards';

import { handler as fetchOfficialsHandler } from './fetchOfficials';
import { handler as fetchOrganisationPreferenceHandler } from './fetchOrganisationPreference';
import { handler as filterRehabSessionsHandler } from './rehab/filterRehabSessions';
import { handler as getActiveSquadHandler } from './getActiveSquad';
import { handler as getActivityGroupsHandler } from './medical/getActivityGroups';
import { handler as getActivityTypeCategories } from './getActivityTypeCategories';
import { handler as getActivityTypeCategoryEnabled } from './getActivityTypeCategoryEnabled';
import { handler as getAncillaryEligibleRanges } from './medical/getAncillaryEligibleRanges';
import { handler as getAdministrationAthleteDataHandler } from './getAdministrationAthleteData';
import { handler as getAllergyMedicationsDataHandler } from './medical/getAllergyMedicationsData';
import { handler as getAnnotationAuthorsHandler } from './getAnnotationAuthors';
import { handler as getAnnotationMedicalTypesHandler } from './medical/getAnnotationMedicalTypes';
import { handler as getArchiveMedicalNoteReasonsHandler } from './medical/getArchiveMedicalNoteReasons';
import { handler as getArchiveReasons } from './medical/getArchiveReasons';
import { handler as getAssessmentGroups } from './AssessmentGroups/getAssessmentGroups';
import { handler as getAssessmentTemplates } from './getAssessmentTemplates';
import { handler as getAthleteConcussionAssessmentResults } from './getAthleteConcussionAssessmentResults';
import { handler as getAthleteContinuationIssuesHandler } from './medical/getAthleteContinuationIssues';
import { handler as getAthleteDataHandler } from './getAthleteData';
import { handler as getAthleteIssueStatusesHandler } from './medical/getAthleteIssueStatuses';
import { handler as getAthleteMedicalAlertDataHandler } from './medical/getAthleteMedicalAlertData';
import { handler as getAthleteMedicalHistoryHandler } from './getAthleteMedicalHistory';
import { handler as getAthleteRosterHandler } from './medical/getAthleteRoster';
import { handler as getAthleteReviewTypes } from './getAthleteReviewTypes';
import { handler as getAthletesPoliciesHandler } from './getAthletesPolicies';
import { handler as getClubsHandler } from './getClubs';
import { handler as getCoachesReportHandler } from './medical/getCoachesReport';
import { handler as getCoachesReportV2Handler } from './medical/getCoachesReportV2';
import { handler as getCountries } from './general/getCountries';
import { handler as getLastCoachesReportNoteHandler } from './medical/getLastCoachesReportNote';
import { handler as getMultipleCoachesNotesHandler } from './medical/getMultipleCoachesNotes';
import { handler as getCoachingPrinciplesHandler } from './getCoachingPrinciples';
import { handler as getCodingSystemIdentifiers } from './medical/getCodingSystemIdentifiers';
import { handler as getCompetitionsHandler } from './getCompetitions';
import { handler as getConcussionFormAnswersSetsListHandler } from './medical/getConcussionFormAnswersSetsList';
import { handler as getConcussionFormTypesHandler } from './medical/getConcussionFormTypes';
import { handler as getConcussionInjuryResultsHandler } from './medical/getConcussionInjuryResults';
import { handler as getConditionalFieldsFormHandler } from './medical/getConditionalFieldsForm';
import { handler as getCurrentAllergy } from './medical/getCurrentAllergy';
import { handler as getCurrentMedicalAlert } from './medical/getCurrentMedicalAlert';
import { handler as getCurrentOrganisationHandler } from './getCurrentOrganisation';
import { handler as getCurrentSquad } from './getCurrentSquad';
import { handler as getCurrentUser } from './medical/getCurrentUser';
import { handler as getCurrentUserHandler } from './getCurrentUser';
import { handler as getDevelopmentGoalStandardNamesHandler } from './developmentGoalStandardNames/getDevelopmentGoalStandardNames';
import { handler as getDiagnosticResultTypesHandler } from './medical/getDiagnosticResultTypes';
import { handler as getDiagnosticsHandler } from './medical/getDiagnostics';
import { handler as getDiagnosticStatusesHandler } from './medical/getDiagnosticStatuses';
import { handler as getDisciplinaryReasonsHandler } from './leaguefixtures/getDisciplinaryReasonsHandler';
import { handler as getDivisionsHandler } from './getDivisions';
import { handler as resetMatchReportHandler } from './leaguefixtures/resetMatchReportHandler';
import { handler as saveMatchReportScoresHandler } from './leaguefixtures/saveMatchReportScoresHandler';
import { handler as createUserEventRequestHandler } from './leaguefixtures/createUserEventRequestHandler';
import { handler as getUserEventRequestsHandler } from './leaguefixtures/getUserEventRequestsHandler';
import { handler as deleteUserEventRequestHandler } from './leaguefixtures/deleteUserEventRequestHandler';
import { handler as updateUserEventRequestHandler } from './leaguefixtures/updateUserEventRequestHandler';
import { handler as getUserEventRequestRejectReasonsHandler } from './leaguefixtures/getUserEventRequestRejectReasonsHandler';
import { handler as getDocumentsHandler } from './documents/getDocuments';
import { handler as getDrFirstMedicationsHandler } from './medical/getDrFirstMedicationsData';
import { handler as getDrFirstPortalHandler } from './medical/getDrFirstPortal';
import { handler as getDrugLotsHandler } from './medical/stockManagement/getDrugLots';
import { handler as getDrugStocksHandler } from './medical/stockManagement/getDrugStocks';
import { handler as getEventConditionsHandler } from './getEventConditions';
import { handler as getEventsHandler } from './getEvents';
import { handler as getExercisesHandler } from './rehab/getExercises';
import { handler as getExercisesByIdHandler } from './rehab/getExercisesById';
import { handler as getExportsHandler } from './exports/getExportBilling';
import { handler as getFavoritesHandler } from './favoriting/getFavorites';
import { handler as getFieldsHandler } from './getFields';
import { handler as getFormDataSourceItems } from './getFormDataSourceItems';
import {
  handler as getFormResultsDataHandler,
  handlerConcussion as getConcussionFormResultsDataHandler,
} from './medical/getFormResults';
import {
  getBodyAreasMultiCodingV2Handler,
  getPathologiesMultiCodingV2Handler,
  getPathologiesByIdsHandler,
} from './medical/pathologies';
import { handler as getGameAndTrainingOptionsHandler } from './getGameAndTrainingOptions';
import { handler as getGradesHandler } from './medical/getGrades';
import { handler as getGroupsForPathologyHandler } from './medical/getGroupsForPathology';
import { handler as getInjuryMechanismsHandler } from './medical/getInjuryMechanisms';
import { handler as getInjuryReportHandler } from './medical/getInjuryReport';
import { handler as getIllnessHandler } from './medical/getIllness';
import { handler as getInjuryStatusesHandler } from './getInjuryStatuses';
import { handler as getInjuryTypes } from './medical/getInjuryTypes';
import { handler as getInternationalPhonePrefixes } from './getInternationalPhonePrefixes';
import { handler as getLastAuthoredNoteHandler } from './medical/getLastAuthoredNote';
import { handler as getMedicalAlertsHandler } from './medical/getMedicalAlerts';
import { handler as getMedicalAttachmentCategories } from './medical/entityAttachments/getMedicalAttachmentCategories';
import { handler as getMedicalAttachmentsEntityTypes } from './medical/entityAttachments/getMedicalAttachmentsEntityTypes';
import { handler as getMedicalAttachmentsFileTypes } from './medical/entityAttachments/getMedicalAttachmentsFileTypes';
import { handler as getMedicalDocument } from './medical/medicalDocument/getMedicalDocument';
import { handler as getMedicalDocuments } from './medical/medicalDocument/getMedicalDocuments';
import { handler as getMedicalIssuesHandler } from './medical/getMedicalIssues';
import { handler as getMedicalModificationsHandler } from './medical/getMedicalModifications';
import { handler as getMedicalNotesHandler } from './medical/getMedicalNotes';
import { handler as getMedicationFavorites } from './medical/getMedicationFavorites';
import { handler as getMedicationListSourcesHandler } from './medical/getMedicationListSources';
import { handler as getMedicationsProvidersHandler } from './medical/getMedicationProviders';
import { handler as getMedicationsHandler } from './medical/getMedications';
import { handler as getMedicationsReportHandler } from './medical/getMedicationsReport';
import { handler as getMetricVariablesHandler } from './getMetricVariables';
import { handler as getNonMedicalAllergies } from './medical/getNonMedicalAllergies';
import { handler as getNotifications } from './medical/getNotifications';
import { handler as getOpenIssuesForAthleteByDateHandler } from './medical/getOpenIssuesForAthleteByDate';
import { handler as getOrganisationHandler } from './getOrganisation';
import { handler as getOrganisationTeamsHandler } from './getOrganisationTeams';
import { handler as getOrganisationVariationsHandler } from './getOrganisationVariations';
import { handler as getParticipationLevels } from './getParticipationLevels';
import { handler as getPastAthletesHandler } from './medical/getPastAthletes';
import { handler as getPermissionsHandler } from './getPermissions';
import { handler as getPermittedSquadsHandler } from './getPermittedSquads';
import { handler as getPreferenceHandler } from './getPreferences';
import { handler as getPositionGroupsHandler } from './getPositionGroups';
import { handler as getProceduresFormDataHandler } from './medical/getProceduresFormData';
import { handler as getProcedureTypes } from './medical/getProcedureTypes';
import { handler as getRehabGroupsHandler } from './rehab/getRehabGroups';
import { handler as getRehabNotesHandler } from './rehab/getRehabNotes';
import { handler as getRehabReportHandler } from './medical/getRehabReport';
import { handler as getReportColumnsHandler } from './medical/getReportColumns';
import { handler as getSessionTypesHandler } from './getSessionTypes';
import { handler as getSidesHandler } from './medical/getSides';
import { handler as getSportsHandler } from './getSports';
import {
  handler as getSquadAthletesHandler,
  athleteListHandler as getSquadAthletesListHandler,
  byIdHandler as getSquadAthletesByIdHandler,
} from './getSquadAthletes';
import { handler as getSquadsHandler } from './getSquads';
import { handler as getStaffUsersHandler } from './medical/getStaffUsers';
import { handler as getStockMedicationsHandler } from './medical/getStockMedications';
import { handler as getSquadNamesHandler } from './getSquadNames';
import { handler as getTeamsHandler } from './getTeams';
import { handler as getTerminologiesHandler } from './getTerminologies';
import { handler as getPreliminarySchemaHandler } from './medical/getPreliminarySchema';
import { handler as getTreatmentsHandler } from './medical/getTreatments';
import { handler as getTryoutAthletesHandler } from './medical/getTryoutAthletes';
import { handler as getTSOEventsHandler } from './getTSOEvents';
import { handler as getVenueTypesHandler } from './getVenueTypes';
import { handler as getWorkloadTypesHandler } from './getWorkloadTypes';
import { handler as importMassAthletesHandler } from './imports/importMassAthletes';
import { handler as linkMaintenanceExerciseToSessionHandler } from './rehab/linkMaintenanceExerciseToSession';
import { handler as makeFavoriteHandler } from './favoriting/makeFavorite';
import { handler as resolveChronicIssue } from './medical/resolveChronicIssue';
import { handler as rosterReportsHandler } from './medical/rosterReports';
import { handler as saveAllergyMedicationHandler } from './medical/saveAllergyMedication';
import { handler as saveBulkMedicalNotesHandler } from './medical/saveBulkMedicalNotes';
import { handler as saveDiagnosticAttachmentHandler } from './medical/saveDiagnosticAttachment';
import { handler as saveDiagnosticHandler } from './medical/saveDiagnostic';
import { handler as saveDiagnosticLinkHandler } from './medical/saveDiagnosticLink';
import { handler as saveDrugStockHandler } from './medical/stockManagement/saveDrugStock';
import { handler as saveMedicalNoteHandler } from './medical/saveMedicalNote';
import { handler as saveMedicationEndDateHandler } from './medical/saveMedicationEndDate';
import { handler as saveMedicationFavorite } from './medical/saveMedicationFavorite';
import { handler as saveReconciledDiagnosticHandler } from './medical/saveReconciledDiagnostic';
import { handler as screenAllergyToDrug } from './medical/screenAllergyToDrug';
import { handler as screenDrugToDrug } from './medical/screenDrugToDrug';
import { handler as searchDispensableDrugsHandler } from './medical/stockManagement/searchDispensableDrugs';
import { handler as searchDrugsFavoritesHandler } from './medical/searchDrugsFavorites';
import { handler as searchDrugsHandler } from './medical/searchDrugs';
import { handler as searchMedicalEntityAttachments } from './medical/entityAttachments/searchMedicalEntityAttachments';
import { handler as translationHandler } from './translation';
import { handler as updateAthleteIssueType } from './medical/updateAthleteIssueType';
import { handler as updateAttachmentHandler } from './medical/entityAttachments/updateAttachment';
import { handler as updateExercise } from './rehab/updateExercise/updateExercise';
import { handler as updateMedicalAlert } from './medical/updateMedicalAlert';
import { handler as updateMedication } from './medical/updateMedication';
import { handler as uploadDocumentHandler } from './documents/uploadDocument';
import { handlers as getAthleteIssuesHandlers } from './medical/getAthleteIssues';
import { handlers as osicsHandlers } from './medical/osics';
import { handlers as playerLeftClubHandlers } from './medical/savePlayerHasLeftClub';
import { handlers as consentHandlers } from './consent';
import { handler as searchImportsList } from './searchImportsList';
import { handler as uploadAttachment } from './uploadAttachment';
import { handler as searchCoding } from './medical/searchCoding';
import { handler as searchPastAthletes } from './medical/searchPastAthletes';
import { handlers as medicationsHandlers } from './medical/medications';
import { handler as getTrainingVariablesHandler } from './getTrainingVariables';
import { handler as getPowerBiEmbedConfig } from './getPowerBiEmbedConfig';
import { handler as getInitialDataHandler } from './initialData';

import analysisHandlers from './analysis';
import { benchmarkingHandlers } from './benchmarking';
import deleteMedicationFavoriteHandler from './medical/deleteMedicationFavorite';
import exportDemographicReportHandler from './exports/exportDemographicReport';
import {
  getBodyAreaHandler,
  getClassificationHandler,
} from './medical/clinicalImpressions';
import {
  getDatalysBodyAreaHandler,
  getDatalysClassificationHandler,
} from './medical/datalys';
import organisationSettingsHandlers from './OrganisationSettings';
import planningEventHandlers from './planningEvent';
import planningHandlers from './planning';
import planningHub from './planningHub';
import removeGroupFromRehabSessionExercise from './rehab/removeGroupFromRehabSessionExercise';
import dynamicCohortsHandlers from './dynamicCohorts';
import { switchOrganisation } from './settings/organisation_switcher';
import { handler as getSettingsSquadAthletesHandler } from './settings/squads/get';

import { handler as fetchUserDataHandler } from './fetchUserData';
import { handlers as uploadsHandlers } from './uploads/handlers';

export default [
  ...analysisHandlers,
  ...athleteManagementHandlers,
  ...athleteReviewsHandlers,
  ...benchmarkingHandlers,
  ...conditionalFieldsHandlers,
  ...electronicFilesHandlers,
  ...getAthleteIssuesHandlers,
  ...humanInputHandlers,
  ...formAnswerSetsHandlers,
  ...formTemplatesHandlers,
  ...importHandlers,
  ...matchMonitorReportHandlers,
  ...manageAdditionalUsersHandlers,
  ...manageOfficialHandlers,
  ...manageScoutHandlers,
  ...planningHubHandlers,
  ...organisationSettingsHandlers,
  ...osicsHandlers,
  ...planningEventHandlers,
  ...planningHub,
  ...playerLeftClubHandlers,
  ...scanningHandlers,
  ...leagueOperationsHandlers,
  ...squadManagementHandlers,
  ...staffProfileHandlers,
  ...userMovementHandlers,
  ...permissionsHandler,
  ...dynamicCohortsHandlers,
  ...genericExportsHandler,
  ...genericDocumentsHandler,
  ...consentHandlers,
  ...medicationsHandlers,
  addGroupsToRehabSessionExercise,
  archiveAllergyHandler,
  archiveAttachmentHandler,
  archiveMedicalNoteHandler,
  assignMatchMonitorHandler,
  bulkUpdateNotesHandler,
  copyRehabSessionExercisesHandler,
  createOfficialHandler,
  createAssessmentGroup,
  createContactHandler,
  createCustomDrug,
  createIssueEventHandler,
  createLeagueFixtureHandler,
  createMatchDayPdfHandler,
  createRehabSessionHandler,
  createRehabGroupHandler,
  deleteDocumentHandler,
  deleteExerciseHandler,
  deleteFavoriteHandler,
  deleteRehabSession,
  deleteMedicationFavoriteHandler,
  dispenseMedicationHandler,
  editOfficialHandler,
  expireNoteBillingHandler,
  exportBulkAthleteMedicalData,
  exportCombinedAnkleSupport,
  exportConcussionBaselineHandler,
  exportDemographicReportHandler,
  exportDiagnosticBillingHandler,
  exportDiagnosticsRecordsHandler,
  exportFormAnswerSets,
  exportHapAuthStatusHandler,
  exportHapCovidBranchHandler,
  exportInjuryDetailReportHandler,
  exportInjuryMedicationReportHandler,
  exportMedicationsReportHandler,
  exportMedicationRecordsHandler,
  exportMultiDocument,
  exportNullDataReportHandler,
  exportOsha300ReportHandler,
  exportPlayerDetailReportHandler,
  exportParticipantExposureHandler,
  exportQualityReportsHandler,
  exportInjurySurveillanceReportHandler,
  exportTimeLossAllActivitiesReportHandler,
  exportTimeLossBodyPartReportHandler,
  exportTreatmentBillingHandler,
  exportStaffHandler,
  fetchOfficialsHandler,
  fetchOrganisationPreferenceHandler,
  filterRehabSessionsHandler,
  getActiveSquadHandler,
  getActivityGroupsHandler,
  getDocumentNoteCategoriesHandler,
  getNotificationTriggersHandler,
  updateNotificationTriggersHandler,
  bulkUpdateNotificationTriggersHandler,
  getActivityTypeCategories,
  getActivityTypeCategoryEnabled,
  getAncillaryEligibleRanges,
  getAdministrationAthleteDataHandler,
  getAllergyMedicationsDataHandler,
  getAnnotationAuthorsHandler,
  getAnnotationMedicalTypesHandler,
  getArchiveMedicalNoteReasonsHandler,
  getArchiveReasons,
  getAssessmentGroups,
  getAssessmentTemplates,
  getAthletesAvailabilitiesHandler,
  getAthleteConcussionAssessmentResults,
  getAthleteContinuationIssuesHandler,
  getAthleteDataHandler,
  getAthleteIssueStatusesHandler,
  getAthleteMedicalAlertDataHandler,
  getAthleteMedicalHistoryHandler,
  getAthleteRosterHandler,
  getAthleteReviewTypes,
  getAthletesPoliciesHandler,
  getBodyAreaHandler,
  getBodyAreasMultiCodingV2Handler,
  getClassificationHandler,
  getClubsHandler,
  getClubSquadsHandler,
  getCoachesReportHandler,
  getCoachesReportV2Handler,
  getCountries,
  getLastCoachesReportNoteHandler,
  getMultipleCoachesNotesHandler,
  getCoachingPrinciplesHandler,
  getCodingSystemIdentifiers,
  getCompetitionsHandler,
  getConcussionFormAnswersSetsListHandler,
  getConcussionFormResultsDataHandler,
  getConcussionFormTypesHandler,
  getConcussionInjuryResultsHandler,
  getConditionalFieldsFormHandler,
  getContactRolesHandler,
  getCurrentAllergy,
  getCurrentMedicalAlert,
  getCurrentOrganisationHandler,
  getCurrentSquad,
  getCurrentUser,
  getCurrentUserHandler,
  getDatalysBodyAreaHandler,
  getDatalysClassificationHandler,
  getDevelopmentGoalStandardNamesHandler,
  getDiagnosticResultTypesHandler,
  getDiagnosticsHandler,
  getDiagnosticStatusesHandler,
  getDisciplinaryReasonsHandler,
  getDivisionsHandler,
  getDocumentsHandler,
  getDrFirstMedicationsHandler,
  getDrFirstPortalHandler,
  getDrugLotsHandler,
  getDrugStocksHandler,
  getEventConditionsHandler,
  getEventGameContactsHandler,
  getEventsHandler,
  getExercisesHandler,
  getExercisesByIdHandler,
  getExportsHandler,
  getFavoritesHandler,
  getFieldsHandler,
  getFormDataSourceItems,
  getFormResultsDataHandler,
  getGameAndTrainingOptionsHandler,
  getGameOfficialsHandler,
  getGradesHandler,
  getGroupsForPathologyHandler,
  getInitialDataHandler,
  getInjuryMechanismsHandler,
  getIllnessHandler,
  getInjuryReportHandler,
  getInjuryStatusesHandler,
  getInjuryTypes,
  getInjuryTypesHandler,
  getC3LogixAthleteSingleSignOnHandler,
  getC3LogixSingleSignOnHandler,
  getInternationalPhonePrefixes,
  getGameKitMatricesHandler,
  getLastAuthoredNoteHandler,
  getMedicalAlertsHandler,
  getMedicalAttachmentCategories,
  getMedicalAttachmentsEntityTypes,
  getMedicalAttachmentsFileTypes,
  getMedicalDocument,
  getMedicalDocuments,
  getMedicalIssuesHandler,
  getMedicalModificationsHandler,
  getMedicalNotesHandler,
  getMedicationFavorites,
  getMedicationListSourcesHandler,
  getMedicationsProvidersHandler,
  getMedicationsHandler,
  getMedicationsReportHandler,
  saveBulkMedicalNotesHandler,
  saveMedicalNoteHandler,
  getMetricVariablesHandler,
  getNonMedicalAllergies,
  getNotifications,
  getOpenIssuesForAthleteByDateHandler,
  getOrganisationHandler,
  getOrganisationTeamsHandler,
  getOrganisationVariationsHandler,
  getParticipationLevels,
  getPastAthletesHandler,
  getPathologiesMultiCodingV2Handler,
  getPermissionsHandler,
  getPathologiesByIdsHandler,
  getPermittedSquadsHandler,
  getPreferenceHandler,
  getPositionGroupsHandler,
  getProceduresFormDataHandler,
  getProcedureTypes,
  getRehabGroupsHandler,
  getRehabNotesHandler,
  getRehabReportHandler,
  getReportColumnsHandler,
  getSessionTypesHandler,
  getSidesHandler,
  getSportsHandler,
  getSquadAthletesHandler,
  getSquadAthletesListHandler,
  getSquadAthletesByIdHandler,
  getSquadsHandler,
  getStaffUsersHandler,
  getStockMedicationsHandler,
  getSquadNamesHandler,
  getTeamsHandler,
  getTerminologiesHandler,
  getPreliminarySchemaHandler,
  getTreatmentsHandler,
  getTryoutAthletesHandler,
  getTSOEventsHandler,
  getTurnarounds,
  getTvChannelsHandler,
  getVenueTypesHandler,
  getWorkloadTypesHandler,
  importMassAthletesHandler,
  linkMaintenanceExerciseToSessionHandler,
  makeFavoriteHandler,
  massUploadHandler,
  deleteMassUploadHandler,
  getSourceFormDataHandler,
  getIntegrationDataHandler,
  getThirdPartyImports,
  removeGroupFromRehabSessionExercise,
  resetMatchReportHandler,
  resolveChronicIssue,
  rosterReportsHandler,
  saveAllergyMedicationHandler,
  saveDiagnosticAttachmentHandler,
  saveDiagnosticHandler,
  saveDiagnosticLinkHandler,
  saveMedicationEndDateHandler,
  saveMedicationFavorite,
  saveReconciledDiagnosticHandler,
  screenAllergyToDrug,
  searchContactsHandler,
  screenDrugToDrug,
  searchDrugsFavoritesHandler,
  searchDrugsHandler,
  searchMedicalEntityAttachments,
  translationHandler,
  updateAthleteIssueType,
  updateAttachmentHandler,
  updateContactHandler,
  updateExercise,
  updateFormationPositionViewsHandler,
  updateFormAnswersSetLinkedIssuesHandler,
  updateGamedayRolesHandler,
  updateGameInformationHandler,
  updateMedicalAlert,
  updateMedication,
  uploadDocumentHandler,
  saveDrugStockHandler,
  searchDispensableDrugsHandler,
  updateAthleteAttributesHandler,
  formationsHandler,
  gameActivitiesHandler,
  updateEventPeriodsHandler,
  fetchUserDataHandler,
  getOfficialUsersHandler,
  saveMatchReportScoresHandler,
  createUserEventRequestHandler,
  getUserEventRequestsHandler,
  deleteUserEventRequestHandler,
  updateUserEventRequestHandler,
  getUserEventRequestRejectReasonsHandler,
  getCompetitionsHandler,
  createKitMatrixHandler,
  updateKitMatrixHandler,
  searchKitMatricesHandler,
  getKitMatrixColorsHandler,
  getLeagueSeasonsHandler,
  searchImportsList,
  uploadAttachment,
  switchOrganisation,
  searchCoding,
  searchPastAthletes,
  updateDiagnosticHandler,
  setGameOfficialsHandler,
  sendMatchNoticeEmailHandler,
  getEmailRecipients,
  getParticipants,
  searchEmailLogs,
  getExternalAccessUsers,
  getTrainingVariablesHandler,
  getPowerBiEmbedConfig,
  getSettingsSquadAthletesHandler,
  getInitialDataHandler,
  ...planningHandlers, // last because overrides duplicate handler
  ...exportCardsHandler,
  ...uploadsHandlers,
];
