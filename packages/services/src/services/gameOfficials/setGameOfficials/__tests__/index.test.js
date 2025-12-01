import { axios } from '@kitman/common/src/utils/services';
import setGameOfficials from '..';

describe('setGameOfficials', () => {
  it('calls the correct endpoint', async () => {
    jest.spyOn(axios, 'put');

    const updates = [
      {
        role: 'referee',
        official_id: 1,
      },
    ];
    await setGameOfficials({ eventId: 12, updates });

    expect(axios.put).toHaveBeenCalledTimes(1);
    expect(axios.put).toHaveBeenCalledWith(
      '/planning_hub/events/12/game_officials/bulk_save',
      { game_officials: updates }
    );
  });
});
