// @flow
import { createApi } from '@reduxjs/toolkit/query/react';
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import fetchContacts from '@kitman/modules/src/ElectronicFiles/shared/services/api/fetchContacts';
import fetchFavoriteContacts from '@kitman/modules/src/ElectronicFiles/shared/services/api/fetchFavoriteContacts';
import searchContactList from '@kitman/modules/src/ElectronicFiles/shared/services/api/searchContactList';
import createContact from '@kitman/modules/src/ElectronicFiles/shared/services/api/createContact';
import updateContact from '@kitman/modules/src/ElectronicFiles/shared/services/api/updateContact';
import updateContactsArchived from '@kitman/modules/src/ElectronicFiles/shared/services/api/updateContactsArchived';
import createPresignedAttachments from '@kitman/modules/src/ElectronicFiles/shared/services/api/createPresignedAttachments';
import uploadFileToS3 from '@kitman/services/src/services/documents/generic/redux/services/apis/uploadFileToS3';
import confirmFileUpload from '@kitman/services/src/services/documents/generic/redux/services/apis/confirmFileUpload';
import sendElectronicFile from '@kitman/modules/src/ElectronicFiles/shared/services/api/sendElectronicFile';
import searchInboundElectronicFileList from '@kitman/modules/src/ElectronicFiles/shared/services/api/searchInboundElectronicFileList';
import fetchInboundElectronicFile from '@kitman/modules/src/ElectronicFiles/shared/services/api/fetchInboundElectronicFile';
import searchOutboundElectronicFileList from '@kitman/modules/src/ElectronicFiles/shared/services/api/searchOutboundElectronicFileList';
import fetchOutboundElectronicFile from '@kitman/modules/src/ElectronicFiles/shared/services/api/fetchOutboundElectronicFile';
import updateViewed from '@kitman/modules/src/ElectronicFiles/shared/services/api/updateViewed';
import getUnreadCount from '@kitman/modules/src/ElectronicFiles/shared/services/api/getUnreadCount';
import updateArchived from '@kitman/modules/src/ElectronicFiles/shared/services/api/updateArchived';
import splitDocument from '@kitman/modules/src/ElectronicFiles/shared/services/api/splitDocument';
import {
  makeFavorite,
  deleteFavorite,
} from '@kitman/services/src/services/favoriting';

export const TAGS = {
  CONTACTS: 'CONTACTS',
  FAVORITE_CONTACTS: 'FAVORITE_CONTACTS',
  CONTACT_LIST: 'CONTACT_LIST',
  INBOUND_ELECTRONIC_FILE_LIST: 'INBOUND_ELECTRONIC_FILE_LIST',
  INBOUND_ELECTRONIC_FILE: 'INBOUND_ELECTRONIC_FILE',
  OUTBOUND_ELECTRONIC_FILE_LIST: 'OUTBOUND_ELECTRONIC_FILE_LIST',
  OUTBOUND_ELECTRONIC_FILE: 'OUTBOUND_ELECTRONIC_FILE',
  UNREAD_COUNT: 'UNREAD_COUNT',
};

export const electronicFilesApi = createApi({
  reducerPath: 'electronicFilesApi',
  tagTypes: [
    TAGS.CONTACTS,
    TAGS.FAVORITE_CONTACTS,
    TAGS.CONTACT_LIST,
    TAGS.INBOUND_ELECTRONIC_FILE_LIST,
    TAGS.INBOUND_ELECTRONIC_FILE,
    TAGS.OUTBOUND_ELECTRONIC_FILE_LIST,
    TAGS.OUTBOUND_ELECTRONIC_FILE,
  ],
  endpoints: (builder) => ({
    fetchContacts: builder.query({
      providesTags: [TAGS.CONTACTS],
      queryFn: serviceQueryFactory(fetchContacts),
    }),
    fetchFavoriteContacts: builder.query({
      providesTags: [TAGS.FAVORITE_CONTACTS],
      queryFn: serviceQueryFactory(fetchFavoriteContacts),
    }),
    searchContactList: builder.query({
      providesTags: [TAGS.CONTACT_LIST],
      queryFn: serviceQueryFactory(searchContactList),
    }),
    createContact: builder.mutation({
      invalidatesTags: [TAGS.CONTACT_LIST],
      queryFn: serviceQueryFactory(createContact),
    }),
    updateContact: builder.mutation({
      invalidatesTags: [TAGS.CONTACT_LIST],
      queryFn: serviceQueryFactory(updateContact),
    }),
    updateContactsArchived: builder.mutation({
      invalidatesTags: [TAGS.CONTACT_LIST],
      queryFn: serviceQueryFactory(updateContactsArchived),
    }),
    makeContactFavorite: builder.mutation({
      invalidatesTags: [TAGS.FAVORITE_CONTACTS, TAGS.CONTACT_LIST],
      queryFn: serviceQueryFactory((args) =>
        makeFavorite(args.itemId, 'org_efax_contacts', true)
      ),
    }),
    deleteContactFavorite: builder.mutation({
      invalidatesTags: [TAGS.FAVORITE_CONTACTS, TAGS.CONTACT_LIST],
      queryFn: serviceQueryFactory((args) =>
        deleteFavorite(args.itemId, 'org_efax_contacts', true)
      ),
    }),
    createPresignedAttachments: builder.mutation({
      queryFn: serviceQueryFactory(createPresignedAttachments),
    }),
    uploadFileToS3: builder.mutation({
      queryFn: serviceQueryFactory((args) =>
        uploadFileToS3(args.file, args.fileId, args.presignedPost)
      ),
    }),
    confirmFileUpload: builder.mutation({
      queryFn: serviceQueryFactory((args) => confirmFileUpload(args)),
    }),
    sendElectronicFile: builder.mutation({
      invalidatesTags: [TAGS.OUTBOUND_ELECTRONIC_FILE_LIST],
      queryFn: serviceQueryFactory(sendElectronicFile),
    }),
    searchInboundElectronicFileList: builder.query({
      providesTags: [TAGS.INBOUND_ELECTRONIC_FILE_LIST],
      queryFn: serviceQueryFactory(searchInboundElectronicFileList),
    }),
    fetchInboundElectronicFile: builder.query({
      providesTags: [TAGS.INBOUND_ELECTRONIC_FILE],
      queryFn: serviceQueryFactory(fetchInboundElectronicFile),
    }),
    searchOutboundElectronicFileList: builder.query({
      providesTags: [TAGS.OUTBOUND_ELECTRONIC_FILE_LIST],
      queryFn: serviceQueryFactory(searchOutboundElectronicFileList),
    }),
    fetchOutboundElectronicFile: builder.query({
      providesTags: [TAGS.OUTBOUND_ELECTRONIC_FILE],
      queryFn: serviceQueryFactory(fetchOutboundElectronicFile),
    }),
    getUnreadCount: builder.query({
      providesTags: [TAGS.UNREAD_COUNT],
      queryFn: serviceQueryFactory(getUnreadCount),
    }),
    updateViewed: builder.mutation({
      invalidatesTags: [
        TAGS.UNREAD_COUNT,
        TAGS.INBOUND_ELECTRONIC_FILE_LIST,
        TAGS.INBOUND_ELECTRONIC_FILE,
      ],
      queryFn: serviceQueryFactory(updateViewed),
    }),
    updateArchived: builder.mutation({
      invalidatesTags: [TAGS.UNREAD_COUNT, TAGS.INBOUND_ELECTRONIC_FILE_LIST],
      queryFn: serviceQueryFactory(updateArchived),
    }),
    splitDocument: builder.mutation({
      invalidatesTags: [TAGS.INBOUND_ELECTRONIC_FILE_LIST],
      queryFn: serviceQueryFactory(splitDocument),
    }),
  }),
});

export const {
  useFetchContactsQuery,
  useFetchFavoriteContactsQuery,
  useSearchContactListQuery,
  useCreateContactMutation,
  useUpdateContactMutation,
  useUpdateContactsArchivedMutation,
  useMakeContactFavoriteMutation,
  useDeleteContactFavoriteMutation,
  useCreatePresignedAttachmentsMutation,
  useUploadFileToS3Mutation,
  useConfirmFileUploadMutation,
  useSendElectronicFileMutation,
  useSearchInboundElectronicFileListQuery,
  useLazySearchInboundElectronicFileListQuery,
  useFetchInboundElectronicFileQuery,
  useLazySearchOutboundElectronicFileListQuery,
  useSearchOutboundElectronicFileListQuery,
  useFetchOutboundElectronicFileQuery,
  useGetUnreadCountQuery,
  useLazyGetUnreadCountQuery,
  useUpdateViewedMutation,
  useUpdateArchivedMutation,
  useSplitDocumentMutation,
} = electronicFilesApi;
