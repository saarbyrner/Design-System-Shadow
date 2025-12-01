import { calculateSumOfValues } from '@kitman/common/src/utils/aggregators';
import {
  getChartValue,
  sortMicroCyclesData,
} from '@kitman/modules/src/analysis/Dashboard/components/Chart/utils';
import { generateChartSeriesObject, generateTestSeries } from './testUtils';
import {
  processSeriesData,
  getChartFullCategoryDomain,
  mapSeriesDataToDomain,
  getScaleType,
  convertLabelsToDates,
  aggregateByMethod,
  aggregateByTimePeriod,
  getSeriesIds,
  getChartAggregatePeriod,
  getTimeDomain,
  formatDateValue,
  formatAxisTick,
  sortSeries,
  fillMissingDates,
  getSortOrderList,
  getIsFormattingOutOfChartBounds,
  getTickWidth,
  getNumTicks,
} from '../utils';
import { SERIES_TYPES, SORT_ORDER } from '../constants';

describe('processSeriesData', () => {
  test('orders data highest to lowest when passing sort order is high to low', () => {
    const valueAccessor = ({ value }) => value;
    const testCase = [
      {
        value: 10,
      },
      {
        value: 12,
      },
      {
        value: 55,
      },
      {
        value: 2,
      },
    ];

    expect(
      processSeriesData(testCase, valueAccessor, {
        seriesOrder: SORT_ORDER.HIGH_TO_LOW,
      })
    ).toStrictEqual([
      {
        value: 55,
      },
      {
        value: 12,
      },
      {
        value: 10,
      },
      {
        value: 2,
      },
    ]);
  });

  test('orders data lowest to highest when passing in sort order low to high', () => {
    const valueAccessor = ({ value }) => value;
    const testCase = [
      {
        value: 10,
      },
      {
        value: 12,
      },
      {
        value: 55,
      },
      {
        value: 2,
      },
    ];

    expect(
      processSeriesData(testCase, valueAccessor, {
        seriesOrder: SORT_ORDER.LOW_TO_HIGH,
      })
    ).toStrictEqual([
      {
        value: 2,
      },
      {
        value: 10,
      },
      {
        value: 12,
      },
      {
        value: 55,
      },
    ]);
  });

  test('orders data highest to lowest based on the sum of grouped data', () => {
    const valueAccessor = ({ value }) => value;
    const testCase = [
      {
        values: [{ value: 125 }, { value: 50 }],
      },
      {
        values: [{ value: 50 }, { value: null }],
      },
      {
        values: [{ value: 125 }, { value: 100 }],
      },
      {
        values: [{ value: 20 }, { value: null }],
      },
    ];

    expect(
      processSeriesData(testCase, valueAccessor, {
        seriesOrder: SORT_ORDER.HIGH_TO_LOW,
      })
    ).toStrictEqual([
      {
        values: [{ value: 125 }, { value: 100 }],
        value: 225,
      },
      {
        values: [{ value: 125 }, { value: 50 }],
        value: 175,
      },
      {
        values: [{ value: 50 }, { value: null }],
        value: 50,
      },
      {
        values: [{ value: 20 }, { value: null }],
        value: 20,
      },
    ]);
  });

  test('orders data lowest to highest based on the sum of grouped data', () => {
    const valueAccessor = ({ value }) => value;
    const testCase = [
      {
        values: [{ value: 125 }, { value: 50 }],
      },
      {
        values: [{ value: 50 }, { value: null }],
      },
      {
        values: [{ value: 125 }, { value: 100 }],
      },
      {
        values: [{ value: 20 }, { value: null }],
      },
    ];

    expect(
      processSeriesData(testCase, valueAccessor, {
        seriesOrder: SORT_ORDER.LOW_TO_HIGH,
      })
    ).toStrictEqual([
      {
        values: [{ value: 20 }, { value: null }],
        value: 20,
      },
      {
        values: [{ value: 50 }, { value: null }],
        value: 50,
      },
      {
        values: [{ value: 125 }, { value: 50 }],
        value: 175,
      },
      {
        values: [{ value: 125 }, { value: 100 }],
        value: 225,
      },
    ]);
  });

  test('orders data by a custom sort function when defaultSortOrder is defined and sortOrder === "default"', () => {
    const valueAccessor = ({ value }) => value;
    const testCase = [
      { label: 'Week 10', value: '60' },
      { label: 'Week 5', value: '60' },
      { label: 'Week 1', value: '10' },
      { label: 'Week 2', value: '40' },
    ];

    expect(
      processSeriesData(testCase, valueAccessor, {
        seriesOrder: SORT_ORDER.DEFAULT,
        defaultSortFunction: sortMicroCyclesData, // custom sort function
      })
    ).toStrictEqual([
      { label: 'Week 1', value: 10 },
      { label: 'Week 2', value: 40 },
      { label: 'Week 5', value: 60 },
      { label: 'Week 10', value: 60 },
    ]);
  });

  test('orders data by a custom sort function when defaultSortOrder is defined and sortOrder === ""', () => {
    const valueAccessor = ({ value }) => value;
    const testCase = [
      { label: 'Week 10', value: '60' },
      { label: 'Week 5', value: '60' },
      { label: 'Week 1', value: '10' },
      { label: 'Week 2', value: '40' },
    ];

    expect(
      processSeriesData(testCase, valueAccessor, {
        seriesOrder: '',
        defaultSortFunction: sortMicroCyclesData, // custom sort function
      })
    ).toStrictEqual([
      { label: 'Week 1', value: 10 },
      { label: 'Week 2', value: 40 },
      { label: 'Week 5', value: 60 },
      { label: 'Week 10', value: 60 },
    ]);
  });

  test('does not order data by custom sort function when defaultSortOrder is not defined', () => {
    const valueAccessor = ({ value }) => value;
    const testCase = [
      { label: 'win', value: '60' },
      { label: 'loss', value: '60' },
      { label: 'draw', value: '10' },
    ];

    expect(
      processSeriesData(testCase, valueAccessor, {
        seriesOrder: SORT_ORDER.DEFAULT,
        defaultSortFunction: undefined,
      })
    ).toStrictEqual([
      { label: 'win', value: 60 },
      { label: 'loss', value: 60 },
      { label: 'draw', value: 10 },
    ]);
  });

  test('orders data when sortOrder is high to low, and ignores the defaultSortFunction', () => {
    const valueAccessor = ({ value }) => value;
    const testCase = [
      { label: 'Week 10', value: '60' },
      { label: 'Week 5', value: '60' },
      { label: 'Week 1', value: '10' },
      { label: 'Week 2', value: '40' },
    ];

    expect(
      processSeriesData(testCase, valueAccessor, {
        seriesOrder: SORT_ORDER.HIGH_TO_LOW,
        defaultSortFunction: sortMicroCyclesData,
      })
    ).toStrictEqual([
      { label: 'Week 10', value: 60 },
      { label: 'Week 5', value: 60 },
      { label: 'Week 2', value: 40 },
      { label: 'Week 1', value: 10 },
    ]);
  });

  test('orders data when sortOrder is low to high, and ignores the defaultSortFunction', () => {
    const valueAccessor = ({ value }) => value;
    const testCase = [
      { label: 'Week 10', value: '60' },
      { label: 'Week 5', value: '60' },
      { label: 'Week 1', value: '10' },
      { label: 'Week 2', value: '40' },
    ];

    expect(
      processSeriesData(testCase, valueAccessor, {
        seriesOrder: SORT_ORDER.LOW_TO_HIGH,
        defaultSortFunction: sortMicroCyclesData,
      })
    ).toStrictEqual([
      { label: 'Week 1', value: 10 },
      { label: 'Week 2', value: 40 },
      { label: 'Week 10', value: 60 },
      { label: 'Week 5', value: 60 },
    ]);
  });

  test('orders data when sortOrder is a-z, and ignores the defaultSortFunction', () => {
    const valueAccessor = ({ value }) => value;
    const testCase = [
      { label: 'Week 10', value: '60' },
      { label: 'Week 5', value: '60' },
      { label: 'Week 1', value: '10' },
      { label: 'Week 2', value: '40' },
    ];

    expect(
      processSeriesData(testCase, valueAccessor, {
        seriesOrder: SORT_ORDER.ALPHABETICAL,
        defaultSortFunction: sortMicroCyclesData,
      })
    ).toStrictEqual([
      { label: 'Week 1', value: 10 },
      { label: 'Week 10', value: 60 },
      { label: 'Week 2', value: 40 },
      { label: 'Week 5', value: 60 },
    ]);
  });
});

describe('getChartFullCategoryDomain', () => {
  it('returns the category for each data item based on sort config', () => {
    const series = {
      123: {
        ...generateTestSeries('Series 1 - '),
        type: SERIES_TYPES.bar,
        sortConfig: {
          sortOrder: SORT_ORDER.ALPHABETICAL,
        },
      },
    };
    const expected = [
      'Series 1 - Label 1',
      'Series 1 - Label 2',
      'Series 1 - Label 3',
    ];
    expect(getChartFullCategoryDomain(series)).toStrictEqual(expected);
  });

  it('returns the category for each data item not ordered for line charts', () => {
    const series = {
      123: { ...generateTestSeries('Series 1 - '), type: SERIES_TYPES.line },
    };

    const expected = [
      'Series 1 - Label 1',
      'Series 1 - Label 2',
      'Series 1 - Label 3',
    ];

    expect(getChartFullCategoryDomain(series)).toStrictEqual(expected);
  });

  it('returns the category for each data item in each series', () => {
    expect(
      getChartFullCategoryDomain(generateChartSeriesObject())
    ).toStrictEqual([
      'Series 1 - Label 1',
      'Series 1 - Label 2',
      'Series 1 - Label 3',
      'Series 2 - Label 1',
      'Series 2 - Label 2',
      'Series 2 - Label 3',
      'Series 3 - Label 1',
      'Series 3 - Label 2',
      'Series 3 - Label 3',
    ]);
  });
});

describe('mapSeriesDataToDomain', () => {
  const series = {
    123: {
      valueAccessor: ({ value }) => value,
      categoryAccessor: ({ label }) => label,
      axisConfig: 'left',
      type: 'bar',
      isGrouped: true,
      data: [
        { label: 'Athlete 2', value: '400' },
        { label: 'Athlete 3', value: '300' },
        { label: 'Athlete 1', value: '500' },
      ],
      dataType: 'category',
      sortConfig: {
        sortOrder: SORT_ORDER.HIGH_TO_LOW,
      },
    },
  };

  it('maps data to the domain ordering', () => {
    const data = [
      { label: 'Athlete 1', value: '100' },
      { label: 'Athlete 3', value: '50' },
      { label: 'Athlete 2', value: '150' },
    ];

    expect(mapSeriesDataToDomain(data, series)).toStrictEqual([
      { label: 'Athlete 1', value: '100' },
      { label: 'Athlete 2', value: '150' },
      { label: 'Athlete 3', value: '50' },
    ]);
  });
});

describe('getScaleType', () => {
  it('returns an error when the series contains multiple data types', () => {
    const invalidSeries = {
      1: {
        categoryAccessor: () => {},
        data: [{ label: 'Forward', value: 2500 }],
        dataType: 'category',
        type: SERIES_TYPES.bar,
        valueAccessor: () => {},
      },
      2: {
        categoryAccessor: () => {},
        data: [{ label: 'Forward', value: 2500 }],
        dataType: 'time',
        type: SERIES_TYPES.bar,
        valueAccessor: () => {},
      },
    };

    expect(() => getScaleType(invalidSeries)).toThrow(
      'Multiple series of different types used in chart. Must use all DateTime or Category series'
    );
  });

  it('returns band when series is valid and dataType is "category"', () => {
    const categorySeries = {
      1: {
        categoryAccessor: () => {},
        data: [{ label: 'Forward', value: 2500 }],
        dataType: 'category',
        type: SERIES_TYPES.bar,
        valueAccessor: () => {},
      },
      2: {
        categoryAccessor: () => {},
        data: [{ label: 'Back', value: 3000 }],
        dataType: 'category',
        type: SERIES_TYPES.bar,
        valueAccessor: () => {},
      },
    };

    expect(getScaleType(categorySeries)).toBe('category');
  });

  it('returns band when series is valid and dataType is "time"', () => {
    const timeSeries = {
      1: {
        categoryAccessor: () => {},
        data: [{ label: '01/05/24', value: 2500 }],
        dataType: 'time',
        type: SERIES_TYPES.bar,
        valueAccessor: () => {},
      },
      2: {
        categoryAccessor: () => {},
        data: [{ label: '01/06/24', value: 300 }],
        dataType: 'time',
        type: SERIES_TYPES.bar,
        valueAccessor: () => {},
      },
    };

    expect(getScaleType(timeSeries)).toBe('time');
  });
});

describe('convertLabelsToDates()', () => {
  it('returns a string to a js date object', () => {
    expect(
      convertLabelsToDates([
        { label: '2022-01-01', value: 123 },
        { label: '2022-01-02', value: 123 },
        { label: '2022-01-03', value: 123 },
      ])
    ).toStrictEqual([
      { label: new Date(2022, 0, 1), value: 123 },
      { label: new Date(2022, 0, 2), value: 123 },
      { label: new Date(2022, 0, 3), value: 123 },
    ]);
  });
});

describe('aggregateByMethod', () => {
  const data = {
    '2024-01-01': [5, 8, 10],
    '2024-02-01': [2, 6, 10],
    '2024-03-01': [4, 7, 10],
  };

  it('aggregates the data with the given method', () => {
    const expected = [
      { label: '2024-01-01', value: 23 },
      { label: '2024-02-01', value: 18 },
      { label: '2024-03-01', value: 21 },
    ];

    const aggregationMethod = calculateSumOfValues;

    expect(aggregateByMethod(data, aggregationMethod)).toStrictEqual(expected);
  });
});

describe('aggregateByTimePeriod', () => {
  const values = [6480, 1500, 100, 19140, 100, 60, 100, 2500, 0];

  const percentageTestSampleData = [
    // Month 1
    {
      label: '2024-08-01',
      value: {
        numerator: 2,
        denominator: 3,
      },
    },
    {
      label: '2024-08-03',
      value: {
        numerator: 2,
        denominator: 3,
      },
    },
    // Use-case: Zero Denominator
    {
      label: '2024-08-03',
      value: {
        numerator: 1,
        denominator: 0,
      },
    },
    {
      label: '2024-08-21',
      value: {
        numerator: 1,
        denominator: 3,
      },
    },
    // Month 2
    {
      label: '2024-09-01',
      value: {
        numerator: 1,
        denominator: 3,
      },
    },
    {
      label: '2024-09-12',
      value: {
        numerator: 2,
        denominator: 3,
      },
    },
    // Use-case: Zero Numerator
    {
      label: '2024-09-24',
      value: {
        numerator: 0,
        denominator: 3,
      },
    },
    {
      label: '2024-09-27',
      value: {
        numerator: 1,
        denominator: 3,
      },
    },
    // Month 3
    {
      label: '2024-10-03',
      value: {
        numerator: 1,
        denominator: 3,
      },
    },
    {
      label: '2024-10-10',
      value: {
        numerator: 2,
        denominator: 3,
      },
    },
    {
      label: '2024-10-11',
      value: {
        numerator: 3,
        denominator: 3,
      },
    },
    {
      label: '2024-10-16',
      value: {
        numerator: 2,
        denominator: 3,
      },
    },
  ];

  const floatData = [
    {
      label: '2024-04-15',
      value: '178.88',
    },
    {
      label: '2024-04-16',
      value: '60.00',
    },
    {
      label: '2024-04-19',
      value: '124906.00',
    },
    {
      label: '2024-04-24',
      value: '28.00',
    },
    {
      label: '2024-04-26',
      value: '30.18',
    },
    {
      label: '2024-04-30',
      value: '20.00',
    },
    {
      label: '2024-05-01',
      value: '30.00',
    },
    {
      label: '2024-05-03',
      value: '586645.00',
    },
    {
      label: '2024-05-08',
      value: '4175.96',
    },
  ];

  describe('aggregate by month', () => {
    const data = [
      {
        label: '2023-10-13',
        value: `${values[0]}`,
      },
      {
        label: '2023-10-20',
        value: `${values[1]}`,
      },
      {
        label: '2023-12-16',
        value: `${values[2]}`,
      },
      {
        label: '2023-12-31',
        value: `${values[3]}`,
      },
      {
        label: '2024-01-15',
        value: `${values[1]}`,
      },
      {
        label: '2024-02-15',
        value: `${values[4]}`,
      },
      {
        label: '2024-02-22',
        value: `${values[5]}`,
      },
      {
        label: '2024-04-16',
        value: `${values[6]}`,
      },
      {
        label: '2024-04-26',
        value: `${values[7]}`,
      },
      {
        label: '2024-06-19',
        value: `${values[8]}`,
      },
      {
        label: '2024-06-29',
        value: `${values[1]}`,
      },
    ];
    it('aggregates the data by month for calculation "sum"', () => {
      expect(aggregateByTimePeriod(data, 'monthly', 'sum')).toStrictEqual([
        { label: '2023-10-01', value: values[0] + values[1] }, // 6480 + 1500
        { label: '2023-12-01', value: values[2] + values[3] }, // 100 + 19140
        { label: '2024-01-01', value: values[1] }, // 1500
        { label: '2024-02-01', value: values[4] + values[5] },
        { label: '2024-04-01', value: values[6] + values[7] },
        { label: '2024-06-01', value: values[8] + values[1] },
      ]);
    });

    it('aggregates float data by month for calculation "sum"', () => {
      expect(aggregateByTimePeriod(floatData, 'monthly', 'sum')).toStrictEqual([
        { label: '2024-04-01', value: 125223.06 },
        { label: '2024-05-01', value: 590850.96 },
      ]);
    });

    it('aggregates the data by month for calculation "mean"', () => {
      expect(aggregateByTimePeriod(data, 'monthly', 'mean')).toStrictEqual([
        { label: '2023-10-01', value: (values[0] + values[1]) / 2 }, // 6480 + 1500 / 2
        { label: '2023-12-01', value: (values[2] + values[3]) / 2 }, // 100 + 19140 / 2
        { label: '2024-01-01', value: values[1] / 1 }, // 1500 / 1
        { label: '2024-02-01', value: (values[4] + values[5]) / 2 },
        { label: '2024-04-01', value: (values[6] + values[7]) / 2 },
        { label: '2024-06-01', value: (values[8] + values[1]) / 2 },
      ]);
    });

    it('aggregates float data by month for calculation "mean"', () => {
      expect(aggregateByTimePeriod(floatData, 'monthly', 'mean')).toStrictEqual(
        [
          { label: '2024-04-01', value: 20870.51 },
          { label: '2024-05-01', value: 196950.31999999998 },
        ]
      );
    });

    it('aggregates the data by month for calculation "min"', () => {
      expect(aggregateByTimePeriod(data, 'monthly', 'min')).toStrictEqual([
        { label: '2023-10-01', value: values[1] },
        { label: '2023-12-01', value: values[2] },
        { label: '2024-01-01', value: values[1] },
        { label: '2024-02-01', value: values[5] },
        { label: '2024-04-01', value: values[6] },
        { label: '2024-06-01', value: values[8] },
      ]);
    });

    it('aggregates float data by month for calculation "min"', () => {
      expect(aggregateByTimePeriod(floatData, 'monthly', 'min')).toStrictEqual([
        { label: '2024-04-01', value: 20 },
        { label: '2024-05-01', value: 30 },
      ]);
    });

    it('aggregates the data by month for calculation "max"', () => {
      expect(aggregateByTimePeriod(data, 'monthly', 'max')).toStrictEqual([
        { label: '2023-10-01', value: values[0] },
        { label: '2023-12-01', value: values[3] },
        { label: '2024-01-01', value: values[1] },
        { label: '2024-02-01', value: values[4] },
        { label: '2024-04-01', value: values[7] },
        { label: '2024-06-01', value: values[1] },
      ]);
    });

    it('aggregates float data by month for calculation "max"', () => {
      expect(aggregateByTimePeriod(floatData, 'monthly', 'max')).toStrictEqual([
        { label: '2024-04-01', value: 124906 },
        { label: '2024-05-01', value: 586645 },
      ]);
    });

    it('aggregates the data by month for calculation "last"', () => {
      expect(aggregateByTimePeriod(data, 'monthly', 'last')).toStrictEqual([
        { label: '2023-10-01', value: values[1] },
        { label: '2023-12-01', value: values[3] },
        { label: '2024-01-01', value: values[1] },
        { label: '2024-02-01', value: values[5] },
        { label: '2024-04-01', value: values[7] },
        { label: '2024-06-01', value: values[1] },
      ]);
    });

    it('aggregates float data by month for calculation "last"', () => {
      expect(aggregateByTimePeriod(floatData, 'monthly', 'last')).toStrictEqual(
        [
          { label: '2024-04-01', value: 20 },
          { label: '2024-05-01', value: 4175.96 },
        ]
      );
    });

    it('aggregates the data by month for calculation "percentage"', () => {
      expect(
        aggregateByTimePeriod(percentageTestSampleData, 'monthly', 'percentage')
      ).toStrictEqual([
        { label: '2024-08-01', value: 55.56 },
        { label: '2024-09-01', value: 33.33 },
        { label: '2024-10-01', value: 66.67 },
      ]);
    });
  });

  describe('aggregate by week', () => {
    const data = [
      {
        label: '2023-10-13',
        value: `${values[0]}`,
      },
      {
        label: '2023-10-15',
        value: `${values[1]}`,
      },
      // ---- week ----
      {
        label: '2023-10-16',
        value: `${values[2]}`,
      },
      // ---- week ----
      {
        label: '2023-10-25',
        value: `${values[3]}`,
      },
      {
        label: '2023-10-29',
        value: `${values[4]}`,
      },
      // ---- week ----
      {
        label: '2024-06-09',
        value: `${values[5]}`,
      },
      // ---- week ----
      {
        label: '2024-06-17',
        value: `${values[6]}`,
      },
      {
        label: '2024-06-19',
        value: `${values[7]}`,
      },
      {
        label: '2024-06-22',
        value: `${values[0]}`,
      },
      // ---- week ----
      {
        label: '2024-06-26',
        value: `${values[8]}`,
      },
      {
        label: '2024-06-29',
        value: `${values[0]}`,
      },
    ];
    it('aggregates the data by week for calculation "sum"', () => {
      expect(aggregateByTimePeriod(data, 'weekly', 'sum')).toStrictEqual([
        { label: '2023-10-09', value: values[0] + values[1] }, // 6480 + 1500
        { label: '2023-10-16', value: values[2] }, // 100
        { label: '2023-10-23', value: values[3] + values[4] }, // 19140 + 100
        { label: '2024-06-03', value: values[5] },
        { label: '2024-06-17', value: values[6] + values[7] + values[0] },
        { label: '2024-06-24', value: values[8] + values[0] },
      ]);
    });

    it('aggregates float data by week for calculation "sum"', () => {
      expect(aggregateByTimePeriod(floatData, 'weekly', 'sum')).toStrictEqual([
        { label: '2024-04-15', value: 125144.88 },
        { label: '2024-04-22', value: 58.18 },
        { label: '2024-04-29', value: 586695 },
        { label: '2024-05-06', value: 4175.96 },
      ]);
    });

    it('aggregates the data by week for calculation "mean"', () => {
      expect(aggregateByTimePeriod(data, 'weekly', 'mean')).toStrictEqual([
        { label: '2023-10-09', value: (values[0] + values[1]) / 2 }, // 6480 + 1500 / 2
        { label: '2023-10-16', value: values[2] / 1 }, // 100 / 1
        { label: '2023-10-23', value: (values[3] + values[4]) / 2 }, // 19140 + 100 / 2
        { label: '2024-06-03', value: values[5] / 1 },
        { label: '2024-06-17', value: (values[6] + values[7] + values[0]) / 3 },
        { label: '2024-06-24', value: (values[8] + values[0]) / 2 },
      ]);
    });

    it('aggregates float data by week for calculation "mean"', () => {
      expect(aggregateByTimePeriod(floatData, 'weekly', 'mean')).toStrictEqual([
        { label: '2024-04-15', value: 41714.96 },
        { label: '2024-04-22', value: 29.09 },
        { label: '2024-04-29', value: 195565 },
        { label: '2024-05-06', value: 4175.96 },
      ]);
    });

    it('aggregates the data by week for calculation "min"', () => {
      expect(aggregateByTimePeriod(data, 'weekly', 'min')).toStrictEqual([
        { label: '2023-10-09', value: values[1] }, // 1500
        { label: '2023-10-16', value: values[2] }, // 100
        { label: '2023-10-23', value: values[4] }, //  100
        { label: '2024-06-03', value: values[5] },
        { label: '2024-06-17', value: values[6] },
        { label: '2024-06-24', value: values[8] },
      ]);
    });

    it('aggregates float data by week for calculation "min"', () => {
      expect(aggregateByTimePeriod(floatData, 'weekly', 'min')).toStrictEqual([
        { label: '2024-04-15', value: 60 },
        { label: '2024-04-22', value: 28 },
        { label: '2024-04-29', value: 20 },
        { label: '2024-05-06', value: 4175.96 },
      ]);
    });

    it('aggregates the data by week for calculation "max"', () => {
      expect(aggregateByTimePeriod(data, 'weekly', 'max')).toStrictEqual([
        { label: '2023-10-09', value: values[0] }, // 6480
        { label: '2023-10-16', value: values[2] }, // 100
        { label: '2023-10-23', value: values[3] }, // 19140
        { label: '2024-06-03', value: values[5] },
        { label: '2024-06-17', value: values[0] },
        { label: '2024-06-24', value: values[0] },
      ]);
    });

    it('aggregates float data by week for calculation "max"', () => {
      expect(aggregateByTimePeriod(floatData, 'weekly', 'max')).toStrictEqual([
        { label: '2024-04-15', value: 124906 },
        { label: '2024-04-22', value: 30.18 },
        { label: '2024-04-29', value: 586645 },
        { label: '2024-05-06', value: 4175.96 },
      ]);
    });

    it('aggregates the data by week for calculation "last"', () => {
      expect(aggregateByTimePeriod(data, 'weekly', 'last')).toStrictEqual([
        { label: '2023-10-09', value: values[1] },
        { label: '2023-10-16', value: values[2] },
        { label: '2023-10-23', value: values[4] },
        { label: '2024-06-03', value: values[5] },
        { label: '2024-06-17', value: values[0] },
        { label: '2024-06-24', value: values[0] },
      ]);
    });

    it('aggregates float data by week for calculation "last"', () => {
      expect(aggregateByTimePeriod(floatData, 'weekly', 'last')).toStrictEqual([
        { label: '2024-04-15', value: 124906 },
        { label: '2024-04-22', value: 30.18 },
        { label: '2024-04-29', value: 586645 },
        { label: '2024-05-06', value: 4175.96 },
      ]);
    });

    it('aggregates the data by week for calculation "percentage"', () => {
      expect(
        aggregateByTimePeriod(percentageTestSampleData, 'weekly', 'percentage')
      ).toStrictEqual([
        { label: '2024-07-29', value: 66.67 },
        { label: '2024-08-19', value: 33.33 },
        { label: '2024-08-26', value: 33.33 },
        { label: '2024-09-09', value: 66.67 },
        { label: '2024-09-23', value: 16.67 },
        { label: '2024-09-30', value: 33.33 },
        { label: '2024-10-07', value: 83.33 },
        { label: '2024-10-14', value: 66.67 },
      ]);
    });
  });
});

describe('getSeriesIds', () => {
  it('returns an array of all series ids', () => {
    const series = {
      123: { ...generateTestSeries() },
      456: { ...generateTestSeries() },
      789: { ...generateTestSeries() },
    };

    expect(getSeriesIds(series)).toStrictEqual(['123', '456', '789']);
  });
});

describe('getChartAggregatePeriod', () => {
  const TEST_CASES = {
    'single series': {
      INPUT: {
        123: {
          aggregateValues: {
            aggregatePeriod: 'daily',
          },
        },
      },
      EXPECT: 'daily',
    },
    'multiple series, same aggregate': {
      INPUT: {
        123: {
          aggregateValues: {
            aggregatePeriod: 'monthly',
          },
        },
        246: {
          aggregateValues: {
            aggregatePeriod: 'monthly',
          },
        },
      },
      EXPECT: 'monthly',
    },
    'multiple series, different aggregate with monthly': {
      INPUT: {
        123: {
          aggregateValues: {
            aggregatePeriod: 'daily',
          },
        },
        246: {
          aggregateValues: {
            aggregatePeriod: 'monthly',
          },
        },
      },
      EXPECT: 'daily',
    },
    'multiple series, different aggregate with weekly': {
      INPUT: {
        123: {
          aggregateValues: {
            aggregatePeriod: 'daily',
          },
        },
        246: {
          aggregateValues: {
            aggregatePeriod: 'weekly',
          },
        },
      },
      EXPECT: 'daily',
    },
    'multiple series, different aggregate with weekly and monthly': {
      INPUT: {
        246: {
          aggregateValues: {
            aggregatePeriod: 'weekly',
          },
        },
        777: {
          aggregateValues: {
            aggregatePeriod: 'monthly',
          },
        },
      },
      EXPECT: 'weekly',
    },
    'multiple series, different aggregate with all possible aggregates': {
      INPUT: {
        123: {
          aggregateValues: {
            aggregatePeriod: 'daily',
          },
        },
        246: {
          aggregateValues: {
            aggregatePeriod: 'weekly',
          },
        },
        777: {
          aggregateValues: {
            aggregatePeriod: 'monthly',
          },
        },
      },
      EXPECT: 'daily',
    },
  };

  Object.entries(TEST_CASES).forEach(([testCase, data]) => {
    it(`supports - ${testCase}`, () => {
      expect(getChartAggregatePeriod(data.INPUT)).toBe(data.EXPECT);
    });
  });
});

const setupTimeTestCase = (data, aggreation) => {
  return {
    123: {
      valueAccessor: ({ value }) => value,
      categoryAccessor: ({ label }) => label,
      data,
      dataType: 'time',
      aggregateValues: {
        aggregatePeriod: aggreation,
        aggregateMethod: 'sum',
      },
    },
  };
};

describe('getTimeDomain', () => {
  const TEST_CASES = {
    daily: {
      INPUT: {
        aggregation: 'daily',
        data: [
          {
            label: '2024-04-15',
            value: 12,
          },
          {
            label: '2024-04-16',
            value: 20,
          },
          {
            label: '2024-04-17',
            value: 20,
          },
          {
            label: '2024-04-19',
            value: 20,
          },
        ],
      },
      EXPECT: [
        '2024-04-15',
        '2024-04-16',
        '2024-04-17',
        '2024-04-18',
        '2024-04-19',
      ],
    },
    weekly: {
      INPUT: {
        aggregation: 'weekly',
        data: [
          {
            label: '2024-04-15',
            value: 12,
          },
          {
            label: '2024-04-16',
            value: 20,
          },
          {
            label: '2024-04-17',
            value: 20,
          },
          {
            label: '2024-04-25',
            value: 20,
          },
        ],
      },
      EXPECT: ['2024-04-15', '2024-04-22'],
    },
    monthly: {
      INPUT: {
        aggregation: 'monthly',
        data: [
          {
            label: '2024-04-15',
            value: 12,
          },
          {
            label: '2024-04-16',
            value: 20,
          },
          {
            label: '2024-05-17',
            value: 20,
          },
          {
            label: '2024-06-25',
            value: 20,
          },
        ],
      },
      EXPECT: ['2024-04-01', '2024-05-01', '2024-06-01'],
    },
  };
  Object.entries(TEST_CASES).forEach(([testCase, data]) => {
    it(`returns the correct domain for - ${testCase}`, () => {
      const series = setupTimeTestCase(data.INPUT.data, data.INPUT.aggregation);
      expect(getTimeDomain(series)).toStrictEqual(data.EXPECT);
    });
  });
});

describe('formatDateValue', () => {
  const TEST_CASES = {
    weekly: {
      INPUT: {
        value: '2024-08-14',
        aggregation: 'weekly',
        data: [],
        locale: null,
      },
      EXPECT: 'Aug 14',
    },
    monthly: {
      INPUT: {
        value: '2024-08-14',
        aggregation: 'monthly',
        data: [],
        locale: null,
      },
      EXPECT: 'Aug',
    },
    'daily with locale': {
      INPUT: {
        value: '2024-08-14',
        aggregation: 'daily',
        data: [],
        locale: 'en-US',
      },
      EXPECT: 'Wed, Aug 14',
    },
    'daily without locale': {
      INPUT: {
        value: '2024-08-14',
        aggregation: 'daily',
        data: [],
        locale: null,
      },
      EXPECT: 'Aug 14, 2024',
    },
  };

  Object.entries(TEST_CASES).forEach(([testCase, { INPUT, EXPECT }]) => {
    it(`formats a value for - ${testCase}`, () => {
      const series = setupTimeTestCase(INPUT.data, INPUT.aggregation);

      expect(formatDateValue(INPUT.value, series, INPUT.locale)).toStrictEqual(
        EXPECT
      );
    });
  });
});

describe('filter data by chartOptions: hideNulls and hideZeroes', () => {
  const valueAccessor = ({ value }) => getChartValue(value, null);
  const processSeriesDataWrapper = (
    input,
    { hideZeroes = false, hideNulls = false }
  ) => {
    return processSeriesData(input, valueAccessor, { hideZeroes, hideNulls });
  };

  // use-case: hideZeroes
  test('removes zero values when passing in hideZeroes = true', () => {
    const testCase = [
      {
        value: 10,
      },
      {
        value: null,
      },
      {
        value: '0',
      },
      {
        value: 0,
      },
    ];

    const output = processSeriesDataWrapper(testCase, { hideZeroes: true });
    expect(output).toStrictEqual([
      {
        value: 10,
      },
      {
        value: null,
      },
    ]);
  });

  test('removes zero values from stacked chart when passing in hideZeroes = true', () => {
    const testCase = [
      {
        values: [
          {
            value: '1',
          },
        ],
      },
      {
        values: [
          {
            value: '0',
          },
        ],
      },
      {
        values: [
          {
            value: 0,
          },
        ],
      },
      {
        values: [
          {
            value: null,
          },
        ],
      },
    ];

    const output = processSeriesDataWrapper(testCase, { hideZeroes: true });
    expect(output).toStrictEqual([
      {
        values: [
          {
            value: '1',
          },
        ],
      },
      {
        values: [
          {
            value: null,
          },
        ],
      },
    ]);
  });

  test('does not remove zero values when passing in hideZeroes = false', () => {
    const testCase = [
      {
        value: 10,
      },
      {
        value: null,
      },
      {
        value: '0',
      },
      {
        value: 0,
      },
    ];

    const output = processSeriesDataWrapper(testCase, { hideZeroes: false });
    expect(output).toStrictEqual([
      {
        value: 10,
      },
      {
        value: null,
      },
      {
        value: '0',
      },
      {
        value: 0,
      },
    ]);
  });

  // use-case: hideNulls
  test('removes null values when passing in hideNulls = true', () => {
    const testCase = [
      {
        value: 10,
      },
      {
        value: null,
      },
      {
        value: [],
      },
      {
        value: 0,
      },
      {
        value: '0',
      },
    ];

    const output = processSeriesDataWrapper(testCase, { hideNulls: true });
    expect(output).toStrictEqual([
      {
        value: 10,
      },
      {
        value: 0,
      },
      {
        value: '0',
      },
    ]);
  });

  test('removes null values from stacked chart when passing in hideNulls = true', () => {
    const testCase = [
      {
        values: [
          {
            value: '1',
          },
        ],
      },
      {
        values: [
          {
            value: null,
          },
        ],
      },
      {
        values: [
          {
            value: [],
          },
        ],
      },
      {
        values: [
          {
            value: '0',
          },
        ],
      },
    ];

    const output = processSeriesDataWrapper(testCase, { hideNulls: true });
    expect(output).toStrictEqual([
      {
        values: [
          {
            value: '1',
          },
        ],
      },
      {
        values: [
          {
            value: '0',
          },
        ],
      },
    ]);
  });

  test('does not remove null values when passing in hideNulls = false', () => {
    const testCase = [
      {
        value: 10,
      },
      {
        value: null,
      },
      {
        value: 0,
      },
      {
        value: '0',
      },
      {
        value: [],
      },
    ];

    expect(
      processSeriesData(testCase, valueAccessor, { hideNulls: false })
    ).toStrictEqual([
      {
        value: 10,
      },
      {
        value: null,
      },
      {
        value: 0,
      },
      {
        value: '0',
      },
      {
        value: [],
      },
    ]);
  });

  // use-case: combination
  test('removes zero and null values from chart items when passing in hideZeroes = true, hideNulls = true', () => {
    const testCase = [
      {
        value: 10,
      },
      {
        value: null,
      },
      {
        value: 0,
      },
      {
        value: 2,
      },
      {
        value: '0',
      },
      {
        value: [],
      },
    ];

    const output = processSeriesDataWrapper(testCase, {
      hideNulls: true,
      hideZeroes: true,
    });
    expect(output).toStrictEqual([
      {
        value: 10,
      },
      {
        value: 2,
      },
    ]);
  });

  test('removes zero and null values from stacked chart items when passing in hideZeroes = true, hideNulls = true', () => {
    const testCase = [
      {
        values: [
          {
            value: '1',
          },
        ],
      },
      {
        values: [
          {
            value: '0',
          },
        ],
      },
      {
        values: [
          {
            value: 0,
          },
        ],
      },
      {
        values: [
          {
            value: null,
          },
        ],
      },
      {
        values: [
          {
            value: [],
          },
        ],
      },
    ];
    const output = processSeriesDataWrapper(testCase, {
      hideNulls: true,
      hideZeroes: true,
    });
    expect(output).toStrictEqual([
      {
        values: [
          {
            value: '1',
          },
        ],
      },
    ]);
  });

  // use-case: default
  test('defaults to no order and does not remove nulls', () => {
    const testCase = [
      {
        value: 10,
      },
      {
        value: null,
      },
      {
        value: 55,
      },
      {
        value: 2,
      },
      {
        value: 120,
      },
      {
        value: null,
      },
    ];

    const output = processSeriesDataWrapper(testCase, {});
    expect(output).toStrictEqual([
      {
        value: 10,
      },
      {
        value: null,
      },
      {
        value: 55,
      },
      {
        value: 2,
      },
      {
        value: 120,
      },
      {
        value: null,
      },
    ]);
  });

  test('preserves null values during processing', () => {
    const testCase = [{ value: null }, { value: 10 }, { value: 0 }];

    const result = processSeriesData(testCase, valueAccessor, {
      hideNulls: false,
      hideZeroes: true,
      seriesOrder: SORT_ORDER.HIGH_TO_LOW,
    });

    expect(result).toStrictEqual([{ value: 10 }, { value: null }]);
  });
});

describe('formatAxisTick', () => {
  it('returns value fixed to 0 when value === 0', () => {
    const value = 0;
    expect(formatAxisTick(value)).toBe(value.toFixed(0));
  });

  it('returns value fixed to 2 when value < 1', () => {
    const value = 0.5;
    expect(formatAxisTick(value)).toBe(value.toFixed(2));
  });

  it('returns value fixed to 1 when value < 10', () => {
    const value = 5;
    const otherValue = 7.7789;
    expect(formatAxisTick(value)).toBe(value.toFixed(1));
    expect(formatAxisTick(otherValue)).toBe(otherValue.toFixed(1));
  });

  it('returns value fixed to 0 when value >= 10', () => {
    const value = 50;
    const otherValue = 7889.7789;
    expect(formatAxisTick(value)).toBe(value.toFixed(0));
    expect(formatAxisTick(otherValue)).toBe(otherValue.toFixed(0));
  });
});

describe('sortSeries', () => {
  test('sorts data highest to lowest when passing sort order is high to low', () => {
    const testCase = [
      {
        value: 10,
      },
      {
        value: 12,
      },
      {
        value: 55,
      },
      {
        value: 2,
      },
    ];

    expect(sortSeries(testCase, SORT_ORDER.HIGH_TO_LOW)).toStrictEqual([
      {
        value: 55,
      },
      {
        value: 12,
      },
      {
        value: 10,
      },
      {
        value: 2,
      },
    ]);
  });

  test('sorts data lowest to highest when passing in sort order low to high', () => {
    const testCase = [
      {
        value: 10,
      },
      {
        value: 12,
      },
      {
        value: 55,
      },
      {
        value: 2,
      },
    ];

    expect(sortSeries(testCase, SORT_ORDER.LOW_TO_HIGH)).toStrictEqual([
      {
        value: 2,
      },
      {
        value: 10,
      },
      {
        value: 12,
      },
      {
        value: 55,
      },
    ]);
  });

  test('sorts data alphabetically A to Z', () => {
    const testCase = [
      {
        label: 'Z',
      },
      {
        label: 'A',
      },
      {
        label: 'T',
      },
      {
        label: 'b',
      },
    ];

    expect(sortSeries(testCase, SORT_ORDER.ALPHABETICAL)).toStrictEqual([
      {
        label: 'A',
      },
      {
        label: 'b',
      },
      {
        label: 'T',
      },
      {
        label: 'Z',
      },
    ]);
  });

  test('does not sort the data when is "default" or empty string', () => {
    const testCase = [
      {
        label: 'Z',
      },
      {
        label: 'A',
      },
      {
        label: 'T',
      },
      {
        label: 'b',
      },
    ];

    expect(sortSeries(testCase, '')).toStrictEqual(testCase);
  });

  test('uses defaultSortFunction when it is defined and sort order is "default"', () => {
    const testCase = [
      {
        label: 'Week 10',
        value: 10,
      },
      {
        label: 'Week 1',
        value: 12,
      },
      {
        label: 'Week 9',
        value: 55,
      },
      {
        label: 'Week 5',
        value: 2,
      },
    ];

    expect(
      sortSeries(testCase, SORT_ORDER.DEFAULT, sortMicroCyclesData)
    ).toStrictEqual([
      {
        label: 'Week 1',
        value: 12,
      },
      {
        label: 'Week 5',
        value: 2,
      },
      {
        label: 'Week 9',
        value: 55,
      },
      {
        label: 'Week 10',
        value: 10,
      },
    ]);
  });

  test('uses defaultSortFunction when it is defined and sort order is ""', () => {
    const testCase = [
      {
        label: 'Week 10',
        value: 10,
      },
      {
        label: 'Week 1',
        value: 12,
      },
      {
        label: 'Week 9',
        value: 55,
      },
      {
        label: 'Week 5',
        value: 2,
      },
    ];

    expect(sortSeries(testCase, '', sortMicroCyclesData)).toStrictEqual([
      {
        label: 'Week 1',
        value: 12,
      },
      {
        label: 'Week 5',
        value: 2,
      },
      {
        label: 'Week 9',
        value: 55,
      },
      {
        label: 'Week 10',
        value: 10,
      },
    ]);
  });
});

describe('fillMissingDates', () => {
  test('should fill missing daily dates', () => {
    const data = [
      { label: '2024-12-01', value: '10.00' },
      { label: '2024-12-03', value: '20.00' },
    ];

    const expected = [
      { label: '2024-12-01', value: '10.00' },
      { label: '2024-12-02', value: '0' },
      { label: '2024-12-03', value: '20.00' },
    ];

    expect(fillMissingDates(data, 'daily')).toEqual(expected);
  });

  test('should fill missing weekly dates', () => {
    const data = [
      { label: '2024-12-01', value: '10.00' },
      { label: '2024-12-15', value: '30.00' },
    ];

    const expected = [
      { label: '2024-12-01', value: '10.00' },
      { label: '2024-12-08', value: '0' },
      { label: '2024-12-15', value: '30.00' },
    ];

    expect(fillMissingDates(data, 'weekly')).toEqual(expected);
  });

  test('should fill missing monthly dates', () => {
    const data = [
      { label: '2024-01-01', value: '15.00' },
      { label: '2024-04-01', value: '45.00' },
    ];

    const expected = [
      { label: '2024-01-01', value: '15.00' },
      { label: '2024-02-01', value: '0' },
      { label: '2024-03-01', value: '0' },
      { label: '2024-04-01', value: '45.00' },
    ];

    expect(fillMissingDates(data, 'monthly')).toEqual(expected);
  });

  test('should return the same data if no missing dates', () => {
    const data = [
      { label: '2024-12-01', value: '10.00' },
      { label: '2024-12-02', value: '20.00' },
      { label: '2024-12-03', value: '30.00' },
    ];

    expect(fillMissingDates(data, 'daily')).toEqual(data);
  });

  test('should throw an error for invalid interval', () => {
    const data = [{ label: '2024-12-01', value: '10.00' }];

    expect(() => fillMissingDates(data, 'yearly')).toThrow(
      "Invalid interval. Use 'daily', 'weekly', or 'monthly'."
    );
  });
});

describe('getSortOrderList', () => {
  it('returns sort options with the expected options', () => {
    expect(getSortOrderList()).toStrictEqual([
      {
        key: SORT_ORDER.HIGH_TO_LOW,
        label: 'High - Low',
      },
      {
        key: SORT_ORDER.LOW_TO_HIGH,
        label: 'Low - High',
      },
      {
        key: SORT_ORDER.ALPHABETICAL,
        label: 'A - Z',
      },
      {
        key: SORT_ORDER.DEFAULT,
        label: 'Default',
      },
    ]);
  });

  describe('getIsFormattingOutOfChartBounds', () => {
    it('returns true when both from and to are below chartMin', () => {
      const ranges = [10, 20];
      const to = 5;
      const from = 6;
      expect(getIsFormattingOutOfChartBounds(ranges, to, from)).toBe(true);
    });

    it('returns true when both from and to are above chartMax', () => {
      const ranges = [10, 20];
      const to = 25;
      const from = 30;
      expect(getIsFormattingOutOfChartBounds(ranges, to, from)).toBe(true);
    });

    it('returns true when to is below chartMin', () => {
      const ranges = [10, 20];
      const to = 5;
      const from = undefined;

      expect(getIsFormattingOutOfChartBounds(ranges, to, from)).toBe(true);
    });

    it('returns true when from is above chartMax', () => {
      const ranges = [10, 20];
      const to = undefined;
      const from = 25;
      expect(getIsFormattingOutOfChartBounds(ranges, to, from)).toBe(true);
    });

    it('returns false when from and to are within chart bounds', () => {
      const ranges = [10, 20];
      const to = 15;
      const from = 12;
      expect(getIsFormattingOutOfChartBounds(ranges, to, from)).toBe(false);
    });

    it('returns false when only from is within chart bounds', () => {
      const ranges = [10, 20];
      const to = undefined;
      const from = 15;
      expect(getIsFormattingOutOfChartBounds(ranges, to, from)).toBe(false);
    });

    it('returns false when only to is within chart bounds', () => {
      const ranges = [10, 20];
      const to = 15;
      const from = undefined;
      expect(getIsFormattingOutOfChartBounds(ranges, to, from)).toBe(false);
    });
  });
});

describe('getTickWidth', () => {
  const defaultParams = {
    parentWidth: 800,
    numItems: 10,
    scaleType: 'category',
    shouldHaveScrollBar: false,
    isScrollActive: false,
    axisLabelMaxWidth: 100,
  };

  it('returns width per bar for category scale when not rotated', () => {
    const result = getTickWidth(defaultParams);

    // (800 - 70) / 10 = 73
    expect(result).toBe(73);
  });

  it('returns axis label max width when rotated (shouldHaveScrollBar = true, isScrollActive = false)', () => {
    const result = getTickWidth({
      ...defaultParams,
      shouldHaveScrollBar: true,
      isScrollActive: false,
    });

    expect(result).toBe(100);
  });

  it('returns width per bar when shouldHaveScrollBar = true but isScrollActive = true (not rotated)', () => {
    const result = getTickWidth({
      ...defaultParams,
      shouldHaveScrollBar: true,
      isScrollActive: true,
    });

    // (800 - 70) / 10 = 73
    expect(result).toBe(73);
  });

  it('returns minimum of axis label max width and width per bar for time scale', () => {
    const result = getTickWidth({
      ...defaultParams,
      scaleType: 'time',
    });

    // Math.min(100, (800 - 70) / 10) = Math.min(100, 73) = 73
    expect(result).toBe(73);
  });

  it('returns axis label max width for time scale when width per bar is larger', () => {
    const result = getTickWidth({
      ...defaultParams,
      numItems: 5, // larger bars
      scaleType: 'time',
    });

    // Math.min(100, (800 - 70) / 5) = Math.min(100, 146) = 100
    expect(result).toBe(100);
  });

  it('uses default axis label max width when not provided', () => {
    const { axisLabelMaxWidth, ...paramsWithoutMaxWidth } = defaultParams;
    const result = getTickWidth({
      ...paramsWithoutMaxWidth,
      scaleType: 'time',
    });

    expect(result).toBe(73); // Math.min(100, 73)
  });

  it('handles edge case with very small parent width', () => {
    const result = getTickWidth({
      ...defaultParams,
      parentWidth: 100, // small parent width
    });

    // (100 - 70) / 10 = 3
    expect(result).toBe(3);
  });

  it('handles edge case with single item', () => {
    const result = getTickWidth({
      ...defaultParams,
      numItems: 1, // single item
    });

    // (800 - 70) / 1 = 730
    expect(result).toBe(730);
  });
});

describe('getNumTicks', () => {
  it('returns calculated number of ticks for time scale with valid parent width', () => {
    const result = getNumTicks('time', 800, 100);

    // 800 / 100 = 8
    expect(result).toBe(8);
  });

  it('returns null for time scale when parent width is null', () => {
    const result = getNumTicks('time', null, 100);

    expect(result).toBeNull();
  });

  it('returns null for category scale regardless of parent width', () => {
    const result = getNumTicks('category', 800, 100);

    expect(result).toBeNull();
  });

  it('returns null for category scale with null parent width', () => {
    const result = getNumTicks('category', null, 100);

    expect(result).toBeNull();
  });

  it('handles fractional tick calculations for time scale', () => {
    const result = getNumTicks('time', 750, 100);

    // 750 / 100 = 7.5
    expect(result).toBe(7.5);
  });

  it('handles very small tick width for time scale', () => {
    const result = getNumTicks('time', 800, 1);

    // 800 / 1 = 800
    expect(result).toBe(800);
  });

  it('handles zero parent width for time scale', () => {
    const result = getNumTicks('time', 0, 100);

    // 0 / 100 = 0
    expect(result).toBe(0);
  });
});
