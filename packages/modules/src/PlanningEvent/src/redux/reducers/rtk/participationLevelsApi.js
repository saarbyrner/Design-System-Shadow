// @flow
import { createApi } from '@reduxjs/toolkit/query/react';
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import { getParticipationLevels } from '@kitman/services';
import type { ParticipationLevel } from '@kitman/services/src/services/getParticipationLevels';

export const participationLevelsApi = createApi({
  reducerPath: 'participationLevelsApi',
  endpoints: (builder) => ({
    getParticipationLevels: builder.query<Array<ParticipationLevel>>({
      queryFn: serviceQueryFactory(({ eventType, hideNoneOption }) =>
        getParticipationLevels(eventType, hideNoneOption)
      ),
    }),
  }),
});

export const { useGetParticipationLevelsQuery } = participationLevelsApi;
