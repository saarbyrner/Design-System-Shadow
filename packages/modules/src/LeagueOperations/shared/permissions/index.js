// @flow
import type {
  RegistrationPermissions,
  DisciplinePermissions,
} from '@kitman/modules/src/LeagueOperations/shared/types/permissions';

export const defaultRegistrationPermissions: RegistrationPermissions = {
  registrationArea: { canView: false },
  organisation: { canView: false },
  athlete: {
    canView: false,
    canEdit: false,
    canCreate: false,
  },
  staff: { canView: false, canEdit: false, canCreate: false },
  requirements: { canView: false },
  status: { canEdit: false, expire: false, canManageUnapprove: false },
  payment: {
    canView: false,
    canEdit: false,
    canCreate: false,
    canExportPayment: false,
  },
};

export const setRegistrationPermissions = (
  registration: ?Array<string>
): RegistrationPermissions => {
  return {
    registrationArea: {
      canView: registration?.includes('registration-area-view') || false,
    },
    organisation: {
      canView:
        registration?.includes('registration-view-organisation') || false,
    },
    athlete: {
      canView: registration?.includes('registration-view-athlete') || false,
      canEdit: registration?.includes('registration-edit-athlete') || false,
      canCreate: registration?.includes('registration-create-athlete') || false,
    },
    staff: {
      canView: registration?.includes('registration-view-staff') || false,
      canEdit: registration?.includes('registration-edit-staff') || false,
      canCreate: registration?.includes('registration-create-staff') || false,
    },
    requirements: {
      canView:
        registration?.includes('registration-view-requirements') || false,
    },
    status: {
      canEdit: registration?.includes('registration-manage-status') || false,
      expire: registration?.includes('registration-expire') || false,
      canManageUnapprove:
        registration?.includes('registration-manage-unapprove-status') || false,
    },
    payment: {
      canView: registration?.includes('registration-view-payment') || false,
      canEdit: registration?.includes('registration-manage-payment') || false,
      canCreate:
        registration?.includes('registration-payment-authorisation') || false,
      canExportPayment: registration?.includes('payment-export') || false,
    },
  };
};

export const defaultDisciplinePermissions: DisciplinePermissions = {
  canViewDisciplineArea: false,
  canViewDisciplineStaff: false,
  canViewDisciplineAthlete: false,
  canManageDiscipline: false,
};

export const setDisciplinePermissions = (
  discipline: ?Array<string>
): DisciplinePermissions => {
  return {
    canViewDisciplineArea:
      discipline?.includes('discipline-area-view') || false,
    canViewDisciplineStaff:
      discipline?.includes('discipline-view-staff') || false,
    canViewDisciplineAthlete:
      discipline?.includes('discipline-view-athlete') || false,
    canManageDiscipline: discipline?.includes('discipline-manage') || false,
  };
};
