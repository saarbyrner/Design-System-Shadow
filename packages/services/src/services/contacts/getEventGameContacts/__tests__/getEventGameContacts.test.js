import { axios } from '@kitman/common/src/utils/services';
import getEventGameContacts from '..';
import mock from '../mock';

describe('getEventGameContacts', () => {
  it('calls the correct endpoint', async () => {
    jest.spyOn(axios, 'get');

    const eventId = 100;
    const data = await getEventGameContacts({ eventId });

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      `/planning_hub/events/${eventId}/event_game_contacts`
    );
    expect(data).toEqual(mock);
  });
});
