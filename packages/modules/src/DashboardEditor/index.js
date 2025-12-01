/* eslint-disable flowtype/require-valid-file-annotation */
import { useState, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import {
  AppStatus,
  DelayedLoadingFeedback,
  ErrorBoundary,
} from '@kitman/components';
import {
  statusesToIds,
  statusesToMap,
  dashboardsToMap,
} from '@kitman/common/src/utils';
import App from './src/components/App';

const currentStatusId = () =>
  // Get the ID of the currently edited status from the URL
  window.location.search !== ''
    ? window.location.search.split('?status=')[1]
    : null;

const fetchData = () => {
  const dashboardId = window.location.pathname.split('/')[2];
  return new Promise((resolve, reject) => {
    $.get(
      `/ui/initial_data_dashboards/${dashboardId}/edit`,
      (data) =>
        resolve({
          dashboards: data.all_dashboards || [],
          currentDashboardId: data.dashboard.id || '',
          currentStatuses: data.statuses || [],
          availableVariables: data.variables || [],
          alarmDefinitions: data.alarm_definitions || {},
        }),
      'json'
    ).fail(() => reject());
  });
};

const DashboardEditor = () => {
  const [data, setData] = useState();
  const [requestStatus, setRequestStatus] = useState('PENDING');

  useEffect(() => {
    fetchData().then(
      (res) => {
        setData({
          dashboards: res.dashboards,
          currentDashboardId: res.currentDashboardId,
          statusIds: statusesToIds(res.currentStatuses),
          statusesById: statusesToMap(res.currentStatuses),
          availableVariables: res.availableVariables,
          dashboardsById: dashboardsToMap(res.dashboards),
          alarmDefinitions: res.alarmDefinitions,
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
        <I18nextProvider i18n={i18n}>
          <ErrorBoundary>
            <App
              dashboards={data.dashboards}
              currentDashboardId={data.currentDashboardId}
              statusIds={data.statusIds}
              statusesById={data.statusesById}
              currentStatusId={currentStatusId()}
              availableVariables={data.availableVariables}
              dashboardsById={data.dashboardsById}
              alarmDefinitions={data.alarmDefinitions}
            />
          </ErrorBoundary>
        </I18nextProvider>
      );
    default:
      return null;
  }
};

export default DashboardEditor;
