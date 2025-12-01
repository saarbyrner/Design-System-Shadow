import { axios } from '@kitman/common/src/utils/services';
import { data as serverResponse } from '@kitman/services/src/mocks/handlers/getCurrentSquad';
import { getCurrentSquad } from '../getTeams';

describe('getCurrentSquad', () => {
  let getCurrentSquadRequest;

  beforeEach(() => {
    getCurrentSquadRequest = jest
      .spyOn(axios, 'get')
      .mockImplementation(() => ({ data: serverResponse }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getCurrentSquad();
    expect(returnedData).toEqual(serverResponse.current_squad);

    expect(getCurrentSquadRequest).toHaveBeenCalledTimes(1);
  });
});
