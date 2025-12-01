// @flow
export type GeneralPermissions = {
  pastAthletes: {
    canView: boolean,
  },
  tryoutAthletes: {
    canView: boolean,
  },
  inactiveAthletes: {
    canView: boolean,
  },
  canManageAbsence: boolean,
  canViewProtectedMetrics: boolean,
  ancillaryRange: {
    canManage: boolean,
    canCreate: boolean,
  },
  canViewDashboard: boolean,
  canManageDashboard: boolean,
};
