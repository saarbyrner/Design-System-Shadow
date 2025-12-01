import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import moment from 'moment';

import Calendar from '../index';
import { renderWithProvider } from './helpers';
import { numberOfActiveFilters, props } from './consts';
import { settingsSidePanelButtonTestId } from '../CalendarHeader';
import { calendarViewOptionEnumLike } from '../utils/enum-likes';

describe('<Calendar /> component', () => {
  beforeEach(() => {
    window.featureFlags['hide-calendar-settings-cog'] = true;
  });

  afterEach(() => {
    window.featureFlags['hide-calendar-settings-cog'] = false;
  });
  const viewOptionsButtonTestId = 'CalendarHeader|TooltipMenu|ViewOptions';

  /**
   * @param {"Month"| "Week" | "Day"| "List"} newViewText
   */
  const changeView = async (newViewText) => {
    if (window.featureFlags['optimized-calendar'] === true) {
      await userEvent.click(screen.getByTestId(viewOptionsButtonTestId));
      const allButtonsByNewViewText = screen.getAllByText(newViewText);
      if (allButtonsByNewViewText.length === 1) {
        // the chosen view is not the selected one
        await userEvent.click(allButtonsByNewViewText[0]);
      } else {
        // already selected
        await userEvent.click(allButtonsByNewViewText[1]);
      }
    } else {
      await userEvent.click(screen.getByText(newViewText));
    }
  };
  it('renders the component', () => {
    renderWithProvider(<Calendar {...props} />);
    expect(screen.getByText('Today')).toBeInTheDocument();
  });

  it('should NOT contain the button that opens the filters drawer, because the optimized-calendar FF is disabled', () => {
    renderWithProvider(<Calendar {...props} />);
    const button = screen.queryByRole('button', {
      name: 'Show Filters',
    });
    expect(button).not.toBeInTheDocument();
  });

  it('should NOT contain the Add button when the optimized-calendar FF is disabled', () => {
    renderWithProvider(<Calendar {...props} />);
    const addButton = screen.queryByTestId('CalendarHeader|TooltipMenu|Add');
    expect(addButton).not.toBeInTheDocument();
  });

  it('should NOT contain a dropdown with view options when the optimized-calendar FF is disabled', () => {
    renderWithProvider(<Calendar {...props} />);
    const viewOptionsButton = screen.queryByTestId(viewOptionsButtonTestId);
    expect(viewOptionsButton).not.toBeInTheDocument();
  });

  describe('start day', () => {
    const getFirstHeader = () => screen.getAllByRole('columnheader')[0];

    it('should start on Monday when the FF is off', () => {
      renderWithProvider(<Calendar {...props} />);
      const firstHeader = getFirstHeader();
      expect(firstHeader).toHaveTextContent('Mon');
    });

    describe('when the calendar-sunday-start ff is enabled', () => {
      beforeEach(() => {
        window.featureFlags['calendar-sunday-start'] = true;
      });

      afterEach(() => {
        window.featureFlags['calendar-sunday-start'] = false;
      });
      it('should start on Sunday when the FF is off', () => {
        renderWithProvider(<Calendar {...props} />);
        const firstHeader = getFirstHeader();
        expect(firstHeader).toHaveTextContent('Sun');
      });
    });
  });

  describe('all-day slot', () => {
    const firstRowSelector = 'tbody > tr[role="row"]';
    const allDaySlotText = 'all-day';
    it('should show the all-day slot when the FF is off', async () => {
      const { container } = renderWithProvider(<Calendar {...props} />);
      await changeView('Day');
      expect(container.querySelector(firstRowSelector)).toHaveTextContent(
        allDaySlotText
      );
    });

    describe('when the calendar-hide-all-day-slot flag is on', () => {
      beforeEach(() => {
        window.featureFlags['calendar-hide-all-day-slot'] = true;
      });

      afterEach(() => {
        window.featureFlags['calendar-hide-all-day-slot'] = false;
      });
      it('should NOT show the all-day slot because the FF is on', async () => {
        const { container } = renderWithProvider(<Calendar {...props} />);
        await changeView('Day');
        expect(container.querySelector(firstRowSelector)).not.toHaveTextContent(
          allDaySlotText
        );
      });
    });
  });

  describe('when the optimized-calendar FF is enabled', () => {
    beforeEach(() => {
      window.featureFlags['optimized-calendar'] = true;
    });

    afterEach(() => {
      window.featureFlags['optimized-calendar'] = false;
    });

    const showFiltersText = 'Show Filters';

    const getShowFiltersButton = () =>
      screen.getByRole('button', {
        name: showFiltersText,
      });

    it('should contain the button that opens the filters drawer', () => {
      renderWithProvider(<Calendar {...props} />);
      const button = getShowFiltersButton();
      expect(button).toBeInTheDocument();
      expect(
        button.parentElement?.querySelector('span.MuiBadge-badge')
      ).toHaveTextContent(numberOfActiveFilters);
    });

    it('should contain the Add button', () => {
      renderWithProvider(<Calendar {...props} />);
      const addButton = screen.getByTestId('CalendarHeader|TooltipMenu|Add');
      expect(addButton).toBeInTheDocument();
    });

    it('should contain a dropdown with view options', () => {
      renderWithProvider(<Calendar {...props} />);
      const viewOptionsButton = screen.getByTestId(viewOptionsButtonTestId);
      expect(viewOptionsButton).toBeInTheDocument();
    });

    describe('calendar settings', () => {
      const panelTitle = 'Calendar Settings';
      it('should not be able to find the settings panel', () => {
        renderWithProvider(<Calendar {...props} />);
        expect(screen.queryByText(panelTitle)).not.toBeInTheDocument();
      });

      it('should be able to find the settings panel after clicking on the cogwheel button', async () => {
        window.featureFlags['hide-calendar-settings-cog'] = false;
        renderWithProvider(<Calendar {...props} />);
        await userEvent.click(
          screen.getByTestId(settingsSidePanelButtonTestId)
        );
        expect(screen.getByText(panelTitle)).toBeInTheDocument();
      });
    });
  });

  describe('event data', () => {
    const {
      title,
      extendedProps: {
        squad: { name: squadName },
      },
    } = props.events[0];
    const firstEventTime = '1:00pm - 2:00pm';

    const fourthOfMarch2024 = new Date('2024-03-04T00:00:01Z');

    const getEventContainer = () => {
      const eventTitleElement = screen.getByText(title);
      expect(eventTitleElement).toBeInTheDocument();
      const eventContainer = eventTitleElement.parentElement.parentElement;
      return eventContainer;
    };

    beforeEach(() => {
      jest.useFakeTimers().setSystemTime(fourthOfMarch2024);
      moment.tz.setDefault('UTC');
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should display the correct data for an event - day', async () => {
      renderWithProvider(
        <Calendar
          {...props}
          selectedCalendarView={calendarViewOptionEnumLike.timeGridDay}
        />
      );

      expect(screen.getByText(title)).toBeInTheDocument();
      expect(screen.getByText(firstEventTime)).toBeInTheDocument();
      expect(screen.queryByText(squadName)).not.toBeInTheDocument();
    });

    it('should display the correct data for an event - week', async () => {
      renderWithProvider(
        <Calendar
          {...props}
          selectedCalendarView={calendarViewOptionEnumLike.timeGridWeek}
        />
      );
      expect(screen.getByText(title)).toBeInTheDocument();
      expect(screen.getByText(firstEventTime)).toBeInTheDocument();
      expect(screen.queryByText(squadName)).not.toBeInTheDocument();
    });

    it('should display the correct data for an event - month', async () => {
      renderWithProvider(
        <Calendar
          {...props}
          selectedCalendarView={calendarViewOptionEnumLike.dayGridMonth}
        />
      );
      expect(
        screen.getByText(`${title} ${firstEventTime}`)
      ).toBeInTheDocument();
      expect(screen.queryByText(squadName)).not.toBeInTheDocument();
    });

    it('should display the correct data for an event - list', async () => {
      renderWithProvider(
        <Calendar
          {...props}
          selectedCalendarView={calendarViewOptionEnumLike.listWeek}
        />
      );
      expect(screen.getByText(title)).toBeInTheDocument();
      expect(screen.getByText(firstEventTime)).toBeInTheDocument();
      expect(screen.queryByText(squadName)).not.toBeInTheDocument();
    });

    describe('with optimized-calendar FF on', () => {
      beforeEach(() => {
        window.featureFlags['optimized-calendar'] = true;
      });

      afterEach(() => {
        window.featureFlags['optimized-calendar'] = false;
      });

      it('should display the correct data for an event (with squad) - day', async () => {
        renderWithProvider(
          <Calendar
            {...props}
            selectedCalendarView={calendarViewOptionEnumLike.timeGridDay}
          />
        );

        const eventContainer = getEventContainer();
        const [timeElement, squadElement] = Array.from(
          eventContainer.querySelectorAll('p')
        ).slice(1);

        expect(timeElement).toHaveTextContent(firstEventTime);
        expect(squadElement).toHaveTextContent(squadName);
      });

      it('should display the correct data for an event (with squad) - week', async () => {
        renderWithProvider(
          <Calendar
            {...props}
            selectedCalendarView={calendarViewOptionEnumLike.timeGridWeek}
          />
        );
        const eventContainer = getEventContainer();
        const [timeElement, squadElement] = Array.from(
          eventContainer.querySelectorAll('p')
        ).slice(1);

        expect(timeElement).toHaveTextContent(firstEventTime);
        expect(squadElement).toHaveTextContent(squadName);
      });
    });

    describe('with event-collection-complete FF on', () => {
      const checkboxIconId = 'CheckBoxIcon';
      const checkBoxOutlineBlankIconId = 'CheckBoxOutlineBlankIcon';

      beforeEach(() => {
        window.setFlag('event-collection-complete', true);
      });

      afterEach(() => {
        window.setFlag('event-collection-complete', false);
      });

      const incompleteEventProps = props.events.map((event) => ({
        ...event,
        extendedProps: {
          ...event.extendedProps,
          eventCollectionComplete: false,
        },
      }));

      it('correctly displays checkbox when session is marked as complete - day', async () => {
        renderWithProvider(
          <Calendar
            {...props}
            selectedCalendarView={calendarViewOptionEnumLike.timeGridDay}
          />
        );

        // displays all items as complete
        expect(screen.getAllByTestId(checkboxIconId)).toHaveLength(2);
      });

      it('correctly displays checkbox when session is marked as incomplete - day', async () => {
        renderWithProvider(
          <Calendar
            {...props}
            events={incompleteEventProps}
            selectedCalendarView={calendarViewOptionEnumLike.timeGridDay}
          />
        );
        // displays all items as incomplete
        expect(screen.getAllByTestId(checkBoxOutlineBlankIconId)).toHaveLength(
          2
        );
      });

      it('correctly displays checkbox when session is marked as complete - week', async () => {
        renderWithProvider(
          <Calendar
            {...props}
            selectedCalendarView={calendarViewOptionEnumLike.timeGridWeek}
          />
        );
        // displays all items as complete
        expect(screen.getAllByTestId(checkboxIconId)).toHaveLength(3);
      });

      it('correctly displays checkbox when session is marked as incomplete - week', async () => {
        renderWithProvider(
          <Calendar
            {...props}
            events={incompleteEventProps}
            selectedCalendarView={calendarViewOptionEnumLike.timeGridWeek}
          />
        );

        // displays all items as incomplete
        expect(screen.getAllByTestId(checkBoxOutlineBlankIconId)).toHaveLength(
          3
        );
      });

      it('correctly displays checkbox when session is marked as complete - month', async () => {
        renderWithProvider(
          <Calendar
            {...props}
            selectedCalendarView={calendarViewOptionEnumLike.dayGridMonth}
          />
        );

        // displays all items as complete
        expect(screen.getAllByTestId(checkboxIconId)).toHaveLength(3);
      });

      it('correctly displays checkbox when session is marked as incomplete - month', async () => {
        renderWithProvider(
          <Calendar
            {...props}
            events={incompleteEventProps}
            selectedCalendarView={calendarViewOptionEnumLike.dayGridMonth}
          />
        );
        // displays all items as incomplete
        expect(screen.getAllByTestId(checkBoxOutlineBlankIconId)).toHaveLength(
          3
        );
      });
    });
  });
});
