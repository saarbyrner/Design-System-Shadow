import { render, screen, fireEvent } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import AthleteFilters from '../index';

describe('AthleteFilters component', () => {
  const props = {
    athletes: [],
    isExpanded: true,
    selectedGroupBy: 'availability',
    selectedAlarmFilters: ['inAlarm', 'noAlarms'],
    selectedAthleteFilters: [],
    selectedAvailabilityFilters: [],
    showAlarmFilter: true,
    showAvailabilityFilter: true,
    t: i18nextTranslateStub(),
    updateFilterOptions: jest.fn(),
  };

  beforeEach(() => {
    window.featureFlags = {};
  });

  it('renders', () => {
    render(<AthleteFilters {...props} />);
    expect(screen.getByText('Apply')).toBeInTheDocument();
  });

  it('renders the group selector dropdown', () => {
    render(<AthleteFilters {...props} />);
    expect(screen.getByText('Group By')).toBeInTheDocument();
  });

  it('calls updateFilterOptions when Apply button is clicked', () => {
    render(<AthleteFilters {...props} />);
    fireEvent.click(screen.getByText('Apply'));

    expect(props.updateFilterOptions).toHaveBeenCalledWith(
      'availability',
      ['inAlarm', 'noAlarms'],
      [],
      []
    );
  });

  it('does not render alarm filter if showAlarmFilter is false', () => {
    render(<AthleteFilters {...props} showAlarmFilter={false} />);
    expect(screen.queryByText('Filter Status')).not.toBeInTheDocument();
  });

  it('renders alarm filter when enabled', () => {
    render(<AthleteFilters {...props} />);
    expect(screen.getByText('Filter Status')).toBeInTheDocument();
  });

  it('renders availability filter when enabled', () => {
    render(<AthleteFilters {...props} />);
    expect(screen.getByText('Filter Availability')).toBeInTheDocument();
  });

  it('does not render availability filter when disabled', () => {
    render(<AthleteFilters {...props} showAvailabilityFilter={false} />);
    expect(
      screen.queryByLabelText('Filter Availability')
    ).not.toBeInTheDocument();
  });
});
