/* eslint-disable flowtype/require-valid-file-annotation */
import { Provider, useSelector } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import {
  usePermissions,
  PermissionsProvider,
} from '@kitman/common/src/contexts/PermissionsContext';
import {
  useOrganisation,
  OrganisationProvider,
} from '@kitman/common/src/contexts/OrganisationContext';

import {
  AppStatus,
  DelayedLoadingFeedback,
  ErrorBoundary,
} from '@kitman/components';
import store from './src/redux/store';
import App from './src/containers/App';

const MedicalApp = () => {
  const { permissionsRequestStatus } = usePermissions();
  const { organisationRequestStatus } = useOrganisation();

  const { isPlayerSelectOpen } = useSelector(
    (state) => state.playerSelectSlice
  );

  if (
    permissionsRequestStatus === 'FAILURE' ||
    organisationRequestStatus === 'FAILURE'
  ) {
    return <AppStatus status="error" isEmbed />;
  }
  if (
    permissionsRequestStatus === 'PENDING' ||
    organisationRequestStatus === 'PENDING'
  ) {
    return <DelayedLoadingFeedback />;
  }
  if (
    permissionsRequestStatus === 'SUCCESS' &&
    organisationRequestStatus === 'SUCCESS'
  ) {
    return (
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <ErrorBoundary>
            <App isPlayerSelectOpen={isPlayerSelectOpen} />
          </ErrorBoundary>
        </I18nextProvider>
      </Provider>
    );
  }

  return null;
};

export default () => (
  <OrganisationProvider>
    <PermissionsProvider>
      <MedicalApp />
    </PermissionsProvider>
  </OrganisationProvider>
);
