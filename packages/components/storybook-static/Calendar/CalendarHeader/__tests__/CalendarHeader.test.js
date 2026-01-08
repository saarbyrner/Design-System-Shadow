import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import coreEngagementEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/coreEngagement';
import { CalendarHeader, settingsSidePanelButtonTestId } from '../index';

jest.mock('@kitman/common/src/hooks/useEventTracking');

describe('<CalendarHeader />', () => {
  const mockTrackEvent = jest.fn();

  const props = {
    calendarRef: { current: { getApi: jest.fn() } },
    getAddEventMenuItems: () => [
      { description: 'Test Add Button', onClick: jest.fn() },
    ],
    initialView: 'dayGridMonth',
    openSettingsPanel: jest.fn(),
    setIsFiltersPanelOpen: jest.fn(),
    isFiltersPanelOpen: false,
    numberOfActiveFilters: 0,
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    useEventTracking.mockReturnValue({ trackEvent: mockTrackEvent });
    window.featureFlags['hide-calendar-settings-cog'] = true;
    window.featureFlags['optimized-calendar'] = true; // Enable the feature flag for the filter button
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
    window.featureFlags['hide-calendar-settings-cog'] = false;
    window.featureFlags['calendar-navigation-improvements'] = false;
    window.featureFlags['optimized-calendar'] = false; // Reset the feature flag
  });

  it('renders initial view properly', () => {
    render(<CalendarHeader {...props} />);

    expect(screen.getByText('Today')).toBeInTheDocument();

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toEqual(6);
  });

  it('can show view options', async () => {
    render(<CalendarHeader {...props} />);

    const initialViewText = 'Month';
    const viewOptionsButton = screen.getByRole('button', {
      name: initialViewText,
    });

    expect(viewOptionsButton).toBeInTheDocument();
    await userEvent.click(viewOptionsButton);
    await waitFor(() => {
      expect(screen.getByText('Day')).toBeInTheDocument();
      expect(screen.getByText('Week')).toBeInTheDocument();
      expect(screen.getAllByText(initialViewText).length).toBe(2);
      expect(screen.getByText('List')).toBeInTheDocument();
    });
  });

  it('shows the add event menu options', async () => {
    render(<CalendarHeader {...props} />);

    await userEvent.click(screen.getByTestId('CalendarHeader|TooltipMenu|Add'));
    await waitFor(() => {
      expect(
        screen.getByText(props.getAddEventMenuItems()[0].description)
      ).toBeInTheDocument();
    });
  });

  it('should not render the calendar setting button if the hide-calendar-settings-cog FF is on', () => {
    render(<CalendarHeader {...props} />);
    expect(
      screen.queryByTestId(settingsSidePanelButtonTestId)
    ).not.toBeInTheDocument();
  });

  it('should render the calendar settings button', () => {
    window.featureFlags['hide-calendar-settings-cog'] = false;
    render(<CalendarHeader {...props} />);
    expect(
      screen.getByTestId(settingsSidePanelButtonTestId)
    ).toBeInTheDocument();
  });

  it('Open the calendar date picker when clicking on the date button', async () => {
    window.featureFlags['calendar-navigation-improvements'] = true;
    const fakeDate = new Date('2024-01-15T12:00:00Z');

    props.calendarRef.current.getApi.mockReturnValue({
      currentData: { viewTitle: 'January 2024' },
      getDate: () => fakeDate,
      on: jest.fn(),
    });

    jest.useFakeTimers();
    jest.setSystemTime(fakeDate);

    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <CalendarHeader {...props} />
      </LocalizationProvider>
    );

    const dateButton = screen.getByRole('button', { name: /2024/ });
    expect(dateButton).toBeInTheDocument();
    await user.click(dateButton);

    await waitFor(() => {
      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
      expect(within(dialog).getByText('January 2024')).toBeInTheDocument();
    });
  });

  it('should open the filter panel when clicking on the filter button', async () => {
    const user = userEvent.setup();
    const mockSetIsFiltersPanelOpen = jest.fn();
    render(
      <CalendarHeader
        {...props}
        numberOfActiveFilters={2}
        isFiltersPanelOpen={false}
        setIsFiltersPanelOpen={mockSetIsFiltersPanelOpen}
      />
    );

    const filterButton = screen.getByRole('button', { name: /Show Filters/ });
    expect(filterButton).toBeInTheDocument();
    await user.click(filterButton);

    expect(mockSetIsFiltersPanelOpen).toHaveBeenCalledWith(true); // From original test
    expect(mockTrackEvent).toHaveBeenCalledWith(
      coreEngagementEventNames.calendarFiltersClicked,
      { Location: 'Calendar', 'User Type': 'Staff' }
    );
  });

  describe('Tracking events', () => {
    const getApiMock = jest.fn();
    const propsWithCalendarApi = {
      ...props,
      calendarRef: {
        current: {
          getApi: getApiMock,
        },
      },
    };

    beforeEach(() => {
      getApiMock.mockReturnValue({
        prev: jest.fn(),
        next: jest.fn(),
        today: jest.fn(),
        changeView: jest.fn(),
        currentData: { viewTitle: 'January 2024' },
        getDate: () => new Date('2024-01-15T12:00:00Z'),
      });
    });

    it('fires a tracking event when the "prev" button is clicked', async () => {
      const user = userEvent.setup();
      render(<CalendarHeader {...propsWithCalendarApi} />);

      const allNamelessButtons = screen.getAllByRole('button', { name: '' });
      const prevButton = allNamelessButtons.find((button) =>
        button.querySelector('.icon-next-left')
      );
      await user.click(prevButton);

      expect(mockTrackEvent).toHaveBeenCalledWith(
        coreEngagementEventNames.calendarPreviousPeriodClicked,
        { Location: 'Calendar', 'User Type': 'Staff' }
      );
    });

    it('fires a tracking event when the "next" button is clicked', async () => {
      const user = userEvent.setup();
      render(<CalendarHeader {...propsWithCalendarApi} />);

      const allNamelessButtons = screen.getAllByRole('button', { name: '' });
      const nextButton = allNamelessButtons.find((button) =>
        button.querySelector('.icon-next-right')
      );
      await user.click(nextButton);

      expect(mockTrackEvent).toHaveBeenCalledWith(
        coreEngagementEventNames.calendarNextPeriodClicked,
        { Location: 'Calendar', 'User Type': 'Staff' }
      );
    });

    it('fires a tracking event when the "Today" button is clicked', async () => {
      const user = userEvent.setup();
      render(<CalendarHeader {...propsWithCalendarApi} />);

      await user.click(screen.getByRole('button', { name: 'Today' }));

      expect(mockTrackEvent).toHaveBeenCalledWith(
        coreEngagementEventNames.calendarTodayClicked,
        { Location: 'Calendar', 'User Type': 'Staff' }
      );
    });

    it('fires a tracking event when a view option is clicked', async () => {
      const user = userEvent.setup();
      render(<CalendarHeader {...propsWithCalendarApi} />);

      await user.click(screen.getByRole('button', { name: 'Month' }));
      await user.click(await screen.findByRole('button', { name: 'Week' }));

      expect(mockTrackEvent).toHaveBeenCalledWith(
        coreEngagementEventNames.calendarViewFormatClicked,
        { selected_view: 'week' }
      );
    });

    it('fires a tracking event when the date picker is opened', async () => {
      window.featureFlags['calendar-navigation-improvements'] = true;
      const user = userEvent.setup();
      render(
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <CalendarHeader {...propsWithCalendarApi} />
        </LocalizationProvider>
      );
      await user.click(screen.getByRole('button', { name: /2024/ }));
      expect(mockTrackEvent).toHaveBeenCalledWith(
        coreEngagementEventNames.calendarDatePickerClicked
      );
    });
  });
});
