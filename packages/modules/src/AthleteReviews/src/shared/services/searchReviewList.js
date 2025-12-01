// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { StatusLabelsEnumLikeKeys, AthleteReviewsFilters } from '../types';

export type DevelopmentGoal = {
  id: number,
  athlete: {
    id: number,
    firstname: string,
    lastname: string,
    fullname: string,
    shortname: string,
    user_id: number,
    avatar_url: string,
  },
  description: string,
  start_time: string,
  close_time: string,
  principles: Array<{
    id: number,
    name: string,
    principle_categories: [
      {
        id: number,
        name: string,
      }
    ],
    principle_types: Array<{
      id: number,
      name: string,
    }>,
    phases: [
      {
        id: number,
        name: string,
      }
    ],
  }>,
  development_goal_types: Array<{
    id: number,
    name: string,
  }>,
  additional_name: string,
  attached_links: Array<{
    id: number,
    title: string,
    description: string,
    uri: string,
    uri_type: string,
    created_by: string,
    created_at: string,
    updated_at: string,
  }>,
};

export type Review = {
  id: number,
  athlete_id: number,
  start_date: string,
  end_date: string,
  review_description: string,
  review_note?: string,
  squad_id: number,
  user_ids: Array<number>,
  athlete_review_type_id: number,
  squad_name?: string,
  athlete_review_type_name?: string,
  review_status: StatusLabelsEnumLikeKeys,
  development_goals: Array<DevelopmentGoal>,
  next_id: number,
};

type Response = { events: Array<Review> };

const searchReviewList = async (
  athleteId: number,
  filters: AthleteReviewsFilters,
  nextId: ?number
): Promise<Response> => {
  const { data } = await axios.post(
    `/athletes/${athleteId}/athlete_reviews/search`,
    { ...filters, next_id: nextId }
  );
  return data;
};

export default searchReviewList;
