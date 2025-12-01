// @flow
import type { ComponentType } from 'react';
import { useState } from 'react';
import { trackIntercomEvent } from '@kitman/common/src/utils';
import { Link, TextButton, TooltipMenu } from '@kitman/components';
import { withNamespaces } from 'react-i18next';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { css } from '@emotion/react';
import { MassUploadTranslated as MassUpload } from '@kitman/modules/src/shared/MassUpload';
import { DownloadCSVTranslated as DownloadCSV } from '@kitman/modules/src/shared/MassUpload/components/DownloadCSV';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { TrainingSessionPushModalTranslated as TrainingSessionPushModal } from './pushNotificationModals/TrainingSessionPushModal';
import { WellBeingPushModalTranslated as WellBeingPushModal } from './pushNotificationModals/WellBeingPushModal';
import { useManageAthletes } from '../contexts/manageAthletesContext';

type Props = {};

const PageHeader = (props: I18nProps<Props>) => {
  const [showWellBeingModal, setShowWellBeingModal] = useState(false);
  const [showTrainingSessionPushModal, setShowTrainingSessionPushModal] =
    useState(false);
  const { hideCreateAthleteButton } = useManageAthletes();
  const { permissions } = usePermissions();

  return (
    <div className="manage-athletes__header">
      <h1>{props.t('Manage athletes')}</h1>
      <div
        css={css`
          display: flex;
          gap: 10px;
        `}
      >
        {!hideCreateAthleteButton && (
          <Link href="/settings/athletes/new">
            <TextButton
              type="primary"
              text={props.t('New Athlete')}
              kitmanDesignSystem
            />
          </Link>
        )}

        {permissions.settings.canCreateImports &&
          window.featureFlags['league-ops-mass-create-athlete-staff'] && (
            <>
              <MassUpload userType="athlete" />
              <DownloadCSV userType="athlete" />
            </>
          )}

        {permissions.general.canManageAbsence &&
          permissions.settings.canViewSettingsQuestionnaire && (
            <TooltipMenu
              placement="bottom-end"
              menuItems={[
                {
                  description: props.t('Training Session Reminder'),
                  onClick: () => {
                    trackIntercomEvent(
                      'push-training-session-reminder-clicked'
                    );
                    setShowTrainingSessionPushModal(true);
                  },
                },
                {
                  description: props.t('Well-being Reminder'),
                  onClick: () => {
                    trackIntercomEvent('push-well-being-reminder-clicked');
                    setShowWellBeingModal(true);
                  },
                },
              ]}
              tooltipTriggerElement={
                <TextButton
                  iconAfter="icon-more"
                  type="secondary"
                  kitmanDesignSystem
                />
              }
              kitmanDesignSystem
            />
          )}
      </div>
      {showWellBeingModal && (
        <WellBeingPushModal
          onClickCloseModal={() => setShowWellBeingModal(false)}
        />
      )}
      {showTrainingSessionPushModal && (
        <TrainingSessionPushModal
          onClickCloseModal={() => setShowTrainingSessionPushModal(false)}
        />
      )}
    </div>
  );
};

export const PageHeaderTranslated: ComponentType<Props> =
  withNamespaces()(PageHeader);
export default PageHeader;
