// @flow
import { createApi } from '@reduxjs/toolkit/query/react';
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import { getGameActivities } from '@kitman/modules/src/PlanningEvent/src/services/gameActivities';
import type { GameActivity } from '@kitman/common/src/types/GameEvent';

export const gameActivitiesApi = createApi({
  reducerPath: 'gameActivitiesApi',
  endpoints: (builder) => ({
    getGameActivities: builder.query<Array<GameActivity>>({
      queryFn: serviceQueryFactory((args) => getGameActivities(args)),
    }),
  }),
});

export const { useLazyGetGameActivitiesQuery } = gameActivitiesApi;
