import _cloneDeep from 'lodash/cloneDeep';
import { getDummyData } from '../DummyData';
import SummaryDonutChartConfig from '../SummaryDonutChartConfig';

describe('SummaryDonutChartConfig', () => {
  const chartData = getDummyData('summaryDonut');

  describe("when the graph type is 'donut'", () => {
    it('builds a donut chart config', () => {
      const chartConfig = SummaryDonutChartConfig(chartData, 'donut');

      expect(chartConfig.plotOptions.pie.innerSize).toBe('60%');
    });
  });

  describe("when the graph type is 'pie'", () => {
    it('builds a pie chart config', () => {
      const chartConfig = SummaryDonutChartConfig(chartData, 'pie');

      expect(chartConfig.plotOptions.pie.innerSize).toBe('0%');
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

    it('redirects to the correct dashboard', () => {
      const customChartData = _cloneDeep(chartData);
      customChartData.metrics[0].linked_dashboard_id = '3';
      customChartData.metrics[0].series[0].population_type = 'athlete';
      customChartData.metrics[0].series[0].population_id = '3';
      customChartData.time_period = 'this_season';

      const chartConfig = SummaryDonutChartConfig(customChartData, 'donut');
      chartConfig.series[0].point.events.click();

      expect(window.location.assign).toHaveBeenCalledWith(
        '/analysis/dashboard/3?pivot=true&athletes=3&time_period=this_season'
      );
    });

    it("doesn't redirect when the time period is a drill", () => {
      const customChartData = _cloneDeep(chartData);
      customChartData.metrics[0].linked_dashboard_id = '3';
      customChartData.metrics[0].status = { event_type_time_period: 'game' };

      const chartConfig = SummaryDonutChartConfig(customChartData, 'donut');
      chartConfig.series[0].point.events.click();

      expect(window.location.assign).not.toHaveBeenCalled();
    });
  });
});
