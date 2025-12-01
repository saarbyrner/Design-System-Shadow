import { render, screen } from '@testing-library/react';
import TextHeader from '../TextHeader';

describe('<TextHeader />', () => {
  const props = {
    value: 'Ibuprofen Jr Strength',
  };

  it('displays the correct text value', async () => {
    render(<TextHeader {...props} />);
    expect(screen.getByText('Ibuprofen Jr Strength')).toBeInTheDocument();
  });
});
