// @flow

export type OrganisationStatus =
  | 'TRANSFER_PENDING'
  | 'CURRENT_ATHLETE'
  | 'PAST_ATHLETE'
  | 'TRIAL_ATHLETE';

export type Period = {
  start: ?string,
  end: ?string,
};

export type EntityConstraints = {
  read_only?: boolean,
};

export type Constraints = EntityConstraints & {
  active_periods?: Array<Period>,
  organisation_status?: OrganisationStatus,
};
