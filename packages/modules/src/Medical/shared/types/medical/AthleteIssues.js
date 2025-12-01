// @flow
import type {
  MetaIssue,
  Issue,
} from '@kitman/modules/src/Medical/shared/types';

export type AthleteIssues = {
  meta?: MetaIssue,
  issues?: Array<Issue>,
  open_issues?: Array<Issue>,
  closed_issues?: Array<Issue>,
  recurrence_outside_system: boolean,
};
