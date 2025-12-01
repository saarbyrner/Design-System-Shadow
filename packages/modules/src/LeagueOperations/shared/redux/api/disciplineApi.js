// @flow
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import { getCompetitions } from '@kitman/services';
import { leagueOperationsApi } from './leagueOperations';
import searchDisciplineUserList from '../../services/searchDisciplineUserList';
import searchDisciplineAthleteList from '../../services/searchDisciplineAthleteList';
import createDisciplinaryIssue from '../../services/createDisciplinaryIssue';
import updateDisciplinaryIssue from '../../services/updateDisciplinaryIssue';
import deleteDisciplinaryIssue from '../../services/deleteDisciplinaryIssue';
import fetchDisciplineStatuses from '../../services/fetchDisciplineStatuses';
import fetchDisciplineSuspensionIssue from '../../services/fetchDisciplineSuspensionIssue';
import fetchNextGameDisciplineIssue from '../../services/fetchNextGameDisciplineIssue';
import { TAGS, paginatedMergeStrategy } from './utils';

export const REDUCER_KEY: string = 'LeagueOperations.discipline.services';

export const disciplineApi = leagueOperationsApi.injectEndpoints({
  endpoints: (builder) => ({
    searchDisciplineUserList: builder.query({
      queryFn: serviceQueryFactory(searchDisciplineUserList),
      providesTags: [TAGS.DISCIPLINES],
      serializeQueryArgs: ({ endpointName }) => endpointName,
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
      merge: paginatedMergeStrategy,
    }),
    searchDisciplineAthleteList: builder.query({
      queryFn: serviceQueryFactory(searchDisciplineAthleteList),
      providesTags: [TAGS.DISCIPLINES],
      serializeQueryArgs: ({ endpointName }) => endpointName,
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
      merge: paginatedMergeStrategy,
    }),
    // Temporary until QA is complete
    searchDisciplineAthleteListNoMergeStrategy: builder.query({
      queryFn: serviceQueryFactory(searchDisciplineAthleteList),
      providesTags: [TAGS.DISCIPLINES],
      serializeQueryArgs: ({ endpointName }) => endpointName,
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
    searchDisciplineUserListNoMergeStrategy: builder.query({
      queryFn: serviceQueryFactory(searchDisciplineUserList),
      providesTags: [TAGS.DISCIPLINES],
      serializeQueryArgs: ({ endpointName }) => endpointName,
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
    createDisciplinaryIssue: builder.mutation({
      queryFn: serviceQueryFactory(createDisciplinaryIssue),
      invalidatesTags: [TAGS.DISCIPLINES],
    }),
    updateDisciplinaryIssue: builder.mutation({
      queryFn: serviceQueryFactory(updateDisciplinaryIssue),
      invalidatesTags: [TAGS.DISCIPLINES],
    }),
    deleteDisciplinaryIssue: builder.mutation({
      queryFn: serviceQueryFactory(deleteDisciplinaryIssue),
      invalidatesTags: [TAGS.DISCIPLINES],
    }),
    searchDisciplineDropdownAthleteList: builder.query({
      queryFn: serviceQueryFactory(searchDisciplineAthleteList),
      providesTags: [TAGS.DISCIPLINES],
    }),
    searchDisciplineDropdownUserList: builder.query({
      queryFn: serviceQueryFactory(searchDisciplineUserList),
      providesTags: [TAGS.DISCIPLINES],
    }),
    fetchDisciplineStatuses: builder.query({
      queryFn: serviceQueryFactory(fetchDisciplineStatuses),
      providesTags: [TAGS.DISCIPLINES],
    }),
    fetchDisciplineCompetitions: builder.query({
      queryFn: serviceQueryFactory(getCompetitions),
      providesTags: [TAGS.DISCIPLINES],
    }),
    fetchDisciplineSuspensionIssue: builder.query({
      queryFn: serviceQueryFactory(fetchDisciplineSuspensionIssue),
      providesTags: [TAGS.DISCIPLINES],
    }),
    fetchNextGameDisciplineIssue: builder.query({
      queryFn: serviceQueryFactory(fetchNextGameDisciplineIssue),
      providesTags: [TAGS.DISCIPLINES],
      keepUnusedDataFor: 0,
    }),
  }),
  overrideExisting: false,
});

export const {
  useFetchDisciplineStatusesQuery,
  useSearchDisciplineUserListQuery,
  useSearchDisciplineAthleteListQuery,
  useSearchDisciplineAthleteListNoMergeStrategyQuery,
  useSearchDisciplineUserListNoMergeStrategyQuery,
  useCreateDisciplinaryIssueMutation,
  useUpdateDisciplinaryIssueMutation,
  useDeleteDisciplinaryIssueMutation,
  useSearchDisciplineDropdownAthleteListQuery,
  useLazySearchDisciplineDropdownUserListQuery,
  useLazySearchDisciplineDropdownAthleteListQuery,
  useSearchDisciplineDropdownUserListQuery,
  useFetchDisciplineCompetitionsQuery,
  useFetchDisciplineSuspensionIssueQuery,
  useFetchNextGameDisciplineIssueQuery,
  endpoints: {
    searchDisciplineUserList: {
      useQueryState: useSearchDisciplineUserListQueryState,
    },
    searchDisciplineAthleteList: {
      useQueryState: useSearchDisciplineAthleteListQueryState,
    },
  },
} = disciplineApi;
