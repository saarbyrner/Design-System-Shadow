import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import injuryVariablesDummyData from '@kitman/modules/src/RiskAdvisor/resources/injuryVariablesDummyData';
import {
  summaryBarDummyData,
  valueVisualisationDummyData,
} from '@kitman/modules/src/RiskAdvisor/resources/graphDummyData';

import { mockedTCFGraphDataResponse } from '../../topContributingFactors/resources/chartDummyData';
import VariableVisualisation from '../index';

// Mock child components that don't need to be tested
jest.mock(
  '@kitman/modules/src/analysis/shared/components/GraphWidget/SummaryBarGraph',
  () => {
    return jest.fn(() => (
      <div data-testid="summary-bar-graph">SummaryBarGraph</div>
    ));
  }
);

jest.mock(
  '@kitman/modules/src/analysis/shared/components/GraphWidget/ValueVisualisationGraph',
  () => ({
    ValueVisualisationGraphTranslated: jest.fn(() => (
      <div data-testid="value-visualisation-graph">ValueVisualisationGraph</div>
    )),
  })
);

jest.mock('../../topContributingFactors', () => ({
  TopContributingFactorsGraphTranslated: jest.fn(() => (
    <div data-testid="top-contributing-factors-graph">
      TopContributingFactorsGraph
    </div>
  )),
}));

// Mock utils
jest.mock('../../../utils', () => ({
  buildSummaryData: jest.fn((data) => data),
  buildValueData: jest.fn((data) => data),
}));

// Mock date formatter
jest.mock('@kitman/common/src/utils/dateFormatter', () => ({
  formatStandard: jest.fn(({ date }) => date.format('D MMM YYYY')),
}));

describe('Risk Advisor <VariableVisualisation /> component', () => {
  const mockProps = {
    variable: { ...injuryVariablesDummyData[0] },
    graphData: {
      isLoading: false,
      summary: summaryBarDummyData,
      value: valueVisualisationDummyData,
    },
    tcfGraphData: mockedTCFGraphDataResponse,
    isTcfGraphLoading: false,
    canCreateMetric: true,
    canEditMetrics: true,
    isVariablePresent: true,
    isVariableSaved: false,
    onAddNewInjuryVariable: jest.fn(),
    onOpenRenameVariableModal: jest.fn(),
    onUpdateVariable: jest.fn(),
    buildVariableGraphs: jest.fn(),
    onClickManualRun: jest.fn(),
    fetchTCFGraphData: jest.fn(),
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    // Mock ResizeObserver
    global.ResizeObserver = class MockedResizeObserver {
      constructor(cb) {
        setTimeout(() => {
          cb(
            [
              {
                contentRect: {
                  height: 600,
                  width: 800,
                },
              },
            ],
            this
          );
        }, 150);
      }

      observe = jest.fn();

      disconnect = jest.fn();
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    window.ResizeObserver = ResizeObserver;
  });

  it('renders', () => {
    render(<VariableVisualisation {...mockProps} />);
    expect(screen.getByText('Injury Metric 1')).toBeInTheDocument();
  });

  describe('when the user does not have the create metric permission', () => {
    it('disables the run data button', () => {
      const completedVariable = {
        ...mockProps.variable,
        status: 'completed',
      };
      render(
        <VariableVisualisation
          {...mockProps}
          canCreateMetric={false}
          variable={completedVariable}
        />
      );
      const button = screen.getByRole('button', { name: /run data/i });
      expect(button).toBeDisabled();
    });
  });

  describe('when the user does not have the edit metric permission', () => {
    it('disables the archive button', () => {
      const { container } = render(
        <VariableVisualisation {...mockProps} canEditMetrics={false} />
      );
      const archiveButton = container.querySelector('.icon-archive');
      expect(archiveButton).toBeDisabled();
    });

    it('disables the edit name button', () => {
      const { container } = render(
        <VariableVisualisation {...mockProps} canEditMetrics={false} />
      );
      const editNameButton = container.querySelector('.icon-edit-name');
      expect(editNameButton).toBeDisabled();
    });
  });

  it('renders an empty message when there is no variable selected', () => {
    const emptyVariable = {
      ...mockProps.variable,
      name: '',
    };
    render(<VariableVisualisation {...mockProps} variable={emptyVariable} />);

    expect(screen.queryByTestId('summary-bar-graph')).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('value-visualisation-graph')
    ).not.toBeInTheDocument();
    expect(
      screen.getByText('Set up an Injury Risk Metric')
    ).toBeInTheDocument();
  });

  it('calls the correct callbacks when adding a new variable', async () => {
    const user = userEvent.setup();
    const emptyVariable = {
      ...mockProps.variable,
      name: '',
    };
    const { container } = render(
      <VariableVisualisation {...mockProps} variable={emptyVariable} />
    );

    const addButton = container.querySelector('.icon-add');
    await user.click(addButton);

    expect(mockProps.onAddNewInjuryVariable).toHaveBeenCalledTimes(1);
    expect(mockProps.buildVariableGraphs).toHaveBeenCalledTimes(1);
  });

  it('does not display creation data when adding a new variable', () => {
    const emptyVariable = {
      ...mockProps.variable,
      name: '',
    };
    render(<VariableVisualisation {...mockProps} variable={emptyVariable} />);

    expect(screen.queryByText(/created by/i)).not.toBeInTheDocument();
  });

  it('calls the correct callback when clicking the edit name button', async () => {
    const user = userEvent.setup();
    const { container } = render(<VariableVisualisation {...mockProps} />);

    const editNameButton = container.querySelector('.icon-edit-name');
    await user.click(editNameButton);

    expect(mockProps.onOpenRenameVariableModal).toHaveBeenCalledWith(
      false,
      'Injury Metric 1'
    );
  });

  it('calls the correct callback when clicking the archive button', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <VariableVisualisation {...mockProps} isVariableSaved />
    );

    const archiveButton = container.querySelector('.icon-archive');
    await user.click(archiveButton);

    expect(mockProps.onUpdateVariable).toHaveBeenCalledWith('SET_ARCHIVED');
  });

  it('renders 1 value visualisation graph', () => {
    render(<VariableVisualisation {...mockProps} />);
    expect(screen.getByTestId('value-visualisation-graph')).toBeInTheDocument();
  });

  it('renders a summary bar graph', () => {
    render(<VariableVisualisation {...mockProps} />);
    expect(screen.getByTestId('summary-bar-graph')).toBeInTheDocument();
  });

  describe('when the variable has medical data redacted', () => {
    const redactedVariable = {
      ...mockProps.variable,
      medical_data_redacted: true,
    };

    it('does not render a value visualisation graph', () => {
      render(
        <VariableVisualisation {...mockProps} variable={redactedVariable} />
      );
      expect(
        screen.queryByTestId('value-visualisation-graph')
      ).not.toBeInTheDocument();
    });

    it('does not render a summary bar graph', () => {
      render(
        <VariableVisualisation {...mockProps} variable={redactedVariable} />
      );
      expect(screen.queryByTestId('summary-bar-graph')).not.toBeInTheDocument();
    });
  });

  it('displays the correct status indicator', () => {
    render(<VariableVisualisation {...mockProps} />);
    expect(screen.getByText('Status:')).toBeInTheDocument();
    expect(screen.getByText('Setup')).toBeInTheDocument();
  });

  describe('when data for the graphs is loading', () => {
    it('displays a loading state', () => {
      const loadingGraphData = {
        ...mockProps.graphData,
        isLoading: true,
      };
      render(
        <VariableVisualisation {...mockProps} graphData={loadingGraphData} />
      );

      const placeholderImages = screen.getAllByAltText('graph placeholder');
      expect(placeholderImages).toHaveLength(2);
    });
  });

  describe('when adding a new variable', () => {
    const emptyGraphData = {
      summary: null,
      value: null,
    };

    it('displays the archive variable button disabled', () => {
      const { container } = render(
        <VariableVisualisation
          {...mockProps}
          isVariablePresent
          isVariableSaved={false}
          graphData={emptyGraphData}
        />
      );

      const archiveButton = container.querySelector('.icon-archive');
      expect(archiveButton).toBeDisabled();
    });

    it('displays a no data message', () => {
      render(
        <VariableVisualisation
          {...mockProps}
          isVariablePresent
          isVariableSaved={false}
          graphData={emptyGraphData}
        />
      );

      expect(screen.queryByTestId('summary-bar-graph')).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('value-visualisation-graph')
      ).not.toBeInTheDocument();
      expect(
        screen.getByText(
          'No data to display. Use the filters to create a preview.'
        )
      ).toBeInTheDocument();
    });
  });

  describe('when there is no variable present', () => {
    it('displays the open rename modal button disabled', () => {
      const { container } = render(
        <VariableVisualisation {...mockProps} isVariablePresent={false} />
      );

      const editNameButton = container.querySelector('.icon-edit-name');
      expect(editNameButton).toBeDisabled();
    });

    it('displays the archive variable button disabled', () => {
      const { container } = render(
        <VariableVisualisation {...mockProps} isVariablePresent={false} />
      );

      const archiveButton = container.querySelector('.icon-archive');
      expect(archiveButton).toBeDisabled();
    });

    it('displays an empty message', () => {
      const emptyGraphData = {
        summary: null,
        value: null,
      };

      render(
        <VariableVisualisation
          {...mockProps}
          isVariablePresent={false}
          variable={{ ...mockProps.variable, name: '' }}
          graphData={emptyGraphData}
        />
      );

      expect(screen.queryByTestId('summary-bar-graph')).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('value-visualisation-graph')
      ).not.toBeInTheDocument();
      expect(
        screen.getByText('Set up an Injury Risk Metric')
      ).toBeInTheDocument();
    });
  });

  it('hides the Run Data button when variable is not completed', () => {
    render(<VariableVisualisation {...mockProps} />);
    expect(
      screen.queryByRole('button', { name: /run data/i })
    ).not.toBeInTheDocument();
  });

  describe('when the variable is saved', () => {
    it('displays the archive variable button enabled', () => {
      const { container } = render(
        <VariableVisualisation
          {...mockProps}
          isVariablePresent
          isVariableSaved
        />
      );

      const archiveButton = container.querySelector('.icon-archive');
      expect(archiveButton).toBeEnabled();
    });
  });

  describe('when the variable is completed and the metric is ready', () => {
    it('calls the correct callback when clicking the Run Data button', async () => {
      const user = userEvent.setup();
      const completedVariable = { ...mockProps.variable, status: 'completed' };
      render(
        <VariableVisualisation {...mockProps} variable={completedVariable} />
      );

      const runDataButton = screen.getByRole('button', { name: /run data/i });
      await user.click(runDataButton);

      expect(mockProps.onClickManualRun).toHaveBeenCalledTimes(1);
    });
  });

  describe('when the variable is already running a prediction', () => {
    it('disables the Run Data button', () => {
      const inProgressVariable = {
        ...mockProps.variable,
        status: 'completed',
        last_prediction_status: 'in_progress',
      };
      render(
        <VariableVisualisation {...mockProps} variable={inProgressVariable} />
      );

      const runDataButton = screen.getByRole('button', { name: /run data/i });
      expect(runDataButton).toBeDisabled();
    });
  });

  describe('when the manual run is already triggered on the variable', () => {
    it('disables the Run Data button', () => {
      const triggeredVariable = {
        ...mockProps.variable,
        status: 'completed',
        last_prediction_status: 'triggered',
      };
      render(
        <VariableVisualisation {...mockProps} variable={triggeredVariable} />
      );

      const runDataButton = screen.getByRole('button', { name: /run data/i });
      expect(runDataButton).toBeDisabled();
    });
  });

  describe('when the variable is archived', () => {
    const archivedVariable = {
      ...injuryVariablesDummyData[0],
      archived: true,
    };

    it('displays a restore button', () => {
      render(
        <VariableVisualisation {...mockProps} variable={archivedVariable} />
      );

      expect(
        screen.getByRole('button', { name: /restore/i })
      ).toBeInTheDocument();
    });

    it('does not display the rename button', () => {
      render(
        <VariableVisualisation {...mockProps} variable={archivedVariable} />
      );

      expect(
        screen.queryByRole('button', { name: /edit name/i })
      ).not.toBeInTheDocument();
    });

    it('displays the correct status indicator', () => {
      render(
        <VariableVisualisation {...mockProps} variable={archivedVariable} />
      );

      expect(screen.getByText('Archived')).toBeInTheDocument();
    });

    it('calls the correct callback when clicking the restore button', async () => {
      const user = userEvent.setup();
      render(
        <VariableVisualisation {...mockProps} variable={archivedVariable} />
      );

      const restoreButton = screen.getByRole('button', { name: /restore/i });
      await user.click(restoreButton);

      expect(mockProps.onUpdateVariable).toHaveBeenCalledWith('SET_ARCHIVED');
    });
  });

  describe('when the variable status is "failed"', () => {
    const variableInError = {
      ...injuryVariablesDummyData[0],
      status: 'failed',
    };

    it('displays the correct status indicator', () => {
      render(
        <VariableVisualisation {...mockProps} variable={variableInError} />
      );

      expect(screen.getByText('Error')).toBeInTheDocument();
    });
  });

  describe('when the variable status is "completed"', () => {
    const readyVariable = {
      ...injuryVariablesDummyData[0],
      status: 'completed',
    };

    it('displays the correct status indicator', () => {
      render(<VariableVisualisation {...mockProps} variable={readyVariable} />);

      expect(screen.getByText('Status:')).toBeInTheDocument();
      // Completed status shows no text, just the icon
      expect(screen.queryByText('Setup')).not.toBeInTheDocument();
    });
  });

  describe('when the variable status is "in_progress"', () => {
    const inProgressVariable = {
      ...injuryVariablesDummyData[0],
      status: 'in_progress',
    };

    it('displays the correct status indicator', () => {
      render(
        <VariableVisualisation {...mockProps} variable={inProgressVariable} />
      );

      expect(screen.getByText('In Progress')).toBeInTheDocument();
    });
  });

  describe('when the display-top-influencing-factors-on-injury-risk-metric feature flag is available', () => {
    it('renders a loading placeholder when the graph is loading if the flag is enabled', () => {
      window.setFlag(
        'display-top-influencing-factors-on-injury-risk-metric',
        true
      );
      render(
        <VariableVisualisation
          {...mockProps}
          isTcfGraphLoading
          isVariableSaved
        />
      );

      const placeholderImage = screen.getByAltText('graph placeholder');
      expect(placeholderImage).toBeInTheDocument();
    });

    it('does not render anything for the tcf graph if the flag is disabled', () => {
      window.setFlag(
        'display-top-influencing-factors-on-injury-risk-metric',
        false
      );
      render(<VariableVisualisation {...mockProps} />);

      expect(
        screen.queryByTestId('top-contributing-factors-graph')
      ).not.toBeInTheDocument();
    });

    it('renders the top contributing factors graph when flag is enabled and variable is saved', () => {
      window.setFlag(
        'display-top-influencing-factors-on-injury-risk-metric',
        true
      );
      render(<VariableVisualisation {...mockProps} isVariableSaved />);

      expect(
        screen.getByTestId('top-contributing-factors-graph')
      ).toBeInTheDocument();
    });
  });
});
