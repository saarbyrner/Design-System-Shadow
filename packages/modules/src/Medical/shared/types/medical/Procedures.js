// @flow
import type { ChronicIssue, IssueType } from '../../types';

export type ProcedureType = {
  id: number,
  code: string,
  name: string,
  intravenous: boolean,
  default_procedure_reason_id: number,
};

export type ProceduresFormDataResponse = {
  procedure_reasons: Array<{
    id: number,
    name: string,
    issue_required: boolean,
    intravenous: boolean,
  }>,
  locations: Array<{
    id: number,
    name: string,
    type_of: {
      value: number,
      name: string,
    },
    organisation_id: number,
  }>,
  procedure_complications: Array<{
    id: number,
    name: string,
    intravenous: boolean,
  }>,
  procedure_timings: Array<{
    key: string,
    name: string,
  }>,
};

export type ProcedureResponseData = {
  id: number,
  athlete: {
    id: number,
    avatar_url: string,
    firstname: string,
    lastname: string,
    fullname: string,
    shortname: string,
    availability: string,
    position: string,
  },
  procedure_date: string,
  location: {
    id: number,
    name: string,
    type_of: { value: number, name: string },
    organisation_id: number,
  },
  provider: {
    id: number,
    sgid: string | null | number,
    firstname: string,
    lastname: string,
    fullname: string,
  },
  other_provider: ?string,
  procedure_type: ProcedureType,
  procedure_type_description: string,
  procedure_reason: {
    id: number,
    name: string,
    issue_required: boolean,
    intravenous: boolean,
  },
  other_reason: string,
  body_area: {
    id: number,
    name: string,
  },
  timing: string,
  other_timing: null,
  duration: null,
  total_amount: number,
  total_amount_unit: string,
  amount_used: number,
  amount_used_unit: string,
  urine_specific_gravity: number,
  procedure_complications: [{ id: number, name: string, intravenous: boolean }],
  other_complication: string,
  issue_occurrences: [
    {
      id: number,
      occurrence_date: string,
      issue_type: IssueType,
      full_pathology: string,
      issue_occurrence_title: string,
    }
  ],
  chronic_issues: Array<ChronicIssue>,
  created_by: { id: number, fullname: string },
  order_date: string,
  created_at: string,
  updated_by: { id: number, fullname: string },
  updated_at: string,
  annotations: Array<any>,
  attachments: Array<{
    id: number,
    url: string,
    filename: string,
    filetype: string,
    filesize: number,
    audio_file: boolean,
    confirmed: boolean,
    presigned_post: any,
    attachment_date: string,
    download_url: string,
    created_by?: {
      id: number,
      firstname: string,
      lastname: string,
      fullname: string,
    },
  }>,
  attached_links: Array<{
    created_at: string,
    created_by?: {
      id: number,
      firstname: string,
      lastname: string,
      fullname: string,
    },
    description: string,
    id: number,
    title: string,
    updated_at: string,
    uri: string,
  }>,
  organisation_id: number,
};

export type ProcedureAttachment = {
  original_filename: string,
  filetype: string,
  filesize: number,
};

export type ProcedureAttachmentResponse = Array<{
  id: number,
  url: string,
  filename: string,
  filetype: string,
  filesize: number,
  audio_file: boolean,
  confirmed: boolean,
  presigned_post: {
    url: string,
    fields: Object,
  },
  download_url: string,
  created_by: {
    id: number,
    firstname: string,
    lastname: string,
    fullname: string,
  },
  created: string,
  attachment_date: string,
}>;
