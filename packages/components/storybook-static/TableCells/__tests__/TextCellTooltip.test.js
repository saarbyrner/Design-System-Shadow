import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TextCellTooltip from '../TextCellTooltip';

describe('<TextCellTooltip />', () => {
  const props = {
    longText: 'some text that shouldnt be truncated',
    valueLimit: 40,
  };
  it('renders correct content when text is shorter than valueLimit', () => {
    render(<TextCellTooltip {...props} />);
    expect(screen.getByTestId('TextCellTooltip|Cell')).toHaveTextContent(
      'some text that shouldnt be truncated'
    );
  });

  it('renders correct content when text is longer than valueLimit', async () => {
    render(
      <TextCellTooltip
        valueLimit={20}
        longText="some really long text that should really be truncated"
      />
    );
    expect(screen.getByTestId('TextCellTooltip|Cell')).toHaveTextContent(
      'some really long ...'
    );

    await userEvent.hover(screen.getByTestId('TextCellTooltip|Cell'));
    expect(
      await screen.findByText(
        'some really long text that should really be truncated'
      )
    ).toBeInTheDocument();
  });

  it('renders correct content when text is undefined', () => {
    render(<TextCellTooltip longText={undefined} />);
    expect(screen.getByTestId('TextCellTooltip|Cell')).toHaveTextContent('');
  });
});
