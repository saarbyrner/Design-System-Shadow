// @flow
import { IMPORT_STATUS, IMPORT_TYPES } from '@kitman/common/src/consts/imports';

export type ImportType = $Values<typeof IMPORT_TYPES>;

type ImportError = {
  row: number,
  attribute_name: string,
  error: string,
};

export type ImportStatus = $Values<typeof IMPORT_STATUS>;

export type ImportsItem = {
  id: number,
  name: string,
  status: ImportStatus,
  import_type: ImportType,
  attachments: Array<{
    filename: string,
    filesize: number,
    filetype: string,
    id: number,
    url: string,
  }>,
  import_errors: Array<ImportError>,
  created_at: string,
  created_by: {
    id: number,
    firstname: string,
    lastname: string,
    fullname: string,
  },
  can_delete: boolean,
};

export type CamelCasedImportsItem = {
  id: number,
  name: string,
  status: ImportStatus,
  importType: ImportType,
  attachments: Array<{
    filename: string,
    filesize: number,
    filetype: string,
    id: number,
    url: string,
  }>,
  importErrors: Array<ImportError>,
  createdAt: string,
  createdBy: {
    id: number,
    firstname: string,
    lastname: string,
    fullname: string,
  },
  canDelete: boolean,
};

export type MetaItem = {
  current_page: number,
  next_page: ?number,
  prev_page: ?number,
  total_count: number,
  total_pages: number,
};

export type CamelCasedImportsResponse = {
  meta: MetaItem,
  data: Array<CamelCasedImportsItem>,
};

export type ImportsResponse = {
  meta: MetaItem,
  data: Array<ImportsItem>,
};
