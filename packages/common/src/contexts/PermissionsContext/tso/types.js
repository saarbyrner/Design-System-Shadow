// @flow
export type TSOBasicPermission = {
  canView: boolean,
};

export type TSOPermissions = {
  ...TSOBasicPermission,
  canHaveAdmin: boolean,
};

export type TSOPermissionsWithManage = {
  ...TSOPermissions,
  canManage: boolean,
};
