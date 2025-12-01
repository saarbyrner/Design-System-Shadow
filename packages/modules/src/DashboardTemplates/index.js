// @flow
import $ from 'jquery';
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
import { setupReduxDevTools } from '@kitman/common/src/utils';
import App from './src/containers/App';
import { templates, modals, appStatus } from './src/reducer';

// setup Redux dev tools
const middlewares = [thunkMiddleware];
const composeEnhancers = setupReduxDevTools(compose);

const StateTree = combineReducers({
  templates,
  modals,
  appStatus,
});

const buildStore = (dashboardTemplates) =>
  createStore(
    StateTree,
    {
      templates: dashboardTemplates,
      modals: {
        addTemplateVisible: false,
        duplicateTemplateVisible: false,
        renameTemplateVisible: false,
        templateName: null,
        templateToRename: null,
      },
    },
    composeEnhancers(applyMiddleware(...middlewares))
  );

const DashboardTemplatesApp = () => {
  const [dashboardTemplates, setDashboardTemplates] = useState([]);
  const [requestStatus, setRequestStatus] = useState('PENDING');

  useEffect(() => {
    $.getJSON('/dashboards').then(
      (data) => {
        setDashboardTemplates(data.dashboards);
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
        <Provider store={buildStore(dashboardTemplates)}>
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

export default DashboardTemplatesApp;
