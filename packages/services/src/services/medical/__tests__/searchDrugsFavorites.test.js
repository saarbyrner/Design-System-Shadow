import { axios } from '@kitman/common/src/utils/services';
import {
  NHSDrugs,
  FDBDrugs,
  CustomDrugs,
} from '@kitman/services/src/mocks/handlers/medical/searchDrugsFavorites';
import searchDrugsFavorites from '../searchDrugsFavorites';

describe('searchDrugsFavorites', () => {
  describe('Handler response', () => {
    it('returns NHS source drugs', async () => {
      const returnedData = await searchDrugsFavorites('nhs_dmd_drugs', 'test');
      expect(returnedData).toEqual(NHSDrugs);
    });

    it('returns FDB source drugs', async () => {
      const returnedData = await searchDrugsFavorites(
        'fdb_dispensable_drugs',
        'test'
      );
      expect(returnedData).toEqual(FDBDrugs);
    });

    it('returns Custom source drugs', async () => {
      const returnedData = await searchDrugsFavorites('custom_drugs', 'test');
      expect(returnedData).toEqual(CustomDrugs);
    });
  });

  describe('Axios mocked', () => {
    let request;

    beforeEach(() => {
      request = jest.spyOn(axios, 'post').mockResolvedValue({
        data: NHSDrugs,
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint', async () => {
      const returnedData = await searchDrugsFavorites('nhs_dmd_drugs', 'test');

      expect(returnedData).toEqual(NHSDrugs);
      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(
        '/medical/drugs/search_favorite_drugs',
        {
          medication_list_source: 'nhs_dmd_drugs',
          search_expression: 'test',
        }
      );
    });
  });
});
