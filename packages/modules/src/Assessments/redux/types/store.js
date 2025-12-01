// @flow
import $ from 'jquery';
import type { ToastItem } from '@kitman/components/src/types';
import type { StatusVariable } from '@kitman/common/src/types';
import type { Squad } from '@kitman/common/src/types/Squad';
import type { Turnaround } from '@kitman/common/src/types/Turnaround';
import type { OrganisationTrainingVariables } from '@kitman/common/src/types/Workload';
import type {
  Athlete,
  Assessment,
  AssessmentTemplate,
  User,
  ViewType,
} from '../../types';

export type Store = {
  viewType: ViewType,
  athletes: Array<Athlete>,
  assessments: Array<Assessment>,
  assessmentTemplates: Array<AssessmentTemplate>,
  organisationTrainingVariables: Array<OrganisationTrainingVariables>,
  statusVariables: Array<StatusVariable>,
  currentSquad: Squad,
  users: Array<User>,
  appState: {
    assessmentsRequestStatus: 'FAILURE' | 'PENDING' | 'SUCCESS',
    selectedAthlete: number,
    filteredTemplates: Array<string>,
    nextAssessmentId: ?number,
    fetchAssessmentsXHR: $.JQueryXHR,
  },
  appStatus: {
    status: 'loading' | 'error',
  },
  toasts: Array<ToastItem>,
  turnaroundList: Array<Turnaround>,
};
