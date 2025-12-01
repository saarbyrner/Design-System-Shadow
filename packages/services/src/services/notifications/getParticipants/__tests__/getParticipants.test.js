import { axios } from '@kitman/common/src/utils/services';
import getParticipants from '..';
import mockData from '../mock';

describe('getParticipants', () => {
  beforeEach(() => {
    jest.spyOn(axios, 'get');
  });

  it('calls the correct endpoint with the event id', async () => {
    const data = await getParticipants({
      eventId: 5,
      recipientsType: 'event_participants_contacts',
    });

    expect(axios.get).toHaveBeenCalledWith('/planning_hub/participants', {
      params: {
        event_id: 5,
        recipients_type: 'event_participants_contacts',
      },
    });
    expect(data).toEqual(mockData);
  });
});
