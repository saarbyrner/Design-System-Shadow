// @flow
import ajaxPromise from '@kitman/common/src/utils/ajaxPromise';

export type ActivityGroup = {
  id: number,
  name: string,
  event_type: 'game' | 'other' | 'training',
  meta: boolean,
  activities: Array<{
    id: number,
    name: string,
    description: string,
    require_additional_input?: boolean,
  }>,
};
export type ActivityGroups = Array<ActivityGroup>;

const getActivityGroups = (): Promise<ActivityGroups> =>
  ajaxPromise({
    method: 'GET',
    url: '/ui/medical/injuries/activities',
  });

export default getActivityGroups;
