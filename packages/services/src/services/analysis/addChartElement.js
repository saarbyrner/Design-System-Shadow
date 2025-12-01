// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { DataSourceFormState } from '@kitman/modules/src/analysis/Dashboard/components/ChartBuilder/types';

type AddChartElementParams = {
  chartId: number,
  chartElement: DataSourceFormState,
};

const addChartElement = async ({
  chartId,
  chartElement,
}: AddChartElementParams) => {
  const { data } = await axios.post(
    `/reporting/charts/${chartId}/chart_elements`,
    {
      ...chartElement,
    }
  );
  return data;
};

export default addChartElement;
