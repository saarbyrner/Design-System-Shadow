// @flow
export const defaultAnalysisPermissions = {
  staffDevelopment: {
    canView: false,
  },
  coachingSummary: {
    canView: false,
  },
  developmentJourney: {
    canView: false,
  },
  medicalSummary: {
    canView: false,
  },
  labelsAndGroups: {
    canReport: false,
  },
  historicReporting: {
    canReport: false,
  },
  benchmarkReport: {
    canView: false,
  },
  benchmarkValidation: {
    canManage: false,
  },
  growthAndMaturationImportArea: {
    canView: false,
  },
  growthAndMaturationReportArea: {
    canView: false,
  },
  benchmarkingTestingImportArea: {
    canView: false,
  },
  powerBiReports: {
    canView: false,
  },
  lookerDashboardGroup: {
    canView: false,
    canCreate: false,
  },
};

export const setAnalysisPermissions = (analysis: ?Array<string>) => {
  return {
    staffDevelopment: {
      canView: analysis?.includes('view-staff-development-dashboard') || false,
    },
    coachingSummary: {
      canView: analysis?.includes('view-coaching-summary-dashboard') || false,
    },
    developmentJourney: {
      canView:
        analysis?.includes('view-development-journey-dashboard') || false,
    },
    medicalSummary: {
      canView: analysis?.includes('view-medical-summary-dashboard') || false,
    },
    labelsAndGroups: {
      canReport: analysis?.includes('report-on-labels-and-groups') || false,
    },
    historicReporting: {
      canReport: analysis?.includes('enable-historic-reporting') || false,
    },
    benchmarkReport: {
      canView: analysis?.includes('view-benchmark-testing-report') || false,
    },
    benchmarkValidation: {
      canManage:
        analysis?.includes('manage-benchmark-testing-validation') || false,
    },
    growthAndMaturationImportArea: {
      canView:
        analysis?.includes('view-growth-and-maturation-import-area') || false,
    },
    growthAndMaturationReportArea: {
      canView: analysis?.includes('view-growth-maturation-report') || false,
    },
    benchmarkingTestingImportArea: {
      canView:
        analysis?.includes('view-benchmarking-testing-import-area') || false,
    },
    powerBiReports: {
      canView: analysis?.includes('power-bi-reports') || false,
    },
    lookerDashboardGroup: {
      canView: analysis?.includes('view-nextgen-reporting') || false,
      canCreate: analysis?.includes('create-nextgen-reporting') || false,
    },
  };
};
