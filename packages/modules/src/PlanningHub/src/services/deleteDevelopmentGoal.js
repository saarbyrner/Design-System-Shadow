// @flow
import { axios } from '@kitman/common/src/utils/services';

const deleteDevelopmentGoal = async (id: number): Promise<any> => {
  const { data } = await axios.delete(
    `/ui/planning_hub/development_goals/${id}`
  );

  return data;
};

export default deleteDevelopmentGoal;
