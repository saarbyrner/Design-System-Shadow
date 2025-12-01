import { render, screen } from '@testing-library/react';
import SummaryStackBarChartConfig from '@kitman/modules/src/analysis/shared/resources/graph/SummaryStackBarChartConfig';
import { getDummyData } from '@kitman/modules/src/analysis/shared/resources/graph/DummyData';
import SummaryStackBarGraph from '..';

jest.mock('highcharts/modules/no-data-to-display', () => jest.fn());

jest.mock('@kitman/common/src/utils/HighchartDefaultOptions', () => {
  const mockChart = {
    series: [
      { visible: true, setVisible: jest.fn() },
      { visible: true, setVisible: jest.fn() },
    ],
    reflow: jest.fn(),
    redraw: jest.fn(),
    update: jest.fn(),
    userOptions: {
      chart: {
        inverted: false,
      },
    },
  };

  return {
    Chart: jest.fn().mockImplementation(() => mockChart),
    chart: jest.fn().mockReturnValue(mockChart),
  };
});

const mockHighchartOptions = jest.requireMock(
  '@kitman/common/src/utils/HighchartDefaultOptions'
);

describe('<SummaryStackBarGraph />', () => {
  const summaryStackBarGraphData = JSON.parse(
    JSON.stringify(getDummyData('summaryStackBar'))
  );
  summaryStackBarGraphData.metrics[0].series = [
    {
      name: 'Forwards',
      datapoints: [
        {
          name: 'Ankle',
          y: 10,
        },
        {
          name: 'Foot',
          y: 3,
        },
      ],
    },
    {
      name: 'Backs',
      datapoints: [
        {
          name: 'Ankle',
          y: 10,
        },
        {
          name: 'Foot',
          y: 3,
        },
      ],
    },
  ];

  const chartConfig = SummaryStackBarChartConfig(summaryStackBarGraphData);
  const props = {
    chartConfig,
    graphType: 'column',
    graphData: summaryStackBarGraphData,
    showTitle: true,
  };

  it('renders', () => {
    render(<SummaryStackBarGraph {...props} />);

    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('shows the graph description', () => {
    render(<SummaryStackBarGraph {...props} />);

    const graphDescription = screen.getByRole('heading', { level: 4 });

    expect(graphDescription).toBeInTheDocument();
    expect(graphDescription).toHaveClass(
      'graphDescription__status graphDescription__status--renaming'
    );
  });

  it('shows a chart legend', () => {
    const graphDataWithoutCategoryDivision = {
      ...summaryStackBarGraphData,
      metrics: [
        {
          ...summaryStackBarGraphData.metrics[0],
          category: 'body_area',
          category_division: null,
        },
      ],
    };

    render(
      <SummaryStackBarGraph
        {...props}
        graphData={graphDataWithoutCategoryDivision}
      />
    );

    const legend = screen.getByText('Legend');
    expect(legend).toBeInTheDocument();
    expect(legend).toHaveClass('graphLegendList__toggleButton');
  });

  describe('when the metric contains a category division', () => {
    it('shows a chart legend with the category division as a name', () => {
      const graphDataWithCategoryDivision = {
        ...summaryStackBarGraphData,
        metrics: [
          {
            ...summaryStackBarGraphData.metrics[0],
            category: 'body_area',
            category_division: 'classification',
          },
        ],
      };

      render(
        <SummaryStackBarGraph
          {...props}
          graphData={graphDataWithCategoryDivision}
        />
      );

      expect(
        screen.getByText('Illness - Body Area & Classification')
      ).toBeInTheDocument();
      expect(screen.getByText('Illness - Classification')).toBeInTheDocument();
    });
  });

  describe('when two series have the same name', () => {
    it('shows a chart legend with unique series name', () => {
      const graphDataWithDuplicateSeriesName = {
        ...summaryStackBarGraphData,
        metrics: [
          {
            ...summaryStackBarGraphData.metrics[0],
            series: [
              {
                name: 'Pathology 1',
                stack: 'Athlete 2',
                datapoints: [
                  {
                    name: 'Ankle',
                    y: 10,
                  },
                  {
                    name: 'Foot',
                    y: 3,
                  },
                ],
              },
              {
                name: 'Pathology 1',
                stack: 'Athlete 1',
                datapoints: [
                  {
                    name: 'Ankle',
                    y: 7,
                  },
                  {
                    name: 'Foot',
                    y: 1,
                  },
                ],
              },
            ],
          },
        ],
      };

      render(
        <SummaryStackBarGraph
          {...props}
          graphData={graphDataWithDuplicateSeriesName}
        />
      );
      const label = screen.getByText('Pathology 1');
      expect(label).toBeInTheDocument();
      expect(
        screen.getAllByText('Illness - No. of Illness Occurrences')
      ).toHaveLength(2);
    });
  });

  describe('when changing the graph type', () => {
    it('reinitializes the chart with the new graph type', () => {
      const { rerender } = render(<SummaryStackBarGraph {...props} />);

      expect(mockHighchartOptions.Chart).toHaveBeenCalledTimes(1);
      rerender(<SummaryStackBarGraph {...props} graphType="bar" />);

      expect(mockHighchartOptions.Chart).toHaveBeenCalledTimes(2);

      const allCalls = mockHighchartOptions.Chart.mock.calls;
      expect(allCalls).toHaveLength(2);
    });

    it('handles graph type change without errors', () => {
      const { rerender } = render(<SummaryStackBarGraph {...props} />);

      expect(() => {
        rerender(<SummaryStackBarGraph {...props} graphType="bar" />);
      }).not.toThrow();
    });
  });

  it('renders a toggleable legend when props.toggleableLegend is true', () => {
    render(<SummaryStackBarGraph {...props} toggleableLegend />);

    const legendButton = screen.getByText('Legend');
    expect(legendButton).toBeInTheDocument();
    expect(legendButton).toHaveClass('graphLegendList__toggleButton');
  });
});
