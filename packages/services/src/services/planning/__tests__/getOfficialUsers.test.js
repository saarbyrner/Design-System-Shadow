import { axios } from '@kitman/common/src/utils/services';
import getOfficialUsers from '../getOfficialUsers';

describe('getOfficialUsers', () => {
  const returnValue = [
    {
      id: 1236,
      firstname: 'Stuart',
      lastname: "O'Brien",
      fullname: "Stuart O'Brien",
    },
  ];

  beforeAll(() =>
    jest.spyOn(axios, 'get').mockResolvedValue({ data: returnValue })
  );

  it('calls the correct endpoint and returns the correct value', async () => {
    await getOfficialUsers({});

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith('/users/official_only', {
      params: {},
    });
  });

  it('returns `data` property value from a response object', async () => {
    const officials = await getOfficialUsers({});

    expect(officials).toMatchObject(returnValue);
  });

  it('calls the correct endpoint with division id', async () => {
    const axiosGet = jest.spyOn(axios, 'get');
    const officials = await getOfficialUsers({ divisionId: 1 });

    expect(officials).toEqual(returnValue);
    expect(axiosGet).toHaveBeenCalledTimes(1);
    expect(axiosGet).toHaveBeenCalledWith('/users/official_only', {
      params: {
        division_id: 1,
      },
    });
  });
});
