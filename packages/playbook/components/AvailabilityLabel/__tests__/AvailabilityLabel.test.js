import { screen, render } from '@testing-library/react';
import AvailabilityLabel from '..';

const mockAvailabilityStatus = {
  availability: 'available',
  unavailable_since: null,
};
const mockAvailabilityStatusInjured = {
  availability: 'injured',
  unavailable_since: '11 days',
};

describe('<AvailabilityLabel />', () => {
  const defaultProps = {
    status: mockAvailabilityStatus,
  };

  // Athlete being available = no unavailableSince value
  it('renders the availability status correctly when athlete is Available', () => {
    render(<AvailabilityLabel {...defaultProps} />);

    const container = screen.getAllByTestId('Storybook|AvailabilityLabel')[0];
    const availabilityStatus = container.querySelectorAll('p')[0];
    const unavailableSince = container.querySelectorAll('p')[1];

    expect(availabilityStatus).toHaveStyle({ textTransform: 'capitalize' });
    expect(availabilityStatus.textContent.toLowerCase()).toEqual(
      defaultProps.status.availability
    );
    expect(unavailableSince).toBeUndefined();
  });

  it('renders the availability status correctly when athlete is Unavailable', () => {
    render(<AvailabilityLabel status={mockAvailabilityStatusInjured} />);

    const container = screen.getAllByTestId('Storybook|AvailabilityLabel')[0];
    const availabilityStatus = container.querySelectorAll('p')[0];
    const unavailableSince = container.querySelectorAll('p')[1];

    expect(availabilityStatus).toHaveStyle({ textTransform: 'capitalize' });
    expect(availabilityStatus.textContent.toLowerCase()).toEqual(
      'available (injured/ill)'
    );
    expect(unavailableSince).toHaveTextContent('11 days');
  });
});
