// @flow

import type {
  PermissionGroup,
  Module,
  SubPermission,
} from '@kitman/services/src/services/permissions/redux/services/types';

const shouldPermissionBeSelected = (
  permission: string,
  module: string,
  selectedPermissionGroup: ?PermissionGroup
): boolean => {
  const selectedModule = selectedPermissionGroup?.permissions.find(
    (selectedPermission) => selectedPermission.module === module
  );

  return !!selectedModule?.permissions.find(
    (permissionName) => permissionName === permission
  );
};

export const generateFreshUserPermissions = (
  permissions: Array<Module>,
  selectedPermissionGroup: ?PermissionGroup
): SubPermission => {
  const parentPermissions = {};

  permissions.forEach((permission) => {
    const childPermissions = {};
    permission.permissions.forEach((individualPermission) => {
      childPermissions[individualPermission.key] = shouldPermissionBeSelected(
        individualPermission.key,
        permission.key,
        selectedPermissionGroup
      );
    });

    parentPermissions[permission.key] = childPermissions;
  });

  return parentPermissions;
};

export default generateFreshUserPermissions;
