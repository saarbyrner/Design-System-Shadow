import { render, screen } from '@testing-library/react';
import PageHeader from '..';

describe('<PageHeader />', () => {
  it('Renders the component', () => {
    render(<PageHeader />);
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });

  it('has no margin when noMargin is true', () => {
    render(<PageHeader />);
    expect(screen.getByRole('heading')).not.toHaveClass('pageHeader--noMargin');
  });
});
