import { axios } from '@kitman/common/src/utils/services';
import { data } from '@kitman/services/src/mocks/handlers/planning/getEventActivityStates';
import { mapEventActivityGlobalState } from '@kitman//modules/src/PlanningEvent/src/helpers/utils';
import { getEventActivityGlobalStates } from '../getEventActivityGlobalStates';

describe('getEventActivityGlobalStates', () => {
  const eventId = 1;

  beforeAll(() => jest.spyOn(axios, 'post').mockResolvedValue({ data }));

  it('makes a back-end call to the correct URL with the correct HTTP verb and body', async () => {
    await getEventActivityGlobalStates({
      eventId,
      eventActivityIds: [8, 9, 10, 11],
    });

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      `/ui/planning_hub/events/${eventId}/event_activity_athletes/states`,
      {
        event_activity_ids: [8, 9, 10, 11],
      }
    );
  });

  it('returns `data` property value from a response object', async () => {
    const eventActivities = await getEventActivityGlobalStates({
      eventId,
      eventActivityIds: [8, 9, 10, 11],
    });

    expect(eventActivities).toMatchObject(mapEventActivityGlobalState(data));
  });
});
