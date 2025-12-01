// @flow
import type { MainCategory } from '@kitman/common/src/types/Issues';
import type { IssueStatusTypes } from '@kitman/modules/src/Medical/shared/types';
import type { AssessmentTemplate } from '@kitman/modules/src/PlanningEvent/types';
import type { AthleteBasic } from '@kitman/common/src/types/Athlete';
import type { Event } from '@kitman/common/src/types/Event';
import type { TrainingVariable } from '@kitman/common/src/types/Workload';

export type RequestStatus =
  | 'DORMANT'
  | 'PENDING'
  | 'SUCCESS'
  | 'ERROR'
  | 'UPDATING';

// TODO: this type must be moved to `@kitman/common`.
export type InjuryIllnessUpdate = {
  from_issue_occurrence_id: number,
  to_issue_occurrence_id?: number,
  to_type: IssueStatusTypes,
  issue_type: MainCategory,
  athlete_id: number | string,
  recurrence_outside_system?: boolean,
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

export const assessmentItemTypes = {
  metric: 'AssessmentMetric',
  header: 'AssessmentHeader',
};
export type Metric = {
  id: number,
  training_variable: TrainingVariable,
  is_protected?: boolean,
  answers?: Array<Answer>,
};
export type AssessmentMetricItem = {
  id: number,
  item_type: $Values<typeof assessmentItemTypes>,
  item: Metric,
  order: number,
};

export type AssessmentHeader = {
  id: number,
  name?: string,
};

export type AssessmentHeaderItem = {
  id: number,
  item_type: $Values<typeof assessmentItemTypes>,
  item: AssessmentHeader,
  order: number,
};

export type AssessmentItem = {
  item_type: $Values<typeof assessmentItemTypes>,
  item: Metric | AssessmentHeader,
  order: number,
};

export type AssessmentGroup = {
  assessment_group_date: string,
  assessment_template: AssessmentTemplate,
  athletes: Array<{
    ...AthleteBasic,
    position_group: string,
    shortname: string,
    firstname: string,
    lastname: string,
  }>,
  event: ?Event,
  event_type: ?('Game' | 'TrainingSession'),
  squad: {
    id: number,
    name: string,
  },
  items: Array<AssessmentItem>,
};
