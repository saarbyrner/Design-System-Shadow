// @flow
import { createApi } from '@reduxjs/toolkit/query/react';
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';

import searchConsentAthletes from '@kitman/services/src/services/consent/searchAthletes';
import saveAthletesConsent from '@kitman/services/src/services/consent/saveAthletesConsent';
import saveSingleAthleteConsent from '@kitman/services/src/services/consent/saveSingleAthleteConsent';
import updateSingleAthleteConsent from '@kitman/services/src/services/consent/updateSingleAthleteConsent';

import fetchRulesets from './api/fetchRulesets';
import fetchShortRulesets from './api/fetchShortRulesets';
import fetchVersions from './api/fetchVersions';
import fetchAssignees from './api/fetchAssignees';
import fetchVersion from './api/fetchVersion';
import fetchPredicateOptions from './api/fetchPredicateOptions';

import updateOwnerVersions from './api/updateOwnerVersions';
import updateOwnerRulesets from './api/updateOwnerRulesets';
import updateOwnerRuleset from './api/updateOwnerRuleset';
import updateAssignees from './api/updateAssignees';
import saveCondition from './api/saveCondition';
import deleteCondition from './api/deleteCondition';
import publishVersion from './api/publishVersion';
import saveFollowupQuestions from './api/saveFollowupQuestions';
import saveVersion from './api/saveVersion';

const TAGS = {
  RULESETS: 'RULESETS',
  SHORT_RULESETS: 'SHORT_RULESETS',
  VERSIONS: 'VERSIONS',
  ASSIGNEES: 'ASSIGNEES',
  VERSION: 'VERSION',
  ATHLETES: 'ATHLETES',
};

export const conditionalFieldsApi = createApi({
  reducerPath: 'conditionalFieldsApi',
  tagTypes: [
    TAGS.RULESETS,
    TAGS.VERSIONS,
    TAGS.ASSIGNEES,
    TAGS.VERSION,
    TAGS.ATHLETES,
  ],
  endpoints: (builder) => ({
    fetchPredicateOptions: builder.query({
      queryFn: serviceQueryFactory((id) => fetchPredicateOptions(id)),
      keepUnusedDataFor: 300,
    }),
    fetchRulesets: builder.query({
      queryFn: serviceQueryFactory(() => fetchRulesets()),
      providesTags: [TAGS.RULESETS],
      keepUnusedDataFor: 300,
    }),
    fetchShortRulesets: builder.query({
      queryFn: serviceQueryFactory(() => fetchShortRulesets()),
      providesTags: [TAGS.SHORT_RULESETS],
      keepUnusedDataFor: 300,
    }),
    fetchRuleset: builder.query({
      queryFn: serviceQueryFactory((id) => fetchVersions(id)),
      providesTags: [TAGS.VERSIONS],
      keepUnusedDataFor: 300,
    }),
    fetchVersion: builder.query({
      queryFn: serviceQueryFactory((args) => fetchVersion(args)),
      keepUnusedDataFor: 300,
      providesTags: [TAGS.VERSION],
    }),
    updateOwnerVersions: builder.mutation({
      queryFn: serviceQueryFactory((args) => updateOwnerVersions(args)),
      invalidatesTags: [TAGS.VERSIONS],
    }),
    updateOwnerRulesets: builder.mutation({
      queryFn: serviceQueryFactory(() => updateOwnerRulesets()),
      invalidatesTags: [
        TAGS.RULESETS,
        TAGS.VERSIONS,
        TAGS.ASSIGNEES,
        TAGS.VERSION,
      ],
    }),
    updateOwnerRuleset: builder.mutation({
      queryFn: serviceQueryFactory((args) => updateOwnerRuleset(args)),
      invalidatesTags: [TAGS.RULESETS, TAGS.VERSIONS, TAGS.ASSIGNEES],
    }),
    fetchAssignees: builder.query({
      queryFn: serviceQueryFactory((versionId) => fetchAssignees(versionId)),
      providesTags: [TAGS.ASSIGNEES],
      keepUnusedDataFor: 300,
    }),
    updateAssignees: builder.mutation({
      queryFn: serviceQueryFactory((args) => updateAssignees(args)),
      invalidatesTags: [TAGS.RULESETS, TAGS.VERSIONS, TAGS.ASSIGNEES],
    }),
    saveCondition: builder.mutation({
      queryFn: serviceQueryFactory((args) => saveCondition(args)),
      invalidatesTags: [TAGS.VERSION],
    }),
    deleteCondition: builder.mutation({
      queryFn: serviceQueryFactory((args) => deleteCondition(args)),
      invalidatesTags: [TAGS.VERSION],
    }),
    saveVersion: builder.mutation({
      queryFn: serviceQueryFactory((args) => saveVersion(args)),
      invalidatesTags: [TAGS.VERSION, TAGS.VERSIONS],
    }),
    publishVersion: builder.mutation({
      queryFn: serviceQueryFactory((args) => publishVersion(args)),
      invalidatesTags: [
        TAGS.RULESETS,
        TAGS.VERSIONS,
        TAGS.ASSIGNEES,
        TAGS.VERSION,
      ],
    }),
    saveFollowupQuestions: builder.mutation({
      queryFn: serviceQueryFactory((args) => saveFollowupQuestions(args)),
      invalidatesTags: [TAGS.VERSION],
    }),
    searchConsentAthletes: builder.query({
      queryFn: serviceQueryFactory((filters) => searchConsentAthletes(filters)),
      providesTags: [TAGS.ATHLETES],
      keepUnusedDataFor: 300,
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
    saveAthletesConsent: builder.mutation({
      queryFn: serviceQueryFactory((args) => saveAthletesConsent(args)),
      invalidatesTags: [TAGS.ATHLETES],
    }),
    saveSingleAthleteConsent: builder.mutation({
      queryFn: serviceQueryFactory((args) => saveSingleAthleteConsent(args)),
      invalidatesTags: [TAGS.ATHLETES],
    }),
    updateSingleAthleteConsent: builder.mutation({
      queryFn: serviceQueryFactory((args) => updateSingleAthleteConsent(args)),
      invalidatesTags: [TAGS.ATHLETES],
    }),
  }),
});

export const {
  useFetchPredicateOptionsQuery,
  useFetchRulesetsQuery,
  useFetchRulesetQuery,
  useFetchShortRulesetsQuery,
  useFetchVersionQuery,
  useUpdateOwnerVersionsMutation,
  useUpdateOwnerRulesetsMutation,
  useUpdateOwnerRulesetMutation,
  useFetchAssigneesQuery,
  useUpdateAssigneesMutation,
  useSaveConditionMutation,
  useDeleteConditionMutation,
  usePublishVersionMutation,
  useSaveFollowupQuestionsMutation,
  useSaveVersionMutation,
  useSearchConsentAthletesQuery,
  useSaveAthletesConsentMutation,
  useSaveSingleAthleteConsentMutation,
  useUpdateSingleAthleteConsentMutation,
} = conditionalFieldsApi;
