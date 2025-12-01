// @flow
import type { SelectOption } from '@kitman/components/src/types';

type ShortUser = {
  fullname: ?string,
  id: ?number,
};

export type AssignedItem = {
  id: number,
  name: string,
};

export type ShortVersion = {
  creator: ShortUser,
  id: number,
  name: ?string,
  published_at: ?string,
  publisher: ?ShortUser,
  version: number,
  assigned_organisations: Array<AssignedItem>,
  assigned_squads: Array<AssignedItem>,
};
type Owner = {
  owner_id: number,
  owner_type: 'Association' | 'Organisation' | 'Squad' | 'ConfigurationContext',
};

export type Ruleset = Owner & {
  archive_reason: ?string,
  archived_at: ?string,
  archived_by: ?ShortUser,
  creator: ShortUser,
  current_version: ?number,
  id: number,
  name: ?string,
  versions: Array<ShortVersion>,
};

export type ShortRuleset = {
  archived_at: ?string,
  id: number,
  name: string,
  owner_id: ?number,
  owner_type: ?'Association' | 'Organisation',
};

export type ShortRulesets = Array<ShortRuleset>;

export type Rulesets = Array<Ruleset>;

type QuestionChoice = {
  value: string,
  order: number,
};

export type QuestionMetaDataForMultipleChoice = Array<QuestionChoice>;
type QuestionMetaData = QuestionMetaDataForMultipleChoice | null;

export type SerializedAnswer = {
  value: string | null,
  id: number,
  screening_ruleset_version_id: number,
};

export type ScreeningAnswer = {
  question_id: number,
  value: Array<string>,
  parent_question_id?: number,
};

// BE response type Question
export type SerializedQuestion = {
  value: string,
  question: {
    answers?: Array<SerializedAnswer>,
    parent_question_id?: number, // parent_question_id exists when is child question
    value: string,
    answer_datatype: string,
    csv_header: ?string,
    default_required_for_complete_record: string,
    default_value: ?string,
    detail: ?string,
    id: number, // this always exists from BE
    name: ?string,
    order: number,
    path: ?string,
    placement: string,
    question: string,
    question_metadata: QuestionMetaData,
    question_type: string,
    training_variable_perma_id: ?string,
    trigger_value: ?string,
    ui_component: ?string,
    children: Array<SerializedQuestion>, // followup questions    value?: SerializedQuestion
  },
  parent_question_id?: number, // parent_question_id exists when is child question
  children: Array<SerializedQuestion>,
};

export type ActiveQuestion = {
  id?: number, // this id comes from BE and exists if already saved in DB
  answer_datatype: string,
  csv_header: ?string,
  default_required_for_complete_record: string,
  default_value: ?string,
  detail: ?string,
  name: string,
  order: number,
  path: ?string,
  placement: ?string, // should be null for now
  question: string,
  question_options: QuestionMetaDataForMultipleChoice,
  question_type: string,
  training_variable_perma_id: ?string,
  trigger_value: ?string,
  previous_version_of_question_id: ?number,
  children: Array<ActiveQuestion>, // followup questions
  questionNumbering: string,
};

export type Operator = 'eq' | 'and' | 'or' | 'not' | 'contains' | null;

export type Operand = {
  operator: Operator,
  path: string,
  value: string,
};

export type Predicate = {
  operator: Operator,
  operands: Array<Operand>,
};

// Response type of Condition
export type ConditionWithQuestions = {
  id: number,
  archived_at: string,
  location: string,
  name: string,
  order: number,
  predicate: Predicate,
  screening_ruleset_id: number,
  screening_ruleset_version_id: number,
  questions: Array<SerializedQuestion>,
};

export type BasicConditionalFieldAnswer = {
  question_id: number,
  answers: Array<SerializedAnswer>,
};

// this is for the answers array in the CF form and issue Level Questions
export type ConditionalFieldAnswer = BasicConditionalFieldAnswer & {
  screening_ruleset_version_id: number,
  value: Array<string>,
  parent_question_id?: number,
};

// Active Condition is for client-side state management
// ConditionWithQuestion is from BE
// biggest difference is how questions are handled
// ActiveQuestion is very different from SerializedQuestion
export type ActiveCondition = {
  id?: number, // this id comes from BE and exists if saved in DB
  index: number,
  predicate: Predicate,
  location: string,
  name: string,
  order: ?number,
  questions: Array<ActiveQuestion>,
};

export type Version = {
  creator: ShortUser,
  id: number,
  name: string,
  published_at: string,
  publisher: ?ShortUser,
  version: number,
  conditions: Array<ConditionWithQuestions>,
};

type Location = {
  value: string,
  label: string,
};

export type PredicateOptionTransformed = {
  value: string,
  label: string,
  metaData: {
    operators: Array<SelectOption>,
    options: Array<SelectOption>,
    deprecated: boolean,
    path: string,
  },
};
export type PredicateOption = {
  deprecated: boolean,
  label: string,
  operators: Array<SelectOption>,
  options: Array<SelectOption>,
  path: string,
};
export type PredicateOptions = {
  locations: Array<Location>,
  predicate_options: Array<PredicateOption>,
};

export const ROW_KEY = {
  name: 'name',
  published_at: 'published_at',
  version: 'version',
  status: 'status',
  squads: 'squads',
  squad: 'squad',
  active_players: 'active_players',
  assigned_date: 'assigned_date',
  assigned: 'assigned',
  athlete: 'athlete',
  consent: 'consented',
  consent_date: 'consent_date',
  consent_actions: 'consent_actions',
};

export type Column = {
  id: $Keys<typeof ROW_KEY>,
  row_key: $Keys<typeof ROW_KEY>,
};

export type DataCell = {
  id: string,
  content: any,
};

export type Row = {
  id: number | string,
  cells: Array<DataCell>,
  classnames?: Object,
};

export type GridConfig = {
  rows: Array<Row>,
  columns: Array<Column>,
  emptyTableText: string,
  id: string,
};

export type GridData = {
  columns: Array<Column>,
  rows: Array<Row>,
  next_id?: ?number,
};

export type OrgLevelProps = {
  organisationId: string,
};

export type RulesetLevelProps = {
  organisationId: string,
  rulesetId: string,
  title?: ?string, // it's possible to create a ruleset without a title
};

export type Sport = {
  id: number,
  name: string,
};

export type Assignee = {
  id: number,
  name: string,
  sport: ?Sport,
  active_athlete_count?: number,
};

export type ShortAssignment = {
  id: number | null,
  active?: boolean,
  assignee_type: 'squad' | 'organisation',
  assignee: Assignee,
  creator?: ShortUser,
  created_at?: string,
  updated_at?: string,
};

export type Assignees = {
  screening_ruleset: Ruleset,
  screening_ruleset_version_id: number,
  assignments: Array<ShortAssignment>,
};

export type Assignment = {
  squad_id: number,
  active: boolean,
};

export type NewQuestion = {
  // Required
  answer_datatype: string,
  default_required_for_complete_record: string,
  placement: string,
  question: string,
  question_options: QuestionMetaDataForMultipleChoice,
  question_type: string,

  // Optional
  csv_header?: ?string,
  default_value?: ?string,
  detail?: ?string,
  name?: ?string,
  path?: ?string,
  placement?: ?string,
  previous_version_of_question_id?: ?number,
  training_variable_perma_id?: ?string,
  trigger_value?: ?string,
  ui_component?: ?string,
};

export type NewQuestionTree = {
  question: NewQuestion,
  children: Array<NewQuestionTree>,
};

export type NewCondition = {
  location: string,
  name: string,
  predicate: Predicate,
  questions: Array<NewQuestionTree>,
};

export type NewRulesetVersion = {
  name: string,
  conditions: Array<NewCondition>,
};

export type RequiredFieldsAndValues = {
  ruleName: ?boolean,
  question: ?boolean,
  questionName: ?boolean,
  questionType: ?boolean,
};
