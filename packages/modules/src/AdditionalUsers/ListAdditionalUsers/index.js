// @flow
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { AppStatus, DelayedLoadingFeedback } from '@kitman/components';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import { ListAdditionalUsersAppTranslated as ListAdditionalUsersApp } from './src/App';

export default () => {
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
    return <ListAdditionalUsersApp />;
  }

  return null;
};
