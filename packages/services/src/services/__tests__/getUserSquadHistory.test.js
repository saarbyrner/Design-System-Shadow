import { axios } from '@kitman/common/src/utils/services';
import { response } from '@kitman/services/src/mocks/handlers/getUserSquadHistory';
import { getUserSquadHistory } from '../getUserSquadHistory';

describe('getUserSquadHistory', () => {
  let getUserSquadHistoryRequest;

  beforeEach(() => {
    getUserSquadHistoryRequest = jest
      .spyOn(axios, 'post')
      .mockImplementation(() => Promise.resolve(response));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls and returns the correct value', async () => {
    const returnedData = await getUserSquadHistory({ id: 123 });
    expect(returnedData).toEqual(response.data);

    expect(getUserSquadHistoryRequest).toHaveBeenCalledTimes(1);
    expect(getUserSquadHistoryRequest).toHaveBeenCalledWith(
      '/users/123/squad_history'
    );
  });

  describe('failure', () => {
    beforeEach(() => {
      getUserSquadHistoryRequest = jest
        .spyOn(axios, 'post')
        .mockImplementation(() => Promise.reject());
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('throws an error', async () => {
      await expect(getUserSquadHistory(123)).rejects.toThrow();
    });
  });
});
