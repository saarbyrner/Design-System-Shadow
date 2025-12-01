// @flow
export type TreatmentPermissions = {
  canView: boolean,
  canCreate: boolean,
  canEdit: boolean,
};

export type TUEPermissions = {
  canCreate: boolean,
  canView: boolean,
};

export type AthletePermissions = {
  canView: boolean,
};

export type DiagnosticsPermissions = {
  canView: boolean,
  canCreate: boolean,
  canEdit: boolean,
  canArchive: boolean,
};

export type AllergiesPermissions = {
  canView: boolean,
  canViewNewAllergy: boolean,
  canCreate: boolean,
  canCreateNewAllergy: boolean,
  canArchive: boolean,
  canEdit: boolean,
};

export type AlertsPermissions = {
  canView: boolean,
  canCreate: boolean,
  canArchive: boolean,
  canEdit: boolean,
};

export type ProceduresPermissions = {
  canView: boolean,
  canCreate: boolean,
  canEdit: boolean,
  canArchive: boolean,
};

export type DocumentsPermissions = {
  canView: boolean,
  canCreate: boolean,
  canArchive: boolean,
  canEdit: boolean,
};

export type VaccinationsPermissions = {
  canCreate: boolean,
  canView: boolean,
};

export type ModificationsPermissions = {
  canCreate: boolean,
  canView: boolean,
  canEdit: boolean,
};

export type NotesPermissions = {
  canView: boolean,
  canCreate: boolean,
  canEdit: boolean,
  canArchive: boolean,
};

export type PrivateNotesPermissions = {
  canCreate: boolean,
  canAdmin: boolean,
};

export type IssuesPermissions = {
  canView: boolean,
  canEdit: boolean,
  canCreate: boolean,
  canExport: boolean,
  canArchive: boolean,
};

export type AvailabilityPermissions = {
  canView: boolean,
  canEdit: boolean,
};

export type FormsPermissions = {
  canView: boolean,
  canEdit: boolean,
  canCreate: boolean,
  canExport: boolean,
};

export type WorkersCompPermissions = {
  canView: boolean,
  canEdit: boolean,
};

export type OshaPermissions = {
  canView: boolean,
  canEdit: boolean,
};

export type StockManagementPermissions = {
  canView: boolean,
  canAdd: boolean,
  canDispense: boolean,
  canRemove: boolean,
};

export type MedicationsPermissions = {
  canView: boolean,
  canLog: boolean,
  canArchive: boolean,
  canEdit: boolean,
  canAdmin: boolean,
};

export type AttachmentsPermissions = {
  canRemove: boolean,
};

export type InjuryStatusPermissions = {
  canDelete: boolean,
};

export type MedicalGraphing = {
  canView: boolean,
};

export type StaffDevelopment = {
  canView: boolean,
};

export type MedicalPermissions = {
  tue: TUEPermissions,
  treatments: TreatmentPermissions,
  diagnostics: DiagnosticsPermissions,
  allergies: AllergiesPermissions,
  alerts: AlertsPermissions,
  vaccinations: VaccinationsPermissions,
  modifications: ModificationsPermissions,
  notes: NotesPermissions,
  privateNotes: PrivateNotesPermissions,
  procedures: ProceduresPermissions,
  issues: IssuesPermissions,
  availability: AvailabilityPermissions,
  forms: FormsPermissions,
  athletes: AthletePermissions,
  workersComp: WorkersCompPermissions,
  documents: DocumentsPermissions,
  osha: OshaPermissions,
  stockManagement: StockManagementPermissions,
  attachments: AttachmentsPermissions,
  injuryStatus: InjuryStatusPermissions,
  medicalGraphing: MedicalGraphing,
  medications: MedicationsPermissions,
};
