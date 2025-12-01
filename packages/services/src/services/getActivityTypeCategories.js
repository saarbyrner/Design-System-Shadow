// @flow
import { axios } from '@kitman/common/src/utils/services';

export type ActivityTypeCategory = {
  id: number,
  name: string,
  value?: string, // added used for use as a select option
};

export type ActivityTypeCategories = Array<ActivityTypeCategory>;

const getActivityTypeCategories = async (): Promise<ActivityTypeCategories> => {
  const { data } = await axios.get(
    '/ui/planning_hub/event_activity_type_categories'
  );

  return data;
};

export default getActivityTypeCategories;
