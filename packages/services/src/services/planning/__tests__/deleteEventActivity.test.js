import { axios } from '@kitman/common/src/utils/services';
import deleteEventActivity from '../deleteEventActivity';

describe('deleteEventActivity', () => {
  const args = {
    eventId: 1,
    activityId: 2,
  };

  it('makes a back-end call to the correct URL with the correct HTTP verb and body', async () => {
    jest.spyOn(axios, 'delete').mockResolvedValue({});

    await deleteEventActivity(args);

    expect(axios.delete).toHaveBeenCalledTimes(1);
    expect(axios.delete).toHaveBeenCalledWith(
      `/ui/planning_hub/events/${args.eventId}/event_activities/${args.activityId}`
    );
  });
});
