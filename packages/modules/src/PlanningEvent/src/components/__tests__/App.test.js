import 'core-js/stable/structured-clone';
import * as redux from 'react-redux';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';
import { getActiveSquad } from '@kitman/common/src/redux/global/selectors';
import { data as MOCK_ACTIVE_SQUAD } from '@kitman/services/src/mocks/handlers/getActiveSquad';
import {
  buildEvent,
  i18nextTranslateStub,
} from '@kitman/common/src/utils/test_utils';
import { mailingList } from '@kitman/modules/src/Contacts/shared/constants';
import { getMatchDayView } from '@kitman/modules/src/PlanningEvent/src/redux/selectors/planningEventSelectors';

import App from '../App';
// eslint-disable-next-line jest/no-mocks-import
import { athleteMock } from '../CustomEventsAthletesTab/__mocks__/CustomEventsAthletesTab.mock';

jest.mock(
  '@kitman/modules/src/img/planning/soccer_drill_diagram_placeholder.svg',
  () => null
);
jest.mock('@kitman/common/src/hooks/useLeagueOperations');
jest.mock('@kitman/common/src/contexts/PermissionsContext');
jest.mock('@kitman/common/src/contexts/PreferenceContext/preferenceContext');
jest.mock('@kitman/common/src/redux/global/selectors', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/selectors'),
  getActiveSquad: jest.fn(),
}));

jest.mock(
  '@kitman/modules/src/PlanningEvent/src/redux/selectors/planningEventSelectors',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/PlanningEvent/src/redux/selectors/planningEventSelectors'
    ),
    getMatchDayView: jest.fn(),
  })
);

describe('App', () => {
  const eventWithoutSquad = buildEvent();
  const squad = {
    id: 1,
    name: 'Falcons',
  };

  const defaultLeagueOps = {
    isLeague: false,
  };

  const defaultStore = {
    planningEvent: {
      athleteEvents: { apiAthleteEvents: [] },
      eventPeriods: {
        localEventPeriods: [],
      },
      gameActivities: {
        localGameActivities: [],
      },
    },
  };

  const event = { ...eventWithoutSquad, squad };
  const defaultProps = {
    event,
    orgTimezone: 'Europe/Dublin',
    orgSport: 'soccer',
    onUpdateEvent: () => {},
    participationLevels: [
      {
        id: 1,
        name: 'Testing',
        canonical_participation_level: 'none',
        include_in_group_calculations: true,
      },
    ],
    statusVariables: [],
    squad,
    setActiveTeamEventId: jest.fn(),
    t: i18nextTranslateStub(),
  };

  const componentRender = ({
    isLeagueStaffUser = false,
    props = defaultProps,
    mockStore = {},
    leaguePermissions = false,
    leaguePreferences = {
      league_game_team: false,
      league_game_match_report: false,
    },
    matchDayView = mailingList.Dmn,
  }) => {
    getMatchDayView.mockReturnValue(() => matchDayView);
    useLeagueOperations.mockReturnValue({
      ...defaultLeagueOps,
      isLeagueStaffUser,
    });
    usePermissions.mockReturnValue({
      permissions: {
        leagueGame: {
          viewGameInformation: leaguePermissions,
          viewGameTeam: leaguePermissions,
        },
      },
    });
    usePreferences.mockReturnValue({
      preferences: leaguePreferences,
    });

    getActiveSquad.mockReturnValue(() => MOCK_ACTIVE_SQUAD);
    return renderWithRedux(<App {...props} />, { preloadedState: mockStore });
  };

  let useDispatchSpy;
  let mockDispatch;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    mockDispatch = jest.fn();
    useDispatchSpy.mockReturnValue(mockDispatch);
  });

  describe('when the hash is #participants', () => {
    beforeEach(() => {
      window.location.hash = '#participants';
    });
    afterEach(() => {
      window.location.hash = '';
    });

    it('renders the participants tab', () => {
      componentRender({});
      expect(screen.getByRole('tab', { selected: true })).toHaveTextContent(
        'Participants'
      );
    });
  });

  describe('when the hash is #collection', () => {
    beforeEach(() => {
      window.location.hash = '#collection';
    });
    afterEach(() => {
      window.location.hash = '';
    });

    it('renders the participants tab', () => {
      componentRender({});
      expect(screen.getByRole('tab', { selected: true })).toHaveTextContent(
        'Collection'
      );
    });
  });

  describe('when the hash is #imported_data', () => {
    beforeEach(() => {
      window.location.hash = '#imported_data';
    });
    afterEach(() => {
      window.location.hash = '';
    });

    it('renders the participants tab', () => {
      componentRender({});
      expect(screen.getByRole('tab', { selected: true })).toHaveTextContent(
        'Imported data'
      );
    });
  });

  it('changes tabs', async () => {
    const user = userEvent.setup();
    componentRender({});

    expect(screen.getByRole('tab', { selected: true })).toHaveTextContent(
      'Participants'
    );

    await user.click(screen.getByRole('tab', { name: 'Collection' }));

    expect(screen.getByRole('tab', { selected: true })).toHaveTextContent(
      'Collection'
    );
  });

  describe('when its a game event', () => {
    describe('when coaching-and-development-hide-participation-tab is enabled on a soccer game', () => {
      beforeEach(() => {
        window.setFlag('coaching-and-development-hide-participation-tab', true);
      });

      afterEach(() => {
        window.setFlag(
          'coaching-and-development-hide-participation-tab',
          false
        );
      });

      it('doesnt renders the participants tab', () => {
        componentRender({
          props: {
            ...defaultProps,
            orgSport: 'soccer',
            event: { ...event, type: 'game_event' },
          },
        });

        const tabPane = screen.getAllByRole('tab');

        expect(tabPane.length).toBe(2);
        expect(screen.queryByText('Participants')).not.toBeInTheDocument();
      });

      it('doesnt renders the participants tab when the game is a custom event', () => {
        componentRender({
          props: {
            ...defaultProps,
            orgSport: 'soccer',
            event: { ...event, type: 'custom_event' },
          },
        });

        expect(screen.queryByText('Participants')).not.toBeInTheDocument();
      });

      it('renders the participants tab when the organisation sport isnt soccer', () => {
        componentRender({
          props: {
            ...defaultProps,
            orgSport: 'GAA',
            event: { ...event, type: 'game_event' },
          },
        });

        const tabPane = screen.getAllByRole('tab');
        expect(tabPane.length).toBe(3);
        expect(tabPane[0]).toHaveTextContent('Participants');
      });
    });

    describe('when coaching-and-development-hide-collection-and-imported-data-tabs it hides the respective tabs', () => {
      beforeEach(() => {
        window.setFlag(
          'coaching-and-development-hide-collection-and-imported-data-tabs',
          true
        );
      });

      afterEach(() => {
        window.setFlag(
          'coaching-and-development-hide-collection-and-imported-data-tabs',
          false
        );
      });

      it('renders the participants tab when the organisation sport is a soccer org', () => {
        componentRender({
          props: {
            ...defaultProps,
            orgSport: 'GAA',
            event: { ...event, type: 'game_event' },
          },
        });

        expect(screen.queryByText('Collection')).not.toBeInTheDocument();
        expect(screen.queryByText('Imported Data')).not.toBeInTheDocument();
      });
    });
  });

  describe('when planning-session-planning is enabled and the event is a training session', () => {
    beforeEach(() => {
      window.setFlag('planning-session-planning', true);
    });

    afterEach(() => {
      window.setFlag('planning-session-planning', false);
    });

    it('renders the correct tabs', () => {
      componentRender({
        props: {
          ...defaultProps,
          event: { ...event, type: 'session_event' },
        },
      });

      const tabPane = screen.getAllByRole('tab');
      expect(tabPane.length).toBe(3);
      expect(tabPane[0]).toHaveTextContent('Participants');
      expect(tabPane[1]).toHaveTextContent('Collection');
      expect(tabPane[2]).toHaveTextContent('Imported data');
    });
  });

  describe('when both planning-session-planning and sessions-session-planning-tab are enabled and the event is a training session', () => {
    beforeEach(() => {
      window.setFlag('sessions-session-planning-tab', true);
      window.setFlag('planning-session-planning', true);
    });

    afterEach(() => {
      window.setFlag('sessions-session-planning-tab', false);
      window.setFlag('planning-session-planning', false);
    });

    it('renders the correct tabs', () => {
      componentRender({
        props: {
          ...defaultProps,
          event: { ...event, type: 'session_event' },
        },
      });

      const tabPane = screen.getAllByRole('tab');
      expect(tabPane.length).toBe(4);
      expect(tabPane[0]).toHaveTextContent('Participants');
      expect(tabPane[1]).toHaveTextContent('Session planning');
      expect(tabPane[2]).toHaveTextContent('Collection');
      expect(tabPane[3]).toHaveTextContent('Imported data');
    });
  });

  describe('when the user has the correct permissions', () => {
    it('renders the correct tabs', () => {
      componentRender({
        props: {
          ...defaultProps,
          canViewDevelopmentGoals: true,
          hasDevelopmentGoalsModule: true,
        },
      });

      const tabPane = screen.getAllByRole('tab');
      expect(tabPane.length).toBe(4);
      expect(tabPane[0]).toHaveTextContent('Participants');
      expect(tabPane[1]).toHaveTextContent('Development goals');
      expect(tabPane[2]).toHaveTextContent('Collection');
      expect(tabPane[3]).toHaveTextContent('Imported data');
    });

    it('shows the correct terminology when developmentGoalTerminology exists', async () => {
      componentRender({
        props: {
          ...defaultProps,
          canViewDevelopmentGoals: true,
          hasDevelopmentGoalsModule: true,
          developmentGoalTerminology: 'Custom terminology',
        },
      });

      expect(screen.getAllByRole('tab')[1]).toHaveTextContent(
        'Custom terminology'
      );
    });
  });

  describe('when it’s a session event', () => {
    it('shows expected tabs', async () => {
      componentRender({
        props: {
          ...defaultProps,
          event: { ...event, type: 'session_event' },
        },
      });
      await waitFor(() =>
        expect(screen.queryByText('Loading')).not.toBeInTheDocument()
      );

      const tabPane = screen.getAllByRole('tab');
      expect(tabPane.length).toBe(3);
      expect(tabPane[0]).toHaveTextContent('Participants');
      expect(tabPane[1]).toHaveTextContent('Collection');
      expect(tabPane[2]).toHaveTextContent('Imported data');
    });

    describe('when selection-tab-displaying-in-session feature flag is on', () => {
      beforeEach(() => {
        window.setFlag('selection-tab-displaying-in-session', true);
      });

      it('hides Participants tab and shows Selection tab instead', async () => {
        componentRender({
          props: {
            ...defaultProps,
            event: { ...event, type: 'session_event' },
          },
          mockStore: {
            planningEvent: {
              ...defaultStore.planningEvent,
              athleteEvents: { apiAthleteEvents: [] },
            },
          },
        });
        await waitFor(() =>
          expect(screen.queryByText('Loading')).not.toBeInTheDocument()
        );

        const tabPane = screen.getAllByRole('tab');
        expect(tabPane.length).toBe(3);
        expect(tabPane[0]).toHaveTextContent('Athlete selection');
        expect(tabPane[1]).toHaveTextContent('Collection');
        expect(tabPane[2]).toHaveTextContent('Imported data');
      });
    });

    describe('when planning-tab-sessions feature flag is on', () => {
      beforeEach(() => {
        window.setFlag('selection-tab-displaying-in-session', true);
      });

      it('hides ‘Participants’ and shows ‘Athlete selection’ tab instead', async () => {
        componentRender({
          props: {
            ...defaultProps,
            event: { ...event, type: 'session_event' },
          },
        });

        await waitFor(() =>
          expect(screen.queryByText('Loading')).not.toBeInTheDocument()
        );

        const tabPane = screen.getAllByRole('tab');
        expect(tabPane.length).toBe(3);
        expect(tabPane[0]).toHaveTextContent('Athlete selection');
        expect(tabPane[1]).toHaveTextContent('Collection');
        expect(tabPane[2]).toHaveTextContent('Imported data');
      });
    });

    describe('when selection-tab-games feature flag is on', () => {
      beforeEach(() => {
        window.setFlag('selection-tab-games', true);
      });

      it('hides ‘Athlete selection’ and shows ‘Participants’ tab instead', async () => {
        componentRender({
          props: {
            ...defaultProps,
            event: { ...event, type: 'session_event' },
          },
        });

        await waitFor(() =>
          expect(screen.queryByText('Loading')).not.toBeInTheDocument()
        );

        const tabPane = screen.getAllByRole('tab');
        expect(tabPane.length).toBe(3);
        expect(tabPane[0]).toHaveTextContent('Participants');
        expect(tabPane[1]).toHaveTextContent('Collection');
        expect(tabPane[2]).toHaveTextContent('Imported data');
      });
    });
  });

  describe('custom event type', () => {
    const customEvent = {
      ...event,
      type: 'custom_event',
      athlete_events: [{ id: 1, athlete: athleteMock }],
    };
    it('shows the correct tabs', () => {
      componentRender({
        props: {
          ...defaultProps,
          event: customEvent,
        },
      });

      const tabPane = screen.getAllByRole('tab');
      expect(tabPane.length).toBe(3);
      expect(tabPane[0]).toHaveTextContent('Athletes');
      expect(tabPane[1]).toHaveTextContent('Staff');
      expect(tabPane[2]).toHaveTextContent('Attachments');
    });

    it("doesn't show the 'Edit details' button when canEditEvent is false", () => {
      componentRender({
        props: {
          ...defaultProps,
          event: customEvent,
          canEditEvent: false,
        },
      });

      expect(screen.queryByText('Edit details')).not.toBeInTheDocument();
    });

    it("shows the 'Edit details' button when canEditEvent is true", () => {
      componentRender({
        props: {
          ...defaultProps,
          event: customEvent,
          canEditEvent: true,
        },
      });
      expect(screen.getByText('Edit details')).toBeInTheDocument();
    });

    it("doesn't show the 'Edit details' button without the FF", () => {
      componentRender({
        props: {
          ...defaultProps,
          event: customEvent,
          canEditEvent: window.featureFlags['custom-events'],
        },
      });

      expect(screen.queryByText('Edit details')).not.toBeInTheDocument();
    });

    it("shows the 'Edit details' button with the FF", () => {
      window.featureFlags['custom-events'] = true;
      componentRender({
        props: {
          ...defaultProps,
          event: customEvent,
          canEditEvent: window.featureFlags['custom-events'],
        },
      });
    });
  });

  describe('Match Day Flow Render', () => {
    const leagueEvent = {
      ...event,
      home_event_id: 155568,
      away_event_id: 125596,
      squad: { owner_name: 'Chelsea' },
      opponent_squad: { owner_name: 'Arsenal' },
      type: 'game_event',
      league_setup: true,
    };

    describe('club imported game render', () => {
      const mockedAthleteEvents = [
        {
          id: 1,
          rating: null,
          athlete: {
            id: 2,
            fullname: 'Harry Doe',
            squad_number: 18,
          },
        },
        {
          id: 2,
          rating: null,
          athlete: {
            id: 3,
            fullname: 'Michael Yao',
            squad_number: null,
          },
        },
      ];

      beforeEach(() => {
        window.featureFlags['planning-game-events-tab-v-2'] = true;
      });

      afterEach(() => {
        useDispatchSpy.mockClear();
        window.featureFlags['planning-game-events-tab-v-2'] = false;
      });

      it('sends off a dispatch to default the view to dmr if the league_game_team preference is on and league_game_information is false', () => {
        componentRender({
          isLeagueStaffUser: true,
          props: {
            ...defaultProps,
            event: {
              ...event,
              type: 'game_event',
              id: leagueEvent.home_event_id,
              league_setup: true,
            },
            leagueEvent,
            activeTeamEventId: leagueEvent.home_event_id,
          },
          leaguePermissions: true,
          leaguePreferences: {
            league_game_team: true,
            league_game_information: false,
          },
        });
        expect(mockDispatch).toHaveBeenCalledWith({
          payload: 'dmr',
          type: 'gameEvent/toggleMatchDayView',
        });
      });

      it('fires an error toast whe a user tries to click the game events tab when there is at least one jersey number unassigned to an athlete in the match day comms flow', async () => {
        const user = userEvent.setup();
        componentRender({
          props: {
            ...defaultProps,
            orgSport: 'soccer',
            event: { ...event, type: 'game_event', league_setup: true },
          },
          mockStore: {
            planningEvent: {
              ...defaultStore.planningEvent,
              athleteEvents: { apiAthleteEvents: mockedAthleteEvents },
            },
          },
          leaguePreferences: {
            league_game_team: true,
            league_game_match_report: true,
          },
        });
        await user.click(screen.getByText('Game events'));
        expect(mockDispatch).toHaveBeenCalledWith({
          payload: {
            status: 'ERROR',
            title:
              'Jersey numbers need to be assigned to all players before moving to the game event tab.',
          },
          type: 'toasts/add',
        });
      });

      it('fires an error toast whe a user tries to url navigate to the game events tab when there is at least one jersey number unassigned to an athlete in the match day comms flow', async () => {
        window.location.hash = 'game_events';
        componentRender({
          props: {
            ...defaultProps,
            orgSport: 'soccer',
            event: { ...event, type: 'game_event', league_setup: true },
          },
          mockStore: {
            planningEvent: {
              ...defaultStore.planningEvent,
              athleteEvents: { apiAthleteEvents: mockedAthleteEvents },
            },
          },
          leaguePreferences: {
            league_game_team: true,
            league_game_match_report: true,
          },
        });
        expect(mockDispatch).toHaveBeenCalledWith({
          payload: {
            status: 'ERROR',
            title:
              'Jersey numbers need to be assigned to all players before moving to the game event tab.',
          },
          type: 'toasts/add',
        });
      });
    });

    describe('league user render', () => {
      it('renders the appropriate home/away team toggles on the DMR', () => {
        componentRender({
          isLeagueStaffUser: true,
          props: {
            ...defaultProps,
            event: {
              ...event,
              type: 'game_event',
              id: leagueEvent.home_event_id,
              league_setup: true,
            },
            leagueEvent,
            activeTeamEventId: leagueEvent.home_event_id,
          },
          leaguePermissions: true,
          leaguePreferences: { league_game_team: true },
        });
        expect(
          screen.getByRole('button', { name: 'Chelsea' })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('button', { name: 'Arsenal' })
        ).toBeInTheDocument();
      });

      it('fires off a a call to setActiveTeamEventId when clicking the league team toggle buttons on the DMR', async () => {
        const user = userEvent.setup();
        componentRender({
          isLeagueStaffUser: true,
          props: {
            ...defaultProps,
            event: {
              ...event,
              type: 'game_event',
              id: leagueEvent.home_event_id,
              league_setup: true,
            },
            leagueEvent,
            activeTeamEventId: leagueEvent.home_event_id,
          },
          leaguePermissions: true,
          leaguePreferences: { league_game_team: true },
        });
        await user.click(screen.getByRole('button', { name: 'Chelsea' }));
        expect(defaultProps.setActiveTeamEventId).toHaveBeenCalledWith(
          leagueEvent.home_event_id
        );
        await user.click(screen.getByRole('button', { name: 'Arsenal' }));
        expect(defaultProps.setActiveTeamEventId).toHaveBeenCalledWith(
          leagueEvent.away_event_id
        );
      });

      it('allows the league user to see the dmn/dmr toggles', () => {
        componentRender({
          isLeagueStaffUser: true,
          props: {
            ...defaultProps,
            event: {
              ...event,
              type: 'game_event',
              id: leagueEvent.home_event_id,
              league_setup: true,
            },
            leagueEvent,
            activeTeamEventId: leagueEvent.home_event_id,
            canEditEvent: true,
          },
          leaguePermissions: true,
          leaguePreferences: {
            league_game_team: true,
            league_game_information: true,
          },
        });

        expect(screen.getByText('DMN')).toBeInTheDocument();
        expect(screen.getByText('DMR')).toBeInTheDocument();
      });
    });
  });
});
