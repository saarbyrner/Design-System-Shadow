// @flow
import { useSelector } from 'react-redux';
import {
  // getRegistrationProfileStatus,
  getRegistrationSystemStatusForCurrentRequirement,
} from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationRequirementsSelectors';
import {
  type UserType,
  // type RegistrationStatus,
  type RegistrationSystemStatus,
} from '@kitman/modules/src/LeagueOperations/shared/types/common';
import {
  getRegistrationPermissions,
  getRegistrationUserTypeFactory,
} from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors';
import type { RegistrationPermissions } from '@kitman/modules/src/LeagueOperations/shared/types/permissions';

import {
  ATHLETE,
  STAFF,
} from '@kitman/modules/src/LeagueOperations/shared/consts';

import {
  canCreateForm,
  canEditForm,
  canViewForm,
  canApproveForm,
} from '../utils/operations';

type RegistrationsOperations = {
  userType: UserType,
  registration: {
    athlete: {
      canCreate: boolean,
      canView: boolean,
      canEdit: boolean,
      canApprove: boolean,
    },
    staff: {
      canCreate: boolean,
      canView: boolean,
      canEdit: boolean,
      canApprove: boolean,
    },
  },
};

const useRegistrationOperations = (): RegistrationsOperations => {
  // const registrationStatus: RegistrationStatus = useSelector(
  //   getRegistrationProfileStatus()
  // );
  const registrationSystemStatus: RegistrationSystemStatus = useSelector(
    getRegistrationSystemStatusForCurrentRequirement()
  );

  const registrationPermissions: RegistrationPermissions = useSelector(
    getRegistrationPermissions()
  );
  const userType: UserType = useSelector(getRegistrationUserTypeFactory());

  return {
    userType,
    registration: {
      athlete: {
        canCreate: canCreateForm({
          key: ATHLETE,
          registrationPermissions,
          registrationSystemStatus,
          userType,
        }),
        canView: canViewForm({
          key: ATHLETE,
          registrationPermissions,
          userType,
        }),
        canEdit: canEditForm({
          key: ATHLETE,
          registrationPermissions,
          registrationSystemStatus,
          userType,
        }),
        canApprove: canApproveForm({
          key: ATHLETE,
          registrationPermissions,
          registrationSystemStatus,
          userType,
        }),
      },
      staff: {
        canCreate: canCreateForm({
          key: STAFF,
          registrationPermissions,
          registrationSystemStatus,
          userType,
        }),
        canView: canViewForm({
          key: STAFF,
          registrationPermissions,
          userType,
        }),
        canEdit: canEditForm({
          key: STAFF,
          registrationPermissions,
          registrationSystemStatus,
          userType,
        }),
        canApprove: canApproveForm({
          key: STAFF,
          registrationPermissions,
          registrationSystemStatus,
          userType,
        }),
      },
    },
  };
};

export default useRegistrationOperations;
