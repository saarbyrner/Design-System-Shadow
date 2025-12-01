// @flow
import { axios } from '@kitman/common/src/utils/services';
import type {
  DevelopmentGoalComment,
  DevelopmentGoal,
} from '@kitman/modules/src/AthleteReviews/src/shared/types';

const updateDevelopmentGoal = async ({
  athleteId,
  reviewId,
  developmentGoal,
}: {
  athleteId: string,
  reviewId: string,
  developmentGoal: {
    devGoalId: number,
    comments: Array<DevelopmentGoalComment>,
  },
}): Promise<Array<DevelopmentGoal>> => {
  const { data } = await axios.patch(
    `/athletes/${athleteId}/athlete_reviews/${reviewId}/update_development_goal`,
    {
      development_goal: developmentGoal,
    }
  );

  return data;
};

export default updateDevelopmentGoal;
