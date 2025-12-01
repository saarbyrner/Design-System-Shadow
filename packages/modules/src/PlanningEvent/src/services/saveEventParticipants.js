// @flow
import $ from 'jquery';

const saveEventParticipants = (
  eventId: number,
  athleteIds: Array<string | number>
): Promise<any> => {
  return new Promise<void>((resolve: (value: any) => void, reject) => {
    $.ajax({
      method: 'POST',
      url: `/planning_hub/events/${eventId}/participants`,
      contentType: 'application/json',
      data: JSON.stringify({
        athlete_ids: athleteIds,
      }),
    })
      .done(() => resolve())
      .fail(() => reject());
  });
};

export default saveEventParticipants;
