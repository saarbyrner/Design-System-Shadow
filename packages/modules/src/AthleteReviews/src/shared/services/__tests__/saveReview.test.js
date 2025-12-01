import { axios } from '@kitman/common/src/utils/services';
import saveReview from '../saveReview';

describe('saveReview', () => {
  const args = {
    athleteId: '1234',
    review: {
      type: 'athlete_review',
      start_date: '2020-10-29T00:00:00.000Z',
      end_date: '2020-10-29T00:00:00.000Z',
      athlete_id: 1,
      review_description: 'Review description',
    },
  };

  it('calls the correct endpoint', async () => {
    jest.spyOn(axios, 'post').mockResolvedValue({});

    await saveReview(args.athleteId, args.review);

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      `/athletes/${args.athleteId}/athlete_reviews`,
      args.review
    );
  });
});
