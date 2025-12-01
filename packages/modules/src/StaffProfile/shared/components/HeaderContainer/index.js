// @flow
import { useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { useState, type ComponentType } from 'react';

import { Box, Button } from '@kitman/playbook/components';
import {
  useGetPermissionsQuery,
  useGetCurrentUserQuery,
} from '@kitman/common/src/redux/global/services/globalApi';

import { getModeFactory } from '@kitman/modules/src/HumanInput/shared/redux/selectors/formStateSelectors';
import useUnsavedChanges from '@kitman/modules/src/HumanInput/hooks/useUnsavedChanges';
import { HeaderStartTranslated as HeaderStart } from '@kitman/modules/src/HumanInput/shared/components/HeaderStart';
import { UnsavedChangesModalTranslated as UnsavedChangesModal } from '@kitman/modules/src/AthleteProfile/src/components/UnsavedChangesModal/UnsavedChangesModal';
import { headerContainerSx } from '@kitman/modules/src/HumanInput/shared/utils/styles';
import { useUpdateUserStatusMutation } from '@kitman/modules/src/StaffProfile/shared/redux/services';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { HumanInputUser } from '@kitman/modules/src/HumanInput/types/forms';
import type { PermissionsType } from '@kitman/common/src/contexts/PermissionsContext/types';
import type { CurrentUserData } from '@kitman/services/src/services/getCurrentUser';

import { getTitle, getButtonTranslations } from './utils/helpers';
import { StatusChangeConfirmationModalTranslated as StatusChangeConfirmationModal } from './StatusChangeConfirmationModal';
import type { UpdateUserStatus } from './utils/types';
import { useStatusChangeAction } from './utils/hooks';

type Props = {
  user: HumanInputUser | null,
};

const HeaderContainer = ({ user = null, t }: I18nProps<Props>) => {
  const [
    shouldShowStatusChangeConfirmationModal,
    setShouldShowStatusChangeConfirmationModal,
  ] = useState(false);

  const mode = useSelector(getModeFactory());
  const {
    showModal: shouldShowUnsavedChangedModal,
    handleCloseModal: closeUnsavedChangedModal,
    handleDiscardChanges,
    handleBack,
  } = useUnsavedChanges();

  const { data: permissions }: { data: PermissionsType } =
    useGetPermissionsQuery();
  const { data: currentUser }: { data: CurrentUserData } =
    useGetCurrentUserQuery();

  const [updateUserStatus, { isLoading: isUpdatingUserStatus }]: [
    UpdateUserStatus,
    { isLoading: boolean }
  ] = useUpdateUserStatusMutation();
  const isUserActive = user?.is_active ?? false;
  const closeModal = () => setShouldShowStatusChangeConfirmationModal(false);

  const { onConfirmStatusChange } = useStatusChangeAction({
    updateUserStatus,
    user,
    isUserActive,
    closeModal,
    t,
  });

  const title = getTitle({ mode, user, t });
  const buttonTranslations = getButtonTranslations(t);

  const isButtonDisabled =
    !permissions.settings.canManageStaffUsers || user?.id === currentUser.id;

  const buttonText = isUserActive
    ? buttonTranslations.deactivateUser
    : buttonTranslations.activateUser;

  return (
    <>
      <Box sx={headerContainerSx}>
        <HeaderStart title={title} handleBack={handleBack} />
        <Button
          disabled={isButtonDisabled}
          color="secondary"
          size="medium"
          onClick={() => setShouldShowStatusChangeConfirmationModal(true)}
        >
          {buttonText}
        </Button>
      </Box>
      <UnsavedChangesModal
        showModal={shouldShowUnsavedChangedModal}
        handleCloseModal={closeUnsavedChangedModal}
        handleDiscardChanges={handleDiscardChanges}
      />
      {user && (
        <StatusChangeConfirmationModal
          user={user}
          shouldShowModal={shouldShowStatusChangeConfirmationModal}
          closeModal={closeModal}
          isUpdatingUserStatus={isUpdatingUserStatus}
          onConfirm={onConfirmStatusChange}
        />
      )}
    </>
  );
};

export const HeaderContainerTranslated: ComponentType<Props> =
  withNamespaces()(HeaderContainer);
export default HeaderContainer;
