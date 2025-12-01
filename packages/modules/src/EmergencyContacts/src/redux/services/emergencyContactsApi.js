// @flow
import { createApi } from '@reduxjs/toolkit/query/react';
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import _upperFirst from 'lodash/upperFirst';
import {
  getInternationalPhonePrefixes,
  getRelationTypes,
} from '@kitman/services';
import { getFlagFrom2DigitCountryCode } from '@kitman/common/src/utils/localeHelpers';

export const REDUCER_KEY: string = 'emergencyContactsApi';

export const emergencyContactsApi = createApi({
  reducerPath: REDUCER_KEY,
  endpoints: (builder) => ({
    getInternationalPhonePrefixes: builder.query({
      queryFn: serviceQueryFactory(() =>
        getInternationalPhonePrefixes().then((countries) =>
          countries.map((country) => ({
            value: country[1],
            label: `${getFlagFrom2DigitCountryCode(
              country[1]
            )}\u00A0\u00A0\u00A0${country[0]}`,
          }))
        )
      ),
    }),
    getCountries: builder.query({
      queryFn: serviceQueryFactory(() =>
        getInternationalPhonePrefixes().then((countries) =>
          countries.map(([country]) => {
            const countryName = country.split(' ').slice(0, -1).join(' ');
            return {
              value: countryName,
              label: countryName,
            };
          })
        )
      ),
    }),
    getRelationTypes: builder.query({
      queryFn: serviceQueryFactory(() =>
        getRelationTypes('emergency_contacts').then((relations) =>
          relations.map((relation) => {
            const name = _upperFirst(relation);
            return {
              value: relation,
              label: name,
            };
          })
        )
      ),
    }),
  }),
});

export const {
  useGetInternationalPhonePrefixesQuery,
  useGetCountriesQuery,
  useGetRelationTypesQuery,
} = emergencyContactsApi;
