import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import AvailabilityLabel from '..';

describe('<AvailabilityLabel />', () => {
  const props = {
    displaytext: false,
    t: i18nextTranslateStub(),
  };

  it('renders the component with default label', () => {
    render(<AvailabilityLabel {...props} />);
    expect(screen.getByText('Available')).toBeInTheDocument();
  });

  it('displays the status "Available"', () => {
    render(<AvailabilityLabel {...props} status="available" />);
    expect(screen.getByText('Available')).toBeInTheDocument();
    expect(screen.getByTestId('available-indicator')).toBeInTheDocument();
  });

  it('displays the status "Unavailable"', () => {
    render(<AvailabilityLabel {...props} status="unavailable" />);
    expect(screen.getByText('Unavailable')).toBeInTheDocument();
    expect(screen.getByTestId('unavailable-indicator')).toBeInTheDocument();
  });

  it('displays the status "Absent"', () => {
    render(<AvailabilityLabel {...props} status="absent" />);
    expect(screen.getByText('Absent')).toBeInTheDocument();
    expect(screen.getByTestId('absent-indicator')).toBeInTheDocument();
  });

  it('when the status is injured it displays the correct label', () => {
    render(<AvailabilityLabel {...props} status="injured" />);
    expect(screen.getByText('Available')).toBeInTheDocument();
    expect(screen.getByText('Injured/Ill')).toBeInTheDocument();
    expect(screen.getByTestId('injured-indicator')).toBeInTheDocument();
  });

  it('when the status is ill it displays the correct label', () => {
    render(<AvailabilityLabel {...props} status="ill" />);
    expect(screen.getByText('Available')).toBeInTheDocument();
    expect(screen.getByText('Injured/Ill')).toBeInTheDocument();
    expect(screen.getByTestId('ill-indicator')).toBeInTheDocument();
  });

  it('when the status is returning it displays the correct label', () => {
    render(<AvailabilityLabel {...props} status="returning" />);
    expect(screen.getByText('Available')).toBeInTheDocument();
    expect(
      screen.getByText('Returning from injury/illness')
    ).toBeInTheDocument();
    expect(screen.getByTestId('returning-indicator')).toBeInTheDocument();
  });

  it('when the displayText is false it does not render the label text', () => {
    render(<AvailabilityLabel {...props} displayText={false} />);
    expect(screen.queryByText('Available')).not.toBeInTheDocument();
  });
});
