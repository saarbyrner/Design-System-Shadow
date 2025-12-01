import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { getDummyData } from '@kitman/modules/src/analysis/shared/resources/graph/DummyData';
import SummaryBar from '..';

jest.mock('@kitman/components', () => ({
  LegacyModal: ({ children, isOpen, close, fullscreen, ...props }) => (
    <div data-testid="modal" data-is-open={isOpen} onClick={close} {...props}>
      {children}
    </div>
  ),
}));

jest.mock(
  '@kitman/modules/src/analysis/shared/components/GraphWidget/SummaryBarGraph',
  () =>
    ({ graphStyle, canSaveGraph, showTitle }) =>
      (
        <div
          data-testid="summary-bar-graph"
          data-graph-style={JSON.stringify(graphStyle)}
          data-can-save-graph={canSaveGraph}
          data-show-title={showTitle}
        />
      )
);

jest.mock(
  '@kitman/modules/src/analysis/shared/components/GraphWidget/SummaryBarGraphTable',
  () => ({
    SummaryBarGraphTableTranslated: ({ showTitle, canSaveGraph }) => (
      <div
        data-testid="summary-bar-graph-table"
        data-show-title={showTitle}
        data-can-save-graph={canSaveGraph}
      />
    ),
  })
);

describe('Graph Composer <SummaryBar /> component', () => {
  const mockedProps = {
    canBuildGraph: true,
    canSaveGraph: true,
    closeGraphModal: jest.fn(),
    graphData: getDummyData('summaryBar'),
    t: i18nextTranslateStub(),
  };

  it('expands the graph when isGraphExpanded is true', () => {
    render(<SummaryBar {...mockedProps} isGraphExpanded />);

    const notExpandedGraphs = screen.getAllByTestId('summary-bar-graph');
    expect(notExpandedGraphs).toHaveLength(2);

    notExpandedGraphs.forEach((graph) => {
      const graphStyle = JSON.parse(graph.getAttribute('data-graph-style'));
      expect(graphStyle).toEqual({
        marginTop: '40px',
      });
    });

    const modal = screen.getByTestId('modal');
    expect(modal).toHaveAttribute('data-is-open', 'true');
  });

  it('calls the correct callback when closing the modal', async () => {
    const user = userEvent.setup();
    render(<SummaryBar {...mockedProps} />);

    const modal = screen.getByTestId('modal');
    await user.click(modal);

    expect(mockedProps.closeGraphModal).toHaveBeenCalledTimes(1);
  });

  it('shows the table graph when graphType is table', () => {
    render(<SummaryBar {...mockedProps} graphType="table" />);

    const summaryBarGraphTables = screen.getAllByTestId(
      'summary-bar-graph-table'
    );
    expect(summaryBarGraphTables).toHaveLength(2);

    const summaryBarGraphTable = summaryBarGraphTables[0];
    expect(summaryBarGraphTable).toHaveAttribute('data-show-title', 'true');
    expect(summaryBarGraphTable).toHaveAttribute('data-can-save-graph', 'true');
  });
});
