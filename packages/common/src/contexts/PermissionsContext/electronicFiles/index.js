// @flow
import type { ElectronicFilesPermissions } from '@kitman/common/src/contexts/PermissionsContext/electronicFiles/types';

export const defaultElectronicFilesPermissions: ElectronicFilesPermissions = {
  canSend: false,
  canView: false,
  canViewArchive: false,
  canManageContacts: false,
};

export const setElectronicFilesPermissions = (permissions: ?Array<string>) => {
  return {
    canSend: permissions?.includes('send-efile') || false,
    canView: permissions?.includes('view-efile') || false,
    canViewArchive: permissions?.includes('view-efile-archive') || false,
    canManageContacts: permissions?.includes('manage-efile-contacts') || false,
  };
};
