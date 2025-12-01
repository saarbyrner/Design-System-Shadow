import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { getDummyData } from '@kitman/modules/src/analysis/shared/resources/graph/DummyData';
import SummaryStackBar from '..';

jest.mock(
  '@kitman/modules/src/analysis/shared/components/GraphWidget/SummaryStackBarGraph',
  () => {
    return function MockedSummaryStackBarGraph(props) {
      return (
        <div
          data-testid="summary-stack-bar-graph"
          data-graph-style={JSON.stringify(props.graphStyle)}
        />
      );
    };
  }
);

jest.mock('@kitman/components', () => ({
  LegacyModal: function MockedModal({ isOpen, close, children }) {
    return isOpen ? (
      <div data-testid="modal" onClick={close}>
        {children}
      </div>
    ) : null;
  },
}));

describe('Graph Composer <SummaryStackBar /> component', () => {
  const props = {
    canBuildGraph: true,
    graphData: getDummyData('summaryStackBar'),
    updateGraphType: jest.fn(),
    closeGraphModal: jest.fn(),
    t: i18nextTranslateStub(),
  };

  it('expands the graph when isGraphExpanded is true', () => {
    render(<SummaryStackBar {...props} isGraphExpanded />);

    const graphs = screen.getAllByTestId('summary-stack-bar-graph');
    expect(graphs).toHaveLength(2);

    graphs.forEach((graph) => {
      const graphStyle = JSON.parse(graph.dataset.graphStyle);
      expect(graphStyle).toEqual({
        marginTop: '40px',
      });
    });

    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });

  it('calls the correct callback when closing the modal', async () => {
    const user = userEvent.setup();
    render(<SummaryStackBar {...props} isGraphExpanded />);

    const modal = screen.getByTestId('modal');
    await user.click(modal);

    expect(props.closeGraphModal).toHaveBeenCalledTimes(1);
  });
});
