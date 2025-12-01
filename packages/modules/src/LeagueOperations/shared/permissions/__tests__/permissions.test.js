import {
  setRegistrationPermissions,
  defaultRegistrationPermissions,
  setDisciplinePermissions,
  defaultDisciplinePermissions,
} from '..';

describe('Registration Permissions', () => {
  describe('defaultRegistrationPermissions', () => {
    it('has the correct default permissions for registration module', () => {
      expect(defaultRegistrationPermissions).toEqual({
        registrationArea: { canView: false },
        organisation: { canView: false },
        athlete: {
          canCreate: false,
          canView: false,
          canEdit: false,
        },
        staff: { canCreate: false, canView: false, canEdit: false },
        requirements: { canView: false },
        status: { canEdit: false, expire: false, canManageUnapprove: false },
        payment: {
          canCreate: false,
          canEdit: false,
          canView: false,
          canExportPayment: false,
        },
      });
    });
  });
  describe('setRegistrationPermissions', () => {
    it('returns the correct default permissions for registration module', () => {
      const result = setRegistrationPermissions();
      expect(result).toEqual(defaultRegistrationPermissions);
    });

    it('returns the correct permissions when registration-area-view', () => {
      const result = setRegistrationPermissions(['registration-area-view']);
      expect(result.registrationArea.canView).toEqual(true);
    });

    it('returns the correct permissions when registration-view-organisation', () => {
      const result = setRegistrationPermissions([
        'registration-view-organisation',
      ]);
      expect(result.organisation.canView).toEqual(true);
    });

    it('returns the correct permissions when registration-view-athlete', () => {
      const result = setRegistrationPermissions(['registration-view-athlete']);
      expect(result.athlete.canView).toEqual(true);
    });

    it('returns the correct permissions when registration-edit-athlete', () => {
      const result = setRegistrationPermissions(['registration-edit-athlete']);
      expect(result.athlete.canEdit).toEqual(true);
    });
    it('returns the correct permissions when registration-create-athlete', () => {
      const result = setRegistrationPermissions([
        'registration-create-athlete',
      ]);
      expect(result.athlete.canCreate).toEqual(true);
    });
    it('returns the correct permissions when registration-view-staff', () => {
      const result = setRegistrationPermissions(['registration-view-staff']);
      expect(result.staff.canView).toEqual(true);
    });
    it('returns the correct permissions when registration-edit-staff', () => {
      const result = setRegistrationPermissions(['registration-edit-staff']);
      expect(result.staff.canEdit).toEqual(true);
    });
    it('returns the correct permissions when registration-create-staff', () => {
      const result = setRegistrationPermissions(['registration-create-staff']);
      expect(result.staff.canCreate).toEqual(true);
    });
    it('returns the correct permissions when registration-view-requirements', () => {
      const result = setRegistrationPermissions([
        'registration-view-requirements',
      ]);
      expect(result.requirements.canView).toEqual(true);
    });

    it('returns the correct default permissions when registration-manage-status', () => {
      const result = setRegistrationPermissions(['registration-manage-status']);
      expect(result.status.canEdit).toEqual(true);
    });

    it('returns the correct permissions when registration-expire', () => {
      const result = setRegistrationPermissions(['registration-expire']);
      expect(result.status.expire).toEqual(true);
    });

    it('returns the correct permissions when registration-view-payment', () => {
      const result = setRegistrationPermissions(['registration-view-payment']);
      expect(result.payment.canView).toEqual(true);
    });
    it('returns the correct permissions when registration-manage-payment', () => {
      const result = setRegistrationPermissions([
        'registration-manage-payment',
      ]);
      expect(result.payment.canEdit).toEqual(true);
    });
    it('returns the correct permissions when registration-payment-authorisation', () => {
      const result = setRegistrationPermissions([
        'registration-payment-authorisation',
      ]);
      expect(result.payment.canCreate).toEqual(true);
    });
    it('returns the correct permissions when payment-export', () => {
      const result = setRegistrationPermissions(['payment-export']);
      expect(result.payment.canExportPayment).toEqual(true);
    });
  });
});

describe('Discipline Permissions', () => {
  describe('defaultDisciplinePermissions', () => {
    it('has the correct default permissions for discipline module', () => {
      expect(defaultDisciplinePermissions).toEqual({
        canViewDisciplineArea: false,
        canViewDisciplineStaff: false,
        canViewDisciplineAthlete: false,
        canManageDiscipline: false,
      });
    });
    it('returns the correct permissions when discipline-area-view', () => {
      const result = setDisciplinePermissions(['discipline-area-view']);
      expect(result.canViewDisciplineArea).toEqual(true);
    });
    it('returns the correct permissions when discipline-view-staff', () => {
      const result = setDisciplinePermissions(['discipline-view-staff']);
      expect(result.canViewDisciplineStaff).toEqual(true);
    });
    it('returns the correct permissions when discipline-view-athlete', () => {
      const result = setDisciplinePermissions(['discipline-view-athlete']);
      expect(result.canViewDisciplineAthlete).toEqual(true);
    });
    it('returns the correct permissions when discipline-manage', () => {
      const result = setDisciplinePermissions(['discipline-manage']);
      expect(result.canManageDiscipline).toEqual(true);
    });
  });
});
