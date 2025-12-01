// @flow
import { createApi } from '@reduxjs/toolkit/query/react';
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import fetchExportableElements from '@kitman/services/src/services/exports/generic/redux/services/apis/fetchExportableElements';

const TAGS = {
  EXPORT_FIELDS: 'EXPORT_FIELDS',
};

export const genericExportsApi = createApi({
  reducerPath: 'genericExportsApi',
  tagTypes: [Object.keys(TAGS)],
  endpoints: (builder) => ({
    fetchExportableElements: builder.query({
      queryFn: serviceQueryFactory((exportType) =>
        fetchExportableElements(exportType)
      ),
      providesTags: [TAGS.EXPORT_FIELDS],
    }),
  }),
});

export const { useFetchExportableElementsQuery } = genericExportsApi;
