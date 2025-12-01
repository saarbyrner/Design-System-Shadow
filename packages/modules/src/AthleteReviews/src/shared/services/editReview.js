// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { ReviewFormData } from '@kitman/modules/src/AthleteReviews/src/shared/types';

const editReview = async ({
  athleteId,
  reviewId,
  review,
}: {
  athleteId: string,
  reviewId: string,
  review: ReviewFormData,
}): Promise<Array<ReviewFormData>> => {
  const { data } = await axios.patch(
    `/athletes/${athleteId}/athlete_reviews/${reviewId}`,
    review
  );

  return data;
};

export default editReview;
