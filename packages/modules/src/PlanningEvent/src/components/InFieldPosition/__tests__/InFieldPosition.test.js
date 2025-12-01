import * as redux from 'react-redux';
import { Provider } from 'react-redux';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  pitchViewFormats,
  eventTypes,
} from '@kitman/common/src/consts/gameEventConsts';
import styles from '../styles';

import InFieldPosition from '..';

describe('InFieldPosition', () => {
  const storeFake = (state) => ({
    default: () => {},
    subscribe: () => {},
    dispatch: () => {},
    getState: () => ({ ...state }),
  });

  const mockPlayer = {
    id: 33925,
    firstname: 'AJ',
    lastname: 'McClune',
    fullname: 'AJ McClune',
    shortname: 'McClune',
    user_id: 38187,
    avatar_url: 'testImage.png',
    availability: 'unavailable',
    position: {
      name: 'Loose-head Prop',
      order: 1,
      abbreviation: 'LP',
      position_group: {
        order: 1,
        name: 'Forward',
      },
    },
    squad_number: 4,
  };

  const mockPositionData = {
    position: {
      id: 1,
      abbreviation: 'GK',
    },
  };

  const defaultProps = {
    pitchFormat: pitchViewFormats.gameEvents,
    cellId: '0_2',
    positionData: mockPositionData,
    player: mockPlayer,
    onPlayerClick: jest.fn(),
    hasPeriodStarted: true,
    handleRemovePosition: jest.fn(),
    isImportedGame: false,
    isCaptain: false,
  };

  const defaultStore = {
    planningEvent: {
      gameActivities: { apiGameActivities: [], localGameActivities: [] },
      pitchView: {
        field: {
          cellSize: 50,
        },
        activeEventSelection: eventTypes.goal,
        pitchActivities: [],
        selectedPitchPlayer: null,
      },
    },
  };

  const getStoreWithCustomState = (customStoreState) => ({
    planningEvent: {
      gameActivities: {
        ...defaultStore.planningEvent.gameActivities,
        ...customStoreState,
      },
      pitchView: {
        ...defaultStore.planningEvent.pitchView,
        ...customStoreState,
      },
    },
  });

  const renderComponent = ({ props = defaultProps, store = defaultStore }) =>
    render(
      <Provider store={storeFake(store)}>
        <InFieldPosition {...props} />
      </Provider>
    );

  let useDispatchSpy;
  let mockDispatch;

  beforeEach(() => {
    window.scrollTo = jest.fn();
    useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    mockDispatch = jest.fn();
    useDispatchSpy.mockReturnValue(mockDispatch);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Imported Game InFieldPosition', () => {
    it('renders the player number for Imported Games', () => {
      renderComponent({ props: { ...defaultProps, isImportedGame: true } });
      expect(screen.getByText('#4 McClune')).toBeInTheDocument();
    });

    it('renders the captain text for Imported Games', () => {
      renderComponent({
        props: { ...defaultProps, isImportedGame: true, isCaptain: true },
      });
      expect(screen.getByText('#4 McClune (C)')).toBeInTheDocument();
    });
  });

  describe('renders with a player', () => {
    it('should render a field position with a player', () => {
      renderComponent({ props: defaultProps });
      expect(screen.getByTestId('with-player-position')).toBeInTheDocument();
      expect(screen.getByText('McClune')).toBeInTheDocument();
    });

    it('should fire onPlayerClick when the position is selected', async () => {
      const user = userEvent.setup();
      renderComponent({ props: defaultProps });
      await user.click(screen.getByRole('img'));
      expect(defaultProps.onPlayerClick).toHaveBeenCalledWith({
        player: mockPlayer,
        eventType: eventTypes.goal,
      });
    });
  });

  describe('renders with events', () => {
    it('should render the the respective yellow cards on the pitch', () => {
      const mockActivities = [
        { absolute_minute: 1, athlete_id: 33925, kind: eventTypes.yellow },
        { absolute_minute: 2, athlete_id: 33925, kind: eventTypes.yellow },
      ];

      renderComponent({
        store: getStoreWithCustomState({
          pitchActivities: mockActivities,
          activeEventSelection: eventTypes.yellow,
        }),
      });

      expect(
        screen.getByTestId('avatar-first-yellow-card')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('avatar-second-yellow-card')
      ).toBeInTheDocument();
    });

    it('should render the the respective red card on the pitch', () => {
      const mockActivities = [
        { absolute_minute: 2, athlete_id: 33925, kind: eventTypes.red },
      ];
      renderComponent({
        store: getStoreWithCustomState({
          pitchActivities: mockActivities,
          activeEventSelection: eventTypes.red,
        }),
      });
      expect(screen.getByTestId('avatar-red-card')).toBeInTheDocument();
    });

    it('should render the respective goals on the pitch popup considering the linked own goals', async () => {
      // MATCH REPORT PITCH
      window.setFlag('league-ops-match-report-v2', true);
      const mockActivities = [
        { id: 1, absolute_minute: 2, athlete_id: 33925, kind: eventTypes.goal },
        { id: 2, absolute_minute: 3, athlete_id: 33925, kind: eventTypes.goal },
        {
          id: 3,
          absolute_minute: 10,
          athlete_id: 33925,
          kind: eventTypes.goal,
        },
        {
          id: 4,
          absolute_minute: 10,
          athlete_id: 33925,
          kind: eventTypes.own_goal,
          game_activity_id: 3,
        },
        // linked own_goal marked for deletion should not be counted
        {
          id: 5,
          absolute_minute: 3,
          athlete_id: 33925,
          kind: eventTypes.own_goal,
          delete: true,
        },
      ];
      const user = userEvent.setup();
      const { rerender } = renderComponent({
        props: {
          ...defaultProps,
          pitchFormat: pitchViewFormats.matchReport,
        },
        store: getStoreWithCustomState({
          localGameActivities: mockActivities,
          pitchActivities: mockActivities,
          activeEventSelection: '',
        }),
      });
      await user.hover(screen.getByRole('img'));

      const matchReportGoalCount =
        screen.getByTestId('avatar-goals').nextSibling;
      expect(matchReportGoalCount).toHaveTextContent('2');

      const matchReportOwnGoalCount =
        screen.getByTestId('avatar-own_goals').nextSibling;
      expect(matchReportOwnGoalCount).toHaveTextContent('1');

      await user.unhover(screen.getAllByRole('img')[1]);

      // GAME EVENTS PITCH
      window.setFlag('league-ops-game-events-own-goal', true);
      rerender(
        <Provider
          store={storeFake(
            getStoreWithCustomState({
              localGameActivities: mockActivities,
              pitchActivities: mockActivities,
              activeEventSelection: '',
            })
          )}
        >
          <InFieldPosition
            {...defaultProps}
            pitchFormat={pitchViewFormats.gameEvents}
          />
        </Provider>
      );
      await user.hover(screen.getByRole('img'));

      const gameEventsOwnGoalCount =
        screen.getByTestId('avatar-own_goals').nextSibling;
      expect(gameEventsOwnGoalCount).toHaveTextContent('1');

      const gameEventsGoalCount =
        screen.getByTestId('avatar-goals').nextSibling;
      expect(gameEventsGoalCount).toHaveTextContent('2');

      await user.unhover(screen.getAllByRole('img')[1]);
    });

    describe('player swaps', () => {
      const mockActivities = [
        { absolute_minute: 2, athlete_id: 33925, kind: eventTypes.switch },
        { absolute_minute: 3, athlete_id: 33925, kind: eventTypes.switch },
      ];

      it('should render the the respective player swaps on the pitch popup', async () => {
        const user = userEvent.setup();
        renderComponent({
          store: getStoreWithCustomState({
            pitchActivities: mockActivities,
            activeEventSelection: '',
          }),
        });
        await user.hover(screen.getByRole('img'));
        expect(screen.getByTestId('avatar-swaps')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
      });

      it('does not render the player swaps if it is an mls match report pitch', async () => {
        const user = userEvent.setup();
        renderComponent({
          props: {
            ...defaultProps,
            pitchFormat: pitchViewFormats.matchReport,
          },
          store: getStoreWithCustomState({
            pitchActivities: mockActivities,
            activeEventSelection: '',
          }),
        });

        await user.hover(screen.getByRole('img'));
        expect(screen.queryByTestId('avatar-swaps')).not.toBeInTheDocument();
      });
    });

    it('should render the the respective player substitutions on the pitch popup', async () => {
      const mockActivities = [
        { absolute_minute: 2, athlete_id: 33925, kind: eventTypes.sub },
        { absolute_minute: 3, athlete_id: 33925, kind: eventTypes.sub },
      ];
      const user = userEvent.setup();
      renderComponent({
        store: getStoreWithCustomState({
          pitchActivities: mockActivities,
          activeEventSelection: '',
        }),
      });

      await user.hover(screen.getByRole('img'));
      expect(screen.getByTestId('avatar-subs')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('should render the the respective player red card on the pitch popup', async () => {
      const mockActivities = [
        { absolute_minute: 2, athlete_id: 33925, kind: eventTypes.red },
      ];
      const user = userEvent.setup();
      renderComponent({
        store: getStoreWithCustomState({
          pitchActivities: mockActivities,
          activeEventSelection: '',
        }),
      });
      await user.hover(screen.getAllByRole('img')[1]);
      expect(screen.getByTestId('avatar-red_cards')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('should render the respective player linked own goals on the pitch popup', async () => {
      // MATCH REPORT PITCH
      window.setFlag('league-ops-match-report-v2', true);
      const mockActivities = [
        { id: 1, absolute_minute: 2, athlete_id: 33925, kind: eventTypes.goal },
        {
          id: 1,
          absolute_minute: 2,
          athlete_id: 33925,
          kind: eventTypes.own_goal,
          game_activity_id: 1,
        },
      ];
      const user = userEvent.setup();
      const { rerender } = renderComponent({
        props: {
          ...defaultProps,
          pitchFormat: pitchViewFormats.matchReport,
        },
        store: getStoreWithCustomState({
          localGameActivities: mockActivities,
          pitchActivities: mockActivities,
          activeEventSelection: '',
        }),
      });

      await user.hover(screen.getAllByRole('img')[0]);

      const matchReportGoalCount =
        screen.getByTestId('avatar-goals').nextSibling;
      expect(matchReportGoalCount).toHaveTextContent('0');

      const matchReportOwnGoalCount =
        screen.getByTestId('avatar-own_goals').nextSibling;
      expect(matchReportOwnGoalCount).toHaveTextContent('1');

      // GAME EVENTS PITCH
      window.setFlag('league-ops-game-events-own-goal', true);
      rerender(
        <Provider
          store={storeFake(
            getStoreWithCustomState({
              localGameActivities: mockActivities,
              pitchActivities: mockActivities,
              activeEventSelection: '',
            })
          )}
        >
          <InFieldPosition
            {...defaultProps}
            pitchFormat={pitchViewFormats.gameEvents}
          />
        </Provider>
      );
      await user.hover(screen.getAllByRole('img')[0]);

      const gameEventsOwnGoalCount =
        screen.getByTestId('avatar-own_goals').nextSibling;
      expect(gameEventsOwnGoalCount).toHaveTextContent('1');

      const gameEventsGoalCount =
        screen.getByTestId('avatar-goals').nextSibling;
      expect(gameEventsGoalCount).toHaveTextContent('0');
    });

    it('should render the respective player goals if the own goal feature flag is disabled', async () => {
      // MATCH REPORT PITCH
      window.setFlag('league-ops-match-report-v2', false);
      const mockActivities = [
        { id: 1, absolute_minute: 2, athlete_id: 33925, kind: eventTypes.goal },
      ];
      const user = userEvent.setup();
      const { rerender } = renderComponent({
        props: {
          ...defaultProps,
          pitchFormat: pitchViewFormats.matchReport,
        },
        store: getStoreWithCustomState({
          localGameActivities: mockActivities,
          pitchActivities: mockActivities,
          activeEventSelection: '',
        }),
      });
      await user.hover(screen.getAllByRole('img')[0]);
      expect(screen.queryByTestId('avatar-own_goals')).not.toBeInTheDocument();
      expect(screen.getByTestId('avatar-goals')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();

      // GAME EVENTS PITCH
      window.setFlag('league-ops-game-events-own-goal', false);
      rerender(
        <Provider
          store={storeFake(
            getStoreWithCustomState({
              localGameActivities: mockActivities,
              pitchActivities: mockActivities,
              activeEventSelection: '',
            })
          )}
        >
          <InFieldPosition
            {...defaultProps}
            pitchFormat={pitchViewFormats.gameEvents}
          />
        </Provider>
      );
      await user.hover(screen.getAllByRole('img')[0]);
      expect(screen.queryByTestId('avatar-own_goals')).not.toBeInTheDocument();
      expect(screen.getByTestId('avatar-goals')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('should render the the respective player nested own goals on the pitch popup', async () => {
      // MATCH REPORT PITCH
      window.setFlag('league-ops-match-report-v2', true);
      const mockActivities = [
        {
          absolute_minute: 2,
          athlete_id: 33925,
          kind: eventTypes.goal,
          game_activities: [
            {
              kind: eventTypes.own_goal,
              athlete_id: 33925,
              absolute_minute: 2,
            },
          ],
        },
      ];
      const user = userEvent.setup();
      const { rerender } = renderComponent({
        props: {
          ...defaultProps,
          pitchFormat: pitchViewFormats.matchReport,
        },
        store: getStoreWithCustomState({
          localGameActivities: mockActivities,
          pitchActivities: mockActivities,
          activeEventSelection: '',
        }),
      });

      await user.hover(screen.getAllByRole('img')[0]);

      const matchReportGoalCount =
        screen.getByTestId('avatar-goals').nextSibling;
      expect(matchReportGoalCount).toHaveTextContent('0');

      const matchReportOwnGoalCount =
        screen.getByTestId('avatar-own_goals').nextSibling;
      expect(matchReportOwnGoalCount).toHaveTextContent('1');

      // GAME EVENTS PITCH
      window.setFlag('league-ops-game-events-own-goal', true);
      rerender(
        <Provider
          store={storeFake(
            getStoreWithCustomState({
              localGameActivities: mockActivities,
              pitchActivities: mockActivities,
              activeEventSelection: '',
            })
          )}
        >
          <InFieldPosition
            {...defaultProps}
            pitchFormat={pitchViewFormats.gameEvents}
          />
        </Provider>
      );
      await user.hover(screen.getAllByRole('img')[0]);

      const gameEventsGoalCount =
        screen.getByTestId('avatar-goals').nextSibling;
      expect(gameEventsGoalCount).toHaveTextContent('0');

      const gameEventsOwnGoalCount =
        screen.getByTestId('avatar-own_goals').nextSibling;
      expect(gameEventsOwnGoalCount).toHaveTextContent('1');
    });
  });

  describe('period filtering for goals and own goals', () => {
    it('filters player goals and own goals to the current period only', async () => {
      window.setFlag('league-ops-game-events-own-goal', true);

      // In period one, the player scored one own goal and one regular goal
      const mockActivitiesPeriodOne = [
        {
          id: 1,
          absolute_minute: 10,
          athlete_id: 33925,
          kind: eventTypes.goal,
        },
        {
          id: 2,
          absolute_minute: 10,
          athlete_id: 33925,
          kind: eventTypes.own_goal,
          game_activity_id: 1,
        },
        {
          id: 3,
          absolute_minute: 15,
          athlete_id: 33925,
          kind: eventTypes.goal,
        },
      ];

      const user = userEvent.setup();

      renderComponent({
        store: getStoreWithCustomState({
          localGameActivities: mockActivitiesPeriodOne,
          pitchActivities: [],
          activeEventSelection: '',
        }),
      });

      await user.hover(screen.getByRole('img'));
      expect(screen.getByTestId('avatar-goals')).toBeInTheDocument();
      // Second-period goals for the player should be 0
      // Own goals period filtering prevents cross-period own goal subtraction
      const goalCount = screen.getByTestId('avatar-goals').nextSibling;
      expect(goalCount).toHaveTextContent('0');

      expect(screen.getByTestId('avatar-own_goals')).toBeInTheDocument();
      // Second-period own goals for the player should be 0
      // Own goals from earlier periods are filtered out
      const ownGoalCount = screen.getByTestId('avatar-own_goals').nextSibling;
      expect(ownGoalCount).toHaveTextContent('0');
    });
  });

  describe('renders with a switch event selection', () => {
    it('fires off setSelectedPitchPlayer when a player is clicked', async () => {
      const user = userEvent.setup();
      renderComponent({
        store: getStoreWithCustomState({
          activeEventSelection: eventTypes.switch,
        }),
      });
      await user.click(screen.getByRole('img'));
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: {
          player: mockPlayer,
          positionData: { position: { abbreviation: 'GK', id: 1 } },
        },
        type: 'pitchView/setSelectedPitchPlayer',
      });
    });

    it('highlights a player when it is selected from the switch', async () => {
      const user = userEvent.setup();
      renderComponent({
        store: getStoreWithCustomState({
          selectedPitchPlayer: {
            player: mockPlayer,
            positionData: mockPositionData,
          },
          activeEventSelection: eventTypes.switch,
        }),
      });
      expect(screen.getByRole('img')).toHaveStyle(styles.selectedPosition);
      await user.click(screen.getByRole('img'));
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: null,
        type: 'pitchView/setSelectedPitchPlayer',
      });
    });

    it('fires off a onPlayerClick call when the athlete is clicked when another pitch player was previously selected', async () => {
      const user = userEvent.setup();
      renderComponent({
        store: getStoreWithCustomState({
          selectedPitchPlayer: {
            id: 2,
          },
          activeEventSelection: eventTypes.switch,
        }),
      });
      await user.click(screen.getByRole('img'));
      expect(defaultProps.onPlayerClick).toHaveBeenCalledWith({
        player: mockPlayer,
        eventType: eventTypes.switch,
        positionData: {
          position: {
            abbreviation: 'GK',
            id: 1,
          },
        },
      });
    });
  });

  describe('renders with a substitution event selection', () => {
    it('fires off setSelectedPitchPlayer when a player is clicked', async () => {
      const user = userEvent.setup();
      renderComponent({
        store: getStoreWithCustomState({
          activeEventSelection: eventTypes.sub,
        }),
      });
      await user.click(screen.getByRole('img'));
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: {
          player: mockPlayer,
          positionData: { position: { abbreviation: 'GK', id: 1 } },
        },
        type: 'pitchView/setSelectedPitchPlayer',
      });
      await user.click(screen.getByRole('img'));
    });

    it('fires off setSelectedPlayer when an empty position is clicked', async () => {
      const user = userEvent.setup();
      renderComponent({
        props: { ...defaultProps, player: null },
        store: getStoreWithCustomState({
          activeEventSelection: eventTypes.sub,
        }),
      });

      await user.click(screen.getByTestId('no-player-position'));
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: {
          player: null,
          positionData: { position: { abbreviation: 'GK', id: 1 } },
        },
        type: 'pitchView/setSelectedPitchPlayer',
      });
    });
  });

  describe('renders without a player', () => {
    it('should render a field position without a player', () => {
      renderComponent({
        props: { ...defaultProps, player: null },
      });
      expect(
        screen.queryByTestId('with-player-position')
      ).not.toBeInTheDocument();
      expect(screen.getByTestId('no-player-position')).toBeInTheDocument();
      expect(screen.getByTestId('no-player-position')).toHaveStyle(
        'background-color: rgba(232, 234, 237, 0.65);'
      );
    });

    it('should render a disabled field position', () => {
      renderComponent({
        props: {
          ...defaultProps,
          cellId: '2_0',
          hasPeriodStarted: false,
          positionData: null,
        },
      });
      expect(screen.getByTestId('disabled-player-position')).toHaveStyle(
        'opacity: 0;'
      );
    });
  });

  describe('renders when the period hasant started', () => {
    it('selects a player when clicked', async () => {
      const user = userEvent.setup();
      renderComponent({
        props: { ...defaultProps, hasPeriodStarted: false },
      });

      await user.click(screen.getByRole('img'));
      expect(defaultProps.onPlayerClick).toHaveBeenCalledWith({
        player: mockPlayer,
        eventType: eventTypes.goal,
      });
    });

    it('highlights a selected player', () => {
      renderComponent({
        props: { ...defaultProps, hasPeriodStarted: false },
        store: getStoreWithCustomState({
          selectedPitchPlayer: {
            player: mockPlayer,
            positionData: mockPositionData,
          },
        }),
      });
      expect(screen.getByRole('img')).toHaveStyle(styles.selectedPosition);
    });

    describe('removing an assigned player', () => {
      it('on mouseOver displays the remove player button', async () => {
        const user = userEvent.setup();
        renderComponent({
          props: { ...defaultProps, hasPeriodStarted: false },
          store: getStoreWithCustomState({
            selectedPitchPlayer: {
              player: mockPlayer,
              positionData: mockPositionData,
            },
          }),
        });
        await user.hover(screen.getByRole('img'));
        expect(screen.getByTestId('avatar-remove-button')).toBeInTheDocument();
        await user.unhover(screen.getByRole('img'));
        expect(
          screen.queryByTestId('avatar-remove-button')
        ).not.toBeInTheDocument();
      });

      it('on focus displays the remove player button', () => {
        renderComponent({
          props: { ...defaultProps, hasPeriodStarted: false },
          store: getStoreWithCustomState({
            selectedPitchPlayer: {
              player: mockPlayer,
              positionData: mockPositionData,
            },
          }),
        });
        fireEvent.focus(screen.getByRole('img'));
        expect(screen.getByTestId('avatar-remove-button')).toBeInTheDocument();
        fireEvent.blur(screen.getByRole('img'));
        expect(
          screen.queryByTestId('avatar-remove-button')
        ).not.toBeInTheDocument();
      });

      it('clicking on the remove button fires off the handleRemovePosition call', async () => {
        renderComponent({
          props: { ...defaultProps, hasPeriodStarted: false },
          store: getStoreWithCustomState({
            selectedPitchPlayer: {
              player: mockPlayer,
              positionData: mockPositionData,
            },
          }),
        });
        await userEvent.hover(screen.getByRole('img'));
        await userEvent.click(screen.getByTestId('avatar-remove-button'));
        expect(defaultProps.handleRemovePosition).toHaveBeenCalledWith(
          mockPlayer,
          mockPositionData
        );
      });
    });

    it('highlights the selected empty position', () => {
      renderComponent({
        props: { ...defaultProps, hasPeriodStarted: false, player: undefined },
        store: getStoreWithCustomState({
          selectedPitchPlayer: {
            player: undefined,
            positionData: mockPositionData,
          },
        }),
      });

      expect(screen.getByTestId('no-player-position')).toHaveStyle(
        styles.selectedPosition
      );
    });
  });
});
