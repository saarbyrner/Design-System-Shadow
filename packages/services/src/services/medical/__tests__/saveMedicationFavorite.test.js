import { axios } from '@kitman/common/src/utils/services';
import { data as mockedMedicationFavorite } from '@kitman/services/src/mocks/handlers/medical/saveMedicationFavorite';
import saveMedicationFavorite from '../saveMedicationFavorite';

describe('saveMedicationFavorite', () => {
  const mockedMedicationRequest = {
    drug_type: 'FdbDispensableDrug',
    drug_id: 2,
    tapered: false,
    directions: 'apply',
    dose: '1',
    dose_units: null,
    frequency: '2',
    route: 'via j-tube',
    duration: 1,
  };

  describe('Handler response', () => {
    it('returns an object of the favorite details', async () => {
      const returnedData = await saveMedicationFavorite(
        mockedMedicationRequest
      );
      expect(returnedData).toEqual(mockedMedicationFavorite);
    });
  });

  describe('Axios mocked', () => {
    let saveMedicationFavoriteRequest;

    beforeEach(() => {
      saveMedicationFavoriteRequest = jest
        .spyOn(axios, 'post')
        .mockResolvedValue({ data: mockedMedicationFavorite });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint and returns the correct value', async () => {
      const returnedData = await saveMedicationFavorite(
        mockedMedicationRequest
      );
      expect(returnedData).toEqual(mockedMedicationFavorite);

      expect(saveMedicationFavoriteRequest).toHaveBeenCalledTimes(1);
      expect(saveMedicationFavoriteRequest).toHaveBeenCalledWith(
        '/ui/medical/medication_favorites',
        mockedMedicationRequest
      );
    });
  });
});
