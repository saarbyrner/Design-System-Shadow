import { screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import userEvent from '@testing-library/user-event';
import defaultPermissionsDetailsSlice from '@kitman/modules/src/StaffProfile/shared/redux/services/mocks/stores/permissionsDetailsSlice';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { PermissionsBodyTranslated as PermissionsBody } from '@kitman/modules/src/StaffProfile/shared/components/PermissionsTab/components/PermissionsBody';

jest.mock('@kitman/common/src/contexts/PermissionsContext', () => ({
  ...jest.requireActual('@kitman/common/src/contexts/PermissionsContext'),
  usePermissions: jest.fn(),
}));

describe('<PermissionsBody/>', () => {
  const i18nT = i18nextTranslateStub();
  const props = {
    t: i18nT,
  };

  const renderComponent = (slice = defaultPermissionsDetailsSlice) => {
    renderWithProviders(<PermissionsBody {...props} />, {
      preloadedState: {
        permissionsDetailsSlice: slice,
      },
    });
  };

  beforeEach(() => {
    usePermissions.mockReturnValue({
      permissions: {
        settings: { canManageStaffUsers: true },
      },
      permissionsRequestStatus: 'SUCCESS',
    });
  });

  it('renders <PermissionsBody/>', () => {
    renderComponent();

    expect(screen.getByText('Advanced Permissions')).toBeInTheDocument();
  });

  it('renders <PermissionsBody/> with permission modules and checkboxes', async () => {
    renderComponent();

    expect(screen.getByText('Advanced Permissions')).toBeInTheDocument();
    expect(screen.getByText('Alerts')).toBeInTheDocument();
    expect(screen.getByText('Analysis')).toBeInTheDocument();

    await userEvent.click(screen.getByText('Alerts'));

    expect(screen.getByText('Add Alerts')).toBeInTheDocument();
    expect(screen.getByText('Delete Alerts')).toBeInTheDocument();
    expect(screen.getByText('Edit Alerts')).toBeInTheDocument();
    expect(screen.getByText('View Alerts')).toBeInTheDocument();
  });

  it('renders <PermissionsBody/> with permission modules and filters out modules with no permissions', async () => {
    const testState = {
      ...defaultPermissionsDetailsSlice,
      permissions: [
        {
          id: 39,
          key: 'alerts',
          name: 'Alerts',
          description: null,
          permissions: [],
        },
        {
          id: 37,
          key: 'analysis',
          name: 'Analysis',
          description: null,
          permissions: [
            {
              id: 43,
              key: 'analysis-athlete-view',
              name: 'Analysis Athlete View',
              description: null,
            },
            {
              id: 45,
              key: 'analysis-injury-view',
              name: 'Analysis Injury View',
              description: null,
            },
          ],
        },
      ],
    };

    renderComponent(testState);

    expect(screen.getByText('Advanced Permissions')).toBeInTheDocument();
    expect(screen.queryByText('Alerts')).not.toBeInTheDocument();
    expect(screen.getByText('Analysis')).toBeInTheDocument();
  });

  it('renders checkbox as checked if the user clicks', async () => {
    renderComponent();

    const addAlertsCheckbox = screen.getByRole('checkbox', {
      name: 'Add Alerts',
    });
    const deleteAlertsCheckbox = screen.getByRole('checkbox', {
      name: 'Delete Alerts',
    });

    expect(addAlertsCheckbox).toBeChecked();
    expect(deleteAlertsCheckbox).not.toBeChecked();

    await userEvent.click(addAlertsCheckbox);

    expect(addAlertsCheckbox).not.toBeChecked();

    await userEvent.click(deleteAlertsCheckbox);

    expect(deleteAlertsCheckbox).toBeChecked();
  });

  it('renders disabled checkboxes if the user does not have edit permissions', async () => {
    usePermissions.mockReturnValue({
      permissions: {
        settings: { canManageStaffUsers: false },
      },
    });
    renderComponent();

    await userEvent.click(screen.getByText('Alerts'));

    const allCheckboxes = await screen.findAllByRole('checkbox');

    allCheckboxes.forEach((checkbox) => {
      expect(checkbox).toBeDisabled();
    });
  });

  it('panels are expanded initially before all collapsing on button press', async () => {
    const testState = {
      ...defaultPermissionsDetailsSlice,
      permissions: [
        {
          id: 39,
          key: 'alerts',
          name: 'Alerts',
          description: null,
          permissions: [
            {
              id: 40,
              key: 'add-alerts',
              name: 'Add Alerts',
              description: null,
            },
            {
              id: 41,
              key: 'delete-alerts',
              name: 'Delete Alerts',
              description: null,
            },
            {
              id: 42,
              key: 'edit-alerts',
              name: 'Edit Alerts',
              description: null,
            },
          ],
        },
        {
          id: 37,
          key: 'analysis',
          name: 'Analysis',
          description: null,
          permissions: [
            {
              id: 43,
              key: 'analysis-athlete-view',
              name: 'Analysis Athlete View',
              description: null,
            },
            {
              id: 45,
              key: 'analysis-injury-view',
              name: 'Analysis Injury View',
              description: null,
            },
          ],
        },
      ],
    };

    renderComponent(testState);

    expect(screen.getByText('Add Alerts')).toBeVisible();
    expect(screen.getByText('Edit Alerts')).toBeVisible();
    expect(screen.getByText('Analysis Injury View')).toBeVisible();
    expect(screen.getByText('Analysis Athlete View')).toBeVisible();

    await userEvent.click(screen.getByText('Collapse All'));

    expect(screen.getByText('Add Alerts')).not.toBeVisible();
    expect(screen.getByText('Edit Alerts')).not.toBeVisible();
    expect(screen.getByText('Analysis Injury View')).not.toBeVisible();
    expect(screen.getByText('Analysis Athlete View')).not.toBeVisible();
  });
});
