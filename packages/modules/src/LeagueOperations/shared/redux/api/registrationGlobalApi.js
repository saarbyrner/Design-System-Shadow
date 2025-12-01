// @flow
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import fetchUserData from '@kitman/services/src/services/fetchUserData';
import { getUserSquadHistory } from '@kitman/services';
import { getAllLabels } from '@kitman/services/src/services/OrganisationSettings';
import { confirmFileUpload } from '@kitman/services/src/services/documents/generic/redux/services/apis/confirmFileUpload';
import { leagueOperationsApi } from './leagueOperations';

import searchOrganisationList from '../../services/searchOrganisationList';
import searchSquadList from '../../services/searchSquadList';
import searchAthleteList from '../../services/searchAthleteList';
import searchUserList from '../../services/searchUserList';
import fetchRegistrationStatusOptions from '../../services/fetchRegistrationStatusOptions';
import fetchAthlete from '../../services/fetchAthlete';
import fetchUser from '../../services/fetchUser';
import fetchRegistrationDetails from '../../services/fetchRegistrationDetails';
import fetchRegistrationStatusReasons from '../../services/fetchRegistrationStatusReasons';
import createUserRegistrationStatus from '../../services/createUserRegistrationStatus';
import updateUserRegistrationStatus from '../../services/updateUserRegistrationStatus';
import searchHomegrownList from '../../services/homegrown/searchHomegrownList';
import createHomegrownSubmission from '../../services/homegrown/createHomegrownSubmission';
import archiveHomegrownSubmission from '../../services/homegrown/archiveHomegrownSubmission';
import updateHomegrownSubmission from '../../services/homegrown/updateHomegrownSubmission';

import { TAGS, paginatedMergeStrategy } from './utils';

export const registrationGlobalApi = leagueOperationsApi.injectEndpoints({
  endpoints: (builder) => ({
    searchOrganisationList: builder.query({
      queryFn: serviceQueryFactory(searchOrganisationList),
      serializeQueryArgs: ({ endpointName }) => endpointName,
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
      merge: paginatedMergeStrategy,
      providesTags: [TAGS.ORGANISATIONS],
    }),
    fetchUserData: builder.query({
      queryFn: serviceQueryFactory(fetchUserData),
      providesTags: [TAGS.REGISTRATION_PROFILE],
    }),
    fetchRegistrationStatusOptions: builder.query({
      queryFn: serviceQueryFactory(fetchRegistrationStatusOptions),
    }),
    fetchRegistrationStatusReasons: builder.query({
      queryFn: serviceQueryFactory(fetchRegistrationStatusReasons),
    }),
    searchSquadList: builder.query({
      queryFn: serviceQueryFactory(searchSquadList),
      serializeQueryArgs: ({ endpointName }) => endpointName,
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
      merge: paginatedMergeStrategy,
    }),
    searchAthleteList: builder.query({
      queryFn: serviceQueryFactory(searchAthleteList),
      serializeQueryArgs: ({ endpointName }) => endpointName,
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
      merge: paginatedMergeStrategy,
      providesTags: [TAGS.ATHLETES],
    }),
    searchUserList: builder.query({
      queryFn: serviceQueryFactory(searchUserList),
      serializeQueryArgs: ({ endpointName }) => endpointName,
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
      merge: paginatedMergeStrategy,
      providesTags: [TAGS.STAFF],
    }),
    getAllLabels: builder.query({ queryFn: serviceQueryFactory(getAllLabels) }),
    /**
     * @deprecated
     * Currently live to support existing registration.
     * Use fetchRegistrationProfile instead
     */
    fetchAthlete: builder.query({
      queryFn: serviceQueryFactory((id) => fetchAthlete(id)),
      providesTags: [TAGS.REGISTRATION_PROFILE],
    }),
    /**
     * @deprecated
     * Currently live to support existing registration.
     * Use fetchRegistrationProfile instead
     */
    fetchUser: builder.query({
      queryFn: serviceQueryFactory((id) => fetchUser(id)),
      providesTags: [TAGS.REGISTRATION_PROFILE],
    }),
    fetchRegistrations: builder.query({
      queryFn: serviceQueryFactory((id) => fetchRegistrationDetails(id)),
      providesTags: [TAGS.REGISTRATION_PROFILE],
    }),
    getUserSquadHistory: builder.query({
      queryFn: serviceQueryFactory((id) => getUserSquadHistory(id)),
      providesTags: [TAGS.REGISTRATION_SQUAD_HISTORY],
    }),
    createUserRegistrationStatus: builder.mutation({
      queryFn: serviceQueryFactory(createUserRegistrationStatus),
      invalidatesTags: [TAGS.ATHLETES, TAGS.STAFF, TAGS.REGISTRATION_HISTORY],
    }),
    updateUserRegistrationStatus: builder.mutation({
      queryFn: serviceQueryFactory(updateUserRegistrationStatus),
      invalidatesTags: [TAGS.REGISTRATION_HISTORY, TAGS.ATHLETES, TAGS.STAFF],
    }),
    searchHomegrownList: builder.query({
      queryFn: serviceQueryFactory(searchHomegrownList),
      serializeQueryArgs: ({ endpointName }) => endpointName,
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
      merge: paginatedMergeStrategy,
      providesTags: [TAGS.HOMEGROWN],
    }),
    createHomegrownSubmission: builder.mutation({
      queryFn: serviceQueryFactory(createHomegrownSubmission),
    }),
    confirmHomegrownFileUpload: builder.mutation({
      queryFn: serviceQueryFactory((fileId: number) =>
        confirmFileUpload(fileId)
      ),
      invalidatesTags: [TAGS.HOMEGROWN],
    }),
    updateHomegrownSubmission: builder.mutation({
      queryFn: serviceQueryFactory(({ id, submission }) =>
        updateHomegrownSubmission(id, submission)
      ),
      invalidatesTags: (result, error, { skipInvalidation }) =>
        skipInvalidation ? [] : [TAGS.HOMEGROWN],
      merge: paginatedMergeStrategy,
    }),
    archiveHomegrownSubmission: builder.mutation({
      queryFn: serviceQueryFactory((id) => archiveHomegrownSubmission(id)),
      invalidatesTags: [TAGS.HOMEGROWN],
      merge: paginatedMergeStrategy,
    }),
  }),
  overrideExisting: false,
});

export const {
  useSearchOrganisationListQuery,
  useFetchRegistrationStatusOptionsQuery,
  useFetchRegistrationStatusReasonsQuery,
  useFetchUserDataQuery,
  useSearchSquadListQuery,
  useSearchAthleteListQuery,
  useSearchUserListQuery,
  useSearchHomegrownListQuery,
  useGetAllLabelsQuery,
  useFetchAthleteQuery,
  useFetchUserQuery,
  useFetchRegistrationsQuery,
  useGetUserSquadHistoryQuery,
  useCreateUserRegistrationStatusMutation,
  useUpdateUserRegistrationStatusMutation,
  useConfirmHomegrownFileUploadMutation,
  useCreateHomegrownSubmissionMutation,
  useUpdateHomegrownSubmissionMutation,
  useArchiveHomegrownSubmissionMutation,
} = leagueOperationsApi;
