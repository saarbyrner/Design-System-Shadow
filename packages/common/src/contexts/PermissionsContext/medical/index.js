// @flow
export const defaultMedicalPermissions = {
  tue: {
    canCreate: false,
    canView: false,
  },
  athletes: {
    canView: false,
  },
  treatments: {
    canCreate: false,
    canView: false,
    canEdit: false,
  },
  diagnostics: {
    canCreate: false,
    canView: false,
    canEdit: false,
    canArchive: false,
  },
  allergies: {
    canCreate: false,
    canView: false,
    canCreateNewAllergy: false,
    canViewNewAllergy: false,
    canArchive: false,
    canEdit: false,
  },
  alerts: {
    canCreate: false,
    canView: false,
    canArchive: false,
    canEdit: false,
  },
  vaccinations: {
    canCreate: false,
    canView: false,
  },
  modifications: {
    canCreate: false,
    canView: false,
    canEdit: false,
  },
  notes: {
    canView: false,
    canCreate: false,
    canEdit: false,
    canArchive: false,
  },
  privateNotes: {
    canCreate: false,
    canAdmin: false,
  },
  procedures: {
    canView: false,
    canCreate: false,
    canEdit: false,
    canArchive: false,
  },
  availability: {
    canView: false,
    canEdit: false,
  },
  issues: {
    canView: false,
    canCreate: false,
    canEdit: false,
    canExport: false,
    canArchive: false,
  },
  forms: {
    canView: false,
    canCreate: false,
    canEdit: false,
    canExport: false,
  },
  workersComp: {
    canView: false,
    canEdit: false,
  },
  documents: {
    canView: false,
    canCreate: false,
    canArchive: false,
    canEdit: false,
  },
  osha: {
    canView: false,
    canEdit: false,
  },
  stockManagement: {
    canView: false,
    canAdd: false,
    canDispense: false,
    canRemove: false,
  },
  attachments: {
    canRemove: false,
  },
  injuryStatus: {
    canDelete: false,
  },
  medicalGraphing: {
    canView: false,
  },
  medications: {
    canView: false,
    canLog: false,
    canArchive: false,
    canEdit: false,
    canAdmin: false,
  },
};

// Medical notes are being migrated to stop piggybacking on the issues-admin and notes permissions
// This will require an update to users in the BE and an update to features in the FE
// To prevent users from being cut off from features, this conditional is introduced and will be removed when the BE is live
const deriveMedicalNotePermissions = (medical: ?Array<string>) => {
  return {
    canView: medical?.includes('medical-notes-view') || false,
    canCreate: medical?.includes('medical-notes-create') || false,
    canEdit: medical?.includes('medical-notes-edit') || false,
    canArchive: medical?.includes('medical-notes-archive') || false,
  };
};

export const setMedicalPermissions = (
  notes: ?Array<string>,
  medical: ?Array<string>,
  general: ?Array<string>
) => {
  return {
    athletes: {
      canView: general?.includes('view-athletes') || false,
    },
    tue: {
      canView:
        medical?.includes('view-medical-history') ||
        medical?.includes('view-tue') ||
        false,
      canCreate:
        medical?.includes('issues-admin') ||
        medical?.includes('create-tue') ||
        false,
    },
    treatments: {
      canView: medical?.includes('treatments-admin') || false,
      canCreate: medical?.includes('treatments-admin') || false,
      canEdit: medical?.includes('treatments-admin') || false,
    },
    diagnostics: {
      canCreate:
        (medical?.includes('diagnostic-admin') &&
          medical?.includes('issues-view')) ||
        false,
      canView: medical?.includes('view-medical-history') || false,
      canEdit: medical?.includes('diagnostic-admin') || false,
      canArchive: medical?.includes('archive-diagnostic') || false,
    },
    allergies: {
      canCreate:
        medical?.includes('issues-admin') ||
        medical?.includes('create-allergy') ||
        false,
      canView:
        medical?.includes('view-medical-history') ||
        medical?.includes('view-allergy') ||
        false,
      canCreateNewAllergy: medical?.includes('create-allergy') || false,
      canViewNewAllergy: medical?.includes('view-allergy') || false,
      canArchive: medical?.includes('archive-allergy') || false,
      canEdit: medical?.includes('edit-allergy') || false,
    },
    alerts: {
      canCreate: medical?.includes('create-medical-alerts') || false,
      canView: medical?.includes('view-medical-alerts') || false,
      canArchive: medical?.includes('archive-medical-alerts') || false,
      canEdit: medical?.includes('edit-medical-alerts') || false,
    },
    vaccinations: {
      canView:
        medical?.includes('view-medical-history') ||
        medical?.includes('view-vaccinations') ||
        false,
      canCreate:
        medical?.includes('issues-admin') ||
        medical?.includes('create-vaccinations') ||
        false,
    },
    modifications: {
      canCreate: medical?.includes('create-modifications') || false,
      canView: medical?.includes('view-modifications') || false,
      canEdit: medical?.includes('edit-modifications') || false,
    },
    notes: {
      ...deriveMedicalNotePermissions(medical),
    },
    privateNotes: {
      canCreate: notes?.includes('create-private-notes') || false,
      canAdmin: notes?.includes('private-notes-admin') || false,
    },
    procedures: {
      canView: medical?.includes('view-procedure') || false,
      canCreate: medical?.includes('create-procedure') || false,
      canEdit: medical?.includes('edit-procedure') || false,
      canArchive: medical?.includes('archive-procedure') || false,
    },
    availability: {
      canView: medical?.includes('availability-view') || false,
      canEdit: medical?.includes('availability-admin') || false,
    },
    issues: {
      canView: medical?.includes('issues-view') || false,
      canEdit: medical?.includes('issues-admin') || false,
      canCreate: medical?.includes('issues-admin') || false,
      canExport: medical?.includes('export-medical-data') || false,
      canArchive: medical?.includes('archive-issue') || false,
    },
    forms: {
      canView: medical?.includes('view-medical-forms') || false,
      canEdit: medical?.includes('edit-medical-forms') || false,
      canCreate: medical?.includes('create-medical-forms') || false,
      canExport: medical?.includes('export-medical-forms') || false,
    },
    workersComp: {
      canView: medical?.includes('view-workers-comp') || false,
      canEdit: medical?.includes('manage-workers-comp') || false,
    },
    documents: {
      canView: medical?.includes('medical-documents-view') || false,
      canCreate: medical?.includes('medical-documents-create') || false,
      canArchive: medical?.includes('medical-documents-archive') || false,
      canEdit: medical?.includes('medical-documents-edit') || false,
    },
    osha: {
      canView: medical?.includes('view-osha') || false,
      canEdit: medical?.includes('manage-osha') || false,
    },
    stockManagement: {
      canView: medical?.includes('view-stock') || false,
      canAdd: medical?.includes('add-stock') || false,
      canDispense: medical?.includes('dispense-stock') || false,
      canRemove: medical?.includes('remove-stock') || false,
    },
    attachments: {
      canRemove: medical?.includes('delete-attachment') || false,
    },
    injuryStatus: {
      canDelete: medical?.includes('delete-injury-status') || false,
    },
    medicalGraphing: {
      canView: medical?.includes('medical-graphing') || false,
    },
    medications: {
      canView: medical?.includes('view-medications') || false,
      canLog: medical?.includes('log-medication') || false,
      canArchive: medical?.includes('archive-medication') || false,
      canEdit: medical?.includes('edit-medication') || false,
      canAdmin: medical?.includes('medications-admin') || false,
    },
  };
};
