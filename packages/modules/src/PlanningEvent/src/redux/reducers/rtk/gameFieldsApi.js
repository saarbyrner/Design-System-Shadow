// @flow
import { createApi } from '@reduxjs/toolkit/query/react';
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import getGameFields from '@kitman/services/src/services/planning/getGameFields';
import type { GameFields } from '@kitman/services/src/services/planning/getGameFields';

export const gameFieldsApi = createApi({
  reducerPath: 'gameFieldsApi',
  endpoints: (builder) => ({
    getGameFields: builder.query<GameFields>({
      queryFn: serviceQueryFactory(getGameFields),
    }),
  }),
});

export const { useLazyGetGameFieldsQuery, useGetGameFieldsQuery } =
  gameFieldsApi;
