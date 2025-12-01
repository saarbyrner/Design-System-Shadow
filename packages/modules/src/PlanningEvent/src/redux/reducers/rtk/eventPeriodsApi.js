// @flow
import { createApi } from '@reduxjs/toolkit/query/react';
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import type { GamePeriod } from '@kitman/common/src/types/GameEvent';
import { getEventPeriods } from '@kitman/modules/src/PlanningEvent/src/services/eventPeriods';

export const eventPeriodsApi = createApi({
  reducerPath: 'eventPeriodsApi',
  endpoints: (builder) => ({
    getEventPeriods: builder.query<Array<GamePeriod>>({
      queryFn: serviceQueryFactory((args) => getEventPeriods(args)),
    }),
  }),
});

export const { useLazyGetEventPeriodsQuery } = eventPeriodsApi;
