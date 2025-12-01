// @flow
import $ from 'jquery';

const deleteEventSessionActivity = (
  eventId: number,
  activityId: number
): Promise<any> => {
  return new Promise<void>((resolve: (value: any) => void, reject) => {
    $.ajax({
      method: 'DELETE',
      url: `/ui/planning_hub/events/${eventId}/event_activities/${activityId}`,
      contentType: 'application/json',
    })
      .done(() => resolve())
      .fail(() => reject());
  });
};

export default deleteEventSessionActivity;
