import { render, screen } from '@testing-library/react';
import MenuLink from '../MenuLink';

describe('<MenuLink /> component', () => {
  const menuItem = { label: 'Link 1', url: 'path/to/link1', isDisabled: false };

  it('renders the link label and href', () => {
    render(<MenuLink {...menuItem} />);
    expect(screen.getByRole('link')).toHaveAttribute('href', 'path/to/link1');
    expect(screen.getByRole('link')).toHaveTextContent('Link 1');
  });

  it('renders a disabled span when disabled', () => {
    const { container } = render(<MenuLink {...menuItem} isDisabled />);

    expect(container.firstChild).toHaveClass('breadCrumb__disabledLink');
  });
});
