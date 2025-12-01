import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TooltipCell from '../TooltipCell';

describe('<TooltipCell />', () => {
  it('renders the correct content', () => {
    render(<TooltipCell value="value" />);
    expect(screen.getByText('value')).toBeInTheDocument();
  });

  it('renders the correct content when the text is long', async () => {
    const user = userEvent.setup();
    render(
      <TooltipCell value="some really long text that should really be truncated" />
    );

    expect(screen.getByText('some really long text ...')).toBeInTheDocument();

    await user.hover(screen.getByText('some really long text ...'));

    expect(
      await screen.findByText(
        'some really long text that should really be truncated'
      )
    ).toBeInTheDocument();
  });
});
