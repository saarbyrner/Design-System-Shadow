// @flow
import { createApi } from '@reduxjs/toolkit/query/react';

import { TAGS } from './utils';

export const REDUCER_KEY: string = 'LeagueOperations.services';

export const leagueOperationsApi = createApi({
  reducerPath: REDUCER_KEY,
  tagTypes: Object.keys(TAGS),
  endpoints: () => ({}),
});
