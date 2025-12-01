// @flow
import type { UserAccountsPermissions } from './types';

export const defaultUserAccountsPermissions: UserAccountsPermissions = {
  canUnlock: false,
};

export const setUserAccountsPermissions = (
  userAccounts: Array<string>
): UserAccountsPermissions => {
  return {
    canUnlock: userAccounts?.includes('unlock-user-accounts'),
  };
};
