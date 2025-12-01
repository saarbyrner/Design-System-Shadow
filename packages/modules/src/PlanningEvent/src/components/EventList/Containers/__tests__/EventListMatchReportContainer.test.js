import * as redux from 'react-redux';

import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import { eventTypes } from '@kitman/common/src/consts/gameEventConsts';
import { substitutionEventButton } from '@kitman/common/src/utils/gameEventTestUtils';

import EventListMatchReportContainer from '../EventListMatchReportContainer';

jest.mock('@kitman/common/src/hooks/useLeagueOperations');

describe('EventListMatchReportContainer', () => {
  const mockActivities = [
    {
      athlete_id: 1,
      kind: eventTypes.yellow,
      absolute_minute: 0,
      activityIndex: 0,
    },
    {
      athlete_id: 1,
      kind: eventTypes.yellow,
      absolute_minute: 5,
      activityIndex: 1,
    },
    {
      athlete_id: 1,
      kind: eventTypes.red,
      absolute_minute: 5,
      activityIndex: 2,
    },
    {
      id: 1,
      athlete_id: 2,
      kind: eventTypes.yellow,
      absolute_minute: 5,
      activityIndex: 3,
    },
  ];

  const defaultStore = {
    planningEvent: {
      gameActivities: { localGameActivities: mockActivities },
      eventPeriods: {
        apiEventPeriods: [
          {
            absolute_duration_start: 0,
            absolute_duration_end: 90,
          },
        ],
      },
      pitchView: {
        activeEventSelection: '',
        pitchActivities: [
          mockActivities[3],
          mockActivities[2],
          mockActivities[1],
          mockActivities[0],
        ],
      },
    },
  };

  const getMockedActivityStore = (allActivities, pitchActivities) => ({
    planningEvent: {
      ...defaultStore.planningEvent,
      gameActivities: { localGameActivities: allActivities },
      pitchView: {
        ...defaultStore.planningEvent.pitchView,
        pitchActivities,
      },
    },
  });

  const defaultProps = {
    players: {
      homePlayers: [
        {
          id: 1,
          fullname: 'Stone Cold Steve Austin',
          birthyear: '`02',
          position: { id: 1, abbreviation: 'GK' },
          jersey: 11,
          designation: 'Primary',
        },
        {
          id: 2,
          fullname: 'Cody Rhodes',
          birthyear: '`02',
          position: { id: 3, abbreviation: 'GK' },
          jersey: 11,
          designation: 'Primary',
        },
      ],
      awayPlayers: [],
    },
    gameScores: { orgScore: 3, opponentScore: 2 },
    staff: [],
    isReadOnly: false,
    isLeague: true,
    setFlagDisciplinaryIssue: jest.fn(),
    setGameScores: jest.fn(),
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
    return renderWithProviders(<EventListMatchReportContainer {...props} />, {
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

  describe('Initial render', () => {
    it('calls setActiveEventSelection when an event button is clicked', async () => {
      const user = userEvent.setup();
      renderComponent({ leagueOps: { isLeague: true } });
      await user.click(
        screen.getByRole('button', {
          name: substitutionEventButton,
        })
      );
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: eventTypes.sub,
        type: 'pitchView/setActiveEventSelection',
      });
    });

    it('filters out events when the event filter is selected', async () => {
      const user = userEvent.setup();
      renderComponent({ leagueOps: { isLeague: true } });
      expect(screen.getAllByText('Stone Cold Steve Austin').length).toEqual(3);
      await user.click(screen.getByLabelText('Events'));
      await user.click(screen.getByText('Yellow Card'));
      expect(screen.getAllByText('Stone Cold Steve Austin').length).toEqual(2);
    });

    it('changing the event filter to `Own Goal` filters the list to own goals only', async () => {
      window.setFlag('league-ops-match-report-v2', true);
      const user = userEvent.setup();

      const mockGoalWithOwnGoalActivities = [
        // saved goal with own_goal
        {
          id: 10,
          athlete_id: 1,
          absolute_minute: 0,
          relation_id: 0,
          kind: eventTypes.goal,
          activityIndex: 0,
        },
        // saved (linked) own_goal
        {
          id: 11,
          absolute_minute: 0,
          kind: eventTypes.own_goal,
          athlete_id: 1,
          relation_id: null,
          game_activity_id: 10,
        },
        // unsaved goal with nested own_goal
        {
          absolute_minute: 1,
          minute: 1,
          kind: eventTypes.goal,
          athlete_id: 2,
          relation_id: null,
          game_activities: [
            {
              kind: eventTypes.own_goal,
              athlete_id: 2,
              absolute_minute: 1,
              minute: 1,
              relation_id: null,
            },
          ],
        },
        // saved goal without own_goal
        {
          id: 12,
          absolute_minute: 2,
          minute: 2,
          kind: eventTypes.goal,
          athlete_id: 3,
          relation_id: null,
        },
      ];

      renderComponent({
        props: {
          ...defaultProps,
          players: {
            ...defaultProps.players,
            homePlayers: [
              ...defaultProps.players.homePlayers,
              {
                id: 3,
                fullname: 'John Cena',
                birthyear: '`02',
                position: { id: 5, abbreviation: 'GK' },
                jersey: 11,
                designation: 'Primary',
              },
            ],
          },
        },
        leagueOps: { isLeague: true },
        store: getMockedActivityStore(mockGoalWithOwnGoalActivities, [
          mockGoalWithOwnGoalActivities[0],
          mockGoalWithOwnGoalActivities[2],
          mockGoalWithOwnGoalActivities[3],
        ]),
      });

      expect(screen.getByText('Stone Cold Steve Austin')).toBeInTheDocument();
      expect(screen.getByText('Cody Rhodes')).toBeInTheDocument();
      expect(screen.getByText('John Cena')).toBeInTheDocument();

      await user.click(screen.getByLabelText('Events'));
      await user.click(screen.getAllByText('Own Goal')[0]);

      expect(screen.getByText('Stone Cold Steve Austin')).toBeInTheDocument();
      expect(screen.getByText('Cody Rhodes')).toBeInTheDocument();
      expect(screen.queryByText('John Cena')).not.toBeInTheDocument();
    });

    it('changing the event filter to `Own goal` is not possible if the feature flag is off', async () => {
      window.setFlag('league-ops-match-report-v2', false);
      const user = userEvent.setup();
      renderComponent({ leagueOps: { isLeague: true } });

      await user.click(screen.getByLabelText('Events'));
      expect(screen.queryByText('Own Goal')).not.toBeInTheDocument();
    });

    it('filters out events when the player filter is selected', async () => {
      const user = userEvent.setup();
      renderComponent({ leagueOps: { isLeague: true } });
      expect(screen.getAllByText('Stone Cold Steve Austin').length).toEqual(3);
      await user.click(screen.getByLabelText('Players'));
      await user.click(screen.getAllByText('Cody Rhodes')[0]);
      expect(
        screen.queryByText('Stone Cold Steve Austin')
      ).not.toBeInTheDocument();
    });

    it('deleting a event calls setUnsavedGameActivities removing the events selected', async () => {
      const user = userEvent.setup();
      renderComponent({ leagueOps: { isLeague: true } });
      await user.click(screen.getAllByRole('button')[6]);
      await user.click(screen.getByText('Confirm'));
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: [mockActivities[0], mockActivities[3]],
        type: 'gameActivities/setUnsavedGameActivities',
      });
    });

    it('deleting a saved event calls setUnsavedGameActivities assigning a delete tag to the events', async () => {
      const user = userEvent.setup();
      renderComponent({ leagueOps: { isLeague: true } });
      await user.click(screen.getAllByRole('button')[5]);
      await user.click(screen.getByText('Confirm'));
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: [
          mockActivities[0],
          mockActivities[1],
          mockActivities[2],
          {
            absolute_minute: 5,
            activityIndex: 3,
            athlete_id: 2,
            delete: true,
            id: 1,
            kind: eventTypes.yellow,
          },
        ],
        type: 'gameActivities/setUnsavedGameActivities',
      });
    });

    it('deleting a saved goal event calls setUnsavedGameActivities assigning a delete tag to the event', async () => {
      const user = userEvent.setup();

      const mockedSavedGoalActivities = [
        {
          id: 2,
          athlete_id: 2,
          kind: eventTypes.goal,
          absolute_minute: 10,
          additional_minute: 2,
          relation_id: null,
          minute: 10,
          organisation_id: 123,
          activityIndex: 0,
          game_activities: [
            {
              athlete_id: 2,
              kind: eventTypes.own_goal,
              absolute_minute: 10,
              additional_minute: 2,
              relation_id: null,
              minute: 10,
              organisation_id: 123,
            },
          ],
        },
      ];
      renderComponent({
        ...defaultProps,
        leagueOps: { isLeague: true },
        store: getMockedActivityStore(
          mockedSavedGoalActivities,
          mockedSavedGoalActivities
        ),
      });

      await user.click(screen.getAllByRole('button')[5]);
      await user.click(screen.getByText('Confirm'));

      expect(mockDispatch).toHaveBeenCalledWith({
        payload: [{ ...mockedSavedGoalActivities[0], delete: true }],
        type: 'gameActivities/setUnsavedGameActivities',
      });
    });

    it('deleting a saved goal with a linked own goal event calls setUnsavedGameActivities assigning a delete tag to both events', async () => {
      const user = userEvent.setup();
      const mockLinkedGoalActivities = [
        {
          id: 5,
          athlete_id: 1,
          kind: eventTypes.goal,
          absolute_minute: 5,
          relation_id: null,
          minute: 10,
          organisation_id: 123,
          activityIndex: 0,
          additional_minute: 2,
        },
        {
          id: 6,
          athlete_id: 1,
          kind: eventTypes.own_goal,
          absolute_minute: 5,
          relation_id: null,
          minute: 10,
          organisation_id: 123,
          additional_minute: 2,
          game_activity_id: 5,
        },
      ];

      renderComponent({
        ...defaultProps,
        leagueOps: { isLeague: true },
        store: getMockedActivityStore(
          mockLinkedGoalActivities,
          mockLinkedGoalActivities
        ),
      });

      await user.click(screen.getAllByRole('button')[5]);
      await user.click(screen.getByText('Confirm'));

      expect(mockDispatch).toHaveBeenCalledWith({
        payload: [
          { ...mockLinkedGoalActivities[0], delete: true },
          { ...mockLinkedGoalActivities[1], delete: true },
        ],
        type: 'gameActivities/setUnsavedGameActivities',
      });
    });

    it('changing the event minute calls setUnsavedGameActivities', async () => {
      const user = userEvent.setup();
      renderComponent({ leagueOps: { isLeague: true } });

      const minuteInput = screen.getAllByRole('spinbutton')[4];
      await user.click(minuteInput);
      await user.clear(minuteInput);
      fireEvent.change(minuteInput, { target: { value: '52' } });
      await user.tab();

      expect(mockDispatch).toHaveBeenCalledWith({
        payload: [
          mockActivities[0],
          {
            absolute_minute: 52,
            activityIndex: 1,
            additional_minute: undefined,
            athlete_id: 1,
            kind: eventTypes.yellow,
            minute: 52,
          },
          {
            absolute_minute: 52,
            activityIndex: 2,
            additional_minute: undefined,
            athlete_id: 1,
            kind: eventTypes.red,
            minute: 52,
          },
          mockActivities[3],
        ],
        type: 'gameActivities/setUnsavedGameActivities',
      });
    });

    it('allows you to change the event minute to the start time of the period/game', async () => {
      const user = userEvent.setup();
      renderComponent({ leagueOps: { isLeague: true } });
      const minuteInput = screen.getAllByRole('spinbutton')[4];
      await user.click(minuteInput);
      await user.clear(minuteInput);
      fireEvent.change(minuteInput, { target: { value: '0' } });
      await user.tab();
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: [
          mockActivities[0],
          {
            absolute_minute: 0,
            activityIndex: 1,
            additional_minute: undefined,
            athlete_id: 1,
            kind: eventTypes.yellow,
            minute: 0,
          },
          {
            absolute_minute: 0,
            activityIndex: 2,
            additional_minute: undefined,
            athlete_id: 1,
            kind: eventTypes.red,
            minute: 0,
          },
          mockActivities[3],
        ],
        type: 'gameActivities/setUnsavedGameActivities',
      });
    });

    it('changing the event minute out of the match times causes an invalid error', async () => {
      const user = userEvent.setup();
      renderComponent({ leagueOps: { isLeague: true } });

      const input = screen.getAllByRole('spinbutton')[4];
      await user.click(input);
      await user.clear(input);
      fireEvent.change(input, {
        target: { value: '91' },
      });
      await user.tab();
      expect(screen.getByText('Invalid Time In Period')).toBeInTheDocument();
    });

    it('changing the event minute to match the end time of the period is allowed', async () => {
      const user = userEvent.setup();
      renderComponent({ leagueOps: { isLeague: true } });
      const minuteInput = screen.getAllByRole('spinbutton')[4];

      await user.click(minuteInput);
      await user.clear(minuteInput);
      fireEvent.change(minuteInput, { target: { value: '90' } });
      await user.tab();

      expect(
        screen.queryByText('Invalid Time In Period')
      ).not.toBeInTheDocument();
    });

    it('changing the additional time minute calls setUnsavedGameActivities', async () => {
      const user = userEvent.setup();
      renderComponent({ leagueOps: { isLeague: true } });

      const minuteInput = screen.getAllByRole('spinbutton')[1];
      await user.click(minuteInput);
      await user.clear(minuteInput);
      fireEvent.change(minuteInput, {
        target: { value: '20' },
      });
      await user.tab();

      expect(mockDispatch).toHaveBeenCalledWith({
        payload: [
          mockActivities[0],
          mockActivities[1],
          mockActivities[2],
          {
            id: 1,
            absolute_minute: 5,
            activityIndex: 3,
            additional_minute: 20,
            athlete_id: 2,
            kind: eventTypes.yellow,
            minute: undefined,
          },
        ],
        type: 'gameActivities/setUnsavedGameActivities',
      });
    });

    it('changing the additional time minute of a goal also updates the nested own goal additional_minute', async () => {
      const user = userEvent.setup();
      const mockGoalActivities = [
        {
          id: 5,
          athlete_id: 1,
          kind: eventTypes.goal,
          absolute_minute: 10,
          relation_id: null,
          minute: 10,
          organisation_id: 123,
          activityIndex: 0,
          additional_minute: 2,
          game_activities: [
            {
              athlete_id: 1,
              kind: eventTypes.own_goal,
              absolute_minute: 10,
              relation_id: null,
              minute: 10,
              organisation_id: 123,
              additional_minute: 2,
            },
          ],
        },
      ];
      renderComponent({
        ...defaultProps,
        leagueOps: { isLeague: true },
        store: getMockedActivityStore(mockGoalActivities, mockGoalActivities),
      });

      const input = screen.getAllByRole('spinbutton')[1];
      await user.click(input);
      await user.clear(input);
      fireEvent.change(input, { target: { value: '30' } });
      await user.tab();

      expect(mockDispatch).toHaveBeenCalledWith({
        payload: [
          {
            ...mockGoalActivities[0],
            additional_minute: 30,
            game_activities: [
              {
                ...mockGoalActivities[0].game_activities[0],
                additional_minute: 30,
              },
            ],
          },
        ],
        type: 'gameActivities/setUnsavedGameActivities',
      });
    });

    it('changing the absolute time minute of a goal also updates the linked own goal absolute_minute and minute', async () => {
      const user = userEvent.setup();
      const mockLinkedGoalActivities = [
        {
          id: 5,
          athlete_id: 1,
          kind: eventTypes.goal,
          absolute_minute: 5,
          relation_id: null,
          minute: 10,
          organisation_id: 123,
          activityIndex: 0,
          additional_minute: 2,
        },
        {
          id: 6,
          athlete_id: 1,
          kind: eventTypes.own_goal,
          absolute_minute: 5,
          relation_id: null,
          minute: 10,
          organisation_id: 123,
          additional_minute: 2,
          game_activity_id: 5,
        },
      ];
      renderComponent({
        ...defaultProps,
        leagueOps: { isLeague: true },
        store: getMockedActivityStore(
          mockLinkedGoalActivities,
          mockLinkedGoalActivities
        ),
      });

      const input = screen.getAllByRole('spinbutton')[0];
      await user.click(input);
      await user.clear(input);
      fireEvent.change(input, { target: { value: '30' } });
      await user.tab();

      expect(mockDispatch).toHaveBeenCalledWith({
        payload: [
          { ...mockLinkedGoalActivities[0], absolute_minute: 30, minute: 30 },
          { ...mockLinkedGoalActivities[1], absolute_minute: 30, minute: 30 },
        ],
        type: 'gameActivities/setUnsavedGameActivities',
      });
    });

    it('changes reason dropdown value when an option is selected', async () => {
      const user = userEvent.setup();
      renderComponent({ leagueOps: { isLeague: true } });
      await user.click(screen.getAllByLabelText('Reason')[0]);
      await user.click(screen.getByText('Foul'));
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: [
          mockActivities[0],
          mockActivities[1],
          mockActivities[2],
          {
            absolute_minute: 5,
            activityIndex: 3,
            athlete_id: 2,
            id: 1,
            kind: eventTypes.yellow,
            relation: { id: 1 },
          },
        ],
        type: 'gameActivities/setUnsavedGameActivities',
      });
    });

    it('clicking the clear events button clears all events listed', async () => {
      const user = userEvent.setup();
      renderComponent({ leagueOps: { isLeague: true } });
      await user.click(screen.getByText('Clear events'));
      expect(
        screen.getByText(
          `Are you sure you want to clear all the events from the event list!`
        )
      ).toBeInTheDocument();
      await user.click(screen.getByText('Confirm'));
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: [
          {
            absolute_minute: 5,
            activityIndex: 3,
            athlete_id: 2,
            delete: true,
            id: 1,
            kind: eventTypes.yellow,
          },
        ],
        type: 'gameActivities/setUnsavedGameActivities',
      });
      expect(defaultProps.setGameScores).toHaveBeenCalledWith({
        opponentScore: 0,
        orgScore: 0,
      });
    });
  });

  describe('disciplinary flag toggle off render', () => {
    const singularRedMock = [
      {
        athlete_id: 1,
        kind: eventTypes.red,
        absolute_minute: 5,
        activityIndex: 2,
      },
    ];
    it('handles the case where it clears all events with a red flag involved', async () => {
      const user = userEvent.setup();
      renderComponent({
        store: getMockedActivityStore(singularRedMock, singularRedMock),
      });
      await user.click(screen.getByText('Clear events'));
      await user.click(screen.getByText('Confirm'));
      expect(defaultProps.setFlagDisciplinaryIssue).toHaveBeenCalledWith(false);
    });

    it('handles the case where it deletes a red card with no other reds left', async () => {
      const user = userEvent.setup();
      renderComponent({
        store: getMockedActivityStore(singularRedMock, singularRedMock),
      });
      await user.click(screen.getAllByRole('button')[4]);
      await user.click(screen.getByText('Confirm'));
      expect(defaultProps.setFlagDisciplinaryIssue).toHaveBeenCalledWith(false);
    });

    it('handles the case where it deletes a yellow card and its corresponding red', async () => {
      const mockYellowRedPair = [
        mockActivities[0],
        mockActivities[1],
        mockActivities[2],
      ];
      const user = userEvent.setup();
      renderComponent({
        store: getMockedActivityStore(mockYellowRedPair, mockYellowRedPair),
      });
      await user.click(screen.getAllByRole('button')[4]);
      await user.click(screen.getByText('Confirm'));
      expect(defaultProps.setFlagDisciplinaryIssue).toHaveBeenCalledWith(false);
    });
  });

  describe('substitution local render', () => {
    const mockLocalSubActivities = [
      {
        athlete_id: 1,
        kind: eventTypes.sub,
        absolute_minute: 10,
        activityIndex: 0,
        relation: { id: 2 },
        game_activities: [
          {
            athlete_id: 1,
            kind: eventTypes.position_change,
            absolute_minute: 10,
            relation: { id: 3 },
          },
          {
            athlete_id: 2,
            kind: eventTypes.position_change,
            absolute_minute: 10,
            relation: { id: 1 },
          },
        ],
      },
      {
        athlete_id: 1,
        kind: eventTypes.sub,
        absolute_minute: 5,
        activityIndex: 0,
        relation: { id: 3 },
      },
    ];

    const renderLocalSubActivityList = () =>
      renderComponent({
        props: {
          ...defaultProps,
          players: {
            ...defaultProps.players,
            homePlayers: [
              ...defaultProps.players.homePlayers,
              {
                id: 3,
                fullname: 'John Cena',
                birthyear: '`02',
                position: { id: 5, abbreviation: 'GK' },
                jersey: 11,
                designation: 'Primary',
              },
            ],
          },
        },
        store: getMockedActivityStore(
          mockLocalSubActivities,
          mockLocalSubActivities
        ),
      });

    it('allows you to change the dropdown selected player to another subbed player', async () => {
      const user = userEvent.setup();
      renderLocalSubActivityList();
      await user.click(screen.getAllByLabelText('Sub-in')[0]);
      await user.click(screen.getAllByText('John Cena')[0]);
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: [
          {
            ...mockLocalSubActivities[0],
            game_activities: [
              {
                absolute_minute: 10,
                athlete_id: 1,
                kind: eventTypes.position_change,
                relation: { id: 5 },
              },
              {
                absolute_minute: 10,
                athlete_id: 3,
                kind: eventTypes.position_change,
                relation: { id: 1 },
              },
            ],
            relation: { id: 3 },
          },
          mockLocalSubActivities[1],
        ],
        type: 'gameActivities/setUnsavedGameActivities',
      });
    });

    it('allows you to change the minute and the additional minute of a sub player event locally', async () => {
      const user = userEvent.setup();
      renderLocalSubActivityList();

      const minuteInput = screen.getAllByRole('spinbutton')[0];
      await user.click(minuteInput);
      await user.clear(minuteInput);
      fireEvent.change(minuteInput, { target: { value: '15' } });
      await user.tab();

      expect(mockDispatch).toHaveBeenCalledWith({
        payload: [
          {
            ...mockLocalSubActivities[0],
            absolute_minute: 15,
            game_activities: [
              {
                ...mockLocalSubActivities[0].game_activities[0],
                absolute_minute: 15,
                minute: 15,
              },
              {
                ...mockLocalSubActivities[0].game_activities[1],
                absolute_minute: 15,
                minute: 15,
              },
            ],
            minute: 15,
          },
          mockLocalSubActivities[1],
        ],
        type: 'gameActivities/setUnsavedGameActivities',
      });

      fireEvent.change(screen.getAllByRole('spinbutton')[1], {
        target: { value: '20' },
      });
      await user.tab();

      expect(mockDispatch).toHaveBeenCalledWith({
        payload: [
          {
            ...mockLocalSubActivities[0],
            additional_minute: 20,
            game_activities: [
              {
                ...mockLocalSubActivities[0].game_activities[0],
                additional_minute: 20,
              },
              {
                ...mockLocalSubActivities[0].game_activities[1],
                additional_minute: 20,
              },
            ],
          },
          mockLocalSubActivities[1],
        ],
        type: 'gameActivities/setUnsavedGameActivities',
      });
    });
  });

  describe('substitution saved render', () => {
    const mockLocalSubActivities = [
      {
        id: 1,
        athlete_id: 1,
        kind: eventTypes.sub,
        absolute_minute: 0,
        activityIndex: 0,
        relation: { id: 2 },
      },
      {
        id: 2,
        athlete_id: 1,
        game_activity_id: 1,
        kind: eventTypes.position_change,
        absolute_minute: 0,
        relation: { id: 3 },
      },
      {
        id: 3,
        athlete_id: 2,
        game_activity_id: 1,
        kind: eventTypes.position_change,
        absolute_minute: 0,
        relation: { id: 1 },
      },
    ];

    const renderSavedSubActivityList = () =>
      renderComponent({
        props: {
          ...defaultProps,
          players: {
            ...defaultProps.players,
            homePlayers: [
              ...defaultProps.players.homePlayers,
              {
                id: 3,
                fullname: 'John Cena',
                birthyear: '`02',
                position: { id: 5, abbreviation: 'GK' },
                jersey: 11,
                designation: 'Primary',
              },
            ],
          },
        },
        store: getMockedActivityStore(mockLocalSubActivities, [
          mockLocalSubActivities[0],
        ]),
      });

    it('allows you to change the dropdown saved selected player to another subbed player', async () => {
      const user = userEvent.setup();
      renderSavedSubActivityList();
      await user.click(screen.getByLabelText('Sub-in'));
      await user.click(screen.getByText('John Cena'));
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: [
          {
            ...mockLocalSubActivities[0],
            relation: { id: 3 },
          },
          {
            ...mockLocalSubActivities[1],
            athlete_id: 1,
            relation: { id: 5 },
          },
          {
            ...mockLocalSubActivities[2],
            athlete_id: 3,
            relation: { id: 1 },
          },
        ],
        type: 'gameActivities/setUnsavedGameActivities',
      });
    });

    it('allows you to change the minute and the additional minute of a saved sub player event', async () => {
      const user = userEvent.setup();
      renderSavedSubActivityList();

      const minuteInput = screen.getAllByRole('spinbutton')[0];
      await user.click(minuteInput);
      await user.clear(minuteInput);
      fireEvent.change(minuteInput, { target: { value: '20' } });
      await user.tab();

      expect(mockDispatch).toHaveBeenCalledWith({
        payload: [
          {
            ...mockLocalSubActivities[0],
            absolute_minute: 20,
            minute: 20,
          },
          {
            ...mockLocalSubActivities[1],
            absolute_minute: 20,
            minute: 20,
          },
          {
            ...mockLocalSubActivities[2],
            absolute_minute: 20,
            minute: 20,
          },
        ],
        type: 'gameActivities/setUnsavedGameActivities',
      });

      fireEvent.change(screen.getAllByRole('spinbutton')[1], {
        target: { value: '20' },
      });
      await user.tab();

      expect(mockDispatch).toHaveBeenCalledWith({
        payload: [
          {
            ...mockLocalSubActivities[0],
            additional_minute: 20,
          },
          {
            ...mockLocalSubActivities[1],
            additional_minute: 20,
          },
          {
            ...mockLocalSubActivities[2],
            additional_minute: 20,
          },
        ],
        type: 'gameActivities/setUnsavedGameActivities',
      });
    });

    it('allows you to delete the subbed event and any other related events by marking them to delete', async () => {
      const user = userEvent.setup();
      renderSavedSubActivityList();
      await user.click(screen.getAllByRole('button')[4]);
      await user.click(screen.getByText('Confirm'));

      expect(mockDispatch).toHaveBeenCalledWith({
        payload: [
          {
            ...mockLocalSubActivities[0],
            delete: true,
          },
          {
            ...mockLocalSubActivities[1],
            delete: true,
          },
          {
            ...mockLocalSubActivities[2],
            delete: true,
          },
        ],
        type: 'gameActivities/setUnsavedGameActivities',
      });
    });
  });

  describe('Goals saved render', () => {
    const mockLocalGoalActivities = [
      {
        id: 1,
        athlete_id: 1,
        kind: eventTypes.goal,
        absolute_minute: 0,
        activityIndex: 0,
      },
      {
        id: 2,
        athlete_id: 1,
        kind: eventTypes.goal,
        absolute_minute: 0,
        activityIndex: 1,
      },
      {
        id: 3,
        athlete_id: 2,
        kind: eventTypes.goal,
        absolute_minute: 0,
        activityIndex: 2,
      },
    ];

    const renderWithGoalActivitiesList = () =>
      renderComponent({
        props: {
          ...defaultProps,
          players: {
            homePlayers: [defaultProps.players.homePlayers[0]],
            awayPlayers: [defaultProps.players.homePlayers[1]],
          },
        },
        store: getMockedActivityStore(
          mockLocalGoalActivities,
          mockLocalGoalActivities
        ),
      });

    it('allows you to delete the goal and update the game score for the home team', async () => {
      const user = userEvent.setup();
      renderWithGoalActivitiesList();
      await user.click(screen.getAllByRole('button')[6]);
      await user.click(screen.getByText('Confirm'));
      expect(defaultProps.setGameScores).toHaveBeenCalledWith({
        opponentScore: 2,
        orgScore: 1,
      });
    });

    it('allows you to delete the goal and update the game score for the away team', async () => {
      const user = userEvent.setup();
      renderWithGoalActivitiesList();
      await user.click(screen.getAllByRole('button')[7]);
      await user.click(screen.getByText('Confirm'));
      expect(defaultProps.setGameScores).toHaveBeenCalledWith({
        opponentScore: 0,
        orgScore: 3,
      });
    });

    describe('own goal logic', () => {
      const mockGoalActivities = [
        {
          athlete_id: 1,
          kind: eventTypes.goal,
          absolute_minute: 10,
          additional_minute: 2,
          relation_id: null,
          minute: 10,
          organisation_id: 123,
          activityIndex: 0,
        },
      ];

      const mockNestedOwnGoalActivity = {
        athlete_id: 1,
        kind: eventTypes.own_goal,
        absolute_minute: 10,
        additional_minute: 2,
        relation_id: null,
        minute: 10,
        organisation_id: 123,
      };

      it('allows you to mark a goal as own goal by adding a nested own_goal activity', async () => {
        const user = userEvent.setup();
        window.setFlag('league-ops-match-report-v2', true);
        renderComponent({
          ...defaultProps,
          store: getMockedActivityStore(mockGoalActivities, mockGoalActivities),
        });

        await user.click(screen.getByLabelText('Mark as own goal'));
        expect(mockDispatch).toHaveBeenCalledWith({
          payload: [
            {
              ...mockGoalActivities[0],
              game_activities: [mockNestedOwnGoalActivity],
            },
          ],
          type: 'gameActivities/setUnsavedGameActivities',
        });
        expect(defaultProps.setGameScores).toHaveBeenCalledWith({
          opponentScore: 1,
          orgScore: 0,
        });
      });

      it('allows you to unmark a nested own_goal when turning the switch off', async () => {
        const user = userEvent.setup();
        const mockNestedGoalActivities = [
          {
            ...mockGoalActivities[0],
            game_activities: [mockNestedOwnGoalActivity],
          },
        ];

        window.setFlag('league-ops-match-report-v2', true);
        renderComponent({
          ...defaultProps,
          store: getMockedActivityStore(
            mockNestedGoalActivities,
            mockNestedGoalActivities
          ),
        });

        await user.click(screen.getByLabelText('Mark as own goal'));

        expect(mockDispatch).toHaveBeenLastCalledWith({
          payload: mockGoalActivities,
          type: 'gameActivities/setUnsavedGameActivities',
        });
        expect(defaultProps.setGameScores).toHaveBeenCalledWith({
          opponentScore: 0,
          orgScore: 1,
        });
      });

      it('allows the user to unmark a linked own_goal by marking it to delete when turning the switch off', async () => {
        const user = userEvent.setup();
        const mockLinkedGameActivities = [
          { ...mockGoalActivities[0], id: 3 },
          {
            ...mockNestedOwnGoalActivity,
            id: 99,
            delete: false,
            game_activity_id: 3,
          },
        ];

        window.setFlag('league-ops-match-report-v2', true);
        renderComponent({
          ...defaultProps,
          store: getMockedActivityStore(
            mockLinkedGameActivities,
            mockLinkedGameActivities
          ),
        });

        await user.click(screen.getByLabelText('Mark as own goal'));

        expect(mockDispatch).toHaveBeenCalledWith({
          payload: [
            mockLinkedGameActivities[0],
            {
              ...mockNestedOwnGoalActivity,
              id: 99,
              delete: true,
              game_activity_id: 3,
            },
          ],
          type: 'gameActivities/setUnsavedGameActivities',
        });
        expect(defaultProps.setGameScores).toHaveBeenCalledWith({
          opponentScore: 0,
          orgScore: 1,
        });
      });

      it('restores a linked own_goal marked for deletion when turning the switch back on', async () => {
        const user = userEvent.setup();

        const mockLinkedGameActivities = [
          { ...mockGoalActivities[0], id: 3 },
          {
            ...mockNestedOwnGoalActivity,
            id: 99,
            delete: true,
            game_activity_id: 3,
          },
        ];

        window.setFlag('league-ops-match-report-v2', true);
        renderComponent({
          store: getMockedActivityStore(
            mockLinkedGameActivities,
            mockLinkedGameActivities
          ),
        });

        await user.click(screen.getByLabelText('Mark as own goal'));
        expect(mockDispatch).toHaveBeenCalledWith({
          payload: [
            mockLinkedGameActivities[0],
            {
              ...mockNestedOwnGoalActivity,
              id: 99,
              game_activity_id: 3,
            },
          ],
          type: 'gameActivities/setUnsavedGameActivities',
        });
        expect(defaultProps.setGameScores).toHaveBeenCalledWith({
          opponentScore: 1,
          orgScore: 0,
        });
      });
    });
  });
});
