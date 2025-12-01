import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import AvailabilityStatusMenu from '@kitman/modules/src/AthleteManagement/ListAthleteApp/src/components/ActionBar/components/AvailabilityStatusMenu';

describe('AvailabilityStatusMenu', () => {
  const t = i18nextTranslateStub();
  const statusOptions = [
    'Available',
    'Unavailable',
    'Unavailable - Injured List',
    'Unavailable - On Loan',
  ];

  const defaultProps = {
    t,
    anchorEl: true,
    statusDataFetching: false,
    isBulkUpdateAvailabilityStatuLoading: false,
    statusOptions,
    selectedStatus: ['Available'],
    onSaveClick: jest.fn(),
    onCloseMenu: jest.fn(),
    handleAvailabilityStatusChange: jest.fn(),
  };

  const renderComponent = (props = defaultProps) => {
    render(<AvailabilityStatusMenu {...props} />);
  };

  it('should render properly', () => {
    renderComponent();

    expect(
      screen.getByRole('button', {
        name: /cancel/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: /save/i,
      })
    ).toBeInTheDocument();

    statusOptions.forEach((status) => {
      expect(screen.getByText(status)).toBeInTheDocument();
    });
  });

  it('should trigger the action callbacks', async () => {
    const user = userEvent.setup();
    renderComponent();

    const saveButton = screen.getByRole('button', {
      name: /save/i,
    });
    expect(saveButton).toBeEnabled();

    await user.click(saveButton);

    expect(defaultProps.onSaveClick).toHaveBeenCalled();
    expect(defaultProps.onCloseMenu).toHaveBeenCalledTimes(1);
    expect(defaultProps.handleAvailabilityStatusChange).toHaveBeenCalledTimes(
      1
    );

    const cancelButton = screen.getByRole('button', {
      name: /cancel/i,
    });

    expect(cancelButton).toBeEnabled();

    await user.click(cancelButton);

    expect(defaultProps.onCloseMenu).toHaveBeenCalledTimes(2);
    expect(defaultProps.handleAvailabilityStatusChange).toHaveBeenCalledTimes(
      2
    );
  });
});
