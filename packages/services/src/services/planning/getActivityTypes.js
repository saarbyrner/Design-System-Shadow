// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { Squads } from '@kitman/services/src/services/getSquads';
import type { ActivityTypeCategory } from '@kitman/services/src/services/getActivityTypeCategories';

export type ActivityType = {
  id: number,
  name: string,
  event_activity_type_category?: ?ActivityTypeCategory,
  archived?: boolean,
  squads: Squads,
  isNewItem?: boolean,
};

export const getActivityTypes = async (): Promise<Array<ActivityType>> => {
  const { data } = await axios.get('/ui/planning_hub/event_activity_types');

  return data;
};
