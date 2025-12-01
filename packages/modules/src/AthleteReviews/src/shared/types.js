// @flow
import { formModeEnumLike, statusEnumLike } from './enum-likes';

export type FormModeEnumLikeValues = $Values<typeof formModeEnumLike>;

export type StatusLabelsEnumLikeKeys = $Keys<typeof statusEnumLike>;

export type Link = {
  id?: ?number,
  title: string,
  uri: string,
  isIdLocal?: boolean,
};

export type AthleteData = {
  avatar_url: string,
  firstname: string,
  fullname: string,
  id: number,
  lastname: string,
  shortname: string,
  date_of_birth: string,
  position?: {
    name: string,
  },
  user_id: number,
};

type SelectType = {
  id: number,
  name: string,
};

export type AthleteReviewsFilters = {
  user_ids: Array<number>,
  review_start_date: ?string,
  review_end_date: ?string,
  athlete_review_type_id: ?number,
  review_status: ?StatusLabelsEnumLikeKeys,
};

export type DevelopmentGoalComment = {
  id?: ?number,
  text: string,
  development_goal_id?: number,
  user?: { fullname: string, id: number, avatar_url: string },
  created_at?: string,
};

export type DevelopmentGoal = {
  id: ?string,
  additional_name: ?string,
  description: ?string,
  development_goal_standard_name_id: ?number,
  development_goal_type_id: ?(Array<{ id: number }> | number),
  development_goal_types: Array<SelectType>,
  principles: Array<SelectType>,
  principle_id: ?number,
  analytical_dashboard_ids: Array<number>,
  comments: Array<DevelopmentGoalComment>,
  athlete?: AthleteData,
  attached_links: Array<Link>,
  status: ?string,
  start_time?: string,
};

export type ReviewFormData = {
  attached_links: Array<Link>,
  assessment_id: ?number,
  assessment_group_id: ?number,
  development_goals: Array<DevelopmentGoal>,
  end_date: ?string,
  id: ?string,
  local_timezone: string,
  review_description: ?string,
  review_note: ?string,
  review_status: ?StatusLabelsEnumLikeKeys,
  skip_create_athlete_events: boolean,
  skip_create_period: boolean,
  squad_id: ?number,
  squad_name: ?string,
  start_date: ?string,
  start_time: ?string,
  type: 'athlete_review',
  athlete_review_type_id: ?number,
  user_ids: Array<number>,
  height: ?string,
  country: ?string,
  age: ?number,
};
