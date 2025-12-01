// @flow

import {
  Actions,
  type Action,
} from '@kitman/modules/src/LeagueOperations/shared/layouts/HeaderLayout/components/Actions';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { User } from '@kitman/modules/src/LeagueOperations/shared/types/common';
import useApproveRegistration from '@kitman/modules/src/LeagueOperations/shared/components/ApproveRegistrationPanel/hooks/useApproveRegistration';
import { withNamespaces } from 'react-i18next';
import useRegistrationHistory from '@kitman/modules/src/LeagueOperations/shared/components/RegistrationHistoryPanel/hooks/useRegistrationHistory';
import { useCompleteRegistration } from './hooks/useCompleteRegistration';

type Props = {
  user: User,
  requirementId: number,
};

const RequirementsActions = ({ user, requirementId, t }: I18nProps<Props>) => {
  const approveRegData = useApproveRegistration();
  const historyRegData = useRegistrationHistory();
  const completeRegData = useCompleteRegistration({ user, requirementId });

  const actionsList: Array<Action> = [];

  if (
    !completeRegData.isRegistrationExternallyManaged &&
    approveRegData.isApproveVisible
  ) {
    actionsList.push({
      id: 'approve',
      label: t('Approve'),
      isCollapsible: false,
      isDisabled:
        approveRegData.isApproveDisabled ||
        approveRegData.isLoading ||
        approveRegData.isError,
      onClick: () => approveRegData.onOpenPanel(true),
    });
  }

  if (completeRegData.isVisible) {
    actionsList.push({
      id: 'register',
      label: t('Register'),
      isCollapsible: false,
      onClick: completeRegData.onClick,
    });
  }

  if (
    !completeRegData.isRegistrationExternallyManaged &&
    historyRegData.isVisible
  ) {
    actionsList.push({
      id: 'reg-history',
      label: t('History'),
      isCollapsible: true,
      isDisabled: historyRegData.isDisabled,
      onClick: () => historyRegData.onOpenPanel(true),
      button: {
        color: 'secondary',
      },
    });
  }

  return <Actions actions={actionsList} />;
};

export default withNamespaces()(RequirementsActions);
