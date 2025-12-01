import { axios } from '@kitman/common/src/utils/services';
import mock from '../mock';
import getClubSquads, { getClubSquadsUrl } from '..';

describe('getClubSquads', () => {
  it('calls the correct endpoint', async () => {
    const axiosGet = jest.spyOn(axios, 'get');
    const orgId = 1;
    const returnedData = await getClubSquads(orgId);

    expect(returnedData).toEqual(mock);

    expect(axiosGet).toHaveBeenCalledTimes(1);
    expect(axiosGet).toHaveBeenCalledWith(getClubSquadsUrl(orgId), {
      headers: { Accept: 'application/json' },
    });
  });

  it('throws an error', async () => {
    jest.spyOn(axios, 'get').mockImplementation(() => {
      throw new Error();
    });

    await expect(async () => {
      await getClubSquads();
    }).rejects.toThrow();
  });
});
