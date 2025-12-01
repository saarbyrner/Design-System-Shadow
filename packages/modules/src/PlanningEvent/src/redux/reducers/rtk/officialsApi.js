// @flow
import { createApi } from '@reduxjs/toolkit/query/react';
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import getOfficialUsers from '@kitman/services/src/services/planning/getOfficialUsers';
import setGameOfficials from '@kitman/services/src/services/gameOfficials/setGameOfficials';
import getGameOfficials from '@kitman/services/src/services/gameOfficials/getGameOfficials';

export const TAGS = {
  GAME_OFFICIALS: 'GAME_OFFICIALS',
};

export const officialsApi = createApi({
  reducerPath: 'officialsApi',
  tagTypes: [TAGS.GAME_OFFICIALS],
  endpoints: (builder) => ({
    getGameOfficials: builder.query({
      queryFn: serviceQueryFactory(getGameOfficials),
      providesTags: [TAGS.GAME_OFFICIALS],
    }),
    getOfficialUsers: builder.query({
      queryFn: serviceQueryFactory(getOfficialUsers),
    }),
    setGameOfficials: builder.mutation({
      queryFn: serviceQueryFactory(setGameOfficials),
      invalidatesTags: [TAGS.GAME_OFFICIALS],
    }),
  }),
});

export const {
  useGetOfficialUsersQuery,
  useGetGameOfficialsQuery,
  useSetGameOfficialsMutation,
} = officialsApi;
