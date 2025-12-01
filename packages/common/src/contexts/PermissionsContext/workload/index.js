// @flow
import type { WorkloadsPermissions } from './types';

export const defaultWorkloadsPermissions = {
  canViewWorkload: false,
  canManageWorkload: false,
  trainingSessions: {
    canEdit: false,
    canDelete: false,
  },
  games: {
    canEdit: false,
    canDelete: false,
  },
};

export const setWorkloadsPermissions = (
  workloadsPermissions: Array<string>
): WorkloadsPermissions => {
  return {
    canViewWorkload: workloadsPermissions?.includes('workload-view'),
    canManageWorkload: workloadsPermissions?.includes('workload-manage'),
    trainingSessions: {
      canEdit: workloadsPermissions?.includes('training-sessions-admin'),
      canDelete: workloadsPermissions?.includes('training-sessions-admin'),
    },
    games: {
      canEdit:
        workloadsPermissions?.includes('games-admin') ||
        workloadsPermissions?.includes('games-edit'),
      canDelete:
        workloadsPermissions?.includes('games-admin') ||
        workloadsPermissions?.includes('games-delete'),
    },
  };
};
