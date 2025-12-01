import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LinkTooltipCell from '../LinkTooltipCell';

describe('<LinkTooltipCell />', () => {
  const props = {
    longText: 'some text that shouldnt be truncated',
    valueLimit: 40,
  };
  it('renders correct content when text is shorter than valueLimit', () => {
    render(<LinkTooltipCell {...props} />);
    expect(screen.getByRole('link')).toHaveTextContent(
      'some text that shouldnt be truncated'
    );
  });

  it('renders correct content when text is longer than valueLimit', async () => {
    render(
      <LinkTooltipCell
        valueLimit={20}
        longText="some really long text that should really be truncated"
      />
    );

    expect(screen.getByRole('link')).toHaveTextContent('some really long ...');
    await userEvent.hover(screen.getByTestId('LinkTooltipCell|Cell'));
    expect(
      await screen.findByText(
        'some really long text that should really be truncated'
      )
    ).toBeInTheDocument();
  });
});
