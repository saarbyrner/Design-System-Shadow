/* eslint-disable flowtype/require-valid-file-annotation */
import { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import {
  ErrorBoundary,
  AppStatus,
  DelayedLoadingFeedback,
} from '@kitman/components';
import App from './src/containers/App';
import store from './src/store';

const fetchData = async () =>
  new Promise((resolve, reject) => {
    $.get(
      '/ui/initial_data_questionnaire_templates',
      (data) => {
        resolve(data.templates);
      },
      'json'
    ).fail(() => {
      reject();
    });
  });

const QuestionnaireTemplateApp = () => {
  const [data, setData] = useState();
  const [requestStatus, setRequestStatus] = useState('PENDING');

  const body = document.getElementsByTagName('body')[0];
  const defaultTimeZone = body.dataset.timezone;

  useEffect(() => {
    fetchData().then(
      (res) => {
        setData(res);
        setRequestStatus('SUCCESS');
      },
      () => setRequestStatus('FAILURE')
    );
  }, []);

  if (!data) {
    return <DelayedLoadingFeedback />;
  }

  switch (requestStatus) {
    case 'FAILURE':
      return <AppStatus status="error" isEmbed />;
    case 'PENDING':
      return <DelayedLoadingFeedback />;
    case 'SUCCESS':
      return (
        <Provider store={store(data, defaultTimeZone)}>
          <I18nextProvider i18n={i18n}>
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
          </I18nextProvider>
        </Provider>
      );
    default:
      return null;
  }
};

export default QuestionnaireTemplateApp;
