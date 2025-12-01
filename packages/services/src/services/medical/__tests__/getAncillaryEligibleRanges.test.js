// flow
import { axios } from '@kitman/common/src/utils/services';
import { data } from '../../../mocks/handlers/medical/getAncillaryEligibleRanges';
import getAncillaryEligibleRanges from '../getAncillaryEligibleRanges';

describe('getAncillaryEligibleRanges', () => {
  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getAncillaryEligibleRanges(1);

    expect(returnedData).toEqual(data);
  });

  describe('Mock axios', () => {
    let request;
    beforeEach(() => {
      request = jest.spyOn(axios, 'get');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint with correct body data in the request', async () => {
      await getAncillaryEligibleRanges(1);

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(
        `/medical/athletes/1/ancillary_dates/eligible_ranges`
      );
    });
  });
});
