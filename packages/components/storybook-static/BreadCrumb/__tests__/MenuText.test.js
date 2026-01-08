import { render, screen } from '@testing-library/react';
import MenuText from '../MenuText';

describe('<MenuText /> component', () => {
  const menuItem = { label: 'Item 1', isDisabled: false };

  it('renders the label', () => {
    render(<MenuText {...menuItem} />);
    expect(screen.getByText('Item 1')).toBeInTheDocument();
  });
});
