/* eslint-disable flowtype/require-valid-file-annotation */
import { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { I18nextProvider } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { getPermissions } from '@kitman/services';
import {
  ErrorBoundary,
  AppStatus,
  DelayedLoadingFeedback,
} from '@kitman/components';
import { setupReduxDevTools } from '@kitman/common/src/utils';
import coachingPrinciples from '@kitman/common/src/reducers/coaching_principles_reducer';
import { globalApi } from '@kitman/common/src/redux/global/services/globalApi';
import { notificationsApi } from '@kitman/services/src/services/OrganisationSettings/Notifications';
import labels from '@kitman/modules/src/OrganisationSettings/src/components/DynamicCohorts/ManageLabels/redux/reducers';
import toastsSlice from '@kitman/modules/src/Toasts/toastsSlice';
import App from './src/containers/App';
import { orgSettings, appStatus } from './src/reducer';
import { labelsApi } from './src/components/DynamicCohorts/ManageLabels/redux/services/labelsApi';

// setup Redux dev tools
const middlewares = [
  thunkMiddleware,
  globalApi.middleware,
  labelsApi.middleware,
  notificationsApi.middleware,
];
const composeEnhancers = setupReduxDevTools(compose);

const StateTree = combineReducers({
  orgSettings,
  appStatus,
  coachingPrinciples,
  globalApi: globalApi.reducer,
  [notificationsApi.reducerPath]: notificationsApi.reducer,
  toastsSlice: toastsSlice.reducer,
  ...labels,
});

const getStore = (data) =>
  createStore(
    StateTree,
    {
      orgSettings: {
        graphColourPalette: [],
        groupedWorkloadOptions: data.grouped_workload_options,
        primaryWorkloadVariableId:
          data.primary_workload_variable_id || 'kitman|workload',
        secondaryWorkloadVariableId: data.secondary_workload_variable_id || '',
        gameParticipationLevels: data.game_participation_levels || [],
        trainingParticipationLevels: data.training_participation_levels || [],
        gameRpeCollection: {
          kioskApp: data.game_kiosk_rpe || false,
          athleteApp: data.game_athlete_rpe || false,
        },
        trainingRpeCollection: {
          kioskApp: data.ts_kiosk_rpe || false,
          athleteApp: data.ts_athlete_rpe || false,
        },
        nameFormattings: data.name_formattings || {},
        integrations: {
          activeIntegrations: [],
          availableIntegrations: [],
          addIntegrationModal: {
            isOpen: false,
          },
          unlinkIntegrationModal: {
            isOpen: false,
            id: null,
            unlinkUrl: null,
          },
        },
        security: {
          privacyPolicy: {
            actionState: 'LOADING',
            isActive: undefined,
            updatedText: null,
            currentText: null,
          },
          updatePrivacyPolicyModal: {
            isOpen: false,
          },
        },
        legal: {
          termsOfUsePolicy: {
            actionState: 'LOADING',
            isActive: undefined,
            updatedText: null,
            currentText: null,
          },
          updateTermsOfUsePolicyModal: {
            isOpen: false,
          },
        },
        hasDevelopmentGoalsModule:
          data.organisation_modules.includes('development-goals') || false,
        isPlanningAdmin: data.is_planning_admin,
      },
      appStatus: {
        status: null,
        message: null,
      },
      coachingPrinciples: {
        isEnabled: false,
      },
    },
    composeEnhancers(applyMiddleware(...middlewares))
  );

const fetchData = async () =>
  new Promise((resolve, reject) => {
    $.get(
      '/ui/initial_data_organisation_settings',
      (data) => {
        resolve(data);
      },
      'json'
    ).fail(() => {
      reject();
    });
  });

const OrganisationSettingsApp = () => {
  const [data, setData] = useState();
  const [requestStatus, setRequestStatus] = useState('PENDING');

  useEffect(() => {
    Promise.all([getPermissions(), fetchData()]).then(
      ([permissionsData, orgSettingsData]) => {
        setData({
          is_planning_admin:
            permissionsData.settings?.includes('planning-admin'),
          ...orgSettingsData,
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

export default OrganisationSettingsApp;
