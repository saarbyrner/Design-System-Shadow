import * as redux from 'react-redux';
import selectEvent from 'react-select-event';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { server, rest } from '@kitman/services/src/mocks/server';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { eventTypes } from '@kitman/common/src/consts/gameEventConsts';
import PreferenceContext from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';

import { mockOrderedPlayerData } from '../../GameEventsTab/__tests__/mockTestSquadData';
import AvailablePlayerList from '..';

describe('AvailablePlayList', () => {
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
    eventId: 1,
    isCaptainEnabled: false,
    gameFormats: [
      {
        id: 1,
        name: '11v11',
        number_of_players: 11,
      },
    ],
    formations: [
      {
        id: 1,
        name: '5-4-1',
        number_of_players: 11,
      },
    ],
    t: i18nextTranslateStub(),
    periodStartTime: 40,
    currentPeriod: null,
  };

  const selectedPeriod = {
    id: 2,
    name: 'Period 2',
    duration: 40,
    absolute_duration_start: 40,
  };
  const gamePeriods = [
    { absolute_duration_start: 0, duration: 40 },
    selectedPeriod,
  ];

  const defaultStore = {
    planningEvent: {
      gameActivities: { localGameActivities: [] },
      eventPeriods: { localEventPeriods: gamePeriods },
      pitchView: {
        team: {
          inFieldPlayers: {},
          players: [mockPlayers[0], mockPlayers[1], mockPlayers[2]],
        },
        field: {
          id: 1,
        },
        selectedFormation: {
          id: 1,
        },
        selectedGameFormat: {
          id: 1,
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
      },
    },
  };

  const renderTestComponent = ({
    props = defaultProps,
    store = defaultStore,
    leaguePreferences = {
      league_game_team: false,
      league_game_match_report: false,
    },
  }) =>
    renderWithRedux(
      <PreferenceContext.Provider value={{ preferences: leaguePreferences }}>
        <AvailablePlayerList {...props} />
      </PreferenceContext.Provider>,
      { preloadedState: store }
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

  const getFormationActivities = (athleteId) => [
    {
      absolute_minute: 0,
      minute: 0,
      athlete_id: athleteId,
      kind: eventTypes.formation_position_view_change,
      relation: { id: 1 },
    },
    {
      absolute_minute: 0,
      minute: 0,
      athlete_id: athleteId,
      kind: eventTypes.position_change,
      relation: { id: 1 },
    },
  ];

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

  describe('initial render', () => {
    it('renders players category', async () => {
      renderTestComponent({ props: { ...defaultProps, periodStartTime: 0 } });
      expect(screen.getByText('Available Players')).toBeInTheDocument();
      expect(screen.getByTestId('Forward group')).toBeInTheDocument();
      expect(screen.getByTestId('Center')).toBeInTheDocument();
      expect(screen.getByTestId('Forward group')).toContainElement(
        screen.getByText('J. Doe')
      );
      expect(screen.getByTestId('Forward group')).toContainElement(
        screen.getByText('Y. Wilfried')
      );
      expect(screen.getByTestId('Center')).toContainElement(
        screen.getByText('M. Yao')
      );
    });

    it('allows the player to set a player when clicked', async () => {
      const user = userEvent.setup();
      renderTestComponent({
        props: { ...defaultProps, periodStartTime: 0 },
        store: getStoreWithCustomState({
          customPitchViewState: {
            selectedPitchPlayer: {
              player: undefined,
              positionData: { id: 1, position: { id: 1 } },
            },
          },
        }),
      });

      await user.click(screen.getByText('M. Yao'));
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: getFormationActivities(3),
        type: 'gameActivities/setUnsavedGameActivities',
      });
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: {
          inFieldPlayers: {
            '1_1': mockPlayers[2],
          },

          players: [mockPlayers[0], mockPlayers[1]],
        },
        type: 'pitchView/setTeam',
      });
    });

    it('allows the user to assign a player overwriting the existing one', async () => {
      const user = userEvent.setup();
      renderTestComponent({
        props: { ...defaultProps, periodStartTime: 0 },
        store: getStoreWithCustomState({
          customGameActivities: getFormationActivities(2),
          customPitchViewState: {
            selectedPitchPlayer: {
              player: mockPlayers[1],
              positionData: { id: 1, position: { id: 1 } },
            },
          },
        }),
      });
      await user.click(screen.getByText('M. Yao'));
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: getFormationActivities(3),
        type: 'gameActivities/setUnsavedGameActivities',
      });
    });

    it('allows the player to see the captain text when a  captain is assigned', () => {
      renderTestComponent({
        props: { ...defaultProps, periodStartTime: 0 },
        store: getStoreWithCustomState({
          customGameActivities: [
            { kind: eventTypes.captain_assigned, athlete_id: 1 },
          ],
        }),
      });

      expect(screen.getByTestId('Forward group')).toContainElement(
        screen.getByText('J. Doe (C)')
      );
    });
  });

  describe('Player categories ordering', () => {
    it('player groups should be rendered in alphabetical order regardless of insertion order', () => {
      // Intentionally unsorted insertion order: Forward Group, Center
      renderTestComponent({
        props: { ...defaultProps, periodStartTime: 0 },
        store: getStoreWithCustomState({
          customPitchViewState: {
            team: {
              inFieldPlayers: {},
              players: mockPlayers,
            },
          },
        }),
      });

      const renderedOrder = Array.from(
        document.querySelectorAll(
          '[data-testid="Center"], [data-testid="Forward group"]'
        )
      ).map((el) => el.getAttribute('data-testid'));

      expect(renderedOrder).toEqual(['Center', 'Forward group']);
    });
  });

  describe('lineup options', () => {
    const mockOptionsFormationCoordinates = [
      {
        x: 1,
        y: 1,
        position: { id: 1, abbreviation: 'GK' },
        field_id: '123',
        formation_id: '345',
        order: 1,
        position_id: 1,
      },
      {
        x: 2,
        y: 1,
        position: { id: 2, abbreviation: 'DEF' },
        field_id: '123',
        formation_id: '345',
        order: 2,
        position_id: 2,
      },
    ];

    const mockPreCopyActivities = [
      {
        kind: eventTypes.formation_change,
        minute: 0,
        athlete_id: null,
        absolute_minute: 0,
        relation: {
          id: 1,
          name: '5-3-4',
          number_of_players: 11,
        },
      },
      {
        kind: eventTypes.formation_position_view_change,
        minute: 0,
        athlete_id: 1,
        absolute_minute: 0,
      },
      {
        kind: eventTypes.position_change,
        minute: 0,
        athlete_id: 2,
        absolute_minute: 0,
      },
      {
        kind: eventTypes.formation_change,
        minute: 0,
        athlete_id: null,
        absolute_minute: 40,
      },
    ];

    const mockFormationCoordinate = {
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
    };

    const copyPeriodLineupTestAssertions = ({ captainIncluded = false }) => {
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: {
          id: 1,
          name: '11v11',
          number_of_players: 11,
        },
        type: 'pitchView/setSelectedGameFormat',
      });
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: {
          id: 1,
          name: '5-4-1',
          number_of_players: 11,
        },
        type: 'pitchView/setSelectedFormation',
      });
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: {
          inFieldPlayers: {
            '1_1': mockPlayers[0],
          },
          players: [mockPlayers[1], mockPlayers[2]],
        },
        type: 'pitchView/setTeam',
      });
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: {
          '1_1': mockOptionsFormationCoordinates[0],
          '2_1': mockOptionsFormationCoordinates[1],
        },
        type: 'pitchView/setFormationCoordinates',
      });
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: [
          {
            absolute_minute: 0,
            athlete_id: null,
            kind: eventTypes.formation_change,
            minute: 0,
            relation: { id: 1, name: '5-3-4', number_of_players: 11 },
          },
          {
            absolute_minute: 0,
            athlete_id: 1,
            kind: eventTypes.formation_position_view_change,
            minute: 0,
          },
          {
            absolute_minute: 0,
            athlete_id: 2,
            kind: eventTypes.position_change,
            minute: 0,
          },
          ...(captainIncluded
            ? [
                {
                  absolute_minute: 0,
                  athlete_id: 2553,
                  kind: eventTypes.captain_assigned,
                },
              ]
            : []),
          {
            absolute_minute: 40,
            athlete_id: 1,
            kind: eventTypes.formation_position_view_change,
          },
          {
            absolute_minute: 40,
            athlete_id: 2,
            kind: eventTypes.position_change,
          },
        ],
        type: 'gameActivities/setUnsavedGameActivities',
      });
    };

    it('creates a new line up template', async () => {
      server.use(
        rest.post('/ui/planning_hub/lineups', (req, res, ctx) =>
          res(
            ctx.json([
              {
                id: 1,
                name: '1st line up',
                organisation_format_id: 1,
                formation_id: 1,
                lineup_positions: [
                  {
                    athlete_id: 12,
                    formation_position_view: {
                      id: 1,
                      field_id: 1,
                      formation_id: 1,
                      position: {
                        id: 98,
                        name: 'Forward',
                        order: 1,
                      },
                      x: 1,
                      y: 1,
                      order: 1,
                    },
                  },
                  {
                    athlete_id: 34,
                    formation_position_view: {
                      id: 1,
                      field_id: 1,
                      formation_id: 1,
                      position: {
                        id: 98,
                        name: 'Forward',
                        order: 2,
                      },
                      x: 2,
                      y: 2,
                      order: 1,
                    },
                  },
                ],
                author: {
                  firstname: 'michael',
                  fullname: 'michael y',
                  id: 1,
                  lastname: 'y',
                },
              },
            ])
          )
        )
      );
      const user = userEvent.setup();
      const { container } = renderTestComponent({
        props: { ...defaultProps, periodStartTime: 0 },
      });

      selectEvent.openMenu(container.querySelector('.kitmanReactSelect input'));

      await selectEvent.select(
        container.querySelector('.kitmanReactSelect'),
        (text) => {
          return text === 'Save line-up template';
        }
      );

      await user.type(
        screen.getByLabelText('Line-up template name'),
        'new line up'
      );
      await user.click(screen.getByTestId('confirm-button'));
      expect(screen.getByText('Line-up template saved')).toBeInTheDocument();
    });

    it('hides "Copy from last period" when period 1 is selected', async () => {
      const user = userEvent.setup();
      renderTestComponent({
        props: {
          ...defaultProps,
          periodStartTime: 0,
          currentPeriod: {
            id: 1,
            name: 'Period 1',
            duration: 40,
            absolute_duration_start: 0,
          },
        },
        store: getStoreWithCustomState({
          customGameActivities: [
            {
              kind: eventTypes.formation_change,
              minute: 0,
              athlete_id: null,
              absolute_minute: 0,
            },
          ],
        }),
      });

      await user.click(screen.getByText('Line-ups'));
      expect(
        screen.queryByText('Copy from last period')
      ).not.toBeInTheDocument();
    });

    it('shows "Copy from last period" when period 2 is selected', async () => {
      const user = userEvent.setup();
      renderTestComponent({
        store: getStoreWithCustomState({
          customGameActivities: [
            {
              kind: eventTypes.formation_change,
              minute: 0,
              athlete_id: null,
              absolute_minute: 0,
            },
          ],
        }),
      });

      await user.click(screen.getByText('Line-ups'));
      expect(screen.queryByText('Copy from last period')).toBeInTheDocument();
    });

    it('alerts with "No line up to copy from the last period"', async () => {
      const user = userEvent.setup();
      renderTestComponent({
        props: { ...defaultProps, currentPeriod: selectedPeriod },
        store: getStoreWithCustomState({
          customGameActivities: [
            {
              kind: eventTypes.formation_change,
              minute: 0,
              athlete_id: null,
              absolute_minute: 0,
            },
            {
              kind: eventTypes.formation_change,
              minute: 0,
              athlete_id: null,
              absolute_minute: 40,
            },
          ],
        }),
      });

      await user.click(screen.getByText('Line-ups'));
      await user.click(screen.queryByText('Copy from last period'));
      expect(
        screen.getByText('No line up to copy from the last period')
      ).toBeInTheDocument();
    });

    it('copies last period line up', async () => {
      server.use(
        rest.get(
          '/ui/planning_hub/formation_position_views?field_id=1&formation_id=1',
          (req, res, ctx) => res(ctx.json(mockOptionsFormationCoordinates))
        )
      );

      const user = userEvent.setup();
      renderTestComponent({
        props: { ...defaultProps, currentPeriod: selectedPeriod },
        store: getStoreWithCustomState({
          customGameActivities: mockPreCopyActivities,
        }),
      });

      await user.click(screen.getByText('Line-ups'));
      await user.click(screen.queryByText('Copy from last period'));

      copyPeriodLineupTestAssertions({});

      expect(
        screen.getByText('Last line up copied with success.')
      ).toBeInTheDocument();
    });

    it('copies last period line up with existing events', async () => {
      server.use(
        rest.get(
          '/ui/planning_hub/formation_position_views?field_id=1&formation_id=1',
          (req, res, ctx) => res(ctx.json(mockOptionsFormationCoordinates))
        )
      );

      const mockCustomPreCopyActivities = [
        ...mockPreCopyActivities,
        {
          kind: eventTypes.formation_position_view_change,
          minute: 0,
          athlete_id: 1,
          absolute_minute: 40,
        },
        {
          kind: eventTypes.position_change,
          minute: 0,
          athlete_id: 2,
          absolute_minute: 40,
        },
        {
          kind: eventTypes.captain_assigned,
          absolute_minute: 0,
          athlete_id: 2553,
        },
      ];

      const user = userEvent.setup();
      renderTestComponent({
        props: { ...defaultProps, currentPeriod: selectedPeriod },
        store: getStoreWithCustomState({
          customGameActivities: mockCustomPreCopyActivities,
        }),
      });

      await user.click(screen.getByText('Line-ups'));
      await user.click(screen.queryByText('Copy from last period'));
      expect(screen.getByText('You have unsaved data!')).toBeInTheDocument();
      expect(
        screen.getByText(
          'All previous events added to the selected period will be deleted.'
        )
      ).toBeInTheDocument();
      await user.click(screen.queryByText('Confirm'));
      copyPeriodLineupTestAssertions({ captainIncluded: true });

      expect(
        screen.getByText('Last line up copied with success.')
      ).toBeInTheDocument();
    });

    it('should apply a saved line up', async () => {
      server.use(
        rest.get('/ui/planning_hub/lineups', (req, res, ctx) =>
          res(
            ctx.json([
              {
                id: 1,
                name: '1st line up',
                organisation_format_id: 1,
                formation_id: 1,
                lineup_positions: [
                  {
                    athlete_id: 1,
                    formation_position_view: {
                      id: 1,
                      field_id: 1,
                      formation_id: 1,
                      position: {
                        id: 98,
                        name: 'Forward',
                        order: 1,
                      },
                      x: 1,
                      y: 1,
                      order: 1,
                    },
                  },
                  {
                    athlete_id: 2,
                    formation_position_view: {
                      id: 1,
                      field_id: 1,
                      formation_id: 1,
                      position: {
                        id: 98,
                        name: 'Forward',
                        order: 2,
                      },
                      x: 2,
                      y: 2,
                      order: 1,
                    },
                  },
                ],
                author: {
                  firstname: 'wilfried',
                  fullname: 'wilfried y',
                  id: 1,
                  lastname: 'y',
                },
              },
            ])
          )
        ),
        rest.get(
          '/ui/planning_hub/formation_position_views?field_id=1&formation_id=1',
          (req, res, ctx) => res(ctx.json([mockFormationCoordinate]))
        )
      );

      const user = userEvent.setup();
      renderTestComponent({
        props: {
          ...defaultProps,
          periodStartTime: 0,
          currentPeriod: {
            id: 1,
            name: 'Period 1',
            duration: 40,
            absolute_duration_start: 0,
            absolute_duration_end: 40,
          },
        },
        store: getStoreWithCustomState({
          customGameActivities: [
            {
              kind: eventTypes.formation_change,
              minute: 0,
              athlete_id: null,
              absolute_minute: 0,
            },
            {
              kind: eventTypes.formation_position_view_change,
              minute: 0,
              athlete_id: 1,
              absolute_minute: 0,
            },
          ],
        }),
      });

      await user.click(screen.getByText('Line-ups'));
      await user.click(screen.getByText('Use saved line-up'));
      expect(
        await screen.findByText('Saved Line-up templates')
      ).toBeInTheDocument();
      await user.click(screen.getByText('Save'));
      expect(mockDispatch).not.toHaveBeenCalled();
      await user.click(screen.getByText('1st line up'));
      await user.click(screen.getByText('Save'));

      expect(mockDispatch).toHaveBeenCalledWith({
        payload: {
          id: 1,
          name: '11v11',
          number_of_players: 11,
        },
        type: 'pitchView/setSelectedGameFormat',
      });
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: {
          id: 1,
          name: '5-4-1',
          number_of_players: 11,
        },
        type: 'pitchView/setSelectedFormation',
      });
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: {
          inFieldPlayers: {
            '1_1': mockPlayers[0],
            '2_2': mockPlayers[1],
          },
          players: [mockPlayers[2]],
        },
        type: 'pitchView/setTeam',
      });

      expect(mockDispatch).toHaveBeenCalledWith({
        payload: {
          '0_5': mockFormationCoordinate,
        },
        type: 'pitchView/setFormationCoordinates',
      });

      expect(mockDispatch).toHaveBeenCalledWith({
        payload: [
          {
            absolute_minute: 0,
            athlete_id: null,
            kind: eventTypes.formation_change,
            minute: 0,
            relation: { id: 1, name: '5-4-1', number_of_players: 11 },
          },
          {
            absolute_minute: 0,
            minute: 0,
            athlete_id: 1,
            kind: eventTypes.formation_position_view_change,
            relation: { id: 1 },
          },
          {
            absolute_minute: 0,
            minute: 0,
            athlete_id: 1,
            kind: eventTypes.position_change,
            relation: { id: 98 },
          },
          {
            absolute_minute: 0,
            minute: 0,
            athlete_id: 2,
            kind: eventTypes.formation_position_view_change,
            relation: { id: 1 },
          },
          {
            absolute_minute: 0,
            minute: 0,
            athlete_id: 2,
            kind: eventTypes.position_change,
            relation: { id: 98 },
          },
        ],
        type: 'gameActivities/setUnsavedGameActivities',
      });

      expect(
        screen.getByText('Line up applied with success.')
      ).toBeInTheDocument();
    });

    describe('last game lineup', () => {
      const mockLastGamePeriodsResult = [
        {
          id: 3,
          name: 'Period 1',
          duration: 90,
          additional_duration: null,
          order: 0,
          absolute_duration_start: 0,
          absolute_duration_end: 90,
        },
        {
          id: 4,
          name: 'Period 2',
          duration: 90,
          additional_duration: null,
          order: 1,
          absolute_duration_start: 90,
          absolute_duration_end: 180,
        },
        {
          id: 5,
          name: 'Period 2',
          duration: 90,
          additional_duration: null,
          order: 2,
          absolute_duration_start: 180,
          absolute_duration_end: 270,
        },
      ];
      const mockApiGameActivitiesResult = [
        {
          kind: eventTypes.formation_change,
          minute: 0,
          athlete_id: null,
          absolute_minute: 0,
          relation: {
            id: 1,
          },
        },
        {
          kind: eventTypes.formation_position_view_change,
          minute: 0,
          athlete_id: 3,
          absolute_minute: 0,
          relation: { id: 1 },
        },
        {
          kind: eventTypes.position_change,
          minute: 0,
          athlete_id: 3,
          absolute_minute: 0,
        },
      ];

      const mockActivities = [
        {
          kind: eventTypes.formation_change,
          minute: 0,
          athlete_id: null,
          absolute_minute: 0,
        },
        {
          kind: eventTypes.formation_position_view_change,
          minute: 0,
          athlete_id: 1,
          absolute_minute: 0,
        },
        {
          kind: eventTypes.position_change,
          minute: 0,
          athlete_id: 1,
          absolute_minute: 0,
        },
        {
          kind: eventTypes.formation_change,
          minute: 0,
          athlete_id: null,
          absolute_minute: 40,
        },
        {
          kind: eventTypes.formation_position_view_change,
          minute: 0,
          athlete_id: 1,
          absolute_minute: 40,
        },
        {
          kind: eventTypes.position_change,
          minute: 0,
          athlete_id: 1,
          absolute_minute: 40,
        },
        {
          kind: eventTypes.captain_assigned,
          absolute_minute: 0,
          athlete_id: 2553,
        },
      ];

      it('should apply last game line up', async () => {
        server.use(
          rest.get('/planning_hub/events/1/last_game', (req, res, ctx) =>
            res(
              ctx.json({
                id: 1,
                game_periods: mockLastGamePeriodsResult,
              })
            )
          ),
          rest.get(
            '/ui/planning_hub/formation_position_views?field_id=1&formation_id=1',
            (req, res, ctx) => res(ctx.json([mockFormationCoordinate]))
          ),
          rest.get(
            '/ui/planning_hub/events/1/game_periods/3/v2/game_activities',
            (req, res, ctx) => res(ctx.json(mockApiGameActivitiesResult))
          )
        );

        const user = userEvent.setup();
        renderTestComponent({
          props: {
            ...defaultProps,
            currentPeriod: {
              id: 1,
              name: 'Period 1',
              duration: 40,
              absolute_duration_start: 0,
              absolute_duration_end: 40,
            },
          },
          store: getStoreWithCustomState({
            customGameActivities: mockActivities,
          }),
        });

        await user.click(screen.getByText('Line-ups'));
        await user.click(screen.getByText('Copy from last fixture'));
        expect(screen.getByText('You have unsaved data!')).toBeInTheDocument();
        expect(
          screen.getByText(
            'All previous events added to the selected period will be deleted.'
          )
        ).toBeInTheDocument();
        await user.click(screen.getByText('Confirm'));

        expect(mockDispatch).toHaveBeenCalledWith({
          payload: {
            id: 1,
            name: '11v11',
            number_of_players: 11,
          },
          type: 'pitchView/setSelectedGameFormat',
        });
        expect(mockDispatch).toHaveBeenCalledWith({
          payload: {
            id: 1,
            name: '5-4-1',
            number_of_players: 11,
          },
          type: 'pitchView/setSelectedFormation',
        });
        expect(mockDispatch).toHaveBeenCalledWith({
          payload: {
            inFieldPlayers: {},
            players: [mockPlayers[0], mockPlayers[1], mockPlayers[2]],
          },
          type: 'pitchView/setTeam',
        });

        expect(mockDispatch).toHaveBeenCalledWith({
          payload: {
            '0_5': mockFormationCoordinate,
          },
          type: 'pitchView/setFormationCoordinates',
        });

        expect(mockDispatch).toHaveBeenCalledWith({
          payload: [
            {
              absolute_minute: 40,
              athlete_id: null,
              kind: eventTypes.formation_change,
              minute: 0,
            },
            {
              absolute_minute: 40,
              athlete_id: 1,
              kind: eventTypes.formation_position_view_change,
              minute: 0,
            },
            {
              absolute_minute: 40,
              athlete_id: 1,
              kind: eventTypes.position_change,
              minute: 0,
            },
            {
              absolute_minute: 0,
              athlete_id: 2553,
              kind: eventTypes.captain_assigned,
            },
            {
              absolute_minute: 0,
              athlete_id: null,
              kind: eventTypes.formation_change,
              minute: 0,
              relation: { id: 1 },
            },
            {
              absolute_minute: 0,
              athlete_id: 3,
              kind: eventTypes.formation_position_view_change,
              relation: { id: 1 },
            },
            {
              absolute_minute: 0,
              athlete_id: 3,
              kind: eventTypes.position_change,
            },
          ],
          type: 'gameActivities/setUnsavedGameActivities',
        });

        expect(
          screen.getByText('Last fixture line up copied with success.')
        ).toBeInTheDocument();
      });

      it('shows info toast when last game line up is empty', async () => {
        server.use(
          rest.get('/planning_hub/events/1/last_game', (req, res, ctx) =>
            res(ctx.status(404))
          ),
          rest.get(
            '/ui/planning_hub/formation_position_views?field_id=1&formation_id=1',
            (req, res, ctx) => res(ctx.json([mockFormationCoordinate]))
          ),
          rest.get(
            '/ui/planning_hub/events/1/game_periods/3/v2/game_activities',
            (req, res, ctx) => res(ctx.json(mockApiGameActivitiesResult))
          )
        );

        const user = userEvent.setup();
        renderTestComponent({
          store: getStoreWithCustomState({
            customGameActivities: mockActivities,
          }),
        });

        await user.click(screen.getByText('Line-ups'));
        await user.click(screen.getByText('Copy from last fixture'));

        expect(mockDispatch).not.toHaveBeenCalled();

        await waitFor(() => {
          expect(
            screen.getByText('Last fixture line up is empty.')
          ).toBeInTheDocument();
        });
      });
    });
  });

  describe('Match day flow render', () => {
    it('[preference league_game_team]renders the substitute players title when the field is full', async () => {
      renderTestComponent({
        props: {
          ...defaultProps,
          isImportedGame: true,
        },
        store: getStoreWithCustomState({
          customPitchViewState: {
            ...defaultStore.pitchView,
            team: { inFieldPlayers: { '1_1': { id: 1 } }, players: [] },
            selectedFormation: { id: 1, number_of_players: 1 },
          },
        }),
        leaguePreferences: { league_game_team: true },
      });

      expect(screen.getByText('Substitutes')).toBeInTheDocument();
    });

    it('[preference league_game_team] renders the missing captain banner when the field is full with no captain', async () => {
      renderTestComponent({
        props: {
          ...defaultProps,
          isImportedGame: true,
          isCaptainEnabled: true,
        },
        store: getStoreWithCustomState({
          customGameActivities: [
            { kind: eventTypes.captain_assigned, athlete_id: 1 },
            {
              kind: eventTypes.formation_position_view_change,
              athlete_id: 1,
              relation: { id: 4 },
              absolute_minute: 0,
            },
          ],
          customPitchViewState: {
            ...defaultStore.pitchView,
            team: { inFieldPlayers: { '1_1': { id: 1 } }, players: [] },
            selectedFormation: { id: 1, number_of_players: 1 },
          },
        }),
        leaguePreferences: { league_game_team: true },
      });

      expect(
        screen.getByText('Add the captain to the starting 1.')
      ).toBeInTheDocument();
    });

    it('[preference league_game_team] does not render the missing captain banner when the isCaptainEnabled prop is false', async () => {
      renderTestComponent({
        props: {
          ...defaultProps,
          isImportedGame: true,
          isCaptainEnabled: false,
        },
        store: getStoreWithCustomState({
          customGameActivities: [
            { kind: eventTypes.captain_assigned, athlete_id: 1 },
            {
              kind: eventTypes.formation_position_view_change,
              athlete_id: 1,
              relation: { id: 4 },
              absolute_minute: 0,
            },
          ],
          customPitchViewState: {
            ...defaultStore.pitchView,
            team: { inFieldPlayers: { '1_1': { id: 1 } }, players: [] },
            selectedFormation: { id: 1, number_of_players: 1 },
          },
        }),
        leaguePreferences: { league_game_team: true },
      });

      expect(
        screen.queryByText('Add the captain to the starting 1.')
      ).not.toBeInTheDocument();
    });
  });
});
