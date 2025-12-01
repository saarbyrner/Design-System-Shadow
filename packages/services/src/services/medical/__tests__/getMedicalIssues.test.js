import { axios } from '@kitman/common/src/utils/services';
import getMedicalIssues from '../getMedicalIssues';
import { medicalIssuesCI } from '../../../mocks/handlers/medical/getMedicalIssues';

describe('getMedicalIssues', () => {
  let request;

  // MSW handler test
  it('returns the correct value', async () => {
    const returnedData = await getMedicalIssues({
      codingSystem: 'Clinical Impressions',
    });
    const expectedResult = medicalIssuesCI.results;
    expect(returnedData).toEqual(expectedResult);
  });

  describe('Mock axios', () => {
    beforeEach(() => {
      request = jest.spyOn(axios, 'post');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });
    it('calls the correct endpoint with correct body data in the request', async () => {
      await getMedicalIssues({
        codingSystem: 'Clinical Impressions',
        onlyActiveCodes: true,
      });

      const bodyData = {
        coding_system: 'Clinical Impressions',
        only_active: true,
      };
      expect(request).toHaveBeenCalledWith('/ui/medical/issues/get', bodyData, {
        timeout: 0,
      });
    });

    it('calls the correct endpoint with correct body data in the request when onlyActiveCodes is passed', async () => {
      await getMedicalIssues({
        codingSystem: 'Clinical Impressions',
        onlyActiveCodes: false,
      });

      const bodyData = {
        coding_system: 'Clinical Impressions',
        only_active: false,
      };
      expect(request).toHaveBeenCalledWith('/ui/medical/issues/get', bodyData, {
        timeout: 0,
      });
    });
  });
});
