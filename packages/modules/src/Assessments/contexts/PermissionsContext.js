// @flow
import { createContext } from 'react';
import type { AssessmentPermissions } from '../types';

export const defaultPermissions = {
  viewProtectedMetrics: true,
  createAssessment: true,
  editAssessment: true,
  deleteAssessment: true,
  answerAssessment: true,
  manageAssessmentTemplate: true,
  createAssessmentFromTemplate: true,
};

const PermissionContext =
  createContext<AssessmentPermissions>(defaultPermissions);

export default PermissionContext;
