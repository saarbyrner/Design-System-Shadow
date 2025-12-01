/* eslint-disable flowtype/require-valid-file-annotation */
import { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { I18nextProvider } from 'react-i18next';
import { searchParams, setupReduxDevTools } from '@kitman/common/src/utils';
import { OrganisationProvider } from '@kitman/common/src/contexts/OrganisationContext';
import { initHighchartsOptions } from '@kitman/common/src/utils/HighchartDefaultOptions';
import { globalApi } from '@kitman/common/src/redux/global/services/globalApi';
import {
  athletesToIds,
  athletesToMap,
} from '@kitman/common/src/utils/dashboard';
import i18n from '@kitman/common/src/utils/i18n';
import { getActivityGroups, getContactTypes } from '@kitman/services';
import {
  AppStatus as AppStatusComponent,
  DelayedLoadingFeedback,
  ErrorBoundary,
} from '@kitman/components';
import { flattenSquadSearchItems } from '@kitman/components/src/SquadSearch/utils';
import formatActivityGroupOptions from '@kitman/common/src/utils/formatActivityGroupOptions';
import formatSessionsTypesOptions from '@kitman/common/src/utils/formatSessionsTypesOptions';
import eventTypes from './resources/eventTypes';
import trainingSessionTypes from './resources/trainingSessionTypes';
import {
  transformGraphResponse,
  transformSummaryResponse,
  availableVariablesHash,
  getContainerType,
  getIsEditingDashboard,
  getIsEditingGraph,
  formatDashboardListForDropdown,
  getCurrentDashboard,
} from './src/utils';
import {
  GraphGroup,
  GraphFormType,
  AppStatus,
  DashboardSelectorModal,
  RenameGraphModal,
  StaticData,
} from './src/reducers/reducer';
import GraphData from './src/reducers/GraphData';
import GraphFormSummary from './src/reducers/GraphFormSummary';
import GraphForm from './src/reducers/GraphForm';
import App from './src/containers/App';
import { InvalidSeasonTranslated as InvalidSeason } from './src/components/InvalidSeason';
import { InvalidPermissionTranslated as InvalidPermission } from './src/components/InvalidPermission';

// setup Redux dev tools
const middlewares = [thunkMiddleware, globalApi.middleware];
const composeEnhancers = setupReduxDevTools(compose);
// setup state tree
const StateTree = combineReducers({
  globalApi: globalApi.reducer,
  GraphGroup,
  GraphData,
  GraphFormType,
  GraphForm,
  GraphFormSummary,
  AppStatus,
  DashboardSelectorModal,
  RenameGraphModal,
  StaticData,
});

// check if our target div exits and get data
let turnaroundList;
let squadAthletes;
let availableVariables;
let athletes;
let positionsHash;
let chartBuilderPermission;
let chartSaverPermission;
let medicalGraphingPermission;
let dashboardList;
let permittedSquads;
let competitions;
let trainingSessionTypesArray;
let diagnostics;

// default to empty chart data
let chartData = {
  metrics: [],
  illnesses: [],
  injuries: [],
};

// and empty graph form
let graphFormData = {
  time_period: null,
  date_range: null,
};

const getStore = (data) => {
  // medinah will set this to '' unless deeplinking in which case the data for
  // the chart will be in here
  if (data.chart_data) {
    chartData = data.chart_data;
  }
  if (data.graph_form_data) {
    graphFormData = data.graph_form_data;
  }
  turnaroundList = JSON.parse(data.seasonal_turnarounds);
  availableVariables = data.variables || [];
  athletes = data.athletes || [];
  positionsHash = data.positions_hash;
  chartBuilderPermission = data.chart_builder === true;
  chartSaverPermission = data.dashboard_manager === true;
  medicalGraphingPermission = data.medical_graphing === true;
  dashboardList = data.dashboards;
  squadAthletes = data.squad_athletes;
  permittedSquads = data.permitted_squads;
  competitions = data.competitions;
  trainingSessionTypesArray = data.training_session_types;
  diagnostics = data.diagnostics;
  window.graphColours = data.graph_colours;

  const alarmSquadSearch = {
    athletes: athletesToMap(athletes),
    athleteOrder: athletesToIds(athletes),
    positions: positionsHash.positions,
    positionOrder: positionsHash.position_order,
    positionGroups: positionsHash.position_groups,
    positionGroupOrder: positionsHash.position_group_order,
    missingAthletes: [],
  };

  const GraphDataResponse = Object.assign({}, chartData, graphFormData);

  const graphType = GraphDataResponse.graph_type || 'line';
  let formattedForState;
  const graphGroup = GraphDataResponse.graph_group || 'longitudinal';

  if (graphGroup === 'summary') {
    formattedForState = transformSummaryResponse(
      GraphDataResponse,
      availableVariablesHash(availableVariables)
    );
  } else {
    formattedForState = transformGraphResponse(GraphDataResponse, graphGroup);
  }

  const staticData = {
    squadAthletes,
    permittedSquads,
    athletesDropdown: flattenSquadSearchItems(
      alarmSquadSearch.athletes,
      alarmSquadSearch.athleteOrder,
      alarmSquadSearch.positions,
      alarmSquadSearch.positionOrder,
      alarmSquadSearch.positionGroups,
      alarmSquadSearch.positionGroupOrder,
      alarmSquadSearch.missingAthletes
    ),
    athleteGroupsDropdown: flattenSquadSearchItems(
      [],
      [],
      alarmSquadSearch.positions,
      alarmSquadSearch.positionOrder,
      alarmSquadSearch.positionGroups,
      alarmSquadSearch.positionGroupOrder,
      []
    ),
    availableVariables,
    availableVariablesHash: availableVariablesHash(availableVariables),
    turnaroundList,
    injuryPathologies: data.injuryPathologies || [],
    illnessPathologies: data.illnessPathologies || [],
    injuryBodyAreas: data.injuryBodyAreas || [],
    illnessBodyAreas: data.illnessBodyAreas || [],
    injuryClassifications: data.injuryClassifications || [],
    illnessClassifications: data.illnessClassifications || [],
    activities: formatActivityGroupOptions(data.activityGroups),
    sessionsTypes: formatSessionsTypesOptions(data.activityGroups),
    eventTypes: [...eventTypes()],
    trainingSessionTypes: [...trainingSessionTypes(trainingSessionTypesArray)],
    contactTypes: data.contactTypes,
    timeLossTypes: data.time_loss_types,
    competitions,
    diagnostics,

    currentDashboard: getCurrentDashboard(dashboardList),
    canBuildGraph: chartBuilderPermission,
    canSaveGraph: chartSaverPermission,
    canAccessMedicalGraph: medicalGraphingPermission,
    containerType: getContainerType(),
    isEditingDashboard: getIsEditingDashboard(),
    isEditingGraph: getIsEditingGraph(),
  };
  return createStore(
    StateTree,
    {
      GraphData: {
        longitudinal:
          graphGroup === 'longitudinal' ? formattedForState.graphData : null,
        summary: graphGroup === 'summary' ? formattedForState.graphData : null,
        summaryBar:
          graphGroup === 'summary_bar' ? formattedForState.graphData : null,
        summaryStackBar:
          graphGroup === 'summary_stack_bar'
            ? formattedForState.graphData
            : null,
        summaryDonut:
          graphGroup === 'summary_donut' ? formattedForState.graphData : null,
        valueVisualisation:
          graphGroup === 'value_visualisation'
            ? formattedForState.graphData
            : null,
      },
      DashboardSelectorModal: {
        dashboardList: formatDashboardListForDropdown(dashboardList),
        selectedDashboard: dashboardList[0].id,
        isOpen: false,
      },
      RenameGraphModal: {
        graphTitle: GraphDataResponse.name || null,
        updatedGraphTitle: null,
        isOpen: false,
      },
      GraphFormType: graphType,
      GraphGroup: graphGroup,
      GraphFormSummary:
        graphGroup === 'summary' ? formattedForState.formData : undefined,
      StaticData: staticData,
      GraphForm: data.graph_form_data ? formattedForState.formData : undefined,
    },
    composeEnhancers(applyMiddleware(...middlewares))
  );
};

const fetchData = () =>
  new Promise((resolve, reject) => {
    $.get(
      '/analysis/graph/graph_composer_initial_data',
      {
        deeplink: searchParams('deeplink'),
        analytical_dashboard_id: searchParams('analytical_dashboard_id'),
        graph_id: searchParams('graph_id'),
        status_id: searchParams('status_id'),
        athlete_id: searchParams('athlete_id'),
      },
      (data) => resolve(data),
      'json'
    ).fail(reject);
  });

const GraphComposerApp = () => {
  const [data, setData] = useState();
  const [requestStatus, setRequestStatus] = useState('PENDING');

  const resolveErrorResponse = (res) => {
    if (res.responseJSON.type === 'INVALID_SEASON') {
      setRequestStatus('INVALID_SEASON');
    } else if (res.responseJSON.type === 'INVALID_PERMISSION') {
      setRequestStatus('INVALID_PERMISSION');
    } else {
      setRequestStatus('FAILURE');
    }
  };

  useEffect(() => {
    /*
     * Initialise high charts options
     * Previously this was being called within HighchartsDefaultOptions.js,
     * however translations had not been initialised at that point when SPA is turned on.
     * So HighCharts options were configured with undefined.
     * This is needed in GraphComposer as the MetricsDashboard contains a link to open a graph here
     */
    initHighchartsOptions();
  }, []);

  useEffect(() => {
    Promise.all([fetchData(), getContactTypes(), getActivityGroups()]).then(
      ([graphBuilderData, contactTypes, activityGroups]) => {
        setData({
          ...graphBuilderData,
          contactTypes,
          activityGroups,
        });
        setRequestStatus('SUCCESS');
      },
      (res) => resolveErrorResponse(res)
    );
  }, []);

  switch (requestStatus) {
    case 'FAILURE':
      return <AppStatusComponent status="error" isEmbed />;
    case 'INVALID_PERMISSION':
      return <InvalidPermission />;
    case 'INVALID_SEASON':
      return <InvalidSeason />;
    case 'PENDING':
      return <DelayedLoadingFeedback />;
    case 'SUCCESS':
      return (
        <OrganisationProvider>
          <Provider store={getStore(data)}>
            <I18nextProvider i18n={i18n}>
              <ErrorBoundary>
                <App />
              </ErrorBoundary>
            </I18nextProvider>
          </Provider>
        </OrganisationProvider>
      );
    default:
      return null;
  }
};

export default GraphComposerApp;
