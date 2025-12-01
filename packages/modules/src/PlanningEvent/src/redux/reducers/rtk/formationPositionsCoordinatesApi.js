// @flow
import { createApi } from '@reduxjs/toolkit/query/react';
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import getFormationPositionsCoordinates from '@kitman/services/src/services/planning/getFormationPositionsCoordinates';
import type { Coordinate } from '@kitman/common/src/types/PitchView';

export const formationPositionsCoordinatesApi = createApi({
  reducerPath: 'formationPositionsCoordinatesApi',
  endpoints: (builder) => ({
    getFormationPositionsCoordinates: builder.query<Array<Coordinate>>({
      queryFn: serviceQueryFactory(({ fieldId, formationId }) =>
        getFormationPositionsCoordinates({ fieldId, formationId })
      ),
    }),
  }),
});

export const {
  useGetFormationPositionsCoordinatesQuery,
  useLazyGetFormationPositionsCoordinatesQuery,
} = formationPositionsCoordinatesApi;
