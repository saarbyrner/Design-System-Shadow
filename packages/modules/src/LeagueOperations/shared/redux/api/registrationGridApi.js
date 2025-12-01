// @flow
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import { bulkUpdateAthleteLabels } from '@kitman/services/src/services/dynamicCohorts';
import { leagueOperationsApi } from './leagueOperations';
import fetchRegistrationGrids from '../../services/fetchRegistrationGrids';
import fetchOrganisationLabelCategoriesGroups from '../../services/fetchOrganisationLabelCategoriesGroups';
import fetchAssociationLabelCategoriesGroups from '../../services/fetchAssociationLabelCategoriesGroups';
import { TAGS } from './utils';

export const registrationGridApi = leagueOperationsApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchRegistrationGrids: builder.query({
      queryFn: serviceQueryFactory(fetchRegistrationGrids),
      providesTags: [TAGS.REGISTRATION_GRID],
    }),
    bulkUpdateAthleteLabels: builder.mutation({
      queryFn: serviceQueryFactory(bulkUpdateAthleteLabels),
      invalidatesTags: [
        TAGS.HOMEGROWN_ASSOCIATION_TOTALS,
        TAGS.HOMEGROWN_ORGANISATION_TOTALS,
      ],
    }),
    fetchOrganisationLabelCategoriesGroups: builder.query({
      queryFn: serviceQueryFactory(({ id }) =>
        fetchOrganisationLabelCategoriesGroups({ id })
      ),
      providesTags: [TAGS.HOMEGROWN_ORGANISATION_TOTALS],
      keepUnusedDataFor: 60,
    }),
    fetchAssociationLabelCategoriesGroups: builder.query({
      queryFn: serviceQueryFactory(({ id, organisationId }) =>
        fetchAssociationLabelCategoriesGroups({
          id,
          organisationId,
        })
      ),
      providesTags: [TAGS.HOMEGROWN_ASSOCIATION_TOTALS],
      keepUnusedDataFor: 60,
    }),
  }),
  overrideExisting: false,
});

export const {
  useFetchRegistrationGridsQuery,
  useBulkUpdateAthleteLabelsMutation,
  useFetchOrganisationLabelCategoriesGroupsQuery,
  useFetchAssociationLabelCategoriesGroupsQuery,
  useLazyFetchOrganisationLabelCategoriesGroupsQuery,
  useLazyFetchAssociationLabelCategoriesGroupsQuery,
} = registrationGridApi;
