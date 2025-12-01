// @flow
import { createApi } from '@reduxjs/toolkit/query/react';
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import getPlanningEvent from '@kitman/modules/src/PlanningHub/src/services/getPlanningHubEvent';
import updateGameInformation from '@kitman/modules/src/PlanningHub/src/services/updateGameInformation';
import saveEvent from '@kitman/modules/src/PlanningEvent/src/services/saveEvent';
import { isEqual } from 'lodash';

export const TAGS = {
  GAME_INFORMATION: 'GAME_INFORMATION',
  PARENT_EVENT: 'PARENT_EVENT',
  CHILD_EVENT: 'CHILD_EVENT',
};

export const planningEventApi = createApi({
  reducerPath: 'planningEventApi',
  tagTypes: [TAGS.GAME_INFORMATION],
  keepUnusedDataFor: 0,
  endpoints: (builder) => ({
    getPlanningEvent: builder.query({
      queryFn: serviceQueryFactory(getPlanningEvent),
      providesTags: (result, error, arg) => {
        const isParentEvent = isEqual(Object.keys(arg), [
          'eventId',
          'originalStartTime',
          'showAthletesAndStaff',
          'includeDmrStatus',
          'includeDmrBlockedTime',
        ]);
        return isParentEvent
          ? [TAGS.GAME_INFORMATION, TAGS.PARENT_EVENT]
          : [TAGS.GAME_INFORMATION, TAGS.CHILD_EVENT];
      },
    }),
    updatePlanningEvent: builder.mutation({
      queryFn: serviceQueryFactory(saveEvent),
      invalidatesTags: [],
    }),
    updateGameInformation: builder.mutation({
      queryFn: serviceQueryFactory(updateGameInformation),
      invalidatesTags: [TAGS.PARENT_EVENT],
      onQueryStarted: async (
        uniqueIdentifier,
        { dispatch, queryFulfilled, getState }
      ) => {
        try {
          const { data } = await queryFulfilled;

          // get args for the cached getPlanningEvent query
          const currentQuery = Object.values(
            getState().planningEventApi?.queries || {}
          )?.find(
            // $FlowIgnore[incompatible-use] - endpointName exists at this point
            (api) => api.endpointName === 'getPlanningEvent'
          );

          const updatedEvent = data?.event;

          const {
            // $FlowIgnore[incompatible-use] - originalArgs exists at this point
            originalArgs: currentArgs = {},
            // $FlowIgnore[incompatible-use] - data exists at this point
            data: { event: currentEvent } = {},
          } = currentQuery || {};

          // modifies the redux planningEventApi state with the updated data
          if (updatedEvent && currentArgs) {
            dispatch(
              planningEventApi.util.updateQueryData(
                'getPlanningEvent',
                currentArgs,
                () => {
                  return {
                    event: {
                      ...currentEvent,
                      ...updatedEvent,
                    },
                  };
                }
              )
            );
          }
        } catch {
          // Error intentionally ignored
        }
      },
    }),
  }),
});

export const {
  useGetPlanningEventQuery,
  useUpdatePlanningEventMutation,
  useUpdateGameInformationMutation,
} = planningEventApi;
