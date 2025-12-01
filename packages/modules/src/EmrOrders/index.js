/* eslint-disable max-nested-callbacks, flowtype/require-valid-file-annotation */
import { useState, useEffect } from 'react';
import _flattenDeep from 'lodash/flattenDeep';

import { I18nextProvider } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import {
  AppStatus,
  DelayedLoadingFeedback,
  ErrorBoundary,
} from '@kitman/components';

import App from './src/components/App';

const fetchData = async () =>
  new Promise((resolve, reject) => {
    $.get(
      '/ui/initial_data_order_managements',
      (data) => resolve(data),
      'json'
    ).fail(() => reject());
  });

const EmrOrdersApp = () => {
  const [athletes, setAthletes] = useState();
  const [requestStatus, setRequestStatus] = useState('PENDING');

  useEffect(() => {
    fetchData().then(
      (res) => {
        setAthletes(
          _flattenDeep(
            res.squad_athletes.position_groups.map((positionGroup) =>
              positionGroup.positions.map((position) =>
                position.athletes.map((athlete) => ({
                  value: athlete.id,
                  label: athlete.fullname,
                }))
              )
            )
          )
        );
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
            <App athletes={athletes} />
          </ErrorBoundary>
        </I18nextProvider>
      );
    default:
      return null;
  }
};

export default EmrOrdersApp;
