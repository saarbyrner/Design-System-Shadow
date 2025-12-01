import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import { ExportMenuTranslated as ExportMenu } from '../ExportMenu/ExportMenu';

const props = {
  menuItems: [],
  toastHandlers: [],
};

describe('<ExportMenu />', () => {
  it('renders', async () => {
    const leagueOpsStaffExports = {
      closeToast: jest.fn(),
      toasts: [],
    };
    const menuItems = [
      {
        key: 'staff',
        description: 'Registration Staff Export',
        onClick: jest.fn(),
        icon: 'icon-export',
        isDisabled: false,
      },
    ];
    const toastHandlers = [leagueOpsStaffExports];

    renderWithProviders(
      <ExportMenu menuItems={menuItems} toastHandlers={toastHandlers} />
    );

    const downloadButton = screen.getByText(/Download/i);
    expect(downloadButton).toBeInTheDocument();

    await userEvent.click(downloadButton);
    expect(screen.getByText(/Registration Staff Export/i)).toBeInTheDocument();
  });

  it('renders nothing', () => {
    renderWithProviders(<ExportMenu {...props} />);
    expect(screen.queryByText(/Download/i)).not.toBeInTheDocument();
  });
});
