import { render, screen } from '@testing-library/react';
import SearchBar from '..';

describe('<SearchBar />', () => {
  const props = {
    onChange: jest.fn(),
  };

  it('Renderes the correct content', () => {
    render(<SearchBar {...props} />);
    expect(screen.getByRole('search')).toBeInTheDocument();
  });

  it('renders correctly when passed an icon string', () => {
    render(<SearchBar {...props} icon="icon-test" />);
    expect(screen.getByRole('img')).toHaveClass('searchBar__icon icon-test');
  });

  it('renders the input correctly if passed a value for ignoreValidation', () => {
    render(<SearchBar {...props} ignoreValidation="false" />);
    expect(screen.getByRole('search').querySelector('input')).toHaveAttribute(
      'data-ignore-validation',
      'false'
    );
  });

  it('renders the input correctly if passed a value for placeholder', () => {
    render(<SearchBar {...props} placeholder="Search placeholder" />);
    expect(
      screen.getByPlaceholderText('Search placeholder')
    ).toBeInTheDocument();
  });

  it('renders the input correctly when it receives a value', () => {
    render(<SearchBar {...props} value="Search value" />);
    expect(screen.getByRole('search').querySelector('input')).toHaveValue(
      'Search value'
    );
  });
});
