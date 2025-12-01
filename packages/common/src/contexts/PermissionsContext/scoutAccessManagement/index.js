// @flow
import type { ScoutAccessManagementPermissions } from './types';

export const defaultScoutAccessManagementPermissions: ScoutAccessManagementPermissions =
  {
    canExportScout: false,
    canManageScoutAccess: false,
    canViewScoutFixtures: false,
  };

export const setScoutAccessManagementPermissions = (
  permissions: Array<string>
): ScoutAccessManagementPermissions => {
  return {
    canExportScout: permissions?.includes('scout-access-export'),
    canManageScoutAccess: permissions.includes('manage-scout-access'),
    canViewScoutFixtures: permissions.includes('scout-view-fixtures'),
  };
};
