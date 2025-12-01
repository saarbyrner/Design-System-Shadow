import { axios } from '@kitman/common/src/utils/services';
import { data } from '../../../mocks/handlers/medical/getC3LogixAthleteSingleSignOn';
import getC3LogixAthleteSingleSignOn from '../getC3LogixAthleteSingleSignOn';

describe('getC3LogixAthleteSingleSignOn', () => {
  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getC3LogixAthleteSingleSignOn(5);

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
      await getC3LogixAthleteSingleSignOn(5);

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(
        '/medical/athletes/5/c3_logix/sso_url'
      );
    });
  });
});
