// @flow
import { Provider } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { setupReduxDevTools } from '@kitman/common/src/utils';
import ajaxPromise from '@kitman/common/src/utils/ajaxPromise';
import {
  ErrorBoundary,
  AppStatus,
  DelayedLoadingFeedback,
} from '@kitman/components';
import type { Squad } from '@kitman/common/src/types/Squad';
import { useEffect, useMemo, useState } from 'react';
import App from './src/containers/App';
import { alerts, appStatus } from './src/reducer';
import type { Alert } from './types';

// setup Redux dev tools
const middlewares = [thunkMiddleware];
const composeEnhancers = setupReduxDevTools(compose);

const StateTree = combineReducers({
  alerts,
  appStatus,
});

const buildStore = (
  athleteAlerts: Array<Alert>,
  formattedUsers: Array<{
    id: string,
    name: string,
  }>,
  formattedVariables: Array<{
    id: string,
    name: string,
  }>,
  activeSquad: Squad
) =>
  createStore(
    StateTree,
    {
      alerts: {
        alertList: athleteAlerts,
        isModalOpen: false,
        currentAlert: {
          id: null,
          alert_training_variables: [
            {
              condition: 'less_than',
              id: null,
              training_variable_id: null,
              value: null,
            },
          ],
          training_variable_ids: [],
          notification_recipient_ids: [],
          notification_message: '',
        },
        staticData: {
          users: formattedUsers,
          variables: formattedVariables,
          activeSquad,
          squads: {
            data: [],
            isLoading: false,
            hasErrored: false,
          },
        },
      },
      appStatus: {
        message: null,
        status: null,
      },
    },
    composeEnhancers(applyMiddleware(...middlewares))
  );

type AlertsInitialData = {
  athlete_alerts: Array<Alert>,
  users: Array<{
    id: number,
    firstname: string,
    lastname: string,
    fullname: string,
  }>,
  training_variables: Array<{
    id: number,
    name: string,
    description: string | null,
    perma_id: string,
    variable_type_id: number,
    min: number,
    max: number,
    invert_scale: boolean,
  }>,
  permissions: Array<string>,
  current_squad: Squad,
};
const getInitialAlertsData = (): Promise<AlertsInitialData> =>
  ajaxPromise({
    method: 'GET',
    url: '/ui/initial_data_alerts',
  });

function Alerts() {
  const [requestStatus, setRequestStatus] = useState('PENDING');
  const [alertApiData, setAlertApiData] = useState<AlertsInitialData>({});

  useEffect(() => {
    // Get the initial data
    getInitialAlertsData()
      .then((data) => {
        setAlertApiData(data);
        setRequestStatus('SUCCESS');
      })
      .catch(() => {
        setRequestStatus('FAILURE');
      });
  }, []);

  // This useMemo mimics what was previously done at the base index
  // file. It processes what comes back from the `ui/initial_data_alerts`
  // which was previously passed through data-attributes
  const alertData = useMemo(() => {
    if (_isEmpty(alertApiData)) {
      return {
        athleteAlerts: [],
        formattedUsers: [],
        formattedVariables: [],
        activeSquad: {
          id: '',
          name: '',
        },
        canEditAlerts: false,
        canAddAlerts: false,
        canDeleteAlerts: false,
      };
    }

    const permissions = alertApiData.permissions;
    const canEditAlerts = permissions.indexOf('edit-alerts') !== -1;
    const canAddAlerts = permissions.indexOf('add-alerts') !== -1;
    const canDeleteAlerts = permissions.indexOf('delete-alerts') !== -1;
    const athleteAlerts = alertApiData.athlete_alerts;
    const users = alertApiData.users.sort((a, b) => {
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
      id: `${user.id}`,
      name: user.fullname,
    }));
    const variables = alertApiData.training_variables;
    const formattedVariables = variables.map((variable) => ({
      id: `${variable.id}`,
      name: variable.name,
    }));

    return {
      canEditAlerts,
      canAddAlerts,
      canDeleteAlerts,
      athleteAlerts,
      formattedUsers,
      formattedVariables,
      activeSquad: alertApiData.current_squad,
    };
  }, [alertApiData]);

  switch (requestStatus) {
    case 'FAILURE':
      return <AppStatus status="error" isEmbed />;
    case 'PENDING':
      return <DelayedLoadingFeedback />;
    case 'SUCCESS':
      return (
        <ErrorBoundary>
          <Provider
            store={buildStore(
              alertData.athleteAlerts,
              alertData.formattedUsers,
              alertData.formattedVariables,
              alertData.activeSquad
            )}
          >
            {/** a lot of the styles are dependent on the markup being in the alertsContainer class */}
            <div className="alertsContainer">
              <App
                canEditAlerts={alertData.canEditAlerts}
                canAddAlerts={alertData.canAddAlerts}
                canDeleteAlerts={alertData.canDeleteAlerts}
              />
            </div>
          </Provider>
        </ErrorBoundary>
      );
    default:
      return null;
  }
}

// Exporting the original <App /> component so it can be consumed by the
// railse app for versions not using the SPA
export { buildStore, App };

export default Alerts;
