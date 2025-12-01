// @flow
import type {
  FormAthlete,
  FormDescription,
  IssueDetails,
  InjuryOccurrence,
  ConcussionDiagnosed,
} from '@kitman/modules/src/Medical/shared/types';

export type FormSummary = {
  id: ?number | ?string,
  formType: string,
  formTypeFullName: ?string,
  athlete?: FormAthlete,
  completionDate: ?string,
  expiryDate?: ?string,
  status?: FormDescription,
  concussionDiagnosed?: ConcussionDiagnosed,
  linkedIssue?: {
    injury: IssueDetails,
    injury_occurrence: InjuryOccurrence,
  },
  editorFullName: string,
};
