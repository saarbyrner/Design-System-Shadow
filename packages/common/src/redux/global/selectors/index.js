// @flow
import { createSelector } from '@reduxjs/toolkit';

import { globalApi } from '../services/globalApi';

export const getGetActiveSquadResult =
  globalApi.endpoints.getActiveSquad.select();

export const getOrganisationResult =
  globalApi.endpoints.getOrganisation.select();

export const getPermissionsResult = globalApi.endpoints.getPermissions.select();

export const getCurrentUserResult = globalApi.endpoints.getCurrentUser.select();

export const getOrganisation = () =>
  createSelector([getOrganisationResult], (organisation) => organisation.data);

export const getPermissions = () =>
  createSelector([getPermissionsResult], (permissions) => permissions.data);

export const getCurrentUser = () =>
  createSelector([getCurrentUserResult], (currentUser) => currentUser.data);

export const getPermissionGroupFactory = (key: string) =>
  createSelector(
    [getPermissionsResult],
    (permissions) => permissions?.data?.[key] || {}
  );

export const getActiveSquad = () =>
  createSelector([getGetActiveSquadResult], (activeSquad) => activeSquad.data);
