import { axios } from '@kitman/common/src/utils/services';
import getMovedPlayers from '../getMovedPlayers';

describe('getMovedPlayers', () => {
  const returnValue = {
    moved_athletes: [
      {
        firstname: 'Test NFL',
        id: 1,
        lastname: 'Infra',
      },
    ],
    player_movement_enabled: true,
  };

  beforeAll(() =>
    jest.spyOn(axios, 'get').mockResolvedValue({ data: returnValue })
  );

  it('calls the correct endpoint and returns the correct value', async () => {
    await getMovedPlayers(123);

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      '/planning_hub/events/123/moved_athletes'
    );
  });
});
