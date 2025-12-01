/* eslint-disable flowtype/require-valid-file-annotation */
import { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { I18nextProvider } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import {
  AppStatus,
  DelayedLoadingFeedback,
  ErrorBoundary,
} from '@kitman/components';
import { setupReduxDevTools } from '@kitman/common/src/utils';
import { globalApi } from '@kitman/common/src/redux/global/services/globalApi';
import App from './src/containers/App';
import { manageUsers, manageUserProfileImage, appStatus } from './src/reducer';

// setup Redux dev tools
const middlewares = [thunkMiddleware, globalApi.middleware];
const composeEnhancers = setupReduxDevTools(compose);

const StateTree = combineReducers({
  manageUsers,
  manageUserProfileImage,
  appStatus,
  [globalApi.reducerPath]: globalApi.reducer,
});

const transformedLangs = (supportedLangs) => {
  const langs = Object.keys(supportedLangs).map((langName) => ({
    value: supportedLangs[langName],
    label: langName,
  }));
  langs.unshift({
    value: null,
    label: i18n.t('Use organisation language setting'),
  });
  return langs;
};

const store = (currentUser) =>
  createStore(
    StateTree,
    {
      manageUsers: {
        currentUser,
        currentPassword: '',
        newPassword: '',
        newPasswordAgain: '',
      },
      manageUserProfileImage: {
        status: 'IDLE',
        imageUploadModalOpen: false,
        toasts: [],
      },
      appStatus: {
        message: null,
        status: null,
      },
    },
    composeEnhancers(applyMiddleware(...middlewares))
  );

const fetchData = () =>
  new Promise((resolve, reject) => {
    $.get(
      '/ui/initial_data_user_profiles',
      (data) => resolve(data),
      'json'
    ).fail(() => reject());
  });

const ManageUsersApp = () => {
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
        <Provider store={store(data.current_user)}>
          <I18nextProvider i18n={i18n}>
            <ErrorBoundary>
              <App languages={transformedLangs(data.supported_langs)} />
            </ErrorBoundary>
          </I18nextProvider>
        </Provider>
      );
    default:
      return null;
  }
};

export default ManageUsersApp;
