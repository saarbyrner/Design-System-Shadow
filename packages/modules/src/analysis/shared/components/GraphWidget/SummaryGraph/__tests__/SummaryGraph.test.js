import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getDummyData } from '@kitman/modules/src/analysis/shared/resources/graph/DummyData';
import SummaryChartConfig from '@kitman/modules/src/analysis/shared/resources/graph/SummaryBarChartConfig';
import SummaryGraph from '..';

const mockSeries = Array.from({ length: 3 }, () => ({
  setVisible: jest.fn(),
  visible: true,
}));

const mockChart = {
  series: mockSeries,
  reflow: jest.fn(),
  userOptions: { chart: { type: 'line' } },
};

jest.mock('@kitman/common/src/utils/HighchartDefaultOptions', () => ({
  Chart: jest.fn().mockImplementation(() => mockChart),
}));
jest.mock('highcharts/highcharts-more', () => jest.fn());
jest.mock('highcharts/modules/no-data-to-display', () => jest.fn());
jest.mock('highcharts/modules/parallel-coordinates', () => jest.fn());

describe('Graph Composer <SummaryGraph /> component', () => {
  const chartConfig = SummaryChartConfig(getDummyData('summary'));
  const props = {
    chartConfig,
    graphType: 'spider',
    graphData: getDummyData('summary'),
  };

  it('renders', () => {
    render(<SummaryGraph {...props} />);

    expect(screen.getByText('Entire Squad:')).toBeInTheDocument();
  });

  it('shows the graph description', () => {
    render(<SummaryGraph {...props} />);

    expect(screen.getByText('Goalkeeper:')).toBeInTheDocument();
    expect(screen.getByText('Defender:')).toBeInTheDocument();
  });

  it('shows a chart legend', () => {
    render(<SummaryGraph {...props} />);

    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getByText('Entire Squad')).toBeInTheDocument();
  });

  it('disables items when clicking the legend', async () => {
    const user = userEvent.setup();
    render(<SummaryGraph {...props} />);

    const legendItems = screen.getAllByRole('listitem');
    expect(legendItems).toHaveLength(3);

    legendItems.forEach((item) => {
      expect(item).not.toHaveClass('chartLegend__item--disabled');
    });

    await user.click(legendItems[1]);

    const updatedLegendItems = screen.getAllByRole('listitem');
    expect(updatedLegendItems[0]).not.toHaveClass(
      'chartLegend__item--disabled'
    );
    expect(updatedLegendItems[1]).toHaveClass('chartLegend__item--disabled');

    expect(mockChart.series[0].setVisible).not.toHaveBeenCalled();
    expect(mockChart.series[1].setVisible).toHaveBeenCalledWith(false, false);
  });

  describe('when showTitle is false', () => {
    it('hides the title', () => {
      render(<SummaryGraph {...props} showTitle={false} />);

      expect(screen.queryByText('3 Metrics')).not.toBeInTheDocument();
    });
  });

  describe('When showTitle is true', () => {
    it('renders a rename modal', () => {
      render(<SummaryGraph {...props} showTitle />);

      expect(screen.queryByText('3 Metrics')).toBeInTheDocument();
    });
  });

  describe('when changing the graph type', () => {
    it('updates the graph type', () => {
      const { rerender } = render(<SummaryGraph {...props} />);

      expect(mockChart.userOptions.chart.type).toBe('line');
      mockChart.userOptions.chart.type = 'area';

      rerender(<SummaryGraph {...props} graphType="radar" />);

      expect(mockChart.userOptions.chart.type).toBe('area');
    });
  });
});
