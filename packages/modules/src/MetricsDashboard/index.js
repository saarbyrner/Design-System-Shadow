/* eslint-disable max-statements, flowtype/require-valid-file-annotation */
import { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { useInRouterContext } from 'react-router-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { I18nextProvider } from 'react-i18next';
import _last from 'lodash/last';
import i18n from '@kitman/common/src/utils/i18n';
import { initHighchartsOptions } from '@kitman/common/src/utils/HighchartDefaultOptions';
import redirectToRails from '@kitman/common/src/utils/redirectToRails';
import {
  AppStatus,
  DelayedLoadingFeedback,
  ErrorBoundary,
} from '@kitman/components';
import {
  statusesToIds,
  statusesToMap,
  setupReduxDevTools,
  groupAthletesByPosition,
  groupAthletesByAvailability,
  groupAthletesByScreening,
  groupAthletesByName,
  getDefaultGroupBy,
  groupAthletesByPositionGroup,
  getFilteredAthletes,
  getGroupOrderingByType,
} from '@kitman/common/src/utils';
import {
  athletesToIds,
  athletesToMap,
} from '@kitman/common/src/utils/dashboard';
import { getPermissions } from '@kitman/services';
import App from './src/containers/App';
import StateTree from './src/state-tree-setup';

// setup Redux dev tools
const middlewares = [thunkMiddleware];
const composeEnhancers = setupReduxDevTools(compose);

const getStore = (data) => {
  // Compute and set the ordering per groups on the state
  const groupOrderingByType = getGroupOrderingByType(data.positions_hash);

  const sortOrder = '';
  const sortedBy = '';
  const sortedByStatusKey = '';
  const groupBy = getDefaultGroupBy();
  const alarmFilters = [];
  const athleteFilters = [];
  const availabilityFilters = [];
  const groupedAthletes = {
    position: groupAthletesByPosition(data.athletes),
    positionGroup: groupAthletesByPositionGroup(
      data.athletes,
      groupOrderingByType.position
    ),
    availability: groupAthletesByAvailability(data.athletes),
    last_screening: groupAthletesByScreening(data.athletes),
    name: groupAthletesByName(data.athletes),
  };
  const currentlyVisible = getFilteredAthletes(
    groupedAthletes[groupBy],
    '',
    null,
    alarmFilters,
    athleteFilters,
    sortOrder,
    sortedBy
  );

  return createStore(
    StateTree,
    {
      dashboards: {
        all: data.dashboards,
        currentId: data.current_dashboard_id,
      },
      alarmDefinitions: data.alarm_definitions,
      athletes: {
        all: data.athletes,
        grouped: groupedAthletes,
        currentlyVisible,
        groupBy,
        searchTerm: '',
        groupOrderingByType,
        alarmFilters,
        athleteFilters,
        availabilityFilters,
        sortOrder,
        sortedBy,
        sortedByStatusKey,
      },
      groupingLabels: data.grouping_labels,
      statuses: {
        ids: statusesToIds(data.statuses),
        byId: statusesToMap(data.statuses),
        available: data.available_statuses,
        reorderedIds: [],
      },
      showDashboardFilters: false,
      canManageDashboard: data.can_manage_dashboard,
      canViewAvailability: data.can_view_availability,
      canManageAvailability: data.can_manage_availability,
      canViewGraph: data.can_view_graphs,
      indicationTypes: data.indication_types,
      alarmSquadSearch: {
        positions: data.positions_hash.positions,
        positionOrder: data.positions_hash.position_order,
        positionGroups: data.positions_hash.position_groups,
        positionGroupOrder: data.positions_hash.position_group_order,
        athletes: athletesToMap(data.athletes),
        athleteOrder: athletesToIds(data.athletes),
      },
    },
    composeEnhancers(applyMiddleware(...middlewares))
  );
};

const fetchData = () =>
  new Promise((resolve, reject) => {
    /*
     * giving the url dashboards/286
     * the dashboard id is the last part of the URL
     */
    const urlParts = window.location.pathname.split('/'); // ['', 'dashboards', '286']
    const dashboardId = _last(urlParts);

    $.get(
      '/dashboards/dashboard_initial_data',
      {
        id: dashboardId,
      },
      (data) => resolve(data),
      'json'
    ).fail(() => reject());
  });

const MetricsDashboardApp = () => {
  const [data, setData] = useState();
  const [requestStatus, setRequestStatus] = useState('PENDING');
  const inRouterContext = useInRouterContext();

  useEffect(() => {
    Promise.all([fetchData(), getPermissions()]).then(
      ([initialData, permissions]) => {
        if (initialData.redirection_path) {
          window.location.pathname = initialData.redirection_path;
          return;
        }

        setData({
          ...initialData,
          can_view_graphs: permissions.analysis?.includes('graph-viewer'),
          can_view_availability:
            permissions.medical?.includes('availability-view'),
          can_manage_availability:
            permissions.medical?.includes('availability-admin'),
        });

        /*
         * Initialise high charts options
         * Previously this was being called within HighchartsDefaultOptions.js,
         * however translations had not been initialised at that point when SPA is turned on.
         * So HighCharts options were configured with undefined.
         */
        initHighchartsOptions();

        setRequestStatus('SUCCESS');
      },
      () => setRequestStatus('FAILURE')
    );
  }, []);

  /*
   * The print page is built and served by the Rails app
   * The print page URL is the same, so it can't be handled by react-router
   * We need to look at the `print` url param and redirect to the Rails app manually instead
   */
  const urlParams = new URLSearchParams(window.location.search);
  const printParam = urlParams.get('print') || '';
  if (inRouterContext && printParam === 'true') {
    redirectToRails();
    return <DelayedLoadingFeedback />;
  }

  switch (requestStatus) {
    case 'FAILURE':
      return (
        <AppStatus
          status="error"
          message="Failed to load the Dashboard."
          isEmbed
        />
      );
    case 'PENDING':
      return <DelayedLoadingFeedback />;
    case 'SUCCESS':
      return (
        <Provider store={getStore(data)}>
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

export default MetricsDashboardApp;
