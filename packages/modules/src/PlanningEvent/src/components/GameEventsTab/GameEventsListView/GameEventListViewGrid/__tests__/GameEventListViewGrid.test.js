import * as redux from 'react-redux';
import { act, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { eventTypes } from '@kitman/common/src/consts/gameEventConsts';
import GameEventListViewGrid from '../GameEventListViewGrid';

describe('GameEventListViewGrid', () => {
  const defaultProps = {
    athletes: [
      {
        id: 1,
        fullname: 'John Doe',
        avatar_url: 'avatar_url.jpg',
        position: { id: 1, name: 'Position 1', abbreviation: 'P1' },
      },
      {
        id: 2,
        fullname: 'Jane Doh',
        avatar_url: 'avatar_url.jpg',
        position: { id: 1, name: 'Position 2', abbreviation: 'P2' },
      },
    ],
    gameActivities: [
      {
        id: 1,
        kind: eventTypes.position_change,
        absolute_minute: 10,
        athlete_id: 1,
      },
      { id: 5, kind: eventTypes.goal, absolute_minute: 16, athlete_id: 1 },
    ],
    gridSorting: { column: null, order: null },
    t: i18nextTranslateStub(),
    positionGroups: [],
    athleteEvents: [],
    participationLevels: [],
    canEditEvent: true,
    formationChange: {
      kind: eventTypes.formation_change,
      relation: { id: 1 },
      absolute_minute: 0,
    },
    formationCoordinates: [
      {
        id: 34,
        field_id: 1,
        formation_id: 4,
        position: {
          id: 84,
          name: 'Goalkeeper',
          order: 1,
          abbreviation: 'GK',
        },
        x: 0,
        y: 5,
        order: 1,
      },
    ],
    period: {
      absolute_duration_start: 0,
      absolute_duration_end: 45,
      duration: 45,
      id: 1,
    },
    periodDuration: {
      min: 0,
      max: 45,
    },
    isPitchViewEnabled: true,
    hasPeriodStarted: true,
    isMidGamePlayerPositionChangeDisabled: false,
  };

  const defaultStore = {
    planningEvent: {
      athletePlayTimes: {
        localAthletePlayTimes: [],
        apiAthletePlayTimes: [],
      },
    },
  };

  const renderComponent = (props = defaultProps, mockStore = defaultStore) =>
    act(() => {
      renderWithProviders(<GameEventListViewGrid {...props} />, {
        preloadedState: mockStore,
      });
    });

  describe('initial render', () => {
    beforeEach(() => {
      window.featureFlags = { 'planning-game-events-field-view': false };
      renderComponent();
    });

    it('renders the correct content', () => {
      expect(screen.getByText('Athlete')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Doh')).toBeInTheDocument();

      expect(screen.getByText('Starting position')).toBeInTheDocument();
      expect(screen.getByText('Position 1')).toBeInTheDocument();
      expect(screen.getByText('Position 2')).toBeInTheDocument();
    });
  });

  describe('initial render with pitchViewEnabled ff off', () => {
    const pitchViewDisabledProps = {
      ...defaultProps,
      isPitchViewEnabled: false,
    };
    beforeEach(() => {
      renderComponent(pitchViewDisabledProps);
    });

    it('renders the correct content', () => {
      expect(screen.getByText('Athlete')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Doh')).toBeInTheDocument();

      expect(screen.getByText('Position 1')).toBeInTheDocument();
      expect(screen.getByText('Position 2')).toBeInTheDocument();

      expect(screen.getByText('Positions')).toBeInTheDocument();
      expect(screen.getByText('SUB (10’)')).toBeInTheDocument();

      expect(screen.getByText('Total minutes')).toBeInTheDocument();

      expect(screen.getByText('Yellow')).toBeInTheDocument();

      expect(screen.getByText('Red')).toBeInTheDocument();

      expect(screen.getByText('Goal')).toBeInTheDocument();
      expect(screen.getByText('16’')).toBeInTheDocument();

      expect(screen.getByText('Assist')).toBeInTheDocument();
    });
  });

  describe('initial render with pitchViewEnabled ff on and Starting Positions not selected', () => {
    const beforeStartingPositionsSelectedProps = {
      ...defaultProps,
      gameActivities: [
        { id: 1, kind: 'position_change', absolute_minute: 10, athlete_id: 1 },
        { id: 5, kind: 'goal', absolute_minute: 16, athlete_id: 1 },
        {
          id: 2,
          kind: 'position_change',
          athlete_id: 2,
          absolute_minute: 0,
          relation_type: 'Position',
          relation: {
            id: 84,
            name: 'Goalkeeper',
            order: 1,
          },
          game_period_id: 1,
        },
      ],
    };

    beforeEach(() => {
      renderComponent(beforeStartingPositionsSelectedProps);
    });

    it('renders the correct content', () => {
      expect(screen.getByText('Athlete')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Doh')).toBeInTheDocument();

      expect(screen.getByText('Starting position')).toBeInTheDocument();
      expect(screen.getByText('Position 1')).toBeInTheDocument();
      expect(screen.getByText('Position 2')).toBeInTheDocument();
    });
  });

  describe('initial render with pitchViewEnabled ff on and formation_complete game activity exists', () => {
    const beforeStartingPositionsSelectedProps = {
      ...defaultProps,
      gameActivities: [
        {
          id: 6,
          kind: 'formation_complete',
          minute: 0,
          absolute_minute: 0,
          game_period_id: 1,
        },
      ],
    };

    beforeEach(() => {
      renderComponent(beforeStartingPositionsSelectedProps);
    });

    it('renders the correct content', () => {
      expect(screen.getByText('Athlete')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Doh')).toBeInTheDocument();

      expect(screen.getByText('Starting position')).toBeInTheDocument();
      expect(screen.getByText('Position 1')).toBeInTheDocument();
      expect(screen.getByText('Position 2')).toBeInTheDocument();

      expect(screen.getByText('Positions/subs')).toBeInTheDocument();
    });
  });

  describe('[feature-flag set-overall-game-minutes] render', () => {
    let useDispatchSpy;
    let mockDispatch;

    beforeEach(() => {
      window.featureFlags = { 'set-overall-game-minutes': true };
      useDispatchSpy = jest.spyOn(redux, 'useDispatch');
      mockDispatch = jest.fn();
      useDispatchSpy.mockReturnValue(mockDispatch);
    });

    afterEach(() => {
      window.featureFlags = { 'set-overall-game-minutes': false };
      useDispatchSpy.mockClear();
    });

    const mockAthletePlayTimes = [
      { athlete_id: 1, minutes: 0, game_period_id: 1 },
      { athlete_id: 2, minutes: 0, game_period_id: 1 },
    ];

    const athletePlayTimesStore = {
      planningEvent: {
        athletePlayTimes: {
          localAthletePlayTimes: mockAthletePlayTimes,
          apiAthletePlayTimes: mockAthletePlayTimes,
        },
      },
    };

    it('allows the user to set a manual player time when editing the total time field', async () => {
      renderComponent(defaultProps, athletePlayTimesStore);

      await userEvent.click(screen.getAllByTestId('TotalTime|Sum Editable')[0]);
      fireEvent.change(screen.getByRole('spinbutton'), {
        target: { value: '25' },
      });
      fireEvent.blur(screen.getByRole('spinbutton'));
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: [
          { athlete_id: 1, game_period_id: 1, minutes: 25 },
          mockAthletePlayTimes[1],
        ],
        type: 'athletePlayTimes/setUnsavedAthletePlayTimes',
      });
    });

    it('disables the user from adding subs/position swaps if a manual game entry exists', async () => {
      renderComponent(
        { ...defaultProps, isMidGamePlayerPositionChangeDisabled: true },
        athletePlayTimesStore
      );
      await userEvent.click(screen.getAllByRole('button')[0]);

      expect(screen.getAllByText('Positions/subs').length).toEqual(1); // Only the grid header shows no popup
      expect(screen.queryByText('Changed at')).not.toBeInTheDocument();
      expect(screen.queryByText('Position to')).not.toBeInTheDocument();
      expect(screen.queryByText('Save')).not.toBeInTheDocument();
    });

    it('disables the user adding manual times if a substitute/position_swap exists', async () => {
      renderComponent(
        {
          ...defaultProps,
          gameActivities: [
            ...defaultProps.gameActivities,
            {
              id: 3,
              kind: eventTypes.sub,
              absolute_minute: 10,
            },
          ],
        },
        athletePlayTimesStore
      );

      expect(
        screen.queryByTestId('TotalTime|Sum Editable')
      ).not.toBeInTheDocument();
    });
  });

  describe('[feature-flag league-ops-game-events-own-goal] render', () => {
    beforeEach(() => {
      window.setFlag('league-ops-game-events-own-goal', true);
    });

    it('renders own goal column and shows linked own goal in own goal column only', () => {
      const linkedOwnGoalProps = {
        ...defaultProps,
        gameActivities: [
          {
            id: 10,
            kind: eventTypes.goal,
            athlete_id: 1,
            minute: 11,
            absolute_minute: 11,
            game_period_id: 1,
            game_activity_id: null,
          },
          {
            id: 11,
            kind: eventTypes.own_goal,
            athlete_id: 1,
            minute: 11,
            absolute_minute: 11,
            game_period_id: 1,
            game_activity_id: 10, // linked own goal to goal id 10
          },
          {
            id: 12,
            kind: eventTypes.goal,
            athlete_id: 1,
            minute: 30,
            absolute_minute: 30,
            game_period_id: 1,
            game_activity_id: null,
          },
        ],
      };
      renderComponent(linkedOwnGoalProps);
      expect(screen.getByText('Own goal')).toBeInTheDocument();
      expect(screen.getByText('Goal')).toBeInTheDocument();

      expect(screen.getByText('11’')).toBeInTheDocument();
      expect(screen.getByText('30’')).toBeInTheDocument();
      // Minute 11 should be shown only once overall (in own goal column, excluded from main goal column)
      expect(screen.getAllByText('11’').length).toBe(1);
    });
  });
});
