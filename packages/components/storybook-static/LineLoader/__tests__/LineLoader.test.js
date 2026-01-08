import { render, screen } from '@testing-library/react';
import LineLoader from '..';

describe('<LineLoader /> component', () => {
  it('sets the line animation from left to right by default', () => {
    render(<LineLoader />);
    expect(screen.getByRole('progressbar').querySelector('div')).toHaveStyle({
      animation: 'animation-1xz5shu 2s linear infinite forwards',
    });
  });

  it('sets the line animation from right to left when direction is left', () => {
    render(<LineLoader direction="left" />);
    expect(screen.getByRole('progressbar').querySelector('div')).toHaveStyle({
      animation: 'animation-1ib17ff 2s linear infinite forwards',
    });
  });
});
