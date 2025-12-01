// @flow
import useLocationPathname from '@kitman/common/src/hooks/useLocationPathname';

import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { AppStatus, DelayedLoadingFeedback } from '@kitman/components';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import { EditOfficialsAppTranslated as EditOfficialsApp } from './src/App';

import { useFetchOfficialQuery } from '../shared/redux/services/index';

export default () => {
  const locationPathname = useLocationPathname();

  const parseIdFromLocation = (location) => {
    const urlParts = location.split('/');
    return urlParts[3];
  };

  const id = parseIdFromLocation(locationPathname);

  const { isFetching: isOfficialFetching, isError: isOfficialError } =
    useFetchOfficialQuery(id, {
      skip: id === null,
    });

  const { permissionsRequestStatus } = usePermissions();
  const { organisationRequestStatus } = useOrganisation();

  if (
    permissionsRequestStatus === 'FAILURE' ||
    organisationRequestStatus === 'FAILURE' ||
    isOfficialError
  ) {
    return <AppStatus status="error" isEmbed />;
  }
  if (
    permissionsRequestStatus === 'PENDING' ||
    organisationRequestStatus === 'PENDING' ||
    isOfficialFetching
  ) {
    return <DelayedLoadingFeedback />;
  }
  if (
    permissionsRequestStatus === 'SUCCESS' &&
    organisationRequestStatus === 'SUCCESS'
  ) {
    return <EditOfficialsApp id={id} />;
  }

  return null;
};
