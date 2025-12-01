import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OverlayForm from '..';

// Mock the TimePeriod component to test the custom date range functionality
jest.mock(
  '@kitman/modules/src/analysis/GraphComposer/src/components/GraphForm/TimePeriod',
  () => {
    return function MockTimePeriod(props) {
      return (
        <div data-testid="time-period-mock">
          <button
            type="button"
            onClick={() => props.updateTimePeriod('yesterday')}
            data-testid="mock-time-period-button"
          >
            Mock Time Period
          </button>
          <button
            type="button"
            onClick={() =>
              props.updateDateRange({
                start_date: '2018-10-01T00:00:00+01:00',
                end_date: '2018-10-20T00:00:00+01:00',
              })
            }
            data-testid="mock-date-range-button"
          >
            Mock Date Range
          </button>
        </div>
      );
    };
  }
);

describe('Graph Composer <OverlayForm /> component', () => {
  const props = {
    overlay: {
      summary: 'count',
      population: 'position_10',
    },
    turnaroundList: [],
    athleteGroupsDropdown: [{ id: 'entire_squad', name: 'entire squad' }],
    updateOverlaySummary: jest.fn(),
    updateOverlayPopulation: jest.fn(),
    updateOverlayTimePeriod: jest.fn(),
    updateOverlayDateRange: jest.fn(),
    deleteOverlay: jest.fn(),
    t: (text) => text,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component', () => {
    render(<OverlayForm {...props} />);

    expect(screen.getByText('Overlay Type')).toBeInTheDocument();
    expect(screen.getByText('Comparison Group')).toBeInTheDocument();

    const buttons = screen.getAllByRole('button');
    const deleteButton = buttons.find((button) =>
      button.classList.contains('icon-close')
    );

    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass(
      'iconButton--small',
      'iconButton--transparent'
    );
  });

  it('calls deleteOverlay callback when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(<OverlayForm {...props} />);

    const buttons = screen.getAllByRole('button');
    const deleteButton = buttons.find((button) =>
      button.classList.contains('icon-close')
    );

    await user.click(deleteButton);

    expect(props.deleteOverlay).toHaveBeenCalledTimes(1);
  });

  it('calls updateOverlaySummary callback when overlay type dropdown changes', async () => {
    const user = userEvent.setup();
    render(<OverlayForm {...props} />);

    const buttons = screen.getAllByRole('button');
    const overlayTypeButton = buttons.find(
      (button) =>
        button.parentElement?.querySelector('label')?.textContent ===
        'Overlay Type'
    );

    await user.click(overlayTypeButton);

    const minOption = screen.getByText('Min');

    await user.click(minOption);

    expect(props.updateOverlaySummary).toHaveBeenCalledWith('min');
  });

  it('calls updateOverlayPopulation callback when comparison group dropdown changes', async () => {
    const user = userEvent.setup();
    render(<OverlayForm {...props} />);

    const buttons = screen.getAllByRole('button');
    const comparisonButton = buttons.find(
      (button) =>
        button.parentElement?.querySelector('label')?.textContent ===
        'Comparison Group'
    );

    await user.click(comparisonButton);

    const entireSquadOption = screen.getByText('entire squad');

    await user.click(entireSquadOption);

    expect(props.updateOverlayPopulation).toHaveBeenCalledWith('entire_squad');
  });

  it('calls updateOverlayTimePeriod callback when time period is updated', async () => {
    const user = userEvent.setup();
    render(<OverlayForm {...props} />);

    // Use the mocked TimePeriod component button
    const mockTimePeriodButton = screen.getByTestId('mock-time-period-button');
    await user.click(mockTimePeriodButton);

    expect(props.updateOverlayTimePeriod).toHaveBeenCalledWith('yesterday');
  });

  it('calls updateOverlayDateRange callback when custom date range is updated', async () => {
    const user = userEvent.setup();
    const expectedDateRange = {
      start_date: '2018-10-01T00:00:00+01:00',
      end_date: '2018-10-20T00:00:00+01:00',
    };

    render(<OverlayForm {...props} />);

    // Use the mocked TimePeriod component button to trigger date range update
    const mockDateRangeButton = screen.getByTestId('mock-date-range-button');
    await user.click(mockDateRangeButton);

    expect(props.updateOverlayDateRange).toHaveBeenCalledWith(
      expectedDateRange
    );
  });
});
