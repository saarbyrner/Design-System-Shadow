import { axios } from '@kitman/common/src/utils/services';
import { data as mock } from '@kitman/services/src/mocks/handlers/planning/getTurnarounds';
import getTurnarounds from '../../getTurnarounds';

describe('getTurnarounds', () => {
  it('calls the correct endpoint', async () => {
    const axiosGet = jest.spyOn(axios, 'get');
    const turnarounds = await getTurnarounds();
    expect(turnarounds).toEqual(mock);
    expect(axiosGet).toHaveBeenCalledTimes(1);
    expect(axiosGet).toHaveBeenCalledWith('/ui/turnarounds', {
      headers: {
        Accept: 'application/json',
      },
    });
    jest.restoreAllMocks();
  });

  it('calls the new endpoint - error response', async () => {
    jest.spyOn(axios, 'get').mockImplementation(() => {
      throw new Error();
    });

    await expect(async () => {
      await getTurnarounds();
    }).rejects.toThrow();
  });
});
