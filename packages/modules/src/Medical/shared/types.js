// @flow
import type { DateRange } from '@kitman/common/src/types';
import type { Coding } from '@kitman/common/src/types/Coding';
import moment from 'moment-timezone';
import type { DiagnosticStatus } from '@kitman/services/src/services/medical/getDiagnosticStatuses';
import type { TransferRecord } from '@kitman/services/src/services/getAthleteData';
import type {
  AttachedTransformedFile,
  PresignedPost,
} from '@kitman/common/src/utils/fileHelper';
import type { SelectOption } from '@kitman/components/src/types';
import type { OpenIssue } from '@kitman/modules/src/Medical/rosters/types';
import type { Squad } from '@kitman/common/src/types/Issues';
import type { MedicalAttachmentCategory } from './types/medical/EntityAttachment';
import type { LastActivePeriod } from './components/AddMedicalNoteSidePanel/hooks/useMedicalNoteForm';

export type RequestStatus = ?'PENDING' | 'SUCCESS' | 'FAILURE';

export type LatestNote = {
  title: string,
  content: string,
  date: string,
  restricted_annotation: boolean,
};
export type NoteType =
  | 'OrganisationAnnotationTypes::Medical'
  | 'OrganisationAnnotationTypes::Nutrition'
  | 'OrganisationAnnotationTypes::Modification'
  | 'OrganisationAnnotationTypes::Diagnostic'
  | 'OrganisationAnnotationTypes::Document'
  | 'OrganisationAnnotationTypes::RehabSession'
  | 'OrganisationAnnotationTypes::Procedure'
  | 'OrganisationAnnotationTypes::LegacyPresagiaConcussion'
  | 'OrganisationAnnotationTypes::Telephone'
  | 'OrganisationAnnotationTypes::MedicalDictation'
  | 'OrganisationAnnotationTypes::DailyStatusNote';

export type NotesFilters = {
  content: string,
  athlete_id: ?number | string,
  squads: Array<string>,
  author: Array<string>,
  organisation_annotation_type: Array<NoteType>,
  organisation_annotation_type_ids: Array<number>,
  date_range: DateRange | null,
  unexpired?: boolean,
  archived: boolean,
};

export type AnnotationAttachement = {
  original_filename: string,
  filetype: string,
  filesize: number,
  name?: string,
  medical_attachment_category_ids?: Array<number>,
};

export type DocumentsFilters = {
  content: string,
  athlete_id: ?number | string,
  date_range: DateRange | null,
  document_note_category_ids: Array<number> | null,
  organisation_annotation_type: Array<NoteType>,
  organisation_annotation_type_ids: Array<number>,
  issue_occurrence: {
    id: number | null,
    type: string | null,
  } | null,
  squads: Array<string>,
  author: Array<string>,
  unexpired?: boolean,
  archived: boolean,
};

export type FilesFilters = {
  athlete_id: ?number,
  filename: string,
  document_date: DateRange | null,
  document_category_ids: Array<number>,
  archived?: boolean,
};

export type ModificationFilters = {
  content: string,
  athlete_id: ?number | string,
  squads: Array<string>,
  author: Array<string>,
  organisation_annotation_type: Array<NoteType>,
  organisation_annotation_type_ids: Array<number>,
  date_range: DateRange | null,
  expired?: boolean,
};

export type SportDetails = {
  id: number,
  name: string,
};

export type OtherEventOption = {
  id: number,
  shortname: string,
  label: string,
  sport: ?SportDetails,
};

export type GameEventOption = {
  name: string,
  value: string,
  game_date: string,
};

export type DetailedGameEventOption = {
  value: string,
  game_date: string | null,
  name: string,
  score: string | null,
  opponent_score: string | null,
  event_id: string | null,
  squad: Squad,
};

export type TrainingSessionEventOption = { name: string, value: string };
export type DetailedTrainingSessionEventOption = {
  name: string,
  value: string,
  training_date: string | null,
  event_id: string | null,
  squad: Squad,
};

export type SelectEventOption = SelectOption;

type position = {
  id: number,
  name: string,
  abbreviation: string,
};

export type FormAthlete = {
  id: number,
  avatar_url: string,
  firstname: string,
  fullname: string,
  lastname: string,
  position?: string | position,
};

export type IssueAvailability = {
  description: string,
  cause_unavailability: boolean,
  restore_availability: boolean,
};

export type MetaIssue = {
  current_page: number,
  next_page: ?number,
  prev_page: ?number,
  total_pages: number,
  total_count: number,
};

export type IssueDetails = {
  id: number,
  athlete_id: number,
  osics: {
    osics_code: string,
    pathology: {
      id: number,
      name: string,
    },
    classification: {
      id: number,
      name: string,
    },
    body_area: {
      id: number,
      name: string,
    },
    icd: ?string,
    groups: ?Array<string>,
    osics_pathology_id: number,
  },
  side_id: number,
  illness_onset_id?: ?number,
  injury_type_id?: ?number, // leaving as chronic issue may still have this
  issue_occurrence_onset_id?: ?number,
  bamic_grade_id?: ?number,
  bamic_site_id?: ?number,
  coding: ?Coding,
};

export type IssueType =
  | 'Injury'
  | 'Illness'
  | 'ChronicInjury'
  | 'ChronicIllness'
  | 'Emr::Private::Models::ChronicIssue';

export type IssueStatusTypes = 'new' | 'recurrence' | 'continuation';
export type IssueStatus = 'open' | 'closed' | 'archived' | 'prior' | 'chronic';
export type Issue = {
  id: number,
  occurrence_date: string,
  occurrence_type?: string,
  closed: boolean,
  full_pathology: string,
  issue_occurrence_title: string,
  issue?: IssueDetails,
  issue_type: IssueType,
  injury_status: IssueAvailability,
  resolved_date: ?string,
  archived: ?boolean,
  archive_reason: ?{
    id: number,
    name: string,
  },
  archived_by: ?{
    id: number,
    fullname: string,
  },
  archived_date: ?string,
  player_left_club?: boolean,
  org_last_transfer_record?: ?TransferRecord,
};

export type ConcussionIssue = {
  ...Issue,
  athlete?: FormAthlete,
  unavailability_duration: number,
  examination_date: string,
  created_by: number,
  created_at: string,
};

export type ConditionalFieldAnswer = {
  question_id: number,
  value: string,
};

export type Visibility = 'DEFAULT' | 'DOCTORS' | 'PSYCH_TEAM';

export type Dispatch<T> = (action: T) => any;

export type TreatmentBodyArea = {
  id: number,
  name: string,
  side: {
    id: number,
    name: string,
  },
  treatable_area: {
    id: number,
    name: string,
    osics_body_area: {
      id: number,
      name: string,
    },
  },
  treatable_area_type: string,
};

export type TreatmentModality = {
  id: number,
  name: string,
  treatment_category: {
    id: number,
    name: string,
  },
};

export type Treatment = {
  duration: string,
  id: number,
  issue: Issue,
  issue_name: string,
  issue_type: string,
  note: string,
  reason: string,
  treatment_body_areas: Array<TreatmentBodyArea>,
  treatment_modality: TreatmentModality,
  is_billable: boolean,
  billable_items: {
    cpt_code: string,
    amount_charged: string,
    discount: string,
    amount_paid_insurance: string,
    amount_due: string,
    amount_paid_athlete: string,
    date_paid: string,
  },
};

export type Athlete = {
  firstname: string,
  fullname: string,
  id: number,
  lastname: string,
  shortname: string,
  avatar_url?: ?string,
};

export type Availability =
  | 'absent'
  | 'unavailable'
  | 'injured'
  | 'returning'
  | 'available';

export type User = {
  firstname: string,
  fullname: string,
  id: number,
  lastname: string,
};
export type QueuedAttachment = {
  filename: string,
  fileType: string,
  fileSize: string,
  file: File,
};
export type Attachment = {
  id: number,
  url: string,
  name: string,
  filename: string,
  filetype: string,
  filesize: number,
  audio_file: boolean,
  confirmed: boolean,
  presigned_post: ?PresignedPost,
  download_url: string,
  created_by: User,
  medical_attachment_categories?: Array<MedicalAttachmentCategory>,
  archived_at?: ?string,
  archived_reason?: ?{
    id: number,
    name: string,
  },
  attachment_date?: string, // Date
  created?: string, // Date
  versions?: Array<{
    changeset: {
      name: [string, string], // [‘old attachment title, ‘attachment title’]
      medical_attachment_categories: [
        Array<MedicalAttachmentCategory>,
        Array<MedicalAttachmentCategory>
      ], // [ [categories removed], [categories added] ]
    },
    updated_at: string, // Date
    updated_by?: ?User,
  }>,
};

export type Annotation = {
  annotation_actions: Array<?string>,
  annotation_date: ?string,
  annotationable: {
    type: string,
    fullname: string,
    id: number,
    avatar_url: string,
    availability: Availability,
    athlete_squads: Array<{
      id: number,
      name: string,
    }>,
  },
  annotationable_type: 'Athlete' | 'Diagnostic',
  archived: boolean,
  attachments: Array<Attachment>,
  content: string,
  created_at: string,
  created_by: {
    fullname: string,
    id: number,
  },
  id: number,
  organisation_annotation_type: {
    id: number,
    name: string,
    type: string,
  },
  title: string,
  updated_at: string,
  updated_by: string,
};

export type AddDocument = {
  athlete_id: number,
  document_category_ids?: Array<number>,
  document_date: string | null,
  attachment: {
    filesize: number,
    filetype: string,
    original_filename: string,
    medical_attachment_category_ids?: Array<number>,
  },
  injury_occurrence_ids: Array<number>,
  illness_occurrence_ids: Array<number>,
  chronic_issue_ids: Array<number>,
  annotation: {
    title: ?string,
    content: ?string,
  },
};

export type LinkedIssues = {
  injury_occurrence_ids?: Array<number>,
  illness_occurrence_ids?: Array<number>,
  chronic_issue_ids?: Array<number>,
};

export type UpdateDocument = {
  ...LinkedIssues,
  document_category_ids?: Array<number>,
  document_date?: string | null,
  attachment?: {
    name?: string,
    medical_attachment_category_ids?: Array<number>,
  },
  annotation?: {
    title: ?string,
    content: ?string,
  },
};

export type AddDocuments = {
  documents: Array<AddDocument>,
};

export type AnnotationActionsAttributes = Array<{
  content: string,
  completed: boolean,
  user_ids: number,
  due_date: string,
}>;

export type AnnotationForm = {
  annotationable_type:
    | 'Athlete'
    | 'Diagnostic'
    | 'Emr::Private::Models::Procedure',
  annotationable_id: ?number,
  athlete_id?: ?number,
  diagnostic_id?: ?number,
  procedure_id?: ?number,
  organisation_annotation_type_id: ?number,
  document_note_category_ids?: Array<number>,
  title: string,
  annotation_date: ?string | moment.Moment,
  content: string,
  illness_occurrence_ids: Array<number>,
  injury_occurrence_ids: Array<number>,
  chronic_issue_ids?: Array<number>,
  restricted_to_doc: boolean,
  restricted_to_psych: boolean,
  attachments_attributes: Array<AttachedTransformedFile>,
  annotation_actions_attributes: AnnotationActionsAttributes,
  squad_id?: ?number,
  author_id?: ?number,
  lastActivePeriod?: LastActivePeriod,
  note_visibility_ids?: ?Array<SelectOption>,
  allow_list?: ?Array<?number>,
};

export type BulkNote = {
  annotationable_type: 'Athlete',
  annotationable_id: number,
};

export type BulkNoteAnnotationForm = {
  organisation_annotation_type_id: number,
  annotationables: Array<BulkNote>,
  title: string,
  annotation_date: string,
  content: string,
  scope_to_org: boolean,
};

type TreatmentLocation = {
  id: number,
  name: string,
};

export type TreatmentSession = {
  annotation: Annotation,
  athlete: Athlete,
  created_at: string,
  created_by: User,
  end_time: string,
  location: TreatmentLocation,
  referring_physician: string,
  id: number,
  start_time: string,
  timezone: string,
  title: string,
  treatments: Array<Treatment>,
  user: User,
  organisation_id: number,
};
type TimeRange = {
  start_time: string,
  end_time: string,
};
export type InjuryIllnessOccurrence =
  | 'injury_occurrence'
  | 'illness_occurrence';
export type IssueOccurrence = {
  type: InjuryIllnessOccurrence,
  id: number,
};

type CommonTreatmentParams = {
  athlete_id: ?string | number,
  squads: Array<string>,
  search_expression: string,
  issue_occurrence?: {
    type:
      | 'injury_occurrence'
      | 'illness_occurrence'
      | 'Emr::Private::Models::ChronicIssue',
    id: number,
  },
};
export type TreatmentFilter = {
  ...CommonTreatmentParams,
  date_range: DateRange | null,
};

export type TreatmentAPIFilter = {
  ...CommonTreatmentParams,
  time_range: TimeRange | null,
};

type DiagnosticStatusValue =
  | 'incomplete'
  | 'pending'
  | 'missing reason'
  | 'ordered'
  | 'key result'
  | 'normal/abnormal'
  | 'complete';
export type DiagnosticFilter = {
  athlete_id: ?string | number,
  search_expression: string,
  date_range: DateRange | null,
  squads: Array<string>,
  statuses: Array<DiagnosticStatusValue>,
  diagnostic_reason_ids: Array<number>,
  diagnostic_location_ids: Array<number>,
  provider_sgids: Array<string>,
  diagnostic_type_ids: Array<number>,
  result_type: Array<string>,
  reviewed: boolean | null,
};

export type ProceduresFilter = {
  athlete_ids: Array<?string | ?number>,
  search_expression: string,
  date_range: DateRange | null,
  squads: Array<string>,
  procedure_reason_ids: Array<number>,
  procedure_location_ids: Array<number>,
  procedure_type_ids: Array<number>,
};

export type AllergiesFilter = {
  athlete_id: ?string | number,
  search_expression: string,
  squad_ids?: Array<number>,
  position_ids?: Array<number>,
  severities?: Array<string>,
  categories?: Array<string>,
  archived: boolean,
};

export type MedicalAlertsFilter = {
  athlete_id?: number | null,
  search_expression?: string,
  squad_ids?: Array<number>,
  position_ids?: Array<number>,
  severities?: Array<string>,
  date_range?: DateRange | null,
  archived: boolean,
};

export type DrFirstMedicationsFilter = {
  athlete_id?: ?number | ?string,
  search_expression?: string,
  squad_ids?: Array<number>,
  position_ids?: Array<number>,
  severities?: Array<string>,
  date_range?: DateRange | null,
  archived: boolean,
};

export type MedicationFilter = {
  athlete_id?: number | null,
  search_expression: string,
  squad_ids?: Array<number>,
  status: 'active' | 'paused' | 'completed',
  provider: Array<string>,
  date_range: DateRange | null,
};

export type FormFilter = {
  athleteId?: string,
  formType?: string,
  category?: string,
  group?: string,
  injuryOccurenceId?: string,
  illnessOccurenceId?: string,
  key?: string,
};

export type CovidTestMeta = {
  covid_reference: string,
  covid_test_type: string,
  covid_test_date: string,
  covid_test_result: string,
};
export type CovidAntibodyTestMeta = {
  covid_antibody_result: string,
  covid_antibody_reference: string,
  covid_antibody_test_type: string,
  covid_antibody_test_date: string,
  covid_antibody_timezone: string,
};
export type MedicationMeta = {
  type: string,
  dosage: string,
  frequency: string,
  is_completed: boolean,
  start_date: string,
  end_date: string,
  notes: string,
};

export type MedicalMeta = {
  covid_reference?: string,
  covid_test_type?: string,
  covid_test_date?: string,
  covid_test_timezone?: string,
  covid_test_result?: string,
  covid_antibody_result?: string,
  covid_antibody_reference?: string,
  covid_antibody_test_type?: string,
  covid_antibody_test_date?: string,
  covid_antibody_timezone?: string,
  type?: string,
  dosage?: string,
  frequency?: string,
  is_completed?: boolean,
  start_date?: string,
  end_date?: string,
  notes?: string,
};
export type DiagnosticAttachment = {
  id: number,
  url: string,
  filename: string,
  filetype: string,
  filesize: number,
  audio_file: boolean,
  confirmed: boolean,
  presigned_post: null,
  download_url: string,
  attachment_date: string,
  created_by: {
    id: number,
    firstname: string,
    lastname: string,
    fullname: string,
  },
};

export type IssueOccurrenceFDetail = {
  issue_type: IssueType,
  id: number,
  full_pathology: string,
  issue_occurrence_title: string,
  occurrence_date: string,
};

export type DiagnosticIssueOccurrence = IssueOccurrenceFDetail;

export type DiagnosticAthlete = {
  id: number,
  avatar_url: string,
  gender?: string,
  fullname: string,
  position: string,
  date_of_birth: string,
  nfl_id: string,
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

type DiagnosticAnnotation = {
  title: string,
  content: string,
};
export type BillableItemFromResponse = {
  id: number,
  cpt_code: string,
  is_billable: boolean,
  amount_charged: string,
  discount: string,
  amount_paid_insurance: string,
  amount_due: string,
  amount_paid_athlete: string,
  date_paid: string,
  referring_physician: string,
};
export type ChronicIssue = {
  id: number,
  full_pathology: string,
  pathology: string,
  title: string,
  reported_date?: string,
  issue_occurrence_title?: string,
};
export type DiagnosticBodyArea = {
  name: string,
  id: number,
};

export type DiagnosticResponseAnswer = {
  datetime: string | null,
  diagnostic_type_question: {
    description: string,
    diagnostic_type_question_choices: Array<{
      id: number,
      name: string,
      optional_text: boolean,
    }>,
    id: number,
    label: string,
    question_type: string,
    required: boolean,
  },
  diagnostic_type_question_choice: {
    id: number,
    name: string,
    optional_text: boolean,
  } | null,
  id: number,
  text: string | null,
};
export type Diagnostic = {
  id: number,
  athlete: DiagnosticAthlete,
  reviewed: boolean,
  type: string,
  diagnostic_date: string,
  order_date: string,
  is_medication: boolean,
  medical_meta: MedicalMeta,
  attached_links: Array<AttachedLink>,
  redox_pdf_results: Array<any>,
  redox_order: {
    id: number,
    external_identifier: string,
    client_id: string,
    order_date: string,
    truncated_name: string,
    label_printing: boolean,
  } | null,
  attachments: Array<DiagnosticAttachment>,
  issue_occurrences: Array<DiagnosticIssueOccurrence>,
  body_area?: DiagnosticBodyArea,
  laterality: { id: number, name: string },
  chronic_issues: Array<ChronicIssue>,
  created_date: string,
  redox_completed_at?: string,
  raw_athlete_info: string,
  created_by: {
    id: number,
    firstname: string,
    lastname: string,
    fullname: string,
  },
  location: {
    id: number,
    name: string,
    account: string | null,
    type_of: {
      name: 'diagnostic',
      value: 0,
    },
  },
  prescriber: {
    id: number,
    fullname: string,
  },
  provider: {
    id: number,
    fullname: string,
    npi: string,
  },
  diagnostic_reason: {
    id: number,
    name: string,
  },
  annotations: Array<DiagnosticAnnotation>,
  cpt_code: string,
  is_billable: boolean,
  amount_charged: string,
  discount: string,
  amount_paid_insurance: string,
  amount_due: string,
  amount_paid_athlete: string,
  date_paid: string,
  referring_physician: string,
  billable_items: Array<BillableItemFromResponse>,
  status: DiagnosticStatus,
  organisation_id: number,
  team_name: string,
  diagnostic_type_answers: Array<DiagnosticResponseAnswer>,
  results_status: DiagnosticStatus,
};

export type ConcussionTestProtocol = 'NPC' | 'KING-DEVICK';

export type NoteAction = {
  id: number,
  text: string,
  onCallAction: Function,
};

export type TreatmentPermissions = {
  canView: boolean,
  canCreate: boolean,
  canEdit: boolean,
};

export type TUEPermissions = {
  canCreate: boolean,
};

export type ViewType = 'PRESENTATION' | 'EDIT';

export type LinkedIssue = {
  id: number,
  issue_type: any,
  occurrence_date: string,
  full_pathology: string,
  issue_occurrence_title: string,
};

export type VisibilityOption = {
  value: 'DEFAULT' | 'DOCTORS' | 'PSYCH_TEAM',
  label: string,
};

export type FormDescription = {
  description: string,
  key: string,
  completionDate: ?string,
  expiryDate: ?string,
};

type ColumnDataType = {
  frozen: boolean,
  idx: number,
  isLastFrozenColumn: boolean,
  key: string,
  maxWidth: number | null,
  minWidth: number | null,
  name: string,
  resizable: boolean,
  rowGroup: boolean,
  sortable: boolean,
  width: number,
};

export type ColumnRowData = {
  id: number,
  completionDate: string,
  editorFullName: string,
  formTypeFullName: ?string,
  formType: string,
  status: FormDescription,
  selected: boolean,
  expiryDate?: string,
  athlete: FormAthlete & {
    availability: string,
  },
  related_issue?: LinkedIssue,
  participation_level?: {
    id: number,
    name: string,
  },
};

export type InjuryOccurrence = {
  occurrence_date: string,
  id: number,
};

export type TestHistorySummary = {
  athlete: FormAthlete & {
    availability: string,
  },
  completionDate: string,
  concussionDiagnosed: FormDescription,
  date: string,
  editorFullName: string,
  formType: string,
  linkedIssue: {
    injury: IssueDetails,
    injury_occurrence: InjuryOccurrence,
  },
  id: number,
};

export type ConcussionDiagnosed = {
  description: 'Concussion found' | 'No concussion found' | 'Unknown',
  key: 'concussion_found' | 'no_concussion_found' | 'unkown',
};

export type ConcussionInjurySummary = {
  id: number,
  closed: boolean,
  occurrenceDate: string,
  issue: string,
  resolutionDate: ?string,
  status: IssueAvailability,
  athlete?: FormAthlete,
  unavailableDuration: ?number,
};

export type ConcussionSelectOptions = {
  value: number,
  label: string,
};

export type ConcussionInjuryCellData = {
  column: ColumnRowData,
  isCellSelected: boolean,
  row: ConcussionInjurySummary,
  type: string,
};

export type TestHistoryCellData = {
  column: ColumnRowData,
  isCellSelected: boolean,
  row: TestHistorySummary,
  type: string,
};

export type ColumnCellDataType = {
  column: ColumnDataType,
  isCellSelected: boolean,
  row: ColumnRowData,
  type: string,
};

export type ReportsFilter = {
  squads: Array<string>,
  date_range: DateRange | null,
};

export type ExportFilter = DiagnosticFilter | TreatmentFilter | ReportsFilter;

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

type SimpleOrganisation = {
  id: number,
  name: string,
  logo_full_path: ?string,
};

export type GridRow = {
  id: number,
  player_id?: string,
  user_id?: number,
  fullname: string,
  email: string,
  avatar_url: string,
  date_of_birth?: string,
  organisations?: Array<SimpleOrganisation>,
  org_last_transfer_record: TransferRecord,
  open_issue_occurrences: Array<OpenIssue>,
};
export type GridData = {
  columns: Array<Column>,
  rows: Array<GridRow>,
  next_id: ?number,
};
export type DiagnosticformattedText = {
  head: string,
  body: string,
};
export type DiagnosticResultsBlock = {
  order_id: number,
  type: 'report' | 'lab',
  reviewed: boolean,
  result_group_id: string,
  completed_at: string,
  patient_notes: Array<{
    body: string,
  }>,
  results: [
    {
      redox_order_id: number,
      index: ?number,
      athlete_id: number,
      description: ?string,
      code: ?string,
      notes: ?string,
      code_set: ?string,
      value: ?string,
      value_type: ?string,
      status: ?string,
      abnormal_flag: ?string,
      specimen_source: ?string,
      specimen_body_site: ?string,
      formatted_text: ?Array<DiagnosticformattedText>,
      reference: ?string,
      units: ?string,
      application_order_id: string,
      reference_id: string,
      original_organisation_name: string,
      created_at: string,
    }
  ],
};

export type Medication = {
  directions: ?string,
  display_name: string,
  end_date: ?string,
  external_prescriber_name: ?string,
  frequency: ?string,
  id: number,
  note: ?string,
  pharmacy: ?string,
  prescriber_sgid: ?string,
  quantity: ?string,
  quantity_units: ?string,
  reason: ?string,
  route: ?string,
  start_date: ?string,
  status: 'active' | 'paused' | 'completed',
  type: 'DrFirst',
};

export type DiagnosticResultsBlockList = {
  results: Array<DiagnosticResultsBlock>,
};

export type PanelType =
  | 'ISSUE'
  | 'MEDICAL_NOTE'
  | 'MODIFICATION'
  | 'DIAGNOSTIC'
  | 'DOCUMENT'
  | 'FILE'
  | 'TREATMENT'
  | 'ALLERGY'
  | 'CHRONIC_CONDITION'
  | 'MEDICAL_ALERT'
  | 'PROCEDURE'
  | 'VACCINATION'
  | 'TUE'
  | 'NPC'
  | 'KING_DEVICK';

export type SquadAthletesSelectOption = {
  ...SelectOption,
  previous_organisation?: ?{
    has_open_illnesses: boolean,
    has_open_injuries: boolean,
  },
  squad_id?: ?string,
};
