import { axios } from '@kitman/common/src/utils/services';
import updateGamedayRoles from '..';
import mock from '../mock';

describe('updateGamedayRoles', () => {
  it('calls the correct endpoint', async () => {
    jest.spyOn(axios, 'post');

    const eventId = 100;
    const updates = [
      {
        id: 2,
        game_contact_role_id: 2,
        game_contact_id: 2,
      },
      {
        id: 3,
        game_contact_role_id: 1,
        game_contact_id: 12,
      },
      {
        id: 7,
        game_contact_role_id: 3,
        game_contact_id: 1,
      },
    ];
    const data = await updateGamedayRoles({ eventId, updates });

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      `/planning_hub/events/${eventId}/event_game_contacts/bulk_save`,
      {
        event_game_contacts: updates,
      }
    );
    expect(data).toEqual(mock);
  });
});
