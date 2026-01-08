import { render, screen } from '@testing-library/react';
import TextHeader from '../TextHeader';

describe('<TextHeader />', () => {
  const props = {
    value: 'value',
  };
  it('renders the correct content', () => {
    render(<TextHeader {...props} />);
    expect(screen.getByTestId('TextHeader')).toHaveTextContent('value');
  });
});
