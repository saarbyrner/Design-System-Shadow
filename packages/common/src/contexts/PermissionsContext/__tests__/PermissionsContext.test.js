import $ from 'jquery';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { data as permissionData } from '@kitman/services/src/mocks/handlers/getPermissions';
import { mockPermissionsContext, cleanUpPermissionsContext } from './testUtils';
import { PermissionsProvider, usePermissions } from '..';

describe('PermissionsContext', () => {
  let component;
  delete permissionData.concussion;
  delete permissionData.settings;
  const TestingComponent = () => {
    const { permissions } = usePermissions();
    return (
      <>
        <p id="permissions">{JSON.stringify(permissions)}</p>
        <p>{`medical.forms.canExport: ${permissions.medical.forms.canExport}`}</p>
        <p>{`medical.medications.canView: ${permissions.medical.medications.canView}`}</p>
        <p>{`medical.medications.canAdmin: ${permissions.medical.medications.canAdmin}`}</p>
      </>
    );
  };

  const mockContext = {
    permissions: {
      analysis: {
        staffDevelopment: {
          canView: true,
        },
        coachingSummary: {
          canView: true,
        },
        developmentJourney: {
          canView: true,
        },
        medicalSummary: {
          canView: true,
        },
        labelsAndGroups: {
          canReport: true,
        },
        historicReporting: {
          canReport: true,
        },
        benchmarkReport: {
          canView: true,
        },
        benchmarkValidation: {
          canManage: true,
        },
        growthAndMaturationImportArea: {
          canView: true,
        },
        benchmarkingTestingImportArea: {
          canView: false,
        },
        lookerDashboardGroup: {
          canView: true,
          canCreate: true,
        },
      },
      general: {
        canViewDashboard: true,
        canManageDashboard: true,
      },
      medical: {
        tue: {
          canCreate: true,
        },
        forms: {
          canExport: true,
        },
        medications: {
          canView: true,
          canAdmin: true,
        },
      },
    },
  };

  beforeEach(() => {
    const deferred = $.Deferred();
    jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(permissionData));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Permissions Provider', () => {
    it('renders the provider correctly', async () => {
      component = render(
        <PermissionsProvider>
          <div>Success</div>
        </PermissionsProvider>
      );

      await waitFor(() =>
        expect(component.getByText('Success')).toBeInTheDocument()
      );
    });

    it('renders with a failed api call', async () => {
      const deferred = $.Deferred();
      jest.spyOn($, 'ajax').mockImplementation(() => deferred.reject());
      component = render(
        <PermissionsProvider>
          <div>Failed</div>
        </PermissionsProvider>
      );

      await waitFor(() =>
        expect(component.getByText('Failed')).toBeInTheDocument()
      );
    });
  });

  describe('Permissions Context', () => {
    beforeEach(() => {
      mockPermissionsContext(mockContext);
    });

    afterEach(() => {
      cleanUpPermissionsContext();
    });

    it('sets the context correctly', () => {
      component = render(<TestingComponent />);
      expect(
        component.getByText('medical.forms.canExport: true')
      ).toBeInTheDocument();

      expect(
        component.getByText('medical.medications.canView: true')
      ).toBeInTheDocument();

      expect(
        component.getByText('medical.medications.canAdmin: true')
      ).toBeInTheDocument();

      expect(
        component.getByText(
          '{"analysis":{"staffDevelopment":{"canView":true},"coachingSummary":{"canView":true},"developmentJourney":{"canView":true},"medicalSummary":{"canView":true},"labelsAndGroups":{"canReport":true},"historicReporting":{"canReport":true},"benchmarkReport":{"canView":true},"benchmarkValidation":{"canManage":true},"growthAndMaturationImportArea":{"canView":true},"benchmarkingTestingImportArea":{"canView":false},"lookerDashboardGroup":{"canView":true,"canCreate":true}},"general":{"canViewDashboard":true,"canManageDashboard":true},"medical":{"tue":{"canCreate":true},"forms":{"canExport":true},"medications":{"canView":true,"canAdmin":true}}}'
        )
      ).toBeInTheDocument();
    });
  });
});
