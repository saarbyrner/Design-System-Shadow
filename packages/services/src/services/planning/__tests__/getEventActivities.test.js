import { axios } from '@kitman/common/src/utils/services';
import getEventActivities from '../getEventActivities';

describe('getEventActivities', () => {
  const eventId = 1;

  const returnValue = { test: '' };

  beforeAll(() =>
    jest.spyOn(axios, 'get').mockResolvedValue({ data: returnValue })
  );

  it('makes a back-end call to the correct URL with the correct HTTP verb and body', async () => {
    await getEventActivities({
      eventId,
      params: {
        excludeAthletes: true,
        excludeSquads: true,
      },
    });

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      `/ui/planning_hub/events/${eventId}/event_activities`,
      {
        params: {
          exclude_athletes: true,
          exclude_squads: true,
        },
      }
    );
  });

  it('returns `data` property value from a response object', async () => {
    const eventActivities = await getEventActivities({
      eventId,
      params: {
        excludeAthletes: true,
        excludeSquads: true,
      },
    });

    expect(eventActivities).toMatchObject(returnValue);
  });
});
