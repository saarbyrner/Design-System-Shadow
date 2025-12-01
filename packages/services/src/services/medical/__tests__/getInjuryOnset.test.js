import { axios } from '@kitman/common/src/utils/services';
import { data } from '@kitman/services/src/mocks/handlers/medical/getInjuryTypes';
import getInjuryOnset, { GET_INJURY_ONSET_URL } from '../getInjuryOnset';

describe('getInjuryOnset', () => {
  it('calls the correct endpoint', async () => {
    const axiosGetSpy = jest.spyOn(axios, 'get');
    const result = await getInjuryOnset();
    expect(axiosGetSpy).toHaveBeenCalledWith(GET_INJURY_ONSET_URL);
    expect(result).toEqual(data);
  });
});
