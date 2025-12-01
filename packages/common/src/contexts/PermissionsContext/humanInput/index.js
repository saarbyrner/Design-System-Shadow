// @flow
import type { HumanInputPermissions } from './types';

export const defaultHumanInputPermissions: HumanInputPermissions = {
  canView: false,
  canCreate: false,
  canEdit: false,
};

export const setHumanInputPermissions = (
  permissions: Array<string>
): HumanInputPermissions => {
  return {
    canView: permissions?.includes('view-human-input'),
    canCreate: permissions?.includes('create-human-input'),
    canEdit: permissions?.includes('edit-human-input'),
  };
};
