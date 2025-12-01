import { axios } from '@kitman/common/src/utils/services';
import { data as mock } from '@kitman/services/src/mocks/handlers/planningHub/getGameStatuses';
import getGameStatuses from '../../getGameStatuses';

describe('getGameStatuses', () => {
  it('calls the correct endpoint', async () => {
    const axiosGet = jest.spyOn(axios, 'get');
    const response = await getGameStatuses();
    expect(response).toEqual(mock);
    expect(axiosGet).toHaveBeenCalledTimes(1);
    expect(axiosGet).toHaveBeenCalledWith('/ui/planning_hub/game_statuses', {
      headers: {
        Accept: 'application/json',
      },
    });
  });

  it('throws an error', async () => {
    jest.spyOn(axios, 'get').mockImplementation(() => {
      throw new Error();
    });

    await expect(async () => {
      await getGameStatuses();
    }).rejects.toThrow();
  });
});
