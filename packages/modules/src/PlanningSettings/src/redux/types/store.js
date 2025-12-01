// @flow
import type { AssessmentTemplate, SessionAssessment } from '../../../types';

export type Store = {
  app: {
    assessmentTemplates: Array<AssessmentTemplate>,
    requestStatus: 'FAILURE' | 'LOADING' | 'SUCCESS',
  },
  sessionAssessments: {
    data: Array<SessionAssessment>,
    editedSessionAssessments: {
      number: Array<number>,
    },
    requestStatus: 'FAILURE' | 'LOADING' | 'SUCCESS',
  },
  gameTemplates: {
    assessmentTemplates: Array<number>,
    editedGameTemplates: Array<number>,
    requestStatus: 'FAILURE' | 'LOADING' | 'SUCCESS',
  },
};
