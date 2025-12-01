// @flow
export type FormAnswersSetsFilterBasic = {
  athleteId?: number,
  category?: string,
  formType?: string,
  group?: string,
  key?: string,
};

export type FormAnswersSetsFilter = FormAnswersSetsFilterBasic & {
  page?: number,
  injuryOccurenceId?: number,
  chronicIssueId?: number,
  illnessOccurenceId?: number,
};
