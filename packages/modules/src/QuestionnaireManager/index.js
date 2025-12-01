/* eslint-disable flowtype/require-valid-file-annotation */
import { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import {
  AppStatus,
  DelayedLoadingFeedback,
  ErrorBoundary,
} from '@kitman/components';
import Manager from './src/containers/Manager';
import store from './src/store';

const fetchData = async (squadFilter) => {
  const templateId = window.location.pathname.split('/').pop();

  return new Promise((resolve, reject) => {
    $.get(
      `/ui/initial_data_questionnaire_manager?id=${templateId}${
        squadFilter ? `&squad_id=${squadFilter}` : ''
      }`,
      (data) => {
        resolve({
          template: data.template,
          athletes: data.athletes,
          squads: data.squads,
          variables: data.variables,
          variablePlatforms: data.variable_platforms,
          variablesByPlatform: data.variables_by_platform,
          groupingLabels: data.grouping_labels,
          squadFilter,
        });
      },
      'json'
    ).fail(() => {
      reject();
    });
  });
};

const QuestionnaireManagerApp = () => {
  const [data, setData] = useState();
  const [requestStatus, setRequestStatus] = useState('PENDING');
  const [squadFilter, setSquadFilter] = useState(null);

  useEffect(() => {
    fetchData(squadFilter).then(
      (res) => {
        setData(res);
        setRequestStatus('SUCCESS');
      },
      () => setRequestStatus('FAILURE')
    );
  }, [squadFilter]);

  switch (requestStatus) {
    case 'FAILURE':
      return <AppStatus status="error" isEmbed />;
    case 'PENDING':
      return <DelayedLoadingFeedback />;
    case 'SUCCESS':
      return (
        <I18nextProvider i18n={i18n}>
          <Provider store={store(data)}>
            <ErrorBoundary>
              <Manager
                setSquadFilterLocalState={setSquadFilter}
                localSquadFilter={squadFilter}
              />
            </ErrorBoundary>
          </Provider>
        </I18nextProvider>
      );
    default:
      return null;
  }
};

export default QuestionnaireManagerApp;
