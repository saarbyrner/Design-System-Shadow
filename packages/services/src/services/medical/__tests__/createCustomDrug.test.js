import { axios } from '@kitman/common/src/utils/services';
import { data } from '@kitman/services/src/mocks/handlers/medical/createCustomDrug';
import createCustomDrug from '../createCustomDrug';

describe('createCustomDrug', () => {
  const testDrug = {
    name: 'Custom_Test_1',
    drug_form: 'tablet',
    med_strength: '100',
    med_strength_unit: 'mg',
    country: 'IE',
  };

  describe('Handler response', () => {
    it('returns NHS source drugs', async () => {
      const returnedData = await createCustomDrug(testDrug);
      expect(returnedData).toEqual(data);
    });
  });

  describe('Axios mocked', () => {
    let request;

    beforeEach(() => {
      request = jest.spyOn(axios, 'post').mockResolvedValue({
        data,
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint', async () => {
      const returnedData = await createCustomDrug(testDrug);

      expect(returnedData).toEqual(data);
      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(
        '/medical/drugs/custom_drugs',
        testDrug
      );
    });
  });
});
