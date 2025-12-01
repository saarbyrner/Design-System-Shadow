import { axios } from '@kitman/common/src/utils/services';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { server, rest } from '@kitman/services/src/mocks/server';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import { eventTypes } from '@kitman/common/src/consts/gameEventConsts';
import { useUpdateAthleteEventsMutation } from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/athleteEventApi';
import AddAthletesSidePanel from '../AddAthletesSidePanel';
import { mockedEventSquads, additionalMockSquad } from './utils';

jest.mock(
  '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/athleteEventApi',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/athleteEventApi'
    ),
    useUpdateAthleteEventsMutation: jest.fn(),
  })
);

const mockUpdateAthlete = jest.fn(() => ({
  unwrap: () => Promise.resolve({}),
}));

const mockUpdateAthleteFail = jest.fn(() => ({
  unwrap: () => Promise.reject(new Error('Something went wrong')),
}));

describe('<AddAthletesSidePanel />', () => {
  beforeEach(() => {
    useUpdateAthleteEventsMutation.mockReturnValue([mockUpdateAthlete]);
  });
  const defaultProps = {
    event: {
      id: 1,
    },
    isOpen: true,
    onClose: jest.fn(),
    onSaveParticipantsSuccess: jest.fn(),
    t: i18nextTranslateStub(),
  };

  const defaultPlanningEventStoreInfo = {
    planningEvent: {
      gameActivities: { localGameActivities: [], apiGameActivities: [] },
      eventPeriods: { localEventPeriods: [], apiEventPeriods: [] },
    },
  };

  const renderComponent = ({
    props = defaultProps,
    store = defaultPlanningEventStoreInfo,
  }) =>
    renderWithProviders(<AddAthletesSidePanel {...props} />, {
      preloadedState: store,
    });

  describe('when loading the initial data', () => {
    it('renders a loader', () => {
      renderComponent({ props: defaultProps });

      const loader = screen.getByTestId('DelayedLoadingFeedback');
      expect(loader).toBeInTheDocument();
    });
  });

  describe('when the initial request fails', () => {
    beforeEach(() => {
      server.use(
        rest.get('/planning_hub/events/:eventId/squads', (_, res, ctx) =>
          res(ctx.status(500))
        )
      );
    });

    it('shows an error message', async () => {
      renderComponent({ props: defaultProps });

      const failureStatus = await screen.findByTestId('AppStatus-error');
      expect(failureStatus).toBeInTheDocument();
    });
  });

  it('calls prop `onSaveParticipantsSuccess` when saving the form', async () => {
    const user = userEvent.setup();
    renderComponent({ props: defaultProps });

    const doneButton = await screen.findByText('Done');
    await user.click(doneButton);
    await expect(mockUpdateAthlete).toHaveBeenCalled();
    await expect(defaultProps.onSaveParticipantsSuccess).toHaveBeenCalled();
  });

  describe("with 'event-notifications' FF", () => {
    const modalTitle = 'Confirm you would like to notify selected recipients?';

    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe('when the FF is off', () => {
      beforeEach(() => {
        window.featureFlags['event-notifications'] = false;
      });

      it('calls the update mutation directly without showing the modal', async () => {
        const user = userEvent.setup();
        renderComponent({ props: defaultProps });

        const doneButton = await screen.findByText('Done');
        await user.click(doneButton);

        // The modal should not appear
        expect(screen.queryByText(modalTitle)).not.toBeInTheDocument();

        // The mutation should be called directly with sendNotifications: false (default)
        expect(mockUpdateAthlete).toHaveBeenCalledWith({
          eventId: defaultProps.event.id,
          athleteIds: ['1', '2', '3'],
          sendNotifications: false,
        });
      });
    });

    describe('when the FF is on', () => {
      beforeEach(() => {
        window.featureFlags['event-notifications'] = true;
      });

      it('shows the notification modal when clicking "Done"', async () => {
        const user = userEvent.setup();
        renderComponent({ props: defaultProps });

        const doneButton = await screen.findByText('Done');
        await user.click(doneButton);

        // The modal should appear
        expect(await screen.findByText(modalTitle)).toBeInTheDocument();
        // The mutation should not have been called yet
        expect(mockUpdateAthlete).not.toHaveBeenCalled();
      });

      it('calls update with sendNotifications: true when user clicks "Send"', async () => {
        const user = userEvent.setup();
        renderComponent({ props: defaultProps });

        const doneButton = await screen.findByText('Done');
        await user.click(doneButton);

        const sendButton = await screen.findByRole('button', { name: 'Send' });
        await user.click(sendButton);

        // The mutation should be called with sendNotifications: true
        expect(mockUpdateAthlete).toHaveBeenCalledWith({
          eventId: defaultProps.event.id,
          athleteIds: ['1', '2', '3'],
          sendNotifications: true,
        });

        // Wait for the modal to be removed from the DOM after the async operation.
        await waitForElementToBeRemoved(() => screen.queryByText(modalTitle));
      });

      it('calls update with sendNotifications: false when user clicks "Don\'t Send"', async () => {
        const user = userEvent.setup();
        renderComponent({ props: defaultProps });

        const doneButton = await screen.findByText('Done');
        await user.click(doneButton);

        const dontSendButton = await screen.findByRole('button', {
          name: "Don't send",
        });
        await user.click(dontSendButton);

        // The mutation should be called with sendNotifications: false
        expect(mockUpdateAthlete).toHaveBeenCalledWith({
          eventId: defaultProps.event.id,
          athleteIds: ['1', '2', '3'],
          sendNotifications: false,
        });

        // The modal should close
        await waitForElementToBeRemoved(() => screen.queryByText(modalTitle));
      });
    });
  });

  describe('when the saving request fails', () => {
    beforeEach(() => {
      server.use(
        rest.post('/planning_hub/events/:eventId/participants', (_, res, ctx) =>
          res(ctx.status(500))
        )
      );
      useUpdateAthleteEventsMutation.mockReturnValue([mockUpdateAthleteFail]);
    });

    it('shows an error message', async () => {
      const user = userEvent.setup();
      renderComponent({ props: defaultProps });

      const doneButton = await screen.findByText('Done');
      await user.click(doneButton);
      const failureStatus = await screen.findByTestId('AppStatus-error');
      expect(failureStatus).toBeInTheDocument();
    });
  });

  describe('NFL - displays moved athletes', () => {
    const movedAthletes = [
      {
        firstname: 'Test NFL',
        id: 1,
        lastname: 'Infra',
      },
      {
        firstname: 'Johnny',
        id: 2,
        lastname: 'Football',
      },
    ];
    beforeEach(() => {
      window.featureFlags = { 'planning-game-events-field-view': true };
    });
    afterEach(() => {
      window.featureFlags = { 'planning-game-events-field-view': false };
    });

    it('renders moved athlete', async () => {
      renderComponent({ props: { ...defaultProps, playerSelection: true } });

      expect(
        await screen.findByRole('button', {
          name: 'Moved athletes',
        })
      ).toBeInTheDocument();
      movedAthletes.forEach(({ firstname, lastname }) => {
        expect(
          screen.getByText(`${firstname} ${lastname}`)
        ).toBeInTheDocument();
      });
    });

    it('does not render moved athlete when permission is false', async () => {
      server.use(
        rest.get(
          '/organisation_preferences/moved_players_in_organisation_at_event',
          (req, res, ctx) => res(ctx.json({ value: false }))
        )
      );
      renderComponent({ props: { ...defaultProps, playerSelection: true } });

      expect(
        screen.queryByRole('button', {
          name: 'Moved athletes',
        })
      ).not.toBeInTheDocument();
    });
  });

  describe('game event selection', () => {
    const gameActivities = [
      { athlete_id: 1111, kind: eventTypes.goal, absolute_minute: 0 },
      {
        athlete_id: 1111,
        kind: eventTypes.position_change,
        game_activity_id: 1,
        absolute_minute: 0,
      },
      {
        athlete_id: 1111,
        kind: eventTypes.formation_position_view_change,
        game_activity_id: 1,
        absolute_minute: 0,
      },
      {
        athlete_id: 2222,
        game_activity_id: 1,
        kind: eventTypes.position_change,
        absolute_minute: 0,
      },
      {
        athlete_id: 1111,
        id: 1,
        relation: { id: 2222 },
        kind: eventTypes.switch,
        absolute_minute: 0,
      },
    ];
    const periods = [
      {
        id: 1,
        duration: 50,
        name: 'Period 1',
        absolute_duration_start: 0,
        absolute_duration_end: 50,
      },
      {
        id: 2,
        duration: 50,
        name: 'Period 2',
        absolute_duration_start: 50,
        absolute_duration_end: 100,
      },
    ];

    let axiosGetSpy;

    const gameActivityPlanningEventStoreInfo = {
      planningEvent: {
        gameActivities: {
          localGameActivities: gameActivities,
          apiGameActivities: gameActivities,
        },
        eventPeriods: { localEventPeriods: periods, apiEventPeriods: periods },
      },
    };

    beforeEach(() => {
      window.featureFlags = { 'planning-game-events-field-view': true };
      axiosGetSpy = jest.spyOn(axios, 'get').mockImplementation(() => ({
        data: {
          squads: mockedEventSquads.squads,
          selected_athletes: mockedEventSquads.selected_athletes,
        },
      }));
    });
    afterEach(() => {
      window.featureFlags = { 'planning-game-events-field-view': false };
    });

    describe('Imported Game - Maximum Athlete Error Banner', () => {
      it('Imported Game - selecting a player over the current athlete capacity displays an error banner', async () => {
        const user = userEvent.setup();
        renderComponent({
          props: {
            ...defaultProps,
            playerSelection: true,
            maxSelectedAthletes: 1,
            event: {
              ...defaultProps.event,
              type: 'game_event',
              league_setup: true,
            },
          },
          store: gameActivityPlanningEventStoreInfo,
        });

        await screen.findByText('Harry Doe');
        await user.click(screen.getByText('Select entire squad'));
        expect(
          screen.getByText('A maximum of 1 athletes can be selected')
        ).toBeInTheDocument();
      });

      it('Imported Game - Closing the panel removes the error banner', async () => {
        const user = userEvent.setup();
        renderComponent({
          props: {
            ...defaultProps,
            playerSelection: true,
            maxSelectedAthletes: 1,
            event: {
              ...defaultProps.event,
              type: 'game_event',
              league_setup: true,
            },
          },
          store: gameActivityPlanningEventStoreInfo,
        });

        await screen.findByText('Harry Doe');
        await user.click(screen.getByText('Select entire squad'));
        expect(
          screen.getByText('A maximum of 1 athletes can be selected')
        ).toBeInTheDocument();
        await user.click(screen.getByText('Cancel'));
        expect(
          screen.queryByText('A maximum of 1 athletes can be selected')
        ).not.toBeInTheDocument();
      });
    });

    describe('[featureflag league-ops-discipline-area] render', () => {
      it('calls the get squads endpoint with the respective discipline param', () => {
        window.featureFlags = { 'league-ops-discipline-area': true };
        renderComponent({
          props: {
            ...defaultProps,
            playerSelection: true,
            event: {
              ...defaultProps.event,
              type: 'game_event',
              league_setup: true,
            },
            shouldIncludeGameStatus: true,
          },
        });

        expect(axiosGetSpy).toHaveBeenCalledWith(
          '/planning_hub/events/1/squads',
          {
            params: {
              include_availability: true,
              include_designation: true,
              include_game_status: true,
              include_position_abbreviation: true,
              include_squad_number: true,
              filter_by_away_organisation: false,
              filter_by_home_organisation: false,
              include_primary_squad: false,
              filter_by_division: true,
            },
            timeout: 40000,
          }
        );

        window.featureFlags = { 'league-ops-discipline-area': false };
      });

      it('calls the get squads endpoint with the respective discipline param but shouldNotIncludeGameStatus', () => {
        window.featureFlags = { 'league-ops-discipline-area': true };
        renderComponent({
          props: {
            ...defaultProps,
            playerSelection: true,
            event: {
              ...defaultProps.event,
              type: 'game_event',
              league_setup: true,
            },
            shouldIncludeGameStatus: false,
          },
        });

        expect(axiosGetSpy).toHaveBeenCalledWith(
          '/planning_hub/events/1/squads',
          {
            params: {
              include_availability: true,
              include_designation: true,
              include_game_status: false,
              include_position_abbreviation: true,
              include_squad_number: true,
              filter_by_away_organisation: false,
              filter_by_home_organisation: false,
              include_primary_squad: false,
              filter_by_division: true,
            },
            timeout: 40000,
          }
        );

        window.featureFlags = { 'league-ops-discipline-area': false };
      });
    });
  });

  describe('custom events', () => {
    beforeEach(() => {
      jest.spyOn(axios, 'get').mockImplementation(() => ({
        data: {
          squads: [...mockedEventSquads.squads, additionalMockSquad],
          selected_athletes: [],
        },
      }));
    });

    const customEventProps = {
      isOpen: true,
      title: 'Test Title',
      event: {
        type: 'custom_event',
        id: 1,
        custom_event_type: {
          id: 5,
          name: 'Test Custom Event Type',
          squads: [mockedEventSquads.squads[0]],
        },
      },
      onClose: jest.fn(),
      onSaveParticipantsSuccess: jest.fn(),
      t: i18nextTranslateStub(),
    };

    it('should not filter out squads when the squad scoped FF is off', async () => {
      renderComponent({
        props: { ...customEventProps },
      });

      // we should see both available squads
      expect(
        await screen.findByText(mockedEventSquads.squads[0].name)
      ).toBeInTheDocument();

      expect(
        await screen.findByText(additionalMockSquad.name)
      ).toBeInTheDocument();
    });
    describe('when squad scoped FF is on and it is a custom event', () => {
      beforeEach(() => {
        window.featureFlags['squad-scoped-custom-events'] = true;
      });
      afterEach(() => {
        window.featureFlags['squad-scoped-custom-events'] = false;
      });

      it('filters the squads based on the custom event type squads', async () => {
        renderComponent({
          props: { ...customEventProps },
        });

        // we should see the squad that is associated to the custom event type
        expect(
          await screen.findByText(mockedEventSquads.squads[0].name)
        ).toBeInTheDocument();

        // this squad should not be shown
        expect(
          screen.queryByText(additionalMockSquad.name)
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('Filter by organisation params have been passed to the component', () => {
    let axiosGetSpy;
    beforeEach(() => {
      window.featureFlags = { 'planning-game-events-field-view': true };
      axiosGetSpy = jest.spyOn(axios, 'get').mockImplementation(() => ({
        data: {
          squads: mockedEventSquads.squads,
          selected_athletes: mockedEventSquads.selected_athletes,
        },
      }));
    });
    describe('filterByHomeOrganisation has been passed to the component', () => {
      it('Calls the correct endpoint and params', () => {
        renderComponent({
          props: {
            ...defaultProps,
            filterByHomeOrganisation: true,
          },
        });
        expect(axiosGetSpy).toHaveBeenCalledWith(
          '/planning_hub/events/1/squads',
          {
            params: {
              include_availability: true,
              include_designation: true,
              include_game_status: false,
              include_position_abbreviation: true,
              include_squad_number: true,
              filter_by_away_organisation: false,
              filter_by_home_organisation: true,
              include_primary_squad: false,
              filter_by_division: false,
            },
            timeout: 40000,
          }
        );
      });

      it('Filters by division only if event type is game event', () => {
        renderComponent({
          props: {
            ...defaultProps,
            event: {
              ...defaultProps.event,
              type: 'game_event',
            },
            filterByHomeOrganisation: true,
          },
        });
        expect(axiosGetSpy).toHaveBeenCalledWith(
          '/planning_hub/events/1/squads',
          {
            params: {
              include_availability: true,
              include_designation: true,
              include_game_status: false,
              include_position_abbreviation: true,
              include_squad_number: true,
              filter_by_away_organisation: false,
              filter_by_home_organisation: true,
              include_primary_squad: false,
              filter_by_division: true,
            },
            timeout: 40000,
          }
        );
      });
    });
    describe('filterByAwayOrganisation has been passed to the component', () => {
      it('Calls the correct endpoint and params', () => {
        renderComponent({
          props: {
            ...defaultProps,
            filterByAwayOrganisation: true,
          },
        });
        expect(axiosGetSpy).toHaveBeenCalledWith(
          '/planning_hub/events/1/squads',
          {
            params: {
              include_availability: true,
              include_designation: true,
              include_game_status: false,
              include_position_abbreviation: true,
              include_squad_number: true,
              filter_by_away_organisation: true,
              filter_by_home_organisation: false,
              include_primary_squad: false,
              filter_by_division: false,
            },
            timeout: 40000,
          }
        );
      });
    });
  });

  describe('The emitLocally prop has been passed to the component', () => {
    describe('emitLocally prop is true', () => {
      it('does not call the updateAthleteEvents endpoint', async () => {
        const user = userEvent.setup();
        renderComponent({ props: { ...defaultProps, emitLocally: true } });

        const doneButton = await screen.findByText('Done');
        await user.click(doneButton);
        expect(mockUpdateAthlete).not.toHaveBeenCalled();
        expect(defaultProps.onSaveParticipantsSuccess).toHaveBeenCalled();
      });
    });
    describe('emitLocally prop is not passed to the component or is false', () => {
      it('does call the updateAthleteEvents endpoint', async () => {
        const user = userEvent.setup();
        renderComponent({ props: { ...defaultProps } });

        const doneButton = await screen.findByText('Done');
        await user.click(doneButton);
        expect(mockUpdateAthlete).toHaveBeenCalled();
        expect(defaultProps.onSaveParticipantsSuccess).toHaveBeenCalled();
      });
    });
  });

  describe('includePrimarySquad has been passed to the component', () => {
    let axiosGetSpy;
    beforeEach(() => {
      window.featureFlags = { 'planning-game-events-field-view': true };
      axiosGetSpy = jest.spyOn(axios, 'get').mockImplementation(() => ({
        data: {
          squads: mockedEventSquads.squads,
          selected_athletes: mockedEventSquads.selected_athletes,
        },
      }));
    });
    it('Calls the correct endpoint and params', () => {
      renderComponent({
        props: {
          ...defaultProps,
          includePrimarySquad: true,
        },
      });
      expect(axiosGetSpy).toHaveBeenCalledWith(
        '/planning_hub/events/1/squads',
        {
          params: {
            include_availability: true,
            include_designation: true,
            include_game_status: false,
            include_position_abbreviation: true,
            include_squad_number: true,
            filter_by_away_organisation: false,
            filter_by_home_organisation: false,
            include_primary_squad: true,
            filter_by_division: false,
          },
          timeout: 40000,
        }
      );
    });
  });
});
