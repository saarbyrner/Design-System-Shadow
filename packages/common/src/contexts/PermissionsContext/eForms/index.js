// @flow
import type { EFormsPermissions } from '@kitman/common/src/contexts/PermissionsContext/eForms/types';

export const defaultEFormsPermissions: EFormsPermissions = {
  canSubmitForms: false,
  canViewForms: false,
  canEditForms: false,
  canDeleteForms: false,
  canManageFormTemplates: false,
  canViewTryout: false,
};

export const setEFormsPermissions = (permissions: ?Array<string>) => {
  return {
    canSubmitForms: permissions?.includes('submit-eforms') || false,
    canViewForms: permissions?.includes('view-eforms') || false,
    canEditForms: permissions?.includes('edit-eforms') || false,
    canDeleteForms: permissions?.includes('delete-eforms') || false,
    canManageFormTemplates:
      permissions?.includes('manage-eforms-templates') || false,
    canViewTryout: permissions?.includes('view-eforms-tryout') || false,
  };
};
