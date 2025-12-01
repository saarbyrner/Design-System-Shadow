import { data as serverResponse } from '@kitman/services/src/mocks/handlers/getPositionGroups';
import { axios } from '@kitman/common/src/utils/services';
import getPositionGroups from '../getPositionGroups';

describe('getPositionGroups', () => {
  it('calls the correct endpoint and returns the correct value', async () => {
    const axiosGet = jest.spyOn(axios, 'get');
    const returnedData = await getPositionGroups();

    expect(returnedData).toEqual(serverResponse);

    expect(axiosGet).toHaveBeenCalledTimes(1);
    expect(axiosGet).toHaveBeenCalledWith('/ui/position_groups', {
      headers: { Accept: 'application/json' },
    });
  });

  it('throws an error', async () => {
    jest.spyOn(axios, 'get').mockImplementation(() => {
      throw new Error();
    });

    await expect(async () => {
      await getPositionGroups();
    }).rejects.toThrow();
  });
});
