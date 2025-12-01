// @flow

import type { Node } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useFormNavigation from '@kitman/modules/src/HumanInput/hooks/useFormNavigation';
import { AppStatus } from '@kitman/components';

import { Typography, Stack, Alert } from '@kitman/playbook/components';
import { getActiveMenuItemFactory, getShowUnsavedChangesModalFactory } from '@kitman/modules/src/HumanInput/shared/redux/selectors/formStateSelectors';
import {
  getActiveMenuState,
  getDrawerState,
} from '@kitman/modules/src/HumanInput/shared/redux/selectors/formMenuSelectors';

import Menu from '@kitman/modules/src/HumanInput/shared/components/LayoutElements/Menu';
import Form from '@kitman/modules/src/HumanInput/shared/components/UIElements/Form';
import DrawerToggle from '@kitman/modules/src/HumanInput/shared/components/UIElements/DrawerToggle';
import { onToggleDrawer } from '@kitman/modules/src/HumanInput/shared/redux/slices/formMenuSlice';
import { FooterNavigationTranslated as FooterNavigation } from '@kitman/modules/src/HumanInput/shared/components/FooterNavigation/FooterNavigation';
import { useUpdateRegistrationProfileFormMutation } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationFormApi';
import ProfileFormLayout from '@kitman/modules/src/LeagueOperations/shared/layouts/ProfileFormLayout';
import type { ReduxMutation } from '@kitman/common/src/types/Redux';
import useGenericActionButtons from '@kitman/modules/src/HumanInput/hooks/useGenericActionButtons';
import {
  getRegistrationProfile,
  getRequirementById,
} from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationRequirementsSelectors';
import { getActiveSquad } from '@kitman/common/src/redux/global/selectors';
import type { HumanInputForm } from '@kitman/modules/src/HumanInput/types/forms';
import type { FormUpdateRequestBody } from '@kitman/services/src/services/humanInput/api/types';
import { RegistrationStatusEnum } from '@kitman/modules/src/LeagueOperations/shared/types/common';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';

import useRegistrationProfileForm from '@kitman/modules/src/LeagueOperations/shared/hooks/useRegistrationProfileForm';
import { useFetchIsRegistrationSubmittableQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationRequirementsApi';
import { colors } from '@kitman/common/src/variables';

import { UnsavedChangesModalTranslated as UnsavedChangesModal } from '@kitman/modules/src/AthleteProfile/src/components/UnsavedChangesModal/UnsavedChangesModal';
import useUnsavedChanges from '@kitman/modules/src/HumanInput/hooks/useUnsavedChanges';

const EDIT_REGISTRATION_ERROR_TOAST_ID = 'EDIT_REGISTRATION_ERROR_TOAST_ID';
const EDIT_REGISTRATION_SUCCESS_TOAST_ID = 'EDIT_REGISTRATION_SUCCESS_TOAST_ID';

const TabProfileForm = (): Node => {
  const dispatch = useDispatch();
  const { preferences } = usePreferences();
  const { permissions } = usePermissions();
  const [updateRegistrationProfileForm]: [
    ReduxMutation<
      { userId: number, payload: FormUpdateRequestBody },
      HumanInputForm
    >,
    { isLoading: boolean }
  ] = useUpdateRegistrationProfileFormMutation();

  const currentRequirement = useSelector(getRequirementById());
  const currentSquad = useSelector(getActiveSquad());
  const profile = useSelector(getRegistrationProfile);
  // Get the current registration profile (Athlete/Staff)
  const permissionGroup = profile?.permission_group.toLowerCase();
  // Check if the user has permission to edit the profile
  const isEditEnabledByPermission =
    permissions?.registration[permissionGroup]?.canEdit;

  const { data: { additional_info: registrationAdditionalInfo = null } = {} } =
    useFetchIsRegistrationSubmittableQuery(
      {
        requirementId: currentRequirement?.registration_requirement?.id,
        userId: profile?.id,
      },
      {
        skip: !(
          currentRequirement?.registration_requirement?.id && profile?.id
        ),
      }
    );

  /**
   * Assesses if the current registration profile is editable based on:
   * user preferences, permissions,
   * the alignment of the current registrations division with the current squads division,
   * and the registration status
   */
  const canEditProfileWithPermission = (() => {
    const isEditEnabledByPreference = preferences?.registration_edit_profile;
    const isMatchingDivision =
      currentRequirement?.division?.id === currentSquad?.division?.[0]?.id;
    const isValidStatus = [
      RegistrationStatusEnum.APPROVED,
      RegistrationStatusEnum.INCOMPLETE,
    ].includes(currentRequirement?.status);

    const hasEditRegistrationFF = window.getFlag(
      'league-operations-edit-registration-profiles'
    );
    const canManageHomegrown = Boolean(
      permissions?.homegrown.canManageHomegrown &&
        profile &&
        profile.non_registered
    );
    const canEditForRegisteredUser = Boolean(
      isEditEnabledByPreference &&
        isEditEnabledByPermission &&
        isMatchingDivision &&
        isValidStatus
    );
    return (
      (hasEditRegistrationFF && canEditForRegisteredUser) || canManageHomegrown
    );
  })();

  const { actionButtons } = useGenericActionButtons({
    onUpdate: async (requestBody) => {
      const userId = profile?.id;
      const res = await updateRegistrationProfileForm({
        userId,
        payload: requestBody,
      }).unwrap();
      return res;
    },
    toastIds: {
      errorToastId: EDIT_REGISTRATION_ERROR_TOAST_ID,
      successToastId: EDIT_REGISTRATION_SUCCESS_TOAST_ID,
    },
    doesUserHaveRequiredPermissions: canEditProfileWithPermission,
    isGenericForm: false,
    productArea: '',
  });
  const showUnsavedChangesModal = useSelector(
    getShowUnsavedChangesModalFactory()
  );
  const { handleCloseModal, handleDiscardChanges } = useUnsavedChanges();

  const { isLoading, isError } = useRegistrationProfileForm();
  const { isNextDisabled, isPreviousDisabled, onHandleNext, onHandlePrevious } =
    useFormNavigation();

  const { menuGroupIndex, menuItemIndex } = useSelector(getActiveMenuState);
  const activeForm = useSelector(
    getActiveMenuItemFactory(menuGroupIndex, menuItemIndex)
  );
  const { isOpen } = useSelector(getDrawerState);

  if (isLoading) return <ProfileFormLayout.Loading />;
  if (isError) return <AppStatus status="error" />;

  return (
    <ProfileFormLayout>
      <ProfileFormLayout.MenuContainer isOpen={isOpen}>
        <DrawerToggle
          isOpen={isOpen}
          onToggle={() => dispatch(onToggleDrawer())}
        />
        <Menu />
      </ProfileFormLayout.MenuContainer>
      <ProfileFormLayout.FormContainer>
        <ProfileFormLayout.SectionTitle>
          <Stack
            direction="column"
            sx={{
              width: '100%',
            }}
          >
            {registrationAdditionalInfo && (
              <Alert
                sx={{
                  width: '100%',
                  mt: 1,
                  mb: 2,
                  backgroundColor: colors.blue_info,
                }}
                severity="info"
              >
                {registrationAdditionalInfo}
              </Alert>
            )}
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{
                width: '100%',
              }}
            >
              <Typography variant="h6">{activeForm?.config?.title}</Typography>
              {canEditProfileWithPermission && (
                <Stack spacing={1} direction={{ xs: 'column', sm: 'row' }}>
                  {actionButtons && actionButtons.length > 0 && actionButtons}
                </Stack>
              )}
            </Stack>
          </Stack>
        </ProfileFormLayout.SectionTitle>

        <ProfileFormLayout.FormBody>
          <Form formElements={activeForm?.form_elements} isOpen />
        </ProfileFormLayout.FormBody>
        <ProfileFormLayout.FormFooter>
          <FooterNavigation
            canNavigateBack={!isPreviousDisabled}
            canNavigateForward={!isNextDisabled}
            onBackTriggered={onHandlePrevious}
            onForwardTriggered={onHandleNext}
          />
        </ProfileFormLayout.FormFooter>
        <UnsavedChangesModal
          showModal={showUnsavedChangesModal}
          handleCloseModal={handleCloseModal}
          handleDiscardChanges={handleDiscardChanges}
        />
      </ProfileFormLayout.FormContainer>
    </ProfileFormLayout>
  );
};

export default TabProfileForm;
