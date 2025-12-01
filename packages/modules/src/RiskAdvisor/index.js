/* eslint-disable flowtype/require-valid-file-annotation */
import { useEffect, useState } from 'react';
import moment from 'moment';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { I18nextProvider } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import {
  AppStatus,
  DelayedLoadingFeedback,
  ErrorBoundary,
} from '@kitman/components';
import { setupReduxDevTools } from '@kitman/common/src/utils';
import { getPermissions } from '@kitman/services';
import App from './src/containers/App';
import {
  injuryVariableSettings,
  appStatus,
  generateMetricStatus,
} from './src/reducer';
import { severityOptions } from './resources/filterOptions';

// setup Redux dev tools
const middlewares = [thunkMiddleware];
const composeEnhancers = setupReduxDevTools(compose);

const StateTree = combineReducers({
  injuryVariableSettings,
  appStatus,
  generateMetricStatus,
});

const body = document.getElementsByTagName('body')[0];
const tsEnd = body.dataset.tsEnd;

const fetchData = () =>
  new Promise((resolve, reject) => {
    $.get(
      '/settings/injury_risk_variables/risk_advisor_initial_data',
      resolve,
      'json'
    ).fail(reject);
  });

const fetchVariables = async () => {
  const url = window.featureFlags['side-nav-update']
    ? '/administration/analytics.json'
    : '/settings/injury_risk_variables.json';
  return new Promise((resolve, reject) => {
    $.get(url, resolve, 'json').fail(reject);
  });
};

const getFirstAvailableVariable = (variables, defaultPipeline) => {
  const emptyVariable = {
    id: null,
    name: '',
    date_range: {
      start_date: moment(tsEnd).subtract(6, 'months'),
      end_date: moment(tsEnd).add(-1, 'days'),
    },
    filter: {
      position_group_ids: [],
      exposure_types: [],
      mechanisms: [],
      osics_body_area_ids: [],
      severity: [],
    },
    excluded_sources: [],
    excluded_variables: [],
    enabled_for_prediction: true,
    created_by: {
      id: null,
      fullname: null,
    },
    created_at: null,
    archived: false,
    status: null,
    last_prediction_status: null,
    is_hidden: false,
    pipeline_arn: defaultPipeline.arn,
  };

  if (variables.length > 0) {
    const firstActiveVar = variables.find((variable) => !variable.archived);
    return firstActiveVar || variables[0];
  }
  return emptyVariable;
};

const store = (data) => {
  // when user is not an admin the BE sends an empty string so that the ARN is not visible for unauthorised personnel
  // the default ARN must be null in that case, but that would break the JSON.parse
  const pipelinesData = !data.riskAdvisorData.pipelines
    ? []
    : data.riskAdvisorData.pipelines;

  const defaultPipeline = !data.riskAdvisorData.default_pipeline
    ? { arn: null }
    : data.riskAdvisorData.default_pipeline;

  const currentVariable = getFirstAvailableVariable(
    data.variables,
    defaultPipeline
  );

  const squadOptions = data.riskAdvisorData.available_squads.map((squad) => ({
    id: squad.id,
    name: squad.name,
  }));

  const bodyAreas = data.riskAdvisorData.osics_body_areas;
  const bodyAreaOptions = bodyAreas.map((bodyArea) => ({
    value: bodyArea.id,
    label: bodyArea.name,
  }));

  const positionsHash = data.riskAdvisorData.positions_hash;
  const positionGroupOptions = () => {
    return positionsHash.position_group_order.map((id) => ({
      value: id,
      label: positionsHash.position_groups[id],
    }));
  };

  return createStore(
    StateTree,
    {
      injuryVariableSettings: {
        allVariables: data.variables,
        currentVariable,
        staticData: {
          tsStart: moment(tsEnd).subtract(6, 'months'),
          tsEnd: moment(tsEnd).add(-1, 'days'),
          squadOptions,
          bodyAreaOptions,
          severityOptions: severityOptions(),
          positionGroupOptions: positionGroupOptions(),
          isKitmanAdmin: data.riskAdvisorData.is_kitman_admin,
          pipelineArnOptions: pipelinesData.map((pipeline) => ({
            value: pipeline.arn,
            label: pipeline.name,
          })),
          defaultPipelineArn: defaultPipeline.arn,
          canCreateMetric:
            data.permissions['risk-advisor']?.includes('create-ir-metrics'),
          canViewMetrics:
            data.permissions['risk-advisor']?.includes('view-ir-metrics'),
          canEditMetrics:
            data.permissions['risk-advisor']?.includes('edit-ir-metrics'),
        },
        renameVariableModal: {
          isOpen: false,
          isTriggeredBySave: false,
          variableName: null,
        },
        dataSourcePanel: {
          isOpen: false,
        },
        toast: {
          statusItem: null,
        },
        graphData: {
          isLoading: false,
          summary:
            data.variables.length > 0
              ? currentVariable.snapshot?.summary
              : null,
          value:
            data.variables.length > 0 ? currentVariable.snapshot?.value : null,
          totalInjuries:
            data.variables.length > 0
              ? currentVariable.snapshot?.total_injuries_no_filtering
              : null,
        },
        tcfGraphData: {
          isLoading: true,
          graphData: [],
        },
      },
      appStatus: {
        status: null,
        message: null,
      },
      generateMetricStatus: {
        status: null,
        message: null,
        title: null,
      },
    },
    composeEnhancers(applyMiddleware(...middlewares))
  );
};

const RiskAdvisor = () => {
  const [data, setData] = useState();
  const [requestStatus, setRequestStatus] = useState('PENDING');

  useEffect(() => {
    Promise.all([fetchData(), fetchVariables(null), getPermissions()]).then(
      ([riskAdvisorData, variables, permissions]) => {
        setData({
          riskAdvisorData,
          variables,
          permissions,
        });
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
        <Provider store={store(data)}>
          <I18nextProvider i18n={i18n}>
            <ErrorBoundary>
              <App
                turnaroundList={JSON.parse(
                  data.riskAdvisorData.turnaround_list
                )}
              />
            </ErrorBoundary>
          </I18nextProvider>
        </Provider>
      );
    default:
      return null;
  }
};

export default () => <RiskAdvisor />;
