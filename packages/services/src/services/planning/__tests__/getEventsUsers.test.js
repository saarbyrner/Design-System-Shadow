import { axios } from '@kitman/common/src/utils/services';
import { getEventsUsers } from '../getEventsUsers';

describe('getEventsUsers', () => {
  const eventId = 1;

  const returnValue = { test: '' };

  beforeAll(() =>
    jest.spyOn(axios, 'get').mockResolvedValue({ data: returnValue })
  );

  it('makes a back-end call to the correct URL with the correct HTTP verb and body', async () => {
    await getEventsUsers({
      eventId,
    });

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      `/planning_hub/events/${eventId}/events_users`,
      {
        params: {
          include_event_activity_ids: true,
          include_event_user_order: true,
        },
      }
    );
  });

  it('makes a back-end call to the correct URL with the include_staff_role param', async () => {
    await getEventsUsers({
      eventId,
      includeStaffRole: true,
    });

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      `/planning_hub/events/${eventId}/events_users`,
      {
        params: {
          include_staff_role: true,
          include_event_activity_ids: true,
          include_event_user_order: true,
        },
      }
    );
  });

  it('returns `data` property value from a response object', async () => {
    const eventActivities = await getEventsUsers({
      eventId,
    });

    expect(eventActivities).toMatchObject(returnValue);
  });
});
