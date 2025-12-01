// flow
import { axios } from '@kitman/common/src/utils/services';
import {
  CONSENTABLE_TYPE,
  CONSENTING_TO,
} from '@kitman/common/src/types/Consent';
import { response } from '@kitman/services/src/mocks/handlers/consent/consentMultipleAthletes.mock';
import saveAthletesConsent, {
  endpoint,
} from '@kitman/services/src/services/consent/saveAthletesConsent';

const payload = {
  athlete_ids: [1, 2, 7, 8],
  consentable_type: CONSENTABLE_TYPE.Organisation,
  consenting_to: CONSENTING_TO.injury_surveillance_export,
  start_date: '2024-05-14T23:00:00.000Z”',
  end_date: '2024-06-14T23:00:00.000Z”',
};

describe('searchConsentAthletes', () => {
  let request;
  beforeEach(() => {
    request = jest.spyOn(axios, 'post');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await saveAthletesConsent(payload);

    expect(returnedData).toEqual(response.data);
  });

  describe('Mock axios', () => {
    it('calls the correct endpoint with correct body data in the request', async () => {
      await saveAthletesConsent(payload);
      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(endpoint, payload);
    });
  });
});
