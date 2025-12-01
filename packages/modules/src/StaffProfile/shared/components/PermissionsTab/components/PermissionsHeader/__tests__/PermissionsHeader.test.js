import { screen, waitFor } from '@testing-library/react';
import i18n from 'i18next';
import { setI18n } from 'react-i18next';
import selectEvent from 'react-select-event';

import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import { PermissionsHeaderTranslated as PermissionsHeader } from '@kitman/modules/src/StaffProfile/shared/components/PermissionsTab/components/PermissionsHeader';
import defaultPermissionsDetailsSlice from '@kitman/modules/src/StaffProfile/shared/redux/services/mocks/stores/permissionsDetailsSlice';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';

setI18n(i18n);

jest.mock('@kitman/common/src/contexts/PermissionsContext', () => ({
  ...jest.requireActual('@kitman/common/src/contexts/PermissionsContext'),
  usePermissions: jest.fn(),
}));
describe('PermissionsHeader', () => {
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
  };

  const renderComponentWithProviders = (state = defaultStore) =>
    renderWithProviders(<PermissionsHeader />, {
      preloadedState: state,
    });

  const saveButtonText = 'Save';

  it('renders Permission Header components', () => {
    renderComponentWithProviders();

    expect(screen.getByText('Permissions')).toBeInTheDocument();

    // Action Buttons
    expect(screen.getByText(saveButtonText)).toBeInTheDocument();

    expect(
      screen.getByText(
        'Select user’s role to set permissions. To customize permissions, manually selecting options from the full list of settings below in the advance permission section.'
      )
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Group (required)')).toBeInTheDocument();
  });

  it('renders selector and can be changed', async () => {
    renderComponentWithProviders();

    expect(screen.getByText('Doctor')).toBeInTheDocument();
    expect(
      screen.queryByText('Athletic Trainer/ Therapist')
    ).not.toBeInTheDocument();

    const selector = screen.getByLabelText('Group (required)');

    selectEvent.openMenu(selector);

    await selectEvent.select(
      screen.queryAllByLabelText('Group (required)')[1],
      ['Athletic Trainer/ Therapist']
    );

    await waitFor(() => {
      expect(screen.queryByText('Doctor')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Athletic Trainer/ Therapist')).toBeInTheDocument();
  });

  it('does not render save button if the user does not have edit permissions', () => {
    usePermissions.mockReturnValue({
      permissions: {
        settings: { canManageStaffUsers: false },
      },
    });
    renderComponentWithProviders();

    expect(screen.queryByText(saveButtonText)).not.toBeInTheDocument();
  });
});
