import { getBenchmarkingClubsData as serverResponse } from '@kitman/services/src/mocks/handlers/benchmarking';
import { axios } from '@kitman/common/src/utils/services';
import getBenchmarkingClubs from '../getBenchmarkingClubs';

describe('getBenchmarkingClubs', () => {
  let request;

  beforeEach(() => {
    request = jest
      .spyOn(axios, 'get')
      .mockImplementation(() => ({ data: serverResponse }));
  });

  afterEach(() => jest.restoreAllMocks());

  it('should respond with benchmark validation organisations', async () => {
    const response = await getBenchmarkingClubs();

    expect(response).toEqual(serverResponse);
    expect(request).toHaveBeenCalledWith('/benchmark/organisations');
  });
});
