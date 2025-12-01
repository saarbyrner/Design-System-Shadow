import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { getDummyData } from '../../../../resources/graph/DummyData';
import SummaryDonutGraph from '..';

describe('Graph Composer <SummaryDonutGraph /> component', () => {
  const props = {
    graphData: getDummyData('summaryDonut'),
    graphType: 'donut',
    showTitle: true,
  };

  it('renders', () => {
    const { container } = render(<SummaryDonutGraph {...props} />);

    expect(container.querySelector('.graphDescription')).toBeInTheDocument();
  });

  describe('when showTitle is false', () => {
    it('hides the title', () => {
      const { container } = render(
        <SummaryDonutGraph {...props} showTitle={false} />
      );

      const graphDescription = container.querySelector('.graphDescription');
      expect(graphDescription).toBeInTheDocument();
    });
  });

  describe('when changing the graph type', () => {
    it('updates the graph type', () => {
      const { container, rerender } = render(<SummaryDonutGraph {...props} />);

      const initialChart = container.querySelector('.highcharts-container');
      expect(initialChart).toBeInTheDocument();

      rerender(<SummaryDonutGraph {...props} graphType="pie" />);

      const updatedChart = container.querySelector('.highcharts-container');
      expect(updatedChart).toBeInTheDocument();
    });
  });
});
