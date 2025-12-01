/* eslint-disable flowtype/require-valid-file-annotation */
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
import { AppTranslated as App } from '@kitman/modules/src/Medical/notifications/src/components/App';

const Notifications = () => {
  const { permissionsRequestStatus } = usePermissions();
  const { organisationRequestStatus } = useOrganisation();
  const urlPath = window.location.pathname.split('/').slice(-4);

  // finds athleteId based on changing url
  const athleteId = parseInt(urlPath[0], 10) || parseInt(urlPath[2], 10);

  // gets value of hash and removes hashtag
  const hash = window.location.hash.substring(1);

  const injuryIllnessId = window.location.pathname.split('/').slice(-2, -1)[0];

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
      <I18nextProvider i18n={i18n}>
        <ErrorBoundary>
          <App
            athleteId={athleteId}
            hash={hash}
            urlPath={urlPath}
            injuryIllnessId={injuryIllnessId}
          />
        </ErrorBoundary>
      </I18nextProvider>
    );
  }

  return null;
};

export default () => (
  <OrganisationProvider>
    <PermissionsProvider>
      <Notifications />
    </PermissionsProvider>
  </OrganisationProvider>
);
