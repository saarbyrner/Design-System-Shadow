// @flow
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import { DelayedLoadingFeedback } from '@kitman/components';
import {
  isMedicalSummary,
  isDevelopmentJourney,
  isCoachingSummary,
  isGrowthAndMaturationReport,
  isStaffDevelopment,
} from './utils';

import { DashboardTranslated as Dashboard } from './components/Dashboard';

function TemplateDashboards() {
  const locationAssign = useLocationAssign();
  const { permissions, permissionsRequestStatus } = usePermissions();

  const isMedicalGraphingPermission =
    permissions?.medical?.medicalGraphing?.canView &&
    permissions?.analysis?.medicalSummary?.canView;

  const isStaffDevelopmentPermission =
    permissions?.analysis?.staffDevelopment?.canView;

  const isCoachingSummaryPermission =
    permissions?.analysis?.coachingSummary?.canView;

  const isDevelopmentJourneyPermission =
    permissions?.analysis?.developmentJourney?.canView;

  const isGrowthAndMaturationReportPermission =
    permissions?.analysis?.growthAndMaturationReportArea?.canView;

  if (permissionsRequestStatus === 'PENDING') {
    return <DelayedLoadingFeedback />;
  }

  if (
    isMedicalSummary() &&
    window.getFlag('rep-show-medical-summary') &&
    isMedicalGraphingPermission
  ) {
    return <Dashboard />;
  }

  if (
    isCoachingSummary() &&
    window.getFlag('rep-show-coaching-summary') &&
    isCoachingSummaryPermission
  ) {
    return <Dashboard isTabFormat />;
  }

  if (
    isStaffDevelopment() &&
    window.getFlag('rep-show-staff-development') &&
    isStaffDevelopmentPermission
  ) {
    return <Dashboard />;
  }

  if (
    isDevelopmentJourney() &&
    window.getFlag('rep-show-development-journey') &&
    isDevelopmentJourneyPermission
  ) {
    return <Dashboard />;
  }

  if (
    isGrowthAndMaturationReport() &&
    window.getFlag('rep-show-growth-and-maturation-report') &&
    isGrowthAndMaturationReportPermission
  ) {
    return <Dashboard />;
  }

  // reroute to home_dashboards if user does not have access to dashboard
  locationAssign('/home_dashboards');
  return null;
}

export default TemplateDashboards;
