// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { Review } from './searchReviewList';

type Response = { event: Review };

const getReview = async (
  athleteId: number,
  reviewId: number
): Promise<Response> => {
  const { data } = await axios.get(
    `/athletes/${athleteId}/athlete_reviews/${reviewId}`,
    {
      headers: {
        'content-type': 'application/json',
        Accept: 'application/json',
      },
    }
  );

  return data.event;
};

export default getReview;
