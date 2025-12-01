import * as redux from 'react-redux';

import { axios } from '@kitman/common/src/utils/services';
import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { server, rest } from '@kitman/services/src/mocks/server';
import {
  goalEventButton,
  redCardEventButton,
  substitutionEventButton,
  yellowCardEventButton,
} from '@kitman/common/src/utils/gameEventTestUtils';
import {
  ORG_SCORE_TEST_ID,
  OPPONENT_SCORE_TEST_ID,
} from '@kitman/components/src/Scoreline';
import { eventTypes } from '@kitman/common/src/consts/gameEventConsts';
import { data as matchReportEventData } from '@kitman/services/src/mocks/handlers/planningHub/getEvent';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';

import { defaultTeamPitchInfo } from '../../consts/matchReportConsts';
import MatchReportApp from '../App';

jest.mock('@kitman/common/src/contexts/PreferenceContext/preferenceContext');
jest.mock('@kitman/common/src/hooks/useLeagueOperations');
jest.mock('@kitman/common/src/contexts/PermissionsContext');

describe('MatchReportApp', () => {
  const matchReportEvent = {
    ...matchReportEventData.event,
    id: 1337,
    type: 'game_event',
  };

  const mockPreferences = {
    league_match_report_pitch_view: false,
    league_match_report_penalty_shootout: false,
  };
  const mockPeriods = [
    {
      id: 1,
      absolute_duration_start: 0,
      absolute_duration_end: 90,
      duration: 90,
    },
  ];

  const defaultApiTeamsDispatch = {
    away: {
      formation: null,
      formationCoordinates: {},
      inFieldPlayers: {},
      listPlayers: matchReportEvent.away_athletes,
      players: matchReportEvent.away_athletes,
      positions: [],
      staff: matchReportEvent.away_event_users,
    },
    home: {
      formation: null,
      formationCoordinates: {},
      inFieldPlayers: {},
      listPlayers: matchReportEvent.home_athletes,
      players: matchReportEvent.home_athletes,
      positions: [],
      staff: matchReportEvent.home_event_users,
    },
  };

  const defaultProps = {
    t: i18nextTranslateStub(),
    eventId: 1337,
    toastDispatch: jest.fn(),
  };

  const defaultLeagueOps = {
    isLeague: false,
    isOfficial: false,
    isAssociationAdmin: false,
    isRegistrationRequired: false,
    isOrgSupervised: false,
    isScout: false,
  };

  const defaultStore = {
    planningEvent: {
      gameActivities: { apiGameActivities: [], localGameActivities: [] },
      eventPeriods: { apiEventPeriods: [] },
      pitchView: {
        activeEventSelection: '',
        pitchActivities: [],
        teams: defaultTeamPitchInfo,
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
        teams: defaultApiTeamsDispatch,
      },
    },
  });

  const getGameActivitiesStore = (gameActivities) => ({
    planningEvent: {
      ...defaultStore.planningEvent,
      gameActivities: {
        localGameActivities: gameActivities,
        apiGameActivities: [],
      },
      eventPeriods: { apiEventPeriods: mockPeriods },
      pitchView: {
        ...defaultStore.planningEvent.pitchView,
        teams: defaultApiTeamsDispatch,
        pitchActivities: gameActivities,
      },
    },
  });

  const mockGoalActivitiesToSubmit = [
    {
      absolute_minute: 0,
      athlete_id: 3,
      kind: eventTypes.goal,
      minute: 0,
      relation: { id: null },
    },
  ];

  const renderComponent = async ({
    props = defaultProps,
    leagueOps = {},
    store = defaultStore,
    manageMatchReport = true,
    preferences = mockPreferences,
  }) => {
    useLeagueOperations.mockReturnValue({ ...defaultLeagueOps, ...leagueOps });
    usePreferences.mockReturnValue({
      preferences,
    });
    usePermissions.mockReturnValue({
      permissions: {
        leagueGame: {
          manageMatchReport,
        },
      },
    });

    renderWithRedux(<MatchReportApp {...props} />, {
      preloadedState: store,
    });

    await waitForElementToBeRemoved(
      screen.queryByTestId('DelayedLoadingFeedback')
    );
  };

  let axiosGet;
  let axiosPost;
  let axiosPatch;

  let useDispatchSpy;
  let mockDispatch;

  const customBeforeEach = (
    customEventActivities = [],
    gameEvent = matchReportEvent
  ) => {
    axiosGet = jest.spyOn(axios, 'get');
    axiosPost = jest.spyOn(axios, 'post');
    axiosPatch = jest.spyOn(axios, 'patch');

    useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    mockDispatch = jest.fn();
    useDispatchSpy.mockReturnValue(mockDispatch);

    server.use(
      rest.get('/planning_hub/events/1337', (req, res, ctx) =>
        res(ctx.json({ event: gameEvent }))
      ),
      rest.patch('/planning_hub/events/1337', (req, res, ctx) =>
        res(ctx.json({ event: gameEvent }))
      ),
      rest.get(
        '/ui/planning_hub/events/1337/game_activities',
        (req, res, ctx) => res(ctx.json(customEventActivities))
      )
    );
  };

  const customAfterEach = () => {
    jest.restoreAllMocks();
  };

  describe('Initial League render', () => {
    beforeEach(async () => {
      customBeforeEach([], {
        ...matchReportEvent,
        score: 5,
        opponent_score: 4,
      });
    });
    afterEach(customAfterEach);

    it('dispatches the relevant api information upon retrieval', async () => {
      await renderComponent({
        leagueOps: { isLeague: true },
      });
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: defaultApiTeamsDispatch,
        type: 'pitchView/setTeams',
      });
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'gameActivities/setSavedGameActivities',
        payload: [],
      });
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'eventPeriods/setSavedEventPeriods',
        payload: mockPeriods,
      });
    });

    it('renders the default scoreline based on the game event as there are no activities', async () => {
      await renderComponent({
        leagueOps: { isLeague: true },
      });
      expect(screen.getByTestId(ORG_SCORE_TEST_ID)).toHaveDisplayValue('5');
      expect(screen.getByTestId(OPPONENT_SCORE_TEST_ID)).toHaveDisplayValue(
        '4'
      );
    });

    it('the submit button is disabled if there are no activities to submit', async () => {
      const user = userEvent.setup();
      await renderComponent({ leagueOps: { isLeague: true } });
      await user.click(screen.getByRole('button', { name: /Edit/i }));
      expect(
        screen.getByRole('button', { name: /Submit Report/i })
      ).toBeDisabled();
    });

    it('allows the use to edit and dispatch an active event selection', async () => {
      const user = userEvent.setup();
      await renderComponent({ leagueOps: { isLeague: true } });
      await user.click(screen.getByRole('button', { name: /Edit/i }));
      expect(
        screen.queryByRole('button', { name: /Edit/i })
      ).not.toBeInTheDocument();
      await user.click(
        screen.getByRole('button', {
          name: goalEventButton,
        })
      );
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: eventTypes.goal,
        type: 'pitchView/setActiveEventSelection',
      });
    });

    it('allows the league to add a goal game activity to the match report', async () => {
      const user = userEvent.setup();
      await renderComponent({
        leagueOps: { isLeague: true },
        store: getActiveEventSelectionStore(eventTypes.goal),
      });
      await user.click(screen.getByRole('button', { name: /Edit/i }));
      expect(
        screen.getByRole('button', {
          name: goalEventButton,
        })
      ).toHaveClass('selectedButton');
      await user.click(screen.getByText('John Cena'));
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: mockGoalActivitiesToSubmit,
        type: 'gameActivities/setUnsavedGameActivities',
      });
      expect(screen.getByTestId(ORG_SCORE_TEST_ID)).toHaveDisplayValue('1');
    });

    it('allows the league user to edit and submit the report', async () => {
      const user = userEvent.setup();
      await renderComponent({
        leagueOps: { isLeague: true },
        store: getGameActivitiesStore(mockGoalActivitiesToSubmit),
      });
      await user.click(screen.getByRole('button', { name: /Edit/i }));
      await user.click(screen.getByRole('button', { name: /Submit Report/i }));
      await user.click(screen.getByText('Submit'));
      expect(
        screen.queryByRole('button', { name: /Submit Report/i })
      ).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Edit/i })).toBeInTheDocument();
      expect(axiosPatch).toHaveBeenCalledWith(
        '/planning_hub/events/1337',
        {
          id: 1337,
          type: 'game_event',
          score: 5,
          opponent_score: 4,
          match_report_submitted: true,
          disciplinary_issue: false,
        },
        { params: {} }
      );
      await user.click(screen.getByRole('button', { name: /Edit/i }));
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: '',
        type: 'pitchView/setActiveEventSelection',
      });
    });

    it('allows the league user to edit and cancel editing the report reverting changes', async () => {
      const user = userEvent.setup();
      await renderComponent({
        leagueOps: { isLeague: true },
        store: getGameActivitiesStore(mockGoalActivitiesToSubmit),
      });
      await user.click(screen.getByRole('button', { name: /Edit/i }));
      expect(screen.getByText('Submit Report')).toBeInTheDocument();
      await user.click(screen.getByText('Away Team'));
      await user.click(screen.getByText('Cody Rhodes'));
      await user.click(screen.getByText('Home Team'));
      await user.click(screen.getByRole('button', { name: /Cancel/i }));
      expect(screen.queryByText('Cody Rhodes')).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Edit/i })).toBeInTheDocument();
    });

    it('allows the league user to add staff members to the event list', async () => {
      const user = userEvent.setup();
      await renderComponent({
        leagueOps: { isLeague: true },
        store: getActiveEventSelectionStore(eventTypes.yellow),
      });
      await user.click(screen.getByRole('button', { name: /Edit/i }));
      await user.click(screen.getByText('Paul Levesque'));
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: [
          {
            absolute_minute: 0,
            kind: eventTypes.yellow,
            minute: 0,
            relation: { id: null },
            user_id: 1,
          },
        ],
        type: 'gameActivities/setUnsavedGameActivities',
      });
    });
  });

  describe('Failed Render', () => {
    beforeEach(async () => {
      jest.spyOn(axios, 'get').mockRejectedValue(new Error('whoops'));
      await renderComponent({ props: defaultProps });
    });

    it('displays a failed error message', () => {
      expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
    });
  });

  describe('As org supervised', () => {
    beforeEach(customBeforeEach);
    afterEach(customAfterEach);

    it('renders the match report in read only', async () => {
      await renderComponent({
        leagueOps: {
          isOrgSupervised: true,
        },
      });

      expect(
        screen.queryByRole('button', { name: /Save/i })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /Submit Report/i })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /Cancel/i })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /Edit/i })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /Clear Events/i })
      ).not.toBeInTheDocument();
      expect(screen.queryByText('Game notes')).not.toBeInTheDocument();
      expect(
        screen.queryByText('Flag as a game with a disciplinary issue')
      ).not.toBeInTheDocument();
    });
  });

  describe('Failed Save/Submit', () => {
    beforeEach(async () => {
      customBeforeEach();
      server.use(
        rest.post(
          '/ui/planning_hub/events/1337/game_periods/1/v2/game_activities/bulk_save',
          (req, res, ctx) => res.once(ctx.status(500))
        )
      );
    });
    afterEach(customAfterEach);

    it('presents an error message when the submit report button is selected', async () => {
      const user = userEvent.setup();
      await renderComponent({
        leagueOps: { isLeague: true },
        store: getGameActivitiesStore(mockGoalActivitiesToSubmit),
      });
      await user.click(screen.getByRole('button', { name: /Edit/i }));
      await user.click(screen.getByRole('button', { name: /Submit Report/i }));
      await user.click(screen.getByText('Submit'));
      expect(defaultProps.toastDispatch).toHaveBeenCalledWith({
        toast: {
          id: 2,
          status: 'ERROR',
          title: 'Error Submitting the match report. Please try again!',
        },
        type: 'UPDATE_TOAST',
      });
    });
  });

  describe('As scout', () => {
    beforeEach(() => {
      customBeforeEach([
        {
          id: 1,
          kind: eventTypes.goal,
          absolute_minute: 10,
          athlete_id: 1,
          game_period_id: 1,
        },
        {
          id: 2,
          kind: eventTypes.goal,
          absolute_minute: 15,
          athlete_id: 1,
          game_period_id: 1,
        },
        {
          id: 3,
          kind: eventTypes.goal,
          absolute_minute: 30,
          athlete_id: 4,
          game_period_id: 1,
        },
      ]);
    });
    afterEach(customAfterEach);

    it('renders the match report in read only', async () => {
      await renderComponent({
        leagueOps: {
          isScout: true,
        },
      });

      expect(
        screen.queryByRole('button', { name: /Save/i })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /Submit Report/i })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /Cancel/i })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /Edit/i })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /Clear Events/i })
      ).not.toBeInTheDocument();
      expect(screen.queryByText('Game notes')).not.toBeInTheDocument();
      expect(
        screen.queryByText('Flag as a game with a disciplinary issue')
      ).not.toBeInTheDocument();

      expect(screen.getByTestId(ORG_SCORE_TEST_ID)).toHaveDisplayValue('2');
      expect(screen.getByTestId(OPPONENT_SCORE_TEST_ID)).toHaveDisplayValue(
        '1'
      );
    });
  });

  describe('Preference league_match_report_pitch_view render', () => {
    beforeEach(() => {
      customBeforeEach();
    });
    afterEach(() => {
      customAfterEach();
    });

    it('does not call fields api when the league_match_report_pitch_view preference is off', async () => {
      await renderComponent({ leagueOps: { isLeague: true } });
      expect(axiosGet).not.toHaveBeenCalledWith('/ui/planning_hub/fields');
    });

    it('renders out the list/pitch toggle toggle', async () => {
      await renderComponent({
        leagueOps: { isLeague: true },
        preferences: { league_match_report_pitch_view: true },
      });
      expect(
        screen.getByRole('button', { name: 'List view' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Pitch view' })
      ).toBeInTheDocument();
    });
  });

  describe('Preference league_match_report_penalty_shootout render', () => {
    beforeEach(() => {
      customBeforeEach();
    });
    afterEach(() => {
      customAfterEach();
    });

    it('renders out the event list toggle', async () => {
      await renderComponent({
        leagueOps: { isLeague: true },
        preferences: { league_match_report_penalty_shootout: true },
      });
      expect(
        screen.getByRole('button', { name: 'Regular / Extra Time' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /Penalty Shoot-out/i })
      ).toBeInTheDocument();
    });

    it('selecting penalty shootout displays the penalty shootout list', async () => {
      const user = userEvent.setup();
      await renderComponent({
        leagueOps: {
          isLeague: true,
        },
        preferences: { league_match_report_penalty_shootout: true },
      });
      await user.click(
        screen.getByRole('button', { name: /Penalty Shoot-out/i })
      );
      expect(screen.getAllByText('Penalty Shoot-out').length).toEqual(2);
      expect(
        screen.getByRole('button', { name: /Add Penalty/i })
      ).toBeInTheDocument();
    });

    it('filling out a penalty and clicking save submits it to the backend', async () => {
      const user = userEvent.setup();
      await renderComponent({
        leagueOps: { isLeague: true },
        preferences: { league_match_report_penalty_shootout: true },
        store: getGameActivitiesStore([]),
      });
      await user.click(
        screen.getByRole('button', { name: /Penalty Shoot-out/i })
      );
      await user.click(screen.getByRole('button', { name: /Edit/i }));
      await user.click(screen.getAllByLabelText('Player 1')[0]);
      await user.click(screen.getAllByText('John Cena')[1]);
      await user.click(screen.getAllByTestId('SCORED-button')[0]);
      await user.click(screen.getByRole('button', { name: /Submit Report/i }));
      await user.click(screen.getByText('Submit'));
      expect(axiosPost).toHaveBeenCalledWith(
        '/ui/planning_hub/events/1337/game_periods/1/v2/game_activities/bulk_save',
        {
          game_activities: [
            {
              absolute_minute: 1,
              athlete_id: 3,
              game_activities: [
                {
                  absolute_minute: 0,
                  athlete_id: 3,
                  kind: eventTypes.goal,
                  minute: 0,
                },
              ],
              kind: eventTypes.penalty_shootout,
              minute: 1,
            },
          ],
        }
      );

      expect(axiosPatch).toHaveBeenCalledWith(
        '/planning_hub/events/1337',
        {
          id: 1337,
          type: 'game_event',
          disciplinary_issue: false,
          match_report_submitted: true,
          opponent_penalty_shootout_score: 0,
          opponent_score: 0,
          penalty_shootout_score: 1,
          score: 0,
        },
        { params: {} }
      );
    });

    it('filling out a penalty and clicking save, sends it to the set_scores endpoint if it is updating a report', async () => {
      const user = userEvent.setup();
      await renderComponent({
        leagueOps: { isOfficial: true },
        preferences: { league_match_report_penalty_shootout: true },
        store: getGameActivitiesStore([]),
      });
      await user.click(
        screen.getByRole('button', { name: /Penalty Shoot-out/i })
      );
      await user.click(screen.getAllByLabelText('Player 1')[0]);
      await user.click(screen.getAllByText('John Cena')[1]);
      await user.click(screen.getAllByTestId('SCORED-button')[0]);
      await user.click(screen.getByRole('button', { name: /Save/i }));
      await user.click(screen.getAllByText('Save')[1]);
      expect(axiosPost).toHaveBeenCalledWith(
        '/planning_hub/events/1337/set_scores',
        {
          opponent_penalty_shootout_score: 0,
          opponent_score: 0,
          penalty_shootout_score: 1,
          score: 0,
        }
      );
    });
  });

  describe('Official Submitted Report render', () => {
    beforeEach(() => {
      customBeforeEach([], {
        ...matchReportEvent,
        match_report_submitted_by_id: 111111,
      });
    });

    afterEach(() => {
      customAfterEach();
    });

    it('The submit report button and save is disabled for the official when the report has already been submitted', async () => {
      await renderComponent({ leagueOps: { isOfficial: true } });
      expect(screen.getByRole('button', { name: /Save/i })).toBeDisabled();
      expect(
        screen.getByRole('button', { name: /Submit Report/i })
      ).toBeDisabled();
    });
  });

  describe('Initial Official render', () => {
    beforeEach(async () => {
      customBeforeEach();
    });
    afterEach(customAfterEach);

    it('renders the relevant game event details', async () => {
      await renderComponent({ leagueOps: { isOfficial: true } });
      expect(
        screen.getByText(
          'Test Squad name Wee woo name v Opponent Org Test Name'
        )
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /Submit Report/i })
      ).toBeInTheDocument();
      expect(
        screen.getByText('December 19, 2023 5:58 PM, Europe/Dublin')
      ).toBeInTheDocument();
    });

    it('renders the appropriate team table info', async () => {
      await renderComponent({ leagueOps: { isOfficial: true } });
      expect(screen.getByText('Home Team')).toBeInTheDocument();
      expect(screen.getByText('Away Team')).toBeInTheDocument();
      expect(screen.getByText('Player')).toBeInTheDocument();
      expect(screen.getByText('DOB')).toBeInTheDocument();
      expect(screen.getByText('Position')).toBeInTheDocument();
      expect(screen.getByText('Jersey')).toBeInTheDocument();
      expect(screen.getByText('Designation')).toBeInTheDocument();
    });

    it('renders the appropriate team staff table info', async () => {
      const user = userEvent.setup();
      await renderComponent({
        leagueOps: { isOfficial: true },
        store: getActiveEventSelectionStore(''),
      });
      expect(screen.getByText('Staff')).toBeInTheDocument();
      expect(screen.getByText('Role')).toBeInTheDocument();
      expect(screen.getByText('Paul Levesque')).toBeInTheDocument();
      expect(screen.getByText('The Boss')).toBeInTheDocument();
      await user.click(screen.getByText('Away Team'));
      expect(screen.getByText('Tony Khan')).toBeInTheDocument();
      expect(screen.getByText('The Other Boss')).toBeInTheDocument();
    });

    it('renders the appropriate event list info', async () => {
      await renderComponent({ leagueOps: { isOfficial: true } });
      expect(screen.getByText('Event list')).toBeInTheDocument();
      expect(
        screen.getByRole('button', {
          name: goalEventButton,
        })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', {
          name: yellowCardEventButton,
        })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', {
          name: redCardEventButton,
        })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', {
          name: substitutionEventButton,
        })
      ).toBeInTheDocument();
    });

    it('renders the game notes area', async () => {
      await renderComponent({ leagueOps: { isOfficial: true } });
      expect(screen.getByText('Game notes')).toBeInTheDocument();
      expect(screen.getByText('Notes about the game')).toBeInTheDocument();
      expect(
        screen.getByText('Flag as a game with a disciplinary issue')
      ).toBeInTheDocument();
    });

    it('renders an activity in event list when created', async () => {
      await renderComponent({
        leagueOps: { isOfficial: true },
        store: getGameActivitiesStore(mockGoalActivitiesToSubmit),
      });
      expect(screen.getByText('John Cena (Home Team)')).toBeInTheDocument();
    });

    it('The submit report button is disabled for the official when the only activities that exist are deletable ones', async () => {
      await renderComponent({
        leagueOps: { isOfficial: true },
        store: getGameActivitiesStore([
          {
            kind: eventTypes.goal,
            absolute_minute: 0,
            athlete_id: 1223,
            delete: true,
          },
        ]),
      });
      expect(screen.getByRole('button', { name: /Save/i })).toBeEnabled();
      expect(
        screen.getByRole('button', { name: /Submit Report/i })
      ).toBeDisabled();
    });

    it('clicking submit report shows the submit report modal', async () => {
      const user = userEvent.setup();
      await renderComponent({
        leagueOps: { isOfficial: true },
        store: getGameActivitiesStore(mockGoalActivitiesToSubmit),
      });
      await user.click(screen.getByRole('button', { name: /Submit Report/i }));
      expect(
        screen.getByText(
          'Once this report has been submitted, only league admins will have the ability to make changes.'
        )
      ).toBeInTheDocument();
      await user.click(screen.getByText('Cancel'));
    });

    it('clicking submit/save report shows its specific info (test to make sure it doesnt only show submit info)', async () => {
      const user = userEvent.setup();
      await renderComponent({
        leagueOps: { isOfficial: true },
        store: getGameActivitiesStore(mockGoalActivitiesToSubmit),
      });
      await user.click(screen.getByRole('button', { name: /Submit Report/i }));
      await user.click(screen.getByText('Cancel'));
      await user.click(screen.getByRole('button', { name: /Save/i }));
      expect(
        screen.getByText(
          'Any saved changes will be visible by the league admins and all officials assigned to the report.'
        )
      ).toBeInTheDocument();
      await user.click(screen.getByText('Cancel'));
      await user.click(screen.getByRole('button', { name: /Submit Report/i }));
      expect(
        screen.getByText(
          'Once this report has been submitted, only league admins will have the ability to make changes.'
        )
      ).toBeInTheDocument();
    });

    it('has goal events and then saves the report as an official', async () => {
      const user = userEvent.setup();
      await renderComponent({
        leagueOps: { isOfficial: true },
        store: getGameActivitiesStore([
          ...mockGoalActivitiesToSubmit,
          { ...mockGoalActivitiesToSubmit[0], athlete_id: 4 },
        ]),
      });
      await user.click(screen.getByRole('button', { name: /Save/i }));
      await user.click(screen.getAllByText('Save')[1]);
      expect(defaultProps.toastDispatch).toHaveBeenCalledWith({
        toast: {
          id: 1,
          status: 'SUCCESS',
          title: 'Officials Match Report Successfully Saved!',
        },
        type: 'UPDATE_TOAST',
      });
    });

    it('adds goal events for each team and then submits the report', async () => {
      const user = userEvent.setup();
      await renderComponent({
        leagueOps: { isOfficial: true },
        store: getGameActivitiesStore([
          ...mockGoalActivitiesToSubmit,
          { ...mockGoalActivitiesToSubmit[0], athlete_id: 4 },
        ]),
      });

      Object.defineProperty(window, 'location', {
        value: {
          href: 'http://localhost/league-fixtures',
        },
        writable: true, // possibility to override
      });
      await user.click(screen.getByRole('button', { name: /Submit Report/i }));
      await user.click(screen.getByText('Submit'));

      expect(axiosPost).toHaveBeenCalledWith(
        '/ui/planning_hub/events/1337/game_periods/1/v2/game_activities/bulk_save',
        {
          game_activities: [
            {
              absolute_minute: 0,
              minute: 0,
              athlete_id: 3,
              kind: eventTypes.goal,
              relation: { id: null },
            },
            {
              absolute_minute: 0,
              minute: 0,
              athlete_id: 4,
              kind: eventTypes.goal,
              relation: { id: null },
            },
          ],
        }
      );
      expect(defaultProps.toastDispatch).toHaveBeenCalledWith({
        toast: {
          id: 1,
          status: 'SUCCESS',
          title: 'Officials Match Report Successfully Submitted!',
        },
        type: 'UPDATE_TOAST',
      });
      await new Promise((resolve) => setTimeout(resolve, 2000));
      expect(window.location.href).toEqual('/league-fixtures');
    });
  });
});
