import { axios } from '@kitman/common/src/utils/services';

import getMaturityEstimates, {
  GET_MATURITY_ESTIMATES_URL,
} from '../getMaturityEstimates';

describe('getMaturityEstimates', () => {
  it('makes a back-end call to the correct URL with the correct HTTP verb and body', async () => {
    jest.spyOn(axios, 'get').mockResolvedValue({ data: 'estimates' });

    const estimates = await getMaturityEstimates();

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(GET_MATURITY_ESTIMATES_URL);
    expect(estimates).toBe('estimates');
  });
});
