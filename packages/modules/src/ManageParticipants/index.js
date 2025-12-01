// @flow
import { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import $ from 'jquery';
import i18n from '@kitman/common/src/utils/i18n';
import {
  AppStatus,
  DelayedLoadingFeedback,
  ErrorBoundary,
} from '@kitman/components';
import { getActiveSquad } from '@kitman/services';
import ManageParticipants from './containers/App';
import store from './redux/store';

const fetchData = async () => {
  /*
   * giving the url /workloads/games/660913/edit
   * the event id is the third part of the URL
   */
  const urlParts = window.location.pathname.split('/'); // ['', 'workloads', 'games', '660913', 'edit']
  const sessionType = window.location.pathname.includes('games')
    ? 'GAME'
    : 'TRAINING';
  const sessionId = urlParts[3];

  const endpoint =
    sessionType === 'GAME'
      ? `/workloads/game_modal/${sessionId}/participants`
      : `/workloads/training_session_modal/${sessionId}/participants`;

  return Promise.all([$.get(endpoint), getActiveSquad()]);
};

const ManageParticipantsApp = () => {
  const [data, setData] = useState();
  const [requestStatus, setRequestStatus] = useState('PENDING');

  useEffect(() => {
    fetchData().then(
      ([eventData, activeSquad]) => {
        setData({ ...eventData, currentSquadId: activeSquad.id });
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
        <Provider store={store(data)}>
          <I18nextProvider i18n={i18n}>
            <ErrorBoundary>
              <div className="km-page">
                <div className="km-page-content">
                  <ManageParticipants />
                </div>
              </div>
            </ErrorBoundary>
          </I18nextProvider>
        </Provider>
      );
    default:
      return null;
  }
};

export default ManageParticipantsApp;
