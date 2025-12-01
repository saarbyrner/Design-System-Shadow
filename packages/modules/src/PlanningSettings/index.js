// @flow
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { ErrorBoundary } from '@kitman/components';
import store from './src/redux/store';
import App from './src/containers/App';

const PlanningSettingsApp = () => {
  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </I18nextProvider>
    </Provider>
  );
};

export default PlanningSettingsApp;
