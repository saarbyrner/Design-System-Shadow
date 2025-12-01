// @flow
import { axios } from '@kitman/common/src/utils/services';

export type AthleteReviewType = {
  id: number,
  organisation_id: number,
  review_name: string,
  squad_id: number,
};

export const GENERIC_ATHLETES_REVIEW_ENDPOINT =
  '/athletes/athlete_reviews/find_athlete_review_types';

const getAthleteReviewTypes = async (): Promise<AthleteReviewType> => {
  const { data } = await axios.get(GENERIC_ATHLETES_REVIEW_ENDPOINT);
  return data;
};

export default getAthleteReviewTypes;
