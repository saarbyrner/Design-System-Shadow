// @flow
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import fetchCompletedRequirements from '../../services/fetchCompletedRequirements';
import updateRequirementSection from '../../services/updateRequirementSection';
import applyRequirementStatus from '../../services/applyRequirementStatus';
import { leagueOperationsApi } from './leagueOperations';
import { TAGS } from './utils';

export const requirementSectionApi = leagueOperationsApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchCompletedRequirements: builder.query({
      queryFn: serviceQueryFactory(fetchCompletedRequirements),
      providesTags: [TAGS.REQUIREMENT_SECTION],
      invalidatesTags: [TAGS.REQUIREMENT_SECTION],
    }),
    updateRequirementSection: builder.mutation({
      queryFn: serviceQueryFactory(updateRequirementSection),
      invalidatesTags: [
        TAGS.REQUIREMENT_SECTION,
        TAGS.REGISTRATION_PROFILE,
        TAGS.REQUIREMENTS,
      ],
    }),
    applyRequirementStatus: builder.mutation({
      queryFn: serviceQueryFactory(applyRequirementStatus),
      invalidatesTags: [
        TAGS.REQUIREMENT_SECTION,
        TAGS.REGISTRATION_PROFILE,
        TAGS.REQUIREMENTS,
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useFetchCompletedRequirementsQuery,
  useUpdateRequirementSectionMutation,
  useApplyRequirementStatusMutation,
} = requirementSectionApi;
