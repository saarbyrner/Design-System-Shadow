import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import * as useEventTrackingModule from '@kitman/common/src/hooks/useEventTracking';
import { colors } from '@kitman/common/src/variables';
import { emptySquadAthletes } from '../../components/utils';
import HeaderWidgetModalContainer from '../HeaderWidgetModal';
import {
  useGetPermittedSquadsQuery,
  useGetSquadAthletesQuery,
} from '../../redux/services/dashboard';

jest.mock('../../redux/services/dashboard', () => ({
  useGetPermittedSquadsQuery: jest.fn(),
  useGetSquadAthletesQuery: jest.fn(),
}));

jest.mock('@kitman/common/src/hooks/useEventTracking');
jest.mock('../../containers/AthleteSelector', () => {
  return function MockAthleteSelector(props) {
    return (
      <div data-testid="HeaderWidgetModal|AthleteSelector">
        <button
          type="button"
          onClick={() =>
            props.onSelectSquadAthletes({ applies_to_squad: true })
          }
        >
          Change Population
        </button>
      </div>
    );
  };
});

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: jest.fn(),
}));

const { useSelector } = require('react-redux');

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: mockDispatch,
  getState: () => ({ ...state }),
});

const defaultState = {
  dashboard: {},
  dashboardApi: {},
  headerWidgetModal: {
    color: '#ffffff',
    name: 'Header',
    open: true,
    population: {
      ...emptySquadAthletes,
      squads: [],
    },
  },
  staticData: {},
};

const containerProps = {
  currentUser: 'Test User',
  orgLogo: '/test',
  orgName: 'Test Organisation',
  squadAthletes: {
    ...emptySquadAthletes,
    squads: [],
  },
  disabledSquadAthletes: {
    ...emptySquadAthletes,
    squads: [],
  },
  squadName: 'Squad 1',
  squads: [
    {
      id: 1,
      name: 'Squad 1',
    },
  ],
  t: (key) => key,
};

const renderComponent = (state = defaultState, props = {}) => {
  useSelector.mockImplementation((selector) => selector(state));

  return render(
    <I18nextProvider i18n={i18n}>
      <Provider store={storeFake(state)}>
        <HeaderWidgetModalContainer {...containerProps} {...props} />
      </Provider>
    </I18nextProvider>
  );
};

describe('HeaderWidgetModal Container', () => {
  const mockTrackEvent = jest.fn();
  beforeEach(() => {
    useEventTrackingModule.default.mockReturnValue({
      trackEvent: mockTrackEvent,
    });
    useGetSquadAthletesQuery.mockReturnValue({
      data: { position_groups: [] },
      isLoading: false,
      isFetching: false,
      isSuccess: true,
    });

    useGetPermittedSquadsQuery.mockReturnValue({
      data: [
        {
          id: 1,
          name: 'Squad 1',
        },
      ],
      isLoading: false,
      isFetching: false,
      isSuccess: true,
    });
  });

  afterEach(() => {
    mockDispatch.mockClear();
    useSelector.mockClear();
  });

  it('sets props correctly', () => {
    renderComponent();

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Change Population')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('dispatches the correct action when onClickCloseModal is called', async () => {
    const user = userEvent.setup();
    renderComponent();

    const closeButton = screen.getByRole('button', { name: '' });
    await user.click(closeButton);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'CLOSE_HEADER_WIDGET_MODAL',
    });
  });

  it('dispatches the correct action when onSetHeaderWidgetName is called', async () => {
    const user = userEvent.setup();
    renderComponent();

    const nameInput = screen.getByDisplayValue('Header');
    await user.clear(nameInput);
    await fireEvent.change(nameInput, { target: { value: 'Header Widget' } });

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'SET_HEADER_WIDGET_NAME',
        payload: expect.objectContaining({
          name: 'Header Widget',
        }),
      })
    );
  });

  it('dispatches the correct action when onSetHeaderWidgetPopulation is called', async () => {
    const user = userEvent.setup();
    renderComponent();

    const changePopulationButton = screen.getByText('Change Population');
    await user.click(changePopulationButton);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_HEADER_WIDGET_POPULATION',
      payload: {
        population: { applies_to_squad: true },
      },
    });
  });

  it('dispatches the correct action when onSetHeaderWidgetBackgroundColor is called', async () => {
    const customState = {
      ...defaultState,
      headerWidgetModal: {
        ...defaultState.headerWidgetModal,
        color: colors.s14,
      },
    };

    renderComponent(customState);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(customState.headerWidgetModal.color).toEqual(colors.s14);
  });
});
