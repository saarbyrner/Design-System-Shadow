import { axios } from '@kitman/common/src/utils/services';
import { data as serverResponse } from '@kitman/services/src/mocks/handlers/rehab/getRehabGroups';
import getRehabGroups from '../rehab/getRehabGroups';

describe('getRehabGroups', () => {
  let getRehabGroupsRequest;

  beforeEach(() => {
    getRehabGroupsRequest = jest
      .spyOn(axios, 'get')
      .mockImplementation(() => ({ data: serverResponse }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getRehabGroups();
    expect(returnedData).toEqual(serverResponse);
    expect(returnedData).toHaveLength(3);

    expect(getRehabGroupsRequest).toHaveBeenCalledTimes(1);
    expect(getRehabGroupsRequest).toHaveBeenCalledWith('/tags', {
      params: { scopes: ['Default'] },
    });
  });
});
