import { axios } from '@kitman/common/src/utils/services';
import postMovementRecordHistory from '../postMovementRecordHistory';
import { data } from '../../mocks/handlers/postMovementRecordHistory';

describe('postMovementRecordHistory', () => {
  const args = {
    userId: 1,
  };

  let postMovementRecordHistoryRequest;

  describe('successful requests', () => {
    beforeEach(() => {
      postMovementRecordHistoryRequest = jest
        .spyOn(axios, 'post')
        .mockImplementation(() => Promise.resolve({ data }));
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });
    it('fetches the available squads', async () => {
      const returnedData = await postMovementRecordHistory(args);

      expect(returnedData).toEqual(data);

      expect(postMovementRecordHistoryRequest).toHaveBeenCalledTimes(1);
      expect(postMovementRecordHistoryRequest).toHaveBeenCalledWith(
        '/user_movements/1/records',
        null,
        { params: {} }
      );
    });

    it('fetches the available squads with the correct post params', async () => {
      const returnedData = await postMovementRecordHistory({
        ...args,
        transfer_type: 'trial',
      });

      expect(returnedData).toEqual(data);

      expect(postMovementRecordHistoryRequest).toHaveBeenCalledTimes(1);
      expect(postMovementRecordHistoryRequest).toHaveBeenCalledWith(
        '/user_movements/1/records',
        null,
        { params: { transfer_type: 'trial' } }
      );
    });
  });

  describe('failure', () => {
    beforeEach(() => {
      postMovementRecordHistoryRequest = jest
        .spyOn(axios, 'post')
        .mockImplementation(() => Promise.reject());
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('throws an error', async () => {
      await expect(
        postMovementRecordHistory({
          userId: 1,
        })
      ).rejects.toThrow();
    });
  });
});
