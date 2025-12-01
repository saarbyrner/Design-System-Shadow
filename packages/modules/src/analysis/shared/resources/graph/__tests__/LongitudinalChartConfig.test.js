import _cloneDeep from 'lodash/cloneDeep';
import colors from '@kitman/common/src/variables/colors';
import { getDummyData } from '../DummyData';
import {
  getTitleXOffset,
  getTitleYOffset,
  shouldAllowDecimal,
  buildYAxis,
  ChartConfig,
  getSeriesZIndex,
} from '../LongitudinalChartConfig';

describe('LongitudinalChartConfig', () => {
  const chartData = getDummyData('longitudinal');

  describe('getTitleXOffset', () => {
    it('returns null if graphType is bar', () => {
      expect(getTitleXOffset(true, 'bar')).toBe(null);
    });

    it('returns -5 if graphType is not bar and isLeftSideMetric', () => {
      expect(getTitleXOffset(true, 'line')).toBe(-5);
    });

    it('returns 5 if graphType is not bar and isLeftSideMetric is false', () => {
      expect(getTitleXOffset(false, 'line')).toBe(5);
    });
  });

  describe('getTitleYOffset', () => {
    it('returns null if graphType is not bar', () => {
      expect(getTitleYOffset(true, 'line')).toBe(null);
    });

    it('returns 3 if graphType is bar and isLeftSideMetric', () => {
      expect(getTitleYOffset(true, 'bar')).toBe(3);
    });

    it('returns -7 if graphType is bar and isLeftSideMetric is false', () => {
      expect(getTitleYOffset(false, 'bar')).toBe(-7);
    });
  });

  describe('shouldAllowDecimal', () => {
    it('returns false if metric type is medical', () => {
      const metric = {
        type: 'medical',
      };
      expect(shouldAllowDecimal(metric)).toBe(false);
    });

    it('should return false if metric status isValueBoolean and !isValueScale', () => {
      const metric = {
        type: 'not medical',
        status: {
          type: 'boolean',
          summary: 'max',
        },
      };
      expect(shouldAllowDecimal(metric)).toBe(false);
    });

    it('should return false if metric status !isValueBoolean and isValueScale', () => {
      const metric = {
        type: 'not medical',
        status: {
          type: 'scale',
          summary: 'max',
        },
      };
      expect(shouldAllowDecimal(metric)).toBe(false);
    });

    it('should return true if metric status !isValueBoolean and !isValueScale', () => {
      const metric = {
        type: 'not medical',
        status: {
          type: 'sleep_duration',
          summary: 'max',
        },
      };
      expect(shouldAllowDecimal(metric)).toBe(true);
    });
  });

  describe('buildYAxis', () => {
    const defaultHiddenYAxis = {
      endOnTick: false,
      max: 1,
      min: 0,
      startOnTick: false,
      visible: false,
    };

    describe('when building a graph with 1 metric', () => {
      const graphData = {
        metrics: [
          {
            status: {
              grouped_with: [],
              localised_unit: 'Kg',
              max: null,
              min: null,
              name: 'Body Weight',
              summary: 'mean',
              type: 'number',
            },
          },
        ],
      };

      it('builds the correct yAxis data', () => {
        const result = buildYAxis(graphData, 'line');
        expect(Array.isArray(result)).toBe(true);
        expect(result[0]).toStrictEqual(defaultHiddenYAxis);
        expect(result[1]).toMatchObject({
          opposite: false,
          title: {
            text: 'Body Weight (Kg)',
            x: -5,
            y: null,
          },
        });
      });
    });

    describe('when building a graph with 2 metrics', () => {
      it('builds the correct yAxis data when metrics are not grouped', () => {
        const graphData = {
          metrics: [
            {
              order: 0,
              status: {
                grouped_with: [],
                localised_unit: 'Kg',
                max: null,
                min: null,
                name: 'Body Weight',
                summary: 'mean',
                type: 'number',
              },
            },
            {
              order: 1,
              status: {
                grouped_with: [],
                localised_unit: '1-10',
                max: 8.33,
                min: 6,
                name: 'Fatigue',
                summary: 'mean',
                type: 'scale',
              },
            },
          ],
        };

        const result = buildYAxis(graphData, 'line');
        expect(Array.isArray(result)).toBe(true);
        expect(result[0]).toStrictEqual(defaultHiddenYAxis);
        expect(result[1]).toMatchObject({
          opposite: false,
          title: {
            text: 'Body Weight (Kg)',
            x: -5,
            y: null,
          },
        });
        expect(result[2]).toMatchObject({
          opposite: true,
          title: {
            text: 'Fatigue (1-10)',
            x: 5,
            y: null,
          },
        });
      });

      it('builds the correct yAxis data when metrics are grouped', () => {
        const graphData = {
          metrics: [
            {
              order: 0,
              status: {
                grouped_with: [1],
                localised_unit: '1-10',
                max: 8.33,
                min: 6,
                name: 'Muscle Soreness',
                summary: 'mean',
                type: 'scale',
              },
            },
            {
              order: 1,
              status: {
                grouped_with: [0],
                localised_unit: '1-10',
                max: 8.33,
                min: 6,
                name: 'Fatigue',
                summary: 'mean',
                type: 'scale',
              },
            },
          ],
        };

        const result = buildYAxis(graphData, 'line');
        expect(Array.isArray(result)).toBe(true);
        expect(result[0]).toStrictEqual(defaultHiddenYAxis);
        expect(result[1]).toMatchObject({
          opposite: false,
          title: {
            text: '',
            x: -5,
            y: null,
          },
        });
      });
    });

    describe('when building a graph with 3 metrics', () => {
      it('builds the correct yAxis data when none of the metrics are grouped', () => {
        const graphData = {
          metrics: [
            {
              order: 0,
              status: {
                grouped_with: [],
                localised_unit: 'Kg',
                max: null,
                min: null,
                name: 'Body Weight',
                summary: 'mean',
                type: 'number',
              },
            },
            {
              order: 1,
              status: {
                grouped_with: [],
                localised_unit: '1-10',
                max: 8.33,
                min: 6,
                name: 'Fatigue',
                summary: 'mean',
                type: 'scale',
              },
            },
            {
              order: 2,
              status: {
                grouped_with: [],
                localised_unit: '',
                max: 645.43,
                min: 20,
                name: 'RPE x Duration - today',
                summary: 'mean',
                type: 'number',
              },
            },
          ],
        };

        const result = buildYAxis(graphData, 'line');
        expect(Array.isArray(result)).toBe(true);
        expect(result[0]).toStrictEqual(defaultHiddenYAxis);
        expect(result[1]).toMatchObject({
          opposite: false,
          title: {
            text: 'Body Weight (Kg)',
            x: -5,
            y: null,
          },
        });
        expect(result[2]).toMatchObject({
          opposite: true,
          title: {
            text: 'Fatigue (1-10)',
            x: 5,
            y: null,
          },
        });
        expect(result[3]).toMatchObject({
          opposite: true,
          title: {
            text: 'RPE x Duration - today ',
            x: 5,
            y: null,
          },
        });
      });

      it('builds the correct yAxis data when the last two metrics are grouped', () => {
        const graphData = {
          metrics: [
            {
              order: 0,
              status: {
                grouped_with: [],
                localised_unit: '',
                max: 645.43,
                min: 20,
                name: 'RPE x Duration - today',
                summary: 'mean',
                type: 'number',
              },
            },
            {
              order: 1,
              status: {
                grouped_with: [2],
                localised_unit: '1-10',
                max: 8.33,
                min: 6,
                name: 'Muscle Soreness',
                summary: 'mean',
                type: 'scale',
              },
            },
            {
              order: 2,
              status: {
                grouped_with: [1],
                localised_unit: '1-10',
                max: 8.33,
                min: 6,
                name: 'Fatigue',
                summary: 'mean',
                type: 'scale',
              },
            },
          ],
        };

        const result = buildYAxis(graphData, 'line');
        expect(Array.isArray(result)).toBe(true);
        expect(result[0]).toStrictEqual(defaultHiddenYAxis);
        expect(result[1]).toMatchObject({
          opposite: false,
          title: {
            text: 'RPE x Duration - today ',
            x: -5,
            y: null,
          },
        });
        expect(result[2]).toMatchObject({
          opposite: true,
          title: {
            text: '',
            x: 5,
            y: null,
          },
        });
      });

      it('builds the correct yAxis data when the first two metrics are grouped', () => {
        const graphData = {
          metrics: [
            {
              order: 0,
              status: {
                grouped_with: [1],
                localised_unit: '1-10',
                max: 8.33,
                min: 6,
                name: 'Muscle Soreness',
                summary: 'mean',
                type: 'scale',
              },
            },
            {
              order: 1,
              status: {
                grouped_with: [0],
                localised_unit: '1-10',
                max: 8.33,
                min: 6,
                name: 'Fatigue',
                summary: 'mean',
                type: 'scale',
              },
            },
            {
              order: 2,
              status: {
                grouped_with: [],
                localised_unit: '',
                max: 645.43,
                min: 20,
                name: 'RPE x Duration - today',
                summary: 'mean',
                type: 'number',
              },
            },
          ],
        };

        const result = buildYAxis(graphData, 'line');
        expect(Array.isArray(result)).toBe(true);
        expect(result[0]).toStrictEqual(defaultHiddenYAxis);
        expect(result[1]).toMatchObject({
          opposite: false,
          title: {
            text: '',
            x: -5,
            y: null,
          },
        });
        expect(result[2]).toMatchObject({
          opposite: true,
          title: {
            text: 'RPE x Duration - today ',
            x: 5,
            y: null,
          },
        });
      });

      it('builds the correct yAxis data when the fist and third metrics are grouped', () => {
        const graphData = {
          metrics: [
            {
              order: 0,
              status: {
                grouped_with: [2],
                localised_unit: '1-10',
                max: 8.33,
                min: 6,
                name: 'Muscle Soreness',
                summary: 'mean',
                type: 'scale',
              },
            },
            {
              order: 1,
              status: {
                grouped_with: [],
                localised_unit: '',
                max: 645.43,
                min: 20,
                name: 'RPE x Duration - today',
                summary: 'mean',
                type: 'number',
              },
            },
            {
              order: 2,
              status: {
                grouped_with: [0],
                localised_unit: '1-10',
                max: 8.33,
                min: 6,
                name: 'Fatigue',
                summary: 'mean',
                type: 'scale',
              },
            },
          ],
        };

        const result = buildYAxis(graphData, 'line');
        expect(Array.isArray(result)).toBe(true);
        expect(result[0]).toStrictEqual(defaultHiddenYAxis);
        expect(result[1]).toMatchObject({
          opposite: false,
          title: {
            text: '',
            x: -5,
            y: null,
          },
        });
        expect(result[2]).toMatchObject({
          opposite: true,
          title: {
            text: 'RPE x Duration - today ',
            x: 5,
            y: null,
          },
        });
      });

      it('builds the correct yAxis data when all metrics are grouped', () => {
        const graphData = {
          metrics: [
            {
              order: 0,
              status: {
                grouped_with: [1, 2],
                localised_unit: '1-10',
                max: 8.33,
                min: 6,
                name: 'Muscle Soreness',
                summary: 'mean',
                type: 'scale',
              },
            },
            {
              order: 1,
              status: {
                grouped_with: [0, 2],
                localised_unit: '1-10',
                max: 8.33,
                min: 6,
                name: 'Sleep Quality',
                summary: 'mean',
                type: 'scale',
              },
            },
            {
              order: 2,
              status: {
                grouped_with: [0, 1],
                localised_unit: '1-10',
                max: 8.33,
                min: 6,
                name: 'Fatigue',
                summary: 'mean',
                type: 'scale',
              },
            },
          ],
        };

        const result = buildYAxis(graphData, 'line');
        expect(Array.isArray(result)).toBe(true);
        expect(result[0]).toStrictEqual(defaultHiddenYAxis);
        expect(result[1]).toMatchObject({
          opposite: false,
          title: {
            text: '',
            x: -5,
            y: null,
          },
        });
      });
    });
  });

  describe("when the graph type is 'line'", () => {
    it('builds a line chart config', () => {
      const chartConfig = ChartConfig(chartData, 'line');

      expect(chartConfig.chart.spacingRight).toBe(null);
      expect(chartConfig.xAxis.labels.y).toBe(25);
      expect(chartConfig.yAxis[1].title.x).toBe(-5);
      expect(chartConfig.yAxis[1].title.y).toBe(null);
      expect(chartConfig.yAxis[1].labels.y).toBe(3);
    });
  });

  describe("when the graph type is 'bar'", () => {
    it('builds a bar chart config', () => {
      const chartConfig = ChartConfig(chartData, 'bar');

      expect(chartConfig.chart.spacingRight).toBe(50);
      expect(chartConfig.xAxis.labels.y).toBe(null);
      expect(chartConfig.yAxis[1].title.x).toBe(null);
      expect(chartConfig.yAxis[1].labels.y).toBe(null);
    });
  });

  describe('when the graph is an event graph', () => {
    it('builds a line chart config', () => {
      const eventChartData = getDummyData('longitudinalEvent');
      const chartConfig = ChartConfig(eventChartData, 'line', true);

      expect(chartConfig.xAxis.type).toBe('category');
      expect(chartConfig.xAxis.categories).toStrictEqual([
        'Drill 1',
        'Drill 2',
      ]);
      expect(chartConfig.series[0].data).toStrictEqual([
        {
          color: colors.s11,
          events: [
            {
              athlete_name: 'David Anderson',
              caused_unavailability: true,
              days: 1,
              description: 'Knee Post PCL reconstruction (Center)',
              status: 'resolved',
            },
            {
              athlete_name: 'Anderson Lima',
              caused_unavailability: false,
              days: 136,
              description: 'Loose body ankle joint',
              status: 'ongoing',
            },
          ],
          x: 1511436334000,
          y: 1,
        },
        {
          color: colors.p04,
          events: [
            {
              athlete_name: 'Anderson Lima',
              caused_unavailability: false,
              days: 136,
              description: 'Loose body ankle joint',
              status: 'ongoing',
            },
          ],
          x: 1514700000000,
          y: 1,
        },
      ]);
    });
  });

  describe('when the data labels are enabled', () => {
    it('builds a chart with data labels enabled', () => {
      const chartDataWithDataLabelsEnabled = {
        ...chartData,
        decorators: { data_labels: true },
      };
      const chartConfig = ChartConfig(chartDataWithDataLabelsEnabled, 'line');

      expect(chartConfig.plotOptions.series.dataLabels.enabled).toBe(true);
    });
  });

  describe('when the data labels are disabled', () => {
    it('builds a chart with data labels disabled', () => {
      const chartDataWithDataLabelsDisabled = {
        ...chartData,
        decorators: { data_labels: false },
      };
      const chartConfig = ChartConfig(chartDataWithDataLabelsDisabled, 'line');

      expect(chartConfig.plotOptions.series.dataLabels.enabled).toBe(false);
    });
  });

  describe('when clicking a point linked to a dashboard', () => {
    const originalLocation = window.location;

    beforeEach(() => {
      delete window.location;
      window.location = { assign: jest.fn() };
    });

    afterEach(() => {
      window.location = originalLocation;
      jest.clearAllMocks();
    });

    it('redirects to the correct dashboard when the time period is not a custom date', () => {
      const customChartData = _cloneDeep(chartData);
      customChartData.metrics[0].linked_dashboard_id = '3';
      customChartData.metrics[0].series[0].population_type = 'athlete';
      customChartData.metrics[0].series[0].population_id = '3';
      customChartData.time_period = 'this_season';

      const chartConfig = ChartConfig(customChartData, 'line');
      chartConfig.series[2].point.events.click();

      expect(window.location.assign).toHaveBeenCalledWith(
        '/analysis/dashboard/3?pivot=true&athletes=3&time_period=this_season'
      );
    });

    it('redirects to the correct dashboard when the time period is a custom date range', () => {
      const customChartData = _cloneDeep(chartData);
      customChartData.metrics[0].linked_dashboard_id = '3';
      customChartData.metrics[0].series[0].population_type = 'athlete';
      customChartData.metrics[0].series[0].population_id = '3';
      customChartData.time_period = 'custom_date_range';
      customChartData.date_range = {
        start_date: '2019-09-03T00:00:00+01:00',
        end_date: '2019-09-14T23:59:59+01:00',
      };

      const chartConfig = ChartConfig(customChartData, 'line');
      chartConfig.series[2].point.events.click();

      expect(window.location.assign).toHaveBeenCalledWith(
        '/analysis/dashboard/3?pivot=true&athletes=3&time_period=custom_date_range&start_date=2019-09-03T00%3A00%3A00%2B01%3A00&end_date=2019-09-14T23%3A59%3A59%2B01%3A00'
      );
    });

    it("doesn't create the point event when the time period is a drill", () => {
      const eventChartData = _cloneDeep(getDummyData('longitudinalEvent'));
      eventChartData.metrics[0].linked_dashboard_id = '3';
      eventChartData.metrics[0].status.event_type_time_period = 'game';
      const chartConfig = ChartConfig(eventChartData, 'line', true);

      expect(chartConfig.series[2].point).toBeUndefined();
    });
  });

  it('renders the correct tooltip content when the data grouping is month and the graph type is event', () => {
    const eventChartData = getDummyData('longitudinalEvent');

    const mockedThis = {
      category: 'Game 1',
      color: colors.white,
      y: 3,
      series: {
        currentDataGrouping: {
          unitName: 'month',
        },
      },
    };

    const chartConfig = ChartConfig(eventChartData, 'line', true);
    const tooltipContent =
      chartConfig.series[2].tooltip.pointFormatter.call(mockedThis);

    expect(tooltipContent).toContain('Game 1');
    expect(tooltipContent).not.toContain('Month starting');
  });

  it('renders the correct tooltip content when the data grouping is month', () => {
    const customChartData = { ...chartData };
    customChartData.metrics[0].status.type = 'number';

    const mockedThis = {
      key: '2019-01-14',
      color: colors.white,
      y: 3,
      series: {
        currentDataGrouping: {
          unitName: 'month',
        },
      },
    };

    const chartConfig = ChartConfig(customChartData, 'line');
    const tooltipContent =
      chartConfig.series[2].tooltip.pointFormatter.call(mockedThis);

    expect(tooltipContent).toContain('Month starting 2019-01-14');
  });

  it('renders the correct tooltip content when the data grouping is month and the data type is boolean', () => {
    const customChartData = { ...chartData };
    customChartData.metrics[0].status.type = 'boolean';

    const mockedThis = {
      key: '2019-01-14',
      color: colors.white,
      y: 3,
      series: {
        currentDataGrouping: {
          unitName: 'month',
        },
      },
    };

    const chartConfig = ChartConfig(customChartData, 'line');
    const tooltipContent =
      chartConfig.series[2].tooltip.pointFormatter.call(mockedThis);

    expect(tooltipContent).toContain('2019-01-14');
  });

  describe('When the graph contains medical data', () => {
    const chartDataWithMedicalData = {
      metrics: [
        {
          type: 'medical',
          main_category: 'injury',
          category: 'all_injuries',
          time_period_length: null,
          squad_selection: {
            athletes: [],
            positions: [72],
            position_groups: [25],
            squads: [],
            applies_to_squad: true,
            all_squads: false,
          },
          series: [
            {
              fullname: 'Entire Squad',
              population_type: 'entire_squad',
              population_id: null,
              datapoints: [
                [1552607999000, 20],
                [1552780799000, 13],
                [1553299199000, 2],
              ],
            },
          ],
        },
      ],
      time_period: 'this_season',
      date_range: {
        start_date: '2019-01-29T00:00:00Z',
        end_date: '2019-11-11T23:59:59Z',
      },
      decorators: { data_labels: false },
      graph_type: 'line',
      graph_group: 'longitudinal',
      aggregation_period: 'day',
      name: null,
      id: 5165,
      illnesses: [],
      injuries: [],
    };

    it('generates the correct configuration', () => {
      const chartConfig = ChartConfig(chartDataWithMedicalData, 'line');

      // The y-axis title is set correctly
      expect(chartConfig.yAxis[1].title.text).toBe(
        'Injury - No. of Injury Occurrences'
      );

      // min/max must be handled by Highchart
      expect(chartConfig.yAxis[1].min).toBe(null);
      expect(chartConfig.yAxis[1].max).toBe(null);

      // y-axis should end/start on tick
      expect(chartConfig.yAxis[1].startOnTick).toBe(true);
      expect(chartConfig.yAxis[1].endOnTick).toBe(true);

      // The aggregation method is sum for medical data
      expect(chartConfig.series[2].dataGrouping.enabled).toBe(true);
      expect(chartConfig.series[2].dataGrouping.approximation).toBe('sum');

      // Render the correct tooltip
      const tooltipContent = chartConfig.series[2].tooltip.pointFormatter.call({
        y: '30',
        key: '2019-01-14',
        series: {
          currentDataGrouping: {
            unitName: 'month',
          },
        },
      });
      expect(tooltipContent).toContain('Month starting 2019-01-14');
      expect(tooltipContent).toContain(' 30 ');
      expect(tooltipContent).toContain('Injury - No. of Injury Occurrences');

      // Render the correct datapoint labels
      const datapointLabel = chartConfig.series[2].dataLabels.formatter.call({
        y: '30',
      });
      expect(datapointLabel).toBe('30');

      // Render the correct y axis labels
      const yAxisLabel = chartConfig.yAxis[1].labels.formatter.call({
        value: '30',
      });
      expect(yAxisLabel).toBe('30');
    });
  });

  describe('getSeriesZIndex', () => {
    it('returns 0 if the metric style is column', () => {
      expect(getSeriesZIndex('column')).toBe(0);
    });

    it('returns 1 if the metric style is line', () => {
      expect(getSeriesZIndex('line')).toBe(1);
    });

    it('returns null if the metric style is anything else', () => {
      expect(getSeriesZIndex('bar')).toBe(null);
    });
  });

  it('generates the correct configuration when the graph type is combination', () => {
    const combinationChartData = {
      ...chartData,
      metrics: chartData.metrics.map((metric) => ({
        ...metric,
        metric_style: 'line',
      })),
    };

    const chartConfig = ChartConfig(combinationChartData, 'combination');

    // Series 0 and 1 are the decorators, so we only test the series 2 and 3
    expect(chartConfig.series[2].type).toBe('line');
    expect(chartConfig.series[2].zIndex).toBe(1);
    expect(chartConfig.series[3].type).toBe('line');
    expect(chartConfig.series[3].zIndex).toBe(1);
  });
});
