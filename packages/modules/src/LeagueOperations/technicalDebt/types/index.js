// @flow
import type { Node } from 'react';
import type { RegistrationStatus } from '@kitman/modules/src/LeagueOperations/shared/types/common';
import type {
  JDPAdditionalInfo,
  USSFAdditionalInfo,
  RegistrationAnnotation,
} from '@kitman/modules/src/LeagueOperations/shared/types/forms';

export type Count = {
  team: number,
  coach: number,
  player: number,
};

export type Club = {
  id: number,
  club_name: string,
  avatar_url: string,
  count: Count,
  location: string,
  balance: string,
  founded: ?string,
  address: ?string,
  owner: ?string,
  president: ?string,
  contact: ?{
    email: string,
    phone_number: string,
  },
};

export type ExpectedSections =
  | 'playerdetails'
  | 'parentguardian'
  | 'insurance'
  | 'attachment_section_headshot'
  | 'attachment_section_proof_of_birth'
  | 'attachment_section_impact_baseline'
  | 'attachment_section_itc'
  | 'attachment_safesport_section'
  | 'registration_status_update'
  | 'emergency'
  | 'attachment_section_ussf_license'
  | 'attachment_section_uscc_license'
  | 'attachment_section_csa_license'
  | 'attachment_section_uefa_license'
  | 'attachment_section_gkc_license'
  | 'attachment_cdc_heads_up_section'
  | 'userdetails'
  | 'acknowledgement_diversity_section'
  | 'background_check_policy_section'
  | 'attachment_section_other_license'
  | '';

export type Column = {
  id: string,
  row_key: string,
};

export type DataCell = {
  id: string,
  content: any,
};

export type Row = {
  id: number | string,
  cells: Array<DataCell>,
  classnames?: Object,
};

export type GridConfig = {
  rows: Array<Row>,
  columns: Array<Column>,
  emptyTableText: string,
  id: string,
};

export type GridData = {
  columns: Array<Column>,
  rows: Array<Row>,
  next_id?: ?number,
};

export type UserType =
  | 'athlete'
  | 'staff'
  | 'organisation_admin'
  | 'association_admin'
  | null;

export type ActiveStatus = 'active' | 'inactive';

export type RegistrationDetails = {
  user_type: UserType,
  required: boolean,
  status: RegistrationStatus,
  id: number,
};

type RowKey =
  | 'full_name'
  | 'club'
  | 'id_number'
  | 'location'
  | 'dob'
  | 'level'
  | 'role'
  | 'status'
  | 'team'
  | 'type'
  | 'paid';

export type GridHeader = {
  id: string,
  row_key: RowKey,
  content: Node,
};

type CommonProfileAttributes = {
  id: string | number,
  firstname: string,
  lastname: string,
  full_name: string,
  avatar_url: string,
  squad: string,
  address: {
    state: string,
    city: string,
  },
  emergency_contact: {
    firstname: string,
    lastname: string,
    relation: string,
    email: string,
    phone_number1: string,
    phone_number2: string,
  },
  insurance: {
    address: string,
    phone_number: string,
    carrier: string,
    group_number: string,
    policy_number: string,
    insurance_id: string,
  },
  date_of_birth: string,
  type: string,
  status: 'incomplete' | 'pending' | 'rejected' | 'active',
  paid: boolean,
};

export type AthleteProfile = CommonProfileAttributes & {
  club_id: number,
  country: string,
  jersey_number: string,
  email: string,
  phone_number: string,
  age: string,
  joined: string,
  role: Array<string>,
  level: string,
  affiliate: string,
};

export type StaffProfile = CommonProfileAttributes & {
  level: string,
  club_id: number,
  country: string,
  email: string,
  phone_number: string,
  age: string,
  joined: string,
};

export type StaffNote = {
  user: string,
  date: string,
  note: string,
};

export type Requirement = {
  id: number,
  title: string,
  current_status: RegistrationStatus,
  staffNotes: Array<StaffNote>,
  attachment: ?string,
  element_id: ExpectedSections,
};

export type FormElement = {
  form_element_id: string,
  value: any,
};

export type DBFormElement = {
  id: number,
  element_type: string,
  config: {
    data_point: boolean,
    element_id: string,
    option: boolean,
    text: string,
  },
  visible: boolean,
  order: number,
  form_elements: Array<DBFormElement>,
};

export type Attachment = {
  id: number,
  filesize: number,
  filename: string,
  filetype: string,
  url: string,
};

export type Answer = {
  id: number,
  form_element: DBFormElement,
  attachment?: Attachment,
  value: string | boolean | number,
};
export type Status = {
  id: number,
  status: RegistrationStatus,
  created_at: string,
  annotations: Array<RegistrationAnnotation>,
};

export type Section = {
  answers: Array<Answer>,
  statuses: Array<Status>,
  additional_info?: JDPAdditionalInfo | Array<USSFAdditionalInfo>,
};

export type StatusHistory = {
  annotations: Array<RegistrationAnnotation>,
  created_at: string,
  id: number,
  status: string,
};

export type RegistrationHistory = {
  id: number,
  user_id: number,
  status: string,
  status_history: Array<StatusHistory>,
};
