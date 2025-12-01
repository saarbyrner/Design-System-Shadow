import { render, screen } from '@testing-library/react';
import _cloneDeep from 'lodash/cloneDeep';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { getDummyData } from '../../../../resources/graph/DummyData';
import LongitudinalGraph from '..';

const mockChart = {
  reflow: jest.fn(),
  update: jest.fn(),
  redraw: jest.fn(),
  destroy: jest.fn(),
  setSize: jest.fn(),
  exportChart: jest.fn(),
  series: [
    {
      setVisible: jest.fn(),
      visible: true,
    },
    {
      setVisible: jest.fn(),
      visible: true,
    },
    {
      setVisible: jest.fn(),
      visible: true,
    },
    {
      setVisible: jest.fn(),
      visible: false,
    },
  ],
  yAxis: [
    {
      addPlotLine: jest.fn(),
      plotLinesAndBands: [{}],
    },
    {
      addPlotLine: jest.fn(),
      plotLinesAndBands: [{}],
    },
  ],
};

jest.mock('@kitman/common/src/utils/HighchartDefaultOptions', () => ({
  Chart: jest.fn(() => mockChart),
}));

jest.mock('highcharts/highcharts-more', () => jest.fn());
jest.mock('highcharts/modules/no-data-to-display', () => jest.fn());

jest.mock('../../../../resources/graph/LongitudinalChartConfig', () => ({
  ChartConfig: jest.fn(() => ({
    chart: { type: 'line' },
    series: [],
    xAxis: {},
    yAxis: {},
  })),
}));

jest.mock('../../../../resources/graph/GraphUtils', () => ({
  getChartOverlays: jest.fn(() => ({})),
  getOverlayColor: jest.fn(() => ({})),
}));

describe('Graph Composer <LongitudinalGraph /> component', () => {
  beforeEach(() => {
    window.featureFlags = {};
    jest.clearAllMocks();
  });

  const i18nTranslateStub = i18nextTranslateStub();

  const defaultProps = {
    graphData: getDummyData('longitudinal'),
    showTitle: true,
    chartConfig: {
      chart: { type: 'line' },
      series: [],
      xAxis: {},
      yAxis: {},
    },
    t: i18nTranslateStub,
  };

  it('renders', () => {
    const { container } = render(<LongitudinalGraph {...defaultProps} />);

    const graphHeader = container.querySelector('.graphComposer__graphHeader');
    expect(graphHeader).toBeInTheDocument();

    const graphDescription = container.querySelector('.graphDescription');
    expect(graphDescription).toBeInTheDocument();
  });

  it('shows a chart legend for each metric', () => {
    const { container } = render(<LongitudinalGraph {...defaultProps} />);

    const firstLegend = container.querySelector('.graphLegendList__legend');
    expect(firstLegend).toHaveTextContent(
      `${defaultProps.graphData.metrics[0].status.name} (${defaultProps.graphData.metrics[0].status.localised_unit})`
    );

    expect(firstLegend).toHaveTextContent(
      defaultProps.graphData.metrics[0].overlays[0].name
    );

    const allLegends = container.querySelectorAll('.graphLegendList__legend');
    expect(allLegends[1]).toHaveTextContent(
      `${defaultProps.graphData.metrics[1].status.name} (${defaultProps.graphData.metrics[1].status.localised_unit})`
    );

    const chartLegends = container.querySelectorAll('.chartLegend');
    expect(chartLegends).toHaveLength(2);
  });

  describe('when there is only one metric', () => {
    const customGraphData = _cloneDeep(getDummyData('longitudinal'));
    customGraphData.metrics = [getDummyData('longitudinal').metrics[0]];

    const customProps = {
      graphData: customGraphData,
      chartConfig: {
        chart: { type: 'line' },
        series: [],
        xAxis: {},
        yAxis: {},
      },
      t: i18nTranslateStub,
    };

    it("doesn't show the legend label", () => {
      const { container } = render(<LongitudinalGraph {...customProps} />);
      const legendLabels = container.querySelectorAll('.chartLegend__label');
      expect(legendLabels).toHaveLength(0);
    });
  });

  it('renders a time period selector', () => {
    render(<LongitudinalGraph {...defaultProps} />);

    expect(screen.getByRole('button', { name: 'Day' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Week' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Month' })).toBeInTheDocument();
  });

  it('renders a condensed time period selector when the graph is condensed', () => {
    const { container } = render(
      <LongitudinalGraph {...defaultProps} condensed />
    );

    const periodSelector = container.querySelector('.chartPeriodSelector');
    expect(periodSelector).toBeInTheDocument();
  });

  it('renders a condensed time period selector when the graph is not condensed', () => {
    const { container } = render(
      <LongitudinalGraph {...defaultProps} condensed={false} />
    );

    const periodSelector = container.querySelector('.chartPeriodSelector');
    expect(periodSelector).toBeInTheDocument();
  });

  describe('when showTitle is false', () => {
    it('hides the title', () => {
      const { container } = render(
        <LongitudinalGraph {...defaultProps} showTitle={false} />
      );

      const graphDescription = container.querySelector('.graphDescription');
      expect(graphDescription).toBeInTheDocument();
    });
  });

  describe('when the graph is event type', () => {
    it('hides the period selector', () => {
      const newProps = {
        graphData: getDummyData('longitudinalEvent'),
        showTitle: true,
        chartConfig: {
          chart: { type: 'line' },
          series: [],
          xAxis: {},
          yAxis: {},
        },
        t: i18nTranslateStub,
      };

      render(<LongitudinalGraph {...newProps} />);

      expect(
        screen.queryByRole('button', { name: 'Day' })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Week' })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Month' })
      ).not.toBeInTheDocument();
    });
  });

  describe('when the metric is medical', () => {
    const graphData = {
      metrics: [
        {
          type: 'medical',
          category: 'all_illnesses',
          series: [
            {
              name: 'all_illnesses',
              datapoints: [1, 6],
            },
          ],
          overlays: [],
          filters: {
            time_loss: ['non_time_loss'],
            session_type: [],
            competitions: [],
            event_types: [],
            training_session_types: [],
          },
          filter_names: {
            time_loss: ['Non Time-loss'],
            session_type: [],
            competitions: [],
            event_types: [],
            training_session_types: [],
          },
        },
      ],
      date_range: {
        start_date: '2017-10-27',
        end_date: '2017-12-04',
      },
      time_period: 'last_x_days',
      decorators: {
        data_labels: false,
      },
      injuries: [],
      illnesses: [],
    };

    it('shows the correct legend label', () => {
      const { container } = render(
        <LongitudinalGraph
          {...defaultProps}
          graphData={graphData}
          chartConfig={{
            chart: { type: 'line' },
            series: [],
            xAxis: {},
            yAxis: {},
          }}
        />
      );

      const legendLabel = container.querySelector('.chartLegend__label');
      expect(legendLabel).toHaveTextContent(
        'Illness - No. of Illness Occurrences (Non Time-loss)'
      );
    });
  });

  describe('when the metric is metric type', () => {
    const graphData = {
      metrics: [
        {
          type: 'metric',
          status: {
            name: 'Sleep Duration',
            localised_unit: 'hr',
            source_key: 'kitman:soreness_indication|abdominal',
            summary: 'mean',
            min: null,
            max: null,
            type: 'sleep_duration',
            aggregation_method: 'sum',
            grouped_with: [],
          },
          squad_selection: {
            athletes: [],
            positions: [71],
            position_groups: [],
            applies_to_squad: false,
          },
          series: [
            {
              name: 'Sleep Duration',
              datapoints: [
                {
                  name: 'Athlete 1',
                  y: 0.0,
                },
                {
                  name: 'Athlete 2',
                  y: 2.0,
                },
                {
                  name: 'Athlete 3',
                  y: 4.0,
                },
              ],
            },
          ],
          overlays: [],
          filters: {
            time_loss: [],
            session_type: [],
            competitions: [],
            event_types: ['game'],
            training_session_types: [294],
          },
          filter_names: {
            time_loss: [],
            session_type: [],
            competitions: [],
            event_types: ['Game'],
            training_session_types: ['Captains Run'],
          },
        },
      ],
      date_range: {
        start_date: '2017-10-27',
        end_date: '2017-12-04',
      },
      time_period: 'last_x_days',
      decorators: {
        data_labels: false,
      },
      injuries: [],
      illnesses: [],
    };

    it('shows the correct legend label', () => {
      const { container } = render(
        <LongitudinalGraph
          {...defaultProps}
          graphData={graphData}
          chartConfig={{
            chart: { type: 'line' },
            series: [],
            xAxis: {},
            yAxis: {},
          }}
        />
      );

      const legendLabel = container.querySelector('.chartLegend__label');
      expect(legendLabel).toHaveTextContent(
        'Sleep Duration (hr) (Game | Captains Run)'
      );
    });
  });
});
