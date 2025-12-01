/* eslint-disable jest/expect-expect */
import { waitFor } from '@testing-library/react';
import * as PermissionsContext from '@kitman/common/src/contexts/PermissionsContext';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import { DelayedLoadingFeedback } from '@kitman/components';
import * as utilFuncs from '../utils';
import TemplateDashboards from '../index';
import { DashboardTranslated as Dashboard } from '../components/Dashboard';

jest.mock('@kitman/common/src/hooks/useLocationAssign', () => jest.fn());

describe('TemplateDashboards', () => {
  const mockLocationAssign = jest.fn();

  const generateMockPermissions = (value) => ({
    permissions: {
      analysis: {
        staffDevelopment: { canView: value },
        coachingSummary: { canView: value },
        medicalSummary: { canView: value },
        developmentJourney: { canView: value },
        growthAndMaturationReportArea: { canView: value },
      },
      medical: { medicalGraphing: { canView: value } },
    },
  });

  const medicalGraphingPermissionPending = {
    permissions: {},
    permissionsRequestStatus: 'PENDING',
  };

  beforeEach(() => {
    useLocationAssign.mockReturnValue(mockLocationAssign);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when permissionsRequestStatus is PENDING', () => {
    beforeEach(() => {
      jest
        .spyOn(PermissionsContext, 'usePermissions')
        .mockReturnValue(medicalGraphingPermissionPending);
    });

    it('renders the DelayedLoadingFeedback component', async () => {
      const dashboard = TemplateDashboards();
      await waitFor(() =>
        expect(dashboard).toEqual(<DelayedLoadingFeedback />)
      );
    });
  });

  describe('when feature flags are off and permissions false', () => {
    beforeEach(() => {
      window.featureFlags = {};
      jest
        .spyOn(PermissionsContext, 'usePermissions')
        .mockReturnValue(generateMockPermissions(false));
    });

    it('redirects to the home dashboard', async () => {
      TemplateDashboards();
      await waitFor(() => {
        expect(mockLocationAssign).toHaveBeenCalledTimes(1);
        expect(mockLocationAssign).toHaveBeenCalledWith('/home_dashboards');
      });
    });
  });

  describe('when feature flags are true and permissions are true', () => {
    const testPermissionFlag = async (flag, func, expectedProps) => {
      window.featureFlags = { [flag]: true };
      jest.spyOn(utilFuncs, func).mockReturnValue(() => true);

      const dashboard = TemplateDashboards();
      await waitFor(() => expect(dashboard).toEqual(expectedProps));
      expect(mockLocationAssign).toHaveBeenCalledTimes(0);
    };

    beforeEach(() => {
      jest
        .spyOn(PermissionsContext, 'usePermissions')
        .mockReturnValue(generateMockPermissions(true));
    });

    it('isMedicalSummary - renders the Dashboard component and does not redirect to home dashboards', async () => {
      testPermissionFlag(
        'rep-show-medical-summary',
        'isMedicalSummary',
        <Dashboard />
      );
    });

    it('isStaffDevelopment - renders the Dashboard component and does not redirect to home dashboards', async () => {
      testPermissionFlag(
        'rep-show-staff-development',
        'isStaffDevelopment',
        <Dashboard />
      );
    });

    it('isDevelopmentJourney - renders the Dashboard component and does not redirect to home dashboards', async () => {
      testPermissionFlag(
        'rep-show-development-journey',
        'isDevelopmentJourney',
        <Dashboard />
      );
    });

    it('isGrowthAndMaturationReport - renders the Dashboard component and does not redirect to home dashboards', async () => {
      testPermissionFlag(
        'rep-show-growth-and-maturation-report',
        'isGrowthAndMaturationReport',
        <Dashboard />
      );
    });

    it('isCoachingSummary - renders the Dashboard component and does not redirect to home dashboards', async () => {
      testPermissionFlag(
        'rep-show-coaching-summary',
        'isCoachingSummary',
        <Dashboard isTabFormat />
      );
    });
  });

  describe('Development Journey', () => {
    it('renders the dashboard when the feature flag is on and permission is true', async () => {
      window.setFlag('rep-show-development-journey', true);
      jest
        .spyOn(PermissionsContext, 'usePermissions')
        .mockReturnValue(generateMockPermissions(true));
      jest.spyOn(utilFuncs, 'isDevelopmentJourney').mockReturnValue(() => true);

      const dashboard = TemplateDashboards();
      await waitFor(() => expect(dashboard).toEqual(<Dashboard />));
      expect(mockLocationAssign).toHaveBeenCalledTimes(0);
    });

    it('does not render the dashboard when the feature flag is on and permission is false', async () => {
      window.setFlag('rep-show-development-journey', true);
      jest
        .spyOn(PermissionsContext, 'usePermissions')
        .mockReturnValue(generateMockPermissions(false));
      jest.spyOn(utilFuncs, 'isDevelopmentJourney').mockReturnValue(() => true);

      TemplateDashboards();
      await waitFor(() => {
        expect(mockLocationAssign).toHaveBeenCalledTimes(1);
        expect(mockLocationAssign).toHaveBeenCalledWith('/home_dashboards');
      });
    });

    it('does not render the dashboard when the feature flag is off and permission is true', async () => {
      window.setFlag('rep-show-development-journey', false);
      jest
        .spyOn(PermissionsContext, 'usePermissions')
        .mockReturnValue(generateMockPermissions(true));
      jest.spyOn(utilFuncs, 'isDevelopmentJourney').mockReturnValue(() => true);

      TemplateDashboards();
      await waitFor(() => {
        expect(mockLocationAssign).toHaveBeenCalledTimes(1);
        expect(mockLocationAssign).toHaveBeenCalledWith('/home_dashboards');
      });
    });

    it('does not render the dashboard when the feature flag is off and permission is false', async () => {
      window.setFlag('rep-show-development-journey', false);
      jest
        .spyOn(PermissionsContext, 'usePermissions')
        .mockReturnValue(generateMockPermissions(false));
      jest.spyOn(utilFuncs, 'isDevelopmentJourney').mockReturnValue(() => true);

      TemplateDashboards();
      await waitFor(() => {
        expect(mockLocationAssign).toHaveBeenCalledTimes(1);
        expect(mockLocationAssign).toHaveBeenCalledWith('/home_dashboards');
      });
    });
  });

  describe('Coaching Summary', () => {
    it('renders the dashboard when the feature flag is on and permission is true', async () => {
      window.setFlag('rep-show-coaching-summary', true);
      jest
        .spyOn(PermissionsContext, 'usePermissions')
        .mockReturnValue(generateMockPermissions(true));
      jest.spyOn(utilFuncs, 'isCoachingSummary').mockReturnValue(() => true);

      const dashboard = TemplateDashboards();
      await waitFor(() => expect(dashboard).toEqual(<Dashboard isTabFormat />));
      expect(mockLocationAssign).toHaveBeenCalledTimes(0);
    });

    it('does not render the dashboard when the feature flag is on and permission is false', async () => {
      window.setFlag('rep-show-coaching-summary', true);
      jest
        .spyOn(PermissionsContext, 'usePermissions')
        .mockReturnValue(generateMockPermissions(false));
      jest.spyOn(utilFuncs, 'isCoachingSummary').mockReturnValue(() => true);

      TemplateDashboards();
      await waitFor(() => {
        expect(mockLocationAssign).toHaveBeenCalledTimes(1);
        expect(mockLocationAssign).toHaveBeenCalledWith('/home_dashboards');
      });
    });

    it('does not render the dashboard when the feature flag is off and permission is true', async () => {
      window.setFlag('rep-show-coaching-summary', false);
      jest
        .spyOn(PermissionsContext, 'usePermissions')
        .mockReturnValue(generateMockPermissions(true));
      jest.spyOn(utilFuncs, 'isCoachingSummary').mockReturnValue(() => true);

      TemplateDashboards();
      await waitFor(() => {
        expect(mockLocationAssign).toHaveBeenCalledTimes(1);
        expect(mockLocationAssign).toHaveBeenCalledWith('/home_dashboards');
      });
    });

    it('does not render the dashboard when the feature flag is off and permission is false', async () => {
      window.setFlag('rep-show-coaching-summary', false);
      jest
        .spyOn(PermissionsContext, 'usePermissions')
        .mockReturnValue(generateMockPermissions(false));
      jest.spyOn(utilFuncs, 'isCoachingSummary').mockReturnValue(() => true);

      TemplateDashboards();
      await waitFor(() => {
        expect(mockLocationAssign).toHaveBeenCalledTimes(1);
        expect(mockLocationAssign).toHaveBeenCalledWith('/home_dashboards');
      });
    });
  });

  describe('Medical Summary', () => {
    it('renders the dashboard when the feature flag is on and permissions are true', async () => {
      window.setFlag('rep-show-medical-summary', true);
      jest
        .spyOn(PermissionsContext, 'usePermissions')
        .mockReturnValue(generateMockPermissions(true));
      jest.spyOn(utilFuncs, 'isMedicalSummary').mockReturnValue(() => true);

      const dashboard = TemplateDashboards();
      await waitFor(() => expect(dashboard).toEqual(<Dashboard />));
      expect(mockLocationAssign).toHaveBeenCalledTimes(0);
    });

    it('does not render the dashboard when the feature flag is on and both permissions are false', async () => {
      window.setFlag('rep-show-medical-summary', true);
      jest
        .spyOn(PermissionsContext, 'usePermissions')
        .mockReturnValue(generateMockPermissions(false));
      jest.spyOn(utilFuncs, 'isMedicalSummary').mockReturnValue(() => true);

      TemplateDashboards();
      await waitFor(() => {
        expect(mockLocationAssign).toHaveBeenCalledTimes(1);
        expect(mockLocationAssign).toHaveBeenCalledWith('/home_dashboards');
      });
    });

    it('does not render the dashboard when the feature flag is off and both permission are true', async () => {
      window.setFlag('rep-show-medical-summary', false);
      jest
        .spyOn(PermissionsContext, 'usePermissions')
        .mockReturnValue(generateMockPermissions(true));
      jest.spyOn(utilFuncs, 'isMedicalSummary').mockReturnValue(() => true);

      TemplateDashboards();
      await waitFor(() => {
        expect(mockLocationAssign).toHaveBeenCalledTimes(1);
        expect(mockLocationAssign).toHaveBeenCalledWith('/home_dashboards');
      });
    });

    it('does not render the dashboard when the feature flag is off and both permissions are false', async () => {
      window.setFlag('rep-show-medical-summary', false);
      jest
        .spyOn(PermissionsContext, 'usePermissions')
        .mockReturnValue(generateMockPermissions(false));
      jest.spyOn(utilFuncs, 'isMedicalSummary').mockReturnValue(() => true);

      TemplateDashboards();
      await waitFor(() => {
        expect(mockLocationAssign).toHaveBeenCalledTimes(1);
        expect(mockLocationAssign).toHaveBeenCalledWith('/home_dashboards');
      });
    });

    it('does not render the dashboard when the feature flag is on and only one permission "medicalGraphing" is false', async () => {
      window.setFlag('rep-show-medical-summary', true);
      jest.spyOn(PermissionsContext, 'usePermissions').mockReturnValue({
        permissions: {
          analysis: {
            medicalSummary: { canView: true },
          },
          medical: { medicalGraphing: { canView: false } },
        },
      });
      jest.spyOn(utilFuncs, 'isMedicalSummary').mockReturnValue(() => true);

      TemplateDashboards();
      await waitFor(() => {
        expect(mockLocationAssign).toHaveBeenCalledTimes(1);
        expect(mockLocationAssign).toHaveBeenCalledWith('/home_dashboards');
      });
    });

    it('does not render the dashboard when the feature flag is on and only one permission "medicalSummary" is false', async () => {
      window.setFlag('rep-show-medical-summary', true);
      jest.spyOn(PermissionsContext, 'usePermissions').mockReturnValue({
        permissions: {
          analysis: {
            medicalSummary: { canView: false },
          },
          medical: { medicalGraphing: { canView: true } },
        },
      });
      jest.spyOn(utilFuncs, 'isMedicalSummary').mockReturnValue(() => true);

      TemplateDashboards();
      await waitFor(() => {
        expect(mockLocationAssign).toHaveBeenCalledTimes(1);
        expect(mockLocationAssign).toHaveBeenCalledWith('/home_dashboards');
      });
    });
  });

  describe('Staff Development', () => {
    it('renders the dashboard when the feature flag is on and permission is true', async () => {
      window.setFlag('rep-show-staff-development', true);
      jest
        .spyOn(PermissionsContext, 'usePermissions')
        .mockReturnValue(generateMockPermissions(true));
      jest.spyOn(utilFuncs, 'isStaffDevelopment').mockReturnValue(() => true);

      const dashboard = TemplateDashboards();
      await waitFor(() => expect(dashboard).toEqual(<Dashboard />));
      expect(mockLocationAssign).toHaveBeenCalledTimes(0);
    });

    it('does not render the dashboard when the feature flag is on and permission is false', async () => {
      window.setFlag('rep-show-staff-development', true);
      jest
        .spyOn(PermissionsContext, 'usePermissions')
        .mockReturnValue(generateMockPermissions(false));
      jest.spyOn(utilFuncs, 'isStaffDevelopment').mockReturnValue(() => true);

      TemplateDashboards();
      await waitFor(() => {
        expect(mockLocationAssign).toHaveBeenCalledTimes(1);
        expect(mockLocationAssign).toHaveBeenCalledWith('/home_dashboards');
      });
    });

    it('does not render the dashboard when the feature flag is off and permission is true', async () => {
      window.setFlag('rep-show-staff-development', false);
      jest
        .spyOn(PermissionsContext, 'usePermissions')
        .mockReturnValue(generateMockPermissions(true));
      jest.spyOn(utilFuncs, 'isStaffDevelopment').mockReturnValue(() => true);

      TemplateDashboards();
      await waitFor(() => {
        expect(mockLocationAssign).toHaveBeenCalledTimes(1);
        expect(mockLocationAssign).toHaveBeenCalledWith('/home_dashboards');
      });
    });

    it('does not render the dashboard when the feature flag is off and permission is false', async () => {
      window.setFlag('rep-show-staff-development', false);
      jest
        .spyOn(PermissionsContext, 'usePermissions')
        .mockReturnValue(generateMockPermissions(false));
      jest.spyOn(utilFuncs, 'isStaffDevelopment').mockReturnValue(() => true);

      TemplateDashboards();
      await waitFor(() => {
        expect(mockLocationAssign).toHaveBeenCalledTimes(1);
        expect(mockLocationAssign).toHaveBeenCalledWith('/home_dashboards');
      });
    });
  });

  describe('Growth and Maturation Report', () => {
    it('renders the dashboard when the feature flag is on and permission is true', async () => {
      window.setFlag('rep-show-growth-and-maturation-report', true);
      jest
        .spyOn(PermissionsContext, 'usePermissions')
        .mockReturnValue(generateMockPermissions(true));
      jest
        .spyOn(utilFuncs, 'isGrowthAndMaturationReport')
        .mockReturnValue(() => true);

      const dashboard = TemplateDashboards();
      await waitFor(() => expect(dashboard).toEqual(<Dashboard />));
      expect(mockLocationAssign).toHaveBeenCalledTimes(0);
    });

    it('does not render the dashboard when the feature flag is on and permission is false', async () => {
      window.setFlag('rep-show-growth-and-maturation-report', true);
      jest
        .spyOn(PermissionsContext, 'usePermissions')
        .mockReturnValue(generateMockPermissions(false));
      jest
        .spyOn(utilFuncs, 'isGrowthAndMaturationReport')
        .mockReturnValue(() => true);

      TemplateDashboards();
      await waitFor(() => {
        expect(mockLocationAssign).toHaveBeenCalledTimes(1);
        expect(mockLocationAssign).toHaveBeenCalledWith('/home_dashboards');
      });
    });

    it('does not render the dashboard when the feature flag is off and permission is true', async () => {
      window.setFlag('rep-show-growth-and-maturation-report', false);
      jest
        .spyOn(PermissionsContext, 'usePermissions')
        .mockReturnValue(generateMockPermissions(true));
      jest
        .spyOn(utilFuncs, 'isGrowthAndMaturationReport')
        .mockReturnValue(() => true);

      TemplateDashboards();
      await waitFor(() => {
        expect(mockLocationAssign).toHaveBeenCalledTimes(1);
        expect(mockLocationAssign).toHaveBeenCalledWith('/home_dashboards');
      });
    });

    it('does not render the dashboard when the feature flag is off and permission is false', async () => {
      window.setFlag('rep-show-growth-and-maturation-report', false);
      jest
        .spyOn(PermissionsContext, 'usePermissions')
        .mockReturnValue(generateMockPermissions(false));
      jest
        .spyOn(utilFuncs, 'isGrowthAndMaturationReport')
        .mockReturnValue(() => true);

      TemplateDashboards();
      await waitFor(() => {
        expect(mockLocationAssign).toHaveBeenCalledTimes(1);
        expect(mockLocationAssign).toHaveBeenCalledWith('/home_dashboards');
      });
    });
  });
});
