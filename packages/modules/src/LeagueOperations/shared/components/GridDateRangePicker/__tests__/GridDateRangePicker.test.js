import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LocalizationProvider from '@kitman/playbook/providers/wrappers/LocalizationProvider';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';

import GridDateRangePicker from '../index';

jest.mock('@kitman/common/src/contexts/PermissionsContext');

const renderWithProviders = (children) => {
  render(<LocalizationProvider>{children}</LocalizationProvider>);
};

describe('GridDateRangePicker', () => {
  const user = userEvent.setup();

  const mockOnUpdate = jest.fn();
  const mockRequestStatus = {
    isFetching: false,
    isLoading: false,
    isError: false,
  };

  const renderComponent = (props = {}) => {
    const defaultProps = {
      value: { start_date: '2023-01-01', end_date: '2023-01-31' },
      onUpdate: mockOnUpdate,
      requestStatus: mockRequestStatus,
      ...props,
    };

    return renderWithProviders(<GridDateRangePicker {...defaultProps} />);
  };

  beforeEach(() => {
    usePermissions.mockReturnValue({
      permissions: { homegrown: { canViewHomegrown: true } },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('does not render', async () => {
    usePermissions.mockReturnValue({
      permissions: { homegrown: { canViewHomegrown: false } },
    });
    renderComponent();
    expect(screen.queryByLabelText('DOB range')).not.toBeInTheDocument();
  });

  it('renders correctly with default props', () => {
    renderComponent();
    const input = screen.getByRole('textbox');
    expect(screen.getByLabelText('DOB range')).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('01-01-2023 – 31-01-2023');
  });

  it('disables the picker when requestStatus indicates loading or error', async () => {
    renderComponent({
      requestStatus: { isFetching: true, isLoading: false, isError: false },
    });
    expect(screen.getByLabelText('DOB range')).toBeDisabled();
  });

  it('clears the date range when the clear button is clicked', async () => {
    renderComponent();

    const clearButton = screen.getByRole('button', { name: /clear/i });

    await user.click(clearButton);
    expect(mockOnUpdate).toHaveBeenCalledWith(null);
  });

  it('does not call onUpdate for invalid date ranges', async () => {
    renderComponent();

    const input = screen.getByLabelText('DOB range');
    await user.clear(input);
    await user.type(input, 'invalid date range');

    expect(mockOnUpdate).not.toHaveBeenCalled();
  });
});
