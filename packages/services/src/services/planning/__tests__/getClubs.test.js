import { axios } from '@kitman/common/src/utils/services';
import { data as mock } from '@kitman/services/src/mocks/handlers/getClubs';
import getClubs from '../../getClubs';

describe('getClubs', () => {
  it('calls the correct endpoint', async () => {
    const axiosGet = jest.spyOn(axios, 'get');
    const returnedData = await getClubs({});

    expect(returnedData).toEqual(mock);

    expect(axiosGet).toHaveBeenCalledTimes(1);
    expect(axiosGet).toHaveBeenCalledWith(
      '/ui/organisation/organisations/children',
      {
        headers: { Accept: 'application/json' },
        params: {},
      }
    );
  });

  it('calls the correct endpoint with division ids', async () => {
    const axiosPost = jest.spyOn(axios, 'get');
    const returnedData = await getClubs({ divisionIds: 1 });

    expect(returnedData).toEqual(mock);
    expect(axiosPost).toHaveBeenCalledTimes(1);
    expect(axiosPost).toHaveBeenCalledWith(
      '/ui/organisation/organisations/children',
      {
        headers: { Accept: 'application/json' },
        params: {
          division_ids: 1,
        },
      }
    );
  });

  it('throws an error', async () => {
    jest.spyOn(axios, 'get').mockImplementation(() => {
      throw new Error();
    });

    await expect(async () => {
      await getClubs();
    }).rejects.toThrow();
  });
});
