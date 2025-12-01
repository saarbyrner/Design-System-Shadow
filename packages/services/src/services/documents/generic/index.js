// @flow
import { createApi } from '@reduxjs/toolkit/query/react';
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import searchDocuments from '@kitman/services/src/services/documents/generic/redux/services/apis/searchDocuments';
import fetchGenericDocumentsCategories from '@kitman/services/src/services/documents/generic/redux/services/apis/fetchGenericDocumentsCategories';
import type {
  ProductArea,
  SearchRequestBody,
  CreateDocumentRequestBody,
  UpdateDocumentRequestBody,
} from '@kitman/services/src/services/documents/generic/redux/services/types';
import { confirmFileUpload } from '@kitman/services/src/services/documents/generic/redux/services/apis/confirmFileUpload';
import { archiveDocument } from '@kitman/services/src/services/documents/generic/redux/services/apis/archiveDocument';
import { unarchiveDocument } from '@kitman/services/src/services/documents/generic/redux/services/apis/unarchiveDocument';
import { createDocument } from './redux/services/apis/createDocument';
import { updateDocument } from './redux/services/apis/updateDocument';

const TAGS = {
  GENERIC_DOCUMENTS: 'GENERIC_DOCUMENTS',
  GENERIC_DOCUMENT_CATEGORIES: 'GENERIC_DOCUMENT_CATEGORIES',
};

export const genericDocumentsApi = createApi({
  reducerPath: 'genericDocumentsApi',
  tagTypes: [Object.keys(TAGS)],
  endpoints: (builder) => ({
    searchDocuments: builder.query({
      queryFn: serviceQueryFactory((filters: SearchRequestBody) =>
        searchDocuments(filters)
      ),
      providesTags: [TAGS.GENERIC_DOCUMENTS],
    }),
    createDocument: builder.mutation({
      queryFn: serviceQueryFactory(
        (documentRequestBody: CreateDocumentRequestBody) =>
          createDocument(documentRequestBody)
      ),
      providesTags: [TAGS.GENERIC_DOCUMENTS],
    }),
    updateDocument: builder.mutation({
      queryFn: serviceQueryFactory(
        (documentRequestBody: UpdateDocumentRequestBody) =>
          updateDocument(documentRequestBody)
      ),
      invalidatesTags: [TAGS.GENERIC_DOCUMENTS],
      providesTags: [TAGS.GENERIC_DOCUMENTS],
    }),
    fetchGenericDocumentsCategories: builder.query({
      queryFn: serviceQueryFactory((productArea: ProductArea) =>
        fetchGenericDocumentsCategories(productArea)
      ),
      providesTags: [TAGS.GENERIC_DOCUMENT_CATEGORIES],
    }),
    confirmFileUpload: builder.mutation({
      queryFn: serviceQueryFactory((fileId: number) =>
        confirmFileUpload(fileId)
      ),
      invalidatesTags: [TAGS.GENERIC_DOCUMENTS],
    }),
    archiveDocument: builder.mutation({
      queryFn: serviceQueryFactory((documentId: number) =>
        archiveDocument(documentId)
      ),
      invalidatesTags: [TAGS.GENERIC_DOCUMENTS],
    }),
    unarchiveDocument: builder.mutation({
      queryFn: serviceQueryFactory((documentId: number) =>
        unarchiveDocument(documentId)
      ),
      invalidatesTags: [TAGS.GENERIC_DOCUMENTS],
    }),
  }),
});

export const {
  useSearchDocumentsQuery,
  useFetchGenericDocumentsCategoriesQuery,
  useCreateDocumentMutation,
  useUpdateDocumentMutation,
  useConfirmFileUploadMutation,
  useArchiveDocumentMutation,
  useUnarchiveDocumentMutation,
} = genericDocumentsApi;
