import { render, screen } from '@testing-library/react';
import EllipsisTooltipText from '..';

describe('<EllipsisTooltipText /> component', () => {
  const props = {
    content: 'EllipsisTooltipText content',
    displayEllipsisWidth: 140,
  };

  it('renders the correct content', () => {
    render(<EllipsisTooltipText {...props} />);
    expect(screen.getByText('EllipsisTooltipText content')).toBeInTheDocument();
  });

  it('sets the width from which the ellipsis is shown', () => {
    render(<EllipsisTooltipText {...props} />);
    expect(screen.getByText('EllipsisTooltipText content')).toHaveStyle({
      maxWidth: '140px',
    });
  });
});
