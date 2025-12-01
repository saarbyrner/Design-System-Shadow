import { screen } from '@testing-library/react';
import { renderWithUserEventSetup } from '@kitman/common/src/utils/test_utils';
import GridCellExpand from '@kitman/playbook/components/GridCellExpand';

const defaultProps = {
  width: 100,
  value: 'This is a very long text to display that should overflow',
};

const renderComponent = (props = defaultProps) =>
  renderWithUserEventSetup(<GridCellExpand {...props} />);

describe('<GridCellExpand />', () => {
  it('renders the GridCellExpand component with text truncated', async () => {
    renderComponent();

    expect(screen.getByText(defaultProps.value)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.value)).toHaveStyle({
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    });
  });

  it('shows Popper on mouse enter if content is overflowed', async () => {
    const { user } = renderComponent();

    const cellWrapper = screen.getByTestId('cell-wrapper');

    await user.hover(cellWrapper);

    const popperText = screen.getByText(defaultProps.value);
    expect(popperText).toBeInTheDocument();
  });
});
