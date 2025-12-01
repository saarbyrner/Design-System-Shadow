// @flow

export type ValidationStatus = 'PENDING' | 'INVALID' | 'VALID';

type Validation = {
  status: ValidationStatus,
  message: ?string,
};

export type ValidationState = {
  [id: number]: Validation | Array<Validation>,
};

export const VALID: ValidationStatus = 'VALID';
export const INVALID: ValidationStatus = 'INVALID';
export const PENDING: ValidationStatus = 'PENDING';
