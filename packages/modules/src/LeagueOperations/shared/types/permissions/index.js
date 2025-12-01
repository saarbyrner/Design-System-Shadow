// @flow

export type OrganisationPermissions = {
  canView: boolean,
};

export type AthletePermissions = {
  canView: boolean,
  canEdit: boolean,
  canCreate: boolean,
};

export type StaffPermissions = {
  canView: boolean,
  canEdit: boolean,
  canCreate: boolean,
};

export type RequirementsPermissions = {
  canView: boolean,
};

export type StatusPermissions = {
  canEdit: boolean,
  canManageUnapprove: boolean,
  expire: boolean,
};

export type RegistrationAreaPermissions = {
  canView: boolean,
};

export type PaymentPermissions = {
  canView: boolean,
  canEdit: boolean,
  canCreate: boolean,
  canExportPayment: boolean,
};

export type RegistrationPermissions = {
  organisation: OrganisationPermissions,
  athlete: AthletePermissions,
  staff: StaffPermissions,
  requirements: RequirementsPermissions,
  status: StatusPermissions,
  registrationArea: RegistrationAreaPermissions,
  payment: PaymentPermissions,
};

export type DisciplinePermissions = {
  canViewDisciplineArea: boolean,
  canViewDisciplineStaff: boolean,
  canViewDisciplineAthlete: boolean,
  canManageDiscipline: boolean,
};

export type HomegrownPermissions = {
  canManageHomegrown: boolean,
  canViewHomegrown: boolean,
  canExportHomegrown: boolean,
};
