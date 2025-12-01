import * as redux from 'react-redux';
import { Provider } from 'react-redux';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import {
  eventTypes,
  pitchViewFormats,
} from '@kitman/common/src/consts/gameEventConsts';
import SubstitutionPlayerList from '..';
import { mockOrderedPlayerData } from '../../GameEventsTab/__tests__/mockTestSquadData';

describe('<SubstitutionPlayerList />', () => {
  const storeFake = (state) => ({
    default: () => {},
    subscribe: () => {},
    dispatch: () => {},
    getState: () => ({ ...state }),
  });

  const mockPlayers = [
    { ...mockOrderedPlayerData[0], fullname: 'Harry Doe' },
    {
      ...mockOrderedPlayerData[1],
      fullname: 'Yao Wilfried',
      shortname: 'Y. Wilfried',
    },
    {
      ...mockOrderedPlayerData[2],
      fullname: 'Michael Yao',
      shortname: 'M. Yao',
    },
  ];

  const defaultProps = {
    pitchFormat: pitchViewFormats.gameEvents,
    eventId: 1,
    periodStartTime: 0,
    staff: [],
    team: {
      inFieldPlayers: {},
      players: [mockPlayers[0], mockPlayers[1], mockPlayers[2]],
    },
    formationCoordinates: {
      '1_1': {
        field_id: 1,
        formation_id: 1,
        id: 1,
        order: 1,
        position_id: 1,
        x: 1,
        y: 1,
        position: {
          id: 1,
          abbreviation: 'MF',
        },
      },
    },
    onSetSelectedEvent: jest.fn(),
    onSetTeam: jest.fn(),
    t: i18nextTranslateStub(),
  };

  const defaultStore = {
    planningEvent: {
      gameActivities: { localGameActivities: [] },
      pitchView: {
        activeEventSelection: '',
        pitchActivities: [],
        selectedPitchPlayer: null,
      },
    },
  };

  const renderTestComponent = ({
    props = defaultProps,
    store = defaultStore,
  }) =>
    render(
      <Provider store={storeFake(store)}>
        <SubstitutionPlayerList {...props} />
      </Provider>
    );

  const getStoreWithCustomState = ({
    customGameActivities = [],
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

  describe('Substitution List - game events', () => {
    it('renders the subs category', () => {
      renderTestComponent({ props: defaultProps });
      expect(screen.getByText('Substitutions')).toBeInTheDocument();
    });

    it('shows empty message when there is no staff', () => {
      renderTestComponent({ props: defaultProps });
      expect(screen.getByText('No staff available')).toBeInTheDocument();
    });

    it('creates sub events for the selected pitch position when a player is clicked', async () => {
      const user = userEvent.setup();
      const expectedResult = [
        {
          absolute_minute: 0,
          minute: 0,
          athlete_id: null,
          game_activities: [
            {
              absolute_minute: 0,
              minute: 0,
              athlete_id: 3,
              kind: eventTypes.position_change,
              relation: { id: 1 },
            },
            {
              absolute_minute: 0,
              minute: 0,
              athlete_id: 3,
              kind: eventTypes.formation_position_view_change,
              relation: { id: 1 },
            },
          ],
          kind: eventTypes.sub,
          relation: { id: 3 },
        },
      ];
      renderTestComponent({
        store: getStoreWithCustomState({
          customPitchViewState: {
            activeEventSelection: eventTypes.sub,
            selectedPitchPlayer: {
              player: undefined,
              positionData: { id: 1, position: { id: 1 } },
            },
          },
        }),
      });
      await user.click(screen.getByText('M. Yao'));
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: expectedResult,
        type: 'gameActivities/setUnsavedGameActivities',
      });
      expect(defaultProps.onSetTeam).toHaveBeenCalledWith({
        inFieldPlayers: {
          '1_1': defaultProps.team.players[2],
        },
        players: [defaultProps.team.players[0], defaultProps.team.players[1]],
      });
      expect(defaultProps.onSetSelectedEvent).toHaveBeenCalledWith({
        ...expectedResult[0],
        activityIndex: 0,
      });
    });

    it('shows empty message when there is no subs', () => {
      renderTestComponent({
        props: {
          ...defaultProps,
          team: { ...defaultProps.team, players: [] },
        },
      });
      expect(screen.getByText('No substitutes available')).toBeInTheDocument();
    });

    describe('with Staff', () => {
      const renderWithStaff = (eventType) =>
        renderTestComponent({
          props: {
            ...defaultProps,
            staff: [
              {
                id: 1,
                user: {
                  id: 1,
                  fullname: 'John',
                  role: 'Account Admin',
                },
              },
            ],
          },
          store: getStoreWithCustomState({
            customPitchViewState: { activeEventSelection: eventType },
          }),
        });

      it('shows the staff section', () => {
        renderWithStaff();

        const staffSection = screen.getByTestId('staff-section');
        expect(screen.getByText('Staff')).toBeInTheDocument();
        expect(screen.getByText('John')).toBeInTheDocument();
        expect(screen.getByText('Account Admin')).toBeInTheDocument();
        expect(within(staffSection).getByTestId('PlayerAvatar')).toHaveStyle(
          'cursor:not-allowed'
        );
      });

      it.each([
        eventTypes.sub,
        eventTypes.goal,
        eventTypes.switch,
        eventTypes.formation_change,
      ])(`is disabled when the %s event is selected`, (eventType) => {
        renderWithStaff(eventType);
        const staffSection = screen.getByTestId('staff-section');
        expect(within(staffSection).getByTestId('PlayerAvatar')).toHaveStyle(
          'cursor:not-allowed'
        );
      });

      it.each([eventTypes.yellow, eventTypes.red])(
        'is not disabled when the %s event is selected',
        (eventType) => {
          renderWithStaff(eventType);
          const staffSection = screen.getByTestId('staff-section');

          expect(within(staffSection).getByTestId('PlayerAvatar')).toHaveStyle(
            'cursor:default'
          );
        }
      );

      it('assign a yellow card to a staff', async () => {
        const user = userEvent.setup();
        const expectedResult = [
          {
            absolute_minute: 0,
            minute: 0,
            kind: eventTypes.yellow,
            user_id: 1,
            relation: { id: null },
          },
        ];

        renderWithStaff(eventTypes.yellow);

        await user.click(screen.getByText('John'));

        expect(mockDispatch).toHaveBeenCalledWith({
          payload: expectedResult,
          type: 'gameActivities/setUnsavedGameActivities',
        });
        expect(defaultProps.onSetSelectedEvent).toHaveBeenCalledWith({
          ...expectedResult[0],
          activityIndex: 0,
        });
      });

      it('assign a red card to a staff', async () => {
        const user = userEvent.setup();
        const expectedResult = [
          {
            absolute_minute: 0,
            minute: 0,
            kind: eventTypes.red,
            user_id: 1,
            relation: { id: null },
          },
        ];

        renderWithStaff(eventTypes.red);

        await user.click(screen.getByText('John'));

        expect(mockDispatch).toHaveBeenCalledWith({
          payload: expectedResult,
          type: 'gameActivities/setUnsavedGameActivities',
        });
        expect(defaultProps.onSetSelectedEvent).toHaveBeenCalledWith({
          ...expectedResult[0],
          activityIndex: 0,
        });
      });
    });
  });

  describe('Substitution List - match report', () => {
    const matchReportEvents = [
      eventTypes.yellow,
      eventTypes.red,
      eventTypes.goal,
      eventTypes.sub,
    ];

    const matchReportEventsAndResult = [
      [
        eventTypes.yellow,
        [
          {
            absolute_minute: 0,
            athlete_id: 1,
            kind: eventTypes.yellow,
            minute: 0,
            relation: { id: null },
          },
        ],
      ],
      [
        eventTypes.red,
        [
          {
            absolute_minute: 0,
            athlete_id: 1,
            kind: eventTypes.red,
            minute: 0,
            relation: { id: null },
          },
        ],
      ],
      [
        eventTypes.goal,
        [
          {
            absolute_minute: 0,
            athlete_id: 1,
            kind: eventTypes.goal,
            minute: 0,
            relation: { id: null },
          },
        ],
      ],
    ];

    it.each(matchReportEvents)(
      'allows the sub list player to be enabled when the %s event is selected',
      (eventType) => {
        renderTestComponent({
          props: {
            ...defaultProps,
            pitchFormat: pitchViewFormats.matchReport,
            team: {
              ...defaultProps.team,
              players: [defaultProps.team.players[0]],
            },
          },
          store: getStoreWithCustomState({
            customPitchViewState: {
              activeEventSelection: eventType,
            },
          }),
        });
        expect(screen.getByTestId('PlayerAvatar')).toHaveStyle(
          'cursor:default'
        );
      }
    );

    it.each([matchReportEvents])(
      'allows the sub list player to be disabled when the %s event is selected and a red card exists',
      (eventType) => {
        renderTestComponent({
          props: {
            ...defaultProps,
            pitchFormat: pitchViewFormats.matchReport,
            team: {
              ...defaultProps.team,
              players: [defaultProps.team.players[0]],
            },
          },
          store: getStoreWithCustomState({
            customGameActivities: [
              {
                kind: eventTypes.red,
                absolute_minute: 0,
                athlete_id: defaultProps.team.players[0].id,
              },
            ],
            customPitchViewState: {
              activeEventSelection: eventType,
            },
          }),
        });
        expect(screen.getByTestId('PlayerAvatar')).toHaveStyle(
          'cursor:not-allowed'
        );
      }
    );

    it.each(matchReportEventsAndResult)(
      'allows the sub list player to create a %s event',
      async (eventType, result) => {
        const user = userEvent.setup();
        renderTestComponent({
          props: {
            ...defaultProps,
            pitchFormat: pitchViewFormats.matchReport,
            team: {
              ...defaultProps.team,
              players: [defaultProps.team.players[0]],
            },
          },
          store: getStoreWithCustomState({
            customPitchViewState: {
              activeEventSelection: eventType,
            },
          }),
        });
        await user.click(screen.getByText('J. Doe'));
        expect(mockDispatch).toHaveBeenCalledWith({
          payload: result,
          type: 'gameActivities/setUnsavedGameActivities',
        });
      }
    );
  });
});
