// @flow

import { useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import { Box, Button } from '@kitman/playbook/components';
import {
  getModeFactory,
  getUserFactory,
} from '@kitman/modules/src/HumanInput/shared/redux/selectors/formStateSelectors';
import { MODES } from '@kitman/modules/src/HumanInput/shared/constants';
import useUnsavedChanges from '@kitman/modules/src/HumanInput/hooks/useUnsavedChanges';
import { HeaderStartTranslated as HeaderStart } from '@kitman/modules/src/HumanInput/shared/components/HeaderStart';
import { headerContainerSx } from '@kitman/modules/src/HumanInput/shared/utils/styles';
import type { AthleteBasic } from '@kitman/common/src/types/Athlete';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { HumanInputUser } from '@kitman/modules/src/HumanInput/types/forms';
import { UnsavedChangesModalTranslated as UnsavedChangesModal } from '../UnsavedChangesModal/UnsavedChangesModal';
import { useResetPassword } from './utils/hooks';

type Props = {
  athlete?: AthleteBasic,
  athleteId: number,
  formTitle?: string,
};

const HeaderContainer = ({
  athlete,
  athleteId,
  formTitle,
  t,
}: I18nProps<Props>) => {
  const mode = useSelector(getModeFactory());
  const athleteUser: ?HumanInputUser = useSelector(getUserFactory());
  const { showModal, handleCloseModal, handleDiscardChanges, handleBack } =
    useUnsavedChanges();

  let title = '';

  switch (mode) {
    case MODES.CREATE:
      title = t('Create athlete');
      break;

    case MODES.EDIT:
      title = athlete?.fullname || t('Edit athlete');
      break;

    case MODES.VIEW:
      title = athlete?.fullname || t('View athlete');
      break;

    default:
      break;
  }

  if (formTitle) {
    title = title.concat(' - ', formTitle);
  }

  const { confirmationModal, openModal } = useResetPassword({
    athleteEmail: athleteUser?.email ?? '',
    athleteId,
    athleteName: athlete?.fullname ?? '',
    athleteUsername: athleteUser?.username ?? '',
  });

  return (
    <>
      {confirmationModal}
      <Box sx={headerContainerSx}>
        <HeaderStart
          title={title}
          handleBack={handleBack}
          avatarUrl={athlete?.avatar_url}
        />
        <Button onClick={openModal}>{t('Reset Password')}</Button>
      </Box>
      <UnsavedChangesModal
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        handleDiscardChanges={handleDiscardChanges}
      />
    </>
  );
};

export const HeaderContainerTranslated = withNamespaces()(HeaderContainer);
export default HeaderContainer;
