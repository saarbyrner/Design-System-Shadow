import { axios } from '@kitman/common/src/utils/services';
import { saveEventParticipants } from '../saveEventParticipants';

describe('saveEventParticipants', () => {
  const args = {
    eventId: 1,
    athleteIds: [1, 2, 3],
    sendNotifications: false,
  };

  it('makes a back-end call to the correct URL with the correct HTTP verb and body', async () => {
    jest.spyOn(axios, 'post');

    await saveEventParticipants(args);

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      `/planning_hub/events/${args.eventId}/participants`,
      {
        athlete_ids: args.athleteIds,
        send_notifications: args.sendNotifications,
      }
    );
  });
});
