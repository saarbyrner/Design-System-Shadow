import { axios } from '@kitman/common/src/utils/services';
import editReview from '../editReview';
import dummyReview from '../mocks/data/athlete_reviews';

describe('editReview', () => {
  const args = {
    athleteId: 1,
    reviewId: 2,
    review: dummyReview[0],
  };

  it('calls the correct endpoint', async () => {
    jest.spyOn(axios, 'patch').mockResolvedValue({});

    await editReview(args);

    expect(axios.patch).toHaveBeenCalledTimes(1);
    expect(axios.patch).toHaveBeenCalledWith(
      `/athletes/${args.athleteId}/athlete_reviews/${args.reviewId}`,
      dummyReview[0]
    );
  });
});
