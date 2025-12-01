/* eslint-disable flowtype/require-valid-file-annotation */
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';

import { AppStatus, DelayedLoadingFeedback } from '@kitman/components';

import { AppTranslated as App } from './src/App';

const SquadManagementApp = () => {
  const { permissionsRequestStatus } = usePermissions();
  const { organisationRequestStatus } = useOrganisation();

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
    return <App />;
  }

  return null;
};

export default () => <SquadManagementApp />;
