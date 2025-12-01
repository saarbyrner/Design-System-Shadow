import { render, screen } from '@testing-library/react';
import TextCell from '../TextCell';

describe('<TextCell />', () => {
  const props = {
    value: 'value',
  };
  it('renders the correct content', () => {
    render(<TextCell {...props} />);
    expect(screen.getByText('value')).toBeInTheDocument();
  });
});
