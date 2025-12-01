import {
  isGroupedSecondAxis,
  isGroupedAxis,
  haveGroupedMetricsTheSameName,
  axesGroupingMatrix,
  getChartOverlays,
  getOverlayColor,
  getYAxisIndex,
  getYAxisList,
  getDefaultDataLabel,
  buildGraphLink,
  sortDatapoints,
  getSortedSeriesCategories,
  sortSeriesAlphabetically,
} from '../GraphUtils';

describe('isGroupedSecondAxis', () => {
  it('returns false when there is only one metric', () => {
    expect(isGroupedSecondAxis(1, {}, 0)).toBe(false);
  });

  it('returns false when there is more than one metric but not grouped', () => {
    const metric = {
      status: {
        grouped_with: [],
      },
    };
    expect(isGroupedSecondAxis(2, metric, 1)).toBe(false);
  });

  it('returns true when there is more than one metric and the second metric is grouped with the first one', () => {
    const metric = {
      status: {
        grouped_with: [1, 0],
      },
    };
    expect(isGroupedSecondAxis(2, metric, 1)).toBe(true);
  });

  it('returns false when the metric is medical', () => {
    const metric = {
      type: 'medical',
    };
    expect(isGroupedSecondAxis(2, metric, 1)).toBe(false);
  });
});

describe('isGroupedAxis', () => {
  it('returns false if the metric type is medical', () => {
    const metric = {
      status: {
        grouped_with: [1],
      },
      type: 'medical',
    };
    expect(isGroupedAxis(metric)).toBe(false);
  });

  it('returns true if metric has grouped_with.length > 0', () => {
    const metric = {
      status: {
        grouped_with: [1],
      },
      type: 'other',
    };
    expect(isGroupedAxis(metric)).toBe(true);
  });

  it('returns false if metric has grouped_with.length === 0', () => {
    const metric = {
      status: {
        grouped_with: [],
      },
      type: 'other',
    };
    expect(isGroupedAxis(metric)).toBe(false);
  });
});

describe('haveGroupedMetricsTheSameName', () => {
  it('returns false when the metrics have a different name', () => {
    const metrics = [
      {
        status: {
          grouped_with: [1],
          name: 'Mood',
          localised_unit: '1 - 10',
        },
      },
      {
        status: {
          name: 'Fatigue',
          localised_unit: '1 - 10',
        },
      },
    ];

    expect(haveGroupedMetricsTheSameName(metrics[0], metrics)).toBe(false);
  });

  it('returns false when the metrics have a different unit', () => {
    const metrics = [
      {
        status: {
          grouped_with: [1],
          name: 'Mood',
          localised_unit: '1 - 10',
        },
      },
      {
        status: {
          name: 'Mood',
          localised_unit: '1 - 7',
        },
      },
    ];

    expect(haveGroupedMetricsTheSameName(metrics[0], metrics)).toBe(false);
  });

  it('returns true when the metrics have the same name and unit', () => {
    const metrics = [
      {
        status: {
          grouped_with: [1],
          name: 'Mood',
          localised_unit: '1 - 10',
        },
      },
      {
        status: {
          name: 'Mood',
          localised_unit: '1 - 10',
        },
      },
    ];

    expect(haveGroupedMetricsTheSameName(metrics[0], metrics)).toBe(true);
  });
});

describe('axesGroupingMatrix', () => {
  it('returns an empty array if no graphData', () => {
    const graphData = {};
    expect(axesGroupingMatrix(graphData)).toStrictEqual([]);
  });

  it('returns an array containing an empty array if metric is not grouped', () => {
    const graphData = {
      metrics: [
        {
          status: {
            grouped_with: [],
          },
        },
      ],
    };
    expect(axesGroupingMatrix(graphData)).toStrictEqual([[]]);
  });

  it('returns an array of arrays containing metric grouping data', () => {
    const graphData = {
      metrics: [
        {
          status: {
            grouped_with: [1],
          },
        },
        {
          status: {
            grouped_with: [0],
          },
        },
        {
          status: {
            grouped_with: [],
          },
        },
      ],
    };
    expect(axesGroupingMatrix(graphData)).toStrictEqual([[1], [0], []]);
  });

  it('returns an array containing an empty array if a metric is medical type', () => {
    const graphData = {
      metrics: [
        {
          status: {},
          type: 'medical',
        },
        {
          status: {
            grouped_with: [],
          },
        },
      ],
    };
    expect(axesGroupingMatrix(graphData)).toStrictEqual([[], []]);
  });
});

describe('getYAxisIndex', () => {
  it('returns the correct axis index', () => {
    const axisList = [
      {
        metricIndexes: [0, 1, 4],
      },
      {
        metricIndexes: [2],
      },
      {
        metricIndexes: [4],
      },
    ];
    const metricIndex = 4;

    expect(getYAxisIndex(axisList, metricIndex)).toBe(2);
  });

  describe('when there is an axis offset', () => {
    it('returns the correct axis index', () => {
      const axisOffset = 2;
      const axisList = [
        {
          metricIndexes: [0, 1, 4],
        },
        {
          metricIndexes: [2],
        },
        {
          metricIndexes: [4],
        },
      ];
      const metricIndex = 4;

      expect(getYAxisIndex(axisList, metricIndex, axisOffset)).toBe(4);
    });
  });
});

describe('getYAxisList', () => {
  it('returns the correct list of y-axes', () => {
    const graphData = {
      metrics: [
        {
          type: 'medical',
        },
        {
          status: {
            grouped_with: [],
          },
        },
        {
          type: 'medical',
        },
        {
          status: {
            grouped_with: [4, 5],
          },
        },
        {
          status: {
            grouped_with: [3, 5],
          },
        },
        {
          status: {
            grouped_with: [3, 4],
          },
        },
      ],
    };
    const expectedAxisList = [
      {
        metricIndexes: [0],
      },
      {
        metricIndexes: [1],
      },
      {
        metricIndexes: [2],
      },
      {
        metricIndexes: [3, 4, 5],
      },
    ];

    expect(getYAxisList(graphData)).toStrictEqual(expectedAxisList);
  });
});

describe('getChartOverlays()', () => {
  describe('when the axes are grouped', () => {
    it('all the overlays are on the same axes', () => {
      const metrics = [
        {
          status: {
            grouped_with: [],
          },
          overlays: [
            {
              value: 5,
            },
          ],
        },
        {
          status: {
            grouped_with: [1, 0],
          },
          overlays: [
            {
              value: 1,
            },
          ],
        },
      ];

      expect(getChartOverlays(metrics, 1)).toStrictEqual({
        'plotline-0-0': {
          color: '#06D6A0',
          dashStyle: 'shortdash',
          id: 'plotline-0-0',
          type: 'line',
          value: 5,
          width: 2,
          yIndex: 1,
        },
        'plotline-1-0': {
          color: '#E9190F',
          dashStyle: 'shortdash',
          id: 'plotline-1-0',
          type: 'line',
          value: 1,
          width: 2,
          yIndex: 1,
        },
      });
    });
  });

  describe('when the axes are not grouped', () => {
    it('all the overlays are on different axes', () => {
      const metrics = [
        {
          status: {
            grouped_with: [],
          },
          overlays: [
            {
              value: 5,
            },
          ],
        },
        {
          status: {
            grouped_with: [],
          },
          overlays: [
            {
              value: 1,
            },
          ],
        },
      ];

      expect(getChartOverlays(metrics, 1)).toStrictEqual({
        'plotline-0-0': {
          color: '#06D6A0',
          dashStyle: 'shortdash',
          id: 'plotline-0-0',
          type: 'line',
          value: 5,
          width: 2,
          yIndex: 1,
        },
        'plotline-1-0': {
          color: '#E9190F',
          dashStyle: 'shortdash',
          id: 'plotline-1-0',
          type: 'line',
          value: 1,
          width: 2,
          yIndex: 2,
        },
      });
    });
  });

  describe('getOverlayColor()', () => {
    it('returns the correct overlay color', () => {
      expect(getOverlayColor(0)).toBe('#06D6A0');
      expect(getOverlayColor(1)).toBe('#E9190F');
      expect(getOverlayColor(2)).toBe('#731DD8');
      expect(getOverlayColor(3)).toBe('#2DC7FF');
      expect(getOverlayColor(4)).toBe('#FFBE0B');
      expect(getOverlayColor(5)).toBe('#F865B0');
      expect(getOverlayColor(6)).toBe('#446DF6');
      expect(getOverlayColor(7)).toBe('#FE4E00');
      expect(getOverlayColor(8)).toBe('#1BE7FF');
      expect(getOverlayColor(9)).toBe('#17BEBB');

      // After the 9th overlay, it goes back to the first color
      expect(getOverlayColor(10)).toBe('#06D6A0');
      expect(getOverlayColor(11)).toBe('#E9190F');
      expect(getOverlayColor(12)).toBe('#731DD8');
    });
  });
});

describe('getDefaultDataLabel()', () => {
  it('returns the default data label object', () => {
    expect(getDefaultDataLabel()).toStrictEqual({
      enabled: true,
      format: '{y}',
      rotation: 0.0001,
      style: {
        color: 'black',
        fontSize: '12px',
        fontWeight: 'bold',
        textOutline: '2px contrast',
      },
    });
  });
});

describe('buildGraphLink', () => {
  it('builds the graph link correctly', () => {
    expect(
      buildGraphLink({
        linkedDashboardId: '12',
        populationType: 'entire_squad',
        timePeriod: 'last_week',
      })
    ).toBe(
      '/analysis/dashboard/12?pivot=true&applies_to_squad=true&time_period=last_week'
    );

    expect(
      buildGraphLink({
        linkedDashboardId: '12',
        populationType: 'squad',
        populationId: '3',
        timePeriod: 'last_week',
      })
    ).toBe('/analysis/dashboard/12?pivot=true&squads=3&time_period=last_week');

    expect(
      buildGraphLink({
        linkedDashboardId: '12',
        populationType: 'athlete',
        populationId: '3',
        timePeriod: 'custom_date_range',
        dateRange: {
          start_date: '2019-09-03T00:00:00+01:00',
          end_date: '2019-09-14T23:59:59+01:00',
        },
      })
    ).toBe(
      '/analysis/dashboard/12?pivot=true&athletes=3&time_period=custom_date_range&start_date=2019-09-03T00%3A00%3A00%2B01%3A00&end_date=2019-09-14T23%3A59%3A59%2B01%3A00'
    );

    expect(
      buildGraphLink({
        linkedDashboardId: '12',
        populationType: 'athlete',
        populationId: '3',
        timePeriod: 'custom_date_range',
        dateRange: {
          start_date: '2019-09-03T00:00:00+01:00',
          end_date: '2019-09-14T23:59:59+01:00',
        },
      })
    ).toBe(
      '/analysis/dashboard/12?pivot=true&athletes=3&time_period=custom_date_range&start_date=2019-09-03T00%3A00%3A00%2B01%3A00&end_date=2019-09-14T23%3A59%3A59%2B01%3A00'
    );

    expect(
      buildGraphLink({
        linkedDashboardId: '12',
        populationType: 'athlete',
        populationId: '3',
        timePeriod: 'last_x_days',
        timePeriodLength: '300',
      })
    ).toBe(
      '/analysis/dashboard/12?pivot=true&athletes=3&time_period=last_x_days&time_period_length=300'
    );
  });
});

describe('sortDatapoints', () => {
  let datapoints = [];

  describe('when sorting is not enabled', () => {
    beforeEach(() => {
      datapoints = [
        { name: 'Chest', y: 1 },
        { name: 'Thoracic Spine', y: 1 },
        { name: 'Shoulder', y: 2 },
        { name: 'Thigh', y: 1 },
        { name: 'Wrist/Hand', y: 6 },
        { name: 'Ankle', y: 1 },
        { name: 'Trunk/Abdominal', y: 1 },
      ];
      window.setFlag('graph-sorting', true);
    });

    afterEach(() => {
      window.setFlag('graph-sorting', false);
    });

    it('does not modify datapoints order', () => {
      const sortConfig = {
        enabled: false,
        order: 'asc',
        metricIndex: 0,
        sortKey: 'name',
      };
      sortDatapoints(sortConfig, datapoints);

      expect(datapoints[0].name).toBe('Chest');
      expect(datapoints[1].name).toBe('Thoracic Spine');
      expect(datapoints[2].name).toBe('Shoulder');
      expect(datapoints[3].name).toBe('Thigh');
      expect(datapoints[4].name).toBe('Wrist/Hand');
      expect(datapoints[5].name).toBe('Ankle');
      expect(datapoints[6].name).toBe('Trunk/Abdominal');
    });
  });

  describe('when sorting is enabled', () => {
    beforeEach(() => {
      datapoints = [
        { name: 'Chest', y: 1 },
        { name: 'Thoracic Spine', y: 1 },
        { name: 'Shoulder', y: 2 },
        { name: 'Thigh', y: 1 },
        { name: 'Wrist/Hand', y: 6 },
        { name: 'Ankle', y: 1 },
        { name: 'Trunk/Abdominal', y: 1 },
      ];
      window.setFlag('graph-sorting', true);
    });

    afterEach(() => {
      window.setFlag('graph-sorting', false);
    });

    it('can sort by ascending name', () => {
      const sortConfig = {
        enabled: true,
        order: 'asc',
        metricIndex: 0,
        sortKey: 'name',
      };
      sortDatapoints(sortConfig, datapoints);

      expect(datapoints[0].name).toBe('Ankle');
      expect(datapoints[1].name).toBe('Chest');
      expect(datapoints[2].name).toBe('Shoulder');
      expect(datapoints[3].name).toBe('Thigh');
      expect(datapoints[4].name).toBe('Thoracic Spine');
      expect(datapoints[5].name).toBe('Trunk/Abdominal');
      expect(datapoints[6].name).toBe('Wrist/Hand');
    });

    it('can sort by decending name', () => {
      const sortConfig = {
        enabled: true,
        order: 'desc',
        metricIndex: 0,
        sortKey: 'name',
      };
      sortDatapoints(sortConfig, datapoints);

      expect(datapoints[6].name).toBe('Ankle');
      expect(datapoints[5].name).toBe('Chest');
      expect(datapoints[4].name).toBe('Shoulder');
      expect(datapoints[3].name).toBe('Thigh');
      expect(datapoints[2].name).toBe('Thoracic Spine');
      expect(datapoints[1].name).toBe('Trunk/Abdominal');
      expect(datapoints[0].name).toBe('Wrist/Hand');
    });

    it('can sort by decending value', () => {
      const sortConfig = {
        enabled: true,
        order: 'desc',
        metricIndex: 0,
        sortKey: 'y',
      };
      sortDatapoints(sortConfig, datapoints);

      expect(datapoints[0].name).toBe('Wrist/Hand');
      expect(datapoints[1].name).toBe('Shoulder');
      expect(datapoints[2].name).toBe('Ankle');
      expect(datapoints[3].name).toBe('Chest');
      expect(datapoints[4].name).toBe('Thigh');
      expect(datapoints[5].name).toBe('Thoracic Spine');
      expect(datapoints[6].name).toBe('Trunk/Abdominal');
    });

    it('can sort by decending value without sortKey', () => {
      const sortConfig = {
        enabled: true,
        order: 'desc',
        metricIndex: 0,
      };
      sortDatapoints(sortConfig, datapoints);

      expect(datapoints[0].name).toBe('Wrist/Hand');
      expect(datapoints[1].name).toBe('Shoulder');
      expect(datapoints[2].name).toBe('Ankle');
      expect(datapoints[3].name).toBe('Chest');
      expect(datapoints[4].name).toBe('Thigh');
      expect(datapoints[5].name).toBe('Thoracic Spine');
      expect(datapoints[6].name).toBe('Trunk/Abdominal');
    });

    it('can sort by assending value without sortKey', () => {
      const sortConfig = {
        enabled: true,
        order: 'asc',
        metricIndex: 0,
      };
      sortDatapoints(sortConfig, datapoints);

      expect(datapoints[0].name).toBe('Ankle');
      expect(datapoints[1].name).toBe('Chest');
      expect(datapoints[2].name).toBe('Thigh');
      expect(datapoints[3].name).toBe('Thoracic Spine');
      expect(datapoints[4].name).toBe('Trunk/Abdominal');
      expect(datapoints[5].name).toBe('Shoulder');
      expect(datapoints[6].name).toBe('Wrist/Hand');
    });
  });
});

describe('getSortedSeriesCategories', () => {
  const series = [
    {
      name: 'Ankle',
      stack: 'Entire Squad',
      data: [{ name: 'Ligament', y: 1 }],
    },
    {
      name: 'Chest',
      stack: 'Entire Squad',
      data: [{ name: 'Bruising/ Haematoma', y: 3 }],
    },
    {
      name: 'Shoulder',
      stack: 'Entire Squad',
      data: [
        { name: 'Bruising/ Haematoma', y: 1 },
        { name: 'Osteoarthritis', y: 3 },
      ],
    },
    {
      name: 'Thoracic Spine',
      stack: 'Entire Squad',
      data: [{ name: 'Laceration/ Abrasion', y: 3 }],
    },
    {
      name: 'Wrist/Hand',
      stack: 'Entire Squad',
      data: [{ name: 'Instability', y: 6 }],
    },
  ];

  describe('when graph-sorting feature flag is off', () => {
    beforeEach(() => {
      window.setFlag('graph-sorting', false);
    });

    it('returns null', () => {
      const sortConfig = {
        enabled: true,
        order: 'desc',
        metricIndex: 0,
        sortKey: 'mainCategoryTotal',
        secondaryOrder: 'asc',
        secondarySortKey: 'mainCategoryName',
      };
      const sortedCategories = getSortedSeriesCategories(
        sortConfig,
        series,
        false
      );

      expect(sortedCategories).toBe(null);
    });
  });

  describe('when sorting is not enabled in the config', () => {
    beforeEach(() => {
      window.setFlag('graph-sorting', true);
    });

    afterEach(() => {
      window.setFlag('graph-sorting', false);
    });

    it('returns null', () => {
      const sortConfig = {
        enabled: false,
        order: 'desc',
        metricIndex: 0,
        sortKey: 'mainCategoryTotal',
        secondaryOrder: 'asc',
        secondarySortKey: 'mainCategoryName',
      };
      const sortedCategories = getSortedSeriesCategories(
        sortConfig,
        series,
        false
      );

      expect(sortedCategories).toBe(null);
    });
  });

  describe('when sorting is enabled', () => {
    beforeEach(() => {
      window.setFlag('graph-sorting', true);
    });

    afterEach(() => {
      window.setFlag('graph-sorting', false);
    });

    it('can sort by ascending main category name', () => {
      const sortConfig = {
        enabled: true,
        order: 'asc',
        metricIndex: 0,
        sortKey: 'mainCategoryName',
      };
      const sortedCategories = getSortedSeriesCategories(
        sortConfig,
        series,
        false
      );

      expect(sortedCategories[0]).toBe('Bruising/ Haematoma');
      expect(sortedCategories[1]).toBe('Instability');
      expect(sortedCategories[2]).toBe('Laceration/ Abrasion');
      expect(sortedCategories[3]).toBe('Ligament');
      expect(sortedCategories[4]).toBe('Osteoarthritis');
    });

    it('can sort by descending main category name', () => {
      const sortConfig = {
        enabled: true,
        order: 'desc',
        metricIndex: 0,
        sortKey: 'mainCategoryName',
      };
      const sortedCategories = getSortedSeriesCategories(
        sortConfig,
        series,
        false
      );

      expect(sortedCategories[0]).toBe('Osteoarthritis');
      expect(sortedCategories[1]).toBe('Ligament');
      expect(sortedCategories[2]).toBe('Laceration/ Abrasion');
      expect(sortedCategories[3]).toBe('Instability');
      expect(sortedCategories[4]).toBe('Bruising/ Haematoma');
    });

    it('can sort by decending category total with secondary sort on category name', () => {
      const sortConfig = {
        enabled: true,
        order: 'desc',
        metricIndex: 0,
        sortKey: 'mainCategoryTotal',
        secondaryOrder: 'asc',
        secondarySortKey: 'mainCategoryName',
      };
      const sortedCategories = getSortedSeriesCategories(
        sortConfig,
        series,
        false
      );
      expect(sortedCategories[0]).toBe('Instability');
      expect(sortedCategories[1]).toBe('Bruising/ Haematoma');
      expect(sortedCategories[2]).toBe('Laceration/ Abrasion');
      expect(sortedCategories[3]).toBe('Osteoarthritis');
      expect(sortedCategories[4]).toBe('Ligament');
    });

    it('can sort by ascending category total with secondary sort on category name', () => {
      const sortConfig = {
        enabled: true,
        order: 'asc',
        metricIndex: 0,
        sortKey: 'mainCategoryTotal',
        secondaryOrder: 'asc',
        secondarySortKey: 'mainCategoryName',
      };
      const sortedCategories = getSortedSeriesCategories(
        sortConfig,
        series,
        false
      );
      expect(sortedCategories[0]).toBe('Ligament');
      expect(sortedCategories[1]).toBe('Laceration/ Abrasion');
      expect(sortedCategories[2]).toBe('Osteoarthritis');
      expect(sortedCategories[3]).toBe('Bruising/ Haematoma');
      expect(sortedCategories[4]).toBe('Instability');
    });

    it('can sort multi metric series at index 0', () => {
      const sortConfig = {
        enabled: true,
        order: 'desc',
        metricIndex: 0,
        sortKey: 'mainCategoryTotal',
        secondaryOrder: 'asc',
        secondarySortKey: 'mainCategoryName',
      };
      const multiSeries = [
        {
          name: 'Sleep',
          data: [
            {
              name: 'Forward',
              y: 6.3,
            },
            {
              name: 'Back',
              y: 6.5,
            },
            {
              name: 'Hooker',
              y: 7,
            },
          ],
        },
        {
          name: 'Sleep Duration',
          data: [
            {
              name: 'Forward',
              y: 403,
            },
            {
              name: 'Blindside Flanker',
              y: 280,
            },
            {
              name: 'Hooker',
              y: 427,
            },
          ],
        },
      ];
      const sortedCategories = getSortedSeriesCategories(
        sortConfig,
        multiSeries,
        true
      );

      expect(sortedCategories[0]).toBe('Hooker');
      expect(sortedCategories[1]).toBe('Back');
      expect(sortedCategories[2]).toBe('Forward');
      expect(sortedCategories[3]).toBe('Blindside Flanker');
    });

    it('can sort multi metric series at index 1', () => {
      const sortConfig = {
        enabled: true,
        order: 'desc',
        metricIndex: 1,
        sortKey: 'mainCategoryTotal',
        secondaryOrder: 'asc',
        secondarySortKey: 'mainCategoryName',
      };
      const multiSeries = [
        {
          name: 'Sleep',
          data: [
            {
              name: 'Forward',
              y: 6.3,
            },
            {
              name: 'Back',
              y: 6.5,
            },
            {
              name: 'Hooker',
              y: 7,
            },
          ],
        },
        {
          name: 'Sleep Duration',
          data: [
            {
              name: 'Forward',
              y: 403,
            },
            {
              name: 'Blindside Flanker',
              y: 280,
            },
            {
              name: 'Hooker',
              y: 427,
            },
          ],
        },
      ];
      const sortedCategories = getSortedSeriesCategories(
        sortConfig,
        multiSeries,
        true
      );

      expect(sortedCategories[0]).toBe('Hooker');
      expect(sortedCategories[1]).toBe('Forward');
      expect(sortedCategories[2]).toBe('Blindside Flanker');
      expect(sortedCategories[3]).toBe('Back');
    });
  });
});

describe('sortSeriesAlphabetically', () => {
  const series = [
    {
      name: 'Chest',
      stack: 'Entire Squad',
      data: [{ name: 'Bruising/ Haematoma', y: 3 }],
    },
    {
      name: 'Ankle',
      stack: 'Entire Squad',
      data: [{ name: 'Ligament', y: 1 }],
    },
    {
      name: 'Wrist/Hand',
      stack: 'Entire Squad',
      data: [{ name: 'Instability', y: 6 }],
    },
    {
      name: 'Thoracic Spine',
      stack: 'Entire Squad',
      data: [{ name: 'Laceration/ Abrasion', y: 3 }],
    },
    {
      name: 'Shoulder',
      stack: 'Entire Squad',
      data: [
        { name: 'Bruising/ Haematoma', y: 1 },
        { name: 'Osteoarthritis', y: 3 },
      ],
    },
  ];

  describe('when graph-sorting feature flag is off', () => {
    it('does not sort', () => {
      const testSeries = [...series];
      sortSeriesAlphabetically(testSeries);
      expect(testSeries[0].name).toBe('Chest');
      expect(testSeries[1].name).toBe('Ankle');
      expect(testSeries[2].name).toBe('Wrist/Hand');
      expect(testSeries[3].name).toBe('Thoracic Spine');
      expect(testSeries[4].name).toBe('Shoulder');
    });
  });

  describe('when sorting is enabled', () => {
    beforeEach(() => {
      window.setFlag('graph-sorting', true);
    });

    afterEach(() => {
      window.setFlag('graph-sorting', false);
    });

    it('will sort by series name', () => {
      const testSeries = [...series];
      sortSeriesAlphabetically(testSeries);
      expect(testSeries[0].name).toBe('Ankle');
      expect(testSeries[1].name).toBe('Chest');
      expect(testSeries[2].name).toBe('Shoulder');
      expect(testSeries[3].name).toBe('Thoracic Spine');
      expect(testSeries[4].name).toBe('Wrist/Hand');
    });
  });
});
