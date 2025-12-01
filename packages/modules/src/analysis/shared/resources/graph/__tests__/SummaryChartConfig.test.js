import { getDummyData } from '../DummyData';
import SummaryChartConfig, {
  shouldShowFirstLabel,
} from '../SummaryChartConfig';

describe('shouldShowFirstLabel', () => {
  it('should show the first label if the graph is normalized', () => {
    const result = shouldShowFirstLabel({ scale_type: 'normalized' });
    expect(result).toBe(true);
  });

  it('should show the first label if the graph is denormalized and all the metrics min values are the same', () => {
    const result = shouldShowFirstLabel({
      scale_type: 'denormalized',
      metrics: [{ min: 5 }, { min: 5 }, { min: 5 }],
    });
    expect(result).toBe(true);
  });

  it('should not show the first label if the graph is denormalized and some metrics min values are different', () => {
    const result = shouldShowFirstLabel({
      scale_type: 'denormalized',
      metrics: [{ min: 5 }, { min: 2 }, { min: 5 }],
    });
    expect(result).toBe(false);
  });
});

describe('SummaryChartConfig', () => {
  const chartData = getDummyData('summary');

  describe("when the graph type is 'spider'", () => {
    it('builds a spider chart config', () => {
      const chartConfig = SummaryChartConfig(chartData, 'spider');

      expect(chartConfig.chart.type).toBe('line');
      expect(chartConfig.yAxis[0].gridLineInterpolation).toBe('polygon');
    });
  });

  describe("when the graph type is 'radar'", () => {
    it('builds a radar chart config', () => {
      const chartConfig = SummaryChartConfig(chartData, 'radar');

      expect(chartConfig.chart.type).toBe('area');
      expect(chartConfig.yAxis[0].gridLineInterpolation).toBe('circle');
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
      jest.restoreAllMocks();
    });

    it('redirects to the correct dashboard when the time period is not a custom date', () => {
      const data = { ...getDummyData('summary') };
      data.metrics[0].linked_dashboard_id = '3';
      data.series[0].population_type = 'athlete';
      data.series[0].population_id = '3';
      data.series[0].timePeriod = 'this_season';

      const chartConfig = SummaryChartConfig(data, 'radar');

      const mockedThis = {
        index: 0,
      };
      chartConfig.series[0].point.events.click.call(mockedThis);

      expect(window.location.assign).toHaveBeenCalledWith(
        '/analysis/dashboard/3?pivot=true&athletes=3&time_period=this_season'
      );
    });

    it('redirects to the correct dashboard when the time period is a custom date range', () => {
      const data = { ...getDummyData('summary') };
      data.metrics[0].linked_dashboard_id = '3';
      data.series[0].population_type = 'athlete';
      data.series[0].population_id = '3';
      data.series[0].timePeriod = 'custom_date_range';
      data.series[0].dateRange = {
        startDate: '2019-09-03T00:00:00+01:00',
        endDate: '2019-09-14T23:59:59+01:00',
      };

      const chartConfig = SummaryChartConfig(data, 'radar');

      const mockedThis = {
        index: 0,
      };
      chartConfig.series[0].point.events.click.call(mockedThis);

      expect(window.location.assign).toHaveBeenCalledWith(
        '/analysis/dashboard/3?pivot=true&athletes=3&time_period=custom_date_range&start_date=2019-09-03T00%3A00%3A00%2B01%3A00&end_date=2019-09-14T23%3A59%3A59%2B01%3A00'
      );
    });

    it("doesn't redirect when the time period is a drill", () => {
      const data = { ...getDummyData('summary') };
      data.metrics[0].linked_dashboard_id = '3';
      data.series[0].event_type_time_period = 'game';

      const chartConfig = SummaryChartConfig(data, 'radar');

      const mockedThis = {
        index: 0,
      };
      chartConfig.series[0].point.events.click.call(mockedThis);

      expect(window.location.assign).not.toHaveBeenCalled();
    });
  });

  describe('when the scale type is "normalized"', () => {
    it('builds the correct chart config', () => {
      const normalizedChartConfig = {
        ...chartData,
        scale_type: 'normalized',
        series: [{ zScores: [1, 2, 3] }],
      };
      const chartConfig = SummaryChartConfig(normalizedChartConfig, 'spider');

      expect(chartConfig.chart.parallelCoordinates).toBe(false);
      expect(chartConfig.series[0].data).toStrictEqual([1, 2, 3]);
      expect(chartConfig.series[0].pointPlacement).toBe('on');

      expect(chartConfig.yAxis[0]).toStrictEqual({
        gridLineInterpolation: 'polygon',
        lineWidth: 0,
        min: null,
        max: null,
        endOnTick: true,
        startOnTick: true,
        tickAmount: undefined,
        showFirstLabel: true,
        showLastLabel: true,
        softMax: 3,
        softMin: -3,
        tickInterval: 1,
        labels: {
          style: { 'pointer-events': 'none', opacity: 1 },
        },
      });
    });
  });

  describe('when the scale type is "denormalized"', () => {
    it('builds the correct chart config', () => {
      const denormalizedChartConfig = {
        ...chartData,
        scale_type: 'denormalized',
        series: [{ values: [1, 2, 3] }],
        metrics: [
          {
            name: 'Mood',
            min: 1,
            max: 10,
          },
          {
            name: 'Sleep Duration',
          },
        ],
      };
      const chartConfig = SummaryChartConfig(denormalizedChartConfig, 'spider');

      expect(chartConfig.chart.parallelCoordinates).toBe(true);
      expect(chartConfig.series[0].data).toStrictEqual([1, 2, 3]);
      expect(chartConfig.series[0].pointPlacement).toBe(null);

      expect(chartConfig.yAxis[0]).toStrictEqual({
        gridLineInterpolation: 'polygon',
        lineWidth: 0,
        min: 1,
        max: 10,
        endOnTick: true,
        startOnTick: true,
        tickAmount: 5,
        showFirstLabel: false,
        showLastLabel: true,
        softMax: null,
        softMin: null,
        tickInterval: null,
        labels: {
          style: { 'pointer-events': 'none', opacity: 1 },
        },
      });
      expect(chartConfig.yAxis[1]).toStrictEqual({
        gridLineInterpolation: 'polygon',
        lineWidth: 0,
        min: null,
        max: null,
        endOnTick: true,
        startOnTick: true,
        tickAmount: 5,
        showFirstLabel: false,
        showLastLabel: true,
        softMax: null,
        softMin: null,
        tickInterval: null,
        labels: {
          style: { 'pointer-events': 'none', opacity: 1 },
        },
      });
    });
  });
});
