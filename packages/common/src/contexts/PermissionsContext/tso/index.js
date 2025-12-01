// @flow
import type {
  TSOBasicPermission,
  TSOPermissions,
  TSOPermissionsWithManage,
} from './types';

export const basicTSOPermission: TSOBasicPermission = {
  canView: false,
};

export const defaultTSOPermissions: TSOPermissions = {
  canView: false,
  canHaveAdmin: false,
};

export const defaultTSOPermissionsWithManage: TSOPermissionsWithManage = {
  canView: false,
  canHaveAdmin: false,
  canManage: false,
};

export const setTSOVideoPermissions = (
  permissions: Array<string>
): TSOPermissions => {
  return {
    canView: permissions?.includes('tso-video-view'),
    canHaveAdmin: permissions?.includes('tso-video-admin'),
  };
};

export const setTSODocumentPermissions = (
  permissions: Array<string>
): TSOPermissions => {
  return {
    canView: permissions?.includes('tso-document-view'),
    canHaveAdmin: permissions?.includes('tso-document-admin'),
  };
};

export const setTSOEventPermissions = (
  permissions: Array<string>
): TSOPermissionsWithManage => {
  return {
    canView: permissions?.includes('tso-event-view'),
    canHaveAdmin: permissions?.includes('tso-event-admin'),
    canManage: permissions?.includes('tso-event-manage'),
  };
};

export const setTSOFixtureManagementPermissions = (
  permissions: Array<string>
): TSOBasicPermission => {
  return {
    canView: permissions?.includes('tso-fixture-league-management'),
  };
};

export const setTSOFixtureNegotiationPermissions = (
  permissions: Array<string>
): TSOBasicPermission => {
  return {
    canView: permissions?.includes('tso-fixture-club-negotiation'),
  };
};

export const setTSOJtcFixtureRequestsPermissions = (
  permissions: Array<string>
): TSOBasicPermission => {
  return {
    canView: permissions?.includes('tso-jtc-fixture-requests'),
  };
};

export const setTSOReviewsPermissions = (
  permissions: Array<string>
): TSOPermissions => {
  return {
    canView: permissions?.includes('tso-reviews-edit'),
    canHaveAdmin: permissions?.includes('tso-reviews-admin'),
  };
};

export const setTSORecruitmentPermissions = (
  permissions: Array<string>
): TSOPermissions => {
  return {
    canView:
      permissions?.includes('tso-recruitment-scout-access') ||
      permissions?.includes('tso-recruitment-only-see-own-content') ||
      permissions?.includes('tso-recruitment-sensitive-info-access'),
    canHaveAdmin: permissions?.includes('tso-recruitment-admin'),
  };
};
