import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { server, rest } from '@kitman/services/src/mocks/server';
import { eventTypeFilterEnumLike } from '@kitman/components/src/Calendar/CalendarFilters/utils/enum-likes';
import App from '../App';

describe('<App />', () => {
  let user;
  let baseProps;
  let preloadedState;

  beforeEach(() => {
    user = userEvent.setup();
    window.featureFlags = {};

    // Mock functions passed as props
    baseProps = {
      isGameModalOpen: false,
      isSessionModalOpen: false,
      isCustomEventModalOpen: false,
      isEventsPanelOpen: false,
      closeGameModal: jest.fn(),
      closeSessionModal: jest.fn(),
      closeCustomEventModal: jest.fn(),
      updateCalendarFilters: jest.fn(),
      openCustomEventModal: jest.fn(),
      openGameModal: jest.fn(),
      openSessionModal: jest.fn(),
      updateSquadSelection: jest.fn(),
      fetchEvents: jest.fn(),
      t: i18nextTranslateStub(),
      canCreateGames: true,
      canCreateCustomEvents: false,
      canShowTreatments: true,
      canShowRehab: true,
      calendarFilters: {
        squadSessionsFilter: true,
        individualSessionsFilter: true,
        gamesFilter: true,
        treatmentsFilter: true,
        rehabFilter: true,
        customEventsFilter: true,
      },
      calendarDates: {
        startDate: '2020-10-26T00:00:00+00:00',
        endDate: '2020-12-07T00:00:00+00:00',
      },
      squadSelection: {
        applies_to_squad: true,
        position_groups: [1],
        positions: [1],
        athletes: [1],
        all_squads: false,
        squads: [1],
      },
      squadAthletes: {
        position_groups: [
          {
            id: 1,
            name: 'Forwards',
            positions: [
              {
                id: 1,
                name: 'Goalkeeper',
                athletes: [
                  { id: 1, fullname: 'Alice Smith' },
                  { id: 3, fullname: 'Charlie Brown' },
                ],
              },
              {
                id: 2,
                name: 'Defender',
                athletes: [{ id: 2, fullname: 'Bob Jones' }],
              },
            ],
            athletes: [{ id: 1, fullname: 'Alice Smith' }],
          },
          {
            id: 2,
            name: 'Backs',
            positions: [
              {
                id: 3,
                name: 'Midfielder',
                athletes: [{ id: 4, fullname: 'David Lee' }],
              },
            ],
            athletes: [{ id: 2, fullname: 'Bob Jones' }],
          },
        ],
      },
      squads: [
        { id: 1, name: 'First Team' },
        { id: 2, name: 'Reserves' },
      ],
    };

    // Mock Redux state
    preloadedState = {
      calendarSettings: {},
      optimizedCalendarFilters: {},
      calendarPage: {
        isLoading: false,
        isError: false,
        events: [],
      },
      eventTooltip: { element: null },
      eventsPanel: { isOpen: false, mode: 'CREATE' },
      deleteEvent: { event: null },
      appStatus: { message: null, status: null },
      globalApi: {
        currentUser: { id: 1, name: 'Test User' },
        currentOrganisation: { id: 1, name: 'Test Organisation' },
      },
    };

    // Mock API for getSport call
    server.use(
      rest.get('/sport', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ duration: 90 }));
      })
    );
  });

  it('renders the main components like filter checkboxes', () => {
    renderWithRedux(<App {...baseProps} />, {
      useGlobalStore: false,
      preloadedState,
    });

    expect(screen.getByLabelText('Squad Sessions')).toBeInTheDocument();
    expect(screen.getByLabelText('Individual Sessions')).toBeInTheDocument();
    expect(screen.getByLabelText('Games')).toBeInTheDocument();
  });

  it('does not render treatments filter when canShowTreatments is false', () => {
    renderWithRedux(<App {...baseProps} canShowTreatments={false} />, {
      useGlobalStore: false,
      preloadedState,
    });

    expect(screen.queryByLabelText('Treatments')).not.toBeInTheDocument();
  });

  it('does not render rehab filter when canShowRehab is false', () => {
    renderWithRedux(<App {...baseProps} canShowRehab={false} />, {
      useGlobalStore: false,
      preloadedState,
    });

    expect(screen.queryByLabelText('Rehab')).not.toBeInTheDocument();
  });

  it('renders only Session and Game menu items when canCreateGames is true', async () => {
    renderWithRedux(<App {...baseProps} canCreateGames />, {
      useGlobalStore: false,
      preloadedState,
    });

    const addButton = screen.getAllByRole('button')[0];

    await user.click(addButton);

    expect(
      await screen.findByRole('button', { name: /Game/i })
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('button', { name: /Session/i })
    ).toBeInTheDocument();
  });

  it('renders only the Session menu item when canCreateGames is false', async () => {
    renderWithRedux(<App {...baseProps} canCreateGames={false} />, {
      preloadedState,
      useGlobalStore: false,
    });
    const addButton = screen.getAllByRole('button')[0];

    await user.click(addButton);

    expect(
      await screen.findByRole('button', { name: /Session/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Game/i })
    ).not.toBeInTheDocument();
  });

  it('opens the edit event side panel when isSessionModalOpen is true', () => {
    renderWithRedux(<App {...baseProps} isSessionModalOpen />, {
      useGlobalStore: false,
      preloadedState,
    });

    // The panel is identified by its title
    expect(screen.getByText('New Session')).toBeInTheDocument();
  });

  it('opens the edit event side panel when isGameModalOpen is true', () => {
    renderWithRedux(<App {...baseProps} isGameModalOpen />, {
      useGlobalStore: false,
      preloadedState,
    });

    // The panel is identified by its title
    expect(screen.getByText('New Game')).toBeInTheDocument();
  });

  describe('when custom-events FF is on', () => {
    beforeEach(() => {
      window.featureFlags['custom-events'] = true;
    });

    it('renders the "Events" filter checkbox', () => {
      renderWithRedux(<App {...baseProps} />, {
        useGlobalStore: false,
        preloadedState,
      });

      expect(screen.getByLabelText('Events')).toBeInTheDocument();
    });

    it('calls updateCalendarFilters when custom events filter is clicked', async () => {
      renderWithRedux(<App {...baseProps} />, {
        useGlobalStore: false,
        preloadedState,
      });

      const customEventsCheckbox = screen.getByLabelText('Events');

      await user.click(customEventsCheckbox);

      expect(baseProps.updateCalendarFilters).toHaveBeenCalledTimes(1);
      expect(baseProps.updateCalendarFilters).toHaveBeenCalledWith(
        expect.objectContaining({
          id: eventTypeFilterEnumLike.customEvents,
          checked: false,
        })
      );
    });

    it('renders the Event menu item when canCreateCustomEvents is true', async () => {
      renderWithRedux(
        <App {...baseProps} canCreateGames canCreateCustomEvents />,
        { useGlobalStore: false, preloadedState }
      );

      const addButton = screen.getAllByRole('button')[0];

      await user.click(addButton);

      expect(screen.getByText('Event')).toBeInTheDocument();
    });

    it('calls openCustomEventModal when Event menu item is clicked', async () => {
      renderWithRedux(
        <App {...baseProps} canCreateGames canCreateCustomEvents />,
        { useGlobalStore: false, preloadedState }
      );

      const addButton = screen.getAllByRole('button')[0];

      await user.click(addButton);

      const eventMenuItem = screen.getByText('Event');

      await user.click(eventMenuItem);

      expect(baseProps.openCustomEventModal).toHaveBeenCalledTimes(1);
    });
  });

  describe('when web-calendar-athlete-filter FF is on', () => {
    beforeEach(() => {
      window.featureFlags['web-calendar-athlete-filter'] = true;
    });

    it('renders the MultiSelectDropdown for event filters and the athlete selector', () => {
      renderWithRedux(<App {...baseProps} />, {
        useGlobalStore: false,
        preloadedState,
      });

      expect(
        screen.getByText(/Squad Sessions, Individual Sessions/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          '#sport_specific__Entire_Squad, Forwards, Goalkeeper, Alice Smith'
        )
      ).toBeInTheDocument(); // Part of AthleteSelector
    });

    it('does not render individual filter checkboxes', () => {
      renderWithRedux(<App {...baseProps} />, {
        useGlobalStore: false,
        preloadedState,
      });

      expect(screen.queryByLabelText('Squad Sessions')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Games')).not.toBeInTheDocument();
    });

    it('calls updateCalendarFilters when a dropdown filter item is clicked', async () => {
      renderWithRedux(<App {...baseProps} />, {
        useGlobalStore: false,
        preloadedState,
      });

      // Click the dropdown to open it
      const dropdownHeader = screen.getByText(
        /Squad Sessions, Individual Sessions/i
      );

      await user.click(dropdownHeader);

      // Click an option to toggle it
      const gamesOption = screen.getByText('Games');

      await user.click(gamesOption);

      expect(baseProps.updateCalendarFilters).toHaveBeenCalledTimes(1);
      expect(baseProps.updateCalendarFilters).toHaveBeenCalledWith(
        expect.objectContaining({
          id: eventTypeFilterEnumLike.games,
          checked: false, // Initially true, so it becomes false
        })
      );
    });
  });

  describe('when web-calendar-athlete-filter and calendar-hide-all-day-slot FFs are on', () => {
    beforeEach(() => {
      window.featureFlags['web-calendar-athlete-filter'] = true;
      window.featureFlags['calendar-hide-all-day-slot'] = true;
    });

    it('renders the filter dropdown with only training sessions and games', async () => {
      renderWithRedux(<App {...baseProps} />, {
        useGlobalStore: false,
        preloadedState,
      });

      const dropdownHeader = screen.getByText(/Training Sessions, Games/i);

      await user.click(dropdownHeader);

      // Check that only the two allowed options exist
      expect(screen.getByText('Training Sessions')).toBeInTheDocument();
      expect(screen.getByText('Games')).toBeInTheDocument();
      expect(screen.queryByText('Treatments')).not.toBeInTheDocument();
    });
  });
});
