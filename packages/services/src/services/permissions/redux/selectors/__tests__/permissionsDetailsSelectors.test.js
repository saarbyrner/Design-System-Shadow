import { data } from '@kitman/services/src/services/permissions/redux/services/mocks/data/fetchPermissionsDetails';
import {
  getPermissionsFactory,
  getPermissionGroupsFactory,
  getUserPermissionsFactory,
  getUserPermissionGroupIdFactory,
  getUserPermissionsState,
  getPermissionsState,
  getPermissionGroupsState,
} from '../permissionsDetailsSelectors';

describe('[permissionsDetailsSelectors] - selectors', () => {
  const MOCK_STATE = {
    permissionsDetailsSlice: {
      permissions: data.modules,
      permissionGroups: data.permission_groups,
      userPermissions: data.user,
    },
  };
  test('getPermissionsState()', () => {
    expect(getPermissionsState(MOCK_STATE)).toBe(
      MOCK_STATE.permissionsDetailsSlice.permissions
    );
  });

  test('getPermissionGroupsState()', () => {
    expect(getPermissionGroupsState(MOCK_STATE)).toBe(
      MOCK_STATE.permissionsDetailsSlice.permissionGroups
    );
  });

  test('getUserPermissionsState()', () => {
    expect(getUserPermissionsState(MOCK_STATE)).toBe(
      MOCK_STATE.permissionsDetailsSlice.userPermissions
    );
  });

  test('getPermissionsFactory()', () => {
    const permissionsSelector = getPermissionsFactory();
    expect(permissionsSelector(MOCK_STATE)).toBe(
      MOCK_STATE.permissionsDetailsSlice.permissions
    );
  });

  test('getPermissionGroupsFactory()', () => {
    const permissionGroupsSelector = getPermissionGroupsFactory();
    expect(permissionGroupsSelector(MOCK_STATE)).toBe(
      MOCK_STATE.permissionsDetailsSlice.permissionGroups
    );
  });

  test('getUserPermissionsFactory()', () => {
    const userPermissionsSelector = getUserPermissionsFactory();
    expect(userPermissionsSelector(MOCK_STATE)).toBe(
      MOCK_STATE.permissionsDetailsSlice.userPermissions
    );
  });

  test('getUserPermissionGroupIdFactory()', () => {
    const userPermissionsGroupIdSelector = getUserPermissionGroupIdFactory();
    expect(userPermissionsGroupIdSelector(MOCK_STATE)).toBe(
      MOCK_STATE.permissionsDetailsSlice.userPermissions.permission_group_id
    );
  });
});
