// @flow

type Permission = {
  id: number,
  key: string,
  name: string,
  description: ?string,
};

export type Module = {
  id: number,
  key: string,
  name: string,
  description: ?string,
  permissions: Array<Permission>,
};

type GroupPermission = {
  module: string,
  permissions: Array<string>,
};

export type PermissionGroup = {
  id: number,
  key: string,
  name: string,
  permissions: Array<GroupPermission>,
};

export type SubPermission = {
  [module: string]: {
    [permission: string]: boolean,
  },
};

export type UserPermissions = {
  permission_group_id: number,
  permissions: SubPermission,
};

export type PermissionDetails = {
  modules: Array<Module>,
  permission_groups: Array<PermissionGroup>,
  user: UserPermissions,
};

export type PermissionDetailsRequestBody = {
  permission_group_id: number,
  permissions: {
    alerts: { 'view-alerts': true, 'add-alerts': false },
    medical: { 'issues-view': true, 'issues-admin': false },
    'athlete-screening': { questionnaires: true },
  },
};

/**
 * BE is currently not returning anything,
 * may change in the future, also may not.
 * Placeholder for now
 */
export type UpdatePermissionDetailsResponse = {};
