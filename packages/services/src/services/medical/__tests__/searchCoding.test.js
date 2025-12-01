import { axios } from '@kitman/common/src/utils/services';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import { data as serverResponse } from '@kitman/services/src/mocks/handlers/medical/searchCoding';
import searchCoding from '@kitman/services/src/services/medical/searchCoding';

describe('searchCoding', () => {
  let request;

  it('returns the correct value', async () => {
    const returnedData = await searchCoding({
      filter: 'frac',
      codingSystem: codingSystemKeys.ICD,
    });
    expect(returnedData).toEqual(serverResponse);
  });

  describe('Mock axios', () => {
    beforeEach(() => {
      request = jest.spyOn(axios, 'post');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint and returns the correct value', async () => {
      const returnedData = await searchCoding({
        filter: 'frac',
        codingSystem: codingSystemKeys.ICD,
      });

      expect(returnedData).toEqual(serverResponse);

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith('/ui/medical/issues/search', {
        coding_system: 'ICD-10-CM',
        filter: 'frac',
        only_active: true,
      });
    });

    it('calls the correct endpoint and returns the correct value when onlyActiveCodes is passed', async () => {
      const returnedData = await searchCoding({
        filter: 'frac',
        codingSystem: codingSystemKeys.ICD,
        onlyActiveCodes: false,
      });

      expect(returnedData).toEqual(serverResponse);

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith('/ui/medical/issues/search', {
        coding_system: 'ICD-10-CM',
        filter: 'frac',
        only_active: false,
      });
    });
  });
});
