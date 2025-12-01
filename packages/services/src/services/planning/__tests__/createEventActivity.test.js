import { axios } from '@kitman/common/src/utils/services';
import createEventActivity from '../createEventActivity';

describe('createEventActivity', () => {
  const args = {
    eventId: 10034,
    drillId: 7,
  };

  it('makes a back-end call to the correct URL with the correct HTTP verb and body', async () => {
    jest.spyOn(axios, 'post').mockResolvedValue({});

    await createEventActivity(args);

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      `/ui/planning_hub/events/${args.eventId}/event_activities?exclude_squads=true`,
      {
        event_activity_drill_id: args.drillId,
      }
    );
  });
});
