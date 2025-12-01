// @flow

export type StaffDevelopment = {
  canView: boolean,
};

export type CoachingSummary = {
  canView: boolean,
};

export type DevelopmentJourney = {
  canView: boolean,
};

export type MedicalSummary = {
  canView: boolean,
};

export type LabelsAndGroups = {
  canReport: boolean,
};

export type HistoricReporting = {
  canReport: boolean,
};

export type BenchmarkReport = {
  canView: boolean,
};

export type BenchmarkValidation = {
  canManage: boolean,
};

export type GrowthAndMaturationImportArea = {
  canView: boolean,
};

export type GrowthAndMaturationReportArea = {
  canView: boolean,
};

export type BenchmarkingTestingImportArea = {
  canView: boolean,
};

export type LookerDashboardGroup = {
  canView: boolean,
  canCreate: boolean,
};

export type AnalysisPermissions = {
  staffDevelopment: StaffDevelopment,
  coachingSummary: CoachingSummary,
  developmentJourney: DevelopmentJourney,
  medicalSummary: MedicalSummary,
  labelsAndGroups: LabelsAndGroups,
  historicReporting: HistoricReporting,
  benchmarkReport: BenchmarkReport,
  benchmarkValidation: BenchmarkValidation,
  growthAndMaturationImportArea: GrowthAndMaturationImportArea,
  growthAndMaturationReportArea: GrowthAndMaturationReportArea,
  benchmarkingTestingImportArea: BenchmarkingTestingImportArea,
  lookerDashboardGroup: LookerDashboardGroup,
};
