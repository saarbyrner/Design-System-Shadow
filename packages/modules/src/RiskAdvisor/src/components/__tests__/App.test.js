import { render, screen } from '@testing-library/react';

import injuryVariablesDummyData from '@kitman/modules/src/RiskAdvisor/resources/injuryVariablesDummyData';
import {
  summaryBarDummyData,
  valueVisualisationDummyData,
} from '@kitman/modules/src/RiskAdvisor/resources/graphDummyData';

import App from '../App';

// Mock jQuery for AJAX calls with jQuery-style promise API
jest.mock('jquery', () => ({
  ajax: jest.fn().mockReturnValue({
    done: jest.fn((callback) => {
      callback({ sources: { source1: 'Source 1', source2: 'Source 2' } });
      return { fail: jest.fn() };
    }),
    fail: jest.fn(),
  }),
}));

// Mock TabBar component to avoid bootstrap-select issues
jest.mock('@kitman/components', () => ({
  TabBar: function MockTabBar({ tabPanes }) {
    return (
      <div role="tablist">
        {tabPanes.map((pane) => (
          <div key={pane.title}>
            <div role="tab">{pane.title}</div>
            <div role="tabpanel">{pane.content}</div>
          </div>
        ))}
      </div>
    );
  },
}));

// Mock the container components since they require specific Redux state structure
jest.mock('../../containers/RenameVariableModal', () => {
  return function MockRenameVariableModal() {
    return <div data-testid="rename-variable-modal" />;
  };
});

jest.mock('../../containers/AppStatus', () => {
  return function MockAppStatus() {
    return <div data-testid="app-status" />;
  };
});

jest.mock('../../containers/GenerateMetricStatus', () => {
  return function MockGenerateMetricStatus() {
    return <div data-testid="generate-metric-status" />;
  };
});

jest.mock('../../containers/Toast', () => {
  return function MockToast() {
    return <div data-testid="toast" />;
  };
});

jest.mock('../../containers/DataSourcePanel', () => {
  return function MockDataSourcePanel() {
    return <div data-testid="data-source-panel" />;
  };
});

// Mock the injury risk metrics tab component
jest.mock('../injuryRiskMetricsTab', () => ({
  InjuryRiskMetricsTabTranslated: function MockInjuryRiskMetricsTab() {
    return <div data-testid="injury-risk-metrics-tab" />;
  },
}));

describe('Risk Advisor <App /> component', () => {
  const mockProps = {
    turnaroundList: ['turnaround1', 'turnaround2'],
    allVariables: [...injuryVariablesDummyData],
    currentVariable: { ...injuryVariablesDummyData[0] },
    graphData: {
      summary: summaryBarDummyData,
      value: valueVisualisationDummyData,
    },
    canCreateMetric: true,
    canViewMetrics: true,
    onSelectInjuryVariable: jest.fn(),
    onAddNewInjuryVariable: jest.fn(),
    onCancelEditInjuryVariable: jest.fn(),
    onSaveVariable: jest.fn(),
    buildVariableGraphs: jest.fn(),
    t: (key) => key,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders', () => {
    render(<App {...mockProps} />);

    expect(screen.getByText('Injury risk metrics')).toBeInTheDocument();
  });

  it('renders a tabBar', () => {
    render(<App {...mockProps} />);

    // The TabBar is rendered with tabPanes prop containing our tab
    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });

  it('renders the injury risk metrics tab', () => {
    render(<App {...mockProps} />);

    expect(screen.getByText('Injury risk metrics')).toBeInTheDocument();
  });
});
