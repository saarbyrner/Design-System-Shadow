// @flow

export type SessionAssessment = {
  id: number,
  name: string,
  templates: Array<{ id: number, name: string }>,
};

export type AssessmentTemplate = {
  id: number,
  name: string,
  include_users: boolean,
  assessment_group_id: number,
};
