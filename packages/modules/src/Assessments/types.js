// @flow

import type {
  TrainingSession,
  Game,
  TrainingVariable,
} from '@kitman/common/src/types/Workload';
import type { ParticipationLevel } from '@kitman/services/src/services/getParticipationLevels';

export type Athlete = {
  id: number,
  firstname: string,
  lastname: string,
  fullname: string,
  avatar_url: string,
  position_group: string,
};

export type User = {
  id: number,
  fullname: string,
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
  edit_history: ?EditHistory,
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

export type StatusValues = {
  [number]: number,
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

export type AssessmentTemplate = {
  id: number,
  name: string,
  include_users: boolean,
  assessment_group_id: number,
};

export type AssessmentMetricItem = {
  id: number,
  item_type: 'AssessmentMetric',
  item: Metric,
  order: number,
};

export type AssessmentStatusItem = {
  id: number,
  item_type: 'AssessmentStatus',
  item: Status,
  order: number,
};

export type AssessmentHeaderItem = {
  id: number,
  item_type: 'AssessmentHeader',
  item: AssessmentHeader,
  order: number,
};

export type AssessmentItem =
  | AssessmentMetricItem
  | AssessmentStatusItem
  | AssessmentHeaderItem;

export type Assessment = {
  id: number,
  assessment_template: ?{
    id: number,
    name: string,
  },
  // if assessments-multiple-athletes disabled
  assessment_date: ?string,
  // if assessments-multiple-athletes enabled
  assessment_group_date: ?string,
  // if assessments-multiple-athletes enabled
  isCurrentSquad?: boolean,
  athletes: Array<Athlete>,
  event_type: ?('Fixture' | 'TrainingSession'),
  event: ?(TrainingSession | Game),
  name: string,
  items: Array<AssessmentItem>,
  participation_levels?: Array<ParticipationLevel>,
};

export type AssessmentPermissions = {
  viewProtectedMetrics: boolean,
  createAssessment: boolean,
  editAssessment: boolean,
  deleteAssessment: boolean,
  answerAssessment: boolean,
  manageAssessmentTemplate: boolean,
  createAssessmentFromTemplate: boolean,
};

export type ViewType = 'LIST' | 'GRID' | 'TEMPLATE';

export type TableMode = 'VIEW' | 'EDIT';

export type CommentsViewType = 'EDITION' | 'PRESENTATION';
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
export type EditedScore = {
  assessment_item_id: number,
  athlete_id: number,
  value: ?number,
  colour?: string,
};
export type EditedScores = Array<EditedScore>;

export type GridPanelsType =
  | 'ADD_METRIC'
  | 'ADD_STATUS'
  | 'ADD_ATHLETES'
  | 'COMMENTS';
