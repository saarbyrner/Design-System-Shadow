import * as redux from 'react-redux';
import { Provider } from 'react-redux';
import selectEvent from 'react-select-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { eventTypes } from '@kitman/common/src/consts/gameEventConsts';
import { data as formsCoordData } from '@kitman/services/src/mocks/handlers/planningEvent/getFormationPositionsCoordinates';

import { mockOrderedPlayerData } from '../../GameEventsTab/__tests__/mockTestSquadData';
import FormationSelector from '..';

describe('FormationSelector', () => {
  const storeFake = (state) => ({
    default: () => {},
    subscribe: () => {},
    dispatch: () => {},
    getState: () => ({ ...state }),
  });

  const mockPlayers = [...mockOrderedPlayerData];

  const mockPeriod = {
    id: 1,
    absolute_duration_start: 0,
    absolute_duration_end: 90,
  };

  const defaultProps = {
    formations: [
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
    ],
    gameFormats: [
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
    ],
    currentPeriod: mockPeriod,
    hasPeriodStarted: false,
    isLastPeriodSelected: false,
    t: i18nextTranslateStub(),
  };

  const defaultStore = {
    planningEvent: {
      gameActivities: { localGameActivities: [] },
      pitchView: {
        selectedGameFormat: {
          id: 1,
          number_of_players: 11,
        },
        selectedFormation: {
          id: 1,
          name: '5-3-2',
          number_of_players: 11,
        },
        field: {
          cellSize: 50,
        },
        team: {
          inFieldPlayers: { '1_1': mockPlayers[0] },
          players: [mockPlayers[1], mockPlayers[2]],
        },
        pitchActivities: [],
      },
    },
  };

  const mockGameActivitiesToClear = [
    {
      kind: eventTypes.formation_complete,
      absolute_minute: 0,
      relation: { id: 1 },
    },
    { kind: eventTypes.goal, absolute_minute: 0, athlete_id: 1111 },
  ];

  const getMockedActivityStore = (allActivities) => ({
    planningEvent: {
      ...defaultStore.planningEvent,
      gameActivities: { localGameActivities: allActivities },
    },
  });

  const renderTestComponent = ({
    props = defaultProps,
    store = defaultStore,
  }) =>
    render(
      <Provider store={storeFake(store)}>
        <FormationSelector {...props} />
      </Provider>
    );

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

  it('renders FormationSelector component', async () => {
    renderTestComponent({ props: defaultProps });
    expect(screen.getByLabelText('Format')).toBeInTheDocument();
    expect(screen.queryByLabelText('Formation')).toBeInTheDocument();
    expect(screen.getByText('Clear')).toBeInTheDocument();
  });

  it('displays confirmation modal when changing game format', async () => {
    const user = userEvent.setup();
    renderTestComponent({ props: defaultProps });
    const wrapper = screen.getByTestId('GameFormatSelect');

    selectEvent.openMenu(wrapper.querySelector('.kitmanReactSelect input'));

    await selectEvent.select(
      wrapper.querySelector('.kitmanReactSelect'),
      '8v8'
    );

    expect(screen.getByText('Change game format to 8v8')).toBeInTheDocument();

    await user.click(screen.getByText('Change game format to 8v8'));

    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        '1_3': formsCoordData[0],
        '2_4': formsCoordData[1],
      },
      type: 'pitchView/setFormationCoordinates',
    });
  });

  it('renders the clear starting lineup modal', async () => {
    const user = userEvent.setup();
    renderTestComponent({ props: defaultProps });

    // show prompt modal
    await user.click(screen.getByText('Clear'));

    const promptText = screen.getByText(
      'Are you sure you want to clear the starting lineup from this period?'
    );
    expect(promptText).toBeInTheDocument();

    expect(screen.getByText('Confirm')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();

    await user.click(screen.getByText('Cancel'));
    // close prompt modal
    expect(promptText).not.toBeInTheDocument();
  });

  describe('Period Has Started', () => {
    it('allows the user to click edit lineup with a local formation complete', async () => {
      const user = userEvent.setup();
      renderTestComponent({
        props: { ...defaultProps, hasPeriodStarted: true },
        store: getMockedActivityStore([mockGameActivitiesToClear[0]]),
      });

      await user.click(screen.getByText('Edit lineup'));

      expect(mockDispatch).toHaveBeenCalledWith({
        payload: [],
        type: 'gameActivities/setUnsavedGameActivities',
      });
    });

    it('allows the user to click edit lineup with a saved formation complete', async () => {
      const user = userEvent.setup();
      renderTestComponent({
        props: { ...defaultProps, hasPeriodStarted: true },
        store: getMockedActivityStore([
          { ...mockGameActivitiesToClear[0], id: 1 },
        ]),
      });

      await user.click(screen.getByText('Edit lineup'));

      expect(mockDispatch).toHaveBeenCalledWith({
        payload: [{ ...mockGameActivitiesToClear[0], id: 1, delete: true }],
        type: 'gameActivities/setUnsavedGameActivities',
      });
    });
  });
});
