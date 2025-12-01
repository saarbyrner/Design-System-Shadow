// @flow
import type { DevelopmentGoalsPermissions } from './types';

export const defaultDevelopmentGoalsPermissions = {
  canViewDevelopmentGoals: false,
};

export const setDevelopmentGoalsPermissions = (
  developmentGoalsPermissions: Array<string>
): DevelopmentGoalsPermissions => {
  return {
    canViewDevelopmentGoals: developmentGoalsPermissions?.includes(
      'view-development-goals'
    ),
  };
};
