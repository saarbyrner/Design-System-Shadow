/* eslint-disable flowtype/require-valid-file-annotation */
import { I18nextProvider } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import {
  usePermissions,
  PermissionsProvider,
} from '@kitman/common/src/contexts/PermissionsContext';
import useLocationPathname from '@kitman/common/src/hooks/useLocationPathname';
import { Provider, useSelector } from 'react-redux';
import _last from 'lodash/last';
import {
  useOrganisation,
  OrganisationProvider,
} from '@kitman/common/src/contexts/OrganisationContext';
import {
  AppStatus,
  DelayedLoadingFeedback,
  ErrorBoundary,
} from '@kitman/components';
import { AppTranslated as App } from '@kitman/modules/src/Medical/athletes/src/components/App';
import store from '@kitman/modules/src/Medical/athletes/src/redux/store';

const AthleteMedicalApp = () => {
  const { permissionsRequestStatus } = usePermissions();
  const { organisationRequestStatus } = useOrganisation();
  const { isPlayerSelectOpen } = useSelector(
    (state) => state.playerSelectSlice
  );

  const pathname = useLocationPathname();
  /*
   * giving the url /medical/athletes/30693
   * the athleteId is the last part of the URL
   */

  const athleteId = parseInt(_last(pathname.split('/')), 10);

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
            <App
              athleteId={athleteId}
              isPlayerSelectOpen={isPlayerSelectOpen}
            />
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
      <AthleteMedicalApp />
    </PermissionsProvider>
  </OrganisationProvider>
);
