// @flow
import { axios } from '@kitman/common/src/utils/services';

const deleteReviewComment = async ({
  athleteId,
  reviewId,
  commentId,
}: {
  athleteId: number,
  reviewId: number,
  commentId: number,
}) => {
  await axios.delete(
    `/athletes/${athleteId}/athlete_reviews/${reviewId}/development_goal_comments/${commentId}`
  );
};

export default deleteReviewComment;
