// @flow
import { I18nextProvider } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import {
  usePermissions,
  PermissionsProvider,
} from '@kitman/common/src/contexts/PermissionsContext';
import { Provider } from 'react-redux';
import {
  useOrganisation,
  OrganisationProvider,
} from '@kitman/common/src/contexts/OrganisationContext';
import {
  AppStatus,
  DelayedLoadingFeedback,
  ErrorBoundary,
} from '@kitman/components';
import _last from 'lodash/last';
import { AppTranslated as App } from '@kitman/modules/src/Medical/diagnostics/src/components/App';
import store from '@kitman/modules/src/Medical/diagnostics/src/redux/store';
import {
  useDiagnostic,
  DiagnosticContextProvider,
} from '@kitman/modules/src/Medical/shared/contexts/DiagnosticContext';
import { DiagnosticResultsContextProvider } from '@kitman/modules/src/Medical/shared/contexts/DiagnosticResultsContext';

const DiagnosticsMedicalApp = (props) => {
  const { permissionsRequestStatus } = usePermissions();
  const { requestStatus: diagnosticRequestStatus } = useDiagnostic();
  const { organisationRequestStatus } = useOrganisation();

  if (
    diagnosticRequestStatus === 'FAILURE' ||
    permissionsRequestStatus === 'FAILURE' ||
    organisationRequestStatus === 'FAILURE'
  ) {
    return <AppStatus status="error" isEmbed />;
  }

  if (
    diagnosticRequestStatus === 'PENDING' ||
    permissionsRequestStatus === 'PENDING' ||
    organisationRequestStatus === 'PENDING'
  ) {
    return <DelayedLoadingFeedback />;
  }

  if (
    diagnosticRequestStatus === 'SUCCESS' &&
    permissionsRequestStatus === 'SUCCESS' &&
    organisationRequestStatus === 'SUCCESS'
  ) {
    return (
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <ErrorBoundary>
            <App {...props} />
          </ErrorBoundary>
        </I18nextProvider>
      </Provider>
    );
  }

  return null;
};

export default () => {
  /*
   * giving the url /medical/athletes/30693/diagnostics/168868
   * the athleteId is the third part of the URL
   * the diagnosticId is the last part of the URL
   */

  const urlParts = window.location.pathname.split('/'); // ['', 'medical', 'athletes', '32774', 'diagnostics', '168868']

  const athleteId = urlParts[3];
  const diagnosticId = parseInt(_last(urlParts), 10);

  return (
    <OrganisationProvider>
      <PermissionsProvider>
        <DiagnosticContextProvider
          athleteId={athleteId}
          diagnosticId={diagnosticId}
        >
          <DiagnosticResultsContextProvider diagnosticId={diagnosticId}>
            <DiagnosticsMedicalApp />
          </DiagnosticResultsContextProvider>
        </DiagnosticContextProvider>
      </PermissionsProvider>
    </OrganisationProvider>
  );
};
