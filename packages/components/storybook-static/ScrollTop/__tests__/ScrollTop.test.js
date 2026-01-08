import { render, screen } from '@testing-library/react';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import userEvent from '@testing-library/user-event';
import ScrollTop from '..';

jest.mock('@mui/material/useScrollTrigger');

describe('ScrollTop', () => {
  const defaultProps = {
    threshold: 100,
    position: { bottom: 16, right: 16 },
  };

  beforeAll(() => {
    window.scrollTo = jest.fn();
  });

  afterAll(() => {
    window.scrollTo.mockRestore();
  });

  const renderComponent = () => {
    render(<ScrollTop {...defaultProps} />);
  };

  it('renders correctly', () => {
    useScrollTrigger.mockReturnValue(false);
    renderComponent();

    expect(screen.getByTestId('KeyboardArrowUpIcon')).toBeInTheDocument();
    expect(screen.getByLabelText('scroll back to top')).toBeInTheDocument();
  });

  it('shows the button when trigger is active', () => {
    useScrollTrigger.mockReturnValue(true);
    renderComponent();

    const button = screen.getByLabelText('scroll back to top');
    expect(button).toBeVisible();
  });

  it('hides the button when trigger is inactive', () => {
    useScrollTrigger.mockReturnValue(false);
    renderComponent();

    const button = screen.queryByLabelText('scroll back to top');
    expect(button).not.toBeVisible();
  });

  it('scrolls to the top when the button is clicked', async () => {
    useScrollTrigger.mockReturnValue(true);
    const user = userEvent.setup();
    renderComponent();

    const button = screen.getByLabelText('scroll back to top');
    await user.click(button);

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
  });
});
