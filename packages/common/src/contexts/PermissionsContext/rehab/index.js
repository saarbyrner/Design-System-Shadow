// @flow
export const defaultRehabPermissions = {
  canView: false,
  canManage: false,
};

export const setRehabPermissions = (rehabPermissions: ?Array<string>) => {
  return {
    canView: rehabPermissions?.includes('view-rehab-sessions') || false,
    canManage: rehabPermissions?.includes('manage-rehab-sessions') || false,
  };
};
