// @flow
import { createApi } from '@reduxjs/toolkit/query/react';
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import {
  createAssessmentGroup,
  getAssessmentGroups,
  getAthleteReviewTypes,
  getAssessmentTemplates,
  getDashboards,
} from '@kitman/services';
import getDevelopmentGoals from '@kitman/modules/src/PlanningHub/src/services/getDevelopmentGoals';
import getDevelopmentGoalCompletionTypes from '@kitman/modules/src/PlanningHub/src/services/getDevelopmentGoalCompletionTypes';
import getDevelopmentGoalTypes from '@kitman/modules/src/PlanningHub/src/services/getDevelopmentGoalTypes';
import saveDevelopmentGoal from '@kitman/modules/src/PlanningHub/src/services/saveDevelopmentGoal';
import deleteDevelopmentGoal from '@kitman/modules/src/PlanningHub/src/services/deleteDevelopmentGoal';
import getPrinciples from '@kitman/modules/src/PlanningHub/src/services/getPrinciples';
import getDevelopmentGoalStandardNames from '@kitman/services/src/services/developmentGoalStandardNames/getDevelopmentGoalStandardNames';
import searchReviewList from '../services/searchReviewList';
import saveReview from '../services/saveReview';
import getReview from '../services/getReview';
import editReview from '../services/editReview';
import updateDevelopmentGoal from '../services/updateDevelopmentGoal';
import deleteReviewComment from '../services/deleteReviewComment';

const TAGS = {
  REVIEW_LIST: 'REVIEW_LIST',
  DEVELOPMENT_GOALS: 'DEVELOPMENT_GOALS',
  ASSESSMENTS: 'ASSESSMENTS',
};

export const developmentGoalsApi = createApi({
  reducerPath: 'developmentGoalsApi',
  tagTypes: [TAGS.REVIEW_LIST, TAGS.DEVELOPMENT_GOALS, TAGS.ASSESSMENTS],
  endpoints: (builder) => ({
    getAthleteAssessmentGroups: builder.query({
      queryFn: serviceQueryFactory(({ athleteId }) =>
        getAssessmentGroups({
          athlete_ids: [athleteId],
        })
      ),
      providesTags: [TAGS.ASSESSMENTS],
    }),
    getAthleteReviewTypes: builder.query({
      queryFn: serviceQueryFactory(getAthleteReviewTypes),
    }),
    getAssessmentTemplates: builder.query({
      queryFn: serviceQueryFactory(getAssessmentTemplates),
    }),
    getDevelopmentGoals: builder.query({
      queryFn: serviceQueryFactory(getDevelopmentGoals),
    }),
    getDevelopmentGoalCompletionTypes: builder.query({
      queryFn: serviceQueryFactory(getDevelopmentGoalCompletionTypes),
    }),
    getDashboards: builder.query({
      queryFn: serviceQueryFactory(({ squadId }) => getDashboards(squadId)),
    }),
    getDevelopmentGoalStandardNames: builder.query({
      queryFn: serviceQueryFactory(getDevelopmentGoalStandardNames),
    }),
    getDevelopmentGoalTypes: builder.query({
      queryFn: serviceQueryFactory(getDevelopmentGoalTypes),
    }),
    getPrinciples: builder.query({
      queryFn: serviceQueryFactory(getPrinciples),
    }),
    getReview: builder.query({
      queryFn: serviceQueryFactory(({ athleteId, reviewId }) =>
        getReview(athleteId, reviewId)
      ),
    }),
    saveDevelopmentGoal: builder.mutation({
      queryFn: serviceQueryFactory(saveDevelopmentGoal),
      invalidatesTags: [TAGS.DEVELOPMENT_GOALS],
    }),
    deleteDevelopmentGoal: builder.mutation({
      queryFn: serviceQueryFactory(deleteDevelopmentGoal),
      invalidatesTags: [TAGS.DEVELOPMENT_GOALS],
    }),
    searchReviewList: builder.query({
      queryFn: serviceQueryFactory(({ athleteId, filters, nextId }) =>
        searchReviewList(athleteId, filters, nextId)
      ),
      serializeQueryArgs: ({ queryArgs: { filters }, endpointName }) =>
        `${JSON.stringify(filters)}_${endpointName}`,
      forceRefetch: ({ currentArg, previousArg }) =>
        JSON.stringify(currentArg) !== JSON.stringify(previousArg),
      merge: (currentCache, newItems, meta) => {
        if (meta.arg.nextId === null) {
          // eslint-disable-next-line no-param-reassign
          currentCache.events = newItems.events;
        } else {
          currentCache.events.push(...newItems.events);
        }
        // eslint-disable-next-line no-param-reassign
        currentCache.next_id = newItems.next_id;
      },
      providesTags: [TAGS.REVIEW_LIST],
    }),
    createAssessment: builder.mutation({
      queryFn: serviceQueryFactory((assessmentGroup) =>
        createAssessmentGroup(assessmentGroup)
      ),
      invalidatesTags: [TAGS.ASSESSMENTS],
    }),
    saveReview: builder.mutation({
      queryFn: serviceQueryFactory(({ athleteId, form }) =>
        saveReview(athleteId, form)
      ),
      invalidatesTags: [TAGS.DEVELOPMENT_GOALS],
    }),
    editReview: builder.mutation({
      queryFn: serviceQueryFactory(({ athleteId, reviewId, form }) =>
        editReview({ athleteId, reviewId, review: form })
      ),
      invalidatesTags: [TAGS.DEVELOPMENT_GOALS, TAGS.REVIEW_LIST],
    }),
    updateDevelopmentGoal: builder.mutation({
      queryFn: serviceQueryFactory(({ athleteId, reviewId, developmentGoal }) =>
        updateDevelopmentGoal({
          athleteId,
          reviewId,
          developmentGoal,
        })
      ),
    }),
    deleteReviewComment: builder.mutation({
      queryFn: serviceQueryFactory(deleteReviewComment),
    }),
  }),
});

export const {
  useGetAthleteAssessmentGroupsQuery,
  useGetAssessmentTemplatesQuery,
  useGetAthleteReviewTypesQuery,
  useGetDevelopmentGoalsQuery,
  useGetDevelopmentGoalCompletionTypesQuery,
  useGetDevelopmentGoalStandardNamesQuery,
  useGetDevelopmentGoalTypesQuery,
  useGetDashboardsQuery,
  useGetPrinciplesQuery,
  useLazyGetReviewQuery,
  useSaveDevelopmentGoalMutation,
  useDeleteDevelopmentGoalMutation,
  useDeleteReviewCommentMutation,
  useLazySearchReviewListQuery,
  useSaveReviewMutation,
  useCreateAssessmentMutation,
  useEditReviewMutation,
  useUpdateDevelopmentGoalMutation,
} = developmentGoalsApi;
