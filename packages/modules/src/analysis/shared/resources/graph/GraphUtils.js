import { TIME_PERIODS } from '@kitman/modules/src/analysis/shared/constants';

/**
 * Checks if the current metric is grouped with any other metrics.
 * It's used to hide the redundant Y-axes when the metric series
 * are grouped and are on the same scale. Grouping is done in the backend.
 *
 * Some good-to-knows:
 *  - if metricsLength < 2 we are not in a multi-metric setup
 *  - if metric.status.grouped_with.length < 1 we may be in a
 *    multi-metric setup, but the metrics are not grouped
 *  - if index > Math.min(metric.status.grouped_with)
 *    we can be sure that we are in a multi-metric setup and the current
 *    metric is not the first one
 * @param metricsLength number of metrics
 * @param metric the current metric
 * @param index index of the current metric
 * @returns {boolean}
 */
export const isGroupedSecondAxis = (metricsLength, metric, index) => {
  if (
    metric.type === 'medical' ||
    metricsLength < 2 ||
    metric.status.grouped_with.length < 1
  ) {
    return false;
  }

  return index > Math.min(...metric.status.grouped_with);
};

export const isGroupedAxis = (metric) => {
  if (metric.type === 'medical') {
    return false;
  }

  return metric.status.grouped_with.length > 0;
};

// Grouped metrics have the same name if they have the same name and the same unit
export const haveGroupedMetricsTheSameName = (metric, metrics) => {
  let groupedMetricsHaveTheSameName = true;

  metric.status.grouped_with.forEach((metricIndex) => {
    if (
      metrics[metricIndex].status.name !== metric.status.name ||
      metrics[metricIndex].status.localised_unit !==
        metric.status.localised_unit
    ) {
      groupedMetricsHaveTheSameName = false;
    }
  });

  return groupedMetricsHaveTheSameName;
};

export const axesGroupingMatrix = (graphData) => {
  const groupingMatrix = [];
  if (Object.keys(graphData).length > 0 && graphData.constructor === Object) {
    graphData.metrics.forEach((metric) => {
      groupingMatrix.push(
        metric.type === 'medical' ? [] : metric.status.grouped_with
      );
    });
  }
  return groupingMatrix;
};

/*
 * This function return the list of y axes with the metrics associated to them
 * Array<
 *  [AxisIndex]
 *  {
 *    metricIndexes: Array<metricIndex>
 *  }
 * >
 */
export const getYAxisList = (graphData) => {
  const yAxisList = [];
  let metricsAlreadyAssignedToAnAxis = [];

  axesGroupingMatrix(graphData).forEach(
    (metricsGroupedWithThisMetric, metricIndex) => {
      // If the metric is already assigned to an axis, do not create a new axis
      if (metricsAlreadyAssignedToAnAxis.includes(metricIndex)) {
        return;
      }

      yAxisList.push({
        metricIndexes: [metricIndex, ...metricsGroupedWithThisMetric],
      });

      metricsAlreadyAssignedToAnAxis = [
        ...metricsAlreadyAssignedToAnAxis,
        metricIndex,
        ...metricsGroupedWithThisMetric,
      ];
    }
  );

  return yAxisList;
};

export const getYAxisIndex = (axisList, metricIndex, axisOffset = 0) => {
  let yAxisIndex;

  axisList.forEach((axis, axisIndex) => {
    if (axis.metricIndexes.includes(metricIndex)) {
      yAxisIndex = axisIndex;
    }
  });

  return yAxisIndex + axisOffset;
};

export const getOverlayColor = (overlayIndex) => {
  const overlayColors = [
    '#06D6A0',
    '#E9190F',
    '#731DD8',
    '#2DC7FF',
    '#FFBE0B',
    '#F865B0',
    '#446DF6',
    '#FE4E00',
    '#1BE7FF',
    '#17BEBB',
  ];
  return overlayColors[overlayIndex % overlayColors.length];
};

export const getChartOverlays = (metrics, yAxisOffset) => {
  const chartOverlays = {};
  let overlayCounter = 0;

  metrics.forEach((metric, metricIndex) => {
    metric.overlays.forEach((overlay, overlayIndex) => {
      const overlayId = `plotline-${metricIndex}-${overlayIndex}`;

      chartOverlays[overlayId] = {
        id: `plotline-${metricIndex}-${overlayIndex}`,
        color: getOverlayColor(overlayCounter),
        type: 'line',
        value: overlay.value,
        width: 2,
        dashStyle: 'shortdash',
        yIndex: isGroupedSecondAxis(metrics.length, metric, metricIndex)
          ? yAxisOffset
          : metricIndex + yAxisOffset,
      };

      overlayCounter += 1;
    });
  });

  return chartOverlays;
};

export const getDefaultDataLabel = () => ({
  enabled: true,
  format: '{y}',
  /**
   * Setting rotation to 0.0001 so highcharts will render a
   * text svg element instead of a label. Chrome 92 contains
   * a bug that drastically affects the rendering performance
   * of the rendering label. This issue is fixed in Chrome 94
   * so this can be safely removed when Chrome 94 is widely used
   *
   * See more info here:
   * https://github.com/highcharts/highcharts/issues/16121#issuecomment-891732526
   */
  rotation: 0.0001,
  style: {
    color: 'black',
    fontSize: '12px',
    fontWeight: 'bold',
    textOutline: '2px contrast',
  },
});

export const buildPivotUrlParams = ({
  squadAthletesSelection,
  timePeriod,
  timePeriodLength,
  dateRange = null,
}) => {
  let pivotUrlParams = '?pivot=true';

  // Population
  if (squadAthletesSelection.applies_to_squad) {
    pivotUrlParams += '&applies_to_squad=true';
  }

  if (squadAthletesSelection.position_groups.length > 0) {
    pivotUrlParams += `&position_groups=${squadAthletesSelection.position_groups.join(
      ','
    )}`;
  }

  if (squadAthletesSelection.positions.length > 0) {
    pivotUrlParams += `&positions=${squadAthletesSelection.positions.join(
      ','
    )}`;
  }

  if (squadAthletesSelection.athletes.length > 0) {
    pivotUrlParams += `&athletes=${squadAthletesSelection.athletes.join(',')}`;
  }

  if (squadAthletesSelection.all_squads) {
    pivotUrlParams += '&all_squads=true';
  }

  if (squadAthletesSelection.squads.length > 0) {
    pivotUrlParams += `&squads=${squadAthletesSelection.squads.join(',')}`;
  }

  // Time Period
  pivotUrlParams += `&time_period=${timePeriod}`;

  if (timePeriod === TIME_PERIODS.customDateRange) {
    pivotUrlParams += `&start_date=${encodeURIComponent(dateRange.start_date)}`;
    pivotUrlParams += `&end_date=${encodeURIComponent(dateRange.end_date)}`;
  }

  if (timePeriod === TIME_PERIODS.lastXDays) {
    pivotUrlParams += `&time_period_length=${timePeriodLength}`;
  }

  return pivotUrlParams;
};

export const buildGraphLink = ({
  linkedDashboardId,
  populationType,
  populationId = null,
  timePeriod,
  timePeriodLength,
  dateRange = null,
}) => {
  const squadAthletesSelection = {
    applies_to_squad: populationType === 'entire_squad',
    position_groups: populationType === 'position_group' ? [populationId] : [],
    positions: populationType === 'position' ? [populationId] : [],
    athletes: populationType === 'athlete' ? [populationId] : [],
    all_squads: populationType === 'all_squads',
    squads: populationType === 'squad' ? [populationId] : [],
  };

  const pivotUrlParams = buildPivotUrlParams({
    squadAthletesSelection,
    timePeriod,
    timePeriodLength,
    dateRange,
  });

  return `/analysis/dashboard/${linkedDashboardId}${pivotUrlParams}`;
};

// This function returns array of sorted category names : [string]
export const getSortedSeriesCategories = (
  sortingConfig,
  series,
  isMultiMetric
) => {
  if (
    !sortingConfig.enabled ||
    !window.getFlag('graph-sorting') ||
    series.length <= sortingConfig.metricIndex
  ) {
    return null;
  }

  if (
    sortingConfig.sortKey === 'mainCategoryName' ||
    sortingConfig.sortKey === 'mainCategoryTotal'
  ) {
    const mainCategoriesDict = {};

    // If doing a multi metric sort :
    // Add every datapoint name (category) to the dictionary
    // This ensures categories not in the sorting metric index don't disappear on the chart
    // But only count up the values in the metric index we want to sort by
    // So the others will be zero and not affect the sort order
    // NOTE: This assumes zero is a good number ( i.e. we won't have negative values to sort)

    // If doing a non multi metric sort :
    // Add every datapoint name (category) to the dictionary
    // Count up totals for each

    series.forEach((metric, index) => {
      if (metric.data) {
        metric.data.forEach((dataPoint) => {
          if (dataPoint.name in mainCategoriesDict) {
            mainCategoriesDict[dataPoint.name] +=
              isMultiMetric && index !== sortingConfig.metricIndex
                ? 0
                : dataPoint.y;
          } else {
            mainCategoriesDict[dataPoint.name] =
              isMultiMetric && index !== sortingConfig.metricIndex
                ? 0
                : dataPoint.y;
          }
        });
      }
    });

    const mainCategories = Object.keys(mainCategoriesDict);
    if (sortingConfig.sortKey === 'mainCategoryName') {
      mainCategories.sort(function sortByCategoryName(a, b) {
        if (a > b) {
          return sortingConfig.order === 'desc' ? -1 : 1;
        }

        if (b > a) {
          return sortingConfig.order === 'desc' ? 1 : -1;
        }

        return 0;
      });

      return mainCategories;
    }
    if (sortingConfig.sortKey === 'mainCategoryTotal') {
      mainCategories.sort(function sortByCategoryTotal(a, b) {
        if (mainCategoriesDict[a] > mainCategoriesDict[b]) {
          return sortingConfig.order === 'desc' ? -1 : 1;
        }

        if (mainCategoriesDict[b] > mainCategoriesDict[a]) {
          return sortingConfig.order === 'desc' ? 1 : -1;
        }

        if (sortingConfig.secondarySortKey === 'mainCategoryName') {
          if (a > b) {
            return sortingConfig.secondaryOrder === 'desc' ? -1 : 1;
          }

          if (b > a) {
            return sortingConfig.secondaryOrder === 'desc' ? 1 : -1;
          }
        }

        return 0;
      });

      return mainCategories;
    }
  }

  return null; // Default sorting will apply when null categories set
};

export const sortSeriesAlphabetically = (series) => {
  if (!window.getFlag('graph-sorting')) {
    return;
  }

  series.sort(function sortSeriesByName(a, b) {
    if (a.name > b.name) {
      return 1;
    }

    if (b.name > a.name) {
      return -1;
    }

    return 0;
  });
};

// This function sorts in place datapoints array based on graphData.sorting object of type SummaryGraphSortConfig
export const sortDatapoints = (sortingConfig, datapoints) => {
  if (!sortingConfig.enabled || !window.getFlag('graph-sorting')) {
    return;
  }

  if (sortingConfig.sortKey === undefined || sortingConfig.sortKey === 'y') {
    datapoints.sort(function sortByY(a, b) {
      if (a.y > b.y) {
        return sortingConfig.order === 'desc' ? -1 : 1;
      }

      if (b.y > a.y) {
        return sortingConfig.order === 'desc' ? 1 : -1;
      }

      // By default we Secondary sort by datapoint name asc
      if (a.name < b.name) {
        return -1;
      }

      if (b.name < a.name) {
        return 1;
      }

      return 0;
    });
  }

  if (sortingConfig.sortKey === 'name') {
    datapoints.sort(function sortByName(a, b) {
      if (a.name > b.name) {
        return sortingConfig.order === 'desc' ? -1 : 1;
      }

      if (b.name > a.name) {
        return sortingConfig.order === 'desc' ? 1 : -1;
      }

      // By default we Secondary sort by datapoint value desc

      if (a.y > b.y) {
        return -1;
      }

      if (b.y > a.y) {
        return 1;
      }

      return 0;
    });
  }
};
