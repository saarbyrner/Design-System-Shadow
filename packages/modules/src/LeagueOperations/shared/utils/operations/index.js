// Documentation: https://kitmanlabs.atlassian.net/wiki/spaces/PM/pages/175145751/Registration+Permissions
// @flow

import {
  ASSOCIATION_ADMIN,
  ORGANISATION_ADMIN,
  ATHLETE,
  STAFF,
} from '@kitman/modules/src/LeagueOperations/shared/consts';
import type { RegistrationPermissions } from '@kitman/modules/src/LeagueOperations/shared/types/permissions';

import {
  RegistrationStatusEnum,
  type UserType,
  // type RegistrationStatus,
  type RegistrationSystemStatus,
} from '@kitman/modules/src/LeagueOperations/shared/types/common';

/**
 * A function to determine if the currently signed in user can create a new
 * registration form
 * with current registration permissions
 * for the current profile with
 * the current registration form status
 *
 * @param {string} key ATHLETE | STAFF
 * @param {UserType} userType The current signed in user
 * @param {RegistrationPermissions} registrationPermissions The registration permissions module
 * @param {RegistrationSystemStatus} registrationSystemStatus The current registration system status
 * @returns {boolean}
 * A registration form can be created / submitted
 * WHEN the current form status is INCOMPLETE
 * AND the current user is a STAFF or ATHLETE

 * A registration form can be created / submitted
 * WHEN the current form status is INCOMPLETE
 * AND the current user is an ORGANISATION_ADMIN
 * AND the current user has the permission 'registration-create-staff' for a staff
 * OR the current user has the permission 'registration-create-athlete' for an athlete

 *
 * A registration form cannot be created / submitted
 * WHEN the current user is an ASSOCIATION_ADMIN
 */
export const canCreateForm = ({
  key,
  userType,
  registrationPermissions,
  registrationSystemStatus,
}: {
  key: string,
  userType: UserType,
  registrationPermissions: RegistrationPermissions,
  registrationSystemStatus: RegistrationSystemStatus,
}): boolean => {
  if (registrationSystemStatus.type === RegistrationStatusEnum.INCOMPLETE) {
    return (
      [ATHLETE, STAFF].includes(userType) ||
      ([ORGANISATION_ADMIN].includes(userType) &&
        registrationPermissions[key].canCreate)
    );
  }

  return false;
};

/**
 * A function to determine if the currently signed in user can edit a submitted
 * registration form
 * with current registration permissions
 * for the current profile with
 * the current registration form status
 *
 * @param {string} key ATHLETE | STAFF
 * @param {UserType} userType The current signed in user
 * @param {RegistrationPermissions} registrationPermissions The registration permissions module
 * @param {RegistrationSystemStatus} registrationSystemStatus The current registration system status
 * @returns {boolean}
 * A registration form can be edited
 * WHEN the current user is a STAFF or ATHLETE
 * AND the current form status is REJECTED_ASSOCIATION
 *  OR the current form status is REJECTED_ORGANISATION

 * A registration form can be edited
 * WHEN the current user is an ORGANISATION_ADMIN
 * AND the current form status is PENDING_ORGANISATION
 *  OR the current form status is REJECTED_ORGANISATION
 *  OR the current form status is REJECTED_ASSOCIATION
 * AND the current user has the permission 'registration-edit-staff' for a staff
 *  OR the current user has the permission 'registration-edit-athlete' for an athlete

 *
 * A registration form cann be edited
 * WHEN the current user is an ASSOCIATION_ADMIN
 * AND the current form status is PENDING_ORGANISATION
 *  OR the current form status is REJECTED_ORGANISATION
 * AND the current form status is PENDING_ASSOCIATION
 *  OR the current form status is REJECTED_ASSOCIATION
 *  OR the current form status is PENDING_PAYMENT
 * AND the current user has the permission 'registration-edit-staff' for a staff
 * OR the current user has the permission 'registration-edit-athlete' for an athlete
 */
export const canEditForm = ({
  key,
  userType,
  registrationPermissions,
  registrationSystemStatus,
}: {
  key: string,
  userType: UserType,
  registrationPermissions: RegistrationPermissions,
  registrationSystemStatus: RegistrationSystemStatus,
}): boolean => {
  if (
    [ATHLETE, STAFF].includes(userType) &&
    [
      RegistrationStatusEnum.REJECTED_ASSOCIATION,
      RegistrationStatusEnum.REJECTED_ORGANISATION,
    ].includes(registrationSystemStatus.type)
  ) {
    return true;
  }

  if (
    [ORGANISATION_ADMIN].includes(userType) &&
    registrationPermissions[key].canEdit &&
    [
      RegistrationStatusEnum.PENDING_ORGANISATION,
      RegistrationStatusEnum.REJECTED_ASSOCIATION,
      RegistrationStatusEnum.REJECTED_ORGANISATION,
    ].includes(registrationSystemStatus.type)
  ) {
    return true;
  }

  if (
    [ASSOCIATION_ADMIN].includes(userType) &&
    registrationPermissions[key].canEdit &&
    [
      RegistrationStatusEnum.PENDING_ORGANISATION,
      RegistrationStatusEnum.REJECTED_ORGANISATION,
      RegistrationStatusEnum.PENDING_ASSOCIATION,
      RegistrationStatusEnum.REJECTED_ASSOCIATION,
      RegistrationStatusEnum.PENDING_PAYMENT,
    ].includes(registrationSystemStatus.type)
  ) {
    return true;
  }

  return false;
};

/**
 * A function to determine if the currently signed in user can view a
 * registration form
 * with current registration permissions
 * for the current profile with
 * the current registration form status
 *
 * @param {string} key ATHLETE | STAFF
 * @param {UserType} userType The current signed in user
 * @param {RegistrationPermissions} registrationPermissions The registration permissions module
 * @returns {boolean}
 * A registration form can be viewed
 * WHEN the current user is a STAFF
 * OR the current user is a an ATHLETE

 * A registration form can be viewed
 * WHEN the current user is an ORGANISATION_ADMIN
 *  OR the current user is an ASSOCIATION_ADMIN
 * AND the current user has the permission 'registration-view-staff' for a staff
 *  OR the current user has the permission 'registration-view-athlete' for an athlete
 * AND the current user has the permission 'registration-view-requirements'

 */
export const canViewForm = ({
  key,
  userType,
  registrationPermissions,
}: {
  key: string,
  userType: UserType,
  registrationPermissions: RegistrationPermissions,
}): boolean => {
  if ([ATHLETE, STAFF].includes(userType)) return true;
  if (
    [ORGANISATION_ADMIN].includes(userType) &&
    registrationPermissions[key].canView &&
    registrationPermissions.requirements.canView
  ) {
    return true;
  }

  if (
    [ASSOCIATION_ADMIN].includes(userType) &&
    registrationPermissions[key].canView &&
    registrationPermissions.requirements.canView
  ) {
    return true;
  }

  return false;
};

/**
 * A function to determine if the currently signed in user can approve a
 * registration form
 * with current registration permissions
 * for the current profile with
 * the current registration form status
 *
 * @param {string} key ATHLETE | STAFF
 * @param {UserType} userType The current signed in user
 * @param {RegistrationPermissions} registrationPermissions The registration permissions module
 * @param {RegistrationSystemStatus} registrationSystemStatus The current registration system status
 * @returns {boolean}
 * A registration form cannot be approved
 * WHEN the current user is a STAFF
 *  OR the current user is a an ATHLETE

 * A registration form can be approved
 * WHEN the current user is an ORGANISATION_ADMIN
 * AND the current user has the permission 'registration-view-staff' for a staff
 *  OR the current user has the permission 'registration-view-athlete' for an athlete
 * AND the current user has the permission 'registration-view-requirements'
 * AND the current user has the permission 'registration-manage-status'
 * AND the current form status is PENDING_ORGANISATION
 *
 * A registration form can be approved
 * WHEN the current user is an ASSOCIATION_ADMIN
 * AND the current user has the permission 'registration-view-staff' for a staff
 *  OR the current user has the permission 'registration-view-athlete' for an athlete
 * AND the current user has the permission 'registration-view-requirements'
 * AND the current user has the permission 'registration-manage-status'
 * AND the current form status is PENDING_ORGANISATION
 *  OR the current form status is REJECTED_ORGANISATION
 *  OR the current form status is PENDING_ASSOCIATION
 *  OR the current form status is REJECTED_ASSOCIATION
 *  OR the current form status is PENDING_PAYMENT

 */
export const canApproveForm = ({
  key,
  userType,
  registrationPermissions,
  registrationSystemStatus,
}: {
  key: string,
  userType: UserType,
  registrationPermissions: RegistrationPermissions,
  registrationSystemStatus: RegistrationSystemStatus,
}): boolean => {
  if ([ATHLETE, STAFF].includes(userType)) {
    return false;
  }
  if (
    [ORGANISATION_ADMIN].includes(userType) &&
    registrationPermissions[key].canView &&
    registrationPermissions.requirements.canView &&
    registrationPermissions.status.canEdit &&
    [RegistrationStatusEnum.PENDING_ORGANISATION].includes(
      registrationSystemStatus.type
    )
  ) {
    return true;
  }

  if (
    [ASSOCIATION_ADMIN].includes(userType) &&
    registrationPermissions[key].canView &&
    registrationPermissions.requirements.canView &&
    registrationPermissions.status.canEdit &&
    [
      RegistrationStatusEnum.PENDING_ORGANISATION,
      RegistrationStatusEnum.REJECTED_ORGANISATION,
      RegistrationStatusEnum.PENDING_ASSOCIATION,
      RegistrationStatusEnum.REJECTED_ASSOCIATION,
      RegistrationStatusEnum.PENDING_PAYMENT,
      RegistrationStatusEnum.APPROVED,
    ].includes(registrationSystemStatus.type)
  ) {
    return true;
  }

  return false;
};

/**
 * A function to determine if the currently signed in user can edit a section
 *
 * @param {UserType} userType The current signed in user
 * @param {RegistrationSystemStatus} registrationSystemStatus The current registration system status
 * @returns {boolean}
 * A section form can be edited
 * WHEN the current user is a STAFF or ATHLETE
 * AND the current form status is REJECTED_ASSOCIATION
 *  OR the current form status is REJECTED_ORGANISATION
 */
export const canEditSection = ({
  registrationSystemStatus,
  isRegistrationCompletable,
}: {
  isRegistrationCompletable: boolean,
  registrationSystemStatus: RegistrationSystemStatus,
}): boolean => {
  if (
    isRegistrationCompletable &&
    [
      RegistrationStatusEnum.REJECTED_ASSOCIATION,
      RegistrationStatusEnum.REJECTED_ORGANISATION,
    ].includes(registrationSystemStatus.type)
  ) {
    return true;
  }
  // TODO: Permissions will need to be factored here when MLS come onboard

  return false;
};

/**
 * A function to determine if the currently signed in user can view a section
 *
 * @param {UserType} userType The current signed in user
 * @param {registrationPermissions} RegistrationPermissions ATHLETE | STAFF
 * @param {RegistrationSystemStatus} registrationSystemStatus The current registration system status
 * @returns {boolean}
 * A section form can be viewed
 * WHEN the current user is a STAFF or ATHLETE
 * AND the current form status is not INCOMPLETE
 *  OR the current form status is not APPROVED
 *
 * A section form can be viewed
 * WHEN the current user is a ORGANISATION_ADMIN or ASSOCIATION_ADMIN
 *  AND the current user has the permission 'registration-view-staff' for a staff
 *  OR the current user has the permission 'registration-view-athlete' for an athlete
 * AND the current form status is not INCOMPLETE
 *  OR the current form status is not APPROVED
 */
export const canViewSection = ({
  userType,
  registrationPermissions,
  registrationSystemStatus,
}: {
  userType: UserType,
  registrationPermissions: RegistrationPermissions,
  registrationSystemStatus: RegistrationSystemStatus,
}): boolean => {
  if (
    [ATHLETE, STAFF].includes(userType) &&
    [
      RegistrationStatusEnum.PENDING_ASSOCIATION,
      RegistrationStatusEnum.PENDING_ORGANISATION,
      RegistrationStatusEnum.PENDING_PAYMENT,
      RegistrationStatusEnum.REJECTED_ASSOCIATION,
      RegistrationStatusEnum.REJECTED_ORGANISATION,
    ].includes(registrationSystemStatus.type)
  ) {
    return true;
  }
  if (
    [ORGANISATION_ADMIN, ASSOCIATION_ADMIN].includes(userType) &&
    (registrationPermissions?.staff?.canView ||
      registrationPermissions?.athlete?.canView) &&
    [
      RegistrationStatusEnum.PENDING_ASSOCIATION,
      RegistrationStatusEnum.PENDING_ORGANISATION,
      RegistrationStatusEnum.PENDING_PAYMENT,
      RegistrationStatusEnum.REJECTED_ASSOCIATION,
      RegistrationStatusEnum.REJECTED_ORGANISATION,
    ].includes(registrationSystemStatus.type)
  ) {
    return true;
  }
  return false;
};

/**
 * A function to determine if the currently signed in user can approve a
 * requirement
 * with current registration permissions
 * for the current profile with
 * the current requirement form
 *
 * @param {string} key ATHLETE | STAFF
 * @param {UserType} userType The current signed in user
 * @param {RegistrationPermissions} registrationPermissions The registration permissions module
 * @param {RegistrationSystemStatus} registrationSystemStatus The current registration system status
 * @returns {boolean}
 * A requirement cannot be approved
 * WHEN the current user is a STAFF
 *  OR the current user is a an ATHLETE

 * A requirement can be approved
 * WHEN the current user is an ORGANISATION_ADMIN
 * AND the current user has the permission 'registration-view-staff' for a staff
 *  OR the current user has the permission 'registration-view-athlete' for an athlete
 * AND the current user has the permission 'registration-view-requirements'
 * AND the current user has the permission 'registration-manage-status'
 * AND the current requirement status is PENDING_ORGANISATION
 *
 * A requirement can be approved
 * WHEN the current user is an ASSOCIATION_ADMIN
 * AND the current user has the permission 'registration-view-staff' for a staff
 *  OR the current user has the permission 'registration-view-athlete' for an athlete
 * AND the current user has the permission 'registration-view-requirements'
 * AND the current user has the permission 'registration-manage-status'
 */
export const canApproveRequirement = ({
  key,
  userType,
  registrationPermissions,
  registrationSystemStatus,
}: {
  key: string,
  userType: UserType,
  registrationPermissions: RegistrationPermissions,
  registrationSystemStatus: RegistrationSystemStatus,
}): boolean => {
  if ([ATHLETE, STAFF].includes(userType)) {
    return false;
  }
  if (
    [ORGANISATION_ADMIN].includes(userType) &&
    registrationPermissions[key].canView &&
    registrationPermissions.requirements.canView &&
    registrationPermissions.status.canEdit &&
    [
      RegistrationStatusEnum.PENDING_ORGANISATION,
      RegistrationStatusEnum.REJECTED_ASSOCIATION,
      RegistrationStatusEnum.REJECTED_ORGANISATION,
    ].includes(registrationSystemStatus.type)
  ) {
    return true;
  }

  if (
    [ASSOCIATION_ADMIN].includes(userType) &&
    registrationPermissions[key].canView &&
    registrationPermissions.requirements.canView &&
    registrationPermissions.status.canEdit
  ) {
    return true;
  }

  return false;
};
