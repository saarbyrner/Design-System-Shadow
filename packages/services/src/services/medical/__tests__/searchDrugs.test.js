import { axios } from '@kitman/common/src/utils/services';
import {
  NHSDrugs,
  FDBDrugs,
  CustomDrugs,
} from '@kitman/services/src/mocks/handlers/medical/searchDrugs';
import searchDrugs from '../searchDrugs';

describe('searchDrugs', () => {
  describe('Handler response', () => {
    it('returns NHS source drugs', async () => {
      const returnedData = await searchDrugs('nhs_dmd_drugs', 'test');
      expect(returnedData).toEqual(NHSDrugs);
    });

    it('returns FDB source drugs', async () => {
      const returnedData = await searchDrugs('fdb_dispensable_drugs', 'test');
      expect(returnedData).toEqual(FDBDrugs);
    });

    it('returns custom source drugs', async () => {
      const returnedData = await searchDrugs('custom_drugs', 'test');
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
      const returnedData = await searchDrugs('nhs_dmd_drugs', 'test');

      expect(returnedData).toEqual(NHSDrugs);
      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith('/medical/drugs/search', {
        medication_list_source: 'nhs_dmd_drugs',
        search_expression: 'test',
      });
    });
  });
});
