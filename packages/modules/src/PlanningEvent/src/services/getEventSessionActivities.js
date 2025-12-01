// @flow
import $ from 'jquery';

const getEventSessionActivities = (eventId: number): Promise<any> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: `/ui/planning_hub/events/${eventId}/event_activities`,
    })
      .done((response) => {
        resolve(response);
      })
      .fail(() => {
        reject();
      });
  });
};

export default getEventSessionActivities;
