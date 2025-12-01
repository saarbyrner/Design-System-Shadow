// @flow
import $ from 'jquery';
import { useState, useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { I18nextProvider } from 'react-i18next';

import i18n from '@kitman/common/src/utils/i18n';
import { initHighchartsOptions } from '@kitman/common/src/utils/HighchartDefaultOptions';
import {
  AppStatus as AppStatusComponent,
  DelayedLoadingFeedback,
  ErrorBoundary,
} from '@kitman/components';
import { OrganisationProvider } from '@kitman/common/src/contexts/OrganisationContext';
import { PermissionsProvider } from '@kitman/common/src/contexts/PermissionsContext';

import getStore from './redux/store';
import AppContainer from './containers/App';
import type { InitialData } from './types';

const fetchData = (isHomeDashboard, dashboardId) => {
  const url = isHomeDashboard
    ? '/ui/initial_data_home_dashboard'
    : '/ui/initial_data_analysis_dashboard';
  const params = isHomeDashboard ? {} : { dashboard_id: dashboardId };

  return new Promise((resolve, reject) => {
    $.get(url, params, (data) => resolve(data), 'json').fail(reject);
  });
};

type Props = {
  isHomeDashboard: boolean,
  dashboardId: string,
};

export const emptyInitialData: InitialData = {
  availableVariables: [],
  organisationAnnotationTypes: [],
  orgLogoPath: '',
  orgName: '',
  organisationModules: [],
  squadName: '',
  turnaroundList: [],
  currentUser: {
    id: -1,
    firstname: '',
    lastname: '',
    fullname: '',
  },
  users: [],
  dashboardList: [],
  dashboard: {
    id: '',
    name: '',
    layout: {
      graphs: [],
    },
    print_paper_size: 'a_4',
    print_orientation: 'portrait',
  },
  containerType: '',
  dashboardManager: false,
  homepageManager: false,
  chartBuilder: false,
  canViewNotes: false,
  canViewMetrics: false,
  canCreateNotes: false,
  canEditNotes: false,
  canViewDevelopmentGoals: false,
  canCreateDevelopmentGoals: false,
  canEditDevelopmentGoals: false,
  canDeleteDevelopmentGoals: false,
  canSeeHiddenVariables: false,
  graphColours: {},
};

const resetDashboardDataAction = (data: InitialData) => ({
  type: 'RESET_DASHBOARD_DATA',
  payload: {
    data,
  },
});

const DashboardApp = (props: Props) => {
  const dispatch = useDispatch();
  const [data, setData] = useState<InitialData>({});
  const [requestStatus, setRequestStatus] = useState('PENDING');

  useEffect(() => {
    initHighchartsOptions();
  }, []);

  useEffect(() => {
    setRequestStatus('PENDING');

    fetchData(props.isHomeDashboard, props.dashboardId).then(
      (res) => {
        // Everytime the dashboardId changes then we re-fetch
        // i.e. when a user changes the dashboard from the dropdown & redirects
        // we need to reset the store. This is done through this action which
        // is listened to in the root reducer. Not an ideal solution but the
        // least impact when migrating from the rails application.
        dispatch(resetDashboardDataAction(res));
        setData(res);
        setRequestStatus('SUCCESS');
      },
      () => {
        setRequestStatus('FAILURE');
      }
    );
  }, [props.dashboardId, props.isHomeDashboard]);

  const getProps = () => {
    if (!data) {
      return {};
    }

    const users = data.users.sort((a, b) => {
      const lowercaseA = a.lastname.toLowerCase();
      const lowercaseB = b.lastname.toLowerCase();
      if (lowercaseA > lowercaseB) {
        return 1;
      }
      if (lowercaseA < lowercaseB) {
        return -1;
      }
      return 0;
    });
    const formattedUsers = users.map((user) => ({
      id: user.id,
      name: user.fullname,
    }));

    return {
      locale: window.userLocale,
      annotationTypes: data.organisationAnnotationTypes,
      isGraphBuilder: data.chartBuilder,
      orgLogoPath: data.orgLogoPath,
      orgName: data.orgName,
      squadName: data.squadName,
      turnaroundList: data.turnaroundList,
      currentUser: data.currentUser,
      users: formattedUsers,
    };
  };

  switch (requestStatus) {
    case 'FAILURE':
      return <AppStatusComponent status="error" isEmbed />;
    case 'PENDING':
      return <DelayedLoadingFeedback />;
    case 'SUCCESS':
      return <AppContainer {...getProps()} />;
    default:
      return null;
  }
};

export default (props: Props) => {
  return (
    <OrganisationProvider>
      <PermissionsProvider>
        <Provider store={getStore(emptyInitialData)}>
          <I18nextProvider i18n={i18n}>
            <ErrorBoundary>
              <DashboardApp {...props} />
            </ErrorBoundary>
          </I18nextProvider>
        </Provider>
      </PermissionsProvider>
    </OrganisationProvider>
  );
};
