// @flow
import { axios } from '@kitman/common/src/utils/services';

export const GET_MATURITY_ESTIMATES_URL =
  '/reporting/growth_maturation/maturity_estimates_training_variables';

const getMaturityEstimates = async () => {
  const { data } = await axios.get(GET_MATURITY_ESTIMATES_URL);
  return data;
};

export default getMaturityEstimates;
