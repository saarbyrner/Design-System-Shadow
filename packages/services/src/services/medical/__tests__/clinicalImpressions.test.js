import $ from 'jquery';
import { data } from '../../../mocks/handlers/medical/clinicalImpressions';
import {
  getClinicalImpressionsClassifications,
  getClinicalImpressionsBodyAreas,
} from '../clinicalImpressions';

describe('ci services', () => {
  describe('getClinicalImpressionsClassifications', () => {
    let getClinicalImpressionsClassificationsRequest;

    beforeEach(() => {
      const deferred = $.Deferred();
      getClinicalImpressionsClassificationsRequest = jest
        .spyOn($, 'ajax')
        .mockImplementation(() =>
          deferred.resolve(data.clinical_impression_classifications)
        );
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint and returns the correct value', async () => {
      const returnedData = await getClinicalImpressionsClassifications();

      expect(returnedData).toEqual(data.clinical_impression_classifications);

      expect(
        getClinicalImpressionsClassificationsRequest
      ).toHaveBeenCalledTimes(1);
      expect(getClinicalImpressionsClassificationsRequest).toHaveBeenCalledWith(
        {
          method: 'GET',
          url: '/ui/medical/clinical_impressions_classifications',
        }
      );
    });
  });

  describe('getClinicalImpressionsBodyAreas', () => {
    let getClinicalImpressionsBodyAreasRequest;

    beforeEach(() => {
      const deferred = $.Deferred();
      getClinicalImpressionsBodyAreasRequest = jest
        .spyOn($, 'ajax')
        .mockImplementation(() =>
          deferred.resolve(data.clinical_impression_body_areas)
        );
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint and returns the correct value', async () => {
      const returnedData = await getClinicalImpressionsBodyAreas();

      expect(returnedData).toEqual(data.clinical_impression_body_areas);

      expect(getClinicalImpressionsBodyAreasRequest).toHaveBeenCalledTimes(1);
      expect(getClinicalImpressionsBodyAreasRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: '/ui/medical/clinical_impressions_body_areas',
      });
    });
  });
});
