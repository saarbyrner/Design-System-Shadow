// @flow
import type {
  Editor,
  FormAnswer,
  HumanInputFormElement,
} from '@kitman/modules/src/HumanInput/types/forms';
import type { RegistrationStatus } from '@kitman/modules/src/LeagueOperations/shared/types/common';

type RegistrationProfileFormDetails = {
  category: string,
  config: null,
  created_at: string,
  enabled: boolean,
  form_type: string,
  fullname: string,
  group: string,
  id: number,
  key: string,
  name: string,
  updated_at: string,
};

export type RegistrationProfileFormTemplateVersion = {
  config: null,
  created_at: string,
  editor: Editor,
  form_elements: Array<HumanInputFormElement>,
  id: number,
  name: string,
  updated_at: string,
  version: number,
};

export type RegistrationProfileForm = {
  date: string,
  editor: Editor,
  extra: null,
  form: RegistrationProfileFormDetails,
  form_answers: Array<FormAnswer>,
  form_template_version: RegistrationProfileFormTemplateVersion,
  id: number,
  organisation_id: number,
};

export type StatusDisplayText =
  | 'Alert Found - Client Review Required'
  | 'Dispute'
  | 'Jurisdictional Letter Required'
  | 'Jurisdictional Letter Required - Illinois'
  | 'No Alerts'
  | 'On Hold'
  | 'Pending'
  | 'Pre-Adverse Action'
  | 'Withdrawn'
  | 'Queued';

export type JDPAdditionalInfo = {
  id: number,
  order_guid: string,
  ordered_date: string,
  status?: ?{
    value: number,
    text: StatusDisplayText,
  },
};

export type USSFAdditionalInfo = {
  id: number,
  license_id: ?string,
  issuer_id: string,
  issuer: string,
  issue_date: ?string,
  expiration_date: ?string,
  last_updated: ?string,
  license_type: { id: number, name: string },
};

export type RegistrationAnnotation = {
  content: string,
  annotation_date: string,
};

export type Status = {
  id: number,
  status: RegistrationStatus,
  created_at: string,
  annotations: Array<RegistrationAnnotation>,
};

export type RegistrationStatuses = Array<Status>;
