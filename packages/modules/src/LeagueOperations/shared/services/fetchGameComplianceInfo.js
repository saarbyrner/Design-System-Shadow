// @flow
import { axios } from '@kitman/common/src/utils/services';
import { DmrStatuses } from '@kitman/modules/src/PlanningEvent/src/hooks/useUpdateDmrStatus';

type GameComplianceRule = {
  [rule: $Values<typeof DmrStatuses>]: { compliant: boolean, message: ?string },
};
const fetchGameComplianceInfo = async (
  eventId: number
): Promise<Array<GameComplianceRule>> => {
  const { data } = await axios.get(
    `/planning_hub/game_compliance/${eventId}/rules`
  );

  return data;
};

export default fetchGameComplianceInfo;
