// @flow
import $ from 'jquery';
import type { Event } from '@kitman/common/src/types/Event';

const editEvent = (
  eventId: number,
  attributes: {
    rpe_collection_athlete: boolean,
    mass_input: boolean,
    rpe_collection_kiosk: boolean,
    type?: 'game_event',
  }
): Promise<{ event: Event }> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'PATCH',
      url: `/planning_hub/events/${eventId}`,
      contentType: 'application/json',
      data: JSON.stringify({ ...attributes }),
    })
      .done((response) => {
        resolve(response);
      })
      .fail(() => {
        reject();
      });
  });
};

export default editEvent;
