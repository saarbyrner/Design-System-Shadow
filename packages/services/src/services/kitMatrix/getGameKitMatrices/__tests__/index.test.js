import { axios } from '@kitman/common/src/utils/services';
import mockData from '@kitman/services/src/services/kitMatrix/searchKitMatrices/mock';
import getGameKitMatrices from '..';

describe('getGameKitMatrices', () => {
  it('calls the correct endpoint', async () => {
    jest.spyOn(axios, 'get');

    const data = await getGameKitMatrices({ eventId: 12 });

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      '/planning_hub/events/12/game_kit_matrices'
    );
    expect(data).toEqual(mockData.kit_matrices);
  });
});
