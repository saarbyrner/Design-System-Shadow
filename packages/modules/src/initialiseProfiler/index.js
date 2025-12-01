import i18n from '@kitman/common/src/utils/i18n';
import { initHighchartsOptions } from '@kitman/common/src/utils/HighchartDefaultOptions';

import initSentry from './modules/sentry';
import initIntercom from './modules/intercom';
import initLeroy from './modules/leroy';
import initAddNote from './modules/add_note';
import initCharts from './modules/charts';
import initIssuesModal from './modules/issues_modal';
import initQuestionnaire from './modules/questionnaire/index';
import initUploadFile from './modules/upload_file';
import initAvailabilitiesUploadFile from './modules/availabilities/upload_file';
import initAddDiagnostic from './modules/add_diagnostic';
import initAthleteAnalysisForm from './modules/athlete_analysis_form';
import initAthleteReports from './modules/athlete_reports';
import initAthleteQuestionnaires from './modules/athlete_questionnaires';
import initAlarmAnalysis from './modules/alarm_analysis';
import initInjuryOccurrenceForm from './modules/injury_occurence_form';
import initPrintTracking from './modules/print_tracking';
import initOrgChange from './modules/org_change';
import initSettings from './modules/settings';
import initSquadChange from './modules/squad_change';
import initActivityLogFilter from './modules/activity_log_filter';
import initMomentOrgTimezone from './modules/MomentOrgTimezone';
import initBrandingTheme from './modules/branding_theme';
import initWorkloads from './modules/workloads';
import initMaterialUI from './modules/initialiseMaterialUIPro';

// Utilities
import initGoogleAnalytics from './modules/utilities/ga';
import initGoogleTagManager from './modules/utilities/gtm';
import initAuthentificationRedirection from './modules/utilities/authentification_redirection';
import initSlideinLegend from './modules/utilities/slideinLegend';
import initCalendarPage from './modules/utilities/calendar_page';
import initModalAjax from './modules/utilities/modal_ajax';
import initFormErrors from './modules/utilities/form_errors';
import initFormWithConfirmationModal from './modules/utilities/form_with_confirmation_modal';
import initSortable from './modules/utilities/sortable';
import initModalDeleteFixtureApproval from './modules/utilities/modalDeleteFixtureApproval';
import initTimeseries from './modules/utilities/timeseries';
import initDisableSubmitUntilChange from './modules/utilities/disable_submit_until_change';
import initToogleElement from './modules/utilities/toggle_element';

const initialiseProfiler = (
  branding,
  materialUIKey,
  intercomSettings,
  gaSettings
) => {
  const initTranslatedMiscs = () => {
    initAddNote();
    initUploadFile();
    initAvailabilitiesUploadFile();
    initAthleteAnalysisForm();
    initAthleteReports();
    initTimeseries();
    initAlarmAnalysis();
    initWorkloads();
    initHighchartsOptions();
  };

  initMaterialUI(materialUIKey);
  initSentry();
  initGoogleTagManager(gaSettings);
  initGoogleAnalytics(gaSettings);
  initIntercom(intercomSettings);
  initMomentOrgTimezone();
  initAuthentificationRedirection();
  initLeroy();
  initCharts();
  initCalendarPage();
  initIssuesModal();
  initQuestionnaire();
  initAddDiagnostic();
  initSlideinLegend();
  initModalAjax();
  initFormErrors();
  initFormWithConfirmationModal();
  initSortable();
  initAthleteQuestionnaires();
  initModalDeleteFixtureApproval();
  initDisableSubmitUntilChange();
  initToogleElement();
  initInjuryOccurrenceForm();
  initPrintTracking();
  initOrgChange();
  initSquadChange();
  initSettings();
  initActivityLogFilter();
  initBrandingTheme(branding);

  // Init the miscs javascripts when the translation is ready
  i18n.on('initialized', initTranslatedMiscs);
};

export default initialiseProfiler;
