// @flow
export type Product = 'league-ops';
export type ProductArea =
  | 'schedule'
  | 'match-monitor-report'
  | 'scout-access-management';

export type Feature = 'match-monitor' | 'scout-access-management';

export type RegistrationStatusData = {
  status: string,
  annotation?: string,
};

export type RegistrationStatusEventData = {
  Status: Array<string>,
  Annotation?: string,
};
