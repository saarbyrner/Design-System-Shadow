import { axios } from '@kitman/common/src/utils/services';
import mock from '../mock';
import updateGameInformation from '..';

describe('updateGameInformation', () => {
  it('calls the correct endpoint', async () => {
    jest.spyOn(axios, 'patch');

    await updateGameInformation({ eventId: 12, updates: mock });

    expect(axios.patch).toHaveBeenCalledTimes(1);
    expect(axios.patch).toHaveBeenCalledWith(
      '/planning_hub/league_games/12',
      mock
    );
  });
});
