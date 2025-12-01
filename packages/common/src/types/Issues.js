// @flow
import type {
  EventType,
  Game,
  TrainingSession,
} from '@kitman/common/src/types/Event';
import type { Coding } from '@kitman/common/src/types/Coding';
import type { PresentationType } from '@kitman/services/src/services/medical/getPresentationTypes';
import type { IssueContactType } from '@kitman/services/src/services/medical/getIssueContactTypes';
import type { ConditionWithQuestions } from '@kitman/modules/src/ConditionalFields/shared/types';
import type { TreatmentSession, RehabSession } from './Treatments';
import type {
  Diagnostic,
  Issue,
} from '../../../modules/src/Medical/shared/types';

export type IssueStatusEventResponse = {
  id: number,
  injury_status_id: number,
  date: string,
  event_date: string,
  // Enhanced data
  injury_status: {
    id: number,
    description: string,
    cause_unavailability: boolean,
    restore_availability: boolean,
  },
  created_by: {
    id: number,
    fullname: string,
  },
  updated_at: string,
};

export type Attachment = {
  id: number,
  url: string,
  filename: string,
  filetype: string,
  filesize: number,
  audio_file: boolean,
};

export type AttachedLink = {
  id: number,
  uri: string,
  title: string,
  created_by: {
    fullname: string,
  },
  uri_type: string,
  created_at: string,
};

export type MedicationData = {
  is_completed: boolean,
  dosage: string,
  end_date: string,
  frequency: string,
  notes: string,
  start_date: string,
  type: string,
};

export type Note = {
  id: string,
  date: string,
  note: string,
  created_by: string,
  restricted: boolean,
  psych_only: boolean,
};

export type Osics = {
  osics_id: string,
  osics_pathology_id: string,
  osics_classification_id: string,
  osics_body_area_id: string,
  side_id: string,
  icd: ?string,
  // Enhanced data
  osics_pathology: string,
  osics_classification: string,
  osics_body_area: string,
  bamic: ?boolean,
  groups: ?Array<string>,
};

export type Question = {
  id: number,
  parent_question_id: ?number,
  question: string,
  question_type: 'multiple-choice' | 'free-text',
  order: number,
  question_metadata: Array<{ value: string, order: number }>,
  answer: { id: number, value: string },
};

export type ReopenedStatus = {
  reason: string,
  value: ?string,
};

export type FreeTextComponent = {
  name: string,
  value: string,
  id?: number,
};

export type WorkersCompData = {
  athlete_address_line_1: string,
  athlete_address_line_2: string,
  athlete_city: string,
  athlete_dob: string,
  athlete_first_name: string,
  athlete_last_name: string,
  athlete_phone_number: string,
  athlete_position: string,
  social_security_number: string,
  athlete_ssn: string,
  athlete_state: string,
  athlete_zip: string,
  body_area_id: number,
  claim_number: ?string,
  created_at: string,
  guid: string,
  id: number,
  loss_city: string,
  loss_date: string,
  loss_description: string,
  loss_jurisdiction: string,
  loss_state: string,
  loss_time: string,
  policy_number: string,
  report_date: string,
  reporter_first_name: string,
  reporter_last_name: string,
  reporter_phone_number: string,
  side_id: number,
  status: 'draft' | 'submitted',
  updated_at: string,
};

export type OshaData = {
  athlete_activity: string,
  case_number: string,
  city: string,
  created_at: string,
  date_hired: string,
  date_of_death: string,
  dob: string,
  emergency_room: boolean,
  facility_city: string,
  facility_name: string,
  facility_state: string,
  facility_street: string,
  facility_zip: string,
  full_name: string,
  hospitalized: boolean,
  id: number,
  issue_date: string,
  issue_description: string,
  object_substance: string,
  physician_full_name: string,
  report_date: string,
  reporter_full_name: string,
  reporter_phone_number: string,
  sex: string,
  state: string,
  status: string,
  street: string,
  time_began_work: string,
  time_event: string,
  no_time_event: boolean,
  title: string,
  updated_at: string,
  what_happened: string,
  zip: string,
};

export type OnsetType = {
  id: number,
  name: string,
  require_additional_input?: boolean,
};

export type IssueConstraints = {
  read_only: boolean,
};

export type ExtendedAttributes = {
  id: number,
  value: string,
  attribute_name: string,
};

export type Squad = {
  id: number,
  name: string,
};

export type IssueOccurrenceRequested = {
  id: number,
  read_only: boolean,
  issue_id: number,
  issue_type: string,
  occurrence_type: string,
  athlete_id: number,
  activity: string,
  activity_id: number,
  association_period_id: ?number,
  ambra_reason_link?: { custom_field: string },
  external_identifier: string,
  side_id: string,
  activity_type: EventType,
  game: { event: Game },
  game_id: ?number | ?string,
  training_session: { event: TrainingSession },
  training_session_id: ?number | ?string,
  occurrence_min: number,
  occurrence_date: string,
  created_at: string,
  created_by: string,
  examination_date?: ?string,
  reported_date: string,
  position_when_injured: string,
  position_when_injured_id: number,
  diagnostics: Array<Diagnostic>,
  notes: Array<Note>,
  modification_info: string,
  events_order: Array<string>,
  events: Array<IssueStatusEventResponse>,
  session_completed: ?boolean,
  osics: Osics,
  events_duration: Object,
  unavailability_duration: number,
  total_duration: number,
  type_id: number,
  issue_occurrence_onset_id: number,
  onset_id?: number,
  full_pathology?: string,
  freetext_components?: Array<FreeTextComponent>,
  closed: boolean,
  has_recurrence: boolean,
  recurrence_outside_system: boolean,
  is_first_occurrence: boolean,
  isChronicIssue: boolean,
  issueType: string,
  supplementary_pathology: string,
  supplementary_coding: string,
  bamic_grade_id?: ?number | ?string,
  bamic_site_id?: ?string,
  injury_mechanism_id?: ?number,
  treatment_sessions: ?Array<TreatmentSession>,
  rehab_sessions: Array<RehabSession>,
  // Enhanced data
  side?: string,
  bamic_grade: {
    grade?: string,
    name?: string,
  },
  bamic_site: {
    site?: string,
    name?: string,
  },
  onset: string,
  onset_description: string,
  onset_type: OnsetType,
  mechanism_description: string,
  conditional_questions: Array<Question>,
  conditions_with_questions: Array<ConditionWithQuestions>,
  concussion_assessments?: Array<number>,
  coding: Coding,
  issue_occurrence_title: string | null,
  issue_contact_type: ?IssueContactType,
  // This is pure guess work and will likely change
  reopened_status?: ?ReopenedStatus,
  presentation_type: ?PresentationType,
  linked_issues: ?Array<Issue>,
  attached_links: ?Array<AttachedLink>,
  player_left_club?: boolean,
  organisation_id?: ?number,
  linked_chronic_issues: ?Array<Object>,
  workers_comp: ?WorkersCompData,
  osha: ?OshaData,
  continuation_issue?: {
    id: number,
    issue_occurrence_title: string,
    organisation_name: string,
  },
  continuation_outside_system?: boolean,
  constraints?: ?IssueConstraints,
  title_or_pathology: string,
  resolved_date: string,
  resolved_at: string,
  resolved_by: {
    id: number,
    firstname: string,
    lastname: string,
    fullname: string,
  },
  screening_conditions: Array<ConditionWithQuestions>,
  extended_attributes: Array<ExtendedAttributes>,
  squad: Squad,
};

export type ChronicIssueRequested = {
  id: number,
  athlete_id: number,
  title: string, // todo
  event_id: number,
  training_session_id: ?number,
  game_id: ?number,
  reported_date: string,
  examination_date: string,
  created_by: string,
  created_at: string,
  coding: Coding,
  occurrences: {
    linked_issues: ?Array<Issue>,
    chronic_occurrences: ?Array<Issue>,
  },
};

export type IssueWithChronic = IssueOccurrenceRequested | ChronicIssueRequested;

export type MainCategory = 'injury' | 'illness' | 'issue';

export type InjuryCategory =
  | 'all_injuries'
  | 'body_area'
  | 'classification'
  | 'activity'
  | 'session_type'
  | 'contact_type';

export type IllnessCategory = 'all_illnesses' | 'body_area' | 'classification';
