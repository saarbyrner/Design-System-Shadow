import { render, screen } from '@testing-library/react';
import { TextCell, MedicationCell, DirectionsCell } from '../TextCell';

describe('<TextCell />', () => {
  const props = {
    value: 'Ibuprofen Jr Strength',
  };

  it('displays the correct text cell value', async () => {
    render(<TextCell {...props} />);
    expect(screen.getByText('Ibuprofen Jr Strength')).toBeInTheDocument();
  });
});

describe('<MedicationCell />', () => {
  const props = {
    medication: 'Ibuprofen Jr Strength',
  };

  it('displays the correct text cell value', async () => {
    render(<MedicationCell {...props} />);
    expect(screen.getByText('Ibuprofen Jr Strength')).toBeInTheDocument();
  });
});

describe('<DirectionsCell />', () => {
  const props = {
    value: 'Take once a day',
  };

  it('displays the correct text cell value', async () => {
    render(<DirectionsCell {...props} />);
    expect(screen.getByText('Take once a day')).toBeInTheDocument();
  });
});
