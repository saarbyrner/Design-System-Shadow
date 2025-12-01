// @flow
import type { AssessmentsPermissions } from './types';

export const defaultAssessmentsPermissions = {
  canCreateAsssessment: false,
  canCreateAssessmentFromTemplate: false,
  canAnswerAssessment: false,
  canViewAsssessments: false,
};

export const setAssessmentsPermissions = (
  assessmentsPermissions: Array<string>
): AssessmentsPermissions => {
  return {
    canCreateAsssessment: assessmentsPermissions?.includes('create-assessment'),
    canCreateAssessmentFromTemplate: assessmentsPermissions?.includes(
      'create-assessment-from-template'
    ),
    canAnswerAssessment: assessmentsPermissions?.includes('answer-assessment'),
    canViewAsssessments: assessmentsPermissions?.includes('view-assessment'),
  };
};
