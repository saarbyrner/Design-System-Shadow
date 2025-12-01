import { axios } from '@kitman/common/src/utils/services';
import deleteReviewComment from '../deleteReviewComment';

describe('deleteReviewComment', () => {
  it('calls the correct endpoint', async () => {
    jest.spyOn(axios, 'delete').mockResolvedValue({});

    await deleteReviewComment({ athleteId: 1, reviewId: 2, commentId: 3 });

    expect(axios.delete).toHaveBeenCalledTimes(1);
    expect(axios.delete).toHaveBeenCalledWith(
      '/athletes/1/athlete_reviews/2/development_goal_comments/3'
    );
  });
});
