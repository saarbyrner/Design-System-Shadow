import { axios } from '@kitman/common/src/utils/services';
import updateDevelopmentGoal from '../updateDevelopmentGoal';

describe('updateDevelopmentGoal', () => {
  const args = {
    athleteId: 1,
    reviewId: 123,
    developmentGoal: {
      development_goal: 23,
      comments: [{ id: 1, text: 'new comment', user_id: 1 }],
    },
  };

  it('calls the correct endpoint', async () => {
    jest.spyOn(axios, 'patch').mockResolvedValue({});

    await updateDevelopmentGoal(args);

    expect(axios.patch).toHaveBeenCalledTimes(1);
    expect(axios.patch).toHaveBeenCalledWith(
      `/athletes/${args.athleteId}/athlete_reviews/${args.reviewId}/update_development_goal`,
      { development_goal: args.developmentGoal }
    );
  });
});
