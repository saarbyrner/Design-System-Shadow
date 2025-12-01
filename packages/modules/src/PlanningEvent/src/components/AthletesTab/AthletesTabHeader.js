// @flow
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { updateNflParticipationLevels } from '@kitman/services';
import type { Event } from '@kitman/common/src/types/Event';
import { TextButton, TooltipMenu } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { DialogContentText } from '@kitman/playbook/components';
import ConfirmationModal, {
  modalDescriptionId,
} from '@kitman/playbook/components/ConfirmationModal';
import { AddAthletesSidePanelTranslated as AddAthletesSidePanel } from '../AddAthletesSidePanel';
import type { RequestStatus } from '../../../types';

type Props = {
  event: Event,
  onSaveParticipantsSuccess: Function,
  onClickAddStatus: Function,
  canEditEvent: boolean,
  onClickOpenReorderColumnModal: Function,
  toastAction: Function,
  refreshGrid: () => void,
};

const AthletesTabHeader = ({
  event,
  onSaveParticipantsSuccess,
  onClickAddStatus,
  canEditEvent,
  onClickOpenReorderColumnModal,
  toastAction,
  refreshGrid,
  t,
}: I18nProps<Props>) => {
  const updateNflParticipationLevelsFlag = window.getFlag(
    'nfl-session-participation-level-update'
  );
  const shouldRenderUpdateParticipationButton =
    updateNflParticipationLevelsFlag && event.type === 'session_event';

  const [nflUpdateLevelsStatus, setNflUpdateLevelsStatus] =
    useState<RequestStatus>('SUCCESS');
  const [isAddAthletesPanelOpen, setIsAddAthletesPanelOpen] = useState(false);
  const [isUpdateConfirmationModalOpen, setIsUpdateConfirmationModalOpen] =
    useState(false);

  const closeUpdateConfirmationModal = () => {
    setIsUpdateConfirmationModalOpen(false);
  };

  const handleNflParticipationLevelUpdate = async () => {
    closeUpdateConfirmationModal();
    setNflUpdateLevelsStatus('LOADING');
    try {
      await updateNflParticipationLevels(+event.id);
      toastAction({
        type: 'UPDATE_TOAST',
        toast: {
          id: 'update_nfl_levels',
          title: t('NFL Participation Levels Updated Successfully'),
          status: 'SUCCESS',
        },
      });
      setNflUpdateLevelsStatus('SUCCESS');
      refreshGrid();
    } catch {
      toastAction({
        type: 'UPDATE_TOAST',
        toast: {
          id: 'update_nfl_levels',
          title: t('NFL Participation Levels Failed to Update'),
          status: 'ERROR',
        },
      });
      setNflUpdateLevelsStatus('FAILURE');
    }
  };

  const renderUpdateParticipationButton = () => (
    <TextButton
      onClick={() => setIsUpdateConfirmationModalOpen(true)}
      text={t('Update')}
      kitmanDesignSystem
      isDisabled={nflUpdateLevelsStatus === 'LOADING'}
      type="secondary"
    />
  );

  const renderUpdateConfirmationModal = () => (
    <ConfirmationModal
      isModalOpen={isUpdateConfirmationModalOpen}
      isLoading={nflUpdateLevelsStatus === 'LOADING'}
      onConfirm={handleNflParticipationLevelUpdate}
      onCancel={closeUpdateConfirmationModal}
      onClose={closeUpdateConfirmationModal}
      dialogContent={
        <DialogContentText id={modalDescriptionId}>
          {t(
            `WARNING: Pressing the Update button will override any manual Participation Level updates. (It will reset the Participation Level based on today's roster and worst Injury Status.) Do you want to proceed?`,
            { interpolation: { escapeValue: false } }
          )}
        </DialogContentText>
      }
      translatedText={{
        title: t('Update Participation Levels'),
        actions: { ctaButton: t('Confirm'), cancelButton: t('Cancel') },
      }}
    />
  );

  return (
    <header className="planningEventGridTab__header">
      {canEditEvent && (
        <>
          <div className="planningEventGridTab__actions planningEventGridTab__actions--desktop">
            <TextButton
              onClick={() => setIsAddAthletesPanelOpen(true)}
              text={t('Edit athletes')}
              type="secondary"
              kitmanDesignSystem
            />
            <TextButton
              text={t('Add column')}
              onClick={() => onClickAddStatus()}
              type="secondary"
              kitmanDesignSystem
            />
            {shouldRenderUpdateParticipationButton && (
              <>
                {renderUpdateParticipationButton()}
                {renderUpdateConfirmationModal()}
              </>
            )}
            <TooltipMenu
              placement="bottom-end"
              menuItems={[
                {
                  description: t('Reorder'),
                  onClick: () => onClickOpenReorderColumnModal(),
                },
                {
                  description: t('Print'),
                  onClick: () => window.print(),
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
          </div>

          <div className="planningEventGridTab__actions planningEventGridTab__actions--mobile">
            <TextButton
              onClick={() => setIsAddAthletesPanelOpen(true)}
              text={t('Edit athletes')}
              type="secondary"
              kitmanDesignSystem
            />
            <TooltipMenu
              placement="bottom-end"
              menuItems={[
                {
                  description: t('Add column'),
                  onClick: () => onClickAddStatus(),
                },
                ...(shouldRenderUpdateParticipationButton
                  ? [
                      {
                        description: t('Update'),
                        onClick: () => setIsUpdateConfirmationModalOpen(true),
                      },
                    ]
                  : []),

                {
                  description: t('Reorder'),
                  onClick: () => onClickOpenReorderColumnModal(),
                },
                {
                  description: t('Print'),
                  onClick: () => window.print(),
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
          </div>
        </>
      )}

      <AddAthletesSidePanel
        event={event}
        isOpen={isAddAthletesPanelOpen}
        onClose={() => setIsAddAthletesPanelOpen(false)}
        onSaveParticipantsSuccess={() => {
          onSaveParticipantsSuccess();
          setIsAddAthletesPanelOpen(false);
        }}
      />
    </header>
  );
};

export const AthletesTabHeaderTranslated = withNamespaces()(AthletesTabHeader);
export default AthletesTabHeader;
