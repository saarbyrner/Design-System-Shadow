import _cloneDeep from 'lodash/cloneDeep';
import { getDummyData } from '../DummyData';
import {
  buildYAxis,
  ChartConfig,
  getTitleXOffset,
  getTitleYOffset,
  shouldAllowDecimal,
} from '../SummaryBarChartConfig';

describe('SummaryBarChartConfig', () => {
  const chartData = getDummyData('summaryBar');

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

  describe('getTitleXOffset', () => {
    it('returns null if graphType is not column', () => {
      expect(getTitleXOffset(true, 'bar')).toBe(null);
    });

    it('returns -5 if graphType is column and isLeftSideMetric', () => {
      expect(getTitleXOffset(true, 'column')).toBe(-5);
    });

    it('returns 5 if graphType is column and isLeftSideMetric is false', () => {
      expect(getTitleXOffset(false, 'column')).toBe(5);
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

  describe('buildYAxis', () => {
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
            type: 'standard',
          },
        ],
      };

      it('builds the correct yAxis data', () => {
        expect(buildYAxis(graphData, 'column')).toStrictEqual(
          expect.arrayContaining([
            expect.objectContaining({
              opposite: false,
              title: expect.objectContaining({
                text: 'Body Weight (Kg)',
                x: -5,
                y: null,
              }),
            }),
          ])
        );
      });

      describe('when the metric is medical type', () => {
        const medicalGraphData = {
          metrics: [
            {
              category: 'all_injuries',
              main_category: 'injury',
              status: {
                grouped_with: [],
                localised_unit: 'Kg',
                max: null,
                min: null,
                name: 'Body Weight',
                summary: 'mean',
                type: 'number',
              },
              type: 'medical',
            },
          ],
        };

        it('builds the correct yAxis data', () => {
          expect(buildYAxis(medicalGraphData, 'column')).toStrictEqual(
            expect.arrayContaining([
              expect.objectContaining({
                opposite: false,
                title: expect.objectContaining({
                  text: 'Injury - No. of Injury Occurrences',
                  x: -5,
                  y: null,
                }),
              }),
            ])
          );
        });
      });
    });

    describe('when building a graph with 2 medical metrics', () => {
      it('builds the correct yAxis data', () => {
        const graphData = {
          metrics: [
            {
              type: 'medical',
              main_category: 'illness',
              category: 'all_illnesses',
            },
            {
              type: 'medical',
              main_category: 'illness',
              category: 'body_area',
            },
          ],
        };
        expect(buildYAxis(graphData, 'column')).toStrictEqual(
          expect.arrayContaining([
            expect.objectContaining({
              opposite: false,
              title: expect.objectContaining({
                text: 'Illness - No. of Illness Occurrences',
                x: -5,
                y: null,
              }),
            }),
            expect.objectContaining({
              opposite: true,
              title: expect.objectContaining({
                text: 'Illness - Body Area',
                x: 5,
                y: null,
              }),
            }),
          ])
        );
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
        expect(buildYAxis(graphData, 'column')).toStrictEqual(
          expect.arrayContaining([
            expect.objectContaining({
              opposite: false,
              title: expect.objectContaining({
                text: 'Body Weight (Kg)',
                x: -5,
                y: null,
              }),
            }),
            expect.objectContaining({
              opposite: true,
              title: expect.objectContaining({
                text: 'Fatigue (1-10)',
                x: 5,
                y: null,
              }),
            }),
          ])
        );
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
        expect(buildYAxis(graphData, 'column')).toStrictEqual(
          expect.arrayContaining([
            expect.objectContaining({
              opposite: false,
              title: expect.objectContaining({
                text: '',
                x: -5,
                y: null,
              }),
            }),
          ])
        );
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
              type: 'standard',
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
              type: 'standard',
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
              type: 'standard',
            },
          ],
        };
        expect(buildYAxis(graphData, 'column')).toStrictEqual(
          expect.arrayContaining([
            expect.objectContaining({
              opposite: false,
              title: expect.objectContaining({
                text: 'Body Weight (Kg)',
                x: -5,
                y: null,
              }),
            }),
            expect.objectContaining({
              opposite: true,
              title: expect.objectContaining({
                text: 'Fatigue (1-10)',
                x: 5,
                y: null,
              }),
            }),
            expect.objectContaining({
              opposite: true,
              title: expect.objectContaining({
                text: 'RPE x Duration - today ',
                x: 5,
                y: null,
              }),
            }),
          ])
        );
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
              type: 'standard',
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
              type: 'standard',
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
              type: 'standard',
            },
          ],
        };
        expect(buildYAxis(graphData, 'column')).toStrictEqual(
          expect.arrayContaining([
            expect.objectContaining({
              opposite: false,
              title: expect.objectContaining({
                text: 'RPE x Duration - today ',
                x: -5,
                y: null,
              }),
            }),
            expect.objectContaining({
              opposite: true,
              title: expect.objectContaining({
                text: '',
                x: 5,
                y: null,
              }),
            }),
          ])
        );
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
              type: 'standard',
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
              type: 'standard',
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
              type: 'standard',
            },
          ],
        };
        expect(buildYAxis(graphData, 'column')).toStrictEqual(
          expect.arrayContaining([
            expect.objectContaining({
              opposite: false,
              title: expect.objectContaining({
                text: '',
                x: -5,
                y: null,
              }),
            }),
            expect.objectContaining({
              opposite: true,
              title: expect.objectContaining({
                text: 'RPE x Duration - today ',
                x: 5,
                y: null,
              }),
            }),
          ])
        );
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
              type: 'standard',
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
              type: 'standard',
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
              type: 'standard',
            },
          ],
        };
        expect(buildYAxis(graphData, 'column')).toStrictEqual(
          expect.arrayContaining([
            expect.objectContaining({
              opposite: false,
              title: expect.objectContaining({
                text: '',
                x: -5,
                y: null,
              }),
            }),
            expect.objectContaining({
              opposite: true,
              title: expect.objectContaining({
                text: 'RPE x Duration - today ',
                x: 5,
                y: null,
              }),
            }),
          ])
        );
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
              type: 'standard',
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
              type: 'standard',
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
              type: 'standard',
            },
          ],
        };
        expect(buildYAxis(graphData, 'column')).toStrictEqual(
          expect.arrayContaining([
            expect.objectContaining({
              opposite: false,
              title: expect.objectContaining({
                text: '',
                x: -5,
                y: null,
              }),
            }),
          ])
        );
      });
    });
  });

  describe("when the graph type is 'column'", () => {
    it('builds a column chart config', () => {
      const chartConfig = ChartConfig(chartData, 'column');

      expect(chartConfig.series[0].type).toBe('column');
      expect(chartConfig.xAxis.labels.y).toBe(25);
      expect(chartConfig.yAxis[0].title.x).toBe(-5);
      expect(chartConfig.yAxis[1].title.x).toBe(5);
      expect(chartConfig.yAxis[0].title.y).toBe(null);
      expect(chartConfig.yAxis[1].title.y).toBe(null);
      expect(chartConfig.yAxis[0].labels.y).toBe(3);
    });
  });

  describe("when the graph type is 'bar'", () => {
    it('builds a bar chart config', () => {
      const chartConfig = ChartConfig(chartData, 'bar');

      expect(chartConfig.series[0].type).toBe('bar');
      expect(chartConfig.xAxis.labels.y).toBe(null);
      expect(chartConfig.yAxis[0].title.x).toBe(null);
      expect(chartConfig.yAxis[1].title.x).toBe(null);
      expect(chartConfig.yAxis[0].title.y).toBe(3);
      expect(chartConfig.yAxis[1].title.y).toBe(-7);
      expect(chartConfig.yAxis[0].labels.y).toBe(null);
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

  describe('when the sorting is enabled', () => {
    beforeEach(() => {
      window.setFlag('graph-sorting', true);
    });

    afterEach(() => {
      window.setFlag('graph-sorting', false);
    });

    it('builds a chart with a categories array for sorting by', () => {
      const chartDataWithDataSortingEnabled = {
        ...chartData,
        sorting: {
          enabled: true,
          order: 'asc',
          metricIndex: 0,
          sortKey: 'mainCategoryName',
        },
      };
      const chartConfig = ChartConfig(chartDataWithDataSortingEnabled, 'bar');

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
      const chartDataWithDataSortingDisabled = {
        ...chartData,
        sorting: { enabled: false, order: '' },
      };
      const chartConfig = ChartConfig(chartDataWithDataSortingDisabled, 'bar');

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
      const chartDataWithDataSortingEnabled = {
        ...chartData,
        sorting: {
          enabled: true,
          order: 'asc',
          metricIndex: 0,
          sortKey: 'mainCategoryName',
        },
      };
      const chartConfig = ChartConfig(chartDataWithDataSortingEnabled, 'bar');

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
        const mutableData = _cloneDeep(getDummyData('summaryBar'));
        mutableData.metrics[0].series[0].datapoints[0].y = null; // Filter Athlete 1
        mutableData.decorators = { hide_nulls: true };

        const chartConfig = ChartConfig(mutableData, 'bar');
        expect(chartConfig.series.length).toBe(2);
        expect(chartConfig.series[0].data.length).toBe(2);
        expect(chartConfig.series[0].data[0].name).toBe('Athlete 2');
        expect(chartConfig.series[0].data[1].name).toBe('Athlete 3');
      });
    });

    describe('when hide_zeros decorator is enabled', () => {
      it('builds a chartConfig series without zero values', () => {
        const mutableData = _cloneDeep(getDummyData('summaryBar'));
        mutableData.metrics[0].series[0].datapoints[1].y = 0; // Filter Athlete 2
        mutableData.decorators = { hide_zeros: true };

        const chartConfig = ChartConfig(mutableData, 'bar');
        expect(chartConfig.series.length).toBe(2);
        expect(chartConfig.series[0].data.length).toBe(2);
        expect(chartConfig.series[0].data[0].name).toBe('Athlete 1');
        expect(chartConfig.series[0].data[1].name).toBe('Athlete 3');
      });
    });

    describe('when hide_nulls decorator is NOT enabled', () => {
      it('builds a chartConfig series with null values', () => {
        const mutableData = _cloneDeep(getDummyData('summaryBar'));
        mutableData.metrics[0].series[0].datapoints[0].y = null; // Athlete 1
        mutableData.decorators = { hide_nulls: false };

        const chartConfig = ChartConfig(mutableData, 'bar');
        expect(chartConfig.series.length).toBe(2);
        expect(chartConfig.series[0].data.length).toBe(3);
        expect(chartConfig.series[0].data[0].name).toBe('Athlete 1');
        expect(chartConfig.series[0].data[0].y).toBe(null);
        expect(chartConfig.series[0].data[1].name).toBe('Athlete 2');
      });
    });

    describe('when hide_zeros decorator is NOT enabled', () => {
      it('builds a chartConfig series with zero values', () => {
        const mutableData = _cloneDeep(getDummyData('summaryBar'));
        mutableData.metrics[0].series[0].datapoints[1].y = 0; // Athlete 2
        mutableData.decorators = { hide_zeros: false };

        const chartConfig = ChartConfig(mutableData, 'bar');
        expect(chartConfig.series.length).toBe(2);
        expect(chartConfig.series[0].data.length).toBe(3);
        expect(chartConfig.series[0].data[0].name).toBe('Athlete 1');
        expect(chartConfig.series[0].data[1].name).toBe('Athlete 2');
        expect(chartConfig.series[0].data[1].y).toBe(0);
      });
    });
  });

  describe('when clicking a point linked to a dashboard', () => {
    const { location } = window;

    beforeEach(() => {
      delete window.location;
      window.location = { assign: jest.fn() };
    });

    afterEach(() => {
      window.location = location;
    });

    it('redirects to the correct dashboard', () => {
      const customChartData = { ...chartData };
      customChartData.metrics[0].linked_dashboard_id = '3';
      customChartData.time_period = 'this_season';

      const mockedThis = {
        population_type: 'athlete',
        population_id: '3',
      };

      const chartConfig = ChartConfig(customChartData, 'line');
      chartConfig.series[0].point.events.click.call(mockedThis);

      expect(window.location.assign).toHaveBeenCalledWith(
        '/analysis/dashboard/3?pivot=true&athletes=3&time_period=this_season'
      );
    });

    it("doesn't redirect when the time period is a drill", () => {
      const customChartData = { ...chartData };
      customChartData.metrics[0].linked_dashboard_id = '3';
      customChartData.metrics[0].status.event_type_time_period = 'game';

      const chartConfig = ChartConfig(customChartData, 'line');
      chartConfig.series[0].point.events.click();

      expect(window.location.assign).not.toHaveBeenCalled();
    });
  });
});
