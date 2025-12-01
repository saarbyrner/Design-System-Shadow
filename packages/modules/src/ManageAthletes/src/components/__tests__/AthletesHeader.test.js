import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { DEFAULT_CONTEXT_VALUE } from '@kitman/common/src/contexts/PermissionsContext';
import {
  MockedPermissionContextProvider,
  cleanUpPermissionsContext,
} from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import useExportSidePanel from '@kitman/modules/src/HumanInput/hooks/useExportSidePanel';
import { useGetAllLabelsQuery } from '@kitman/modules/src/OrganisationSettings/src/components/DynamicCohorts/ManageLabels/redux/services/labelsApi';
import {
  MockedManageAthletesContextProvider,
  mockedManageAthletesContextValue,
} from '../../contexts/mocks';
import AthletesHeader from '../AthletesHeader';

jest.mock(
  '@kitman/modules/src/OrganisationSettings/src/components/DynamicCohorts/ManageLabels/redux/services/labelsApi'
);
jest.mock('@kitman/modules/src/HumanInput/hooks/useExportSidePanel');

const defaultSettingsPermissions = DEFAULT_CONTEXT_VALUE.permissions.settings;

const mockedPermissionsContextValue = {
  permissions: {
    settings: {
      ...defaultSettingsPermissions,
      canViewSettingsInsurancePolicies: true,
      canViewLabels: true,
    },
  },
  permissionsRequestStatus: 'SUCCESS',
};

const renderComponent = (
  props,
  manageAthletesContext = mockedManageAthletesContextValue,
  permissionsContext = {}
) =>
  render(
    <MockedManageAthletesContextProvider
      manageAthletesContext={manageAthletesContext}
    >
      <MockedPermissionContextProvider permissionsContext={permissionsContext}>
        <AthletesHeader {...props} />
      </MockedPermissionContextProvider>
    </MockedManageAthletesContextProvider>
  );

describe('<AthletesHeader />', () => {
  const props = {
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    useGetAllLabelsQuery.mockReturnValue({
      data: [],
      isSuccess: true,
    });

    useExportSidePanel.mockImplementation(() => {
      return {
        isExportSidePanelOpen: false,
        handleCloseExportSidePanel: jest.fn(),
        handleOpenExportSidePanel: jest.fn(),
      };
    });
  });

  it('displays the correct title when the view type is active', () => {
    renderComponent(props, {
      ...mockedManageAthletesContextValue,
      viewType: 'ACTIVE',
    });
    expect(screen.getByText('Active athletes')).toBeInTheDocument();
  });

  it('displays the correct title when the view type is inactive', () => {
    renderComponent(props, {
      ...mockedManageAthletesContextValue,
      viewType: 'INACTIVE',
    });

    expect(screen.getByText('Inactive athletes')).toBeInTheDocument();
  });

  describe('when the export-insurance-details [feature flag] is enabled and the settings-insurance-policies [permission] is on', () => {
    beforeEach(() => {
      window.featureFlags['export-insurance-details'] = true;
    });

    afterEach(() => {
      window.featureFlags['export-insurance-details'] = false;
      cleanUpPermissionsContext();
    });

    it('displays the export button', () => {
      renderComponent(
        props,
        mockedManageAthletesContextValue,
        mockedPermissionsContextValue
      );

      expect(
        screen.getByRole('button', {
          name: /export/i,
        })
      ).toBeInTheDocument();
    });
  });

  it('does not show the Labels filter when the FF is off', async () => {
    renderComponent(
      props,
      mockedManageAthletesContextValue,
      mockedPermissionsContextValue
    );

    await waitFor(() => {
      expect(screen.queryByText('Labels')).not.toBeInTheDocument();
    });
  });

  describe('labels-and-groups [FF]', () => {
    beforeEach(() => {
      window.setFlag('labels-and-groups', true);
    });

    afterEach(() => {
      window.setFlag('labels-and-groups', false);
    });

    it('shows the Labels filter when the FF is on and permission is true', async () => {
      renderComponent(
        props,
        mockedManageAthletesContextValue,
        mockedPermissionsContextValue
      );

      expect(await screen.findByText('Labels')).toBeInTheDocument();
    });

    it('does not show Labels filter then the permissions is false', async () => {
      const viewLabelsFalsePermission = {
        permissions: {
          settings: {
            ...mockedPermissionsContextValue,
            canViewLabels: false,
          },
        },
        permissionsRequestStatus:
          mockedPermissionsContextValue.permissionsRequestStatus,
      };
      renderComponent(
        props,
        mockedManageAthletesContextValue,
        viewLabelsFalsePermission
      );

      await waitFor(() => {
        expect(screen.queryByText('Labels')).not.toBeInTheDocument();
      });
    });

    it('does not show the filter if the query did not succeed', async () => {
      useGetAllLabelsQuery.mockReturnValue({
        data: [],
        isSuccess: false,
      });

      renderComponent(
        props,
        mockedManageAthletesContextValue,
        mockedPermissionsContextValue
      );

      await waitFor(() => {
        expect(screen.queryByText('Labels')).not.toBeInTheDocument();
      });
    });
  });

  it('does not show the filter if the query did not succeed', async () => {
    useGetAllLabelsQuery.mockReturnValue({
      data: [],
      isSuccess: false,
    });

    renderComponent(
      props,
      mockedManageAthletesContextValue,
      mockedPermissionsContextValue
    );

    await waitFor(() => {
      expect(screen.queryByText('Labels')).not.toBeInTheDocument();
    });
  });

  describe('form-based-athlete-profile [FF]', () => {
    beforeEach(() => {
      window.featureFlags['form-based-athlete-profile'] = true;
    });

    afterEach(() => {
      window.featureFlags['form-based-athlete-profile'] = false;
    });

    it('shows the export button with Athlete Profile option when the FF and permission are on and export-insurance-details FF is off', async () => {
      const localMockedPermissionsContext = {
        ...mockedPermissionsContextValue,
        permissions: {
          settings: {
            ...defaultSettingsPermissions,
            canViewSettingsAthletes: true,
          },
        },
      };

      renderComponent(
        props,
        mockedManageAthletesContextValue,
        localMockedPermissionsContext
      );

      const exportButton = screen.getByText('Export');

      expect(exportButton).toBeInTheDocument();

      await userEvent.click(exportButton);

      expect(screen.getByText('Athlete Profile')).toBeInTheDocument();
      expect(
        screen.queryByText('Insurance Details (.csv)')
      ).not.toBeInTheDocument();
    });

    it('shows the export button with Athlete Profile and Insurance Details options when the FF and permission are on and export-insurance-details FF is on', async () => {
      window.featureFlags['export-insurance-details'] = true;

      const localMockedPermissionsContext = {
        ...mockedPermissionsContextValue,
        permissions: {
          settings: {
            ...defaultSettingsPermissions,
            canViewSettingsAthletes: true,
          },
        },
      };

      renderComponent(
        props,
        mockedManageAthletesContextValue,
        localMockedPermissionsContext
      );

      const exportButton = screen.getByText('Export');

      expect(exportButton).toBeInTheDocument();

      await userEvent.click(exportButton);

      expect(screen.getByText('Insurance Details (.csv)')).toBeInTheDocument();
      expect(screen.getByText('Athlete Profile')).toBeInTheDocument();

      window.featureFlags['export-insurance-details'] = false;
    });

    it('shows the export button with Insurance Details option only when the FF and permission are off and export-insurance-details FF is on', async () => {
      window.featureFlags['export-insurance-details'] = true;
      window.featureFlags['form-based-athlete-profile'] = false;

      renderComponent(
        props,
        mockedManageAthletesContextValue,
        mockedPermissionsContextValue
      );

      const exportButton = screen.getByText('Export');

      expect(exportButton).toBeInTheDocument();

      await userEvent.click(exportButton);

      expect(screen.getByText('Insurance Details (.csv)')).toBeInTheDocument();
      expect(screen.queryByText('Athlete Profile')).not.toBeInTheDocument();

      window.featureFlags['export-insurance-details'] = false;
    });
  });
});
