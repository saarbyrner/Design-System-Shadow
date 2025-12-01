import {
  mockChartTypeEventData,
  mockChartDataSourceData,
  mockChartDataSourceParams,
  mockSeriesData,
  mockValueData,
} from '@kitman/common/src/utils/TrackingData/src/mocks/analysis';
import { CHART_TYPE } from '@kitman/modules/src/analysis/Dashboard/components/ChartWidget/types';
import {
  getChartType,
  getChartDataSource,
  getChartTypeLabel,
  getChartData,
} from '../getChartEventData';

describe('getChartType()', () => {
  it('returns the correct data', () => {
    expect(getChartType(mockChartTypeEventData)).toStrictEqual(
      mockChartTypeEventData
    );
  });
  it('matches the snapshot', () => {
    expect(getChartType(mockChartTypeEventData)).toMatchSnapshot();
  });
});

describe('getChartDataSource()', () => {
  it('returns the correct data', () => {
    expect(getChartDataSource(mockChartDataSourceParams)).toStrictEqual(
      mockChartDataSourceData
    );
  });
  it('matches the snapshot', () => {
    expect(getChartDataSource(mockChartDataSourceParams)).toMatchSnapshot();
  });
});

describe('getChartTypeLabel()', () => {
  it('returns the correct label for CHART_TYPE.value', () => {
    expect(getChartTypeLabel({ chartType: CHART_TYPE.value })).toBe(
      'Add Value Viz'
    );
  });

  it('returns the correct label for CHART_TYPE.xy', () => {
    expect(getChartTypeLabel({ chartType: CHART_TYPE.xy })).toMatchSnapshot();
  });
});

describe('getChartData()', () => {
  it('returns the correct data for Line Visualisation', () => {
    expect(
      getChartData({
        seriesType: 'line',
        chartType: CHART_TYPE.xy,
        population: {
          applies_to_squad: false,
          labels: [2, 4],
          segments: [],
        },
        groupings: ['squad', 'position'],
        timePeriod: 'yesterday',
        axisConfig: 'left',
      })
    ).toStrictEqual(mockSeriesData);
  });

  it('returns the correct data for Area Visualisation', () => {
    expect(
      getChartData({
        seriesType: 'area',
        chartType: CHART_TYPE.xy,
        population: {
          applies_to_squad: false,
          labels: [2, 4],
          segments: [],
        },
        groupings: ['squad', 'position'],
        timePeriod: 'yesterday',
        axisConfig: 'left',
      })
    ).toMatchSnapshot();
  });

  it('returns the correct data for Value chart', () => {
    expect(
      getChartData({
        seriesType: undefined,
        chartType: CHART_TYPE.value,
        population: {
          applies_to_squad: false,
          labels: [2, 4],
          segments: [],
        },
        groupings: undefined,
        timePeriod: 'yesterday',
        axisConfig: 'left',
      })
    ).toStrictEqual(mockValueData);
  });
});
