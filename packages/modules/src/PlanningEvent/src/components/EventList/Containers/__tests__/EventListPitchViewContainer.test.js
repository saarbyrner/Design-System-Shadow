import * as redux from 'react-redux';
import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { axios } from '@kitman/common/src/utils/services';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { data as reasonsData } from '@kitman/services/src/mocks/handlers/leaguefixtures/getDisciplinaryReasonsHandler';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import { eventTypes } from '@kitman/common/src/consts/gameEventConsts';
import {
  formationChangeEventButton,
  redCardEventButton,
} from '@kitman/common/src/utils/gameEventTestUtils';
import { mockOrderedPlayerData } from '@kitman/modules/src/PlanningEvent/src/components/GameEventsTab/__tests__/mockTestSquadData';

import EventListPitchViewContainer from '../EventListPitchViewContainer';

describe('EventListPitchViewContainer', () => {
  const mockPlayers = [
    { ...mockOrderedPlayerData[0], fullname: 'AJ McClune' },
    { ...mockOrderedPlayerData[1], fullname: 'Ted Ferguson' },
    { ...mockOrderedPlayerData[2], fullname: 'Bill & Ted' },
  ];

  const mockTeam = {
    inFieldPlayers: {
      '1_1': mockPlayers[0],
      '1_3': mockPlayers[1],
    },
    players: [mockPlayers[2]],
  };

  const mockPitchActivities = [
    {
      kind: eventTypes.goal,
      absolute_minute: 0,
      athlete_id: 1,
      activityIndex: 0,
    },
    {
      kind: eventTypes.yellow,
      absolute_minute: 0,
      athlete_id: 2,
      activityIndex: 1,
    },
  ];

  const mockDefaultFormationCoordinates = {
    '1_1': {
      id: 4,
      x: 1,
      y: 1,
      order: 1,
      position_id: 1,
      field_id: 1,
      formation_id: 1,
      position: {
        id: 4,
        abbreviation: 'GK',
      },
    },
    '1_3': {
      id: 10,
      x: 1,
      y: 1,
      order: 1,
      position_id: 1,
      field_id: 1,
      formation_id: 1,
      position: {
        id: 10,
        abbreviation: 'GK',
      },
    },
    '1_5': {
      id: 5,
      x: 1,
      y: 1,
      order: 1,
      position_id: 1,
      field_id: 1,
      formation_id: 1,
      position: {
        id: 5,
        abbreviation: 'CB',
      },
    },
  };

  const gameActivities = [
    { kind: eventTypes.goal, absolute_minute: 0, athlete_id: 1 },
    { kind: eventTypes.yellow, absolute_minute: 0, athlete_id: 2 },
  ];

  const pairedRedActivities = [
    { kind: eventTypes.yellow, absolute_minute: 0, athlete_id: 1 },
    { kind: eventTypes.yellow, absolute_minute: 5, athlete_id: 1 },
    { kind: eventTypes.red, absolute_minute: 5, athlete_id: 1 },
  ];

  const pairedRedPitchActivities = [
    { ...pairedRedActivities[0], activityIndex: 0 },
    { ...pairedRedActivities[1], activityIndex: 1 },
    { ...pairedRedActivities[2], activityIndex: 2 },
  ];

  const mockCurrentPeriod = {
    absolute_duration_start: 0,
    absolute_duration_end: 30,
  };

  const defaultProps = {
    t: i18nextTranslateStub(),
    currentPeriod: mockCurrentPeriod,
    selectedEvent: null,
    isLastPeriodSelected: false,
    setSelectedEvent: jest.fn(),
    formations: [],
    gameFormats: [],
    staff: [],
  };

  const defaultStore = {
    planningEvent: {
      gameActivities: { localGameActivities: gameActivities },
      pitchView: {
        team: mockTeam,
        activeEventSelection: '',
        formationCoordinates: mockDefaultFormationCoordinates,
        pitchActivities: mockPitchActivities,
        field: { id: 1 },
      },
    },
  };

  const getStoreWithCustomState = ({
    customGameActivities = gameActivities,
    customPitchViewState = defaultStore.pitchView,
  }) => ({
    planningEvent: {
      ...defaultStore.planningEvent,
      gameActivities: { localGameActivities: customGameActivities },
      pitchView: {
        ...defaultStore.planningEvent.pitchView,
        ...customPitchViewState,
      },
    },
  });

  const renderComponent = ({ props = defaultProps, store = defaultStore }) =>
    renderWithProviders(<EventListPitchViewContainer {...props} />, {
      preloadedState: store,
    });

  let useDispatchSpy;
  let mockDispatch;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    mockDispatch = jest.fn();
    useDispatchSpy.mockReturnValue(mockDispatch);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('render', () => {
    beforeEach(() => {
      jest.spyOn(axios, 'get').mockImplementation((url) => {
        switch (url) {
          case '/ui/planning_hub/game_disciplinary_reasons':
            return Promise.resolve({ data: reasonsData });
          default:
            return Promise.resolve({ data: {} });
        }
      });
    });

    it('clicks and updates the yellow card event with a reason', async () => {
      const user = userEvent.setup();
      renderComponent({ props: defaultProps });
      await user.click(screen.getByLabelText('Reason'));
      await user.click(screen.getByText('Foul'));

      expect(mockDispatch).toHaveBeenCalledWith({
        payload: [
          gameActivities[0],
          {
            ...gameActivities[1],
            relation: { id: 1 },
          },
        ],
        type: 'gameActivities/setUnsavedGameActivities',
      });
    });

    it('clicking the event list buttons fires off activeEventSelection', async () => {
      const user = userEvent.setup();
      renderComponent({ props: defaultProps });
      await user.click(
        screen.getByRole('button', {
          name: redCardEventButton,
        })
      );
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: eventTypes.red,
        type: 'pitchView/setActiveEventSelection',
      });
    });

    it('with a selected button it fires off a deselect when clicked', async () => {
      const user = userEvent.setup();
      renderComponent({
        store: getStoreWithCustomState({
          customPitchViewState: {
            activeEventSelection: eventTypes.red,
          },
        }),
      });
      expect(
        screen.getByRole('button', {
          name: redCardEventButton,
        })
      ).toHaveClass('selectedButton');
      await user.click(
        screen.getByRole('button', {
          name: redCardEventButton,
        })
      );
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: '',
        type: 'pitchView/setActiveEventSelection',
      });
    });

    it('renders the players event in the list', () => {
      renderComponent({ props: defaultProps });
      expect(screen.getAllByText('AJ McClune')[0]).toBeInTheDocument();
    });

    it('changing the event time updates the game activities', async () => {
      const user = userEvent.setup();
      renderComponent({ props: defaultProps });
      const minuteInput = screen.getAllByRole('spinbutton')[0];
      await user.click(minuteInput);
      await user.clear(minuteInput);
      fireEvent.change(minuteInput, { target: { value: '20' } });
      await user.tab();
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: [
          { ...gameActivities[0], absolute_minute: 20, minute: 20 },
          gameActivities[1],
        ],
        type: 'gameActivities/setUnsavedGameActivities',
      });
    });

    it('allows the end period time to be set as a event time if it is in the last period', async () => {
      const user = userEvent.setup();
      renderComponent({
        props: {
          ...defaultProps,
          isLastPeriodSelected: true,
        },
      });
      const minuteInput = screen.getAllByRole('spinbutton')[0];
      await user.click(minuteInput);
      await user.clear(minuteInput);
      fireEvent.change(minuteInput, { target: { value: '30' } });
      await user.tab();
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: [
          { ...gameActivities[0], absolute_minute: 30, minute: 30 },
          gameActivities[1],
        ],
        type: 'gameActivities/setUnsavedGameActivities',
      });
    });

    it('changing the event time of a yellow with a paired red updates the game activities', async () => {
      const user = userEvent.setup();
      renderComponent({
        store: getStoreWithCustomState({
          customGameActivities: pairedRedActivities,
          customPitchViewState: {
            pitchActivities: pairedRedPitchActivities,
          },
        }),
      });
      const minuteInput = screen.getAllByRole('spinbutton')[1];
      await user.click(minuteInput);
      await user.clear(minuteInput);
      fireEvent.change(minuteInput, { target: { value: '20' } });
      await user.tab();
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: [
          pairedRedActivities[0],
          {
            ...pairedRedActivities[1],
            absolute_minute: 20,
            minute: 20,
          },
          {
            ...pairedRedActivities[2],
            absolute_minute: 20,
            minute: 20,
          },
        ],
        type: 'gameActivities/setUnsavedGameActivities',
      });
    });

    it('deleting the activity updates the game activities', async () => {
      const user = userEvent.setup();
      renderComponent({ props: defaultProps });
      await user.click(screen.getAllByRole('button')[7]);
      await user.click(screen.getByText('Confirm'));
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: [gameActivities[1]],
        type: 'gameActivities/setUnsavedGameActivities',
      });
    });

    it('deleting a yellow card that has two and a red also deletes the red card locally', async () => {
      const user = userEvent.setup();
      renderComponent({
        store: getStoreWithCustomState({
          customGameActivities: pairedRedActivities,
          customPitchViewState: {
            pitchActivities: pairedRedPitchActivities,
          },
        }),
      });
      await user.click(screen.getAllByRole('button')[7]);
      await user.click(screen.getByText('Confirm'));
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: [
          { absolute_minute: 5, athlete_id: 1, kind: eventTypes.yellow },
        ],
        type: 'gameActivities/setUnsavedGameActivities',
      });
    });

    it('deleting the activity updates the game activity with a delete flag if it is saved to the backend', async () => {
      const user = userEvent.setup();
      renderComponent({
        store: getStoreWithCustomState({
          customGameActivities: [{ ...gameActivities[0], id: 1 }],
          customPitchViewState: {
            pitchActivities: [{ ...mockPitchActivities[0], id: 1 }],
          },
        }),
      });
      await user.click(screen.getAllByRole('button')[6]);
      await user.click(screen.getByText('Confirm'));
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: [
          {
            ...gameActivities[0],
            delete: true,
            id: 1,
          },
        ],
        type: 'gameActivities/setUnsavedGameActivities',
      });
    });

    it('deleting a yellow card that has two and a red also deletes the red card for the backend', async () => {
      const user = userEvent.setup();
      renderComponent({
        store: getStoreWithCustomState({
          customGameActivities: [
            { ...pairedRedActivities[0], id: 1 },
            { ...pairedRedActivities[1], id: 2 },
            { ...pairedRedActivities[2], id: 3 },
          ],
          customPitchViewState: {
            pitchActivities: [
              { ...pairedRedPitchActivities[0], id: 1 },
              { ...pairedRedPitchActivities[1], id: 2 },
              { ...pairedRedPitchActivities[2], id: 3 },
            ],
          },
        }),
      });
      await user.click(screen.getAllByRole('button')[7]);
      await user.click(screen.getByText('Confirm'));
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: [
          {
            ...pairedRedActivities[0],
            delete: true,
            id: 1,
          },
          { ...pairedRedActivities[1], id: 2 },
          {
            ...pairedRedActivities[2],
            delete: true,
            id: 3,
          },
        ],
        type: 'gameActivities/setUnsavedGameActivities',
      });
    });

    it('changing the event filter, changes the events displayed', async () => {
      const user = userEvent.setup();
      renderComponent({ props: defaultProps });
      expect(screen.getByText('AJ McClune')).toBeInTheDocument();
      expect(screen.getByText('Ted Ferguson')).toBeInTheDocument();
      await user.click(screen.getByLabelText('Events'));
      await user.click(screen.getAllByText('Goal')[1]);
      expect(screen.getByText('AJ McClune')).toBeInTheDocument();
      expect(screen.queryByText('Ted Ferguson')).not.toBeInTheDocument();
      expect(screen.getAllByText('Goal')[1]).toBeInTheDocument();
    });

    it('changing the event filter to `Own Goal` filters the list to own goals only', async () => {
      window.setFlag('league-ops-game-events-own-goal', true);
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
        props: defaultProps,
        store: getStoreWithCustomState({
          customGameActivities: mockGoalWithOwnGoalActivities,
          customPitchViewState: {
            pitchActivities: [
              mockGoalWithOwnGoalActivities[0],
              mockGoalWithOwnGoalActivities[2],
              mockGoalWithOwnGoalActivities[3],
            ],
          },
        }),
      });

      expect(screen.getByText('AJ McClune')).toBeInTheDocument();
      expect(screen.getByText('Ted Ferguson')).toBeInTheDocument();
      expect(screen.getByText('Bill & Ted')).toBeInTheDocument();

      await user.click(screen.getByLabelText('Events'));
      await user.click(screen.getAllByText('Own Goal')[0]);

      expect(screen.getByText('AJ McClune')).toBeInTheDocument();
      expect(screen.queryByText('Ted Ferguson')).toBeInTheDocument();
      expect(screen.queryByText('Bill & Ted')).not.toBeInTheDocument();
      expect(screen.getAllByText('Own Goal')[0]).toBeInTheDocument();
    });

    it('changing the event filter to `Own goal` is not possible if the feature flag is off', async () => {
      window.setFlag('league-ops-game-events-own-goal', false);
      const user = userEvent.setup();
      renderComponent({ props: defaultProps });

      await user.click(screen.getByLabelText('Events'));
      expect(screen.queryByText('Own Goal')).not.toBeInTheDocument();
    });

    it('changing the players filter, changes the events displayed', async () => {
      const user = userEvent.setup();
      renderComponent({ props: defaultProps });
      expect(screen.getByText('AJ McClune')).toBeInTheDocument();
      expect(screen.getByText('Ted Ferguson')).toBeInTheDocument();
      await user.click(screen.getByLabelText('Players'));
      await user.click(screen.getAllByText('Ted Ferguson')[0]);
      expect(screen.queryByText('AJ McClune')).not.toBeInTheDocument();
      expect(screen.getAllByText('Ted Ferguson')[1]).toBeInTheDocument();
    });

    it('clicking the clear events button clears all events listed', async () => {
      const user = userEvent.setup();
      renderComponent({ props: defaultProps });
      await user.click(screen.getByText('Clear events'));
      expect(
        screen.getByText(
          `Are you sure you want to clear all the events from the event list!`
        )
      ).toBeInTheDocument();
      await user.click(screen.getByText('Confirm'));
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: [],
        type: 'gameActivities/setUnsavedGameActivities',
      });
    });

    it('clicking the formation event creates a empty formation event activity', async () => {
      const user = userEvent.setup();
      renderComponent({
        store: getStoreWithCustomState({
          customGameActivities: [
            ...gameActivities,
            {
              kind: eventTypes.formation_change,
              absolute_minute: 0,
              relation: { id: 2 },
            },
          ],
        }),
      });
      await user.click(
        screen.getByRole('button', {
          name: formationChangeEventButton,
        })
      );
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: [
          gameActivities[0],
          gameActivities[1],
          {
            absolute_minute: 0,
            kind: eventTypes.formation_change,
            relation: { id: 2 },
          },
          {
            absolute_minute: 1,
            game_activities: [],
            kind: eventTypes.formation_change,
            relation: { id: null },
          },
        ],
        type: 'gameActivities/setUnsavedGameActivities',
      });
    });
  });

  describe('render with a switch event', () => {
    const mockActivities = [
      {
        athlete_id: 1,
        absolute_minute: 0,
        relation: {
          id: 10,
        },
        kind: eventTypes.position_change,
        game_activity_id: 1,
      },
      {
        athlete_id: 2,
        absolute_minute: 0,
        relation: {
          id: 4,
        },
        kind: eventTypes.position_change,
        game_activity_id: 1,
      },
      {
        athlete_id: 1,
        absolute_minute: 0,
        relation: {
          id: 10,
        },
        kind: eventTypes.formation_position_view_change,
        game_activity_id: 1,
      },
      {
        athlete_id: 2,
        absolute_minute: 0,
        relation: {
          id: 4,
        },
        kind: eventTypes.formation_position_view_change,
        game_activity_id: 1,
      },
    ];
    const mockSwitchActivities = [
      {
        id: 1,
        athlete_id: 1,
        absolute_minute: 0,
        relation: {
          id: 2,
        },
        kind: eventTypes.switch,
      },
      ...mockActivities,
    ];

    const mockNestedSwitchActivities = [
      {
        athlete_id: 1,
        absolute_minute: 0,
        relation: {
          id: 2,
        },
        kind: eventTypes.switch,
        game_activities: mockActivities,
      },
    ];

    const mockPitchActivity = {
      athlete_id: 1,
      absolute_minute: 0,
      relation: {
        id: 2,
      },
      kind: eventTypes.switch,
      game_activity_id: 1,
      activityIndex: 0,
    };

    const mockSwitchInitialInFieldTeam = {
      inFieldPlayers: {
        '1_1': mockPlayers[1],
        '1_3': mockPlayers[0],
        '1_5': mockPlayers[2],
      },
      players: [],
    };

    const mockSwitchExpectedInFieldTeam = {
      inFieldPlayers: {
        '1_1': mockPlayers[2],
        '1_3': mockPlayers[1],
        '1_5': mockPlayers[0],
      },
      players: [],
    };

    describe('saved switch event', () => {
      it('renders out the switch event', () => {
        renderComponent({
          store: getStoreWithCustomState({
            customGameActivities: mockSwitchActivities,
            customPitchViewState: {
              pitchActivities: [mockPitchActivity],
            },
          }),
        });
        expect(screen.getByText('AJ McClune')).toBeInTheDocument();
        expect(screen.getByText('Player in Field')).toBeInTheDocument();
        expect(screen.getByText('Ted Ferguson')).toBeInTheDocument();
      });

      it('updates the values of all the related activities to the switch when the minute is changed', async () => {
        const user = userEvent.setup();
        renderComponent({
          store: getStoreWithCustomState({
            customGameActivities: mockSwitchActivities,
            customPitchViewState: {
              pitchActivities: [mockPitchActivity],
            },
          }),
        });
        const minuteInput = screen.getByRole('spinbutton');
        await user.click(minuteInput);
        await user.clear(minuteInput);
        fireEvent.change(minuteInput, { target: { value: '20' } });
        await user.tab();

        expect(mockDispatch).toHaveBeenCalledWith({
          payload: [
            {
              ...mockSwitchActivities[0],
              absolute_minute: 20,
              minute: 20,
            },
            {
              ...mockSwitchActivities[1],
              absolute_minute: 20,
              minute: 20,
            },
            {
              ...mockSwitchActivities[2],
              absolute_minute: 20,
              minute: 20,
            },
            {
              ...mockSwitchActivities[3],
              absolute_minute: 20,
              minute: 20,
            },
            {
              ...mockSwitchActivities[4],
              absolute_minute: 20,
              minute: 20,
            },
          ],
          type: 'gameActivities/setUnsavedGameActivities',
        });
      });

      it('updates the values of all the related activities to the switch when the player being swapped is changed', async () => {
        const user = userEvent.setup();
        renderComponent({
          store: getStoreWithCustomState({
            customGameActivities: mockSwitchActivities,
            customPitchViewState: {
              pitchActivities: [mockPitchActivity],
              team: mockSwitchInitialInFieldTeam,
            },
          }),
        });
        await user.click(screen.getByLabelText('Player in Field'));
        await user.click(screen.getByText('Bill & Ted'));
        expect(mockDispatch).toHaveBeenCalledWith({
          payload: [
            {
              ...mockSwitchActivities[0],
              relation: { id: 3 },
            },
            {
              ...mockSwitchActivities[1],
              relation: { id: 5 },
            },
            {
              ...mockSwitchActivities[2],
              athlete_id: 3,
            },
            {
              ...mockSwitchActivities[3],
              relation: { id: 5 },
            },
            {
              ...mockSwitchActivities[4],
              athlete_id: 3,
            },
          ],
          type: 'gameActivities/setUnsavedGameActivities',
        });

        expect(mockDispatch).toHaveBeenCalledWith({
          payload: mockSwitchExpectedInFieldTeam,
          type: 'pitchView/setTeam',
        });
      });
    });

    describe('unsaved switch event', () => {
      it('updates the values of all the nested activities to the switch when the player being swapped is changed', async () => {
        const user = userEvent.setup();
        renderComponent({
          store: getStoreWithCustomState({
            customGameActivities: mockNestedSwitchActivities,
            customPitchViewState: {
              pitchActivities: [{ ...mockPitchActivity, id: 1 }],
              team: mockSwitchInitialInFieldTeam,
            },
          }),
        });
        await user.click(screen.getByLabelText('Player in Field'));
        await user.click(screen.getByText('Bill & Ted'));
        expect(mockDispatch).toHaveBeenCalledWith({
          payload: [
            {
              ...mockNestedSwitchActivities[0],
              game_activities: [
                {
                  ...mockNestedSwitchActivities[0].game_activities[0],
                  relation: { id: 5 },
                },
                {
                  ...mockNestedSwitchActivities[0].game_activities[1],
                  athlete_id: 3,
                },
                {
                  ...mockNestedSwitchActivities[0].game_activities[2],
                  relation: { id: 5 },
                },
                {
                  ...mockNestedSwitchActivities[0].game_activities[3],
                  athlete_id: 3,
                },
              ],
              relation: { id: 3 },
            },
          ],
          type: 'gameActivities/setUnsavedGameActivities',
        });
        expect(mockDispatch).toHaveBeenCalledWith({
          payload: mockSwitchExpectedInFieldTeam,
          type: 'pitchView/setTeam',
        });
      });

      it('deletes all the related activities when the switch is deleted', async () => {
        const user = userEvent.setup();
        renderComponent({
          store: getStoreWithCustomState({
            customGameActivities: mockNestedSwitchActivities,
            customPitchViewState: {
              pitchActivities: [{ ...mockPitchActivity }],
              team: mockSwitchInitialInFieldTeam,
            },
          }),
        });
        await user.click(screen.getAllByRole('button')[6]);
        await user.click(screen.getByText('Confirm'));
        expect(mockDispatch).toHaveBeenCalledWith({
          payload: [],
          type: 'gameActivities/setUnsavedGameActivities',
        });
        expect(mockDispatch).toHaveBeenCalledWith({
          payload: {
            inFieldPlayers: {},
            players: [mockPlayers[0], mockPlayers[1], mockPlayers[2]],
          },
          type: 'pitchView/setTeam',
        });
      });
    });

    it('flags all the related activities to delete when the switch with an id is deleted', async () => {
      const mockSwitchActivitiesWithId = [
        { ...mockSwitchActivities[0], id: 1 },
        { ...mockSwitchActivities[1], id: 2 },
        { ...mockSwitchActivities[2], id: 3 },
        { ...mockSwitchActivities[3], id: 4 },
        { ...mockSwitchActivities[4], id: 6 },
      ];

      const user = userEvent.setup();
      renderComponent({
        store: getStoreWithCustomState({
          customGameActivities: mockSwitchActivitiesWithId,
          customPitchViewState: {
            pitchActivities: [{ ...mockPitchActivity, id: 1 }],
            team: mockSwitchInitialInFieldTeam,
          },
        }),
      });
      await user.click(screen.getAllByRole('button')[6]);
      await user.click(screen.getByText('Confirm'));
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: [
          {
            ...mockSwitchActivitiesWithId[0],
            delete: true,
          },
          {
            ...mockSwitchActivitiesWithId[1],
            delete: true,
          },
          {
            ...mockSwitchActivitiesWithId[2],
            delete: true,
          },
          {
            ...mockSwitchActivitiesWithId[3],
            delete: true,
          },
          {
            ...mockSwitchActivitiesWithId[4],
            delete: true,
          },
        ],
        type: 'gameActivities/setUnsavedGameActivities',
      });
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: {
          inFieldPlayers: {},
          players: [mockPlayers[0], mockPlayers[1], mockPlayers[2]],
        },
        type: 'pitchView/setTeam',
      });
    });
  });

  describe('render with a substitution event', () => {
    const mockSubActivities = [
      {
        id: 1,
        athlete_id: 1,
        absolute_minute: 0,
        relation: {
          id: 2,
        },
        kind: eventTypes.sub,
        activityIndex: 0,
      },
      {
        athlete_id: 1,
        absolute_minute: 0,
        relation: null,
        kind: eventTypes.position_change,
        game_activity_id: 1,
      },
      {
        athlete_id: 2,
        absolute_minute: 0,
        relation: {
          id: 4,
        },
        kind: eventTypes.position_change,
        game_activity_id: 1,
      },
      {
        athlete_id: 1,
        absolute_minute: 0,
        relation: null,
        kind: eventTypes.formation_position_view_change,
        game_activity_id: 1,
      },
      {
        athlete_id: 2,
        absolute_minute: 0,
        relation: {
          id: 4,
        },
        kind: eventTypes.formation_position_view_change,
        game_activity_id: 1,
      },
    ];

    const mockSubInitialInFieldTeam = {
      inFieldPlayers: {
        '1_1': mockPlayers[1],
      },
      players: [mockPlayers[0], mockPlayers[2]],
    };

    const mockSubExpectedInFieldTeam = {
      inFieldPlayers: {
        '1_1': mockPlayers[2],
      },
      players: [mockPlayers[0], mockPlayers[1]],
    };

    it('renders out the substitute info', () => {
      renderComponent({
        store: getStoreWithCustomState({
          customGameActivities: mockSubActivities,
          customPitchViewState: {
            pitchActivities: [mockSubActivities[0]],
            team: mockSubInitialInFieldTeam,
          },
        }),
      });
      expect(screen.getByText('AJ McClune (Sub-out)')).toBeInTheDocument();
      expect(screen.getByText('Sub-in')).toBeInTheDocument();
      expect(screen.getByText('Ted Ferguson')).toBeInTheDocument();
    });

    it('updates the game activities when the sub player is switched', async () => {
      const user = userEvent.setup();
      renderComponent({
        store: getStoreWithCustomState({
          customGameActivities: mockSubActivities,
          customPitchViewState: {
            pitchActivities: [mockSubActivities[0]],
            team: mockSubInitialInFieldTeam,
          },
        }),
      });
      await user.click(screen.getByLabelText('Sub-in'));
      await user.click(screen.getByText('Bill & Ted'));
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: [
          {
            ...mockSubActivities[0],
            relation: { id: 3 },
          },
          {
            ...mockSubActivities[1],
            relation: { id: null },
          },
          {
            ...mockSubActivities[2],
            athlete_id: 3,
          },
          {
            ...mockSubActivities[3],
            relation: { id: null },
          },
          {
            ...mockSubActivities[4],
            athlete_id: 3,
          },
        ],
        type: 'gameActivities/setUnsavedGameActivities',
      });

      expect(mockDispatch).toHaveBeenCalledWith({
        payload: mockSubExpectedInFieldTeam,
        type: 'pitchView/setTeam',
      });
    });
  });

  describe('render goal event with assist and own-goal cases', () => {
    beforeEach(() => {
      window.setFlag('league-ops-game-events-own-goal', true);
    });

    const mockGoalActivity = [
      {
        id: 1,
        athlete_id: 1,
        absolute_minute: 0,
        relation_id: 0,
        kind: eventTypes.goal,
        activityIndex: 0,
      },
    ];

    const mockGoalActivityWithNestedAssist = [
      {
        id: 1,
        athlete_id: 1,
        absolute_minute: 0,
        relation_id: 0,
        kind: eventTypes.goal,
        activityIndex: 0,
        game_activities: [
          {
            absolute_minute: 0,
            kind: eventTypes.assist,
            athlete_id: 2,
            relation_id: null,
          },
        ],
      },
    ];

    const mockGoalActivityWithAssist = [
      {
        id: 1,
        athlete_id: 1,
        absolute_minute: 0,
        relation_id: 0,
        kind: eventTypes.goal,
        activityIndex: 0,
      },
      {
        id: 2,
        absolute_minute: 0,
        kind: eventTypes.assist,
        athlete_id: 2,
        relation_id: null,
        game_activity_id: 1,
      },
    ];

    const mockLinkedMarkedForDeletionAssist = {
      id: 2,
      absolute_minute: 0,
      kind: eventTypes.assist,
      athlete_id: 2,
      relation_id: null,
      game_activity_id: 10,
      delete: true,
    };

    const mockGoalActivityWithNestedOwnGoal = [
      {
        id: 10,
        athlete_id: 4,
        relation_id: 0,
        kind: eventTypes.goal,
        activityIndex: 0,
        absolute_minute: 0,
        game_activities: [
          {
            kind: eventTypes.own_goal,
            athlete_id: 4,
            relation_id: null,
            absolute_minute: 0,
          },
        ],
      },
    ];

    const mockGoalActivityWithOwnGoal = [
      {
        id: 10,
        athlete_id: 5,
        absolute_minute: 0,
        relation_id: 0,
        kind: eventTypes.goal,
        activityIndex: 0,
      },
      {
        id: 11,
        absolute_minute: 0,
        kind: eventTypes.own_goal,
        athlete_id: 5,
        relation_id: null,
        game_activity_id: 10,
      },
    ];

    const mockLinkedMarkedForDeletionOwnGoal = {
      id: 2,
      absolute_minute: 0,
      kind: eventTypes.own_goal,
      athlete_id: 1,
      relation_id: null,
      game_activity_id: 1,
      delete: true,
    };

    describe('creating the assist', () => {
      it('creates the assist when the player is chosen from the dropdown', async () => {
        const user = userEvent.setup();
        renderComponent({
          store: getStoreWithCustomState({
            customGameActivities: mockGoalActivity,
            customPitchViewState: {
              pitchActivities: mockGoalActivity,
            },
          }),
        });
        await user.click(screen.getByLabelText('Assist'));
        await user.click(screen.getByText('Ted Ferguson'));
        expect(mockDispatch).toHaveBeenCalledWith({
          payload: [
            {
              ...mockGoalActivity[0],
              game_activities: [
                {
                  absolute_minute: 0,
                  athlete_id: 2,
                  kind: eventTypes.assist,
                  relation_id: null,
                },
              ],
            },
          ],
          type: 'gameActivities/setUnsavedGameActivities',
        });
      });
    });

    describe('updating the assist with a nested activity', () => {
      it('updates the assist when the minute is changed for the goal', async () => {
        const user = userEvent.setup();
        renderComponent({
          store: getStoreWithCustomState({
            customGameActivities: mockGoalActivityWithNestedAssist,
            customPitchViewState: {
              pitchActivities: mockGoalActivityWithNestedAssist,
            },
          }),
        });
        const minuteInput = screen.getByRole('spinbutton');
        await user.click(minuteInput);
        await user.clear(minuteInput);
        fireEvent.change(minuteInput, { target: { value: '20' } });
        await user.tab();
        expect(mockDispatch).toHaveBeenCalledWith({
          payload: [
            {
              ...mockGoalActivityWithNestedAssist[0],
              absolute_minute: 20,
              game_activities: [
                {
                  ...mockGoalActivityWithNestedAssist[0].game_activities[0],
                  absolute_minute: 20,
                  minute: 20,
                },
              ],
              minute: 20,
            },
          ],
          type: 'gameActivities/setUnsavedGameActivities',
        });
      });

      it('updates both the assist and the linked marked for deletion own_goal when the minute is changed for the goal', async () => {
        const user = userEvent.setup();

        renderComponent({
          store: getStoreWithCustomState({
            customGameActivities: [
              mockGoalActivityWithNestedAssist[0],
              mockLinkedMarkedForDeletionOwnGoal,
            ],
            customPitchViewState: {
              pitchActivities: [mockGoalActivityWithNestedAssist[0]],
            },
          }),
        });

        const minuteInput = screen.getByRole('spinbutton');
        await user.click(minuteInput);
        await user.clear(minuteInput);
        fireEvent.change(minuteInput, { target: { value: '20' } });
        await user.tab();

        expect(mockDispatch).toHaveBeenCalledWith({
          payload: [
            {
              ...mockGoalActivityWithNestedAssist[0],
              absolute_minute: 20,
              game_activities: [
                {
                  ...mockGoalActivityWithNestedAssist[0].game_activities[0],
                  absolute_minute: 20,
                  minute: 20,
                },
              ],
              minute: 20,
            },
            {
              ...mockLinkedMarkedForDeletionOwnGoal,
              absolute_minute: 20,
              minute: 20,
            },
          ],
          type: 'gameActivities/setUnsavedGameActivities',
        });
      });

      it('updates the linked marked for deletion assist when the minute is changed for the goal', async () => {
        const user = userEvent.setup();

        renderComponent({
          store: getStoreWithCustomState({
            customGameActivities: [
              mockGoalActivityWithAssist[0],
              { ...mockGoalActivityWithAssist[1], delete: true },
            ],
            customPitchViewState: {
              pitchActivities: [mockGoalActivityWithNestedAssist[0]],
            },
          }),
        });

        const minuteInput = screen.getByRole('spinbutton');
        await user.click(minuteInput);
        await user.clear(minuteInput);
        fireEvent.change(minuteInput, { target: { value: '20' } });
        await user.tab();

        expect(mockDispatch).toHaveBeenCalledWith({
          payload: [
            {
              ...mockGoalActivityWithAssist[0],
              absolute_minute: 20,
              minute: 20,
            },
            {
              ...mockGoalActivityWithAssist[1],
              absolute_minute: 20,
              minute: 20,
              delete: true,
            },
          ],
          type: 'gameActivities/setUnsavedGameActivities',
        });
      });

      it('updates the assist when the athlete for the assist is changed in the dropdown', async () => {
        const user = userEvent.setup();
        renderComponent({
          store: getStoreWithCustomState({
            customGameActivities: mockGoalActivityWithNestedAssist,
            customPitchViewState: {
              pitchActivities: mockGoalActivityWithNestedAssist,
              team: {
                inFieldPlayers: {
                  '1_1': mockPlayers[0],
                  '1_5': mockPlayers[2],
                },
                players: [mockPlayers[1]],
              },
            },
          }),
        });
        await user.click(screen.getByLabelText('Assist'));
        await user.click(screen.getByText('Bill & Ted'));
        expect(mockDispatch).toHaveBeenCalledWith({
          payload: [
            {
              ...mockGoalActivityWithNestedAssist[0],
              game_activities: [
                {
                  ...mockGoalActivityWithNestedAssist[0].game_activities[0],
                  athlete_id: 3,
                },
              ],
            },
          ],
          type: 'gameActivities/setUnsavedGameActivities',
        });
      });
    });

    describe('updating the assist with a flat activity list', () => {
      it('updates the assist when the minute is changed for the goal', async () => {
        const user = userEvent.setup();
        renderComponent({
          store: getStoreWithCustomState({
            customGameActivities: mockGoalActivityWithAssist,
            customPitchViewState: {
              pitchActivities: [mockGoalActivityWithAssist[0]],
            },
          }),
        });
        const minuteInput = screen.getByRole('spinbutton');
        await user.click(minuteInput);
        await user.clear(minuteInput);
        fireEvent.change(minuteInput, { target: { value: '20' } });
        await user.tab();
        expect(mockDispatch).toHaveBeenCalledWith({
          payload: [
            {
              ...mockGoalActivityWithAssist[0],
              absolute_minute: 20,
              minute: 20,
            },
            {
              ...mockGoalActivityWithAssist[1],
              absolute_minute: 20,
              minute: 20,
            },
          ],
          type: 'gameActivities/setUnsavedGameActivities',
        });
      });

      it('updates the assist when the athlete for the assist is changed in the dropdown', async () => {
        const user = userEvent.setup();
        renderComponent({
          store: getStoreWithCustomState({
            customGameActivities: mockGoalActivityWithAssist,
            customPitchViewState: {
              pitchActivities: [mockGoalActivityWithAssist[0]],
              team: {
                inFieldPlayers: {
                  '1_1': mockPlayers[0],
                  '1_5': mockPlayers[2],
                },
                players: [mockPlayers[1]],
              },
            },
          }),
        });
        await user.click(screen.getByLabelText('Assist'));
        await user.click(screen.getByText('Bill & Ted'));

        const expectedGoal = expect.objectContaining({
          ...mockGoalActivityWithAssist[0],
        });
        const expectedAssist = expect.objectContaining({
          ...mockGoalActivityWithAssist[1],
          athlete_id: 3,
        });

        expect(mockDispatch).toHaveBeenCalledWith({
          payload: [expectedGoal, expectedAssist],
          type: 'gameActivities/setUnsavedGameActivities',
        });
      });

      it('deletes the assist when the delete button is clicked for the goal', async () => {
        const user = userEvent.setup();
        renderComponent({
          store: getStoreWithCustomState({
            customGameActivities: mockGoalActivityWithAssist,
            customPitchViewState: {
              pitchActivities: [mockGoalActivityWithAssist[0]],
            },
          }),
        });
        await user.click(screen.getAllByRole('button')[6]);
        await user.click(screen.getByText('Confirm'));
        expect(mockDispatch).toHaveBeenCalledWith({
          payload: [
            {
              ...mockGoalActivityWithAssist[0],
              delete: true,
            },
            {
              ...mockGoalActivityWithAssist[1],
              delete: true,
            },
          ],
          type: 'gameActivities/setUnsavedGameActivities',
        });
      });
    });

    describe('handling assist deletion when assist dropdown clear button is clicked', () => {
      it('deletes a nested assist from an unsaved goal activity when assist dropdown clear button is clicked', async () => {
        const user = userEvent.setup();

        const { container } = renderComponent({
          store: getStoreWithCustomState({
            customGameActivities: mockGoalActivityWithNestedAssist,
            customPitchViewState: {
              pitchActivities: mockGoalActivityWithNestedAssist,
              team: mockTeam,
            },
          }),
        });

        // Click the clear button in the assist dropdown
        const clearButton = container.querySelector(
          '.kitmanReactSelect__clear-indicator'
        );
        await user.click(clearButton);

        expect(mockDispatch).toHaveBeenCalledWith({
          payload: [
            {
              id: 1,
              athlete_id: 1,
              absolute_minute: 0,
              relation_id: 0,
              kind: eventTypes.goal,
              activityIndex: 0,
            },
          ],
          type: 'gameActivities/setUnsavedGameActivities',
        });
      });

      it('marks a linked assist for deletion when assist dropdown clear button is clicked', async () => {
        const user = userEvent.setup();

        const { container } = renderComponent({
          store: getStoreWithCustomState({
            customGameActivities: mockGoalActivityWithAssist,
            customPitchViewState: {
              pitchActivities: mockGoalActivityWithAssist,
            },
          }),
        });

        // Click the clear button in the assist dropdown
        const clearButton = container.querySelector(
          '.kitmanReactSelect__clear-indicator'
        );
        await user.click(clearButton);

        expect(mockDispatch).toHaveBeenCalledWith({
          payload: [
            mockGoalActivityWithAssist[0],
            {
              ...mockGoalActivityWithAssist[1],
              athlete_id: null,
              delete: true,
            },
          ],
          type: 'gameActivities/setUnsavedGameActivities',
        });
      });

      it('deletes both the saved goal and the linked assist when the delete activity button is clicked', async () => {
        const user = userEvent.setup();
        renderComponent({
          props: defaultProps,
          store: getStoreWithCustomState({
            customGameActivities: mockGoalActivityWithAssist,
            customPitchViewState: {
              pitchActivities: [
                {
                  ...mockGoalActivityWithAssist[0],
                },
              ],
            },
          }),
        });

        await user.click(screen.getAllByRole('button')[6]);
        await user.click(screen.getByText('Confirm'));

        expect(mockDispatch).toHaveBeenCalledWith({
          payload: [
            {
              ...mockGoalActivityWithAssist[0],
              delete: true,
            },
            {
              ...mockGoalActivityWithAssist[1],
              delete: true,
            },
          ],
          type: 'gameActivities/setUnsavedGameActivities',
        });
      });

      it('restores a linked assist marked for deletion when the player is re-selected from the dropdown', async () => {
        const user = userEvent.setup();

        renderComponent({
          store: getStoreWithCustomState({
            customGameActivities: [
              mockGoalActivityWithAssist[0],
              {
                ...mockGoalActivityWithAssist[1],
                athlete_id: undefined,
                delete: true,
              },
            ],
            customPitchViewState: {
              pitchActivities: [mockGoalActivityWithAssist[0]],
              team: {
                inFieldPlayers: {
                  '1_1': mockPlayers[0],
                  '1_5': mockPlayers[1],
                },
                players: [mockPlayers[2]],
              },
            },
          }),
        });
        await user.click(screen.getByLabelText('Assist'));
        await user.click(screen.getByText('Ted Ferguson'));

        expect(mockDispatch).toHaveBeenCalledWith({
          payload: [
            mockGoalActivityWithAssist[0],
            mockGoalActivityWithAssist[1],
          ],
          type: 'gameActivities/setUnsavedGameActivities',
        });
      });
    });

    describe('creating the own goal', () => {
      it('creates a nested own_goal activity turning the switch on', async () => {
        const user = userEvent.setup();
        const mockNestedOwnGoalActivity = {
          athlete_id: 1,
          absolute_minute: 0,
          relation_id: null,
          kind: eventTypes.own_goal,
        };
        renderComponent({
          store: getStoreWithCustomState({
            customGameActivities: mockGoalActivity,
            customPitchViewState: {
              pitchActivities: mockGoalActivity,
            },
          }),
        });

        await user.click(screen.getByLabelText('Mark as own goal'));
        expect(mockDispatch).toHaveBeenCalledWith({
          payload: [
            {
              ...mockGoalActivity[0],
              game_activities: [mockNestedOwnGoalActivity],
            },
          ],
          type: 'gameActivities/setUnsavedGameActivities',
        });
      });
    });

    describe('creating the own_goal when there is an assist associated with the goal', () => {
      it('deletes the nested assist and creates an own goal instead when turning the switch on', async () => {
        const user = userEvent.setup();
        const mockNestedOwnGoalActivity = {
          athlete_id: 1,
          absolute_minute: 0,
          relation_id: null,
          kind: eventTypes.own_goal,
        };

        renderComponent({
          store: getStoreWithCustomState({
            customGameActivities: mockGoalActivityWithNestedAssist,
            customPitchViewState: {
              pitchActivities: mockGoalActivityWithNestedAssist,
            },
          }),
        });

        await user.click(screen.getByLabelText('Mark as own goal'));
        expect(mockDispatch).toHaveBeenCalledWith({
          payload: [
            {
              ...mockGoalActivityWithNestedAssist[0],
              game_activities: [mockNestedOwnGoalActivity],
            },
          ],
          type: 'gameActivities/setUnsavedGameActivities',
        });

        // Assist dropdown should be cleared and disabled
        const assistInput = screen.getByLabelText('Assist');
        expect(assistInput).toHaveAttribute('readonly');
        expect(assistInput).toHaveValue('');
      });

      it('deletes the linked assist and creates an own goal instead when turning the switch on', async () => {
        const user = userEvent.setup();
        const mockNestedOwnGoalActivity = {
          athlete_id: 1,
          absolute_minute: 0,
          relation_id: null,
          kind: eventTypes.own_goal,
        };

        renderComponent({
          store: getStoreWithCustomState({
            customGameActivities: mockGoalActivityWithAssist,
            customPitchViewState: {
              pitchActivities: [mockGoalActivityWithAssist[0]],
            },
          }),
        });

        await user.click(screen.getByLabelText('Mark as own goal'));
        expect(mockDispatch).toHaveBeenCalledWith({
          payload: [
            {
              ...mockGoalActivityWithAssist[0],
              game_activities: [mockNestedOwnGoalActivity],
            },
            {
              ...mockGoalActivityWithAssist[1],
              delete: true,
            },
          ],
          type: 'gameActivities/setUnsavedGameActivities',
        });
      });

      it('restores a linked own_goal that was previously marked for deletion when turning the switch on', async () => {
        const user = userEvent.setup();

        renderComponent({
          store: getStoreWithCustomState({
            customGameActivities: [
              mockGoalActivityWithOwnGoal[0],
              { ...mockGoalActivityWithOwnGoal[1], delete: true },
            ],
            customPitchViewState: {
              pitchActivities: [mockGoalActivityWithOwnGoal[0]],
            },
          }),
        });

        await user.click(screen.getByLabelText('Mark as own goal'));
        expect(mockDispatch).toHaveBeenCalledWith({
          payload: mockGoalActivityWithOwnGoal,
          type: 'gameActivities/setUnsavedGameActivities',
        });
      });
    });

    describe('updating the own goal (nested & flat) when the minute is changed for the goal', () => {
      it('updates the own_goal when the minute is changed for the goal (nested)', async () => {
        const user = userEvent.setup();

        renderComponent({
          store: getStoreWithCustomState({
            customGameActivities: mockGoalActivityWithNestedOwnGoal,
            customPitchViewState: {
              pitchActivities: mockGoalActivityWithNestedOwnGoal,
            },
          }),
        });

        const minuteInput = screen.getAllByRole('spinbutton')[0];
        await user.click(minuteInput);
        await user.clear(minuteInput);
        fireEvent.change(minuteInput, { target: { value: '15' } });
        await user.tab();

        expect(mockDispatch).toHaveBeenCalledWith({
          payload: [
            {
              ...mockGoalActivityWithNestedOwnGoal[0],
              absolute_minute: 15,
              minute: 15,
              game_activities: [
                {
                  ...mockGoalActivityWithNestedOwnGoal[0].game_activities[0],
                  absolute_minute: 15,
                  minute: 15,
                },
              ],
            },
          ],
          type: 'gameActivities/setUnsavedGameActivities',
        });
      });

      it('updates both the own_goal and the linked marked for deletion assist when the minute is changed for the goal (nested)', async () => {
        const user = userEvent.setup();

        renderComponent({
          store: getStoreWithCustomState({
            customGameActivities: [
              mockGoalActivityWithNestedOwnGoal[0],
              mockLinkedMarkedForDeletionAssist,
            ],
            customPitchViewState: {
              pitchActivities: mockGoalActivityWithNestedOwnGoal,
            },
          }),
        });

        const minuteInput = screen.getAllByRole('spinbutton')[0];
        await user.click(minuteInput);
        await user.clear(minuteInput);
        fireEvent.change(minuteInput, { target: { value: '15' } });
        await user.tab();

        expect(mockDispatch).toHaveBeenCalledWith({
          payload: [
            {
              ...mockGoalActivityWithNestedOwnGoal[0],
              absolute_minute: 15,
              minute: 15,
              game_activities: [
                {
                  ...mockGoalActivityWithNestedOwnGoal[0].game_activities[0],
                  absolute_minute: 15,
                  minute: 15,
                },
              ],
            },
            {
              ...mockLinkedMarkedForDeletionAssist,
              absolute_minute: 15,
              minute: 15,
            },
          ],
          type: 'gameActivities/setUnsavedGameActivities',
        });
      });

      it('updates the own_goal when the minute is changed for the goal (flat)', async () => {
        const user = userEvent.setup();

        renderComponent({
          store: getStoreWithCustomState({
            customGameActivities: mockGoalActivityWithOwnGoal,
            customPitchViewState: {
              pitchActivities: [mockGoalActivityWithOwnGoal[0]],
            },
          }),
        });

        const minuteInput = screen.getAllByRole('spinbutton')[0];
        await user.click(minuteInput);
        await user.clear(minuteInput);
        fireEvent.change(minuteInput, { target: { value: '18' } });
        await user.tab();

        expect(mockDispatch).toHaveBeenCalledWith({
          payload: [
            {
              ...mockGoalActivityWithOwnGoal[0],
              absolute_minute: 18,
              minute: 18,
            },
            {
              ...mockGoalActivityWithOwnGoal[1],
              absolute_minute: 18,
              minute: 18,
            },
          ],
          type: 'gameActivities/setUnsavedGameActivities',
        });
      });

      it('updates the linked marked for deletion own_goal when the minute is changed for the goal (flat)', async () => {
        const user = userEvent.setup();

        renderComponent({
          store: getStoreWithCustomState({
            customGameActivities: [
              mockGoalActivityWithOwnGoal[0],
              { ...mockGoalActivityWithOwnGoal[1], delete: true },
            ],
            customPitchViewState: {
              pitchActivities: [mockGoalActivityWithOwnGoal[0]],
            },
          }),
        });

        const minuteInput = screen.getAllByRole('spinbutton')[0];
        await user.click(minuteInput);
        await user.clear(minuteInput);
        fireEvent.change(minuteInput, { target: { value: '20' } });
        await user.tab();

        expect(mockDispatch).toHaveBeenCalledWith({
          payload: [
            {
              ...mockGoalActivityWithOwnGoal[0],
              absolute_minute: 20,
              minute: 20,
            },
            {
              ...mockGoalActivityWithOwnGoal[1],
              absolute_minute: 20,
              minute: 20,
              delete: true,
            },
          ],
          type: 'gameActivities/setUnsavedGameActivities',
        });
      });
    });

    describe('handling own_goal deletion', () => {
      it('deletes a nested own_goal when turning the switch off', async () => {
        const user = userEvent.setup();

        renderComponent({
          store: getStoreWithCustomState({
            customGameActivities: mockGoalActivityWithNestedOwnGoal,
            customPitchViewState: {
              pitchActivities: mockGoalActivityWithNestedOwnGoal,
            },
          }),
        });

        await user.click(screen.getByLabelText('Mark as own goal'));
        expect(mockDispatch).toHaveBeenCalledWith({
          payload: [
            {
              id: 10,
              athlete_id: 4,
              relation_id: 0,
              kind: eventTypes.goal,
              activityIndex: 0,
              absolute_minute: 0,
            },
          ],
          type: 'gameActivities/setUnsavedGameActivities',
        });
      });

      it('marks for deletion a linked own_goal when turning the switch off', async () => {
        const user = userEvent.setup();

        renderComponent({
          store: getStoreWithCustomState({
            customGameActivities: mockGoalActivityWithOwnGoal,
            customPitchViewState: {
              pitchActivities: [mockGoalActivityWithOwnGoal[0]],
            },
          }),
        });

        await user.click(screen.getByLabelText('Mark as own goal'));
        expect(mockDispatch).toHaveBeenCalledWith({
          payload: [
            mockGoalActivityWithOwnGoal[0],
            {
              ...mockGoalActivityWithOwnGoal[1],
              delete: true,
            },
          ],
          type: 'gameActivities/setUnsavedGameActivities',
        });
      });

      it('deletes both the goal and the linked own goal when clicking the delete activity button', async () => {
        const user = userEvent.setup();

        renderComponent({
          props: defaultProps,
          store: getStoreWithCustomState({
            customGameActivities: mockGoalActivityWithOwnGoal,
            customPitchViewState: {
              pitchActivities: [
                {
                  ...mockGoalActivityWithOwnGoal[0],
                },
              ],
            },
          }),
        });

        await user.click(screen.getAllByRole('button')[6]);
        await user.click(screen.getByText('Confirm'));

        expect(mockDispatch).toHaveBeenCalledWith({
          payload: [
            {
              ...mockGoalActivityWithOwnGoal[0],
              delete: true,
            },
            {
              ...mockGoalActivityWithOwnGoal[1],
              delete: true,
            },
          ],
          type: 'gameActivities/setUnsavedGameActivities',
        });
      });
    });
  });

  describe('render with a formation change event', () => {
    const mockFormationActivity = {
      id: 1,
      absolute_minute: 1,
      relation: { id: null },
      kind: eventTypes.formation_change,
      activityIndex: 0,
      game_activities: [],
    };

    const mockFormations = [
      { id: 4, name: '5-4-1', number_of_players: 11 },
      { id: 5, name: '4-5-1', number_of_players: 11 },
    ];
    const mockFormat = {
      id: 2,
      name: '11v11',
      number_of_players: 11,
    };

    beforeEach(() => {
      jest.spyOn(axios, 'get').mockImplementation(() => ({
        data: [
          {
            id: 10,
            x: 4,
            y: 5,
            position: {
              id: 2,
            },
          },
          {
            id: 12,
            x: 7,
            y: 2,
            position: {
              id: 5,
            },
          },
        ],
      }));
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('allows the user to update the formation chose', async () => {
      const user = userEvent.setup();
      renderComponent({
        props: {
          ...defaultProps,
          formations: mockFormations,
          gameFormats: [mockFormat],
        },
        store: getStoreWithCustomState({
          customGameActivities: [mockFormationActivity],
          customPitchViewState: {
            pitchActivities: [mockFormationActivity],
            selectedGameFormat: mockFormat,
          },
        }),
      });

      await user.click(screen.getByLabelText('Formation'));
      await user.click(screen.getByText('4-5-1'));
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'gameActivities/setUnsavedGameActivities',
        payload: [
          {
            id: 1,
            absolute_minute: 1,
            relation: { id: 5, name: '4-5-1' },
            kind: eventTypes.formation_change,
            activityIndex: 0,
            game_activities: [
              {
                kind: eventTypes.position_change,
                relation: { id: 2 },
                athlete_id: 1,
                absolute_minute: 1,
                minute: 1,
              },
              {
                kind: eventTypes.formation_position_view_change,
                relation: { id: 10 },
                athlete_id: 1,
                absolute_minute: 1,
                minute: 1,
              },
              {
                kind: eventTypes.position_change,
                relation: { id: 5 },
                athlete_id: 2,
                absolute_minute: 1,
                minute: 1,
              },
              {
                kind: eventTypes.formation_position_view_change,
                relation: { id: 12 },
                athlete_id: 2,
                absolute_minute: 1,
                minute: 1,
              },
            ],
          },
        ],
      });
    });

    it('allows the user to delete the formation chose', async () => {
      const currentFormation = { ...mockFormationActivity, activityIndex: 1 };
      const mockCurrentFormations = [
        {
          kind: eventTypes.formation_change,
          absolute_minute: 0,
          relation: { id: 1 },
          activityIndex: 0,
        },
        currentFormation,
      ];
      const user = userEvent.setup();
      renderComponent({
        props: {
          ...defaultProps,
          formations: mockFormations,
          gameFormats: [mockFormat],
        },
        store: getStoreWithCustomState({
          customGameActivities: mockCurrentFormations,
          customPitchViewState: {
            pitchActivities: [currentFormation],
            selectedGameFormat: mockFormat,
          },
        }),
      });

      await user.click(screen.getAllByRole('button')[7]);
      await user.click(screen.getByText('Confirm'));
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: [
          mockCurrentFormations[0],
          {
            ...mockCurrentFormations[1],
            delete: true,
          },
        ],
        type: 'gameActivities/setUnsavedGameActivities',
      });
      expect(axios.get).toHaveBeenCalledWith(
        '/ui/planning_hub/formation_position_views?field_id=1&formation_id=1'
      );
    });
  });
});
