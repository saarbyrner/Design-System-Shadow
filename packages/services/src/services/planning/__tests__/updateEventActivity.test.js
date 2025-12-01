import { axios } from '@kitman/common/src/utils/services';
import { updateEventActivity } from '../updateEventActivity';

describe('updateEventActivity', () => {
  const args = {
    eventId: 1,
    activityId: 2,
    attributes: {
      duration: 3,
      note: 'notes',
      principle_ids: [1, 2, 3, 4],
      event_activity_type_ids: [1, 2, 3, 4],
      user_ids: [1, 2, 3, 4],
    },
  };

  it('makes a back-end call to the correct URL with the correct HTTP verb and body', async () => {
    jest.spyOn(axios, 'patch').mockResolvedValue({});

    await updateEventActivity(args);

    expect(axios.patch).toHaveBeenCalledTimes(1);
    expect(axios.patch).toHaveBeenCalledWith(
      `/ui/planning_hub/events/${args.eventId}/event_activities/${args.activityId}`,
      args.attributes
    );
  });
});
