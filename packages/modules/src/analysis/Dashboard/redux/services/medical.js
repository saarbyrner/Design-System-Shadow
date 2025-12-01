// @flow
import { createApi } from '@reduxjs/toolkit/query/react';
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import ajaxPromise from '@kitman/common/src/utils/ajaxPromise';
import {
  getActivityGroups,
  getGrades,
  getSides,
  getContactTypes,
  getCompetitions,
  getIllnessOnset,
  getInjuryOnset,
  getInjuryOsics,
  getIllnessOsics,
  getInjuryOsicsPathologies,
  getIllnessOsicsPathologies,
  getInjuryOsicsClassifications,
  getIllnessOsicsClassifications,
  getInjuryOsicsBodyAreas,
  getIllnessOsicsBodyAreas,
  getClinicalImpressionsClassifications,
  getClinicalImpressionsBodyAreas,
  getDatalysClassifications,
  getDatalysBodyAreas,
  getCodingSystemV2Classifications,
  getBodyAreasMultiCodingV2,
} from '@kitman/services';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import getCodingSystemSides from '@kitman/services/src/services/medical/getCodingSystemSides';
import { isV2MultiCodingSystem } from '@kitman/modules/src/Medical/shared/utils';

export type QueryData<T> = {
  data: ?T,
  isFetching: boolean,
  refetch: Function,
  error: Object,
};

export const medicalApi = createApi({
  reducerPath: 'medicalApi',
  endpoints: (builder) => ({
    getActivityGroups: builder.query({
      queryFn: serviceQueryFactory(getActivityGroups),
    }),
    getGrades: builder.query({
      queryFn: serviceQueryFactory(getGrades),
    }),
    getSides: builder.query({
      queryFn: serviceQueryFactory(getSides),
    }),
    getSidesV2: builder.query({
      queryFn: serviceQueryFactory(() =>
        getCodingSystemSides(codingSystemKeys.OSIICS_15)
      ),
    }),
    getInjuryOsics: builder.query({
      queryFn: serviceQueryFactory(getInjuryOsics),
    }),
    getIllnessOsics: builder.query({
      queryFn: serviceQueryFactory(getIllnessOsics),
    }),
    getInjuryOsicsPathologies: builder.query({
      queryFn: serviceQueryFactory(getInjuryOsicsPathologies),
    }),
    getIllnessOsicsPathologies: builder.query({
      queryFn: serviceQueryFactory(getIllnessOsicsPathologies),
    }),
    getInjuryOsicsClassifications: builder.query({
      queryFn: serviceQueryFactory(getInjuryOsicsClassifications),
    }),
    getIllnessOsicsClassifications: builder.query({
      queryFn: serviceQueryFactory(getIllnessOsicsClassifications),
    }),
    getInjuryOsicsBodyAreas: builder.query({
      queryFn: serviceQueryFactory(getInjuryOsicsBodyAreas),
    }),
    getIllnessOsicsBodyAreas: builder.query({
      queryFn: serviceQueryFactory(getIllnessOsicsBodyAreas),
    }),
    getClinicalImpressionsClassifications: builder.query({
      queryFn: serviceQueryFactory(getClinicalImpressionsClassifications),
    }),
    getClinicalImpressionsBodyAreas: builder.query({
      queryFn: serviceQueryFactory(getClinicalImpressionsBodyAreas),
    }),
    getDatalysClassifications: builder.query({
      queryFn: serviceQueryFactory(getDatalysClassifications),
    }),
    getDatalysBodyAreas: builder.query({
      queryFn: serviceQueryFactory(getDatalysBodyAreas),
    }),
    getCompetitions: builder.query({
      queryFn: serviceQueryFactory(getCompetitions),
    }),
    getInjuryOnset: builder.query({
      queryFn: serviceQueryFactory(getInjuryOnset),
    }),
    getIllnessOnset: builder.query({
      queryFn: serviceQueryFactory(getIllnessOnset),
    }),
    getPositions: builder.query({
      queryFn: serviceQueryFactory(() =>
        ajaxPromise({
          url: '/ui/medical/injuries/positions',
          contentType: 'application/json',
          method: 'GET',
        })
      ),
    }),
    getContactTypes: builder.query({
      queryFn: serviceQueryFactory(getContactTypes),
    }),
    getInjuryClassifications: builder.query({
      queryFn: (coding) => {
        let query;
        switch (coding) {
          case codingSystemKeys.DATALYS:
            query = getDatalysClassifications;
            break;
          case codingSystemKeys.CLINICAL_IMPRESSIONS:
            query = getClinicalImpressionsClassifications;
            break;
          default:
            // Using the same API hook for ICD coding.
            query = isV2MultiCodingSystem(coding)
              ? getCodingSystemV2Classifications
              : getInjuryOsicsClassifications;
            break;
        }
        const service = serviceQueryFactory(query);

        return service();
      },
    }),
    getIllnessClassifications: builder.query({
      queryFn: (coding) => {
        let query;
        switch (coding) {
          case codingSystemKeys.DATALYS:
            query = getDatalysClassifications;
            break;
          case codingSystemKeys.CLINICAL_IMPRESSIONS:
            query = getClinicalImpressionsClassifications;
            break;
          default:
            // Using the same API hook for ICD coding.
            query = isV2MultiCodingSystem(coding)
              ? getCodingSystemV2Classifications
              : getIllnessOsicsClassifications;
            break;
        }
        const service = serviceQueryFactory(query);

        return service();
      },
    }),
    getInjuryBodyAreas: builder.query({
      queryFn: (coding) => {
        let query;
        switch (coding) {
          case codingSystemKeys.DATALYS:
            query = getDatalysBodyAreas;
            break;
          case codingSystemKeys.CLINICAL_IMPRESSIONS:
            query = getClinicalImpressionsBodyAreas;
            break;
          default:
            // Using the same API hook for ICD coding.
            query = isV2MultiCodingSystem(coding)
              ? getBodyAreasMultiCodingV2
              : getInjuryOsicsBodyAreas;
            break;
        }
        const service = serviceQueryFactory(query);

        return service();
      },
    }),
    getIllnessBodyAreas: builder.query({
      queryFn: (coding) => {
        let query;
        switch (coding) {
          case codingSystemKeys.DATALYS:
            query = getDatalysBodyAreas;
            break;
          case codingSystemKeys.CLINICAL_IMPRESSIONS:
            query = getClinicalImpressionsBodyAreas;
            break;
          default:
            // Using the same API hook for ICD coding.
            query = isV2MultiCodingSystem(coding)
              ? getBodyAreasMultiCodingV2
              : getIllnessOsicsBodyAreas;
            break;
        }
        const service = serviceQueryFactory(query);

        return service();
      },
    }),
  }),
});

export const {
  useGetActivityGroupsQuery,
  useGetGradesQuery,
  useGetSidesQuery,
  useGetSidesV2Query,
  useGetInjuryOsicsQuery,
  useGetIllnessOsicsQuery,
  useGetInjuryOsicsPathologiesQuery,
  useGetIllnessOsicsPathologiesQuery,
  useGetInjuryOsicsClassificationsQuery,
  useGetIllnessOsicsClassificationsQuery,
  useGetInjuryOsicsBodyAreasQuery,
  useGetIllnessOsicsBodyAreasQuery,
  useGetClinicalImpressionsClassificationsQuery,
  useGetClinicalImpressionsBodyAreasQuery,
  useGetDatalysClassificationsQuery,
  useGetDatalysBodyAreasQuery,
  useGetIllnessOnsetQuery,
  useGetInjuryOnsetQuery,
  useGetPositionsQuery,
  useGetContactTypesQuery,
  useGetCompetitionsQuery,
  useGetInjuryClassificationsQuery,
  useGetIllnessClassificationsQuery,
  useGetInjuryBodyAreasQuery,
  useGetIllnessBodyAreasQuery,
} = medicalApi;
