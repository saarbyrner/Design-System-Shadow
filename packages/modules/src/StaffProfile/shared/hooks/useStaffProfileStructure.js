// @flow

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import useGlobal from '@kitman/common/src/redux/global/hooks/useGlobal';
import useLocationPathname from '@kitman/common/src/hooks/useLocationPathname';
import {
  onBuildFormState,
  onSetFormStructure,
  onSetFormAnswersSet,
  onSetMode,
} from '@kitman/modules/src/HumanInput/shared/redux/slices/formStateSlice';
import { onBuildValidationState } from '@kitman/modules/src/HumanInput/shared/redux/slices/formValidationSlice';
import { onBuildFormMenu } from '@kitman/modules/src/HumanInput/shared/redux/slices/formMenuSlice';
import { useFetchStaffProfileQuery } from '@kitman/modules/src/StaffProfile/shared/redux/services';
import { useGetCurrentUserQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { MODES } from '@kitman/modules/src/HumanInput/shared/constants';
import { useFetchPermissionsDetailsQuery } from '@kitman/services/src/services/permissions';
import {
  onBuildPermissionsState,
  onBuildPermissionGroupsState,
  onBuildUserPermissionsState,
} from '@kitman/services/src/services/permissions/redux/slices/permissionsDetailsSlice';

type ReturnType = {
  isLoading: boolean,
  hasFailed: boolean,
  isSuccess: boolean,
  isUserEditingOwnPermissions: boolean,
  title: string,
};

const useStaffProfileStructure = (): ReturnType => {
  /*
   * url will be either /administration/staff/new or /administration/staff/40211
   * the athleteId is the 3rd part of the URL
   * example splits: ['', 'administration', 'staff', 'new'] or ['', 'administration', 'staff', '1']
   */
  const locationPathname = useLocationPathname();
  const dispatch = useDispatch();
  const { data: currentUser } = useGetCurrentUserQuery();

  const {
    isLoading: isGlobalLoading,
    hasFailed: hasGlobalFailed,
    isSuccess: isGlobalSuccess,
  } = useGlobal();

  const isEditPage = locationPathname.split('/')[3] !== 'new';
  let title = 'New Staff Profile';
  let staffId = null;

  if (isEditPage) {
    staffId = locationPathname.split('/')[3];
    title = 'View and Edit Staff Profile';
    dispatch(onSetMode({ mode: MODES.VIEW }));
  } else {
    dispatch(onSetMode({ mode: MODES.CREATE }));
  }

  const {
    data: formStructure,
    isSuccess: isStaffProfileSuccess,
    isLoading: isStaffProfileLoading,
    isError: isStaffProfileError,
  } = useFetchStaffProfileQuery(staffId);

  const {
    data: permissionsData,
    isSuccess: isPermissionsRequestSuccess,
    isLoading: isPermissionsRequestLoading,
    isError: isPermissionsRequestError,
  } = useFetchPermissionsDetailsQuery(staffId, { skip: !isEditPage });

  useEffect(() => {
    if (formStructure?.form_template_version?.form_elements) {
      dispatch(
        onSetFormStructure({
          structure: formStructure,
        })
      );
      const elements = formStructure.form_template_version.form_elements;
      const formAnswers = formStructure.form_answers;

      dispatch(
        onBuildFormState({
          elements,
        })
      );
      dispatch(
        onSetFormAnswersSet({
          formAnswers,
        })
      );
      dispatch(
        onBuildFormMenu({
          elements,
        })
      );
      dispatch(
        onBuildValidationState({
          elements,
        })
      );

      dispatch(
        onBuildPermissionsState({
          permissions: permissionsData?.modules,
        })
      );

      dispatch(
        onBuildPermissionGroupsState({
          permission_groups: permissionsData?.permission_groups,
        })
      );

      dispatch(
        onBuildUserPermissionsState({
          user: permissionsData?.user,
        })
      );
    }
  }, [formStructure, permissionsData, dispatch]);

  const isUserEditingOwnPermissions = Number(staffId) === currentUser?.id;

  const isPermissionsSuccess = !isUserEditingOwnPermissions
    ? isPermissionsRequestSuccess
    : true;

  const isPermissionsError = !isUserEditingOwnPermissions
    ? isPermissionsRequestError
    : false;

  const isLoading = [
    isGlobalLoading,
    isStaffProfileLoading,
    isEditPage && isPermissionsRequestLoading,
  ].includes(true);
  const hasFailed = [
    hasGlobalFailed,
    isStaffProfileError,
    isEditPage && isPermissionsError,
  ].includes(true);
  const isSuccess = [
    isGlobalSuccess,
    isStaffProfileSuccess,
    isEditPage ? isPermissionsSuccess : true,
  ].every((v) => v === true);

  return {
    isLoading,
    hasFailed,
    isSuccess,
    title,
    isUserEditingOwnPermissions,
  };
};

export default useStaffProfileStructure;
