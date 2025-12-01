// @flow
import type { EventActivityDrillV2 } from '@kitman/common/src/types/Event';
import type { GamePeriod } from '@kitman/common/src/types/GameEvent';
import type { AttachedFile } from '@kitman/common/src/utils/fileHelper';

export type Column = {
  assessment_item_id: number,
  datatype: string,
  id: number,
  default: boolean,
  name: string,
  protected: boolean,
  readonly: boolean,
  row_key: string,
};

export type Athlete = {
  id: number,
  fullname: string,
  avatar_url: string,
  rpe?: number,
  minutes?: number,
  value?: number,
  assessment_item_id?: number,
};

export type GridRow = {
  id: number,
  [key: string]: any,
};

export type GridData = {
  columns: Array<Column>,
  rows: Array<GridRow>,
  next_id: ?number,
};

export type CollectionsGridData = {
  columns: Array<Column>,
  rows: Array<GridRow>,
  nextId: ?number,
};

export type SelectedGridDetails = {
  id: number | string,
  name: string,
  type: 'DEFAULT' | 'ASSESSMENT',
  participationLevels?: Array<{ id: number, name: string }>,
  updatedWorkloadGridRows: Array<number>,
  updatedAssessmentGridRows: Array<{
    id: number,
    assessmentItemId: number,
    value: number,
  }>,
};

export type AssessmentGroup = {
  id: number,
  name: string,
  participation_levels?: Array<{ id: number, name: string }>,
};

export type AssessmentTemplate = {
  id: number,
  name: string,
  include_users: boolean,
  assessment_group_id: number,
};

export type EditHistory = {
  user: {
    id: number,
    firstname: string,
    lastname: string,
    fullname: string,
  },
  date: string,
};

export type Note = {
  content: ?string,
  createdAt?: string,
};
export type CommentsViewType = 'EDIT' | 'VIEW';
export type Comment = {
  assessmentItemId: number,
  assessmentItemName: string,
  note: ?Note,
};
export type Comments = Array<Comment>;
export type EditedComment = {
  assessment_item_id: number,
  athlete_id: number,
  value: ?string,
};
export type EditedComments = Array<EditedComment>;

export type ParticipationLevelSelectOption = {
  id: number,
  label: string,
  value: number,
  requireIssue: boolean,
};

export type TrainingVariable = {
  id: number,
  name: string,
  description: ?string,
  perma_id: string,
  variable_type_id: number,
  min: number,
  max: number,
  invert_scale: boolean,
};

export type User = {
  id: number,
  fullname: string,
};

export type Answer = {
  id: number,
  value: ?number,
  note: Note,
  previous_answer: ?{
    value: number,
    colour: string,
    edit_history: ?EditHistory,
  },
  users: Array<User>,
  colour: ?string,
  edit_history: ?EditHistory,
  athlete_id: number,
};

export type Metric = {
  id: number,
  training_variable: TrainingVariable,
  is_protected?: boolean,
  answers: Array<Answer>,
};

export type StatusNote = {
  id: number,
  note: Note,
  users: Array<User>,
  athlete_id: number,
};

export type Status = {
  id: number,
  source: string,
  variable: string,
  summary: string,
  period_scope: string,
  period_length: number,
  is_protected?: boolean,
  notes: Array<StatusNote>,
};

export type AssessmentHeader = {
  id: number,
  name: string,
};

export type AssessmentMetricItem = {
  id: number,
  item_type: 'AssessmentMetric',
  item: Metric,
  order: number,
};

export type AssessmentItem = AssessmentMetricItem;

export type AthleteFilter = {
  athlete_name: string,
  positions: Array<string>,
  squads: Array<number>,
  availabilities: Array<number>,
  participation_levels: Array<number>,
};

export type Import = {
  id: string,
  progress: string,
  type: string,
  name: string,
  created_at: string,
  updated_at: string,
  progressUpdated: boolean,
};

export type Notification = {
  sent_at: string,
};

export type RequestStatus = 'LOADING' | 'PENDING' | 'SUCCESS' | 'FAILURE';

export type EventActivityAttributes = {
  duration: ?number,
  principle_ids: Array<number | string>,
  athlete_ids: Array<number>,
  user_ids: Array<number>,
  event_activity_type_id: ?number,
};

export type PrinciplesItemFilter = {
  category: Array<number | string>,
  type: Array<number | string>,
  phase: Array<number | string>,
};

export type planningTab =
  | 'athletes_tab'
  | 'collections_tab'
  | 'collections_tab_assessment';

export const PLANNING_SIDE_PANEL_STATES = Object.freeze({
  DrillLibrary: 'DRILL_LIBRARY',
  CreateDrill: 'CREATE_DRILL',
  ViewDrill: 'VIEW_DRILL',
  ManagePrinciples: 'MANAGE_PRINCIPLES',
  None: 'NONE',
});
export type PlanningSidePanelStates = $Values<
  typeof PLANNING_SIDE_PANEL_STATES
>;

export type ParticipationLevel = {
  value: number,
  label: string,
  canonical_participation_level: 'full' | 'none' | 'partial',
  include_in_group_calculations: boolean,
};

export type GamePeriodDuration = {
  min: number,
  max: number,
  id?: number,
};

export type LibraryDrillToUpdate = {
  drill: ?EventActivityDrillV2,
  diagram: ?AttachedFile,
  attachments: ?Array<AttachedFile>,
};

export type PlanningFreeTextKeys =
  | 'event_evaluation_went_well'
  | 'event_evaluation_went_wrong'
  | 'event_objectives';

export type Game = {
  id: string | number,
  game_periods: Array<GamePeriod>,
};
