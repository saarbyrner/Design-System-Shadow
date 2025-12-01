// @flow
import type { MatchMonitorPermissions } from './types';

export const defaultMatchMonitorPermissions: MatchMonitorPermissions = {
  viewMatchMonitorReport: false,
  manageMatchMonitorReport: false,
  matchMonitorReportExport: false,
};

export const setMatchMonitorPermissions = (
  matchMonitorPermissions: ?Array<string>
): MatchMonitorPermissions => {
  return {
    viewMatchMonitorReport:
      matchMonitorPermissions?.includes('view-match-monitor-report') || false,
    manageMatchMonitorReport:
      matchMonitorPermissions?.includes('manage-match-monitor-report') || false,
    matchMonitorReportExport:
      matchMonitorPermissions?.includes('match-monitor-report-export') || false,
  };
};
