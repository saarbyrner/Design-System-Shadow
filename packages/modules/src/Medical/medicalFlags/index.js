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
import {
  useMedicalFlag,
  MedicalFlagContextProvider,
} from '@kitman/modules/src/Medical/shared/contexts/MedicalFlagContext';
import { AppTranslated as App } from '@kitman/modules/src/Medical/medicalFlags/src/components/App';
import store from '@kitman/modules/src/Medical/medicalFlags/src/redux/store';

const MedicalFlagMedicalApp = (props) => {
  const { permissionsRequestStatus } = usePermissions();
  const { organisationRequestStatus } = useOrganisation();
  const { requestStatus: medicalFlagRequestStatus } = useMedicalFlag();

  if (
    medicalFlagRequestStatus === 'FAILURE' ||
    permissionsRequestStatus === 'FAILURE' ||
    organisationRequestStatus === 'FAILURE'
  ) {
    return <AppStatus status="error" isEmbed />;
  }

  if (
    medicalFlagRequestStatus === 'PENDING' ||
    permissionsRequestStatus === 'PENDING' ||
    organisationRequestStatus === 'PENDING'
  ) {
    return <DelayedLoadingFeedback />;
  }

  if (
    medicalFlagRequestStatus === 'SUCCESS' &&
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
   * giving the url /medical/athletes/30693/athlete_medical_alerts/1
   * the athleteId is the third part of the URL
   * the medicalFlagType is the fourth part of the URL (athlete_medical_alerts || allergies)
   * the (athlete_medical_alerts || allergies) id is the last part of the URL
   */

  const urlParts = window.location.pathname.split('/'); // ['', 'medical', 'athletes', '32774', 'athlete_medical_alerts', '1']
  const athleteId = urlParts[3];
  const medicalFlagType = urlParts[4];
  const medicalFlagId = parseInt(_last(urlParts), 10);

  return (
    <OrganisationProvider>
      <PermissionsProvider>
        <MedicalFlagContextProvider
          athleteId={athleteId}
          medicalFlagType={medicalFlagType}
          medicalFlagId={medicalFlagId}
        >
          <MedicalFlagMedicalApp />
        </MedicalFlagContextProvider>
      </PermissionsProvider>
    </OrganisationProvider>
  );
};
