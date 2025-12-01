// @flow
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type {
  Module,
  PermissionGroup,
  UserPermissions,
} from '@kitman/services/src/services/permissions/redux/services/types';

export type PermissionsDetailsState = {
  permissions: Array<Module>,
  permissionGroups: Array<PermissionGroup>,
  userPermissions: UserPermissions,
};

type OnBuildPermissionsStateAction = {
  payload: {
    permissions: Array<Module>,
  },
};

type OnBuildPermissionGroupsStateAction = {
  payload: {
    permission_groups: Array<PermissionGroup>,
  },
};

type OnBuildUserPermissionsAction = {
  payload: {
    user: UserPermissions,
  },
};

type OnUpdateUserPermissionGroup = {
  payload: UserPermissions,
};

type OnUpdatePermissionAction = {
  payload: {
    module: string,
    permissionKey: string,
    value: boolean,
  },
};

const initialState: PermissionsDetailsState = {
  permissions: [],
  permissionGroups: [],
  userPermissions: {},
};

const permissionsDetailsSlice = createSlice({
  name: 'permissionsDetailsSlice',
  initialState,
  reducers: {
    onReset: () => initialState,
    onBuildPermissionsState: (
      state: PermissionsDetailsState,
      action: PayloadAction<OnBuildPermissionsStateAction>
    ) => {
      state.permissions = action.payload?.permissions;
    },
    onBuildPermissionGroupsState: (
      state: PermissionsDetailsState,
      action: PayloadAction<OnBuildPermissionGroupsStateAction>
    ) => {
      state.permissionGroups = action.payload?.permission_groups;
    },
    onBuildUserPermissionsState: (
      state: PermissionsDetailsState,
      action: PayloadAction<OnBuildUserPermissionsAction>
    ) => {
      state.userPermissions = {
        ...action.payload?.user,
      };
    },
    onUpdateUserPermissionGroupState: (
      state: PermissionsDetailsState,
      action: PayloadAction<OnUpdateUserPermissionGroup>
    ) => {
      state.userPermissions = action.payload;
    },
    onUpdatePermission: (
      state: PermissionsDetailsState,
      action: PayloadAction<OnUpdatePermissionAction>
    ) => {
      state.userPermissions = {
        ...state.userPermissions,
        permissions: {
          ...state.userPermissions.permissions,
          [action.payload.module]: {
            ...state.userPermissions.permissions[action.payload.module],
            [action.payload.permissionKey]: action.payload.value,
          },
        },
      };
    },
  },
});

export const {
  onReset,
  onBuildPermissionsState,
  onBuildPermissionGroupsState,
  onBuildUserPermissionsState,
  onUpdateUserPermissionGroupState,
  onUpdatePermission,
} = permissionsDetailsSlice.actions;
export default permissionsDetailsSlice;
