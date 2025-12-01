import { axios } from '@kitman/common/src/utils/services';
import { drugFormsMock as data } from '@kitman/services/src/mocks/handlers/medical/medications';
import getDrugForms, {
  url,
} from '@kitman/services/src/services/medical/medications/getDrugForms';

describe('getDrugForms', () => {
  let request;

  it('returns the expected data', async () => {
    const returnedData = await getDrugForms();
    expect(returnedData).toEqual(data.drug_forms);
  });

  describe('Mock axios', () => {
    beforeEach(() => {
      request = jest.spyOn(axios, 'get');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint', async () => {
      await getDrugForms();

      expect(request).toHaveBeenCalledWith(url);
    });
  });
});
