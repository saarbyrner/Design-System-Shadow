// @flow
import type { GeneralPermissions } from './types';

export const defaultGeneralPermissions: GeneralPermissions = {
  pastAthletes: {
    canView: false,
  },
  tryoutAthletes: {
    canView: false,
  },
  inactiveAthletes: {
    canView: false,
  },
  athletesArea: {
    canView: false,
  },
  ancillaryRange: {
    canManage: false,
    canCreate: false,
  },
  canManageAbsence: false,
  canViewProtectedMetrics: false,
  canViewDashboard: false,
  canManageDashboard: false,
};

export const setGeneralPermissions = (
  generalPermissions: ?Array<string>
): GeneralPermissions => {
  return {
    pastAthletes: {
      canView: generalPermissions?.includes('view-past-athletes') || false,
    },
    tryoutAthletes: {
      canView: generalPermissions?.includes('view-tryout-athletes') || false,
    },
    inactiveAthletes: {
      canView: generalPermissions?.includes('view-inactive-athletes') || false,
    },
    athletesArea: {
      canView: generalPermissions?.includes('view-athletes-area') || false,
    },
    ancillaryRange: {
      canManage:
        generalPermissions?.includes('manage-ancillary-date-ranges') || false,
      canCreate: generalPermissions?.includes('add-ancillary-data') || false,
    },
    canManageAbsence: generalPermissions?.includes('manage-absence') || false,
    canViewProtectedMetrics:
      generalPermissions?.includes('view-protected-metrics') || false,
    canViewDashboard: generalPermissions?.includes('view-dashboard') || false,
    canManageDashboard:
      generalPermissions?.includes('manage-dashboard') || false,
  };
};
