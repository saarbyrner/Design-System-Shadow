// @flow
import type { Node } from 'react';
import { withNamespaces } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@kitman/playbook/components';
import { add, remove } from '@kitman/modules/src/Toasts/toastsSlice';
import {
  STAFF_PROFILE_ERROR_TOAST_ID,
  STAFF_PROFILE_SUCCESS_TOAST_ID,
} from '@kitman/modules/src/StaffProfile/shared/hooks/useStaffProfileActionButtons';
import { onUpdateUserPermissionGroupState } from '@kitman/services/src/services/permissions/redux/slices/permissionsDetailsSlice';
import {
  getUserPermissionGroupIdFactory,
  getUserPermissionsFactory,
  getPermissionGroupsFactory,
  getPermissionsFactory,
} from '@kitman/services/src/services/permissions/redux/selectors/permissionsDetailsSelectors';
import type {
  PermissionGroup,
  UserPermissions,
  Module,
} from '@kitman/services/src/services/permissions/redux/services/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useUpdatePermissionsDetailsMutation } from '@kitman/services/src/services/permissions';
import useLocationPathname from '@kitman/common/src/hooks/useLocationPathname';
import { generateFreshUserPermissions } from '@kitman/modules/src/StaffProfile/shared/utils/helpers';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';

const PermissionsHeader = (props: I18nProps<{}>): Node => {
  const dispatch = useDispatch();
  const { permissions: appPermissions } = usePermissions();

  const userPermissionGroupId: number = useSelector(
    getUserPermissionGroupIdFactory()
  );
  const userPermissions: UserPermissions = useSelector(
    getUserPermissionsFactory()
  );
  const permissionGroups: Array<PermissionGroup> = useSelector(
    getPermissionGroupsFactory()
  );
  const permissions: Array<Module> = useSelector(getPermissionsFactory());
  const locationPathname = useLocationPathname();
  const [
    onUpdatePermissionsDetails,
    { isLoading: isUpdatePermissionsLoading },
  ] = useUpdatePermissionsDetailsMutation();

  const gridStyle = {
    display: 'flex',
    justifyContent: 'space-between',
  };

  const onSelectPermissionGroup = (event) => {
    const permissionGroupId = event.target.value;
    const selectedPermissionGroup = permissionGroups?.find(
      (permissionGroup) => permissionGroup.id === permissionGroupId
    );
    const selectedGroupPermissions = generateFreshUserPermissions(
      permissions,
      selectedPermissionGroup
    );

    dispatch(
      onUpdateUserPermissionGroupState({
        permission_group_id: permissionGroupId,
        permissions: selectedGroupPermissions,
      })
    );
  };

  const onSave = () => {
    // clear any existing toasts
    dispatch(
      remove({
        id: STAFF_PROFILE_ERROR_TOAST_ID,
      })
    );
    dispatch(
      remove({
        id: STAFF_PROFILE_SUCCESS_TOAST_ID,
      })
    );

    onUpdatePermissionsDetails({
      staffId: locationPathname.split('/')[3],
      requestBody: userPermissions,
    })
      .unwrap()
      .then((data) => {
        if (data) {
          dispatch(
            add({
              id: STAFF_PROFILE_SUCCESS_TOAST_ID,
              status: 'SUCCESS',
              title: props.t('Permissions has been updated'),
            })
          );
        }
      })
      .catch(() => {
        dispatch(
          add({
            id: STAFF_PROFILE_ERROR_TOAST_ID,
            status: 'ERROR',
            title: props.t('Unable to update permissions. Try again'),
          })
        );
      });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={10} sx={gridStyle}>
        <Typography variant="h6">{props.t('Permissions')}</Typography>
      </Grid>
      {appPermissions.settings.canManageStaffUsers && (
        <Grid
          item
          xs={2}
          sx={{
            display: 'flex',
            justifyContent: 'end',
            paddingRight: '16px',
          }}
        >
          <Button
            variant="contained"
            onClick={onSave}
            disabled={isUpdatePermissionsLoading}
          >
            {props.t('Save')}
          </Button>
        </Grid>
      )}
      <Grid item xs={8} sx={gridStyle}>
        <Typography variant="body1">
          {props.t(
            'Select user’s role to set permissions. To customize permissions, manually selecting options from the full list of settings below in the advance permission section.'
          )}
        </Typography>
      </Grid>
      <Grid item xs={2} sx={gridStyle} />
      <Grid item xs={4}>
        <FormControl>
          <InputLabel id="permissionSelectorLabel">
            {props.t('Group (required)')}
          </InputLabel>
          <Select
            labelId="permissionSelectorLabel"
            id="permissionSelector"
            value={userPermissionGroupId}
            onChange={onSelectPermissionGroup}
            fullWidth
          >
            {permissionGroups?.map((permissionGroup) => {
              return (
                <MenuItem key={permissionGroup.key} value={permissionGroup.id}>
                  {permissionGroup.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={10} />
    </Grid>
  );
};

export const PermissionsHeaderTranslated = withNamespaces()(PermissionsHeader);
export default PermissionsHeader;
