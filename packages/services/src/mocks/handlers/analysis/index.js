// @flow
import { handler as getTemplateDashboardWidgetsHandler } from './getTemplateDashboardWidgets';
import { handler as getTemplateDashboardsHandler } from './getTemplateDashboards';
import { handler as getDashboardsHandler } from './getDashboards';
import { handler as getDataHandler } from './getData';
import { handler as addWidgetHandler } from './addWidget';
import { handler as getGroups, handlerById as getGroup } from './groups';
import { handler as getLabels, handlerById as getLabel } from './labels';
import { handler as addChartElementHandler } from './addChartElement';
import { handler as updateChartElementHandler } from './updateChartElement';
import { handler as getGroupingsHandler } from './getGroupings';
import { handler as getGrowthAndMaturationDataHandler } from './getGrowthAndMaturationData';
import { handler as updateWidgetHandler } from './updateWidget';
import { handler as getPastAthletes } from './getPastAthletes';
import { handler as addTableFormulaColumn } from './addTableFormulaColumn';
import { handler as updateTableFormulaColumn } from './updateTableFormulaColumn';
import { handler as getFormations } from './getFormations';
import deleteChartElementHandler from './deleteChartElement';
import { handler as refreshWidgetCache } from './refreshWidgetCache';
import { handler as getMaturityEstimates } from './getMaturityEstimates';

// Looker dashboard groups
import { handler as getDashboardGroups } from './getDashboardGroups';

export default [
  addChartElementHandler,
  addTableFormulaColumn,
  addWidgetHandler,
  deleteChartElementHandler,
  getDashboardsHandler,
  getDataHandler,
  getFormations,
  getGroup,
  getGroupingsHandler,
  getGroups,
  getGrowthAndMaturationDataHandler,
  getLabel,
  getLabels,
  getPastAthletes,
  getTemplateDashboardsHandler,
  getTemplateDashboardWidgetsHandler,
  updateChartElementHandler,
  updateTableFormulaColumn,
  updateWidgetHandler,
  refreshWidgetCache,
  getMaturityEstimates,
  // Looker dashboard groups
  getDashboardGroups,
];
