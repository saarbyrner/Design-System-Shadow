/* eslint-disable import/extensions */
// @flow
import type { CountryCode } from 'libphonenumber-js';
import type { Country } from './types';
// $FlowIgnore[cannot-resolve-module]
import countriesData from './countries.json';

export const countries: Array<Country> = countriesData;

export const abbreviations: Array<CountryCode> = countries.map(
  (country) => country.code
);
export const names: Array<string> = countries.map((country) => country.label);

export const suggestedCountries: Array<Country> = countries.filter(
  (country) => country.suggested
);
export const nonSuggestedCountries: Array<Country> = countries.filter(
  (country) => !country.suggested
);
