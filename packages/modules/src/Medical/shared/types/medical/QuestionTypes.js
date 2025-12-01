// @flow
import type { BodyArea } from '@kitman/modules/src/HumanInput/types/forms';

export type QuestionAndAnswer = {
  question: string,
  answer: ?string,
  id: string | number,
  type: 'questionAndAnswer' | 'descriptionContent',
  renderConfig?: {
    renderAs: 'color',
    valueMap: { [string]: string },
  },
};

export type UserDetails = {
  id: number,
  firstname: string,
  lastname: string,
  fullname: string,
};

export type FormAttachment = {
  id: number,
  url: string,
  filename: string,
  filetype: string,
  filesize: number, // bytes
  created: string, // date e.g 2024-06-10T15:11:28Z
  created_by: UserDetails,
  attachment_date: string, // date e.g "2024-08-20T20:45:21Z"
};

export type InlineAttachment = {
  type: 'attachment',
  attachment: FormAttachment,
  id: string,
  displayType: 'signature' | 'image' | 'file',
  title: ?string,
  signatureName?: ?string,
};

export type QuestionGroup = {
  questionsAndAnswers: Array<
    QuestionAndAnswer | InlineAttachment | QuestionGroup
  >,
  isConditional: boolean,
  isGroupInData: boolean,
  id: number,
  columns?: number,
  title?: string,
  type: 'group' | 'table',
  repeatableAnswerIndex?: number,
};

export type Separator = {
  type: 'separator',
  id: number | string,
};

export type QuestionSection = {
  title: string,
  elements: Array<QuestionGroup | Separator>,
  id: number,
  elementId: string,
  columns?: number,
  sidePanelSection: ?boolean,
};

type MedicalIssueSummary = {
  id: number,
  athlete_id: number,
  occurrence_id: number,
  occurrence_date: string,
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
    body_area?: BodyArea,
    icd: ?string,
  },
};

type InjurySummary = MedicalIssueSummary & {
  type: 'injury',
};

type IllnessSummary = MedicalIssueSummary & {
  type: 'illness',
};

export type InjuryIllnessSummary = InjurySummary | IllnessSummary;

export type FormMeta = {
  id: number,
  category: string,
  group: string,
  key: string,
  name: string,
  fullname: string,
  enabled: boolean,
  created_at: string,
  updated_at: string,
};

export type AthleteDetails = UserDetails & {
  position: {
    id: number,
    name: string,
    order: number,
  },
  availability: string,
  avatar_url?: string,
};

export type FormInfo = {
  formMeta: FormMeta,
  headerTitle: ?string,
  hideFormInfo: ?boolean,
  mergeSections: ?boolean,
  editor: UserDetails,
  athlete: AthleteDetails,
  status: string,
  linked_injuries_illnesses?: ?Array<InjuryIllnessSummary>,
  date: string,
  created_at: string,
  updated_at: string,
  attachments: Array<FormAttachment>,
};

type CustomParams = {
  columns?: number,
  group?: string, // aggregation group
  type?: 'signature' | 'image', // Used for attachment type
  style?: ?'rating' | 'linear',
  data_depends_on?: string,
  on_change_update?: string,
};

export type FormElement = {
  visible?: boolean,
  id: number,
  element_type: string,
  form_elements?: Array<Object>,
  config: {
    min?: number,
    max?: number | string,
    step?: number,
    items?: Array<Object>,
    data_source?: string,
    condition?: Object,
    text?: string,
    title?: string,
    element_id: string,
    optional?: boolean,
    custom_params?: ?CustomParams,
    repeatable?: boolean, // Group property to say elements may have array of answers
  },
};
