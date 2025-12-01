// flow
import { axios } from '@kitman/common/src/utils/services';
import {
  CONSENTABLE_TYPE,
  CONSENTING_TO,
} from '@kitman/common/src/types/Consent';
import { response } from '@kitman/services/src/mocks/handlers/consent/searchAthletes.mock';
import searchAthletes, {
  endpoint,
} from '@kitman/services/src/services/consent/searchAthletes';

const filters = {
  consentable_type: CONSENTABLE_TYPE.Organisation,
  consenting_to: CONSENTING_TO.injury_surveillance_export,
  per_page: 50,
  page: 0,
};

describe('searchConsentAthletes', () => {
  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await searchAthletes(filters);

    expect(returnedData).toEqual(response.data);
  });

  describe('Mock axios', () => {
    let request;
    beforeEach(() => {
      request = jest.spyOn(axios, 'post');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint with correct body data in the request', async () => {
      await searchAthletes(filters);

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(endpoint, filters);
    });
  });
});
