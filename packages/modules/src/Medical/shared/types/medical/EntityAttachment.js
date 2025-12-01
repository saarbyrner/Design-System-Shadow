// @flow
import type { AthleteBasic } from '@kitman/common/src/types/Athlete';
import type {
  Attachment,
  IssueOccurrenceFDetail,
  ChronicIssue,
} from '../../types';

export type MedicalAttachmentCategory = {
  id: number,
  name: string,
};

export const ENTITY_TYPES = {
  annotation: 'annotation',
  treatment: 'treatment',
  diagnostic: 'diagnostic',
  medicalNote: 'medical_note',
  procedure: 'procedure',
  medication: 'medication',
  documentV2: 'document_v2',
  formAnswersSet: 'form_answers_set',
};

export type AttachmentEntityType = $Values<typeof ENTITY_TYPES>;

export type MedicalEntity = {
  id: number,
  entity_type: AttachmentEntityType,
  entity_date: string,
  entity_title: ?string,
  athlete: AthleteBasic,
  organisation_id: number,
  injury_occurrences: Array<IssueOccurrenceFDetail>,
  illness_occurrences: Array<IssueOccurrenceFDetail>,
  chronic_issues: Array<ChronicIssue>,
};

export type EntityAttachment = {|
  entity: MedicalEntity,
  attachment: Attachment,
|};
