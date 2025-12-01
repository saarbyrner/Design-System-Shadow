// @flow
export type SubmissionsSubmitted = {
  growth_and_maturation: number,
  baselines: number,
};

export type LastEdited = {
  growth_and_maturation: {
    date: ?string,
    by: ?string,
  },
  baselines: {
    date: ?string,
    by: ?string,
  },
};

export type SubmissionStatus =
  | 'pending'
  | 'running'
  | 'completed'
  | 'errored'
  | 'expired';
