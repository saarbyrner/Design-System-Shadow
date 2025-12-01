import $ from 'jquery';
import { data } from '../../../mocks/handlers/medical/datalys';
import { getDatalysClassifications, getDatalysBodyAreas } from '../datalys';

describe('datalys services', () => {
  describe('getDatalysClassifications', () => {
    let getDatalysClassificationsRequest;

    beforeEach(() => {
      const deferred = $.Deferred();
      getDatalysClassificationsRequest = jest
        .spyOn($, 'ajax')
        .mockImplementation(() =>
          deferred.resolve(data.datalys_classifications)
        );
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint and returns the correct value', async () => {
      const returnedData = await getDatalysClassifications();

      expect(returnedData).toEqual(data.datalys_classifications);

      expect(getDatalysClassificationsRequest).toHaveBeenCalledTimes(1);
      expect(getDatalysClassificationsRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: '/ui/medical/datalys_classifications',
      });
    });
  });

  describe('getDatalysBodyAreas', () => {
    let getDatalysBodyAreasRequest;

    beforeEach(() => {
      const deferred = $.Deferred();
      getDatalysBodyAreasRequest = jest
        .spyOn($, 'ajax')
        .mockImplementation(() => deferred.resolve(data.datalys_body_areas));
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint and returns the correct value', async () => {
      const returnedData = await getDatalysBodyAreas();

      expect(returnedData).toEqual(data.datalys_body_areas);

      expect(getDatalysBodyAreasRequest).toHaveBeenCalledTimes(1);
      expect(getDatalysBodyAreasRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: '/ui/medical/datalys_body_areas',
      });
    });
  });
});
