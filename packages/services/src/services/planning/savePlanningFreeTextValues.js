// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { PlanningFreeTextKeys } from '@kitman/modules/src/PlanningEvent/types';

type PlanningFreeTextData = {
  name: PlanningFreeTextKeys,
  value: string,
};

const savePlanningFreeTextValues = async (
  eventId: number,
  planningFreeTextValues: Array<PlanningFreeTextData>
): Promise<PlanningFreeTextData> => {
  const { data } = await axios.post(
    `/planning_hub/events/${eventId}/freetext_values`,
    {
      freetext_components: planningFreeTextValues,
    }
  );
  return data;
};
export default savePlanningFreeTextValues;
