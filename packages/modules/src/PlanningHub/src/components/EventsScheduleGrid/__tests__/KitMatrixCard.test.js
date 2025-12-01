import { render } from '@testing-library/react';
import KitMatrixCard from '../KitMatrixCard';

describe('KitMatrixCard Component', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(
      <KitMatrixCard backgroundColor="ffffff" type="player" />
    );

    const card = getByTestId('KitMatrixCard');
    expect(card).toBeInTheDocument();
  });

  it('applies background color correctly', () => {
    const { getByTestId } = render(
      <KitMatrixCard backgroundColor="c0ffee" type="home-player" />
    );

    const card = getByTestId('KitMatrixCard');
    expect(card).toHaveStyle({ backgroundColor: '#c0ffee' });
  });
});
