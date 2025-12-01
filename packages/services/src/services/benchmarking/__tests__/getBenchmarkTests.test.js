import { axios } from '@kitman/common/src/utils/services';
import getBenchmarkTests from '../getBenchmarkTests';

describe('getBenchmarkTests', () => {
  let request;

  const MOCK_DATA = [
    {
      id: 1,
      name: '05m Sprint',
    },
    {
      id: 2,
      name: '10m Sprint',
    },
    {
      id: 3,
      name: '20m Sprint',
    },
  ];

  beforeEach(() => {
    request = jest
      .spyOn(axios, 'get')
      .mockImplementation(() => ({ data: MOCK_DATA }));
  });

  it('makes the call to the correct endpoint', async () => {
    await getBenchmarkTests();

    expect(request).toHaveBeenCalledWith('/benchmark/metrics');
  });
  it('calls the correct endpoint and returns the correct data', async () => {
    const data = await getBenchmarkTests();

    expect(data).toEqual(MOCK_DATA);
  });
});
