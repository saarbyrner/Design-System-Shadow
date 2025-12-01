import {
  data,
  alternativeMockData,
} from '@kitman/services/src/services/permissions/redux/services/mocks/data/fetchPermissionsDetails';
import permissionsDetailsSlice, {
  onReset,
  onBuildPermissionsState,
  onBuildPermissionGroupsState,
  onBuildUserPermissionsState,
  onUpdateUserPermissionGroupState,
} from '../permissionsDetailsSlice';

describe('permissionsDetailsSlice', () => {
  const initialState = {
    permissions: [],
    permissionGroups: [],
    userPermissions: {},
  };

  it('should have an initial state', () => {
    const action = { type: 'unknown' };
    const expectedState = initialState;

    expect(permissionsDetailsSlice.reducer(initialState, action)).toEqual(
      expectedState
    );
  });

  it('should correctly update state on onReset', () => {
    const action = onReset();

    expect(permissionsDetailsSlice.reducer(initialState, action)).toEqual(
      initialState
    );
  });

  it('should correctly update state on onBuildPermissionsState', () => {
    const action = onBuildPermissionsState({ permissions: data.modules });

    expect(permissionsDetailsSlice.reducer(initialState, action)).toEqual({
      permissions: data.modules,
      permissionGroups: [],
      userPermissions: {},
    });
  });

  it('should correctly update state on onBuildPermissionGroupsState', () => {
    const action = onBuildPermissionGroupsState({
      permission_groups: data.permission_groups,
    });

    expect(permissionsDetailsSlice.reducer(initialState, action)).toEqual({
      permissions: [],
      permissionGroups: data.permission_groups,
      userPermissions: {},
    });
  });

  it('should correctly update state on onBuildUserPermissionsState', () => {
    const action = onBuildUserPermissionsState({
      user: data.user,
    });

    expect(permissionsDetailsSlice.reducer(initialState, action)).toEqual({
      permissions: [],
      permissionGroups: [],
      userPermissions: data.user,
    });
  });

  it('should correctly update state on onUpdateUserPermissionGroupState', () => {
    const action = onBuildUserPermissionsState({
      user: data.user,
    });

    const updatedState = permissionsDetailsSlice.reducer(initialState, action);
    expect(updatedState).toEqual({
      permissions: [],
      permissionGroups: [],
      userPermissions: data.user,
    });

    const updateAction = onUpdateUserPermissionGroupState(
      alternativeMockData.user
    );

    expect(permissionsDetailsSlice.reducer(updatedState, updateAction)).toEqual(
      {
        permissions: [],
        permissionGroups: [],
        userPermissions: alternativeMockData.user,
      }
    );
  });
});
