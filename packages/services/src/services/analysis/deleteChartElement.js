// @flow
import { axios } from '@kitman/common/src/utils/services';

type DeleteChartElementParams = {
  chartId: number,
  chartElementId: number,
};

const deleteChartElement = async ({
  chartId,
  chartElementId,
}: DeleteChartElementParams): Promise<void> => {
  const { data } = await axios.delete(
    `/reporting/charts/${chartId}/chart_elements/${chartElementId}`
  );
  return data;
};

export default deleteChartElement;
