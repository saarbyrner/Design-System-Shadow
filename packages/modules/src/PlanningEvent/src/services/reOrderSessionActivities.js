// @flow
import $ from 'jquery';
import type { EventActivity } from '@kitman/common/src/types/Event';

export type ActivityOrder = {
  event_activity_id: string | number,
  order: number,
};

const reOrderSessionActivities = (
  eventId: number,
  reOrderedActivities: Array<ActivityOrder>
): Promise<Array<EventActivity>> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `/ui/planning_hub/events/${eventId}/event_activities/reorder`,
      contentType: 'application/json',
      method: 'POST',
      data: JSON.stringify({
        activities: reOrderedActivities,
      }),
    })
      .done(resolve)
      .fail(reject);
  });
};

export default reOrderSessionActivities;
