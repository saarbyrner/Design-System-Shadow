// @flow
import type { UserType } from '@kitman/modules/src/LeagueOperations/shared/types/common';

export const ATHLETE: UserType = 'athlete';
export const STAFF: UserType = 'staff';
export const OFFICIAL: UserType = 'official';
export const SCOUT: UserType = 'scout';

// 100% labeled as such. No service exists for fetching a form yet.
// Proposal is we fetch by id - hence the id map
// Service is mocked for now
export const TECHNICAL_DEBT_ID_MAP: { [key: string]: number } = {
  staff: 62,
  athlete: 61,
  scout: 1,
};
