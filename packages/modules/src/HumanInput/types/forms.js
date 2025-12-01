// @flow

import type { FormState } from '@kitman/modules/src/HumanInput/shared/redux/slices/formStateSlice';
import type { FormMenuState } from '@kitman/modules/src/HumanInput/shared/redux/slices/formMenuSlice';
import type { FormValidationState } from '@kitman/modules/src/HumanInput/shared/redux/slices/formValidationSlice';
import type { FormAttachmentState } from '@kitman/modules/src/HumanInput/shared/redux/slices/formAttachmentSlice';

/**
 * All form statuses are not yet known
 * More status are likely to be added
 */

export const FORM_STATUS = Object.freeze({
  COMPLETE: 'complete',
  DRAFT: 'draft',
  DELETED: 'deleted',
  NOT_STARTED: 'not_started',
});

export type FormStatus = $Values<typeof FORM_STATUS>;

/**
 * Likely to change as backend service is built
 */
export type Form = {
  formId: number,
  formName: string,
  type: string,
  category: string,
  assignedTo?: string,
  evaluating?: string,
  schedule?: string,
  status: FormStatus,
  createdBy: string,
  updatedAt?: string,
  archived?: boolean,
  archivedDate?: string,
  archivedBy?: string,
  archiveReason?: string,
};

/**
 * All form statuses are not yet known
 * More status are likely to be added
 */
export type FormResultStatus = 'complete';

/**
 * Likely to change as backend service is built
 */
type Athlete = {
  athleteId: number,
  athleteName: string,
  athletePosition: string,
  imageUrl: string,
};

/**
 * Likely to change as backend service is built
 */
export type FormResult = {
  formId: number,
  resultId: number,
  athlete: Athlete,
  completionDate: string,
  examiner: string,
  status: FormStatus,
};

type FormDetail = {
  id: number,
  category: string,
  group: string,
  key: string,
  name: string,
  fullname: string,
  form_type: string,
  config: any, // was null in example data needs type properly defined.
  enabled: boolean,
  created_at: string,
  updated_at: string,
};

export type Editor = {
  id: number,
  firstname: string,
  lastname: string,
  fullname: string,
};

type Association = {
  id?: number | string,
  type?: string,
  source?: string,
  element_id?: string,
};

type Config = {
  association: Association,
};

export type ElementTypes =
  | 'Forms::Elements::Inputs::Attachment'
  | 'Forms::Elements::Inputs::Boolean'
  | 'Forms::Elements::Inputs::DateTime'
  | 'Forms::Elements::Inputs::MultipleChoice'
  | 'Forms::Elements::Inputs::Number'
  | 'Forms::Elements::Inputs::SingleChoice'
  | 'Forms::Elements::Inputs::Text'
  | 'Forms::Elements::Inputs::Range'
  | 'Forms::Elements::Layouts::Content'
  | 'Forms::Elements::Layouts::Group'
  | 'Forms::Elements::Layouts::Menu'
  | 'Forms::Elements::Layouts::MenuGroup'
  | 'Forms::Elements::Layouts::MenuItem'
  | 'Forms::Elements::Layouts::Section'
  | 'Forms::Elements::Customs::Kt1000'
  | 'Forms::Elements::Customs::BloodPressure';

export type CustomParamType =
  | 'ssn'
  | 'phone'
  | 'email'
  | 'free'
  | 'signature'
  | 'address'
  | 'collapsible';

type BloodPressureValue = {
  diastolic: number,
  systolic: number,
};

type KT1000Value = {
  displacement: number,
  force: number,
};

export type ValueTypes =
  | string
  | number
  | boolean
  | BloodPressureValue
  | KT1000Value
  | Array<string | number | boolean | null>
  | null;

export type ConditionType =
  | '=='
  | '!='
  | '<='
  | '<'
  | '>'
  | '>='
  | 'and'
  | 'or'
  | 'not'
  | 'in';

export type Condition = {
  element_id: ?string,
  type: ConditionType,
  value_type: ?string,
  value: string | number | boolean,
  conditions: ?Array<Condition>,
};

export type CustomParams = {
  columns?: number,
  style?: string,
  icon?: string,
  unit?: string,
  type?: CustomParamType,
  accepted_types?: Array<string>,
  readonly?: boolean,
  editable_modes?: Array<string>,
  default_value?: ValueTypes,
  content_type?: string,
  validation?: Condition,
  mode?: string,
  data_depends_on?: string,
  on_change_update?: string,
  max_size?: string,
  increment?: number,
  default_country_code?: string,
  show_title?: boolean,
};

export type SelectOption = {
  value: string,
  label: string,
  color?: string,
  score?: number,
  children?: Array<SelectOption>,
};

export type FormElementConfigCondition = {
  element_id?: string,
  type: string,
  value_type?: string,
  value?: string | number | boolean,
  conditions?: Array<FormElementConfigCondition>,
};

type FormElementConfig = {
  type?: string,
  text?: string,
  data_point?: boolean,
  element_id: string,
  optional?: boolean,
  custom_params?: CustomParams,
  items?: Array<SelectOption>,
  default_value?: string | boolean,
  data_source?: string,
  data_source_params?: Array<string>,
  condition?: FormElementConfigCondition,
  title?: string,
  min?: number,
  max?: number,
};

export type FormElement = {
  id: number,
  element_type: ElementTypes,
  config: FormElementConfig,
  visible: boolean,
  order: number,
  form_elements: Array<FormElement>,
};

type FormTemplateVersion = {
  id: number,
  name: string,
  version: number,
  created_at: string,
  updated_at: string,
  editor: Editor,
  config: Config,
  form_elements: Array<FormElement>,
};

type Position = {
  id: number,
  name: string,
  order: number,
};

export type FormAthlete = {
  id: number,
  firstname: string,
  lastname: string,
  fullname: string,
  position: Position,
  availability: string,
  avatar_url: string,
};

type ConcussionDiagnosed = {
  description: string,
  key: string,
};

export type FormAnswer = {
  id: number,
  form_element: FormElement,
  value: ValueTypes,
  value_formatted?: ?string,
  created_at: string,
  updated_at: string,
  isDescriptionContent?: boolean,
};

type Extra = {
  association: Association,
};

type Pathology = {
  id: number,
  name: string,
};

type Classification = {
  id: number,
  name: string,
};

export type BodyArea = {
  id: number,
  name: string,
};

type Osics = {
  osics_code: string,
  pathology: Pathology,
  classification: Classification,
  body_area: BodyArea,
  icd: ?any, // was null in example data needs type properly defined.
  bamic: ?any, // was null in example data needs type properly defined.
};

type Injury = {
  id: number,
  athlete_id: number,
  osics: Osics,
  coding: ?any, // was null in example data needs type properly defined.
};

type InjuryOccurence = {
  id: number,
  occurrence_date: string,
};

type ConcussionInjury = {
  injury: Injury,
  injury_occurrence: InjuryOccurence,
};

export type IndividualFormResult = {
  id: number,
  organisation_id: number,
  form: FormDetail,
  form_template_version: FormTemplateVersion,
  athlete: FormAthlete,
  editor: Editor,
  status: string,
  concussion_diagnosed: ?ConcussionDiagnosed,
  event_id: ?any, // was null in example data needs type properly defined.,
  date: string,
  created_at: string,
  updated_at: string,
  form_answers: Array<FormAnswer>,
  extra: ?Extra,
  concussion_injury: ?ConcussionInjury,
};

export type FormDetailsItem = {
  assigned: string,
  assignedBy: string,
  formType: string,
  category: string,
  template: string,
};

export type FormSchedule = {
  startDate: string,
};

export type AdditionalPreferences = {
  reminders: string,
  time: string,
  repeats: string,
};

export type Assign = {
  whoReceivesForm: string,
  usedToEvaluateOthers: boolean,
  groupToBeEvaluated: string,
  assignTo: string,
  whoIsEvaluated: string,
};

export type Visibility = {
  resultsViewedBy: string,
  alertsEmailedTo: string,
};

export type AssignAndVisibility = {
  assign: Assign,
  visibility: Visibility,
};

export type FormDetails = {
  formDetails?: FormDetailsItem,
  schedule?: FormSchedule,
  additionalPreferences?: AdditionalPreferences,
  assignAndVisibility?: AssignAndVisibility,
};

export type SelectedMenuItem = {
  elementId: string,
  elementTitle: string,
};

export type QuestionAndAnswer = { [key: string]: Array<FormAnswer> };

/**
 * * HI Form Structure
 * ? This structure will be appended to as the backend evolve and iterate on the response returned
 * ? Currently using some types that overlapped with the V1 and V2
 * TODO: Review types above - a lot are based on concussion and will need to be migrated to generic version below
 */

export type HumanInputAthlete = {
  availability: string,
  avatar_url: string,
  firstname: string,
  fullname: string,
  id: number,
  lastname: string,
  position: Position,
};

export type HumanInputUser = {
  availability: string,
  avatar_url: string,
  firstname: string,
  fullname: string,
  id: number,
  lastname: string,
  is_active: boolean,
  username: string,
  email: string,
};

type HumanInputFormDetails = {
  category: string, // Could this be an enum?
  config: null, // currently only the config key and a null value is returned
  created_at: string,
  enabled: boolean,
  form_type: string, // Could this be an enum?
  fullname: string,
  group: string, // Could this be an enum?
  id: number,
  key: string,
  name: string,
  updated_at: string,
};

export type HumanInputFormElementConfig = {
  autopopulate?: boolean,
  condition?: Condition,
  custom_params?: CustomParams,
  default_value?: boolean,
  data_point?: boolean,
  data_source?: string,
  data_source_params?: Array<string>,
  element_id: string,
  items?: Array<SelectOption>,
  max?: string,
  min?: string,
  optional?: boolean,
  optional_condition?: Condition,
  post_processors?: Array<string>,
  repeatable?: boolean,
  source?: string,
  text?: string,
  title?: string,
  type?: string,
  validation?: Condition,
  variable?: string,
};

export type HumanInputFormElement = {
  config: HumanInputFormElementConfig,
  element_type: ElementTypes,
  form_elements: Array<HumanInputFormElement>,
  id: number,
  order: number,
  visible: boolean,
};

export type Attachment = {
  attachment_date: string,
  created: string,
  created_by: Editor,
  filename: string,
  filesize: number,
  filetype: string,
  id: number,
  url: string,
};

export type BrandingHeaderConfig = {
  hidden: boolean,
  image: {
    hidden: boolean,
    current_organisation_logo: boolean,
    attachment_id?: number,
    attachment: Attachment,
  },
  text: {
    hidden: boolean,
    content: string,
    color: string,
  },
  color: {
    primary: string,
  },
  layout: 'left' | 'right' | 'center',
};

export type SettingsConfig = {
  can_edit_submitted_forms: boolean,
  can_save_drafts: boolean,
  autosave_as_draft: boolean,
  autopopulate_from_previous_answerset: boolean,
  input_method: {
    athlete_app: boolean,
    kiosk_app: boolean,
    web: boolean,
  },
};

export type HumanInputFormTemplateVersionConfig = {
  header?: BrandingHeaderConfig,
  settings?: SettingsConfig,
  post_processors?: Array<string>,
};

export type HumanInputFormTemplateVersion = {
  config: HumanInputFormTemplateVersionConfig | null,
  created_at: string,
  editor: Editor,
  form_elements: Array<HumanInputFormElement>,
  id: number,
  name: string,
  updated_at: string,
  version: number,
};

export type HumanInputFormAnswer = {
  id: number,
  form_element: HumanInputFormElement,
  value: ValueTypes,
  value_formatted?: ?string,
  created_at: string,
  updated_at: string,
  attachment?: ?Attachment,
  attachments?: ?Array<Attachment>,
};

export type HumanInputForm = {
  athlete?: HumanInputAthlete,
  user?: HumanInputUser,
  date: string,
  editor: Editor,
  extra: null, // currently only the extra key and a null value is returned
  form: HumanInputFormDetails,
  form_answers: Array<HumanInputFormAnswer>,
  form_template_version: HumanInputFormTemplateVersion,
  id: number,
  organisation_id: number,
  status: FormStatus,
};

export type FormMenuItem = {
  element_type: ElementTypes,
  index: number,
  items: Array<FormMenuItem>,
  key?: string,
  title?: ?string,
  fields: Array<number>,
};

export type FormMenu = FormMenuItem;

export type Mode = 'CREATE' | 'EDIT' | 'VIEW';

export type FieldState = {
  [id: number]: ValueTypes,
};

export type LocalDraft = {
  timestamp: string,
  data: FieldState,
};

export type FormConfig = {
  showMenuIcons: boolean,
  mode: Mode,
  showUnsavedChangesModal: boolean,
  showRecoveryModal: boolean,
  localDraft: ?LocalDraft,
  shouldShowMenu: boolean,
  lastSaved?: ?string,
};

export type ElementState = {
  [key: string]: FormElement,
};

export type Store = {
  formMenuSlice: FormMenuState,
  formStateSlice: FormState,
  formValidationSlice: FormValidationState,
  formAttachmentSlice: FormAttachmentState,
};

export const ATTACHMENT_TYPES = Object.freeze({
  AVATAR: 'avatar',
  SIGNATURE: 'signature',
});

export type AttachmentTypes = $Values<typeof ATTACHMENT_TYPES>;
export type FormAssignmentDetails = {
  category: string,
  config: HumanInputFormTemplateVersionConfig | null,
  created_at: string,
  enabled: boolean,
  form_type: ?string,
  fullname: ?string,
  group: string,
  id: number,
  key: string,
  name: string,
  updated_at: string,
};
export type FormAssignment = {
  form: FormAssignmentDetails,
  form_template_id: number,
  id: number,
  last_completion_date: ?string,
  last_draft_date: ?string,
  open_draft_count: number,
  latest_drafts: Array<{
    date: string,
    id: number,
    status: string,
  }>,
};

export type AssignmentAthlete = {
  id: number,
  firstname: string,
  lastname: string,
  fullname: string,
  user_id: number,
};

export type FormAssignmentQueryResponse = {
  athlete_ids: Array<number>,
  athletes: Array<AssignmentAthlete>,
};
