// @flow
import { createApi } from '@reduxjs/toolkit/query/react';
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';

import searchSquadList from '@kitman/modules/src/LeagueOperations/shared/services/searchSquadList';
import fetchValidationCountryOptions from '@kitman/modules/src/shared/MassUpload/services/fetchValidationCountryOptions';
import fetchValidPositionOptions from '@kitman/modules/src/shared/MassUpload/services/fetchValidPositionOptions';
import { camelCasedSearchImportsList } from '@kitman/services/src/services/searchImportsList';
import deleteMassUpload from '@kitman/modules/src/shared/MassUpload/services/deleteMassUpload';

export const massUploadApi = createApi({
  reducerPath: 'massUploadApi',
  endpoints: (builder) => ({
    fetchValidationCountryOptions: builder.query({
      queryFn: serviceQueryFactory(fetchValidationCountryOptions),
    }),
    fetchValidPositionOptions: builder.query({
      queryFn: serviceQueryFactory(fetchValidPositionOptions),
    }),
    searchSquadList: builder.query({
      queryFn: serviceQueryFactory(searchSquadList),
    }),
    getImportJobs: builder.query({
      queryFn: serviceQueryFactory(({ importTypes }) =>
        camelCasedSearchImportsList({
          creatorIds: [],
          importTypes,
          statuses: [],
          isInCamelCase: true,
        })
      ),
      forceRefetch({ currentArg }) {
        return currentArg.shouldUpdateRootTable;
      },
    }),
    deleteMassUpload: builder.query({
      queryFn: serviceQueryFactory(({ attachmentId, importType }) =>
        deleteMassUpload({ attachmentId, importType })
      ),
    }),
  }),
});

export const {
  useFetchValidationCountryOptionsQuery,
  useFetchValidPositionOptionsQuery,
  useSearchSquadListQuery,
  useGetImportJobsQuery,
  useLazyDeleteMassUploadQuery,
} = massUploadApi;
