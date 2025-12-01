import * as redux from 'react-redux';
import moment from 'moment';

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { eventTypes } from '@kitman/common/src/consts/gameEventConsts';
import { defaultTeamPitchInfo } from '@kitman/modules/src/shared/MatchReport/src/consts/matchReportConsts';

import MatchReportTeamDetails from '../index';

jest.mock('@kitman/common/src/hooks/useLeagueOperations');

describe('MatchReportTeamDetails', () => {
  const teamPlayers = [
    {
      id: 1,
      fullname: 'Stone Cold Steve Austin',
      birthyear: '2002',
      position: { id: 4, abbreviation: 'GK' },
      jersey: 11,
      designation: 'Primary',
      date_of_birth: '28 Feb 2021',
    },
    {
      id: 2,
      fullname: 'Cody Rhodes',
      birthyear: '2002',
      position: { id: 5, abbreviation: 'GK' },
      jersey: 11,
      designation: 'Primary',
    },
    {
      id: 3,
      fullname: 'Roman Reigns',
      birthyear: '2001',
      position: { id: 6, abbreviation: 'GK' },
      jersey: 11,
      designation: 'Primary',
    },
  ];

  const mockStaff = [
    {
      id: 1,
      user: {
        id: 1,
        fullname: 'Paul Levesque',
        role: 'The Boss',
      },
    },
  ];

  const defaultStore = {
    planningEvent: {
      gameActivities: { localGameActivities: [] },
      eventPeriods: {
        apiEventPeriods: [
          { absolute_duration_start: 0, absolute_duration_end: 90 },
        ],
      },
      pitchView: {
        teams: {
          home: {
            ...defaultTeamPitchInfo.home,
            players: [teamPlayers[0], teamPlayers[1]],
            listPlayers: [teamPlayers[0], teamPlayers[1]],
            staff: mockStaff,
          },
          away: {
            ...defaultTeamPitchInfo.away,
            players: [teamPlayers[2]],
            listPlayers: [teamPlayers[2]],
            staff: mockStaff,
          },
        },
        activeEventSelection: eventTypes.goal,
        pitchActivities: [],
        field: {
          id: 1,
          columns: 4,
          rows: 4,
        },
      },
    },
  };

  const getActiveEventSelectionStore = (eventType) => ({
    planningEvent: {
      ...defaultStore.planningEvent,
      pitchView: {
        ...defaultStore.planningEvent.pitchView,
        activeEventSelection: eventType,
      },
    },
  });

  const getYellowCardStore = (yellowActivity) => ({
    planningEvent: {
      ...defaultStore.planningEvent,
      gameActivities: {
        localGameActivities: [yellowActivity],
      },
      pitchView: {
        ...defaultStore.planningEvent.pitchView,
        activeEventSelection: eventTypes.yellow,
      },
    },
  });

  const getCustomTeamsStore = (customTeams) => ({
    planningEvent: {
      ...defaultStore.planningEvent,
      pitchView: {
        ...defaultStore.planningEvent.pitchView,
        teams: customTeams,
      },
    },
  });

  const defaultProps = {
    t: i18nextTranslateStub(),
    gameScores: { orgScore: 0, opponentScore: 0 },
    isPitchViewEnabled: false,
    isReadOnlyMode: false,
    setFlagDisciplinaryIssue: jest.fn(),
    setGameScores: jest.fn(),
    gameSquads: { squad: { owner_id: 1 }, opponentSquad: { owner_id: 2 } },
  };

  const defaultLeagueOps = {
    isLeague: false,
    isOfficial: false,
    isAssociationAdmin: false,
    isRegistrationRequired: false,
    isOrgSupervised: false,
    isScout: false,
  };

  const renderComponent = ({
    props = defaultProps,
    leagueOps = {},
    store = defaultStore,
  }) => {
    useLeagueOperations.mockReturnValue({
      ...defaultLeagueOps,
      ...leagueOps,
    });
    return renderWithProviders(<MatchReportTeamDetails {...props} />, {
      preloadedState: store,
    });
  };

  let useDispatchSpy;
  let mockDispatch;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    mockDispatch = jest.fn();
    useDispatchSpy.mockReturnValue(mockDispatch);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('initial Home Team render', () => {
    it('renders the team selection buttons', () => {
      renderComponent({ props: defaultProps });
      expect(screen.getByText('Home Team')).toBeInTheDocument();
      expect(screen.getByText('Away Team')).toBeInTheDocument();
    });

    it('selects the away team when clicked', async () => {
      const user = userEvent.setup();
      renderComponent({ props: defaultProps });
      expect(screen.queryByText('Roman Reigns')).not.toBeInTheDocument();
      await user.click(screen.getByText('Away Team'));
      expect(screen.getByText('Roman Reigns')).toBeInTheDocument();
    });

    it('renders the team table headers', () => {
      renderComponent({ props: defaultProps });
      expect(screen.getByText('Player')).toBeInTheDocument();
      expect(screen.getByText('DOB')).toBeInTheDocument();
      expect(screen.getByText('Position')).toBeInTheDocument();
      expect(screen.getByText('Jersey')).toBeInTheDocument();
      expect(screen.getByText('Designation')).toBeInTheDocument();
    });

    it('renders the team staff table', () => {
      renderComponent({ props: defaultProps });
      expect(screen.getByText('Staff')).toBeInTheDocument();
      expect(screen.getByText('Role')).toBeInTheDocument();
      expect(screen.getByText(mockStaff[0].user.fullname)).toBeInTheDocument();
      expect(screen.getByText(mockStaff[0].user.role)).toBeInTheDocument();
    });

    it('creates a game activity when the player is clicked with an activeEventSelection', async () => {
      const user = userEvent.setup();
      renderComponent({ props: defaultProps });
      await user.click(screen.getByText('Stone Cold Steve Austin'));
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: [
          {
            absolute_minute: 0,
            athlete_id: 1,
            kind: eventTypes.goal,
            minute: 0,
            organisation_id: 1,
            relation: { id: null },
          },
        ],
        type: 'gameActivities/setUnsavedGameActivities',
      });
      expect(defaultProps.setGameScores).toHaveBeenCalledWith({
        opponentScore: 0,
        orgScore: 1,
      });
    });

    it('displays the last 2 characters of the DOB', () => {
      renderComponent({ props: defaultProps });
      expect(screen.getByText('21')).toBeInTheDocument();
    });

    it('updates the scoreline when a goal is added for the home team including existing away own goals', async () => {
      const user = userEvent.setup();
      const awayOwnGoalActivity = {
        absolute_minute: 0,
        athlete_id: 3, // away player
        kind: eventTypes.goal,
        minute: 0,
        organisation_id: 2,
        relation: { id: null },
        game_activities: [
          {
            absolute_minute: 0,
            athlete_id: 3,
            kind: eventTypes.own_goal,
            minute: 0,
            organisation_id: 2,
            relation: { id: null },
          },
        ],
      };
      const storeWithAwayOwnGoal = {
        ...defaultStore,
        planningEvent: {
          ...defaultStore.planningEvent,
          gameActivities: { localGameActivities: [awayOwnGoalActivity] },
        },
      };

      renderComponent({ props: defaultProps, store: storeWithAwayOwnGoal });

      await user.click(screen.getByText('Stone Cold Steve Austin'));
      expect(defaultProps.setGameScores).toHaveBeenCalledWith({
        opponentScore: 0,
        orgScore: 2, // 1 existing own goal from the away team + 1 newly added home team goal
      });
    });
  });

  describe('Creating a player event', () => {
    it('creates a athlete game activity when a player is selected for a red', async () => {
      const user = userEvent.setup();
      renderComponent({
        store: getActiveEventSelectionStore(eventTypes.red),
      });
      await user.click(screen.getByText('Stone Cold Steve Austin'));
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: [
          {
            absolute_minute: 0,
            athlete_id: 1,
            kind: eventTypes.red,
            minute: 0,
            organisation_id: 1,
            relation: { id: null },
          },
        ],
        type: 'gameActivities/setUnsavedGameActivities',
      });
      expect(defaultProps.setFlagDisciplinaryIssue).toHaveBeenCalledWith(true);
    });

    it('sets the auto disciplinary flag when two yellows create a red for a player', async () => {
      const user = userEvent.setup();
      renderComponent({
        store: getYellowCardStore({
          kind: eventTypes.yellow,
          athlete_id: 1,
          absolute_minute: 5,
        }),
      });
      await user.click(screen.getByText('Stone Cold Steve Austin'));
      expect(defaultProps.setFlagDisciplinaryIssue).toHaveBeenCalledWith(true);
    });
  });

  describe('Creating a staff event', () => {
    it('creates a staff game activity when a staff member is selected for a red', async () => {
      const user = userEvent.setup();
      renderComponent({
        store: getActiveEventSelectionStore(eventTypes.red),
      });
      await user.click(screen.getByText(mockStaff[0].user.fullname));
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: [
          {
            absolute_minute: 0,
            kind: eventTypes.red,
            minute: 0,
            organisation_id: 1,
            relation: { id: null },
            user_id: 1,
          },
        ],
        type: 'gameActivities/setUnsavedGameActivities',
      });
      expect(defaultProps.setFlagDisciplinaryIssue).toHaveBeenCalledWith(true);
    });

    it('sets the auto disciplinary flag when two yellows create a red for a staff member', async () => {
      const user = userEvent.setup();
      renderComponent({
        store: getYellowCardStore({
          kind: eventTypes.yellow,
          user_id: 1,
          absolute_minute: 5,
        }),
      });
      await user.click(screen.getByText(mockStaff[0].user.fullname));
      expect(defaultProps.setFlagDisciplinaryIssue).toHaveBeenCalledWith(true);
    });
  });

  describe('Creating a Sub Render', () => {
    it('clicking two players creates a sub event', async () => {
      const user = userEvent.setup();
      renderComponent({
        store: getActiveEventSelectionStore(eventTypes.sub),
      });
      await user.click(screen.getByText('Stone Cold Steve Austin'));
      await user.click(screen.getByText('Cody Rhodes'));
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: [
          {
            absolute_minute: 0,
            athlete_id: 1,
            game_activities: [
              {
                absolute_minute: 0,
                athlete_id: 1,
                kind: eventTypes.position_change,
                relation: { id: 5 },
              },
              {
                absolute_minute: 0,
                athlete_id: 2,
                kind: eventTypes.position_change,
                relation: { id: 4 },
              },
            ],
            kind: eventTypes.sub,
            relation: { id: 2 },
          },
        ],
        type: 'gameActivities/setUnsavedGameActivities',
      });
    });

    it('selecting a player then selecting the same one deselects the player', async () => {
      const user = userEvent.setup();
      renderComponent({
        store: getActiveEventSelectionStore(eventTypes.sub),
      });
      await user.click(screen.getByText('Stone Cold Steve Austin'));
      expect(screen.getByText('Stone Cold Steve Austin (Sub-out)')).toHaveClass(
        'selected_player'
      );
      await user.click(screen.getByText('Stone Cold Steve Austin (Sub-out)'));
      expect(screen.getByText('Stone Cold Steve Austin')).not.toHaveClass(
        'selected_player'
      );
    });
  });

  describe('initial Away Team render', () => {
    it('updates the scoreline when a goal is added for the away team including existing home own goals', async () => {
      const user = userEvent.setup();
      const homeOwnGoalActivity = {
        absolute_minute: 0,
        athlete_id: 1, // home player
        kind: eventTypes.goal,
        minute: 0,
        organisation_id: 1,
        relation: { id: null },
        game_activities: [
          {
            absolute_minute: 0,
            athlete_id: 1,
            kind: eventTypes.own_goal,
            minute: 0,
            organisation_id: 1,
            relation: { id: null },
          },
        ],
      };
      const storeWithHomeOwnGoal = {
        ...defaultStore,
        planningEvent: {
          ...defaultStore.planningEvent,
          gameActivities: { localGameActivities: [homeOwnGoalActivity] },
        },
      };

      renderComponent({ props: defaultProps, store: storeWithHomeOwnGoal });

      await user.click(screen.getByText('Away Team'));
      await user.click(screen.getByText('Roman Reigns'));
      expect(defaultProps.setGameScores).toHaveBeenCalledWith({
        opponentScore: 2, // 1 existing own goal from the home team + 1 newly added away team goal
        orgScore: 0,
      });
    });
  });

  describe('for scout users', () => {
    beforeEach(() => {
      moment.tz.setDefault('UTC');
    });

    afterEach(() => {
      moment.tz.setDefault();
    });

    it('renders the team table headers', () => {
      renderComponent({ leagueOps: { isScout: true } });
      expect(screen.getByText('Player')).toBeInTheDocument();
      expect(screen.getByText('DOB')).toBeInTheDocument();
      expect(screen.getByText('Position')).toBeInTheDocument();
      expect(screen.getByText('Grad year')).toBeInTheDocument();
      expect(screen.getByText('Age group')).toBeInTheDocument();
    });
  });

  describe('isPitchViewEnabled is true', () => {
    const formation = { id: 4, name: '4-3-2', number_of_players: 10 };
    const pitchTeamsInfo = {
      ...defaultStore.planningEvent.pitchView.teams,
      home: {
        ...defaultStore.planningEvent.pitchView.teams.home,
        formation,
        period: {
          id: 1,
          absolute_duration_start: 0,
          absolute_duration_end: 90,
        },
        positions: [
          {
            kind: eventTypes.formation_change,
            absolute_minute: 0,
            relation: formation,
          },
          {
            kind: eventTypes.formation_position_view_change,
            athlete_id: 2,
            absolute_minute: 0,
            relation: { id: 2 },
          },
        ],
        formationCoordinates: {
          '2_3': {
            id: 2,
            x: 2,
            y: 4,
            order: 1,
            position_id: 2,
            field_id: 1,
            formation_id: 4,
            position: {
              id: 2,
              abbreviation: 'CB',
            },
          },
        },
      },
    };

    const pitchRenderedTeamInfo = {
      ...pitchTeamsInfo,
      home: {
        ...pitchTeamsInfo.home,
        inFieldPlayers: { '2_3': teamPlayers[1] },
        players: [teamPlayers[0]],
      },
    };

    it('renders the pitch view/list view toggle', () => {
      renderComponent({
        props: { ...defaultProps, isPitchViewEnabled: true },
        store: getCustomTeamsStore(pitchTeamsInfo),
      });
      expect(screen.getByText('Pitch view')).toBeInTheDocument();
      expect(screen.getByText('List view')).toBeInTheDocument();
    });

    it('clicking pitch view renders the pitch area', async () => {
      const user = userEvent.setup();
      renderComponent({
        props: { ...defaultProps, isPitchViewEnabled: true },
        store: getCustomTeamsStore(pitchTeamsInfo),
      });
      await user.click(screen.getByText('Pitch view'));

      expect(screen.getByTestId('Pitch')).toBeInTheDocument();
      expect(screen.getByText('Substitutions')).toBeInTheDocument();

      await user.click(screen.getByText('List view'));

      expect(screen.queryByTestId('Pitch')).not.toBeInTheDocument();
    });

    it('auto generates the player in the field', async () => {
      const user = userEvent.setup();
      renderComponent({
        props: { ...defaultProps, isPitchViewEnabled: true },
        store: getCustomTeamsStore(pitchTeamsInfo),
      });
      await user.click(screen.getByText('Pitch view'));
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: pitchRenderedTeamInfo,
        type: 'pitchView/setTeams',
      });
    });

    it('allows an event to be created via clicking the player', async () => {
      const user = userEvent.setup();
      renderComponent({
        props: { ...defaultProps, isPitchViewEnabled: true },
        store: getCustomTeamsStore(pitchRenderedTeamInfo),
      });
      await user.click(screen.getByText('Pitch view'));
      jest.clearAllMocks();
      await user.click(screen.getAllByRole('img')[0]);
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: [
          {
            absolute_minute: 0,
            athlete_id: 2,
            kind: eventTypes.goal,
            minute: 0,
            organisation_id: 1,
            relation: { id: null },
          },
        ],
        type: 'gameActivities/setUnsavedGameActivities',
      });
      expect(defaultProps.setGameScores).toHaveBeenCalledWith({
        opponentScore: 0,
        orgScore: 1,
      });
    });
  });

  describe('DOB format', () => {
    beforeEach(() => {
      moment.tz.setDefault('UTC');
    });

    afterEach(() => {
      moment.tz.setDefault();
    });

    it.each([
      ['isScout', true],
      ['isLeague', true],
      ['isOfficial', true],
      ['isOrgSupervised', true],
    ])('should display a two year digit DOB for %s', ([role, value]) => {
      renderComponent({ leagueOps: { [role]: value } });
      expect(screen.queryByText('02/28/2021')).not.toBeInTheDocument();
      expect(screen.getByText('21')).toBeInTheDocument();
    });
  });
});
