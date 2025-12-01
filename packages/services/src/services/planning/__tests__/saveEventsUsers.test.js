import { axios } from '@kitman/common/src/utils/services';
import { saveEventsUsers } from '../saveEventsUsers';

describe('saveEventsUsers', () => {
  const args = {
    eventId: 1,
    userIds: [1, 2, 3],
  };

  it('makes a back-end call to the correct URL with the correct HTTP verb and body', async () => {
    jest.spyOn(axios, 'post');

    await saveEventsUsers(args);

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      `/planning_hub/events/${args.eventId}/user_attendance`,
      { user_ids: args.userIds }
    );
  });
});
