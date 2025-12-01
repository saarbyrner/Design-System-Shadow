import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as useEventTrackingModule from '@kitman/common/src/hooks/useEventTracking';

import OverlaySection from '..';

describe('Graph Composer <OverlaySection /> component', () => {
  const defaultProps = {
    metricIndex: 0,
    overlays: [
      {
        summary: 'mean',
        population: 'entire_squad',
        timePeriod: 'custom',
        dateRange: { start_date: '2023-01-01', end_date: '2023-01-31' },
      },
      {
        summary: 'min',
        population: 'position_68',
        timePeriod: 'yesterday',
        dateRange: null,
      },
    ],
    addOverlay: jest.fn(),
    deleteOverlay: jest.fn(),
    updateOverlaySummary: jest.fn(),
    updateOverlayPopulation: jest.fn(),
    updateOverlayTimePeriod: jest.fn(),
    updateOverlayDateRange: jest.fn(),
    turnaroundList: [],
    athleteGroupsDropdown: [{ id: 'entire_squad', name: 'Entire Squad' }],
    t: (key) => key,
  };

  let trackEventMock;

  beforeEach(() => {
    trackEventMock = jest.fn();
    jest.spyOn(useEventTrackingModule, 'default').mockReturnValue({
      trackEvent: trackEventMock,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders component with correct structure', () => {
    render(<OverlaySection {...defaultProps} />);

    expect(screen.getByRole('button', { name: 'Overlay' })).toBeInTheDocument();
  });

  it('displays overlay forms for each overlay', () => {
    render(<OverlaySection {...defaultProps} />);

    expect(screen.getAllByText('Overlay Type')).toHaveLength(2);
    expect(screen.getAllByText('Comparison Group')).toHaveLength(2);

    // Should have delete buttons for each overlay
    const deleteButtons = screen
      .getAllByRole('button')
      .filter((button) => button.classList.contains('icon-close'));

    expect(deleteButtons).toHaveLength(2);
  });

  it('calls trackEvent and addOverlay when add overlay button is clicked', async () => {
    const user = userEvent.setup();

    render(<OverlaySection {...defaultProps} />);

    const addButton = screen.getByRole('button', { name: 'Overlay' });
    await user.click(addButton);

    expect(trackEventMock).toHaveBeenCalledWith('Graph Builder: Add Overlay');
    expect(defaultProps.addOverlay).toHaveBeenCalledTimes(1);
  });

  it('calls updateOverlaySummary when overlay type is changed', async () => {
    const user = userEvent.setup();

    render(<OverlaySection {...defaultProps} />);

    // Get all dropdown rows and target the second one (index 1)
    const overlayRows = screen
      .getAllByText('Overlay Type')
      .map((element) => element.closest('.row'));

    // Click on the overlay type dropdown button in the second row
    const secondRowButton = overlayRows[1].querySelector('.col-xl-2 button');
    expect(secondRowButton).toBeInTheDocument();
    await user.click(secondRowButton);

    // Get all Max options and click the one in the second dropdown (last in list)
    const maxOptions = screen.getAllByText('Max');
    await user.click(maxOptions[maxOptions.length - 1]);

    expect(defaultProps.updateOverlaySummary).toHaveBeenCalledWith(1, 'max');
  });

  it('calls updateOverlayPopulation when comparison group is changed', async () => {
    const user = userEvent.setup();

    render(<OverlaySection {...defaultProps} />);

    // Get all dropdown rows and target the second one (index 1)
    const overlayRows = screen
      .getAllByText('Comparison Group')
      .map((element) => element.closest('.row'));

    const secondRowButton = overlayRows[1].querySelector('.col-xl-3 button');
    expect(secondRowButton).toBeInTheDocument();
    await user.click(secondRowButton);

    // Get all Entire Squad options and click the one from the dropdown menu (not the displayed value)
    const entireSquadOptions = screen.getAllByText('Entire Squad');
    // Click the option in the dropdown menu for the second row
    await user.click(entireSquadOptions[entireSquadOptions.length - 1]);

    expect(defaultProps.updateOverlayPopulation).toHaveBeenCalledWith(
      1,
      'entire_squad'
    );
  });

  it('calls updateOverlayTimePeriod when time period is changed', async () => {
    const user = userEvent.setup();

    render(<OverlaySection {...defaultProps} />);

    // Get all dropdown rows and target the second one (index 1) for Date Range
    const overlayRows = screen
      .getAllByText('Date Range')
      .map((element) => element.closest('.row'));

    const secondRowButton = overlayRows[1].querySelector('.col-xl-3 button');
    expect(secondRowButton).toBeInTheDocument();
    await user.click(secondRowButton);

    // Click on "Today" option
    const todayOption = screen.getAllByText('Today')[1]; // Get the second "Today" option
    await user.click(todayOption);

    expect(defaultProps.updateOverlayTimePeriod).toHaveBeenCalledWith(
      1,
      'today'
    );
  });

  it('calls deleteOverlay when delete button is clicked', async () => {
    const user = userEvent.setup();

    render(<OverlaySection {...defaultProps} />);

    // Get all delete buttons and click the second one
    const deleteButtons = screen
      .getAllByRole('button')
      .filter((button) => button.classList.contains('icon-close'));

    await user.click(deleteButtons[1]);

    expect(defaultProps.deleteOverlay).toHaveBeenCalledWith(1);
  });

  it('does not display overlay forms when no overlays exist', () => {
    render(<OverlaySection {...defaultProps} overlays={[]} />);

    expect(screen.queryByText('Overlay Type')).not.toBeInTheDocument();
    expect(screen.queryByText('Comparison Group')).not.toBeInTheDocument();

    // Add overlay button should still be present
    expect(screen.getByRole('button', { name: 'Overlay' })).toBeInTheDocument();
  });

  it('renders correct number of forms based on overlays length', () => {
    const singleOverlayProps = {
      ...defaultProps,
      overlays: [defaultProps.overlays[0]],
    };
    render(<OverlaySection {...singleOverlayProps} />);

    expect(screen.getByText('Overlay Type')).toBeInTheDocument();
    expect(screen.getByText('Comparison Group')).toBeInTheDocument();

    const deleteButtons = screen
      .getAllByRole('button')
      .filter((button) => button.classList.contains('icon-close'));
    expect(deleteButtons).toHaveLength(1);
  });
});
