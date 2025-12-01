// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { DataSourceFormState } from '@kitman/modules/src/analysis/Dashboard/components/ChartBuilder/types';

type UpdateChartElementParams = {
  chartId: number,
  chartElementId: number,
  chartElement: DataSourceFormState,
};

const updateChartElement = async ({
  chartId,
  chartElementId,
  chartElement,
}: UpdateChartElementParams) => {
  const { data } = await axios.patch(
    `/reporting/charts/${chartId}/chart_elements/${chartElementId}`,
    {
      ...chartElement,
    }
  );
  return data;
};

export default updateChartElement;
