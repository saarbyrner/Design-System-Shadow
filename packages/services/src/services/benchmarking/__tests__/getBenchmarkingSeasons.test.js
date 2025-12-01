import { getBenchmarkingSeasonsData as serverResponse } from '@kitman/services/src/mocks/handlers/benchmarking';
import { axios } from '@kitman/common/src/utils/services';
import getBenchmarkingSeasons from '../getBenchmarkingSeasons';

describe('getBenchmarkingClubs', () => {
  let request;

  beforeEach(() => {
    request = jest
      .spyOn(axios, 'get')
      .mockImplementation(() => ({ data: serverResponse }));
  });

  afterEach(() => jest.restoreAllMocks());

  it('should respond with benchmark validation results', async () => {
    const response = await getBenchmarkingSeasons();

    expect(response).toEqual(serverResponse);
    expect(request).toHaveBeenCalledWith('/benchmark/seasons');
  });
});
