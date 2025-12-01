import { render, screen } from '@testing-library/react';
import TooltipDropdown from '../TooltipDropdown';

describe('<TooltipDropdown /> component', () => {
  const menuItems = [
    { label: 'Link 1', url: 'path/to/link1' },
    { label: 'Link 2', url: 'path/to/link2' },
  ];

  const props = {
    dropdownItems: menuItems,
    selectedMenuItemName: 'Link 2',
    isDisabled: false,
  };

  it('renders', () => {
    render(<TooltipDropdown {...props} />);
    expect(screen.getByText('Link 2')).toBeInTheDocument();
  });

  it('shows the currently selected menu item', () => {
    render(<TooltipDropdown {...props} />);
    // check if the current item is rendered
    expect(screen.getByText('Link 2')).toBeInTheDocument();
    // ▼ is the down arrow
    expect(screen.getByText('▼')).toBeInTheDocument();
  });

  describe('when disabled', () => {
    it('disables the dropdown', () => {
      render(<TooltipDropdown {...props} isDisabled />);

      expect(screen.getByText('Link 2')).toHaveClass(
        'breadCrumb__currentItem--disabled'
      );
    });
  });
});
