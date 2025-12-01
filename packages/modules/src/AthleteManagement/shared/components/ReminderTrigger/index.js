// @flow
import { useState } from 'react';
import { TextButton, TooltipMenu } from '@kitman/components';
import { trackIntercomEvent } from '@kitman/common/src/utils';
import { useShowToasts } from '@kitman/common/src/hooks';
import { WellBeingPushModalTranslated as WellBeingPushModal } from '@kitman/modules/src/ManageAthletes/src/components/pushNotificationModals/WellBeingPushModal';
import { TrainingSessionPushModalTranslated as TrainingSessionPushModal } from '@kitman/modules/src/ManageAthletes/src/components/pushNotificationModals/TrainingSessionPushModal';
import getNonCompliantAthletes from '@kitman/modules/src/AthleteManagement/shared/redux/services/api/getNonCompliantAthletes';
import type { NonCompliantAthletes } from '@kitman/modules/src/AthleteManagement/shared/redux/services/api/getNonCompliantAthletes';

import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {};

// TODO: This component is managed technical debt.
// TODO: Current implementation is using bootstrap(?) modals
// TODO: In order to maintain existing functionality, feature is isolated and a standalone component until it can be
// TODO: migrated to panels and away from the useManageAthletes context

const GET_NON_COMPLIANT_ATHLETES_SUCCESS = 'GET_NON_COMPLIANT_ATHLETES_SUCCESS';
const GET_NON_COMPLIANT_ATHLETES_ERROR = 'GET_NON_COMPLIANT_ATHLETES_ERROR';

const ReminderTrigger = (props: I18nProps<Props>) => {
  const [isWellBeingReminderModalOpen, setIsWellBeingReminderModalOpen] =
    useState(false);
  const [
    isTrainingSessionReminderModalOpen,
    setIsTrainingSessionReminderModalOpen,
  ] = useState(false);
  const [nonCompliantAthletes, setNonCompliantAthletes] =
    useState<?NonCompliantAthletes>(null);
  const [isFetching, setIsFetching] = useState(false);
  const { showErrorToast } = useShowToasts({
    errorToastId: GET_NON_COMPLIANT_ATHLETES_ERROR,
    successToastId: GET_NON_COMPLIANT_ATHLETES_SUCCESS,
  });

  const onShowSidePanel = (panelType: string) => {
    trackIntercomEvent(panelType);
    setIsFetching(true);

    getNonCompliantAthletes()
      .then((data) => {
        setNonCompliantAthletes(data);
        switch (panelType) {
          case 'push-training-session-reminder-clicked':
            setIsTrainingSessionReminderModalOpen(true);
            setIsWellBeingReminderModalOpen(false);

            break;
          default:
            setIsWellBeingReminderModalOpen(true);
            setIsTrainingSessionReminderModalOpen(false);
            break;
        }
      })
      .catch(() => {
        showErrorToast({
          translatedTitle: props.t('Error getting non-compliant athletes'),
        });
      })
      .finally(() => setIsFetching(false));
  };
  return (
    <>
      <TooltipMenu
        placement="bottom-end"
        menuItems={[
          {
            description: props.t('Training Session Reminder'),
            onClick: () => {
              onShowSidePanel('push-training-session-reminder-clicked');
            },
          },
          {
            description: props.t('Well-being Reminder'),
            onClick: () => {
              onShowSidePanel('push-well-being-reminder-clicked');
            },
          },
        ]}
        tooltipTriggerElement={
          <TextButton
            iconAfter="icon-more"
            type="secondary"
            kitmanDesignSystem
            isLoading={isFetching}
          />
        }
        kitmanDesignSystem
      />
      {isWellBeingReminderModalOpen && (
        <WellBeingPushModal
          onClickCloseModal={() => setIsWellBeingReminderModalOpen(false)}
          nonCompliantAthletes={nonCompliantAthletes}
        />
      )}
      {isTrainingSessionReminderModalOpen && (
        <TrainingSessionPushModal
          onClickCloseModal={() => setIsTrainingSessionReminderModalOpen(false)}
          nonCompliantAthletes={nonCompliantAthletes}
        />
      )}
    </>
  );
};

export const ReminderTriggerTranslated = withNamespaces()(ReminderTrigger);
export default ReminderTrigger;
