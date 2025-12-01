// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { PlanningFreeTextKeys } from '@kitman/modules/src/PlanningEvent/types';

type PlanningFreeTextValues = {
  [key: PlanningFreeTextKeys]: string,
};

const getPlanningFreeTextValues = async (
  eventId: number,
  freeTextComponentNames: Array<PlanningFreeTextKeys>
): Promise<PlanningFreeTextValues> => {
  const { data } = await axios.get(
    `/planning_hub/events/${eventId}/freetext_values`,
    {
      params: {
        freetext_component_names: freeTextComponentNames,
      },
    }
  );
  return data;
};

export default getPlanningFreeTextValues;
