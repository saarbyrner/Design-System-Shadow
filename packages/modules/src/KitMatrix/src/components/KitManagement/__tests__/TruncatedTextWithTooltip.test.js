import { render, screen } from '@testing-library/react';
import TruncatedTextWithTooltip from '../utils/TruncatedTextWithTooltip';

describe('TruncatedTextWithTooltip', () => {
  it('renders the text correctly', () => {
    const testText = 'Some text';
    render(<TruncatedTextWithTooltip text={testText} />);
    expect(screen.getByText(testText)).toBeInTheDocument();
  });

  it('applies ellipsis styles for text truncation', () => {
    const testText = 'Very Long Kit Name That Should Be Truncated';
    render(<TruncatedTextWithTooltip text={testText} />);

    const typography = screen.getByText(testText);
    expect(typography).toHaveStyle({
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      display: 'block',
    });
  });
});
