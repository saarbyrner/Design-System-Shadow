// @flow
import type { CurrentUserData } from '@kitman/services/src/services/getCurrentUser';
import type { Organisation } from '@kitman/services/src/services/getOrganisation';
import type { Squad } from '@kitman/services/src/services/getSquads';

import type { UserType } from '@kitman/modules/src/LeagueOperations/shared/types/common';
import type {
  RegistrationPermissions,
  DisciplinePermissions,
  HomegrownPermissions,
} from '@kitman/modules/src/LeagueOperations/shared/types/permissions';

import { createSelector } from '@reduxjs/toolkit';

import {
  getPermissionsResult,
  getCurrentUserResult,
  getOrganisationResult,
  getGetActiveSquadResult,
} from '@kitman/common/src/redux/global/selectors';

import {
  REGISTRATION_PERMISSION_GROUP,
  ATHLETE,
  DISCIPLINE_PERMISSION_GROUP,
  REGISTRATION_HOMEGROWN_GROUP,
} from '@kitman/modules/src/LeagueOperations/shared/consts';

/**
 *
 * @returns CurrentUserData
 */
export const getCurrentUser = (): CurrentUserData =>
  createSelector([getCurrentUserResult], (currentUser) => {
    return currentUser?.data;
  });

/**
 *
 * @returns Organisation
 */
export const getCurrentOrganisation = (): Organisation =>
  createSelector([getOrganisationResult], (organisation) => {
    return organisation?.data;
  });

/**
 *
 * @returns Squad
 */
export const getCurrentSquad = (): Squad =>
  createSelector([getGetActiveSquadResult], (activeSquad) => {
    return activeSquad.data;
  });

/**
 * Returns the permissions specific to the registration permission module
 *
 * @returns RegistrationPermissions
 */
export const getRegistrationPermissions = (): RegistrationPermissions =>
  createSelector(
    [getPermissionsResult],
    (permissions) => permissions?.data?.[REGISTRATION_PERMISSION_GROUP] || {}
  );

/**
 * Returns the currently signed in user type for areas under League Operations remit
 * This relies on the registration property being present on the current user
 * The BE will only send this data if the registration module is enabled.
 *
 * @returns UserType
 */
export const getRegistrationUserTypeFactory = (): UserType =>
  createSelector([getCurrentUserResult], (currentUser) => {
    return currentUser?.data?.registration?.user_type || ATHLETE;
  });

/**
 * Returns the permissions specific to the discipline permission module
 *
 * @returns DisciplinePermissions
 */
export const getDisciplinePermissions = (): DisciplinePermissions =>
  createSelector(
    [getPermissionsResult],
    (permissions) => permissions?.data?.[DISCIPLINE_PERMISSION_GROUP] || {}
  );

/**
 * Returns the permissions specific to the homegrown permission module
 *
 * @returns HomegrownPermissions
 */
export const getHomegrownPermissions = (): HomegrownPermissions =>
  createSelector(
    [getPermissionsResult],
    (permissions) => permissions?.data?.[REGISTRATION_HOMEGROWN_GROUP] || {}
  );
