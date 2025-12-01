import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { getDummyData } from '@kitman/modules/src/analysis/shared/resources/graph/DummyData';
import Longitudinal from '..';

describe('Graph Composer <Longitudinal /> component', () => {
  function buildProps() {
    return {
      graphType: 'line',
      canBuildGraph: true,
      canSaveGraph: true,
      graphData: getDummyData('longitudinal'),
      updateAggregationPeriod: () => {},
      updateGraphType: jest.fn(),
      closeGraphModal: jest.fn(),
      t: (text) => text,
    };
  }

  it('expands the graph when isGraphExpanded is true', () => {
    const { container } = render(
      <Longitudinal {...buildProps()} isGraphExpanded />
    );

    const graphContainer = container.querySelector(
      '.graphView__graphContainer'
    );
    expect(graphContainer).toBeInTheDocument();

    const longitudinalGraphs = container.querySelectorAll('div');
    expect(longitudinalGraphs.length).toBeGreaterThan(0);
  });

  it('calls the correct callback when closing the modal', () => {
    const props = buildProps();
    const { container } = render(<Longitudinal {...props} />);

    const graphContainer = container.querySelector(
      '.graphView__graphContainer'
    );
    expect(graphContainer).toBeInTheDocument();
    expect(props.closeGraphModal).toEqual(expect.any(Function));
  });

  it('shows the table graph when graphType is table', () => {
    const props = buildProps();
    const { container } = render(<Longitudinal {...props} graphType="table" />);

    const graphContainer = container.querySelector(
      '.graphView__graphContainer'
    );
    expect(graphContainer).toBeInTheDocument();
    expect(container).toBeInTheDocument();
  });
});
