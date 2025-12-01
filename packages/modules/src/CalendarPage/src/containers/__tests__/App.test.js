import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { server, rest } from '@kitman/services/src/mocks/server';
import * as calendarActions from '@kitman/modules/src/CalendarPage/src/actions';
import AppContainer from '../App';

// Mock the entire actions module to spy on dispatched actions
jest.mock('@kitman/modules/src/CalendarPage/src/actions.js');

describe('Calendar Page <App /> Container', () => {
  let user;
  let baseProps;
  let preloadedState;

  beforeEach(() => {
    user = userEvent.setup();
    jest.clearAllMocks();
    window.featureFlags = {};

    baseProps = {
      orgTimeZone: 'Europe/Dublin',
      userLocale: 'en-US',
      canShowTreatments: true,
      canShowRehab: true,
      canCreateGames: true,
      t: i18nextTranslateStub(),
    };

    // Mock the initial Redux state
    preloadedState = {
      calendarPage: {
        events: [],
        calendarDates: {
          startDate: '2020-10-26T00:00:00+00:00',
          endDate: '2020-12-07T00:00:00+00:00',
        },
        calendarFilters: {
          squadSessionsFilter: true,
          individualSessionsFilter: true,
          gamesFilter: true,
          treatmentsFilter: true,
          rehabFilter: true,
        },
        gameModal: { isOpen: false },
        sessionModal: { isOpen: false },
        customEventModal: { isOpen: false },
        squadSelection: {},
      },
      eventsPanel: { isOpen: false, mode: 'CREATE' },
      eventTooltip: { element: null },
      deleteEvent: { event: null },
      appStatus: { message: null, status: null },
      globalApi: {
        currentUser: { id: 1, name: 'Test User' },
        currentOrganisation: { id: 1, name: 'Test Organisation' },
      },
    };

    // Mock API for the initial getSport call
    server.use(
      rest.get('/sport', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ duration: 80 }));
      })
    );
  });

  it('renders the calendar and filters correctly', () => {
    renderWithRedux(<AppContainer {...baseProps} />, {
      useGlobalStore: false,
      preloadedState,
    });

    // Check that a key part of the UI, like a filter, is rendered
    expect(screen.getByLabelText('Squad Sessions')).toBeInTheDocument();
  });

  it('maps dispatch to props and calls updateCalendarFilters when a filter is clicked', async () => {
    renderWithRedux(<AppContainer {...baseProps} />, {
      useGlobalStore: false,
      preloadedState,
    });

    const gamesFilterCheckbox = screen.getByLabelText('Games');

    await user.click(gamesFilterCheckbox);

    expect(calendarActions.updateCalendarFilters).toHaveBeenCalledTimes(1);
    expect(calendarActions.updateCalendarFilters).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'gamesFilter',
        checked: false, // It was initially true in the state
      })
    );
  });

  it('maps dispatch to props and calls openGameModal when "Game" is selected from the add menu', async () => {
    renderWithRedux(<AppContainer {...baseProps} />, {
      useGlobalStore: false,
      preloadedState,
    });

    // The add button is a TooltipMenu trigger
    const addButton = screen.getAllByRole('button')[0];
    await user.click(addButton);

    // Find the "Game" menu item and click it
    const gameMenuItem = screen.getByText('Game');
    await user.click(gameMenuItem);

    expect(calendarActions.openGameModal).toHaveBeenCalledTimes(1);
  });

  it('passes the correct default durations to child components after fetching sport data', async () => {
    // Mock the getSessionTypes API call needed by CalendarEventsPanel
    server.use(
      rest.get('/session_types', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json([]));
      })
    );

    // Render the component with the events panel open to check its props
    const stateWithPanelOpen = {
      ...preloadedState,
      eventsPanel: { ...preloadedState.eventsPanel, isOpen: true },
    };

    renderWithRedux(<AppContainer {...baseProps} />, {
      useGlobalStore: false,
      preloadedState: stateWithPanelOpen,
    });

    // Wait for the UI to update after fetching sport data
    expect(await screen.findByDisplayValue(60)).toBeInTheDocument();
  });
});
