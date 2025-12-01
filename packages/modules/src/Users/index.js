/* eslint-disable flowtype/require-valid-file-annotation */
import { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { createStore, compose, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { I18nextProvider } from 'react-i18next';
import { setupReduxDevTools } from '@kitman/common/src/utils';
import i18n from '@kitman/common/src/utils/i18n';
import {
  AppStatus,
  DelayedLoadingFeedback,
  ErrorBoundary,
} from '@kitman/components';
import { PermissionsProvider } from '@kitman/common/src/contexts/PermissionsContext';
import { massUploadApi } from '@kitman/modules/src/shared/MassUpload/redux/massUploadApi';
import { medicalApi } from '@kitman/modules/src/Medical/shared/redux/services/medical';
import massUploadSlice from '@kitman/modules/src/shared/MassUpload/redux/massUploadSlice';
import userReducer from './src/redux/reducers';

import App from './src/App';

// setup Redux dev tools
const middlewares = [
  thunkMiddleware,
  massUploadApi.middleware,
  medicalApi.middleware,
];
const composeEnhancers = setupReduxDevTools(compose);

const StateTree = combineReducers({
  userReducer,
  massUploadApi: massUploadApi.reducer,
  massUploadSlice: massUploadSlice.reducer,
  medicalApi: medicalApi.reducer,
});

export const getStore = (data) =>
  createStore(
    StateTree,
    {
      userReducer: {
        users: data.users,
        inactiveUsers: data.inactive_users,
        searchText: '',
        assignVisibilityModal: {
          open: false,
          user: null,
        },
      },
    },
    composeEnhancers(applyMiddleware(...middlewares))
  );

const fetchData = () =>
  new Promise((resolve, reject) => {
    $.get('/ui/initial_data_users', (data) => resolve(data), 'json').fail(() =>
      reject()
    );
  });

const UsersApp = () => {
  const [data, setData] = useState();
  const [requestStatus, setRequestStatus] = useState('PENDING');

  useEffect(() => {
    fetchData().then(
      (res) => {
        setData(res);
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
        <PermissionsProvider>
          <Provider store={getStore(data)}>
            <I18nextProvider i18n={i18n}>
              <ErrorBoundary>
                <App />
              </ErrorBoundary>
            </I18nextProvider>
          </Provider>
        </PermissionsProvider>
      );
    default:
      return null;
  }
};

export default UsersApp;
