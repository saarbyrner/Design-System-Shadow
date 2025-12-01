// @flow
import { axios } from '@kitman/common/src/utils/services';

export type MetricVariable = {
  source_key: string,
  name: string,
  source_name: string,
  type: string,
  localised_unit: string,
};
export type MetricVariables = Array<MetricVariable>;

const getMetricVariables = async (
  {
    isBenchmarkTesting,
  }: {
    isBenchmarkTesting: boolean,
  } = { isBenchmarkTesting: false }
): Promise<MetricVariables> => {
  const { data } = await axios.get('/ui/metric_variables', {
    params: {
      benchmark_testing: isBenchmarkTesting,
    },
  });

  return data;
};

export default getMetricVariables;
