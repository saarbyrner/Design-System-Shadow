// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { ReviewFormData } from '@kitman/modules/src/AthleteReviews/src/shared/types';

const saveReview = async (
  athleteId: string,
  review: ReviewFormData
): Promise<Array<ReviewFormData>> => {
  const { data } = await axios.post(
    `/athletes/${athleteId}/athlete_reviews`,
    review
  );

  return data;
};

export default saveReview;
