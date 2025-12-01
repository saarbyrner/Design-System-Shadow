// @flow
import { createSelector } from '@reduxjs/toolkit';
import type { PermissionsDetailsState } from '@kitman/services/src/services/permissions/redux/slices/permissionsDetailsSlice';
import type {
  Module,
  PermissionGroup,
  UserPermissions,
} from '@kitman/services/src/services/permissions/redux/services/types';

type Store = {
  permissionsDetailsSlice: PermissionsDetailsState,
};

export const getPermissionsState = (state: Store): Array<Module> =>
  state.permissionsDetailsSlice?.permissions;

export const getPermissionGroupsState = (
  state: Store
): Array<PermissionGroup> => state.permissionsDetailsSlice?.permissionGroups;

export const getUserPermissionsState = (state: Store): UserPermissions =>
  state.permissionsDetailsSlice?.userPermissions;

export const getPermissionsFactory = (): Array<Module> =>
  createSelector([getPermissionsState], (permissionsState) => permissionsState);

export const getPermissionGroupsFactory = (): Array<PermissionGroup> =>
  createSelector(
    [getPermissionGroupsState],
    (permissionGroupsState) => permissionGroupsState
  );

export const getUserPermissionsFactory = (): UserPermissions =>
  createSelector(
    [getUserPermissionsState],
    (userPermissionsState) => userPermissionsState
  );

export const getUserPermissionGroupIdFactory = (): number =>
  createSelector(
    [getUserPermissionsState],
    (userPermissionsState) => userPermissionsState.permission_group_id
  );
