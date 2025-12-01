// @flow
// 100% labeled as such. No service exists for fetching a form yet.
// Proposal is we fetch by id - hence the id map
// Service is mocked for now
export const TECHNICAL_DEBT_ID_MAP: { [key: string]: number } = {
  scout: 1,
  official: 2,
};

export const USER_TYPE = {
  officials: 'official',
  scouts: 'scout',
};
