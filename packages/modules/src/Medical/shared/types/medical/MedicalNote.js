// @flow
import type { Attachment } from '@kitman/services/src/services/updateAnnotation';
import type { DocumentNoteCategory } from '@kitman/services/src/services/getDocumentNoteCategories';
import type { ChronicIssue } from '../../types';
import type { EntityConstraints } from './Constraints';

export type VersionHistory = {
  changeset: {
    title?: Array<?string>,
    content?: Array<?string>,
    annotation_date?: Array<?string>,
    squads?: Array<?{ id: string, name: string }>,
    visibility?: Array<?string>,
  },
  // NOTE: updated_by may not be present where data was migrated without this info
  updated_by?: {
    id: number,
    fullname: string,
    firstname: string,
    lastname: string,
  },
  updated_at: string,
};

export type ArchiveReason = {
  id: number,
  name: string,
};

export type MedicalNote = {
  id: number,
  title: string,
  content: string,
  note_summary: string,
  organisation_annotation_type: {
    id: number,
    name: string,
    type: string,
  },
  document_note_categories?: Array<DocumentNoteCategory>,
  diagnostic: { id: number },
  annotationable_type: 'Diagnostic' | 'Athlete',
  content_editable: boolean,
  annotationable: {
    procedure_type: {
      code: string,
      default_procedure_reason_id: number,
      id: number,
      intravenous: boolean,
      name: string,
    },
    procedure_reason: {
      id: number,
      intravenous: boolean,
      issue_required: boolean,
      name: string,
    },
    diagnostic_reason: {
      id: number,
      name: string,
      injury_illness_required: boolean,
    },
    issue_occurrences: Array<{
      id: number,
      issue_type: 'illness' | 'injury',
      occurrence_date: string,
      full_pathology: string,
      issue_occurrence_title: string,
    }>,
    athlete: {
      type: 'Athlete',
      fullname: string,
      id: number,
      avatar_url: string,
      availability: 'unavailable' | 'injured' | 'returning' | 'available',
      athlete_squads: Array<{
        id: number,
        name: string,
      }>,
    },
    type: 'Athlete',
    fullname: string,
    id: number,
    avatar_url: string,
    position: string,
    availability: 'unavailable' | 'injured' | 'returning' | 'available',
    athlete_squads: Array<{
      id: number,
      name: string,
    }>,
  },
  author: {
    id: number,
    fullname: string,
  },
  created_by: {
    id: number,
    fullname: string,
  },
  allow_list?: Array<{ id: number, fullname: string }>,
  annotation_date: string,
  expiration_date?: string,
  created_at: string,
  expired: boolean,
  restricted_to_doc: boolean,
  restricted_to_psych: boolean,
  attachments: Array<Attachment>,
  chronic_issues: ChronicIssue[],
  illness_occurrences: [
    {
      id: number,
      issue_type: 'illness',
      occurrence_date: string,
      full_pathology: string,
      issue_occurrence_title: string,
    }
  ],
  injury_occurrences: [
    {
      id: number,
      issue_type: 'injury',
      occurrence_date: string,
      full_pathology: string,
      issue_occurrence_title: string,
    }
  ],
  squad: {
    id: number,
    name: string,
  },
  versions: Array<VersionHistory>,
  archived: boolean,
  archive_reason?: ArchiveReason,
  updated_at: string,
  updated_by?: {
    id: number,
    fullname: string,
  },
  rehab_sessions?: Array<{ id: number }>,
  organisation_id?: ?number,
  constraints?: EntityConstraints,
};

export type RequestResponse = {
  medical_notes: Array<MedicalNote>,
  total_count: number,
  meta: {
    next_page: number,
  },
};

export type MedicalType = 'TUE' | 'Allergy' | 'Vaccination';
export type NoteType = 0 | 1 | 2 | 3;

// This was not documented anywhere... adding it as an enum for now
export const NOTE_TYPE = {
  STANDARD_NOTE_ID: 0,
  INJURY_NOTE_ID: 1,
  ILLNESS_NOTE_ID: 2,
  MEDICAL_NOTE_ID: 3,
};

export type NoteData = {
  attachment_ids: Array<number>,
  note_date: ?string,
  note_type: NoteType,
  medical_type: MedicalType,
  medical_name: ?string,
  injury_ids: Array<number>,
  illness_ids: Array<number>,
  note: string,
  expiration_date?: ?string,
  batch_number?: ?string,
  renewal_date?: ?string,
  restricted: boolean,
  psych_only: boolean,
};
