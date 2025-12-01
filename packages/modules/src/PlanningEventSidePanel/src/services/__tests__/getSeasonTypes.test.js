import { axios } from '@kitman/common/src/utils/services';
import { data as serverResponse } from '@kitman/services/src/mocks/handlers/documents/getDocuments';
import getSeasonTypes from '../getSeasonTypes';

describe('getSeasonTypes', () => {
  let getSeasonTypesRequest;

  beforeEach(() => {
    getSeasonTypesRequest = jest
      .spyOn(axios, 'get')
      .mockImplementation(() => Promise.resolve({ data: serverResponse }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getSeasonTypes();

    expect(returnedData).toEqual(serverResponse);

    expect(getSeasonTypesRequest).toHaveBeenCalledTimes(1);
    expect(getSeasonTypesRequest).toHaveBeenCalledWith('/ui/season_types');
  });
});
