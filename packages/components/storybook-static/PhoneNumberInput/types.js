// @flow
import type { CountryCode } from 'libphonenumber-js';

export type Country = {
  code: CountryCode,
  label: string,
  phone: string,
  suggested?: boolean,
};
