// @flow
import $ from 'jquery';

const deleteActivityDrill = (
  eventId: number,
  activityId: number
): Promise<any> => {
  return new Promise<void>((resolve: (value: any) => void, reject) => {
    $.ajax({
      method: 'DELETE',
      url: `/ui/planning_hub/events/${eventId}/event_activities/${activityId}/event_activity_drills`,
      contentType: 'application/json',
    })
      .done(() => resolve())
      .fail(() => reject());
  });
};

export default deleteActivityDrill;
