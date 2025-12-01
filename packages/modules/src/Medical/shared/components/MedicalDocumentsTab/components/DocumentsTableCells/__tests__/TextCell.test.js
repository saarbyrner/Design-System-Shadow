import { render, screen } from '@testing-library/react';
import TextCell from '../TextCell';

describe('<TextCell />', () => {
  const props = {
    value: 'Ibuprofen Jr Strength',
  };

  it('displays the correct text cell value', async () => {
    render(<TextCell {...props} />);
    expect(screen.getByText('Ibuprofen Jr Strength')).toBeInTheDocument();
  });
});
