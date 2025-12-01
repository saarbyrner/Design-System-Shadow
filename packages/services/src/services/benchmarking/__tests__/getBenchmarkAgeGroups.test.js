import { getBenchmarkingAgeGroupsData as serverResponse } from '@kitman/services/src/mocks/handlers/benchmarking';
import { axios } from '@kitman/common/src/utils/services';
import getBenchmarkAgeGroups from '../getBenchmarkAgeGroups';

describe('getBenchmarkAgeGroups', () => {
  let request;

  beforeEach(() => {
    request = jest
      .spyOn(axios, 'get')
      .mockImplementation(() => ({ data: serverResponse }));
  });

  afterEach(() => jest.restoreAllMocks());

  it('makes the call to the correct endpoint', async () => {
    await getBenchmarkAgeGroups();

    expect(request).toHaveBeenCalledWith('/benchmark/age_groups');
  });
  it('calls the correct endpoint and returns the correct data', async () => {
    const data = await getBenchmarkAgeGroups();

    expect(data).toEqual(serverResponse);
  });
});
