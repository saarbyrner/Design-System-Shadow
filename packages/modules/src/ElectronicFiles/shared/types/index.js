// @flow
import type {
  GridColDef,
  GridRow,
  GridRenderCellParams as MuiGridRenderCellParams,
} from '@mui/x-data-grid-pro';
import type { Athlete } from '@kitman/common/src/types/Athlete';
import type { Attachment } from '@kitman/modules/src/Medical/shared/types';
import type { AttachedTransformedFile } from '@kitman/common/src/utils/fileHelper';

export const DATA_KEY = {
  countryCode: 'countryCode',
  faxNumber: 'faxNumber',
  firstName: 'firstName',
  lastName: 'lastName',
  companyName: 'companyName',
};

export const FIELD_KEY = {
  received_from: 'received_from',
  sent_to: 'sent_to',
  title: 'title',
  attachment: 'attachment',
  attachments: 'attachments',
  attachedTo: 'attachedTo',
  date: 'date',
  delivery_status: 'delivery_status',
  actions: 'actions',
  toggle_contact_favorite: 'toggle_contact_favorite',
  company_name: 'company_name',
  fax_number: 'fax_number',
  name: 'name',
};

export const STATUS_KEY = {
  sending: 'sending',
  sent: 'sent',
  error: 'error',
};

export const FILTER_KEY = {
  search: 'search',
  dateRange: 'dateRange',
  status: 'status',
};

export type DataKey = $Keys<typeof DATA_KEY>;
export type FieldKey = $Keys<typeof FIELD_KEY>;
export type StatusKey = $Keys<typeof STATUS_KEY>;
export type FilterKey = $Keys<typeof FILTER_KEY>;

export type Errors = {
  [key: string]: Array<string>,
};

export type Validation = {
  errors: ?Errors,
};

export type FaxNumber = {
  country_code: string,
  country: string,
  number: string,
  number_international: string,
  number_international_e164: string,
  type: string,
};

export type User = {
  id: number,
  fullname: string,
};

export type NewContact = {
  first_name: string,
  last_name: string,
  company_name: string,
  fax_number: string,
};

export type ExistingContact = {
  id: number,
  first_name: string,
  last_name: string,
  company_name: string,
  fax_number: FaxNumber,
  global?: boolean,
  favorite?: boolean,
  archived: boolean,
  archived_at: ?string,
  archived_by: ?User,
};

export type ContactFormData = {
  contact: ?NewContact & ?ExistingContact,
};

type Squad = {
  name: string,
  athletes: Array<Athlete>,
};

export type SquadAthletes = {
  squads: Array<Squad>,
};

export type DataCell = {
  id: string,
  content: any,
};

export type GridConfig = {
  rows: Array<GridRow>,
  columns: Array<GridColDef>,
  emptyTableText: string,
  id: string,
};

export type GridData = {
  columns: Array<GridColDef>,
  rows: Array<GridRow>,
  next_id?: ?number,
};

export type GridRenderCellParams = MuiGridRenderCellParams<
  string | boolean | Array<Attachment> | Array<ExistingContact>
>;

export type RowAction = {
  id: string,
  label: string,
  icon: string,
  onClick: () => void,
  hidden: boolean,
};

export type ArchiveReason = {
  id: number,
  name: string,
};

export type AllocationAthlete = {
  id: number,
  firstname: string,
  lastname: string,
};

export type AllocationAttribute = {
  id?: number,
  athlete_id: number,
  range: string,
  file_name: string,
  document_date: string,
  medical_attachment_category_ids: Array<number>,
  athlete: AllocationAthlete,
  injury_occurrence_ids?: Array<number>,
  illness_occurrence_ids?: Array<number>,
  chronic_issue_ids?: Array<number>,
};

export type InboundElectronicFile = {
  id: number,
  title: string,
  received_from: ExistingContact,
  destination_fax_number: FaxNumber,
  originating_fax_number: FaxNumber,
  viewed: boolean,
  status: string,
  date: string,
  attachment: Attachment,
  archived: boolean,
  archived_at: ?string,
  archived_by: ?User,
  efax_allocations: Array<AllocationAttribute>,
};

export type OutboundElectronicFile = {
  id: number,
  title: string,
  message: string,
  sent_to: Array<ExistingContact>,
  status: StatusKey,
  date: string,
  attachments: Array<Attachment>,
  archived: boolean,
  archived_at: ?string,
  archived_by: ?User,
};

export type ElectronicFile = InboundElectronicFile & OutboundElectronicFile;

export type GridFilters = {
  query: string,
  status: ?string,
  start_date: ?string,
  end_date: ?string,
  archived: boolean,
};

export type GridFiltersGrouped = {
  inbox: ?GridFilters,
  sent: ?GridFilters,
};

export type ContactsGridFilters = {
  query: string,
  archived: boolean,
};

export type GridPagination = {
  per_page: number,
  page: number,
};

export type Meta = {
  current_page: number,
  next_page: ?number,
  prev_page: ?number,
  total_count: number,
  total_pages: number,
};

export type NavMeta = {
  next_id: ?number,
  prev_id: ?number,
};

export type FilePondError = {
  main: string,
  sub: string,
};
export type FilePondWarning = {
  type: string,
  code: number,
  body: string,
};

export type UnconfirmedAttachments = {
  attachments: Array<AttachedTransformedFile>,
};

export type PresignedAttachments = {
  attachments: Array<Attachment>,
};
