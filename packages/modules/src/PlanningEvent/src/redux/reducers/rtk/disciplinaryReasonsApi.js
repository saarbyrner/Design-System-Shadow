// @flow
import { createApi } from '@reduxjs/toolkit/query/react';
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import { getDisciplinaryReasons } from '@kitman/services';
import type { ActivityDisciplinaryReason } from '@kitman/common/src/types/GameEvent';

export const disciplinaryReasonsApi = createApi({
  reducerPath: 'disciplinaryReasonsApi',
  endpoints: (builder) => ({
    getDisciplinaryReasons: builder.query<Array<ActivityDisciplinaryReason>>({
      queryFn: serviceQueryFactory(getDisciplinaryReasons),
    }),
  }),
});

export const { useGetDisciplinaryReasonsQuery } = disciplinaryReasonsApi;
