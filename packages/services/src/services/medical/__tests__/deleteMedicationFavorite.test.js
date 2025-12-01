import { axios } from '@kitman/common/src/utils/services';
import deleteMedicationFavorite from '../deleteMedicationFavorite';

describe('deleteMedicationFavorite', () => {
  describe('Handler response', () => {
    it('returns no data', async () => {
      const returnedData = await deleteMedicationFavorite(1234);
      expect(returnedData).toEqual('');
    });
  });

  describe('Axios mocked', () => {
    let deleteMedicationFavoriteRequest;

    beforeEach(() => {
      deleteMedicationFavoriteRequest = jest
        .spyOn(axios, 'delete')
        .mockResolvedValue({ data: '' });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint with the correct arguments', async () => {
      await deleteMedicationFavorite(1234);
      expect(deleteMedicationFavoriteRequest).toHaveBeenCalledTimes(1);
      expect(deleteMedicationFavoriteRequest).toHaveBeenLastCalledWith(
        `/ui/medical/medication_favorites/1234`
      );
    });
  });
});
