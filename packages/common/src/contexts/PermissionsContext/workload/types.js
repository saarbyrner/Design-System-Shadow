// @flow

export type WorkloadsPermissions = {
  canViewWorkload: boolean,
  canManageWorkload: boolean,
  trainingSessions: {
    canEdit: boolean,
    canDelete: boolean,
  },
  games: {
    canEdit: boolean,
    canDelete: boolean,
  },
};
