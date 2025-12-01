import { render, screen } from '@testing-library/react';
import AthleteInfo from '../../components/AthleteInfo';

function buildAthlete(availability, lastname = 'Bar Baz 1') {
  return {
    id: 0,
    firstname: 'Foo',
    lastname,
    shortname: 'F. Johnson',
    availability,
    position: 'Blindside Flanker',
    positionGroup: 'Back',
    avatar_url: '/img.png',
    fullname: 'Foo Johnson',
    comment: 'Dummy comment',
    indications: { stiffness: { 'Left Pectoral': 3 } },
  };
}

describe('<AthleteInfo/>', () => {
  const groupingLabels = {
    unavailable: 'Unavailable',
    available: 'Available',
    injured: 'Available (Injured)',
    returning: 'Available (Returning from injury)',
    screened: 'Screened Today',
    not_screened: 'Not Screened Today',
  };
  const baseProps = {
    athlete: buildAthlete('unavailable', 'Johnson'),
    groupBy: 'position',
    groupingLabels,
    canViewAvailability: true,
    canManageAvailability: true,
    indicationTypes: {},
  };

  it('renders athlete shortname', () => {
    render(<AthleteInfo {...baseProps} />);
    expect(screen.getByText(baseProps.athlete.shortname)).toBeInTheDocument();
  });

  it('shows availability class changes with availability value', () => {
    const { container, rerender } = render(<AthleteInfo {...baseProps} />);
    const firstSpan = container.querySelector('.km-availability-triangle');
    expect(firstSpan).toHaveClass('km-availability-unavailable');

    const updated = {
      ...baseProps,
      athlete: buildAthlete('injured', 'Johnson'),
    };
    rerender(<AthleteInfo {...updated} />);
    const updatedSpan = container.querySelector('.km-availability-triangle');
    expect(updatedSpan).toHaveClass('km-availability-injured');
  });

  it('shows indications icon when indications exist', () => {
    const { container } = render(<AthleteInfo {...baseProps} />);
    expect(container.querySelector('.icon-stiffness')).toBeInTheDocument();
  });

  it('shows comment icon when comment exists', () => {
    const { container } = render(<AthleteInfo {...baseProps} />);
    expect(container.querySelector('.icon-bubble')).toBeInTheDocument();
  });

  it('hides availability triangle when user lacks view and manage permissions', () => {
    const props = {
      ...baseProps,
      canViewAvailability: false,
      canManageAvailability: false,
    };
    const { container } = render(<AthleteInfo {...props} />);
    expect(
      container.querySelector('.km-availability-triangle')
    ).not.toBeInTheDocument();
  });

  it('shows availability triangle when user can view but not manage', () => {
    const props = { ...baseProps, canManageAvailability: false };
    const { container } = render(<AthleteInfo {...props} />);
    expect(
      container.querySelector('.km-availability-triangle')
    ).toBeInTheDocument();
  });
});
