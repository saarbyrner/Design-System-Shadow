// @flow
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import fetchRequirementSections from '../../services/fetchRequirementSections';
import fetchRequirementSectionHistory from '../../services/fetchRequirementSectionHistory';
import fetchIsRegistrationSubmittable from '../../services/fetchIsRegistrationSubmittable';
import { leagueOperationsApi } from './leagueOperations';
import { TAGS } from './utils';

export const registrationRequirementsApi = leagueOperationsApi.injectEndpoints({
  tagTypes: Object.keys(TAGS),
  endpoints: (builder) => ({
    fetchRequirementSections: builder.query({
      queryFn: serviceQueryFactory(fetchRequirementSections),
      providesTags: [TAGS.REQUIREMENTS],
    }),
    fetchRequirementSectionHistory: builder.query({
      queryFn: serviceQueryFactory(fetchRequirementSectionHistory),
      providesTags: [TAGS.REQUIREMENTS],
    }),
    fetchIsRegistrationSubmittable: builder.query({
      queryFn: serviceQueryFactory(fetchIsRegistrationSubmittable),
      providesTags: [TAGS.REQUIREMENTS],
    }),
  }),
  overrideExisting: false,
});

export const {
  useFetchRequirementSectionsQuery,
  useFetchRequirementSectionHistoryQuery,
  useFetchIsRegistrationSubmittableQuery,
} = registrationRequirementsApi;
