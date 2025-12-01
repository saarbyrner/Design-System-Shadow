import { screen } from '@testing-library/react';
import { renderWithUserEventSetup } from '@kitman/common/src/utils/test_utils';
import FavoriteCheckbox from '@kitman/playbook/components/FavoriteCheckbox';

const mockOnChange = jest.fn();

const defaultProps = {
  onChange: mockOnChange,
};

const renderComponent = (props = defaultProps) =>
  renderWithUserEventSetup(<FavoriteCheckbox {...props} />);

describe('<FavoriteCheckbox />', () => {
  it('renders correctly', () => {
    renderComponent();

    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
  });

  it('renders correctly with label', () => {
    const label = 'Add to favorites';

    renderComponent({ ...defaultProps, label });

    const checkbox = screen.getByRole('checkbox', { name: label });

    expect(checkbox).toBeInTheDocument();
  });

  it('shows tooltip on hover', async () => {
    const tooltipTitle = 'Remove from favorites';

    const { user } = renderComponent({
      ...defaultProps,
      checked: true,
      tooltipTitle,
    });

    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toBeChecked();

    await user.hover(checkbox);

    expect(await screen.findByText(tooltipTitle)).toBeInTheDocument();
  });

  it('calls onChange when checked', async () => {
    const { user } = renderComponent();

    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(true);
  });
});
