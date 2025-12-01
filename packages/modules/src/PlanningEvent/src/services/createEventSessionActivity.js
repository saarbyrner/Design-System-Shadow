// @flow
import $ from 'jquery';
import type { EventActivity } from '@kitman/common/src/types/Event';

const createEventSessionActivity = (
  eventId: number
): Promise<EventActivity> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: `/ui/planning_hub/events/${eventId}/event_activities`,
      contentType: 'application/json',
    })
      .done((response) => {
        resolve(response);
      })
      .fail(() => {
        reject();
      });
  });
};

export default createEventSessionActivity;
