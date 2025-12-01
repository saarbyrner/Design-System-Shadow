// @flow
import $ from 'jquery';
import type { EventActivity } from '@kitman/common/src/types/Event';
import type { EventActivityAttributes } from '../../types';

const updateEventSessionActivity = (
  eventId: number,
  activityId: number,
  attributes: EventActivityAttributes
): Promise<EventActivity> =>
  new Promise((resolve, reject) => {
    $.ajax({
      method: 'PATCH',
      url: `/ui/planning_hub/events/${eventId}/event_activities/${activityId}`,
      contentType: 'application/json',
      data: JSON.stringify(attributes),
    })
      .done((response) => {
        resolve(response);
      })
      .fail(() => {
        reject();
      });
  });

export default updateEventSessionActivity;
