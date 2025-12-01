// @flow
import { createApi } from '@reduxjs/toolkit/query/react';
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import getGameKitMatrices from '@kitman/services/src/services/kitMatrix/getGameKitMatrices';

export const gameKitMatricesApi = createApi({
  reducerPath: 'gameKitMatricesApi',
  endpoints: (builder) => ({
    getGameKitMatrices: builder.query({
      queryFn: serviceQueryFactory(getGameKitMatrices),
    }),
  }),
});

export const { useGetGameKitMatricesQuery } = gameKitMatricesApi;
