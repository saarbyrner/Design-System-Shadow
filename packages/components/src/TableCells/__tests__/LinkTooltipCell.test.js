import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import LinkTooltipCell from '../LinkTooltipCell';

describe('LinkTooltipCell', () => {
  const mockOnClick = jest.fn();

  const defaultProps = {
    url: 'https://kitmanlabs.com',
    longText: 'This is a very long text that should be truncated',
    onClick: mockOnClick,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call onClick when the TextLink is clicked', async () => {
    const user = userEvent.setup();
    render(<LinkTooltipCell {...defaultProps} />);

    const link = screen.getByRole('link');
    await user.click(link);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should call onClick when the external link is clicked', async () => {
    const user = userEvent.setup();
    render(<LinkTooltipCell {...defaultProps} isExternalLink />);

    const link = screen.getByRole('link');
    await user.click(link);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should call onClick when the download link is clicked', async () => {
    const user = userEvent.setup();
    render(<LinkTooltipCell {...defaultProps} downloadTitle="download-file" />);

    const link = screen.getByRole('link');
    await user.click(link);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('renders the short text and a tooltip with the long text', async () => {
    const user = userEvent.setup();
    render(<LinkTooltipCell {...defaultProps} />);

    expect(
      screen.getByText('This is a very long text that should ...')
    ).toBeInTheDocument();

    await user.hover(screen.getByTestId('LinkTooltipCell|Cell'));

    expect(
      await screen.findByText(
        'This is a very long text that should be truncated'
      )
    ).toBeInTheDocument();
  });
});
