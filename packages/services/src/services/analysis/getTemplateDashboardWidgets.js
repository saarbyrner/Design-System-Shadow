// @flow
import { axios } from '@kitman/common/src/utils/services';
import type {
  ChartType,
  InputParams,
  RegularCalculations,
  ComplexCalculations,
  ChartConfig,
} from '@kitman/modules/src/analysis/shared/types/charts';
import type { TemplateDashboardKey } from '@kitman/modules/src/analysis/TemplateDashboards/types';
import type { DataSourceType } from '@kitman/modules/src/analysis/Dashboard/components/types';

export type TemplateDashboardWidget = {
  id: string | number,
  title: string,
  tag: string,
  calculation: RegularCalculations | ComplexCalculations,
  config: ChartConfig,
  overlays: Object, // TODO standardise
  data_source_type: DataSourceType,
  input_params: InputParams,
  chart_type: ChartType,
};

const getTemplateDashboardWidgets = async (
  dashboardKey: TemplateDashboardKey
): Promise<TemplateDashboardWidget[]> => {
  const { data } = await axios.get(
    `/reporting/template_dashboards/${dashboardKey}`
  );

  return data;
};

export default getTemplateDashboardWidgets;
