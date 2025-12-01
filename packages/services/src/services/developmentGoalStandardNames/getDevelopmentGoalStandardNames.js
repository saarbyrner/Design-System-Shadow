// @flow
import { axios } from '@kitman/common/src/utils/services';

export type DevGoalStandardName = {
  id: number,
  standard_name: string,
};

export const GENERIC_GET_DEVELOPMENT_GOAL_STANDARD_NAMES_ENDPOINT =
  '/ui/planning_hub/development_goal_standard_names';

const getDevelopmentGoalStandardNames =
  async (): Promise<DevGoalStandardName> => {
    const { data } = await axios.get(
      GENERIC_GET_DEVELOPMENT_GOAL_STANDARD_NAMES_ENDPOINT
    );

    return data;
  };

export default getDevelopmentGoalStandardNames;
