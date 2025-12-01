// @flow
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import _last from 'lodash/last';

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
import { AppTranslated as App } from '@kitman/modules/src/Medical/procedures/src/components/App';
import store from '@kitman/modules/src/Medical/procedures/src/redux/store';
import {
  useProcedure,
  ProcedureContextProvider,
} from '@kitman/modules/src/Medical/shared/contexts/ProcedureContext';

const ProceduresMedicalApp = (props) => {
  const { permissionsRequestStatus } = usePermissions();
  const { requestStatus: procedureRequestStatus } = useProcedure();
  const { organisationRequestStatus } = useOrganisation();

  if (
    procedureRequestStatus === 'FAILURE' ||
    permissionsRequestStatus === 'FAILURE' ||
    organisationRequestStatus === 'FAILURE'
  ) {
    return <AppStatus status="error" isEmbed />;
  }

  if (
    procedureRequestStatus === 'PENDING' ||
    permissionsRequestStatus === 'PENDING' ||
    organisationRequestStatus === 'PENDING'
  ) {
    return <DelayedLoadingFeedback />;
  }

  if (
    procedureRequestStatus === 'SUCCESS' &&
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
   * giving the url /medical/procedures/30693
   * the procedureId is the third part of the URL
   */
  const urlParts = window.location.pathname.split('/'); // ['', 'medical', 'procedures', '30693']

  const athleteId = urlParts[3];
  const procedureId = parseInt(_last(urlParts), 10);

  return (
    <OrganisationProvider>
      <PermissionsProvider>
        <ProcedureContextProvider
          athleteId={athleteId}
          procedureId={procedureId}
        >
          <ProceduresMedicalApp />
        </ProcedureContextProvider>
      </PermissionsProvider>
    </OrganisationProvider>
  );
};
