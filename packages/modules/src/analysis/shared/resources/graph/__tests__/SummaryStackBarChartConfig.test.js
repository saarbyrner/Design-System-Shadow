import _cloneDeep from 'lodash/cloneDeep';
import { colors } from '@kitman/common/src/variables';
import { getDummyData } from '../DummyData';
import SummaryStackBarChartConfig from '../SummaryStackBarChartConfig';

describe('SummaryStackBarChartConfig', () => {
  describe('when the standard-date-formatting flag is off', () => {
    beforeEach(() => {
      window.setFlag('standard-date-formatting', false);
    });

    describe("when the graph data doesn't contain a category division", () => {
      const chartData = {
        metrics: [
          {
            type: 'medical',
            main_category: 'illness',
            category: 'body_area',
            category_division: null,
            squad_selection: {
              athletes: [],
              positions: [71],
              position_groups: [],
              applies_to_squad: false,
            },
            series: [
              {
                name: 'Ankle',
                datapoints: [
                  {
                    name: 'Athlete 1',
                    y: 10,
                  },
                  {
                    name: 'Athlete 1',
                    y: 3,
                  },
                ],
              },
            ],
          },
        ],
        date_range: {
          start_date: '2017-02-10T00:00:00Z',
          end_date: '2017-04-12T00:00:00Z',
        },
        time_period: 'custom_date_range',
        graphGroup: 'summary_stack_bar',
        decorators: {
          data_labels: false,
        },
      };

      it('builds the correct chart config', () => {
        const chartConfig = SummaryStackBarChartConfig(chartData);

        // X Axis
        expect(chartConfig.xAxis.opposite).toBe(false);

        // Y Axis
        expect(chartConfig.yAxis[0].title.text).toBe('No. of Illnesses');
        expect(chartConfig.yAxis[0].stackLabels.enabled).toBe(false);

        // Series
        expect(chartConfig.series.length).toBe(1);
        expect(chartConfig.series[0].name).toBe('Ankle');
        expect(chartConfig.series[0].type).toBe('column');
        expect(chartConfig.series[0].stack).toBe(null);
        expect(chartConfig.series[0].data).toStrictEqual([
          {
            name: 'Athlete 1',
            y: 10,
          },
          {
            name: 'Athlete 1',
            y: 3,
          },
        ]);

        // Tooltip
        chartConfig.series[0].tooltip.name = 'Athlete 1';
        chartConfig.series[0].tooltip.y = 3;
        const tooltipHTML = chartConfig.series[0].tooltip.pointFormatter();

        expect(tooltipHTML).toContain('No. of Illnesses:');
        expect(tooltipHTML).toContain('3');

        expect(tooltipHTML).toContain('Population:');
        expect(tooltipHTML).toContain('Athlete 1');

        expect(tooltipHTML).toContain('Date Range:');
        expect(tooltipHTML).toContain('10 Feb 2017 - 12 Apr 2017');

        expect(tooltipHTML).toContain('Main category:');
        expect(tooltipHTML).toContain('Body Area: Ankle');

        expect(tooltipHTML).toContain('Sub category:');
        expect(tooltipHTML).toContain('-');
      });
    });

    describe('when the graph data contains a category division', () => {
      const chartData = {
        metrics: [
          {
            type: 'medical',
            main_category: 'injury',
            category: 'body_area',
            category_division: 'pathology',
            squad_selection: {
              athletes: [],
              positions: [71],
              position_groups: [],
              applies_to_squad: false,
            },
            series: [
              {
                name: 'Pathology 1',
                stack: 'Forwards',
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
            ],
          },
        ],
        date_range: {
          start_date: '2017-02-10T00:00:00Z',
          end_date: '2017-04-12T00:00:00Z',
        },
        time_period: 'custom_date_range',
        graphGroup: 'summary_stack_bar',
        decorators: {
          data_labels: false,
        },
      };

      it('builds the correct chart config', () => {
        const chartConfig = SummaryStackBarChartConfig(chartData);

        // Y Axis
        expect(chartConfig.yAxis[0].title.text).toBe('No. of Injuries');
        expect(chartConfig.yAxis[0].stackLabels.enabled).toBe(false);

        // Series
        expect(chartConfig.series.length).toBe(1);
        expect(chartConfig.series[0].name).toBe('Pathology 1');
        expect(chartConfig.series[0].type).toBe('column');
        expect(chartConfig.series[0].stack).toBe('Forwards');
        expect(chartConfig.series[0].data).toStrictEqual([
          {
            name: 'Ankle',
            y: 10,
          },
          {
            name: 'Foot',
            y: 3,
          },
        ]);

        // Tooltip
        chartConfig.series[0].tooltip.name = 'Ankle';
        chartConfig.series[0].tooltip.y = 5;
        const tooltipHTML = chartConfig.series[0].tooltip.pointFormatter();

        expect(tooltipHTML).toContain('No. of Injuries:');
        expect(tooltipHTML).toContain('5');

        expect(tooltipHTML).toContain('Population:');
        expect(tooltipHTML).toContain('Forwards');

        expect(tooltipHTML).toContain('Date Range:');
        expect(tooltipHTML).toContain('10 Feb 2017 - 12 Apr 2017');

        expect(tooltipHTML).toContain('Main category:');
        expect(tooltipHTML).toContain('Body Area: Ankle');

        expect(tooltipHTML).toContain('Sub category:');
        expect(tooltipHTML).toContain('Pathology: Pathology 1');
      });
    });
  });

  describe('when the standard-date-formatting flag is on', () => {
    beforeEach(() => {
      window.setFlag('standard-date-formatting', true);
    });

    afterEach(() => {
      window.setFlag('standard-date-formatting', false);
    });

    describe("when the graph data doesn't contain a category division", () => {
      const chartData = {
        metrics: [
          {
            type: 'medical',
            main_category: 'illness',
            category: 'body_area',
            category_division: null,
            squad_selection: {
              athletes: [],
              positions: [71],
              position_groups: [],
              applies_to_squad: false,
            },
            series: [
              {
                name: 'Ankle',
                datapoints: [
                  {
                    name: 'Athlete 1',
                    y: 10,
                  },
                  {
                    name: 'Athlete 1',
                    y: 3,
                  },
                ],
              },
            ],
          },
        ],
        date_range: {
          start_date: '2017-02-10T00:00:00Z',
          end_date: '2017-04-12T00:00:00Z',
        },
        time_period: 'custom_date_range',
        graphGroup: 'summary_stack_bar',
        decorators: {
          data_labels: false,
        },
      };

      it('builds the correct chart config', () => {
        const chartConfig = SummaryStackBarChartConfig(chartData);

        // X Axis
        expect(chartConfig.xAxis.opposite).toBe(false);

        // Y Axis
        expect(chartConfig.yAxis[0].title.text).toBe('No. of Illnesses');
        expect(chartConfig.yAxis[0].stackLabels.enabled).toBe(false);

        // Series
        expect(chartConfig.series.length).toBe(1);
        expect(chartConfig.series[0].name).toBe('Ankle');
        expect(chartConfig.series[0].type).toBe('column');
        expect(chartConfig.series[0].stack).toBe(null);
        expect(chartConfig.series[0].data).toStrictEqual([
          {
            name: 'Athlete 1',
            y: 10,
          },
          {
            name: 'Athlete 1',
            y: 3,
          },
        ]);

        // Tooltip
        chartConfig.series[0].tooltip.name = 'Athlete 1';
        chartConfig.series[0].tooltip.y = 3;
        const tooltipHTML = chartConfig.series[0].tooltip.pointFormatter();

        expect(tooltipHTML).toContain('No. of Illnesses:');
        expect(tooltipHTML).toContain('3');

        expect(tooltipHTML).toContain('Population:');
        expect(tooltipHTML).toContain('Athlete 1');

        expect(tooltipHTML).toContain('Date Range:');
        expect(tooltipHTML).toContain('Feb 10, 2017 - Apr 12, 2017');

        expect(tooltipHTML).toContain('Main category:');
        expect(tooltipHTML).toContain('Body Area: Ankle');

        expect(tooltipHTML).toContain('Sub category:');
        expect(tooltipHTML).toContain('-');
      });
    });

    describe('when the graph data contains a category division', () => {
      const chartData = {
        metrics: [
          {
            type: 'medical',
            main_category: 'injury',
            category: 'body_area',
            category_division: 'pathology',
            squad_selection: {
              athletes: [],
              positions: [71],
              position_groups: [],
              applies_to_squad: false,
            },
            series: [
              {
                name: 'Pathology 1',
                stack: 'Forwards',
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
            ],
          },
        ],
        date_range: {
          start_date: '2017-02-10T00:00:00Z',
          end_date: '2017-04-12T00:00:00Z',
        },
        time_period: 'custom_date_range',
        graphGroup: 'summary_stack_bar',
        decorators: {
          data_labels: false,
        },
      };

      it('builds the correct chart config', () => {
        const chartConfig = SummaryStackBarChartConfig(chartData);

        // Y Axis
        expect(chartConfig.yAxis[0].title.text).toBe('No. of Injuries');
        expect(chartConfig.yAxis[0].stackLabels.enabled).toBe(false);

        // Series
        expect(chartConfig.series.length).toBe(1);
        expect(chartConfig.series[0].name).toBe('Pathology 1');
        expect(chartConfig.series[0].type).toBe('column');
        expect(chartConfig.series[0].stack).toBe('Forwards');
        expect(chartConfig.series[0].data).toStrictEqual([
          {
            name: 'Ankle',
            y: 10,
          },
          {
            name: 'Foot',
            y: 3,
          },
        ]);

        // Tooltip
        chartConfig.series[0].tooltip.name = 'Ankle';
        chartConfig.series[0].tooltip.y = 5;
        const tooltipHTML = chartConfig.series[0].tooltip.pointFormatter();

        expect(tooltipHTML).toContain('No. of Injuries:');
        expect(tooltipHTML).toContain('5');

        expect(tooltipHTML).toContain('Population:');
        expect(tooltipHTML).toContain('Forwards');

        expect(tooltipHTML).toContain('Date Range:');
        expect(tooltipHTML).toContain('Feb 10, 2017 - Apr 12, 2017');

        expect(tooltipHTML).toContain('Main category:');
        expect(tooltipHTML).toContain('Body Area: Ankle');

        expect(tooltipHTML).toContain('Sub category:');
        expect(tooltipHTML).toContain('Pathology: Pathology 1');
      });
    });
  });

  describe('when the graph data contains a category division and multiple populations', () => {
    const chartData = {
      metrics: [
        {
          type: 'medical',
          main_category: 'injury',
          category: 'body_area',
          category_division: 'pathology',
          squad_selection: {
            athletes: [],
            positions: [71],
            position_groups: [],
            applies_to_squad: false,
          },
          series: [
            {
              name: 'Pathology 1',
              stack: 'Athlete 1',
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
              name: 'Pathology 2',
              stack: 'Athlete 1',
              datapoints: [
                {
                  name: 'Ankle',
                  y: 8,
                },
                {
                  name: 'Foot',
                  y: 3,
                },
              ],
            },
            {
              name: 'Pathology 1',
              stack: 'Athlete 2',
              datapoints: [
                {
                  name: 'Ankle',
                  y: 7,
                },
                {
                  name: 'Foot',
                  y: 0,
                },
              ],
            },
            {
              name: 'Pathology 2',
              stack: 'Athlete 2',
              datapoints: [
                {
                  name: 'Ankle',
                  y: 4,
                },
                {
                  name: 'Foot',
                  y: 2,
                },
              ],
            },
          ],
        },
      ],
      date_range: {
        start_date: '2017-10-02',
        end_date: '2017-12-04',
      },
      time_period: 'last_x_days',
      graphGroup: 'summary_stack_bar',
      decorators: {
        data_labels: false,
      },
    };

    it('builds the correct chart config', () => {
      const chartConfig = SummaryStackBarChartConfig(chartData, 'column');

      // X Axis
      expect(chartConfig.xAxis.opposite).toBe(true);

      // Y Axis
      expect(chartConfig.yAxis[0].title.text).toBe('No. of Injuries');
      expect(chartConfig.yAxis[0].stackLabels.enabled).toBe(true);

      // Series
      expect(chartConfig.series.length).toBe(4);
      expect(chartConfig.series[0].name).toBe('Pathology 1');
      expect(chartConfig.series[0].stack).toBe('Athlete 1');
      expect(chartConfig.series[0].color).toBe(colors.p01?.toUpperCase());

      expect(chartConfig.series[1].name).toBe('Pathology 2');
      expect(chartConfig.series[1].stack).toBe('Athlete 1');
      expect(chartConfig.series[1].color).toBe(colors.s08?.toUpperCase());

      expect(chartConfig.series[2].name).toBe('Pathology 1');
      expect(chartConfig.series[2].stack).toBe('Athlete 2');
      expect(chartConfig.series[2].color).toBe(colors.p01?.toUpperCase());

      expect(chartConfig.series[3].name).toBe('Pathology 2');
      expect(chartConfig.series[3].stack).toBe('Athlete 2');
      expect(chartConfig.series[3].color).toBe(colors.s08?.toUpperCase());
    });
  });

  describe("when the graph type is 'column'", () => {
    it('builds a column chart config', () => {
      const chartData = getDummyData('summaryStackBar');
      const chartConfig = SummaryStackBarChartConfig(chartData, 'column');

      expect(chartConfig.chart.inverted).toBe(false);

      expect(chartConfig.yAxis[0].title.x).toBe(-5);
      expect(chartConfig.yAxis[0].title.y).toBe(null);

      expect(chartConfig.yAxis[0].labels.y).toBe(3);

      expect(chartConfig.yAxis[0].stackLabels.rotation).toBe(-45);
      expect(chartConfig.yAxis[0].stackLabels.textAlign).toBe('center');
      expect(chartConfig.yAxis[0].stackLabels.verticalAlign).toBe('bottom');
    });
  });

  describe("when the graph type is 'bar'", () => {
    it('builds a bar chart config', () => {
      const chartData = getDummyData('summaryStackBar');
      const chartConfig = SummaryStackBarChartConfig(chartData, 'bar');

      expect(chartConfig.xAxis.opposite).toBe(false);

      expect(chartConfig.chart.inverted).toBe(true);

      expect(chartConfig.yAxis[0].title.x).toBe(null);
      expect(chartConfig.yAxis[0].title.y).toBe(3);

      expect(chartConfig.yAxis[0].labels.y).toBe(null);

      expect(chartConfig.yAxis[0].stackLabels.rotation).toBe(0);
      expect(chartConfig.yAxis[0].stackLabels.textAlign).toBe(null);
      expect(chartConfig.yAxis[0].stackLabels.verticalAlign).toBe(null);
    });
  });

  describe('when the data labels are enabled', () => {
    it('builds a chart with data labels enabled', () => {
      const chartData = {
        ...getDummyData('summaryStackBar'),
        decorators: { data_labels: true },
      };
      const chartConfig = SummaryStackBarChartConfig(chartData, 'bar');

      expect(chartConfig.plotOptions.series.dataLabels.enabled).toBe(true);
    });
  });

  describe('when the data labels are disabled', () => {
    it('builds a chart with data labels disabled', () => {
      const chartData = {
        ...getDummyData('summaryStackBar'),
        decorators: { data_labels: false },
      };
      const chartConfig = SummaryStackBarChartConfig(chartData, 'bar');

      expect(chartConfig.plotOptions.series.dataLabels.enabled).toBe(false);
    });
  });

  describe('when the sorting is enabled', () => {
    beforeEach(() => {
      window.setFlag('graph-sorting', true);
    });

    afterEach(() => {
      window.setFlag('graph-sorting', false);
    });

    it('builds a chart with a categories array for sorting by', () => {
      const chartData = {
        ...getDummyData('summaryStackBar'),
        sorting: {
          enabled: true,
          order: 'asc',
          metricIndex: 0,
          sortKey: 'mainCategoryName',
        },
      };
      const chartConfig = SummaryStackBarChartConfig(chartData, 'bar');

      expect(chartConfig.xAxis.categories.length).toBeGreaterThan(0);
    });
  });

  describe('when the sorting is disabled', () => {
    beforeEach(() => {
      window.setFlag('graph-sorting', true);
    });

    afterEach(() => {
      window.setFlag('graph-sorting', false);
    });

    it('builds a chart with a null categories array', () => {
      const chartData = {
        ...getDummyData('summaryStackBar'),
        sorting: { enabled: false, order: '' },
      };
      const chartConfig = SummaryStackBarChartConfig(chartData, 'bar');

      expect(chartConfig.xAxis.categories).toBe(null);
    });
  });

  describe('when the graph-sorting feature flag is disabled', () => {
    beforeEach(() => {
      window.setFlag('graph-sorting', false);
    });

    afterEach(() => {
      window.setFlag('graph-sorting', false);
    });

    it('builds a chart with a null categories array', () => {
      const chartData = {
        ...getDummyData('summaryStackBar'),
        sorting: {
          enabled: true,
          order: 'asc',
          metricIndex: 0,
          sortKey: 'mainCategoryName',
        },
      };
      const chartConfig = SummaryStackBarChartConfig(chartData, 'bar');

      expect(chartConfig.xAxis.categories).toBe(null);
    });
  });

  describe('when hide-null-values feature flag is active', () => {
    beforeEach(() => {
      window.setFlag('hide-null-values', true);
    });

    afterEach(() => {
      window.setFlag('hide-null-values', false);
    });

    describe('when hide_nulls decorator is enabled', () => {
      it('builds a chartConfig series without null values', () => {
        const mutableData = _cloneDeep(getDummyData('summaryStackBar'));
        mutableData.metrics[0].series[0].datapoints[0].y = null; // Entire Squad : Ankle
        mutableData.decorators = { hide_nulls: true };

        const chartConfig = SummaryStackBarChartConfig(mutableData, 'bar');
        expect(chartConfig.series[0].data.length).toBe(1);
        expect(chartConfig.series[0].data[0].name).toBe('Foot');
      });
    });

    describe('when hide_zeros decorator is enabled', () => {
      it('builds a chartConfig series without zero values', () => {
        const mutableData = _cloneDeep(getDummyData('summaryStackBar'));
        mutableData.metrics[0].series[0].datapoints[1].y = 0; // Entire Squad : Foot
        mutableData.decorators = { hide_zeros: true };

        const chartConfig = SummaryStackBarChartConfig(mutableData, 'bar');
        expect(chartConfig.series[0].data.length).toBe(1);
        expect(chartConfig.series[0].data[0].name).toBe('Ankle');
      });
    });

    describe('when hide_nulls decorator is NOT enabled', () => {
      it('builds a chartConfig series with null values', () => {
        const mutableData = _cloneDeep(getDummyData('summaryStackBar'));
        mutableData.metrics[0].series[0].datapoints[0].y = null; // Entire Squad : Ankle
        mutableData.decorators = { hide_nulls: false };

        const chartConfig = SummaryStackBarChartConfig(mutableData, 'bar');
        expect(chartConfig.series[0].data.length).toBe(2);
        expect(chartConfig.series[0].data[0].name).toBe('Ankle');
        expect(chartConfig.series[0].data[0].y).toBe(null);
        expect(chartConfig.series[0].data[1].name).toBe('Foot');
      });
    });

    describe('when hide_zeros decorator is NOT enabled', () => {
      it('builds a chartConfig series with zero values', () => {
        const mutableData = _cloneDeep(getDummyData('summaryStackBar'));
        mutableData.metrics[0].series[0].datapoints[1].y = 0; // Entire Squad : Foot
        mutableData.decorators = { hide_zeros: false };

        const chartConfig = SummaryStackBarChartConfig(mutableData, 'bar');
        expect(chartConfig.series[0].data.length).toBe(2);
        expect(chartConfig.series[0].data[0].name).toBe('Ankle');
        expect(chartConfig.series[0].data[1].name).toBe('Foot');
        expect(chartConfig.series[0].data[1].y).toBe(0);
      });
    });
  });

  describe('when clicking a point linked to a dashboard', () => {
    const originalLocation = global.window.location;

    beforeEach(() => {
      delete global.window.location;
      global.window.location = { assign: jest.fn() };
    });

    afterEach(() => {
      global.window.location = originalLocation;
    });

    it('redirects to the correct dashboard', () => {
      const customChartData = _cloneDeep(getDummyData('summaryStackBar'));
      customChartData.metrics[0].linked_dashboard_id = '3';
      customChartData.metrics[0].series[0].population_type = 'athlete';
      customChartData.metrics[0].series[0].population_id = '3';
      customChartData.time_period = 'this_season';

      const chartConfig = SummaryStackBarChartConfig(customChartData, 'bar');
      chartConfig.series[0].point.events.click();

      expect(global.window.location.assign).toHaveBeenCalledWith(
        '/analysis/dashboard/3?pivot=true&athletes=3&time_period=this_season'
      );
    });

    it('redirects to the correct dashboard when the population is stored at the datapoint level', () => {
      const customChartData = _cloneDeep(getDummyData('summaryStackBar'));
      customChartData.metrics[0].linked_dashboard_id = '3';
      customChartData.time_period = 'this_season';

      const mockedThis = {
        population_type: 'athlete',
        population_id: '3',
      };

      const chartConfig = SummaryStackBarChartConfig(customChartData, 'bar');
      chartConfig.series[0].point.events.click.call(mockedThis);

      expect(global.window.location.assign).toHaveBeenCalledWith(
        '/analysis/dashboard/3?pivot=true&athletes=3&time_period=this_season'
      );
    });

    it("doesn't redirect when the time period is a drill", () => {
      const customChartData = _cloneDeep(getDummyData('summaryStackBar'));
      customChartData.metrics[0].linked_dashboard_id = '3';
      customChartData.metrics[0].status = { event_type_time_period: 'game' };

      const chartConfig = SummaryStackBarChartConfig(customChartData, 'bar');
      chartConfig.series[0].point.events.click();

      expect(global.window.location.assign).not.toHaveBeenCalled();
    });
  });
});
