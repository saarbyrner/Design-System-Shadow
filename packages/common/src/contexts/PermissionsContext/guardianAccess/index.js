// @flow
import type { GuardianAccessPermissions } from './types';

export const defaultGuardianAccessPermissions: GuardianAccessPermissions = {
  canManageGuardians: false,
};

export const setGuardianAccessPermissions = (
  guardianAccessPermissions: Array<string>
): GuardianAccessPermissions => {
  return {
    canManageGuardians:
      guardianAccessPermissions?.includes('guardian-admin') || false,
  };
};
