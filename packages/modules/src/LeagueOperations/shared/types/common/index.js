// @flow

import type { GridColDef } from '@mui/x-data-grid-pro';
import type { GridKeys } from '@kitman/modules/src/LeagueOperations/shared/components/GridConfiguration/types';
import type {
  AttachmentItem,
  Attachment,
} from '@kitman/common/src/utils/fileHelper';
import { type RegistrationProfileState } from '../../redux/slices/registrationProfileSlice';

export type UserType =
  | 'athlete'
  | 'staff'
  | 'organisation_admin'
  | 'association_admin'
  | 'official'
  | 'scout';

export const RegistrationStatusEnum = Object.freeze({
  INCOMPLETE: 'incomplete',
  PENDING_ORGANISATION: 'pending_organisation',
  PENDING_ASSOCIATION: 'pending_association',
  REJECTED_ORGANISATION: 'rejected_organisation',
  REJECTED_ASSOCIATION: 'rejected_association',
  PENDING_PAYMENT: 'pending_payment',
  APPROVED: 'approved',
  UNAPPROVED: 'unapproved',
});

export type RegistrationStatusTypes = $Values<typeof RegistrationStatusEnum>;

export type RegistrationStatus =
  | 'incomplete'
  | 'pending_organisation'
  | 'pending_association'
  | 'rejected_organisation'
  | 'rejected_association'
  | 'pending_payment'
  | 'approved'
  | 'unapproved'
  | null;

export type PlayerType =
  | 'primary'
  | 'future'
  | 'future_affiliate'
  | 'guest'
  | 'late_developer'
  | null;

export const FALLBACK_REGISTRATION_SYSTEM_STATUS = {
  id: 0,
  name: 'Incomplete',
  type: RegistrationStatusEnum.INCOMPLETE,
};

export type Address = {
  id: number,
  city: string,
  country: {
    abbreviation: string,
    id: number,
    name: string,
  },
  line1: string,
  line2: ?string,
  line3: ?string,
  state: string,
  zipcode: ?string,
};

export type Balance = {
  balance: {
    paid: number,
    unpaid: number,
    total: number,
    wallet: number,
  },
};

export type Organisation = {
  address: ?Address,
  handle: string,
  logo_full_path: ?string,
  id: number,
  name: string,
  shortname: string,
  registration_balance: number,
  total_athletes: number,
  total_squads: number,
  total_staff: number,
  payment_details: ?Balance,
};

export type Meta = {
  current_page: number,
  next_page: ?number,
  prev_page: ?number,
  total_count: number,
  total_pages: number,
};

export type Division = {
  id: number,
  name: string,
};

export type Squad = {
  id: number,
  name: string,
  address: ?Address,
  organisations: Array<Organisation>,
  total_athletes: number,
  total_coaches: number,
};

export type DivisionSquad = {
  id: number,
  name: string,
  duration: ?string,
  is_default: ?boolean,
  created_by: ?number,
  created: string,
  updated: string,
  sport_id: ?number,
  is_locked: boolean,
  parent_squad_id: ?number,
  division?: {
    id: number,
    name: string,
    parent_division_id: ?number,
  },
};

export type EmergencyContact = {
  id: string,
  firstname: string,
  lastname: string,
  contact_relation: string,
  email: string,
  phone_numbers: string,
  address_1: string,
  address_2: string,
  address_3: string,
  city: string,
  state_county: string,
  zip_postal_code: string,
  country: string,
};
export type ParentGuardian = {
  firstname: string,
  lastname: string,
  email: string,
  phone: string,
};

export type Insurance = {
  insurance_carrier: string,
  group_number: string,
  policy_number: string,
  insurance_id: string,
};

export type RegistrationSystemStatus = {
  id: number,
  name: string,
  type: RegistrationStatus,
};

export type RegistrationStatusReason = {
  id: number,
  name: string,
};

export type RegistrationObject = {
  id: ?number,
  status: ?RegistrationStatus,
  registration_system_status: ?RegistrationSystemStatus,
  registration_status_reason: ?RegistrationStatusReason,
};

export type MultiRegistration = {
  division: Division,
  id: number | null,
  status: RegistrationStatus,
  registration_system_status?: RegistrationSystemStatus,
  user_id: number,
  registration_requirement: {
    id: number,
    active: boolean,
  },
};
export type Label = {
  id: number | string,
  name: string,
  color?: string,
  textColor?: string,
};
export type Athlete = {
  id: number,
  address: ?Address,
  avatar_url: ?string,
  date_of_birth: string,
  place_of_birth: string,
  firstname: string,
  middlename: string,
  lastname: string,
  fullname: string,
  gender: string,
  shortname: string,
  organisations: Array<Organisation>,
  payment_status: boolean,
  position: {
    id: number,
    name: string,
  },
  non_registered?: boolean,
  registration_status: ?RegistrationObject,
  squad_numbers: Array<number>,
  squads: Array<Squad>,
  type: PlayerType,
  user_id: number,
  high_school_graduation_date: ?string,
  mobile_number: ?string,
  emergency_contacts: Array<EmergencyContact>,
  parent_guardian_details: ParentGuardian,
  email: ?string,
  initial_academy_registration_date: ?string,
  insurance: Insurance,
  registrations: Array<MultiRegistration>,
  registration_system_status: ?RegistrationSystemStatus,
  registration_status_reason: ?RegistrationStatusReason,
  labels: Array<Label>,
};

export type SelectOption = {
  value: string | number,
  label: string,
};

export type User = {
  id: number,
  address: ?Address,
  avatar_url: ?string,
  firstname: string,
  middlename: ?string,
  lastname: string,
  gender: ?string,
  affix: ?string,
  organisations: Array<Organisation>,
  payment_status: boolean,
  non_registered?: boolean,
  registration_status: ?RegistrationObject,
  registrations: Array<MultiRegistration>,
  registration_system_status: RegistrationSystemStatus,
  permission_group: string,
  non_registered?: boolean,
  user_id: number,
  date_of_birth: ?string,
  ussf_license_id: ?string,
  mobile_number: ?string,
  email: ?string,
  place_of_birth: ?string,
  user_title: ?string,
  insurance: Insurance,
  squads: Array<Squad>,
  emergency_contact: {
    firstname: string,
    lastname: string,
    relation: string,
    email: string,
    phone: {
      country_code: string,
      number: string,
    },
  },
  created: ?string,
  type: ?string,
};

export type Store = {
  'LeagueOperations.registration.slice.profile': RegistrationProfileState,
};

export type ColumnField =
  | 'club'
  | 'total_squads'
  | 'total_staff'
  | 'total_athletes'
  | 'address'
  | 'registration_balance'
  | 'name'
  | 'athlete'
  | 'date_of_birth'
  | 'total_coaches'
  | 'designation'
  | 'user'
  | 'id_number'
  | 'registration_status';

export type ColumnType =
  | 'avatar'
  | 'currency'
  | 'status'
  | 'text'
  | 'link'
  | 'node'
  | 'action'
  | 'discipline_status'
  | 'menu'
  | 'labels'
  | 'documents';

export type ColumnConfig = {
  field: ColumnField,
  headerName: string,
  commonOverrides?: GridColDef,
  type: ColumnType,
  currency?: string,
};

export type GridQueryParam = { grid: ?GridKeys };

export type GridColumns = {
  columns: Array<GridColDef>,
};

export type Registration = {
  id: number,
  division: Division,
  organisations: Array<Organisation>,
  squads: Array<Squad>,
  jersey_number: string,
  position: string,
  type: PlayerType,
  registration_status: RegistrationObject,
  registration_system_status: ?RegistrationSystemStatus,
  form_id: number,
};

export type SectionFormElement = {
  id: number,
  title: string,
  element_id: string,
};

export type RequirementSection = {
  id: number,
  user_registration_id: number,
  status: RegistrationStatus,
  registration_system_status: ?RegistrationSystemStatus,
  form_element: SectionFormElement,
};

export type PaginatedResponse<DataType> = {
  data: Array<DataType>,
  meta: Meta,
};

export type RequirementUpdateAnnotation = {
  annotation_date: string,
  content: string,
};

export type StatusHistory = {
  annotations: Array<RequirementUpdateAnnotation>,
  created_at: string,
  id: number,
  current_status: boolean,
  status: RegistrationStatus,
  registration_system_status: ?RegistrationSystemStatus,
  registration_status_reason: ?RegistrationStatusReason,
};

export type RegistrationHistory = {
  id: number,
  user_id: number,
  status: string,
  status_history: Array<StatusHistory>,
};

export type RequirementHistory = {
  id: number,
  user_registration_id: number,
  status: string,
  status_history: Array<StatusHistory>,
};

export type AthleteGameStatus =
  | 'available'
  | 'unavailable'
  | 'ineligible'
  | 'unavailable_ineligible';

export type HomegrownDocument = {
  archived_at: ?string,
  attachment: Attachment,
  document_date: ?string,
  document_note: ?string,
  entity: {
    id: number,
    type: string,
  },
  expires_at: ?string,
  id: number,
  is_archived: boolean,
  organisation_generic_document_categories: Array<{ id: number, name: string }>,
  status: string,
  title: string,
};
export type NewHomegrown = {
  title: string,
  date_submitted: string,
  submitted_by: ?number,
  certified_by: string,
  homegrown_document: ?AttachmentItem,
  certified_document: ?AttachmentItem,
};

export type Homegrown = {
  ...NewHomegrown,
  id: number,
  division_id: number,
  organisation_id: number,
  homegrown_document: HomegrownDocument,
  certified_document: HomegrownDocument,
  submitted_by: string,
};
