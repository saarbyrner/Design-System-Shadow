/* eslint-disable flowtype/require-valid-file-annotation */
import $ from 'jquery';
import { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import {
  AppStatus,
  DelayedLoadingFeedback,
  ErrorBoundary,
} from '@kitman/components';
import i18n from '@kitman/common/src/utils/i18n';
import { getPermissions } from '@kitman/services';
import App from './containers/App';
import store from './redux/store';
import PermissionsContext from './contexts/PermissionsContext';
import TimezonesContext from './contexts/TimezonesContext';
import SquadAthletesContext from './contexts/SquadAthletesContext';

const fetchData = async () => {
  return Promise.all([
    $.get('/assessment_templates'),
    $.get('/ui/initial_data_assessments'),
    getPermissions(),
    $.get('/ui/turnarounds'),
  ]);
};

const AssessmentsApp = () => {
  const [data, setData] = useState();
  const [requestStatus, setRequestStatus] = useState('PENDING');

  useEffect(() => {
    fetchData().then(
      ([assessmentTemplatesData, initialData, permissions, turnarounds]) => {
        setData({
          athletes: initialData.assessment_data.athletes,
          organisationTrainingVariables:
            initialData.assessment_data.organisation_training_variables,
          statusVariables: initialData.assessment_data.status_variables,
          currentSquad: initialData.current_squad,
          users: initialData.assessment_data.users,
          permissions: {
            viewProtectedMetrics: permissions.general?.includes(
              'view-protected-metrics'
            ),
            createAssessment:
              permissions.assessments?.includes('create-assessment'),
            editAssessment:
              permissions.assessments?.includes('edit-assessment'),
            deleteAssessment:
              permissions.assessments?.includes('delete-assessment'),
            answerAssessment:
              permissions.assessments?.includes('answer-assessment'),
            manageAssessmentTemplate: permissions.assessments?.includes(
              'manage-assessment-template'
            ),
            createAssessmentFromTemplate: permissions.assessments?.includes(
              'create-assessment-from-template'
            ),
          },
          turnaroundList: turnarounds,
          squadAthletes: initialData.assessment_data.position_groups,
          assessmentTemplates: assessmentTemplatesData.assessment_templates,
          timezones: {
            orgTimezone:
              document.getElementsByTagName('body')[0].dataset.timezone,
          },
        });
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
        <TimezonesContext.Provider value={data.timezones}>
          <PermissionsContext.Provider value={data.permissions}>
            <SquadAthletesContext.Provider
              value={{ position_groups: data.squadAthletes }}
            >
              <Provider store={store(data)}>
                <I18nextProvider i18n={i18n}>
                  <ErrorBoundary>
                    <App />
                  </ErrorBoundary>
                </I18nextProvider>
              </Provider>
            </SquadAthletesContext.Provider>
          </PermissionsContext.Provider>
        </TimezonesContext.Provider>
      );
    default:
      return null;
  }
};

export default AssessmentsApp;
