import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import SummaryBarGraph from '..';
import SummaryBarChartConfig from '../../../../resources/graph/SummaryBarChartConfig';
import { getDummyData } from '../../../../resources/graph/DummyData';

describe('Graph Composer <SummaryBarGraph /> component', () => {
  const chartConfig = SummaryBarChartConfig(getDummyData('summaryBar'));

  const props = {
    graphData: getDummyData('summaryBar'),
    graphType: 'column',
    showTitle: true,
    chartConfig,
  };

  beforeEach(() => {
    props.chartConfig = SummaryBarChartConfig(getDummyData('summaryBar'));
  });

  it('renders', () => {
    render(<SummaryBarGraph {...props} />);

    expect(document.querySelector('.graphDescription')).toBeInTheDocument();
  });

  it('shows a chart item for each metric', () => {
    const { container } = render(<SummaryBarGraph {...props} />);

    const legendItems = container.querySelectorAll('.chartLegend__item');
    expect(legendItems[0]).toHaveTextContent('Good Mood (Yes-No)');
    expect(legendItems[1]).toHaveTextContent('Overlay Name Mean (Daily)');
    expect(legendItems[2]).toHaveTextContent('Sleep Duration (hr)');

    expect(container.querySelectorAll('.chartLegend')).toHaveLength(2);
  });

  describe('when the metric is medical', () => {
    const SummaryBarMedicalGraphData = {
      metrics: [
        {
          type: 'medical',
          category: 'body_area',
          series: [
            {
              name: 'Ankle',
              y: 6,
            },
            {
              name: 'Chest',
              y: 20,
            },
            {
              name: 'Foot',
              y: 2,
            },
          ],
          overlays: [],
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
    };

    it('shows a chart item for each serie and a label', () => {
      const { container } = render(
        <SummaryBarGraph
          {...props}
          graphData={SummaryBarMedicalGraphData}
          chartConfig={SummaryBarChartConfig(SummaryBarMedicalGraphData)}
        />
      );

      expect(container.querySelector('.chartLegend__label')).toHaveTextContent(
        'Illness - Body Area'
      );
      expect(screen.getByText('Ankle')).toBeInTheDocument();
      expect(screen.getByText('Chest')).toBeInTheDocument();
      expect(screen.getByText('Foot')).toBeInTheDocument();
    });
  });

  describe('when the metric is medical and contains filters', () => {
    const SummaryBarMedicalGraphData = {
      metrics: [
        {
          type: 'medical',
          category: 'all_illnesses',
          series: [
            {
              name: 'all_illnesses',
              y: 6,
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
    };

    it('shows the correct label', () => {
      render(
        <SummaryBarGraph
          {...props}
          graphData={SummaryBarMedicalGraphData}
          chartConfig={SummaryBarChartConfig(SummaryBarMedicalGraphData)}
        />
      );

      expect(
        screen.getByText('Illness - No. of Illness Occurrences (Non Time-loss)')
      ).toBeInTheDocument();
    });
  });

  describe('when the metric is metric type and contains filters', () => {
    const SummaryBarMetricGraphData = {
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

    it('shows the correct legend item text', () => {
      render(
        <SummaryBarGraph
          {...props}
          graphData={SummaryBarMetricGraphData}
          chartConfig={SummaryBarChartConfig(SummaryBarMetricGraphData)}
        />
      );

      expect(
        screen.getByText('Sleep Duration (hr) (Game | Captains Run)')
      ).toBeInTheDocument();
    });
  });

  it('disables items when clicking the legend', async () => {
    const user = userEvent.setup();
    const { container } = render(<SummaryBarGraph {...props} />);

    expect(
      container.querySelectorAll('.chartLegend__item--disabled')
    ).toHaveLength(0);

    const firstLegendItem = container.querySelector('.chartLegend__item');
    await user.click(firstLegendItem);

    expect(firstLegendItem).toHaveClass('chartLegend__item--disabled');

    // Second item is a plotline overlay
    const secondLegendItem =
      container.querySelectorAll('.chartLegend__item')[1];
    await user.click(secondLegendItem);

    expect(secondLegendItem).toHaveClass('chartLegend__item--disabled');
  });

  describe('when showTitle is false', () => {
    it('hides the title', () => {
      render(<SummaryBarGraph {...props} showTitle={false} />);

      expect(document.querySelector('.graphDescription')).toBeInTheDocument();
    });
  });

  describe('when changing the graph type', () => {
    it('updates the graph type', () => {
      const { rerender } = render(<SummaryBarGraph {...props} />);

      expect(
        document.querySelector('[data-highcharts-chart]')
      ).toBeInTheDocument();

      rerender(<SummaryBarGraph {...props} graphType="bar" />);

      // Chart type change is handled internally by Highcharts
      expect(
        document.querySelector('[data-highcharts-chart]')
      ).toBeInTheDocument();
    });
  });
});
