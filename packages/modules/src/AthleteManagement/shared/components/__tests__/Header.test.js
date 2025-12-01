import { screen, render } from '@testing-library/react';
import Header from '../Header';

describe('<Header/>', () => {
  const props = {
    title: 'A big string',
  };

  describe('renders the header', () => {
    it('renders the header', () => {
      render(<Header {...props} />);
      expect(screen.getByText('A big string')).toBeInTheDocument();
    });
  });
});
