import { axios } from '@kitman/common/src/utils/services';
import createMovementRecord from '../createMovementRecord';
import data from '../../mocks/data/mock_create_user_movement';

describe('createMovementRecord', () => {
  let createMovementRecordRequest;

  const args = {
    user_id: 1,
    transfer_type: 'trade',
    join_organisation_ids: [42],
    join_squad_ids: [41],
    leave_organisation_ids: [1],
    joined_at: '28/07/1973',
  };
  describe('successful requests', () => {
    beforeEach(() => {
      createMovementRecordRequest = jest
        .spyOn(axios, 'post')
        .mockImplementation(() => Promise.resolve({ data }));
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });
    it('fetches the user only', async () => {
      const returnedData = await createMovementRecord(args);

      expect(returnedData).toEqual(data);

      expect(createMovementRecordRequest).toHaveBeenCalledTimes(1);
      expect(createMovementRecordRequest).toHaveBeenCalledWith(
        '/user_movements',
        args
      );
    });

    it('fetches the athlete when requests only', async () => {
      const returnedData = await createMovementRecord(args);

      expect(returnedData).toEqual(data);

      expect(createMovementRecordRequest).toHaveBeenCalledTimes(1);
      expect(createMovementRecordRequest).toHaveBeenCalledWith(
        '/user_movements',
        args
      );
    });
  });

  describe('when the request fails', () => {
    beforeEach(() => {
      createMovementRecordRequest = jest
        .spyOn(axios, 'post')
        .mockImplementation(() => Promise.reject());
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('throws an error', async () => {
      await expect(createMovementRecord(args)).rejects.toThrow();
    });
  });
});
