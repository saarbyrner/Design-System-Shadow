// @flow
import type { UserPermissions } from './types';

export const defaultUserPermissions: UserPermissions = {
  canExportOwnMedicalData: false,
  canViewOwnExports: false,
};

export const setUserPermissions = (
  permissions: Array<string>
): UserPermissions => {
  return {
    canExportOwnMedicalData: permissions?.includes('export-own-medical-data'),
    canViewOwnExports: permissions?.includes('view-own-exports'),
  };
};
