import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ExpandButton from '../index';

describe('<ExpandButton />', () => {
  const defaultProps = {
    handleClick: jest.fn(),
    ariaLabel: 'Expand Button',
    isCollapsed: true,
    isDisabled: false,
  };

  const renderComponent = (props = defaultProps) => {
    render(<ExpandButton {...props} />);
  };

  it('should render ExpandMore icon when isCollapsed is true', () => {
    renderComponent();
    expect(screen.getByLabelText('Expand Button')).toBeInTheDocument();
    expect(screen.getByTestId('ExpandMoreIcon')).toBeInTheDocument();
  });

  it('should render ExpandLess icon when isCollapsed is false', () => {
    renderComponent({ ...defaultProps, isCollapsed: false });
    expect(screen.getByTestId('ExpandLessIcon')).toBeInTheDocument();
  });

  it('should call handleClick when clicked', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByLabelText('Expand Button'));

    expect(defaultProps.handleClick).toHaveBeenCalledTimes(1);
  });

  it('should have pointer-events: none when disabled', () => {
    renderComponent({ ...defaultProps, isDisabled: true });

    const button = screen.getByLabelText('Expand Button');

    expect(button).toHaveStyle('pointer-events: none');
  });
});
