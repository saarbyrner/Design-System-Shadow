// @flow
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import fetchForms from '@kitman/modules/src/LeagueOperations/QAFormApp/services/fetchForms';
import { leagueOperationsApi } from './leagueOperations';

const TAGS = {
  FORMS: 'FORMS',
};

export const REDUCER_KEY: string = 'LeagueOperations.discipline.services';

export const formsApi = leagueOperationsApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchFormsList: builder.query({
      queryFn: serviceQueryFactory(fetchForms),
      providesTags: [TAGS.FORMS],
    }),
  }),
  overrideExisting: false,
});

export const { useFetchFormsListQuery } = formsApi;
