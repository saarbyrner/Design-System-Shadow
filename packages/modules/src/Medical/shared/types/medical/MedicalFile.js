// @flow
import type { Attachment } from '@kitman/modules/src/Medical/shared/types';

type User = {
  id: number,
  fullname: string,
};

type FileCategory = {
  id: number,
  name: string,
};

export type MedicalFile = {|
  id: number,
  athlete: {
    id: number,
    fullname: string,
    position: string,
    avatar_url: string,
  },
  organisation_id: number,
  document_categories: Array<FileCategory>,
  document_date: string,
  archived_at: ?string,
  archive_reason: ?{
    id: number,
    name: string,
  },
  created_at: string,
  updated_at: string,
  created_by: ?User,
  created_by_organisation: ?{
    id: number,
    name: string,
  },
  annotation: ?{
    id: number,
    content: string,
    note_summary: string,
    annotation_date: string,
    restricted_annotation: boolean,
    title: string,
  },
  attachment: Attachment,
  injury_occurrences: Array<Object>,
  illness_occurrences: Array<Object>,
  chronic_issues: Array<Object>,
|};

export type FileRequestResponse = {
  documents: Array<MedicalFile>,
  total_count?: number,
  meta?: {
    current_page: number,
    next_page: number | null,
    prev_page: number | null,
    total_count: number,
    total_pages: number,
  },
};

export type DocumentRequestResponse = {
  document: MedicalFile,
};

export type ExportAttachment = {
  id: number,
  filetype: string,
  filename: string,
};
