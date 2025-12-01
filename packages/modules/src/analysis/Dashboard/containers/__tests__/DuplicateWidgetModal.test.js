import { render } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import i18n from '@kitman/common/src/utils/i18n';
import DuplicateWidgetModalContainer from '../DuplicateWidgetModal';
import {
  useGetSquadDashboardsQuery,
  useGetActiveSquadQuery,
  useGetPermittedSquadsQuery,
} from '../../redux/services/dashboard';
import {
  changeSelectedDashboard,
  changeSelectedSquad,
  changeDuplicateWidgetName,
  closeDuplicateWidgetAppStatus,
  closeDuplicateWidgetModal,
} from '../../redux/actions/duplicateWidgetModal';

jest.mock('../../redux/services/dashboard', () => ({
  useGetSquadDashboardsQuery: jest.fn(),
  useGetActiveSquadQuery: jest.fn(),
  useGetPermittedSquadsQuery: jest.fn(),
}));

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

const defaultState = {
  duplicateWidgetModal: {
    selectedDashboard: { id: 123, name: 'Test 123' },
    selectedSquad: { id: 246, name: 'Test Squad 246' },
    isNameEditable: false,
    isOpen: true,
    widgetId: 1234,
    widgetName: '',
    widgetType: 'Profile',
    activeDashboard: { id: 123, name: 'Test 123' },
    status: null,
  },
  dashboardApi: {
    queries: {},
    mutations: {},
    provided: {},
    subscriptions: {},
    config: {
      online: true,
      focused: true,
      middlewareRegistered: true,
      refetchOnFocus: false,
      refetchOnReconnect: false,
      refetchOnMountOrArgChange: false,
      keepUnusedDataFor: 60,
      reducerPath: 'dashboardApi',
    },
  },
};

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: mockDispatch,
  getState: () => state,
});

const renderComponent = (props = {}, state = defaultState) => {
  const containerProps = {
    dashboard: { id: 123, name: 'Test 123' },
    dashboardList: [
      { id: 1, name: 'Test' },
      { id: 123, name: 'Test 123' },
    ],
    ...props,
  };

  return render(
    <I18nextProvider i18n={i18n}>
      <Provider store={storeFake(state)}>
        <DuplicateWidgetModalContainer {...containerProps} />
      </Provider>
    </I18nextProvider>
  );
};

describe('DuplicateWidgetModal Container', () => {
  beforeEach(() => {
    useGetActiveSquadQuery.mockReturnValue({
      data: { id: 246, name: 'Test Squad 246' },
    });
    useGetPermittedSquadsQuery.mockReturnValue({
      data: [
        { id: 1, name: 'Squad 1' },
        { id: 246, name: 'Test Squad 246' },
      ],
      isLoading: false,
      isFetching: false,
      isSuccess: true,
    });
    useGetSquadDashboardsQuery.mockReturnValue({
      data: [
        { id: 1, name: 'Test' },
        { id: 123, name: 'Test 123' },
      ],
      isLoading: false,
      isFetching: false,
      isSuccess: true,
    });
  });

  afterEach(() => {
    mockDispatch.mockClear();
    jest.clearAllMocks();
  });

  it('dispatches the correct action when onClickCloseAppStatus is called', () => {
    renderComponent();

    const expectedAction = {
      type: 'CLOSE_DUPLICATE_WIDGET_APP_STATUS',
    };

    const action = closeDuplicateWidgetAppStatus();
    expect(action).toStrictEqual(expectedAction);
  });

  it('dispatches the correct action when onClickCloseModal is called', () => {
    renderComponent();

    const expectedAction = {
      type: 'CLOSE_DUPLICATE_WIDGET_MODAL',
      payload: {
        activeDashboard: { id: 123, name: 'Test 123' },
      },
    };

    const action = closeDuplicateWidgetModal({ id: 123, name: 'Test 123' });
    expect(action).toStrictEqual(expectedAction);
  });

  it('dispatches the correct action when onChangeDuplicateWidgetName is called', () => {
    renderComponent();

    const expectedAction = {
      type: 'CHANGE_DUPLICATE_WIDGET_NAME',
      payload: {
        widgetName: 'Test Widget Copy',
      },
    };

    const action = changeDuplicateWidgetName('Test Widget Copy');
    expect(action).toStrictEqual(expectedAction);
  });

  it('dispatches the correct action when onChangeSelectedDashboard is called', () => {
    renderComponent();

    const expectedAction = {
      type: 'CHANGE_SELECTED_DASHBOARD',
      payload: {
        selectedDashboard: { id: 1, name: 'Test' },
      },
    };

    const action = changeSelectedDashboard({ id: 1, name: 'Test' });
    expect(action).toStrictEqual(expectedAction);
  });

  it('dispatches the correct action when onChangeSelectedSquad is called', () => {
    renderComponent();

    const expectedAction = {
      type: 'CHANGE_SELECTED_SQUAD',
      payload: {
        selectedSquad: { id: 1, name: 'Test' },
      },
    };

    const action = changeSelectedSquad({ id: 1, name: 'Test' });
    expect(action).toStrictEqual(expectedAction);
  });
});
