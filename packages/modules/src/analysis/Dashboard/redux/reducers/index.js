/* eslint-disable flowtype/require-valid-file-annotation */
import { combineReducers } from 'redux';
import coachingPrinciples from '@kitman/common/src/reducers/coaching_principles_reducer';
import { globalApi } from '@kitman/common/src/redux/global/services/globalApi';
import { medicalSharedApi } from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import dashboard from './dashboard';
import duplicateDashboardModal from './duplicateDashboardModal';
import duplicateWidgetModal from './duplicateWidgetModal';
import graphLinksModal from './graphLinksModal';
import headerWidgetModal from './headerWidgetModal';
import profileWidgetModal from './profileWidgetModal';
import notesWidgetSettingsModal from './notesWidgetSettingsModal';
import notesWidget from './notesWidget';
import tableWidget from './tableWidget';
import tableWidgetModal from './tableWidgetModal';
import actionsWidgetModal from './actionsWidgetModal';
import annotation from './annotationModal';
import staticData from './staticData';
import dashboardList from './dashboardList';
import printBuilder from './printBuilder';
import noteDetailModal from './noteDetailModal';
import injuryRiskMetrics from './injuryRiskMetrics';
import { dashboardApi } from '../services/dashboard';
import { medicalApi } from '../services/medical';
import { chartBuilderApi } from '../services/chartBuilder';
import chartBuilder, {
  REDUCER_KEY as CHART_BUILDER_REDUCER_KEY,
} from '../slices/chartBuilder';
import columnFormulaPanel, {
  REDUCER_KEY as COLUMN_FORMULA_PANEL_REDUCER_KEY,
} from '../slices/columnFormulaPanelSlice';
import developmentGoalForm from './developmentGoalForm';
import turnaroundList from './turnaroundList';

export default combineReducers({
  globalApi: globalApi.reducer,
  dashboard,
  dashboardApi: dashboardApi.reducer,
  chartBuilderApi: chartBuilderApi.reducer,
  [CHART_BUILDER_REDUCER_KEY]: chartBuilder,
  [COLUMN_FORMULA_PANEL_REDUCER_KEY]: columnFormulaPanel,
  medicalApi: medicalApi.reducer,
  medicalSharedApi: medicalSharedApi.reducer,
  duplicateDashboardModal,
  duplicateWidgetModal,
  graphLinksModal,
  headerWidgetModal,
  profileWidgetModal,
  notesWidgetSettingsModal,
  notesWidget,
  tableWidget,
  tableWidgetModal,
  actionsWidgetModal,
  annotation,
  staticData,
  dashboardList,
  printBuilder,
  noteDetailModal,
  injuryRiskMetrics,
  developmentGoalForm,
  coachingPrinciples,
  turnaroundList,
});
