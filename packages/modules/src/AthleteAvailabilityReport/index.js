/* eslint-disable flowtype/require-valid-file-annotation */
import { useState, useEffect } from 'react';
import {
  AppStatus,
  DelayedLoadingFeedback,
  ErrorBoundary,
} from '@kitman/components';
import { I18nextProvider } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { getInjuryStatuses, getPermissions } from '@kitman/services';
import { AppTranslated as App } from './src/components/App';

const fetchData = (timeSeriesStart, timeSeriesEnd) =>
  new Promise((resolve, reject) => {
    $.get(
      '/ui/initial_data_availability_report',
      { start_date: timeSeriesStart || null, end_date: timeSeriesEnd || null },
      (data) => {
        resolve(data);
      },
      'json'
    ).fail(() => {
      reject();
    });
  });

const AthleteAvailabilityReportApp = () => {
  const [data, setData] = useState();
  const [requestStatus, setRequestStatus] = useState('PENDING');

  useEffect(() => {
    const body = document.getElementsByTagName('body')[0];
    const timeSeriesStart = window.location.search
      ? window.location.search.split('&')[0].split('=')[1]
      : body.dataset.tsStart;
    const timeSeriesEnd = window.location.search
      ? window.location.search.split('&')[1].split('=')[1]
      : body.dataset.tsEnd;

    Promise.all([
      fetchData(timeSeriesStart, timeSeriesEnd),
      getPermissions(),
      getInjuryStatuses(),
    ]).then(
      ([appData, permissions, injuryStatuses]) => {
        const orgTimeZone = body.dataset.timezone;

        setData({
          athletes: appData.athletes_data,
          timeSeriesStart,
          timeSeriesEnd,
          orgTimeZone,
          permissions,
          injuryStatuses,
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
              athletes={data.athletes || []}
              canViewIssues={data.permissions.medical?.includes('issues-view')}
              canViewAbsence={data.permissions.general?.includes(
                'view-absence'
              )}
              timeRangeStart={data.timeSeriesStart}
              timeRangeEnd={data.timeSeriesEnd}
              orgTimeZone={data.orgTimeZone}
              turnaroundList={data.turnaround_list}
              injuryStatuses={data.injuryStatuses}
            />
          </ErrorBoundary>
        </I18nextProvider>
      );
    default:
      return null;
  }
};

export default AthleteAvailabilityReportApp;
