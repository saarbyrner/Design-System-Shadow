import { screen, render } from '@testing-library/react';
import DrawerToggle from '../DrawerToggle';

const props = {
  onToggle: jest.fn(),
  isOpen: false,
};

describe('<DrawerToggle/>', () => {
  test('closed state', () => {
    render(<DrawerToggle {...props} />);
    expect(screen.getByTestId('ChevronRightIcon')).toBeInTheDocument();
  });

  test('open state', () => {
    render(<DrawerToggle {...props} isOpen />);
    expect(screen.getByTestId('ChevronLeftIcon')).toBeInTheDocument();
  });
});
