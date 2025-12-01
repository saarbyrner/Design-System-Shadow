import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import {
  DummyLongitudinalGraphData,
  getDummyData,
} from '@kitman/modules/src/analysis/shared/resources/graph/DummyData';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import GraphView from '..';

jest.mock('@kitman/common/src/hooks/useEventTracking');

const mockLongitudinal = jest.fn();
const mockSummary = jest.fn();
const mockSummaryBar = jest.fn();
const mockSummaryStackBar = jest.fn();
const mockSummaryDonut = jest.fn();
const mockValueVisualisation = jest.fn();
const mockActionBar = jest.fn();
const mockRenameModal = jest.fn();

jest.mock('../Longitudinal', () =>
  jest.fn((props) => {
    mockLongitudinal(props);
    return <div data-testid="longitudinal" />;
  })
);
jest.mock('../Summary', () =>
  jest.fn((props) => {
    mockSummary(props);
    return <div data-testid="summary" />;
  })
);
jest.mock('../SummaryBar', () =>
  jest.fn((props) => {
    mockSummaryBar(props);
    return <div data-testid="summary-bar" />;
  })
);
jest.mock('../SummaryStackBar', () =>
  jest.fn((props) => {
    mockSummaryStackBar(props);
    return <div data-testid="summary-stack-bar" />;
  })
);
jest.mock('../SummaryDonut', () =>
  jest.fn((props) => {
    mockSummaryDonut(props);
    return <div data-testid="summary-donut" />;
  })
);
jest.mock('../ValueVisualisation', () =>
  jest.fn((props) => {
    mockValueVisualisation(props);
    return <div data-testid="value-visualisation" />;
  })
);
jest.mock('../ActionBar', () =>
  jest.fn((props) => {
    mockActionBar(props);
    return (
      <div data-testid="action-bar">
        <button type="button" onClick={() => props.updateGraphType('table')}>
          Update Graph Type
        </button>
        <button
          type="button"
          onClick={() => props.updateDecorators({ data_labels: true })}
        >
          Update Decorators
        </button>
        <button type="button" onClick={props.openGraphModal}>
          Expand Graph
        </button>
      </div>
    );
  })
);
jest.mock(
  '@kitman/modules/src/analysis/shared/components/GraphWidget/RenameModal',
  () => ({
    RenameModalTranslated: jest.fn((props) => {
      mockRenameModal(props);
      return <div data-testid="rename-modal" />;
    }),
  })
);

jest.mock('@kitman/components', () => ({
  TextButton: jest.fn(({ text, onClick }) => (
    <button type="button" onClick={onClick}>
      {text}
    </button>
  )),
}));

// Mock window.location.hash
delete window.location;
window.location = { hash: '' };

describe('Graph Composer <GraphView /> component', () => {
  const defaultProps = {
    containerType: 'AnalyticalDashboard',
    canBuildGraph: true,
    canSaveGraph: true,
    hasGraphData: true,
    isEditingDashboard: true,
    graphGroup: 'longitudinal',
    graphType: 'line',
    saveGraph: jest.fn(),
    openDashboardSelectorModal: jest.fn(),
    updateGraphType: jest.fn(),
    updateDecorators: jest.fn(),
    graphData: DummyLongitudinalGraphData,
    renameModal: {
      graphTitle: 'Custom graph title',
      updatedGraphTitle: null,
      isOpen: false,
    },
    t: i18nextTranslateStub(),
    closeRenameGraphModal: jest.fn(),
    onRenameValueChange: jest.fn(),
    onRenameConfirm: jest.fn(),
    updateAggregationPeriod: jest.fn(),
    openRenameGraphModal: jest.fn(),
  };

  const mockTrackEvent = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useEventTracking.mockReturnValue({
      trackEvent: mockTrackEvent,
    });
    window.location.hash = '';
  });

  describe('when there is no graph data', () => {
    it('redirects to the create page', () => {
      render(<GraphView {...defaultProps} hasGraphData={false} />);
      expect(window.location.hash).toBe('#create');
    });

    describe('when the user does not have the build graph permission', () => {
      it('shows a no permission text', () => {
        render(
          <GraphView
            {...defaultProps}
            canBuildGraph={false}
            hasGraphData={false}
          />
        );
        expect(
          screen.getByText('You do not have the permission to create graphs')
        ).toBeInTheDocument();
      });
    });
  });

  it('shows a save button', () => {
    render(<GraphView {...defaultProps} />);
    expect(screen.getByText('Save Graph')).toBeInTheDocument();
  });

  it('does not show a save button without the proper permission', () => {
    render(<GraphView {...defaultProps} canSaveGraph={false} />);
    expect(screen.queryByText('Save Graph')).not.toBeInTheDocument();
  });

  it('calls trackEvent with correct Data', async () => {
    const user = userEvent.setup();
    render(<GraphView {...defaultProps} />);

    const saveButton = screen.getByText('Save Graph');
    await user.click(saveButton);

    expect(mockTrackEvent).toHaveBeenCalledWith('Add Graph Widget');
  });

  it('calls trackEvent with correct Data when editing is true', async () => {
    const user = userEvent.setup();
    render(<GraphView {...defaultProps} isEditingGraph />);

    const saveButton = screen.getByText('Save Changes');
    await user.click(saveButton);

    expect(mockTrackEvent).toHaveBeenCalledWith('Edit Graph Widget');
  });

  describe('when clicking the save button', () => {
    it('saves the graph', async () => {
      const user = userEvent.setup();
      render(<GraphView {...defaultProps} />);

      const saveButton = screen.getByText('Save Graph');
      await user.click(saveButton);

      expect(defaultProps.saveGraph).toHaveBeenCalledTimes(1);
    });
  });

  describe('when editing an analytical dashboard and clicking save', () => {
    it('saves the graph', async () => {
      const user = userEvent.setup();
      render(<GraphView {...defaultProps} isEditingDashboard />);

      const saveButton = screen.getByText('Save Graph');
      await user.click(saveButton);

      expect(defaultProps.saveGraph).toHaveBeenCalledTimes(1);
    });
  });

  describe('when editing a home dashboard and clicking save', () => {
    it('saves the graph', async () => {
      const user = userEvent.setup();
      render(
        <GraphView
          {...defaultProps}
          containerType="HomeDashboard"
          isEditingDashboard
        />
      );

      const saveButton = screen.getByText('Save Graph');
      await user.click(saveButton);

      expect(defaultProps.saveGraph).toHaveBeenCalledTimes(1);
    });
  });

  describe('when not editing a dashboard and clicking save', () => {
    it('opens the selector modal for analytical dashboard', async () => {
      const user = userEvent.setup();
      render(<GraphView {...defaultProps} isEditingDashboard={false} />);

      const saveButton = screen.getByText('Save Graph');
      await user.click(saveButton);

      expect(defaultProps.openDashboardSelectorModal).toHaveBeenCalledTimes(1);
    });

    it('saves graph for home dashboard', async () => {
      const user = userEvent.setup();
      render(
        <GraphView
          {...defaultProps}
          containerType="HomeDashboard"
          isEditingDashboard={false}
        />
      );

      const saveButton = screen.getByText('Save Graph');
      await user.click(saveButton);

      expect(defaultProps.saveGraph).toHaveBeenCalledTimes(1);
    });
  });

  describe('when the graph is already saved', () => {
    it('shows the edit button', () => {
      render(<GraphView {...defaultProps} isEditingGraph />);
      expect(screen.getByText('Save Changes')).toBeInTheDocument();
    });
  });

  describe('when the graph group is longitudinal', () => {
    it('renders the longitudinal graph', () => {
      render(<GraphView {...defaultProps} graphGroup="longitudinal" />);
      expect(screen.getByTestId('longitudinal')).toBeInTheDocument();
    });
  });

  describe('when the graph group is summary', () => {
    it('renders the summary graph', () => {
      render(<GraphView {...defaultProps} graphGroup="summary" />);
      expect(screen.getByTestId('summary')).toBeInTheDocument();
    });
  });

  describe('when the graph group is summary_bar', () => {
    it('renders the summary_bar graph', () => {
      render(<GraphView {...defaultProps} graphGroup="summary_bar" />);
      expect(screen.getByTestId('summary-bar')).toBeInTheDocument();
    });
  });

  describe('when the graph group is summary_stack_bar', () => {
    it('renders the summary_stack_bar graph', () => {
      render(<GraphView {...defaultProps} graphGroup="summary_stack_bar" />);
      expect(screen.getByTestId('summary-stack-bar')).toBeInTheDocument();
    });
  });

  describe('when the graph group is summary_donut', () => {
    it('renders the summary_donut graph', () => {
      render(<GraphView {...defaultProps} graphGroup="summary_donut" />);
      expect(screen.getByTestId('summary-donut')).toBeInTheDocument();
    });
  });

  describe('when the graph group is value_visualisation', () => {
    it('renders the value_visualisation graph', () => {
      render(
        <GraphView
          {...defaultProps}
          graphGroup="value_visualisation"
          graphData={getDummyData('value_visualisation')}
        />
      );

      expect(screen.getByTestId('value-visualisation')).toBeInTheDocument();
    });
  });

  it('renders the action bar', () => {
    render(<GraphView {...defaultProps} />);

    expect(mockActionBar).toHaveBeenCalledWith(
      expect.objectContaining({
        graphData: defaultProps.graphData,
        graphType: defaultProps.graphType,
        canBuildGraph: defaultProps.canBuildGraph,
      })
    );
  });

  describe('when updating the active graph', () => {
    it('calls the corect callback', async () => {
      const user = userEvent.setup();
      render(<GraphView {...defaultProps} />);

      const updateButton = screen.getByText('Update Graph Type');
      await user.click(updateButton);

      expect(defaultProps.updateGraphType).toHaveBeenCalledWith(
        'table',
        'longitudinal'
      );
    });
  });

  describe('when updating the decorators', () => {
    it('calls updateDecorators with the correct parameters', async () => {
      const user = userEvent.setup();
      render(<GraphView {...defaultProps} />);

      const updateButton = screen.getByText('Update Decorators');
      await user.click(updateButton);

      expect(defaultProps.updateDecorators).toHaveBeenCalledWith(
        'longitudinal',
        {
          data_labels: true,
        }
      );
    });
  });

  describe('when clicking the expand button', () => {
    it('expands the graph', async () => {
      const user = userEvent.setup();
      render(<GraphView {...defaultProps} />);

      expect(mockLongitudinal).toHaveBeenCalledWith(
        expect.objectContaining({
          isGraphExpanded: false,
        })
      );

      const expandButton = screen.getByText('Expand Graph');
      await user.click(expandButton);

      expect(mockLongitudinal).toHaveBeenCalledWith(
        expect.objectContaining({
          isGraphExpanded: true,
        })
      );

      // Simulate closing the modal by calling the closeGraphModal prop
      const closeGraphModal =
        mockLongitudinal.mock.calls[mockLongitudinal.mock.calls.length - 1][0]
          .closeGraphModal;
      closeGraphModal();

      expect(mockLongitudinal).toHaveBeenCalledWith(
        expect.objectContaining({
          isGraphExpanded: false,
        })
      );
    });
  });

  it('renders a rename modal', () => {
    render(
      <GraphView
        {...defaultProps}
        renameModal={{
          graphTitle: 'Custom graph title',
          updatedGraphTitle: null,
          isOpen: true,
        }}
      />
    );
    expect(screen.getByTestId('rename-modal')).toBeInTheDocument();
  });
});
