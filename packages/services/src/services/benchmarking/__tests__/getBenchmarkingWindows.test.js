import { getBenchmarkingWindowsData as serverResponse } from '@kitman/services/src/mocks/handlers/benchmarking';
import { axios } from '@kitman/common/src/utils/services';
import getBenchmarkingWindows from '../getBenchmarkingWindows';

describe('getBenchmarkingClubs', () => {
  let request;

  beforeEach(() => {
    request = jest
      .spyOn(axios, 'get')
      .mockImplementation(() => ({ data: serverResponse }));
  });

  afterEach(() => jest.restoreAllMocks());

  it('should respond with benchmark validation results', async () => {
    const response = await getBenchmarkingWindows();

    expect(response).toEqual(serverResponse);
    expect(request).toHaveBeenCalledWith('/benchmark/windows');
  });
});
