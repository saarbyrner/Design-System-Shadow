import { axios } from '@kitman/common/src/utils/services';
import { data as mockedMedicationFavorite } from '@kitman/services/src/mocks/handlers/medical/getMedicationFavorites';
import getMedicationFavorites from '../getMedicationFavorites';

describe('getMedicationFavorites', () => {
  describe('Handler response', () => {
    it('returns an array of favorites', async () => {
      const returnedData = await getMedicationFavorites(
        1,
        'Emr::Private::Models::NhsDmdDrug'
      );
      expect(returnedData).toEqual(mockedMedicationFavorite);
    });
  });

  describe('Axios mocked', () => {
    let request;

    beforeEach(() => {
      request = jest
        .spyOn(axios, 'get')
        .mockResolvedValue({ data: mockedMedicationFavorite });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint with FdbDispensableDrug for null drugType param', async () => {
      const returnedData = await getMedicationFavorites(1, null);
      expect(returnedData).toEqual(mockedMedicationFavorite);
      expect(request).toHaveBeenCalledTimes(1);

      const expectedParams = {
        headers: {
          'content-type': 'application/json',
          Accept: 'application/json',
        },
        params: {
          drug_type: 'FdbDispensableDrug',
          drug_id: '1',
        },
      };

      expect(request).toHaveBeenCalledWith(
        '/ui/medical/medication_favorites',
        expectedParams
      );
    });

    it('calls the correct endpoint with Emr::Private::Models::NhsDmdDrug matching drugType param', async () => {
      const returnedData = await getMedicationFavorites(
        1,
        'Emr::Private::Models::NhsDmdDrug'
      );
      expect(returnedData).toEqual(mockedMedicationFavorite);
      expect(request).toHaveBeenCalledTimes(1);

      const expectedParams = {
        headers: {
          'content-type': 'application/json',
          Accept: 'application/json',
        },
        params: {
          drug_type: 'Emr::Private::Models::NhsDmdDrug',
          drug_id: '1',
        },
      };

      expect(request).toHaveBeenCalledWith(
        '/ui/medical/medication_favorites',
        expectedParams
      );
    });
  });
});
