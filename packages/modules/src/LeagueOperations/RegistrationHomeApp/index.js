// @flow
import { withNamespaces } from 'react-i18next';
import { useSelector } from 'react-redux';
import type { UserType } from '@kitman/modules/src/LeagueOperations/technicalDebt/types/';

import {
  getRegistrationUserTypeFactory,
  getRegistrationPermissions,
} from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors';

import type { RegistrationPermissions } from '@kitman/modules/src/LeagueOperations/shared/types/permissions';
import { USER_TYPES } from '@kitman/modules/src/LeagueOperations/shared/consts';

import { RegistrationAssociationAppTranslated as RegistrationAssociationApp } from '@kitman/modules/src/LeagueOperations/RegistrationAssociationApp';
import RegistrationProfileApp from '../RegistrationProfileApp';
import RegistrationOrganisationApp from '../RegistrationOrganisationApp';

const RegistrationHomeApp = () => {
  const registrationPermissions: RegistrationPermissions = useSelector(
    getRegistrationPermissions()
  );

  const currentUserType: UserType = useSelector(
    getRegistrationUserTypeFactory()
  );

  const canViewRegistrationArea =
    registrationPermissions?.registrationArea?.canView;

  if (canViewRegistrationArea) {
    if (currentUserType === USER_TYPES.ASSOCIATION_ADMIN) {
      return <RegistrationAssociationApp />;
    }
    return <RegistrationOrganisationApp />;
  }

  return <RegistrationProfileApp />;
};

export default RegistrationHomeApp;

export const RegistrationHomeAppTranslated =
  withNamespaces()(RegistrationHomeApp);
