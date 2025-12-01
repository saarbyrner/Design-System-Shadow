import { axios } from '@kitman/common/src/utils/services';
import getReview from '../getReview';

describe('getReview', () => {
  it('calls the correct endpoint', async () => {
    jest.spyOn(axios, 'get').mockResolvedValue({ data: { event: {} } });

    await getReview(1, 2);

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith('/athletes/1/athlete_reviews/2', {
      headers: {
        'content-type': 'application/json',
        Accept: 'application/json',
      },
    });
  });
});
