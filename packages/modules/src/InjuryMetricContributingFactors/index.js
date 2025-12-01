/* eslint-disable flowtype/require-valid-file-annotation */
import { useState, useEffect } from 'react';
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
import { getPermissions } from '@kitman/services';
import { setupReduxDevTools } from '@kitman/common/src/utils';
import App from './src/containers/App';
import contributingFactors from './src/reducer';

const getPositionGroupMap = (positionsHash) => {
  const map = {};
  positionsHash.position_group_order.forEach((id) => {
    map[id] = positionsHash.position_groups[id];
  });
  return map;
};
const getBodyAreaMap = (bodyAreas) => {
  return bodyAreas.reduce((map, bodyPart) => {
    return Object.assign(map, { [bodyPart.id]: bodyPart.name });
  }, {});
};

// setup Redux dev tools
const middlewares = [thunkMiddleware];
const composeEnhancers = setupReduxDevTools(compose);

const StateTree = combineReducers({
  contributingFactors,
});

const store = createStore(
  StateTree,
  {
    contributingFactors: {
      graphData: {
        analytics_metadata: {
          date_range: {
            start_date: '',
            end_date: '',
          },
          position_group_ids: null,
          exposures: null,
          mechanisms: null,
          body_area_ids: null,
          injuries: null,
          athletes: null,
        },
        dashboard_header: {
          athlete_name: null,
          injury_risk: null,
          injury_risk_variable_name: null,
        },
      },
    },
  },
  composeEnhancers(applyMiddleware(...middlewares))
);

const fetchData = () =>
  new Promise((resolve, reject) => {
    $.get(
      '/analytics/injury_risk_contributing_factors_initial_data',
      resolve,
      'json'
    ).fail(reject);
  });

const ContributingFactors = () => {
  const [data, setData] = useState();
  const [requestStatus, setRequestStatus] = useState('PENDING');

  useEffect(() => {
    Promise.all([fetchData(), getPermissions()]).then(
      ([appData, permissions]) => {
        setData({
          positionGroupMap: getPositionGroupMap(appData.positions_hash),
          bodyAreaMap: getBodyAreaMap(appData.osics_body_areas),
          permissions,
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
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <ErrorBoundary>
              <App
                canManageIssues={data.permissions.medical?.includes(
                  'issues-admin'
                )}
                canViewIssues={data.permissions.medical?.includes(
                  'issues-view'
                )}
                positionGroupsById={data.positionGroupMap}
                bodyAreasById={data.bodyAreaMap}
                orgLogoPath={data.org_logo_path}
                currentOrgName={data.current_org_name}
              />
            </ErrorBoundary>
          </I18nextProvider>
        </Provider>
      );
    default:
      return null;
  }
};

export default () => <ContributingFactors />;
