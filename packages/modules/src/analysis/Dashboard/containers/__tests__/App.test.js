import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import * as reactRedux from 'react-redux';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import * as dashboardActions from '../../redux/actions/dashboard';
import * as widgetsActions from '../../redux/actions/widgets';
import AppContainer from '../App';

jest.mock('../../redux/actions/widgets', () => ({
  ...jest.requireActual('../../redux/actions/widgets'),
  deleteWidget: jest.fn(),
  fetchWidgets: jest.fn(),
}));

jest.mock('../../redux/actions/dashboard', () => ({
  ...jest.requireActual('../../redux/actions/dashboard'),
  setCodingSystemKey: jest.fn(),
  openGraphLinksModal: jest.fn(),
  openDuplicateDashboardModal: jest.fn(),
  openTableWidgetModal: jest.fn(),
  closeReorderModal: jest.fn(),
  toggleSlidingPanel: jest.fn(),
}));

jest.mock('@kitman/common/src/contexts/OrganisationContext', () => ({
  ...jest.requireActual('@kitman/common/src/contexts/OrganisationContext'),
  useOrganisation: jest.fn(),
}));

jest.mock('../../components/App', () => ({
  AppTranslated: (props) => (
    <div data-testid="app-component">
      <div data-testid="app-component-content">App Component</div>
      <button
        type="button"
        onClick={props.fetchAllWidgets}
        data-testid="fetch-widgets-button"
      />
      <button
        type="button"
        onClick={props.onClickOpenReorderModal}
        data-testid="open-reorder-modal-button"
      />
      <button
        type="button"
        onClick={() =>
          props.onClickOpenGraphLinksModal({ id: 1, linked_graph_id: 3 })
        }
        data-testid="open-graph-links-modal-button"
      />
      <button
        type="button"
        onClick={() =>
          props.onClickOpenDuplicateDashboardModal('Test Dashboard')
        }
        data-testid="open-duplicate-dashboard-modal-button"
      />
      <button
        type="button"
        onClick={props.onClickOpenTableWidgetModal}
        data-testid="open-table-widget-modal-button"
      />
      <button
        type="button"
        onClick={props.onCloseReorderModal}
        data-testid="close-reorder-modal-button"
      />
      <button
        type="button"
        onClick={props.toggleSlidingPanel}
        data-testid="toggle-sliding-panel-button"
      />
    </div>
  ),
}));

describe('<AppContainer />', () => {
  let mockDispatch;
  const preloadedState = {
    dashboard: {
      widgets: [],
      status: 'idle',
      appStatusText: 'Ready',
      dashboardLayout: [],
      isReorderModalOpen: false,
      isSlidingPanelOpen: false,
      activeDashboard: {
        id: 1,
        name: 'Test Dashboard',
      },
      appliedSquadAthletes: [],
      appliedDateRange: {},
      appliedTimePeriod: 'season',
      appliedTimePeriodLength: null,
    },
    staticData: {
      canManageDashboard: true,
      canViewNotes: true,
      hasDevelopmentGoalsModule: false,
      canSeeHiddenVariables: false,
      canViewMetrics: true,
      containerType: 'dashboard',
    },
    dashboardList: [],
    printBuilder: {
      isOpen: false,
    },
    chartBuilder: {
      activeWidgets: [],
    },
    headerWidgetModal: {
      open: false,
    },
    profileWidgetModal: {
      open: false,
    },
  };

  const defaultProps = {
    locale: 'en',
  };

  beforeEach(() => {
    mockDispatch = jest.fn();
    jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(mockDispatch);

    useOrganisation.mockReturnValue({
      organisation: {
        coding_system_key: 'test_coding_system',
      },
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the App component', () => {
    renderWithRedux(<AppContainer {...defaultProps} />, {
      preloadedState,
      useGlobalStore: false,
    });

    expect(screen.getByTestId('app-component')).toBeInTheDocument();
  });

  it('dispatches setCodingSystemKey action on mount', () => {
    renderWithRedux(<AppContainer {...defaultProps} />, {
      preloadedState,
      useGlobalStore: false,
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      dashboardActions.setCodingSystemKey('test_coding_system')
    );
  });

  it('dispatches setCodingSystemKey with correct coding system key', () => {
    useOrganisation.mockReturnValue({
      organisation: {
        coding_system_key: 'coding_system_123',
      },
    });

    renderWithRedux(<AppContainer {...defaultProps} />, {
      preloadedState,
      useGlobalStore: false,
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      dashboardActions.setCodingSystemKey('coding_system_123')
    );
  });

  it('updates coding system key when organisation coding system key changes', () => {
    const { rerender } = renderWithRedux(<AppContainer {...defaultProps} />, {
      preloadedState,
      useGlobalStore: false,
    });

    useOrganisation.mockReturnValue({
      organisation: {
        coding_system_key: 'new_coding_system',
      },
    });

    rerender(<AppContainer {...defaultProps} />);

    expect(mockDispatch).toHaveBeenCalledWith(
      dashboardActions.setCodingSystemKey('new_coding_system')
    );
  });

  it('does not dispatch setCodingSystemKey when coding system key remains the same', () => {
    const { rerender } = renderWithRedux(<AppContainer {...defaultProps} />, {
      preloadedState,
      useGlobalStore: false,
    });

    mockDispatch.mockClear();

    useOrganisation.mockReturnValue({
      organisation: {
        coding_system_key: 'test_coding_system',
      },
    });

    rerender(<AppContainer {...defaultProps} />);

    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('passes correct props from Redux state to App component', () => {
    const customState = {
      ...preloadedState,
      dashboard: {
        ...preloadedState.dashboard,
        status: 'loading',
        appStatusText: 'Loading...',
        widgets: [
          {
            id: 1,
            name: 'Test Widget',
            type: 'graph',
          },
        ],
      },
      staticData: {
        ...preloadedState.staticData,
        canManageDashboard: false,
        canViewNotes: false,
      },
    };

    renderWithRedux(<AppContainer {...defaultProps} />, {
      preloadedState: customState,
      useGlobalStore: false,
    });

    expect(screen.getByTestId('app-component')).toBeInTheDocument();
  });

  describe('Action Dispatching', () => {
    beforeEach(() => {
      mockDispatch.mockClear();
    });

    it('dispatches fetchWidgets when fetchAllWidgets is called', async () => {
      const user = userEvent.setup();

      renderWithRedux(<AppContainer {...defaultProps} />, {
        preloadedState,
        useGlobalStore: false,
      });

      const fetchButton = screen.getByTestId('fetch-widgets-button');
      await user.click(fetchButton);

      expect(mockDispatch).toHaveBeenCalledWith(widgetsActions.fetchWidgets());
    });

    it('dispatches multiple modal close actions when onClickOpenReorderModal is called', async () => {
      const user = userEvent.setup();

      renderWithRedux(<AppContainer {...defaultProps} />, {
        preloadedState,
        useGlobalStore: false,
      });

      const reorderButton = screen.getByTestId('open-reorder-modal-button');
      await user.click(reorderButton);

      expect(mockDispatch).toHaveBeenCalledTimes(7);
    });

    it('dispatches openGraphLinksModal when onClickOpenGraphLinksModal is called', async () => {
      const user = userEvent.setup();

      renderWithRedux(<AppContainer {...defaultProps} />, {
        preloadedState,
        useGlobalStore: false,
      });

      const graphLinksButton = screen.getByTestId(
        'open-graph-links-modal-button'
      );
      await user.click(graphLinksButton);

      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'OPEN_GRAPH_LINKS_MODAL',
          payload: {
            graphData: {
              id: 1,
              linked_graph_id: 3,
            },
          },
        })
      );
    });

    it('dispatches openDuplicateDashboardModal when onClickOpenDuplicateDashboardModal is called', async () => {
      const user = userEvent.setup();

      renderWithRedux(<AppContainer {...defaultProps} />, {
        preloadedState,
        useGlobalStore: false,
      });

      const duplicateDashboardButton = screen.getByTestId(
        'open-duplicate-dashboard-modal-button'
      );
      await user.click(duplicateDashboardButton);

      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'OPEN_DUPLICATE_DASHBOARD_MODAL',
          payload: {
            dashboardName: 'Test Dashboard copy',
          },
        })
      );
    });

    it('dispatches openTableWidgetModal when onClickOpenTableWidgetModal is called', async () => {
      const user = userEvent.setup();

      renderWithRedux(<AppContainer {...defaultProps} />, {
        preloadedState,
        useGlobalStore: false,
      });

      const tableWidgetButton = screen.getByTestId(
        'open-table-widget-modal-button'
      );
      await user.click(tableWidgetButton);

      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'OPEN_TABLE_WIDGET_MODAL',
        })
      );
    });

    it('dispatches closeReorderModal when onCloseReorderModal is called', async () => {
      const user = userEvent.setup();

      renderWithRedux(<AppContainer {...defaultProps} />, {
        preloadedState,
        useGlobalStore: false,
      });

      const closeReorderButton = screen.getByTestId(
        'close-reorder-modal-button'
      );
      await user.click(closeReorderButton);

      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'CLOSE_REORDER_MODAL',
        })
      );
    });

    it('dispatches toggleSlidingPanel when toggleSlidingPanel is called', async () => {
      const user = userEvent.setup();

      renderWithRedux(<AppContainer {...defaultProps} />, {
        preloadedState,
        useGlobalStore: false,
      });

      const togglePanelButton = screen.getByTestId(
        'toggle-sliding-panel-button'
      );
      await user.click(togglePanelButton);

      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'TOGGLE_SLIDING_PANEL',
        })
      );
    });
  });
});
