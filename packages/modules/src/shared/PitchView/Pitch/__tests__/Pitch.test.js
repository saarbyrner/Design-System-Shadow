import { Provider } from 'react-redux';
import * as redux from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n from '@kitman/common/src/utils/i18n';
import {
  pitchViewFormats,
  eventTypes,
} from '@kitman/common/src/consts/gameEventConsts';
import { data as formationCoordinates } from '@kitman/services/src/mocks/handlers/planningEvent/getFormationPositionsCoordinates';

import Pitch from '../index';

describe('Pitch', () => {
  const storeFake = (state) => ({
    default: () => {},
    subscribe: () => {},
    dispatch: () => {},
    getState: () => ({ ...state }),
  });

  const mockPlayer = {
    id: 33925,
    shortname: 'McClune',
    user_id: 38187,
    avatar_url: 'testImage.png',
    position: {
      groupOrder: 1,
      group: 'Forward',
      name: 'Loose-head Prop',
      order: 1,
      abbreviation: 'LP',
    },
    number: 4,
  };

  const defaultProps = {
    sport: 'soccer',
    pitchFormat: pitchViewFormats.gameEvents,
    hasPeriodStarted: true,
    periodStartTime: 0,
    selectedFormationCoordinates: {
      '1_3': { ...formationCoordinates[0], position: { id: 2 } },
      '2_4': { ...formationCoordinates[1], position: { id: 3 } },
    },
    team: {
      inFieldPlayers: {
        '1_3': mockPlayer,
        '2_4': {
          id: 33000,
          shortname: 'Test Man',
          user_id: 38184,
          avatar_url: 'testImage.png',
          position: {
            groupOrder: 1,
            group: 'Forward',
            name: 'Loose-head Prop',
            order: 1,
            abbreviation: 'LP',
          },
          number: 5,
        },
      },
      players: [],
    },
    setTeam: jest.fn(),
    setSelectedEvent: jest.fn(),
    selectedSquadOrganisationId: 123,
  };

  const defaultStore = {
    planningEvent: {
      gameActivities: { localGameActivities: [] },
      pitchView: {
        activeEventSelection: eventTypes.goal,
        pitchActivities: [
          { kind: eventTypes.yellow, absolute_minute: 0, athlete_id: 33925 },
        ],
        field: {
          width: 100,
          height: 100,
          cellSize: 50,
          columns: 11,
          rows: 11,
        },
        selectedPitchPlayer: null,
      },
    },
  };

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

  const renderTestComponent = ({
    props = defaultProps,
    store = defaultStore,
  }) =>
    render(
      <Provider store={storeFake(store)}>
        <I18nextProvider i18n={i18n}>
          <Pitch {...props} />
        </I18nextProvider>
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
    jest.restoreAllMocks();
  });

  describe('initial render', () => {
    it('should render the pitch the correct content', async () => {
      renderTestComponent({ props: defaultProps });
      expect(screen.getByTestId('Pitch')).toBeInTheDocument();
      expect(screen.getByText('McClune')).toBeInTheDocument();
      expect(screen.getByText('Test Man')).toBeInTheDocument();
    });

    it('should set a goal event when a player position is clicked', async () => {
      const user = userEvent.setup();
      renderTestComponent({ props: defaultProps });
      await user.click(screen.getAllByRole('img')[0]);
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: [
          {
            absolute_minute: 0,
            minute: 0,
            athlete_id: 33925,
            kind: eventTypes.goal,
            relation: { id: null },
            organisation_id: 123,
          },
        ],
        type: 'gameActivities/setUnsavedGameActivities',
      });
    });

    it('should set a yellow and a red card when it is the second yellow card being added', async () => {
      const user = userEvent.setup();
      renderTestComponent({
        store: getStoreWithCustomState({
          customPitchViewState: {
            activeEventSelection: eventTypes.yellow,
          },
        }),
      });

      await user.click(screen.getAllByRole('img')[0]);
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: [
          {
            absolute_minute: 0,
            minute: 0,
            athlete_id: 33925,
            kind: eventTypes.yellow,
            relation: { id: null },
            organisation_id: 123,
          },
          {
            absolute_minute: 0,
            minute: 0,
            athlete_id: 33925,
            kind: eventTypes.red,
            relation: { id: null },
            organisation_id: 123,
          },
        ],
        type: 'gameActivities/setUnsavedGameActivities',
      });
      expect(defaultProps.setSelectedEvent).toHaveBeenCalledWith({
        absolute_minute: 0,
        minute: 0,
        activityIndex: 0,
        athlete_id: 33925,
        kind: eventTypes.yellow,
        relation: { id: null },
        organisation_id: 123,
      });
    });

    it('should set all the activities related to the multi activity event switch', async () => {
      const expectedResult = [
        {
          absolute_minute: 20,
          minute: 20,
          athlete_id: 33925,
          game_activities: [
            {
              absolute_minute: 20,
              minute: 20,
              athlete_id: 33925,
              kind: eventTypes.position_change,
              relation: { id: 3 },
            },
            {
              absolute_minute: 20,
              minute: 20,
              athlete_id: 33000,
              kind: eventTypes.position_change,
              relation: { id: 2 },
            },
            {
              absolute_minute: 20,
              minute: 20,
              athlete_id: 33925,
              kind: eventTypes.formation_position_view_change,
              relation: { id: 2 },
            },
            {
              absolute_minute: 20,
              minute: 20,
              athlete_id: 33000,
              kind: eventTypes.formation_position_view_change,
              relation: { id: 1 },
            },
          ],
          kind: eventTypes.switch,
          relation: { id: 33000 },
        },
      ];
      const user = userEvent.setup();
      renderTestComponent({
        store: getStoreWithCustomState({
          customPitchViewState: {
            activeEventSelection: eventTypes.switch,
            selectedPitchPlayer: {
              player: mockPlayer,
              positionData: { id: 1, position: { id: 2 } },
            },
            pitchActivities: [
              {
                kind: eventTypes.yellow,
                absolute_minute: 20,
                athlete_id: 33925,
              },
            ],
          },
        }),
      });

      await user.click(screen.getAllByRole('img')[2]);
      expect(defaultProps.setTeam).toHaveBeenCalledWith({
        inFieldPlayers: {
          '1_3': defaultProps.team.inFieldPlayers['2_4'],
          '2_4': mockPlayer,
        },
        players: [],
      });
      expect(defaultProps.setSelectedEvent).toHaveBeenCalledWith({
        ...expectedResult[0],
        activityIndex: 0,
      });
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: expectedResult,
        type: 'gameActivities/setUnsavedGameActivities',
      });
    });
  });

  describe('removing a player', () => {
    const playerActivities = [
      {
        athlete_id: 33925,
        kind: eventTypes.position_change,
        relation: { id: 2 },
        absolute_minute: 0,
      },
      {
        athlete_id: 33925,
        kind: eventTypes.formation_position_view_change,
        relation: { id: 1 },
        absolute_minute: 0,
      },
    ];

    const playerActivitiesWithId = [
      { ...playerActivities[0], id: 1 },
      { ...playerActivities[1], id: 2 },
    ];

    it('allows the user to remove a players local activities assignments within the pitch when the remove player button is clicked', async () => {
      renderTestComponent({
        props: { ...defaultProps, hasPeriodStarted: false },
        store: getStoreWithCustomState({
          customGameActivities: playerActivities,
          customPitchViewState: {
            pitchActivities: [],
          },
        }),
      });

      await userEvent.hover(screen.getAllByTestId('with-player-position')[0]);
      await userEvent.click(screen.getByTestId('avatar-remove-button'));
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: null,
        type: 'pitchView/setSelectedPitchPlayer',
      });
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: [],
        type: 'gameActivities/setUnsavedGameActivities',
      });
    });

    it('allows the user to remove a players saved activities assignments within the pitch when the remove player button is clicked', async () => {
      renderTestComponent({
        props: { ...defaultProps, hasPeriodStarted: false },
        store: getStoreWithCustomState({
          customGameActivities: playerActivitiesWithId,
          customPitchViewState: {
            pitchActivities: [],
          },
        }),
      });

      await userEvent.hover(screen.getAllByTestId('with-player-position')[0]);
      await userEvent.click(screen.getByTestId('avatar-remove-button'));
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: null,
        type: 'pitchView/setSelectedPitchPlayer',
      });
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: [
          {
            ...playerActivitiesWithId[0],
            delete: true,
          },
          {
            ...playerActivitiesWithId[1],
            delete: true,
          },
        ],
        type: 'gameActivities/setUnsavedGameActivities',
      });
    });

    it('allows a user to remove the players local activities assignments within the pitch when remove is clicked ignore previously marked to delete saved ones', async () => {
      renderTestComponent({
        props: { ...defaultProps, hasPeriodStarted: false },
        store: getStoreWithCustomState({
          customGameActivities: [
            { ...playerActivities[0], id: 1, delete: true },
            { ...playerActivities[1], id: 2, delete: true },
            ...playerActivities,
          ],
          customPitchViewState: {
            pitchActivities: [],
          },
        }),
      });

      await userEvent.hover(screen.getAllByTestId('with-player-position')[0]);
      await userEvent.click(screen.getByTestId('avatar-remove-button'));
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: null,
        type: 'pitchView/setSelectedPitchPlayer',
      });
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: [
          { ...playerActivities[0], id: 1, delete: true },
          { ...playerActivities[1], id: 2, delete: true },
        ],
        type: 'gameActivities/setUnsavedGameActivities',
      });
    });
  });
});
