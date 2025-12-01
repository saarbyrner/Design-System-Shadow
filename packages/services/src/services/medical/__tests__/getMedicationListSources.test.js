import { axios } from '@kitman/common/src/utils/services';
import getMedicationListSources from '../getMedicationListSources';
import { medicationListSourcesData as responseData } from '../../../mocks/handlers/medical/getMedicationListSources';

describe('getMedicationListSources', () => {
  describe('Handler response', () => {
    it('returns an object of medication list sources', async () => {
      const returnedData = await getMedicationListSources();
      expect(returnedData).toEqual(responseData.medication_list_sources);
    });
  });

  describe('Axios mocked', () => {
    let request;

    beforeEach(() => {
      request = jest.spyOn(axios, 'get').mockImplementation(() => {
        return new Promise((resolve) => {
          return resolve({
            data: responseData,
          });
        });
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint', async () => {
      const returnedData = await getMedicationListSources({});

      expect(returnedData).toEqual(responseData.medication_list_sources);
      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(
        '/ui/medical/medications/organisation_medication_list_sources'
      );
    });
  });
});
