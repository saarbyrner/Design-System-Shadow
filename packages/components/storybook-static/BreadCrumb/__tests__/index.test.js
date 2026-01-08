import { render, screen } from '@testing-library/react';
import BreadCrumb from '../index';

describe('<BreadCrumb /> shared component', () => {
  const props = {
    children: [<span key={0}>Menu 1</span>, <span key={1}>Menu 2</span>],
  };

  it('renders the menu items', () => {
    render(<BreadCrumb {...props} />);
    expect(screen.getByText('Menu 1')).toBeInTheDocument();
    expect(screen.getByText('»')).toBeInTheDocument();
    expect(screen.getByText('Menu 2')).toBeInTheDocument();
  });
});
