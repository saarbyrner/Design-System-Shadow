// @flow
import { useState, type ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { TextButton, AppStatus } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { CustomEvent } from '@kitman/common/src/types/Event';
import PlanningTab from '@kitman/modules/src/PlanningEvent/src/components/PlanningTabLayout/index';
import getPlanningHubEvent from '@kitman/modules/src/PlanningHub/src/services/getPlanningHubEvent';
import { AddStaffSidePanelTranslated as AddStaffSidePanel } from '@kitman/modules/src/PlanningEvent/src/components/AddStaffSidePanel/AddStaffSidePanel';
import type { RequestStatus } from '@kitman/common/src/types';
import useLocationSearch from '@kitman/common/src/hooks/useLocationSearch';

type Props = {
  event: CustomEvent,
  onUpdateEvent: Function,
  canEditEvent: boolean,
};

const StaffTabHeader = (props: I18nProps<Props>) => {
  const [isAddStaffPanelOpen, setIsAddStaffPanelOpen] = useState(false);
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('SUCCESS');
  const isVirtualEvent = !!useLocationSearch()?.get('original_start_time');

  const closePanel = () => {
    setIsAddStaffPanelOpen(false);
  };

  const fetchUpdatedStaff = async () => {
    try {
      const response = await getPlanningHubEvent({
        eventId: parseInt(props.event.id, 10),
      });
      props.onUpdateEvent(response.event);
    } catch {
      setRequestStatus('FAILURE');
    }
  };

  return (
    <>
      <PlanningTab.TabHeader>
        <PlanningTab.TabTitle>{props.t('Staff')}</PlanningTab.TabTitle>
        <PlanningTab.TabActions>
          <header className="planningEventGridTab__header">
            {props.canEditEvent && !isVirtualEvent && (
              <TextButton
                onClick={() => setIsAddStaffPanelOpen(true)}
                text={props.t('Add staff')}
                type="secondary"
                kitmanDesignSystem
              />
            )}
          </header>

          <AddStaffSidePanel
            isOpen={isAddStaffPanelOpen}
            title={props.t('Select staff')}
            event={props.event}
            onClose={closePanel}
            onSaveUsersSuccess={() => {
              fetchUpdatedStaff();
              closePanel();
            }}
          />
        </PlanningTab.TabActions>
      </PlanningTab.TabHeader>
      {requestStatus === 'FAILURE' && <AppStatus status="error" />}
    </>
  );
};

export const StaffTabHeaderTranslated: ComponentType<Props> =
  withNamespaces()(StaffTabHeader);

export default StaffTabHeader;
