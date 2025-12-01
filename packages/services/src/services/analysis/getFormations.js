// @flow
import { axios } from '@kitman/common/src/utils/services';

export const getFormations = async () => {
  const { data } = await axios.get(`/ui/planning_hub/formations`);

  return data;
};

export default getFormations;
