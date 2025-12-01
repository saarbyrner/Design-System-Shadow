import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n from 'i18next';
import { setI18n } from 'react-i18next';

import Toasts from '@kitman/modules/src/Toasts';
import { rest, server } from '@kitman/services/src/mocks/server';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import { PermissionsTabTranslated as PermissionsTab } from '@kitman/modules/src/StaffProfile/shared/components/PermissionsTab';
import useLocationPathname from '@kitman/common/src/hooks/useLocationPathname';
import defaultPermissionsDetailsSlice from '@kitman/modules/src/StaffProfile/shared/redux/services/mocks/stores/permissionsDetailsSlice';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';

setI18n(i18n);

jest.mock('@kitman/common/src/contexts/PermissionsContext', () => ({
  ...jest.requireActual('@kitman/common/src/contexts/PermissionsContext'),
  usePermissions: jest.fn(),
}));

jest.mock('@kitman/common/src/hooks/useLocationPathname', () => jest.fn());

const PERMISSIONS_UPDATED_MSG = 'Permissions has been updated';
const PERMISSIONS_UNABLE_TO_SAVE_MSG =
  'Unable to update permissions. Try again';

describe('PermissionsTab', () => {
  beforeEach(() => {
    usePermissions.mockReturnValue({
      permissions: {
        settings: { canManageStaffUsers: true },
      },
      permissionsRequestStatus: 'SUCCESS',
    });
  });
  const defaultStore = {
    permissionsDetailsSlice: defaultPermissionsDetailsSlice,
    toastsSlice: {
      value: [],
    },
  };

  const renderComponentWithProviders = (state = defaultStore) =>
    renderWithProviders(
      <>
        <PermissionsTab />
        <Toasts />
      </>,
      {
        preloadedState: state,
      }
    );

  beforeEach(() => {
    useLocationPathname.mockImplementation(() => '/administration/staff/1');
  });

  it('renders Permissions tab', () => {
    renderComponentWithProviders();

    expect(screen.getByText('Permissions')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Select user’s role to set permissions. To customize permissions, manually selecting options from the full list of settings below in the advance permission section.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Group (required)')).toBeInTheDocument();
    expect(screen.getByText('Doctor')).toBeInTheDocument();
    expect(screen.getByText('Advanced Permissions')).toBeInTheDocument();
  });

  describe('Update permissions', () => {
    it('renders success toast when clicking save button', async () => {
      renderComponentWithProviders();

      expect(screen.getByText('Permissions')).toBeInTheDocument();
      expect(screen.getByText('Save')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Select user’s role to set permissions. To customize permissions, manually selecting options from the full list of settings below in the advance permission section.'
        )
      ).toBeInTheDocument();
      expect(screen.getByText('Group (required)')).toBeInTheDocument();
      expect(screen.getByText('Doctor')).toBeInTheDocument();
      expect(screen.getByText('Advanced Permissions')).toBeInTheDocument();

      const addAlertsCheckbox = screen.getByRole('checkbox', {
        name: 'Add Alerts',
      });

      expect(addAlertsCheckbox).toBeChecked();

      await userEvent.click(addAlertsCheckbox);

      expect(addAlertsCheckbox).not.toBeChecked();

      await userEvent.click(screen.getByText('Save'));

      expect(screen.getByText(PERMISSIONS_UPDATED_MSG)).toBeInTheDocument();

      expect(
        screen.queryByText(PERMISSIONS_UNABLE_TO_SAVE_MSG)
      ).not.toBeInTheDocument();
    });

    it('renders error toast when clicking save button if request fails', async () => {
      server.use(
        rest.put('/administration/staff/1/permissions', (req, res, ctx) => {
          return res(ctx.status(500));
        })
      );
      renderComponentWithProviders();

      expect(screen.getByText('Permissions')).toBeInTheDocument();
      expect(screen.getByText('Save')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Select user’s role to set permissions. To customize permissions, manually selecting options from the full list of settings below in the advance permission section.'
        )
      ).toBeInTheDocument();
      expect(screen.getByText('Group (required)')).toBeInTheDocument();
      expect(screen.getByText('Doctor')).toBeInTheDocument();
      expect(screen.getByText('Advanced Permissions')).toBeInTheDocument();

      const addAlertsCheckbox = screen.getByRole('checkbox', {
        name: 'Add Alerts',
      });

      expect(addAlertsCheckbox).toBeChecked();

      await userEvent.click(addAlertsCheckbox);

      expect(addAlertsCheckbox).not.toBeChecked();

      await userEvent.click(screen.getByText('Save'));

      expect(
        screen.queryByText(PERMISSIONS_UPDATED_MSG)
      ).not.toBeInTheDocument();

      expect(
        screen.getByText(PERMISSIONS_UNABLE_TO_SAVE_MSG)
      ).toBeInTheDocument();
    });
  });
});
