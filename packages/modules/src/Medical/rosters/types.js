// @flow
import type {
  IssueType,
  AnnotationForm,
  AnnotationAttachement,
} from '@kitman/modules/src/Medical/shared/types';

export type Column = {
  assessment_item_id: ?number,
  datatype: string,
  id: number,
  default: boolean,
  name: string,
  protected: boolean,
  readonly: boolean,
  row_key: string,
};

export type OpenIssue = {
  id: number,
  issue_id: number,
  issue_type: IssueType,
  name: string,
  status: string,
  causing_unavailability: boolean,
  status_id: ?number,
  preliminary_status_complete: boolean,
};

export type LatestNote = {
  title: string,
  content: string,
  date: string,
  restricted_annotation: boolean,
};

export type CardiacScreening = {
  status: {
    value:
      | 'outstanding'
      | 'expired'
      | 'follow_up_required'
      | 'expiring'
      | 'complete',
    text:
      | 'Outstanding'
      | 'Expired'
      | 'Follow up required'
      | 'Expiring'
      | 'Complete',
  },
  completion_date?: string,
  expiration_date: string,
  expiration_days?: number,
};

export type AthleteOpenIssues = { has_more: boolean, issues: Array<OpenIssue> };

export type GridRow = {
  id: number,
  player_id?: string,
  athlete: {
    fullname: string,
    availability: string,
    avatar_url: string,
    position: string,
    athlete_cardiac_screening_status: CardiacScreening,
  },
  open_injuries_illnesses: AthleteOpenIssues,
  latest_note: LatestNote,
  squad: Array<{ name: string, primary: boolean }>,
  availability_status: { availability: string, unavailable_since: string },
  // If the user does not have the issues-view / view-allergy permission, this will be null
  allergies?:
    | Array<string>
    | Array<{ id: number, display_name: string, severity: string }>,
};

export type GridData = {
  columns: Array<Column>,
  rows: Array<GridRow>,
  next_id: ?number,
};

export type RosterFilters = {
  athlete_name: string,
  positions: Array<number>,
  squads: Array<number>,
  availabilities: Array<number>,
  issues: Array<number>,
};

export type AnnotationAttachment = {
  annotationable_type: 'Athlete',
  annotationable_id: ?number,
  organisation_annotation_type_id: ?number,
  title: string,
  annotation_date: ?string,
  content: string,
  illness_occurrence_ids: Array<number>,
  injury_occurrence_ids: Array<number>,
  restrict_access_to?: ?string,
  attachments_attributes: Array<File>,
  annotation_actions_attributes: Array<{
    content: string,
    completed: boolean,
    user_ids: number,
    due_date: string,
  }>,
};

export type DiagnosisAttachments = {
  id: number,
  type: string,
  attachmentContent: AnnotationForm,
};
export type IssueAnnotationForm = {
  annotationable_type: 'Athlete',
  annotationable_id: ?number,
  organisation_annotation_type_id: ?number,
  title: string,
  annotation_date: ?string,
  content: string,
  illness_occurrence_ids: Array<number>,
  injury_occurrence_ids: Array<number>,
  chronic_issue_ids?: Array<number>,
  restricted_to_doc: boolean,
  restricted_to_psych: boolean,
  attachments: Array<File>,
  attachments_attributes: Array<AnnotationAttachement>,
  annotation_actions_attributes: Array<{
    content: string,
    completed: boolean,
    user_ids: number,
    due_date: string,
  }>,
  filesQueue: Array<string>,
};

export type IssueAttachments = {
  id: number,
  type: string,
  attachmentContent: IssueAnnotationForm,
};

export type PreliminarySchema = {
  activity?: 'optional' | 'mandatory',
  game_id?: 'optional' | 'mandatory',
  training_session_id?: 'optional' | 'mandatory',
  position_when_injured_id?: 'optional' | 'mandatory',
  presentation_type?: 'optional' | 'mandatory',
  athlete?: { id: 'optional' | 'mandatory' },
  occurrence_date?: 'optional' | 'mandatory',
  reported_date?: 'optional' | 'mandatory',
  squad?: { id: 'optional' | 'mandatory' },
  examination_date_basic?: 'optional' | 'mandatory',
  linked_chronic_issues?: 'optional' | 'mandatory',
  chronic_issue_onset_date?: 'optional' | 'mandatory',
  reccurrence_id?: 'optional' | 'mandatory',
  continuation_issue_id?: 'optional' | 'mandatory',
  issue_type?: 'optional' | 'mandatory',
  issue_occurrence_onset_id?: 'optional' | 'mandatory',
  illness_onset_id?: 'optional' | 'mandatory',
  primary_pathology?: { id: 'optional' | 'mandatory' },
  side_id?: 'optional' | 'mandatory',
  events?: 'optional' | 'mandatory',
  statuses?: 'optional' | 'mandatory',
  concussion_assessments?: 'optional' | 'mandatory',
  examination_date?: 'optional' | 'mandatory',
  activity_id?: 'optional' | 'mandatory',
  annotations?: 'optional' | 'mandatory',
  issue_contact_type?: 'optional' | 'mandatory',
  injury_mechanism?: 'optional' | 'mandatory',
};
