// @flow
import { useState, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import {
  AppStatus,
  DelayedLoadingFeedback,
  ErrorBoundary,
} from '@kitman/components';
import { getPositionGroups } from '@kitman/services';
import { AppTranslated as App } from './src/components/App';
import getAthletes from './src/services/getAthletes';

const AthletesApp = () => {
  const [athletes, setAthletes] = useState();
  const [positionGroups, setPositionGroups] = useState();
  const [requestStatus, setRequestStatus] = useState('PENDING');

  useEffect(() => {
    getAthletes().then(
      (athletesData) => {
        setAthletes(athletesData);
        setRequestStatus('SUCCESS');
      },
      () => setRequestStatus('FAILURE')
    );

    Promise.all([getAthletes(), getPositionGroups()]).then(
      ([athletesData, positionGroupsData]) => {
        setAthletes(athletesData);
        setPositionGroups(positionGroupsData);
        setRequestStatus('SUCCESS');
      },
      () => setRequestStatus('FAILURE')
    );
  }, []);

  switch (requestStatus) {
    case 'FAILURE':
      return <AppStatus status="error" isEmbed />;
    case 'PENDING':
      return <DelayedLoadingFeedback />;
    case 'SUCCESS':
      return (
        <I18nextProvider i18n={i18n}>
          <ErrorBoundary>
            <App athletes={athletes} positionGroups={positionGroups || []} />
          </ErrorBoundary>
        </I18nextProvider>
      );
    default:
      return null;
  }
};

export default AthletesApp;
