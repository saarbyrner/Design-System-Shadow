// @flow
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { AppStatus, PageHeader, SlidingPanel } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import RPECollectionForm from '../containers/RPECollectionForm';
import ParticipantForm from '../containers/ParticipantForm';
import type { Event } from '../types';
import type { Store } from '../redux/types/store';

type Props = {
  event: Event,
  appStatus: $PropertyType<Store, 'appStatus'>,
  onClickHideAppStatus: Function,
};

const App = (props: I18nProps<Props>) => {
  const [isOpen, setIsOpen] = useState(false);

  const goBackToEventPage = () => {
    const eventUrl =
      props.event.type === 'GAME'
        ? `/workloads/games/${props.event.id}`
        : `/workloads/training_sessions/${props.event.id}`;

    window.location.href = eventUrl;
  };

  return (
    <div>
      <PageHeader noMargin>
        <header className="manageParticipantHeader">
          <h2 className="manageParticipantHeader__title">{props.event.name}</h2>
          <div
            className="manageParticipantHeader__sidePanelBtn"
            onClick={() => setIsOpen(true)}
          >
            {props.t('RPE Collection Channels')}
          </div>
        </header>
      </PageHeader>

      <ParticipantForm />

      <SlidingPanel
        isOpen={isOpen}
        title={props.t('RPE Collection Channels')}
        togglePanel={() => setIsOpen(false)}
        width={540}
      >
        <RPECollectionForm />
      </SlidingPanel>

      <AppStatus
        status={props.appStatus.status}
        hideConfirmation={props.onClickHideAppStatus}
        confirmAction={goBackToEventPage}
        message={
          props.appStatus.status === 'confirm' &&
          props.t(
            'Any unsaved changes will be lost if you exit without saving.'
          )
        }
        hideButtonText={
          props.appStatus.status === 'confirm' && props.t('Return to page')
        }
        confirmButtonText={
          props.appStatus.status === 'confirm' && props.t('Exit')
        }
      />
    </div>
  );
};

export default App;
export const AppTranslated = withNamespaces()(App);
