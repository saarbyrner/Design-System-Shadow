import { axios } from '@kitman/common/src/utils/services';
import { data } from '../../../mocks/handlers/medical/getC3LogixSingleSignOn';
import getC3LogixSingleSignOn, {
  C3_LOGIX_SSO_URL,
} from '../getC3LogixSingleSignOn';

describe('getC3LogixSingleSignOn', () => {
  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getC3LogixSingleSignOn();

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
      await getC3LogixSingleSignOn();

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(C3_LOGIX_SSO_URL);
    });
  });
});
