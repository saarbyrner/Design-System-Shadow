import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import GraphLinksModalContainer from '../GraphLinksModal';

const mockDispatch = jest.fn();

const defaultState = {
  dashboard: {
    activeDashboard: {
      id: '3',
    },
    widgets: [],
  },
  dashboardApi: {},
  graphLinksModal: {
    open: true,
    graphId: null,
    graphLinks: [],
    status: null,
  },
  staticData: {},
  dashboardList: [
    {
      id: '3',
      name: 'Dashboard 3',
    },
    {
      id: '4',
      name: 'Dashboard 4',
    },
  ],
};

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: mockDispatch,
  getState: () => ({ ...state }),
});

const renderComponent = (state = defaultState) =>
  render(
    <I18nextProvider i18n={i18n}>
      <Provider store={storeFake(state)}>
        <GraphLinksModalContainer />
      </Provider>
    </I18nextProvider>
  );

describe('GraphLinksModal Container', () => {
  beforeEach(() => {
    mockDispatch.mockClear();
  });

  it('renders modal with correct elements', () => {
    renderComponent();

    expect(screen.getByText('Link to dashboard')).toBeInTheDocument();
    expect(
      screen.getByText('Create contextual links between graphs and dashboards')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('shows correct dashboard list filtering out active dashboard', () => {
    renderComponent();

    const addButtons = screen
      .getAllByRole('button')
      .filter((btn) => btn.classList.contains('icon-add'));

    expect(addButtons.length).toBe(1);
  });

  it('renders with graph links when provided', () => {
    const stateWithLinks = {
      ...defaultState,
      graphLinksModal: {
        ...defaultState.graphLinksModal,
        graphLinks: [
          {
            dashboardId: null,
            metrics: [],
          },
        ],
      },
    };
    renderComponent(stateWithLinks);

    expect(screen.getByText('Select linked dashboard')).toBeInTheDocument();
  });

  it('shows metrics when graphId is set', () => {
    const stateWithGraph = {
      ...defaultState,
      dashboard: {
        ...defaultState.dashboard,
        widgets: [
          {
            id: 122,
            widget_type: 'graph',
            widget: {},
            widget_render: {
              id: '3',
              metrics: [
                {
                  type: 'metric',
                  status: {
                    name: 'Metric 0',
                  },
                },
                {
                  type: 'metric',
                  status: {
                    name: 'Metric 1',
                  },
                },
              ],
            },
          },
        ],
      },
      graphLinksModal: {
        ...defaultState.graphLinksModal,
        graphId: '3',
      },
    };

    renderComponent(stateWithGraph);

    expect(screen.getByText('Select metric(s)')).toBeInTheDocument();
  });
});
