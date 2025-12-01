import { axios } from '@kitman/common/src/utils/services';
import { data as serverResponse } from '@kitman/services/src/mocks/handlers/getActiveSquad';
import getActiveSquad from '../getActiveSquad';

describe('getActiveSquad', () => {
  let getActiveSquadRequest;

  beforeEach(() => {
    getActiveSquadRequest = jest
      .spyOn(axios, 'get')
      .mockImplementation(() => Promise.resolve({ data: serverResponse }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getActiveSquad();

    expect(returnedData).toEqual(serverResponse);

    expect(getActiveSquadRequest).toHaveBeenCalledTimes(1);
    expect(getActiveSquadRequest).toHaveBeenCalledWith(
      '/ui/squads/active_squad'
    );
  });
});
