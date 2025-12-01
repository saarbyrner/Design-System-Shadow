// @flow
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';

import { type Event } from '@kitman/common/src/types/Event';
import { AppTranslated as ImportWorkflowModal } from '@kitman/modules/src/ImportWorkflow/src/components/App';
import { type I18nProps } from '@kitman/common/src/types/i18n';

import PlanningTab from '../PlanningTabLayout';
import { ImportTableTranslated as ImportTable } from './ImportTable/ImportTable';
import { MUIimportTable } from './ImportTable/MUIimportTable';
import { ImportActionsTranslated as ImportActions } from './ImportActions';

type Props = {
  event: Event,
  orgTimezone: string,
  canEditEvent: boolean,
};

const ImportedDataTab = (props: I18nProps<Props>) => {
  const [showImportModal, setShowImportModal] = useState(false);
  return (
    <>
      <PlanningTab
        styles={
          window.getFlag('pac-calendar-events-imported-data-tab-in-mui')
            ? {
                padding: 0,
                boxShadow: 'none',
              }
            : {}
        }
      >
        {!window.getFlag('pac-calendar-events-imported-data-tab-in-mui') && (
          <PlanningTab.TabHeader>
            <PlanningTab.TabTitle>
              <p>{props.t('Imported Data')}</p>
            </PlanningTab.TabTitle>
            <PlanningTab.TabActions>
              {props.canEditEvent && (
                <ImportActions
                  eventId={props.event.id}
                  onClickImportData={() => setShowImportModal(true)}
                />
              )}
            </PlanningTab.TabActions>
          </PlanningTab.TabHeader>
        )}

        <PlanningTab.TabContent>
          {window.getFlag('pac-calendar-events-imported-data-tab-in-mui') ? (
            <MUIimportTable
              event={props.event}
              canEditEvent={props.canEditEvent}
              onImportData={() => setShowImportModal(true)}
            />
          ) : (
            <ImportTable
              event={props.event}
              onClickImportData={() => setShowImportModal(true)}
              showImport={props.canEditEvent}
              canEditEvent={props.canEditEvent}
            />
          )}
        </PlanningTab.TabContent>
      </PlanningTab>

      {showImportModal && (
        <ImportWorkflowModal
          orgTimezone={props.orgTimezone}
          event={{
            ...props.event,
            id: props.event.id,
            date: props.event.start_date,
            localTimezone: props.event.local_timezone,
          }}
          closeModal={() => setShowImportModal(false)}
          useNewEventFlow
        />
      )}
    </>
  );
};

export const ImportedDataTabTranslated = withNamespaces()(ImportedDataTab);
export default ImportedDataTab;
