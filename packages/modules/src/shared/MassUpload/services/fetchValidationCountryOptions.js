// @flow
import {
  abbreviations,
  names,
} from '@kitman/components/src/PhoneNumberInput/constants';
import type { CountryCode } from 'libphonenumber-js';

export const data = {
  abbreviations,
  names,
};

type Options = {
  abbreviations: Array<CountryCode>,
  names: Array<string>,
};
const fetchValidationCountryOptions = async (): Promise<Options> => {
  const response = data;
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(response);
    }, 1000)
  );
};

export default fetchValidationCountryOptions;
