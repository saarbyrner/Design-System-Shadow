import { I18nextProvider } from 'react-i18next';
import * as redux from 'react-redux';
import { axios } from '@kitman/common/src/utils/services';
import userEvent from '@testing-library/user-event';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { within, screen, waitFor, fireEvent } from '@testing-library/react';
import { DndContext } from '@dnd-kit/core';
import i18n from '@kitman/common/src/utils/i18n';
import { eventTypes } from '@kitman/common/src/consts/gameEventConsts';
import { goalEventButton } from '@kitman/common/src/utils/gameEventTestUtils';
import { data as formationCoordinatesChangedResponse } from '@kitman/services/src/mocks/handlers/planningEvent/getFormationPositionsCoordinates';
import { mockOrderedPlayerData } from '@kitman/modules/src/PlanningEvent/src/components/GameEventsTab/__tests__/mockTestSquadData';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';

import PitchView from '../index';

jest.mock('@kitman/common/src/hooks/useLeagueOperations');

describe('PitchView', () => {
  const mockAthletes = [
    mockOrderedPlayerData[1],
    mockOrderedPlayerData[0],
    mockOrderedPlayerData[2],
  ];

  const mockField = {
    id: 1,
    width: 100,
    height: 100,
    cellSize: 50,
    columns: 11,
    rows: 11,
  };

  const mockFormations = [
    {
      id: 1,
      name: '5-3-2',
      number_of_players: 11,
    },
    {
      id: 2,
      name: '4-1-3',
      number_of_players: 8,
    },
    {
      id: 3,
      name: '3-1-4',
      number_of_players: 8,
    },
    {
      id: 4,
      name: '5-1-4',
      number_of_players: 11,
    },
  ];

  const mockSelectedFormation = {
    id: 1,
    name: '5-3-2',
    number_of_players: 11,
  };

  const mockSelectedGameFormat = {
    id: 1,
    name: '11v11',
    number_of_players: 11,
  };

  const mockGameFormats = [
    {
      id: 1,
      name: '11v11',
      number_of_players: 11,
    },
    {
      id: 2,
      name: '8v8',
      number_of_players: 8,
    },
  ];

  const mockTeam = { inFieldPlayers: {}, players: mockAthletes };

  const defaultFormationCoordinates = {
    '1_1': {
      id: 1,
      x: 1,
      y: 1,
      order: 1,
      position_id: 1,
      field_id: 1,
      formation_id: 1,
      position: {
        id: 1,
        abbreviation: 'GK',
      },
    },
    '2_1': {
      id: 2,
      x: 2,
      y: 1,
      order: 2,
      position_id: 1,
      field_id: 1,
      formation_id: 1,
      position: {
        position: 2,
        abbreviation: 'CB',
      },
    },
  };

  const event = {
    id: 1,
  };

  const period = {
    id: 1,
    duration: 50,
    absolute_duration_start: 0,
    absolute_duration_end: 50,
    name: 'Period 1',
  };

  const gameActivities = [
    {
      absolute_minute: 0,
      relation: { id: 1, number_of_players: 11 },
      kind: eventTypes.formation_change,
    },
    {
      absolute_minute: 50,
      relation: { id: 2, number_of_players: 11 },
      kind: eventTypes.formation_change,
    },
  ];

  const playerGameActivities = [
    ...gameActivities,
    {
      absolute_minute: 0,
      athlete_id: 1,
      kind: eventTypes.formation_position_view_change,
      relation: { id: 1 },
    },
    {
      absolute_minute: 0,
      athlete_id: 1,
      kind: eventTypes.position_change,
      relation: { id: 2 },
    },
  ];

  const playerLineupCompleteActivities = [
    ...playerGameActivities,
    {
      absolute_minute: 0,
      kind: eventTypes.formation_complete,
    },
  ];

  const defaultProps = {
    sport: 'soccer',
    formations: mockFormations,
    gameFormats: mockGameFormats,
    event,
    currentPeriod: period,
    eventId: 1,
    selectedEvent: null,
    activeTab: '0',
    staff: [],
    preventGameEvents: false,
    onSetSelectedEvent: jest.fn(),
    dispatchMandatoryCheck: jest.fn(),
    dispatchFailedFormationCoordsToast: jest.fn(),
    leagueSetup: false,
    isDmrLocked: false,
    preferences: {},
  };

  const defaultStore = {
    planningEvent: {
      gameActivities: { localGameActivities: playerGameActivities },
      eventPeriods: {
        apiEventPeriods: [period],
        localEventPeriods: [period],
      },
      pitchView: {
        team: mockTeam,
        activeEventSelection: '',
        formationCoordinates: defaultFormationCoordinates,
        selectedGameFormat: mockSelectedGameFormat,
        selectedFormation: mockSelectedFormation,
        pitchActivities: [],
        field: mockField,
        selectedPitchPlayer: null,
        isLoading: false,
      },
    },
  };

  const getStoreWithCustomState = ({
    customGameActivities = gameActivities,
    customPitchViewState = defaultStore.pitchView,
    customEventPeriods = defaultStore.eventPeriods,
  }) => ({
    planningEvent: {
      ...defaultStore.planningEvent,
      gameActivities: { localGameActivities: customGameActivities },
      eventPeriods: customEventPeriods,
      pitchView: {
        ...defaultStore.planningEvent.pitchView,
        ...customPitchViewState,
      },
    },
  });

  const mockInFieldPlayer = {
    inFieldPlayers: {
      '1_1': mockAthletes[1],
    },
    players: [mockAthletes[0], mockAthletes[2]],
  };

  const renderTestComponent = ({
    props = defaultProps,
    store = defaultStore,
    leagueOpsPerms = { isLeagueStaffUser: false },
  }) => {
    useLeagueOperations.mockReturnValue(leagueOpsPerms);

    renderWithRedux(
      <I18nextProvider i18n={i18n}>
        <DndContext>
          <PitchView {...props} />
        </DndContext>
      </I18nextProvider>,
      { preloadedState: store }
    );
  };

  let useDispatchSpy;
  let mockDispatch;

  beforeEach(() => {
    window.scrollTo = jest.fn();
    useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    mockDispatch = jest.fn();
    useDispatchSpy.mockReturnValue(mockDispatch);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('initial renders', () => {
    it('renders the PitchView component', () => {
      renderTestComponent({
        store: getStoreWithCustomState({
          customGameActivities: gameActivities,
        }),
      });
      expect(screen.getByTestId('pitch-container')).toBeInTheDocument();
      expect(screen.getByTestId('FormationSelector')).toBeInTheDocument();
      expect(
        screen.getByTestId('available-player-list-container')
      ).toBeInTheDocument();
    });

    it('renders resetting the selectedPitchPlayer if a value was previously there', () => {
      renderTestComponent({
        store: getStoreWithCustomState({
          customPitchViewState: { selectedPitchPlayer: { name: 'Ted' } },
        }),
      });
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: null,
        type: 'pitchView/setSelectedPitchPlayer',
      });
    });
  });

  describe('renders with an existing player roster', () => {
    it('presets the player onField with the auto preset  logic', async () => {
      renderTestComponent({ props: defaultProps });
      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith({
          payload: mockInFieldPlayer,
          type: 'pitchView/setTeam',
        });
      });
    });

    it('presets the player rendered in the field', () => {
      const mockPitchView = { team: mockInFieldPlayer };
      renderTestComponent({
        store: getStoreWithCustomState({ customPitchViewState: mockPitchView }),
      });
      const playerPosition = screen.getByTestId('with-player-position');
      expect(playerPosition).toBeInTheDocument();
      expect(within(playerPosition).getByText('J. Doe')).toBeInTheDocument();
    });
  });

  describe('prevent game events', () => {
    it('prevents adding game events if mandatory fields are not filled', async () => {
      const user = userEvent.setup();
      const mockPitchViewState = {
        activeEventSelection: eventTypes.goal,
        team: mockInFieldPlayer,
      };
      renderTestComponent({
        props: {
          ...defaultProps,
          preventGameEvents: true,
        },
        store: getStoreWithCustomState({
          customGameActivities: playerLineupCompleteActivities,
          customPitchViewState: mockPitchViewState,
        }),
      });

      jest.clearAllMocks();
      await user.click(screen.getAllByRole('img')[1]);
      expect(mockDispatch).toHaveBeenCalledTimes(0);
    });
  });

  describe('event list renders', () => {
    it('does not render the pitch view component with the evet list if it is a league staff user', () => {
      renderTestComponent({
        store: getStoreWithCustomState({
          customGameActivities: playerLineupCompleteActivities,
        }),
        leagueOpsPerms: { isLeagueStaffUser: true },
      });
      expect(screen.getByText('Available Players')).toBeInTheDocument();
      expect(screen.queryByText('Event list')).not.toBeInTheDocument();
      expect(screen.queryByText('Substitutions')).not.toBeInTheDocument();
    });

    it('renders the PitchView component with the event list', () => {
      renderTestComponent({
        store: getStoreWithCustomState({
          customGameActivities: playerLineupCompleteActivities,
        }),
      });
      expect(screen.getByText('Event list')).toBeInTheDocument();
      expect(screen.getByText('Substitutions')).toBeInTheDocument();
    });

    it('sets the active event selection when the event list buttons are clicked', async () => {
      const user = userEvent.setup();
      renderTestComponent({
        store: getStoreWithCustomState({
          customGameActivities: playerLineupCompleteActivities,
        }),
      });
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

    it('allows the user to create a goal when the goal event is active', async () => {
      const user = userEvent.setup();
      const mockPitchViewState = {
        team: mockInFieldPlayer,
        activeEventSelection: eventTypes.goal,
      };
      renderTestComponent({
        store: getStoreWithCustomState({
          customGameActivities: playerLineupCompleteActivities,
          customPitchViewState: mockPitchViewState,
        }),
      });
      await user.click(screen.getAllByRole('img')[0]);
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: [
          ...playerLineupCompleteActivities,
          {
            absolute_minute: 0,
            minute: 0,
            athlete_id: 1,
            kind: eventTypes.goal,
            relation: { id: null },
          },
        ],
        type: 'gameActivities/setUnsavedGameActivities',
      });
    });

    it('does not allow a red card event to be created on a player that already has one', async () => {
      const user = userEvent.setup();
      const mockPitchViewState = {
        team: mockInFieldPlayer,
        activeEventSelection: eventTypes.red,
        pitchActivities: [
          {
            absolute_minute: 0,
            athlete_id: 1,
            kind: eventTypes.red,
            relation: { id: null },
          },
        ],
      };
      renderTestComponent({
        store: getStoreWithCustomState({
          customGameActivities: playerLineupCompleteActivities,
          customPitchViewState: mockPitchViewState,
        }),
      });
      jest.clearAllMocks();
      await user.click(screen.getAllByRole('img')[0]);
      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('does not allow a yellow card event to be created on a player that already has two', async () => {
      const user = userEvent.setup();
      const mockPitchViewState = {
        team: mockInFieldPlayer,
        activeEventSelection: eventTypes.yellow,
        pitchActivities: [
          {
            absolute_minute: 0,
            athlete_id: 1,
            kind: eventTypes.yellow,
            relation: { id: null },
          },
          {
            absolute_minute: 0,
            athlete_id: 1,
            kind: eventTypes.yellow,
            relation: { id: null },
          },
        ],
      };
      renderTestComponent({
        store: getStoreWithCustomState({
          customGameActivities: playerLineupCompleteActivities,
          customPitchViewState: mockPitchViewState,
        }),
      });
      jest.clearAllMocks();
      await user.click(screen.getAllByRole('img')[0]);
      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('updates the activities when the minute of the event is changed', () => {
      const mockPitchViewState = {
        team: mockInFieldPlayer,
        pitchActivities: [
          {
            activityIndex: 5,
            absolute_minute: 0,
            athlete_id: 1,
            kind: eventTypes.goal,
            relation: { id: null },
          },
        ],
      };
      renderTestComponent({
        store: getStoreWithCustomState({
          customGameActivities: [
            ...playerLineupCompleteActivities,
            {
              absolute_minute: 0,
              athlete_id: 1,
              kind: eventTypes.goal,
              relation: { id: null },
            },
          ],
          customPitchViewState: mockPitchViewState,
        }),
      });

      fireEvent.change(screen.getByRole('spinbutton'), {
        target: { value: '20' },
      });
      expect(screen.getByDisplayValue('20')).toBeInTheDocument();
      fireEvent.blur(screen.getByRole('spinbutton'));

      expect(mockDispatch).toHaveBeenCalledWith({
        payload: [
          ...playerLineupCompleteActivities,
          {
            absolute_minute: 20,
            athlete_id: 1,
            minute: 20,
            kind: eventTypes.goal,
            relation: { id: null },
          },
        ],
        type: 'gameActivities/setUnsavedGameActivities',
      });
    });
  });

  describe('event list multi event renders', () => {
    describe('player pitch change', () => {
      const multiPlayerGameActivities = [
        ...playerLineupCompleteActivities,
        {
          absolute_minute: 0,
          athlete_id: 2,
          kind: eventTypes.formation_position_view_change,
          relation: { id: 2 },
        },
        {
          absolute_minute: 0,
          athlete_id: 1,
          kind: eventTypes.switch,
          relation: { id: 2 },
          game_activities: [
            {
              absolute_minute: 0,
              athlete_id: 1,
              kind: eventTypes.formation_position_view_change,
              relation: { id: 2 },
            },
            {
              absolute_minute: 0,
              athlete_id: 2,
              kind: eventTypes.formation_position_view_change,
              relation: { id: 1 },
            },
          ],
        },
      ];

      const positionSwapTeam = {
        inFieldPlayers: {
          '1_1': mockAthletes[0],
          '2_1': mockAthletes[1],
        },
        players: [mockAthletes[2]],
      };

      it('updates the team state when a player swap event is created', async () => {
        renderTestComponent({
          store: getStoreWithCustomState({
            customGameActivities: multiPlayerGameActivities,
          }),
        });
        await waitFor(() => {
          expect(mockDispatch).toHaveBeenCalledWith({
            payload: positionSwapTeam,
            type: 'pitchView/setTeam',
          });
        });
      });

      it('updates the pitch when a player swap event has updated the team', () => {
        renderTestComponent({
          store: getStoreWithCustomState({
            customGameActivities: multiPlayerGameActivities,
            customPitchViewState: { team: positionSwapTeam },
          }),
        });

        expect(
          within(screen.getAllByTestId('with-player-position')[0]).getByText(
            'J. Doe'
          )
        ).toBeInTheDocument();
        expect(
          within(screen.getAllByTestId('with-player-position')[1]).getByText(
            'J. Doe'
          )
        ).toBeInTheDocument();
      });
    });

    describe('mid game formation_change', () => {
      const multiPlayerGameActivities = [
        ...playerLineupCompleteActivities,
        {
          absolute_minute: 0,
          athlete_id: 2,
          kind: eventTypes.formation_position_view_change,
          relation: { id: 2 },
        },
        {
          absolute_minute: 1,
          athlete_id: 1,
          kind: eventTypes.formation_change,
          relation: { id: 2 },
          game_activities: [
            {
              absolute_minute: 0,
              athlete_id: 1,
              kind: eventTypes.formation_position_view_change,
              relation: { id: 2 },
            },
            {
              absolute_minute: 0,
              athlete_id: 2,
              kind: eventTypes.formation_position_view_change,
              relation: { id: 1 },
            },
          ],
        },
      ];

      const midFormationTeam = {
        inFieldPlayers: {
          '1_3': mockAthletes[0],
          '2_4': mockAthletes[1],
        },
        players: [mockAthletes[2]],
      };

      it('does not update the pitch with a player formation event when it is a league user', async () => {
        renderTestComponent({
          store: getStoreWithCustomState({
            customGameActivities: multiPlayerGameActivities,
          }),
          leagueOpsPerms: { isLeagueStaffUser: true },
        });
        await waitFor(() => {
          expect(mockDispatch).not.toHaveBeenCalledWith({
            payload: midFormationTeam,
            type: 'pitchView/setTeam',
          });
        });
        expect(mockDispatch).not.toHaveBeenCalledWith({
          payload: {
            '1_3': formationCoordinatesChangedResponse[0],
            '2_4': formationCoordinatesChangedResponse[1],
          },
          type: 'pitchView/setFormationCoordinates',
        });
      });

      it('updates the team when a player formation event is processed', async () => {
        renderTestComponent({
          store: getStoreWithCustomState({
            customGameActivities: multiPlayerGameActivities,
          }),
        });
        await waitFor(() => {
          expect(mockDispatch).toHaveBeenCalledWith({
            payload: midFormationTeam,
            type: 'pitchView/setTeam',
          });
        });
        expect(mockDispatch).toHaveBeenCalledWith({
          payload: {
            '1_3': formationCoordinatesChangedResponse[0],
            '2_4': formationCoordinatesChangedResponse[1],
          },
          type: 'pitchView/setFormationCoordinates',
        });
      });

      it('fails the update if the formation coordinates api call fails', async () => {
        jest.spyOn(axios, 'get').mockRejectedValue(new Error('Test Error'));
        renderTestComponent({
          store: getStoreWithCustomState({
            customGameActivities: multiPlayerGameActivities,
          }),
        });
        await waitFor(() => {
          expect(
            defaultProps.dispatchFailedFormationCoordsToast
          ).toHaveBeenCalled();
        });
      });
    });
  });

  describe('DMR lock renders', () => {
    const periodTwo = {
      id: 2,
      duration: 50,
      absolute_duration_start: 50,
      absolute_duration_end: 100,
      name: 'Period 2',
    };

    it('does not allow the user to interact with the available player list or formation selector if the DMR is locked in the starting lineup period', async () => {
      const user = userEvent.setup();
      renderTestComponent({
        props: { ...defaultProps, isDmrLocked: true },
        store: getStoreWithCustomState({
          customEventPeriods: {
            apiEventPeriods: [period, periodTwo],
            localEventPeriods: [period, periodTwo],
          },
        }),
      });
      await expect(() =>
        user.click(screen.getByText('Line-ups'))
      ).rejects.toThrow(/pointer-events: none/);

      await user.click(screen.getByText('Clear'));

      expect(
        screen.queryByText('Clear Starting Lineup')
      ).not.toBeInTheDocument();
    });

    it('does not allow the user to edit the lineup when they are in the events list stage and the dmr is locked', async () => {
      const user = userEvent.setup();
      renderTestComponent({
        props: { ...defaultProps, isDmrLocked: true },
        store: getStoreWithCustomState({
          customEventPeriods: {
            apiEventPeriods: [period, periodTwo],
            localEventPeriods: [period, periodTwo],
          },
          customGameActivities: playerLineupCompleteActivities,
        }),
      });

      mockDispatch.mockReset();
      await user.click(screen.getByText('Edit lineup'));
      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('does not allow the user to remove players  when the dmr is locked', async () => {
      const user = userEvent.setup();
      renderTestComponent({
        props: { ...defaultProps, isDmrLocked: true },
        store: getStoreWithCustomState({
          customEventPeriods: {
            apiEventPeriods: [period, periodTwo],
            localEventPeriods: [period, periodTwo],
          },
        }),
      });

      mockDispatch.mockReset();
      await user.hover(screen.getAllByRole('img')[0]);
      expect(
        screen.queryByTestId('avatar-remove-button')
      ).not.toBeInTheDocument();
    });

    it('does allow the user to add events when the formation is complete when the dmr is locked for the first period', async () => {
      const user = userEvent.setup();
      const mockPitchViewState = {
        team: mockInFieldPlayer,
        activeEventSelection: eventTypes.goal,
      };
      renderTestComponent({
        props: { ...defaultProps, isDmrLocked: true },
        store: getStoreWithCustomState({
          customEventPeriods: {
            apiEventPeriods: [period, periodTwo],
            localEventPeriods: [period, periodTwo],
          },
          customPitchViewState: mockPitchViewState,
          customGameActivities: playerLineupCompleteActivities,
        }),
      });

      await user.click(screen.getAllByRole('img')[0]);
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: [
          ...playerLineupCompleteActivities,
          {
            absolute_minute: 0,
            minute: 0,
            athlete_id: 1,
            kind: eventTypes.goal,
            relation: { id: null },
          },
        ],
        type: 'gameActivities/setUnsavedGameActivities',
      });
    });

    it('does allow the user to edit the lineup when the dmr is locked if it is not the starting lineup period', async () => {
      const user = userEvent.setup();
      renderTestComponent({
        props: { ...defaultProps, isDmrLocked: true, currentPeriod: periodTwo },
        store: getStoreWithCustomState({
          customEventPeriods: {
            apiEventPeriods: [period, periodTwo],
            localEventPeriods: [period, periodTwo],
          },
          customGameActivities: [
            ...playerLineupCompleteActivities,
            {
              absolute_minute: 50,
              kind: eventTypes.formation_complete,
            },
          ],
        }),
      });

      await user.click(screen.getByText('Edit lineup'));
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: playerLineupCompleteActivities,
        type: 'gameActivities/setUnsavedGameActivities',
      });
    });
  });
});
