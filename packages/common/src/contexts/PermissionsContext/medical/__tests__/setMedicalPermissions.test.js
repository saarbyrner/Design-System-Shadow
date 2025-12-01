import { setMedicalPermissions } from '../index';

describe('setMedicalPermissions', () => {
  it('should set treatments permissions to true when "treatments-admin" is present', () => {
    const medicalPermissions = setMedicalPermissions(
      null,
      ['treatments-admin'],
      null
    );
    expect(medicalPermissions.treatments.canView).toBe(true);
    expect(medicalPermissions.treatments.canCreate).toBe(true);
    expect(medicalPermissions.treatments.canEdit).toBe(true);
  });

  it('should set treatments permissions to false when "treatments-admin" is absent', () => {
    const medicalPermissions = setMedicalPermissions(null, [], null);
    expect(medicalPermissions.treatments.canView).toBe(false);
    expect(medicalPermissions.treatments.canCreate).toBe(false);
    expect(medicalPermissions.treatments.canEdit).toBe(false);
  });

  it('should not affect other permissions when treatments-admin is present', () => {
    const medicalPermissions = setMedicalPermissions(
      ['create-private-notes'],
      ['treatments-admin', 'view-medical-history', 'view-athletes'],
      ['view-athletes']
    );

    expect(medicalPermissions.treatments.canView).toBe(true);
    expect(medicalPermissions.treatments.canCreate).toBe(true);
    expect(medicalPermissions.treatments.canEdit).toBe(true);

    expect(medicalPermissions.athletes.canView).toBe(true);
    expect(medicalPermissions.notes.canView).toBe(false); // deriveMedicalNotePermissions does not include medical-notes-view
    expect(medicalPermissions.privateNotes.canCreate).toBe(true);
  });

  it('should handle null or undefined input arrays gracefully', () => {
    let medicalPermissions = setMedicalPermissions(
      undefined,
      undefined,
      undefined
    );
    expect(medicalPermissions.treatments.canView).toBe(false);
    expect(medicalPermissions.athletes.canView).toBe(false);
    expect(medicalPermissions.notes.canView).toBe(false);
    expect(medicalPermissions.privateNotes.canCreate).toBe(false);

    medicalPermissions = setMedicalPermissions(null, null, null);
    expect(medicalPermissions.treatments.canView).toBe(false);
    expect(medicalPermissions.athletes.canView).toBe(false);
    expect(medicalPermissions.notes.canView).toBe(false);
    expect(medicalPermissions.privateNotes.canCreate).toBe(false);
  });

  it('should correctly derive medical note permissions', () => {
    const medicalPermissions = setMedicalPermissions(
      null,
      [
        'medical-notes-view',
        'medical-notes-create',
        'medical-notes-edit',
        'medical-notes-archive',
      ],
      null
    );
    expect(medicalPermissions.notes.canView).toBe(true);
    expect(medicalPermissions.notes.canCreate).toBe(true);
    expect(medicalPermissions.notes.canEdit).toBe(true);
    expect(medicalPermissions.notes.canArchive).toBe(true);
  });

  it('should correctly derive medical note permissions when absent', () => {
    const medicalPermissions = setMedicalPermissions(null, [], null);
    expect(medicalPermissions.notes.canView).toBe(false);
    expect(medicalPermissions.notes.canCreate).toBe(false);
    expect(medicalPermissions.notes.canEdit).toBe(false);
    expect(medicalPermissions.notes.canArchive).toBe(false);
  });
});
