import { render, screen } from '@testing-library/react';
import NoResultsMessage from '..';

describe('<NoResultsMessage />', () => {
  const props = {
    innerHtml: () => <h1>test html</h1>,
    isVisible: false,
  };

  it('renders correctly', () => {
    render(<NoResultsMessage {...props} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('is hidden when "isVisible" is false', () => {
    render(<NoResultsMessage {...props} />);

    expect(screen.getByRole('alert')).not.toHaveClass(
      'noResultsMessage--isVisible'
    );
  });

  it('is visible when "isVisible" is true', () => {
    render(<NoResultsMessage {...props} isVisible />);

    expect(screen.getByRole('alert')).toHaveClass(
      'noResultsMessage--isVisible'
    );
  });

  it('displays the correct inner html', () => {
    render(<NoResultsMessage {...props} isVisible />);

    expect(screen.getByRole('alert').querySelector('h1')).toHaveTextContent(
      'test html'
    );
  });
});
