// @flow
import type { HomegrownPermissions } from './types';

export const defaultHomegrownPermissions: HomegrownPermissions = {
  canViewHomegrown: false,
  canManageHomegrown: false,
  canViewHomegrownTags: false,
  canExportHomegrown: false,
};

export const setHomegrownPermissions = (
  permissions: Array<string>
): HomegrownPermissions => {
  return {
    canViewHomegrown: permissions?.includes('view-homegrown'),
    canManageHomegrown: permissions?.includes('manage-homegrown'),
    canViewHomegrownTags: permissions?.includes('homegrown-view-tag'),
    canExportHomegrown: permissions?.includes('export-homegrown'),
  };
};
