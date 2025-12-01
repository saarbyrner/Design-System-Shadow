// @flow

import { useState, type ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { TextButton } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { CustomEvent } from '@kitman/common/src/types/Event';
import PlanningTab from '@kitman/modules/src/PlanningEvent/src/components/PlanningTabLayout/index';
import { AddAthletesSidePanelTranslated as AddAthletesSidePanel } from '@kitman/modules/src/PlanningEvent/src/components/AddAthletesSidePanel/AddAthletesSidePanel';
import useManageAthleteEventsGrid from '@kitman/modules/src/PlanningEvent/src/hooks/useManageAthleteEventsGrid';
import useLocationSearch from '@kitman/common/src/hooks/useLocationSearch';

type Props = {
  event: CustomEvent,
  onUpdateEvent: Function,
  canEditEvent: boolean,
};

const AthletesTabHeader = (props: I18nProps<Props>) => {
  const { resetAthleteEventsGrid } = useManageAthleteEventsGrid(props.event.id);
  const [isAddAthletesPanelOpen, setIsAddAthletesPanelOpen] = useState(false);
  const isVirtualEvent = !!useLocationSearch()?.get('original_start_time');

  const closePanel = () => {
    setIsAddAthletesPanelOpen(false);
  };

  return (
    <>
      <PlanningTab.TabHeader>
        <PlanningTab.TabTitle>{props.t('Athletes')}</PlanningTab.TabTitle>
        <PlanningTab.TabActions>
          <header className="planningEventGridTab__header">
            {props.canEditEvent && !isVirtualEvent && (
              <TextButton
                onClick={() => setIsAddAthletesPanelOpen(true)}
                text={props.t('Add Athletes')}
                type="secondary"
                kitmanDesignSystem
              />
            )}
          </header>

          <AddAthletesSidePanel
            isOpen={isAddAthletesPanelOpen}
            title={props.t('Select athletes')}
            event={props.event}
            onSaveParticipantsSuccess={({ selectedAthletes }) => {
              resetAthleteEventsGrid();
              closePanel();
              props.onUpdateEvent({
                ...props.event,
                // Selected athletes is a string, and AthleteSelect requires
                // integers for the value
                athlete_ids: selectedAthletes.map((id) => parseInt(id, 10)),
              });
            }}
            onClose={closePanel}
          />
        </PlanningTab.TabActions>
      </PlanningTab.TabHeader>{' '}
    </>
  );
};

export const AthletesTabHeaderTranslated: ComponentType<Props> =
  withNamespaces()(AthletesTabHeader);

export default AthletesTabHeader;
