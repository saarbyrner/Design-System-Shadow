import { axios } from '@kitman/common/src/utils/services';
import reorderEventActivities from '../reorderEventActivities';

describe('reorderEventActivities', () => {
  const numberOfActivities = 4;
  const args = {
    eventId: 1,
    activities: [...Array(numberOfActivities).keys()].map((i) => ({
      event_activity_id: i,
      order: i,
    })),
  };

  it('makes a back-end call to the correct URL with the correct HTTP verb and body', async () => {
    jest.spyOn(axios, 'post').mockResolvedValue({});

    await reorderEventActivities(args);

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      `/ui/planning_hub/events/${args.eventId}/event_activities/reorder`,
      { activities: args.activities }
    );
  });
});
