import { screen } from '@testing-library/react';

import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import injuryVariablesDummyData from '@kitman/modules/src/RiskAdvisor/resources/injuryVariablesDummyData';
import { severityOptions as getSeverityOptions } from '@kitman/modules/src/RiskAdvisor/resources/filterOptions';

import App from '../App';

// Mock jQuery and bootstrap dependencies
jest.mock('jquery', () => {
  const mockJQuery = jest.fn().mockReturnValue({
    attr: jest.fn().mockReturnValue('mock-csrf-token'),
    data: jest.fn().mockReturnValue('UTC'),
  });
  mockJQuery.ajax = jest.fn().mockImplementation(() => ({
    done: (callback) => {
      callback({
        sources: {
          source1: 'Source 1',
          source2: 'Source 2',
        },
      });
      return { fail: () => {} };
    },
    fail: () => {},
  }));
  return mockJQuery;
});

// Mock bootstrap-select
jest.mock('bootstrap-select', () => {});

// Mock daterangepicker
jest.mock('daterangepicker', () => {});

// Mock components
jest.mock('@kitman/components', () => ({
  TabBar: ({ children }) => <div data-testid="tab-bar">{children}</div>,
  GroupedDropdown: ({ label }) => (
    <div data-testid="grouped-dropdown">{label}</div>
  ),
  TextButton: ({ text }) => (
    <button type="button" data-testid="text-button">
      {text}
    </button>
  ),
  IconButton: ({ icon }) => (
    <button type="button" data-testid="icon-button">
      {icon}
    </button>
  ),
  InfoTooltip: ({ content, children }) => (
    <div data-testid="info-tooltip">{children || content}</div>
  ),
}));

// Mock child container components
jest.mock('../RenameVariableModal', () => () => (
  <div data-testid="rename-variable-modal">Rename Variable Modal</div>
));
jest.mock('../AppStatus', () => () => (
  <div data-testid="app-status">App Status</div>
));
jest.mock('../GenerateMetricStatus', () => () => (
  <div data-testid="generate-metric-status">Generate Metric Status</div>
));
jest.mock('../Toast', () => () => <div data-testid="toast">Toast</div>);
jest.mock('../DataSourcePanel', () => () => (
  <div data-testid="data-source-panel">Data Source Panel</div>
));

describe('Risk Advisor App Container', () => {
  const ownProps = {
    turnaroundList: ['turnaround1', 'turnaround2'],
  };
  const severityOptions = getSeverityOptions();

  const mockState = {
    injuryVariableSettings: {
      allVariables: [...injuryVariablesDummyData],
      currentVariable: {
        id: null,
        name: '',
        date_range: {
          start_date: '2020-06-10T23:00:00Z',
          end_date: '2020-07-23T22:59:59Z',
        },
        filter: {
          position_group_ids: [],
          exposure_types: [],
          mechanisms: [],
          osics_body_area_ids: [],
          severity: [],
        },
        excluded_sources: [],
        excluded_variables: [],
        enabled_for_prediction: true,
        created_by: {
          id: null,
          fullname: null,
        },
        created_at: null,
        status: null,
      },
      staticData: {
        tsSart: '2020-06-10T23:00:00Z',
        tsEnd: '2020-07-23T22:59:59Z',
        quadOptions: [
          {
            id: 1,
            name: 'International Squad',
          },
          {
            id: 2,
            name: 'Test Squad',
          },
        ],
        bodyAreaOptions: [
          {
            name: 'Elbow',
            id: 1,
          },
          {
            name: 'Ankle',
            id: 2,
          },
        ],
        positionGroupOptions: [
          {
            id: 23,
            name: 'Forward',
          },
          {
            id: 24,
            name: 'Back',
          },
          {
            id: 40,
            name: 'Other',
          },
        ],
        severityOptions,
        canCreateMetric: true,
        canEditMetrics: true,
        canViewMetrics: true,
      },
      renameVariableModal: {
        isOpen: false,
        isTriggeredBySave: false,
      },
      dataSourcePanel: {
        isOpen: false,
      },
      toast: {
        statusItem: null,
      },
      graphData: {
        summary: null,
        value: null,
      },
      tcfGraphData: {
        isLoading: true,
        graphData: [],
      },
    },
    appStatus: {
      message: null,
      status: null,
    },
    generateMetricStatus: {
      status: null,
      message: null,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders', () => {
    renderWithRedux(<App {...ownProps} />, {
      useGlobalStore: false,
      preloadedState: mockState,
    });

    // Check that the main container is rendered
    expect(screen.getByTestId('tab-bar')).toBeInTheDocument();
    expect(screen.getByTestId('rename-variable-modal')).toBeInTheDocument();
    expect(screen.getByTestId('toast')).toBeInTheDocument();
    expect(screen.getByTestId('app-status')).toBeInTheDocument();
    expect(screen.getByTestId('generate-metric-status')).toBeInTheDocument();
    expect(screen.getByTestId('data-source-panel')).toBeInTheDocument();
  });
});
