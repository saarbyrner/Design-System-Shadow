// @flow

export type IssueFieldConstraint = 'mandatory' | 'must_have' | 'optional';

export type IssueFieldCommonKey =
  | 'annotations'
  | 'athlete_id'
  | 'chronic_issue_onset_date'
  | 'concussion_assessments'
  | 'conditional_questions'
  | 'continuation_issue_id'
  | 'created_by'
  | 'events'
  | 'examination_date'
  | 'examination_date_basic'
  | 'has_supplementary_pathology'
  | 'issue_occurrence_onset_id'
  | 'issue_occurrence_title'
  | 'issue_type'
  | 'linked_chronic_issues'
  | 'occurrence_date'
  | 'primary_pathology_id'
  | 'reccurrence_id'
  | 'reported_date'
  | 'side_id'
  | 'coding_system_side_id'
  | 'squad_id'
  | 'squad'
  | 'supplementary_pathology'
  | 'tso_id';

export type IssueFieldInjuryKey =
  | 'activity_id'
  | 'activity_type'
  | 'association_period_id'
  | 'bamic_grade_id'
  | 'bamic_site_id'
  | 'external_source_id'
  | 'external_source_name'
  | 'game_id'
  | 'injury_mechanism'
  | 'injury_occurrence_external_id'
  | 'issue_contact_type'
  | 'occurrence_min'
  | 'position_when_injured_id'
  | 'presentation_type'
  | 'session_completed'
  | 'supplemental_recurrence_id'
  | 'training_session_id';

export type IssueFieldIllnessKey =
  | 'activity_id'
  | 'game_id'
  | 'illness_onset_id'
  | 'position_when_injured_id'
  | 'training_session_id';

export type IssueFormFieldKey =
  | IssueFieldCommonKey
  | IssueFieldInjuryKey
  | IssueFieldIllnessKey;
