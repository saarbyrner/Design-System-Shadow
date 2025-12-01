import { getBenchmarkingMaturationStatusesData as serverResponse } from '@kitman/services/src/mocks/handlers/benchmarking';
import { axios } from '@kitman/common/src/utils/services';
import getBenchmarkMaturationStatuses from '../getBenchmarkMaturationStatuses';

describe('getBenchmarkMaturationStatuses', () => {
  let request;

  beforeEach(() => {
    request = jest
      .spyOn(axios, 'get')
      .mockImplementation(() => ({ data: serverResponse }));
  });

  afterEach(() => jest.restoreAllMocks());

  it('makes the call to the correct endpoint', async () => {
    await getBenchmarkMaturationStatuses();

    expect(request).toHaveBeenCalledWith('/benchmark/maturity_offset_status');
  });
  it('calls the correct endpoint and returns the correct data', async () => {
    const data = await getBenchmarkMaturationStatuses();

    expect(data).toEqual(serverResponse);
  });
});
