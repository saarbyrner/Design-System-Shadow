import { screen, render } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import userEvent from '@testing-library/user-event';
import { getDummyData } from '@kitman/modules/src/analysis/shared/resources/graph/DummyData';
import SummaryDonut from '..';

jest.mock('@kitman/components', () => ({
  LegacyModal: ({ children, close }) => (
    <div data-testid="modal" onClick={close}>
      {children}
    </div>
  ),
}));

jest.mock(
  '@kitman/modules/src/analysis/shared/components/GraphWidget/SummaryDonutGraph',
  () => {
    return function MockSummaryDonutGraph(props) {
      return (
        <div
          data-testid="summary-donut-graph"
          data-graph-style={JSON.stringify(props.graphStyle)}
        />
      );
    };
  }
);

jest.mock(
  '@kitman/modules/src/analysis/shared/components/GraphWidget/SummaryDonutGraphTable',
  () => ({
    SummaryDonutGraphTableTranslated: function MockSummaryDonutGraphTable(
      props
    ) {
      return (
        <div
          data-testid="summary-donut-graph-table"
          data-show-title={props.showTitle}
          data-can-save-graph={props.canSaveGraph}
        >
          SummaryDonutGraphTable
        </div>
      );
    },
  })
);

describe('Graph Composer <SummaryDonut /> component', () => {
  const props = {
    canBuildGraph: true,
    canSaveGraph: true,
    graphData: getDummyData('summaryDonut'),
    updateGraphType: jest.fn(),
    closeGraphModal: jest.fn(),
    t: i18nextTranslateStub(),
    graphType: 'donut',
    openRenameGraphModal: jest.fn(),
    isGraphExpanded: false,
  };

  it('expands the graph when isGraphExpanded is true', () => {
    render(<SummaryDonut {...props} isGraphExpanded />);

    const modal = screen.getByTestId('modal');
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveStyle({ display: 'block' });

    const graphs = screen.getAllByTestId('summary-donut-graph');
    expect(graphs).toHaveLength(2);

    const graphStyles = graphs.map((graph) =>
      JSON.parse(graph.getAttribute('data-graph-style'))
    );

    expect(graphStyles[0]).toStrictEqual({
      marginTop: '40px',
      height: 'auto',
    });

    expect(graphStyles[1]).toStrictEqual({
      marginTop: '40px',
      height: '80%',
    });
  });

  it('calls the correct callback when closing the modal', async () => {
    const user = userEvent.setup();
    render(<SummaryDonut {...props} isGraphExpanded />);

    const modal = screen.getByTestId('modal');
    await user.click(modal);

    expect(props.closeGraphModal).toHaveBeenCalledTimes(1);
  });

  it('shows the table graph when graphType is table', () => {
    render(<SummaryDonut {...props} graphType="table" />);

    const tableGraphs = screen.getAllByTestId('summary-donut-graph-table');
    expect(tableGraphs).toHaveLength(2);

    expect(tableGraphs[0]).toHaveAttribute('data-show-title', 'true');
    expect(tableGraphs[0]).toHaveAttribute('data-can-save-graph', 'true');

    expect(screen.queryByTestId('summary-donut-graph')).not.toBeInTheDocument();
  });
});
