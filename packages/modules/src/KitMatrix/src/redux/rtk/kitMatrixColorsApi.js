// @flow
import { createApi } from '@reduxjs/toolkit/query/react';
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import getKitMatrixColors from '@kitman/services/src/services/kitMatrix/getKitMatrixColors';
import type { KitMatrixColor } from '@kitman/services/src/services/kitMatrix/getKitMatrixColors';

export const kitMatrixColorsApi = createApi({
  reducerPath: 'kitMatrixColorsApi',
  endpoints: (builder) => ({
    getKitMatrixColors: builder.query<Array<KitMatrixColor>>({
      queryFn: serviceQueryFactory(getKitMatrixColors),
      serializeQueryArgs: ({ endpointName }) => endpointName,
    }),
  }),
});

export const { useGetKitMatrixColorsQuery } = kitMatrixColorsApi;
