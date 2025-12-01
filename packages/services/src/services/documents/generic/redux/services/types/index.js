// @flow

import { ProductAreaValues } from '../consts';

export type ProductArea = $Values<typeof ProductAreaValues>;

export const GenericDocumentStatuses = {
  ACTIVE: 'active',
  FUTURE: 'future',
  EXPIRED: 'expired',
};

export type GenericDocumentStatus = $Values<typeof GenericDocumentStatuses>;

export type Attachment = {
  id: number,
  url: string,
  filename: string,
  filetype: string,
  filesize: number,
  audio_file: boolean,
  confirmed: boolean,
  presigned_post: {
    url: string,
    fields: Object, // This is not set by us and varies
  } | null,
  download_url: string,
  created_by?: {
    id: number,
    firstname: string,
    lastname: string,
    fullname: string,
  },
};

export type OrganisationGenericDocumentCategory = {
  id: number,
  name: string,
};

export type GenericDocument = {
  id: number,
  entity: {
    type: string,
    id: number,
  },
  title: string,
  document_date: string | null,
  expires_at: string | null,
  document_note: string | null,
  organisation_generic_document_categories: Array<OrganisationGenericDocumentCategory>,
  attachment: Attachment,
  status: GenericDocumentStatus,
};

export type Entity = {
  id: number,
  type: string,
};

export type DocumentDate = {
  start_date?: string,
  end_date?: string,
};

export type SearchRequestBody = {
  product_area: ProductArea,
  filters: {
    entities: Array<Entity>,
    organisation_generic_document_categories?: Array<OrganisationGenericDocumentCategory>,
    statuses?: Array<GenericDocumentStatus>,
    document_date?: DocumentDate,
    filename?: string,
  },
};

type CommonDocumentMutationRequestBody = $Exact<{
  entity: Entity,
  title: string,
  organisation_generic_document_category_ids: Array<number>,
  document_date?: string,
  expires_at?: string,
  document_note?: string,
}>;

export type UpdateDocumentRequestBody = {
  ...CommonDocumentMutationRequestBody,
  id: number,
};

export type CreateDocumentRequestBody = {
  ...CommonDocumentMutationRequestBody,
  attachment: {
    filesize: ?number,
    filetype: ?string,
    original_filename: ?string,
  },
};
