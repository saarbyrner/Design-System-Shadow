// @flow
import _findIndex from 'lodash/findIndex';
import i18n from '@kitman/common/src/utils/i18n';
import _range from 'lodash/range';
import _sum from 'lodash/sum';
import _round from 'lodash/round';
import _uniq from 'lodash/uniq';
import { humanizeTimestamp } from '@kitman/common/src/utils/dateFormatter';
import { getSelectedItems } from '@kitman/components/src/AthleteSelector/utils';
import {
  TABLE_WIDGET_DATA_SOURCE_TYPES,
  TABLE_WIDGET_DATA_SOURCES,
  type TableWidgetDataSourceType,
  type RankingCalculation,
  type RankingCalculationConfig,
  type RankingDirection,
  type TableCalculation,
  type TableFormulaColumnData,
  type TableWidgetCellData,
  type TableWidgetCellValue,
  type TableWidgetColumn,
  type TableWidgetFormatRule,
  type TableWidgetFormulaInput,
  type TableWidgetDataSource,
  type TableWidgetRow,
  type TableWidgetRowMetric,
  type TableWidgetRowTimeScope,
  type HiddenCalculationOptios,
  type FormulaInputParams,
  type TableWidgetElementSource,
  type DynamicRowData,
  type DynamicRows,
  type DynamicRowItem,
} from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/types';
import {
  getInputParamsFromDataSource,
  getNonEmptyParams,
} from '@kitman/modules/src/analysis/Dashboard/utils';
import { EMPTY_SELECTION } from '@kitman/components/src/Athletes/constants';
import { FORMULA_INPUT_IDS } from '@kitman/modules/src/analysis/shared/constants';
import {
  NO_GROUPING,
  NOT_AVAILABLE,
  LOADER_LEVEL,
  DASH,
} from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/consts';
import { DATA_SOURCES } from '@kitman/modules/src/analysis/Dashboard/components/types';
import colors from '@kitman/common/src/variables/colors';
import { type ColumnFormulaState } from '@kitman/modules/src/analysis/Dashboard/redux/types/store';
import {
  type SquadAthletesSelection,
  type SquadAthletes,
} from '@kitman/components/src/types';
import { type Squad } from '@kitman/common/src/types/Squad';
import { type LabelPopulation } from '@kitman/services/src/services/analysis/labels';
import { type GroupPopulation } from '@kitman/services/src/services/analysis/groups';
import { type Option } from '@kitman/components/src/Select';
import { type FormulaDetails } from '@kitman/modules/src/analysis/shared/types';
import { type DataSourceFormState } from '@kitman/modules/src/analysis/Dashboard/components/ChartBuilder/types';
import { type CodingSystemKey } from '@kitman/common/src/types/Coding';
import type {
  SeriesType,
  AxisConfig,
} from '@kitman/modules/src/analysis/shared/components/XYChart/types';
import { type Grouping } from '@kitman/modules/src/analysis/shared/types/charts';
import type { DataSource } from '@kitman/modules/src/analysis/Dashboard/components/types';

import { calculationParamsMap } from '../PanelModules/components/CalculationModule';
import { emptyDataSourceFormState } from '../../redux/slices/chartBuilder';

/**
 * Returns the numeric value of data that is returned from
 * the data_render api on the table widget that can be used in calculations.
 *
 * @param {TableWidgetCellValue} value table cell value returned from the api
 * @param {string} calculation used by the table data source
 * @returns
 */
export const getNumericCellValue = (
  value: TableWidgetCellValue,
  calculation?: string,
  returnDenominator?: boolean
): number | null => {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    return parseFloat(value);
  }

  if (
    typeof value?.numerator !== 'undefined' &&
    typeof value?.denominator !== 'undefined'
  ) {
    let newValue = parseFloat(
      returnDenominator ? value.denominator : value.numerator
    );

    if (calculation === 'percentage' || calculation === 'percentage_duration') {
      newValue =
        (parseFloat(value.numerator) / parseFloat(value.denominator)) * 100;
    }

    return newValue;
  }

  if (typeof value?.status !== 'undefined') {
    return null;
  }

  return null;
};

/**
 * Returns the formatted value of data that is returned from
 * the data_render api on the table widget.
 *
 * @param {TableWidgetCellValue} value table cell value returned from the api
 * @param {string} calculation used by the table data source
 * @returns
 */
export const getFormattedCellValue = (
  value: TableWidgetCellValue,
  calculation?: string
): string => {
  if (typeof value === 'number') {
    return `${value}`;
  }

  if (typeof value === 'string') {
    return value;
  }

  if (
    typeof value?.numerator !== 'undefined' &&
    typeof value?.denominator !== 'undefined'
  ) {
    let newValue = `${value.numerator} / ${value.denominator}`;

    if (calculation === 'percentage' || calculation === 'percentage_duration') {
      newValue = `${_round((value.numerator / value.denominator) * 100, 2)}%`;
    }

    if (calculation === 'count') {
      newValue = `${value.numerator}`;
    }

    return newValue;
  }

  if (typeof value?.status !== 'undefined') {
    return value?.status;
  }

  return '';
};
export const getSortedTablePopulation = (
  tablePopulation: Array<{ id: string | number, name: string }>,
  sortedPopulationIds: Array<string>
) => {
  // build a new orderedPopulation array based on the passed in sortedPopulationIds
  const orderedPopulation = sortedPopulationIds.map((populationId) => {
    return (
      tablePopulation.find(({ id }) => id.toString() === populationId) || {}
    );
  });

  // get any empty cells which were not sorted
  const emptyCells = tablePopulation.filter(
    (population) => !orderedPopulation.includes(population)
  );

  // add them to the end of the orderedPopulation array and return
  // $FlowFixMe
  return orderedPopulation.concat(emptyCells);
};

export const getTableRowMetrics = (
  tableMetrics: Array<TableWidgetRowMetric>,
  sortedMetricIds: Array<string>
) => {
  // build a new orderedMetrics array based on the passed in sortedMetricIds
  const orderedMetrics = sortedMetricIds.map((metricId) => {
    return tableMetrics.find(({ id }) => id === metricId) || {};
  });

  // get any empty cells which were not sorted
  const emptyCells = tableMetrics.filter(
    (metric) => !orderedMetrics.includes(metric)
  );

  // add them to the end of the orderedMetrics array and return
  // $FlowFixMe
  return orderedMetrics.concat(emptyCells);
};

export const getTableRowTimeScopes = (
  timeScopes: Array<TableWidgetRowTimeScope>,
  sortedTimeScopeIds: Array<string>
) => {
  // build a new orderedTimeScopes array based on the passed in sortedTimeScopeIds
  const orderedTimeScopes = sortedTimeScopeIds.map((timeScopeId) => {
    return timeScopes.find(({ id }) => id.toString() === timeScopeId) || {};
  });

  // get any empty cells which were not sorted
  const emptyCells = timeScopes.filter(
    (timeScope) => !orderedTimeScopes.includes(timeScope)
  );

  // add them to the end of the orderedTimeScopes array and return
  // $FlowFixMe
  return orderedTimeScopes.concat(emptyCells);
};

export const getTablePopulation = (
  selectedSquadAthletes: SquadAthletesSelection,
  squadAthletes: SquadAthletes,
  squads: Array<Squad>,
  sortOrder: Array<string>,
  labels?: Array<LabelPopulation>,
  segments?: Array<GroupPopulation>
) => {
  const selectedItems = [];

  if (selectedSquadAthletes.applies_to_squad) {
    selectedItems.push({ id: 'entire_squad', name: i18n.t('Entire Squad') });
  }

  squadAthletes.position_groups.forEach((positionGroup) => {
    if (selectedSquadAthletes.position_groups.includes(positionGroup.id)) {
      selectedItems.push({ id: positionGroup.id, name: positionGroup.name });
    }

    positionGroup.positions.forEach((position) => {
      if (selectedSquadAthletes.positions.includes(position.id)) {
        selectedItems.push({ id: position.id, name: position.name });
      }

      position.athletes.forEach((athlete) => {
        if (selectedSquadAthletes.athletes.includes(athlete.id)) {
          selectedItems.push({
            id: athlete.id.toString(),
            name: athlete.fullname,
          });
        }
      });
    });
  });

  if (selectedSquadAthletes.all_squads) {
    selectedItems.push({
      id: 'all_squads',
      name: i18n.t('#sport_specific__All_Squads'),
    });
  }

  if (selectedSquadAthletes.squads && selectedSquadAthletes.squads.length > 0) {
    squads.forEach((squad) => {
      if (selectedSquadAthletes.squads.includes(squad.id)) {
        selectedItems.push({ id: squad.id, name: squad.name });
      }
    });
  }

  if (selectedSquadAthletes.labels) {
    selectedSquadAthletes.labels.forEach((labelId) => {
      const selectedLabel = labels?.find((label) => label.id === labelId);
      if (selectedLabel)
        selectedItems.push({
          id: selectedLabel.id,
          name: selectedLabel.name,
        });
    });
  }

  if (selectedSquadAthletes.segments) {
    selectedSquadAthletes.segments.forEach((segmentId) => {
      const selectedSegment = segments?.find(
        (segment) => segment.id === segmentId
      );
      if (selectedSegment)
        selectedItems.push({
          id: selectedSegment.id,
          name: selectedSegment.name,
        });
    });
  }

  return sortOrder.length
    ? getSortedTablePopulation(selectedItems, sortOrder)
    : selectedItems;
};

export const getCalculationDropdownOptions = (
  {
    withComplexCalcs,
    dataSourceType,
  }: {
    withComplexCalcs?: boolean,
    dataSourceType?: TableWidgetDataSourceType,
  } = {
    withComplexCalcs: false,
    dataSourceType: '',
  }
): Array<{
  id: TableCalculation,
  title: string,
}> => {
  const regularCalculations = [
    {
      id: 'sum_absolute',
      title: i18n.t('Sum (Absolute)'),
    },
    {
      id: 'sum',
      title: i18n.t('Sum'),
    },
    {
      id: 'min_absolute',
      title: i18n.t('Min (Absolute)'),
    },
    {
      id: 'min',
      title: i18n.t('Min'),
    },
    {
      id: 'max_absolute',
      title: i18n.t('Max (Absolute)'),
    },
    {
      id: 'max',
      title: i18n.t('Max'),
    },
    {
      id: 'mean',
      title: i18n.t('Mean'),
    },
    {
      id: 'mean_absolute',
      title: i18n.t('Mean (Absolute)'),
    },
    {
      id: 'count',
      title: i18n.t('Count'),
    },
    {
      id: 'count_absolute',
      title: i18n.t('Count (Absolute)'),
    },
    {
      id: 'last',
      title: i18n.t('Last'),
    },
  ];
  let complexCalculations = [];

  if (window.getFlag('table-widget-complex-calculations') && withComplexCalcs) {
    complexCalculations = [
      { id: 'z_score', title: i18n.t('Z-Score') },
      { id: 'complex_z_score', title: i18n.t('Complex Z-Score') },
      { id: 'acute_chronic', title: i18n.t('Acute:Chronic') },
      { id: 'acute_chronic_ewma', title: i18n.t('Acute:Chronic (EWMA)') },
      {
        id: 'training_stress_balance',
        title: i18n.t('Training Stress Balance'),
      },
      { id: 'standard_deviation', title: i18n.t('Standard Deviation') },
      { id: 'strain', title: i18n.t('Strain') },
      { id: 'monotony', title: i18n.t('Monotony') },
      {
        id: 'average_percentage_change',
        title: i18n.t('Average Percentage Change'),
      },
    ];
  }

  const options = [...regularCalculations, ...complexCalculations];

  if (dataSourceType === TABLE_WIDGET_DATA_SOURCE_TYPES.maturityEstimate) {
    return options.filter(
      ({ id }) =>
        ![
          'sum',
          'sum_absolute',
          'acute_chronic',
          'acute_chronic_ewma',
          'training_stress_balance',
          'strain',
          'monotony',
          'average_percentage_change',
        ].includes(id)
    );
  }

  if (dataSourceType === DATA_SOURCES.games) {
    return options.filter(
      ({ id }) =>
        !['min_absolute', 'max_absolute', 'mean_absolute'].includes(id)
    );
  }

  return options;
};

export const getAvailabilityCalculationOptions = ({
  hideProportion,
  hideCount,
  hidePercentage,
}: HiddenCalculationOptios): Array<{
  value: string,
  label: string,
}> => {
  const optionsMap = [
    {
      value: 'proportion',
      label: i18n.t('Proportion'),
      hidden: hideProportion,
    },
    { value: 'count', label: i18n.t('Count'), hidden: hideCount },
    {
      value: 'percentage',
      label: i18n.t('Percentage'),
      hidden: hidePercentage,
    },
  ];

  return optionsMap
    .filter((option) => !option.hidden)
    .map(({ value, label }) => ({ value, label }));
};

export const getParticipationOptions = () => [
  {
    value: 'participation_status',
    label: i18n.t('Participation Status'),
  },
  {
    value: 'participation_levels',
    label: i18n.t('Participation Level'),
  },
  ...(window.getFlag('rep-game-involvement')
    ? [
        {
          value: 'game_involvement',
          label: i18n.t('Game Involvement'),
        },
      ]
    : []),
];

export const getInvolvementUnits = () => [
  {
    name: i18n.t('Number of events'),
    value: 'events',
  },
  {
    name: i18n.t('Minutes'),
    value: 'minutes',
  },
];

export const getInvolvementMinutesOptions = ({
  hideProportion,
  hidePercentage,
}: HiddenCalculationOptios) => [
  ...(!hidePercentage
    ? [{ id: 'percentage_duration', title: i18n.t('Percentage') }]
    : []),
  ...(!hideProportion
    ? [{ id: 'proportion_duration', title: i18n.t('Proportion') }]
    : []),
];

export const getCalculationTitle = (calculationId: ?string) => {
  if (calculationId === TABLE_WIDGET_DATA_SOURCES.formula) {
    return i18n.t('Formula');
  }

  const dropdownOption = [
    ...getCalculationDropdownOptions({ withComplexCalcs: true }),
    ...getInvolvementMinutesOptions({}),
    ...getAvailabilityCalculationOptions({}).map(({ value, label }) => ({
      id: value,
      title: label,
    })),
  ].find((option) => option.id === calculationId);

  return dropdownOption ? dropdownOption.title : '';
};

export const getSummaryName = (summaryId: string) => {
  switch (summaryId) {
    case 'mean':
      return i18n.t('Mean');
    case 'min':
      return i18n.t('Min');
    case 'max':
      return i18n.t('Max');
    case 'sum':
      return i18n.t('Sum');
    case 'filled':
      return i18n.t('Filled');
    case 'empty':
      return i18n.t('Empty');
    case 'percentageFilled':
      return i18n.t('% Filled');
    case 'percentageEmpty':
      return i18n.t('% Empty');
    case 'range':
      return i18n.t('Range');
    case 'median':
      return i18n.t('Median');
    case 'standardDeviation':
      return i18n.t('SD', { context: 'Abbreviation of Standard Deviation' });
    default:
      return i18n.t('Mean');
  }
};

const calculateSummary = (
  summaryId: number | string,
  data: Array<number | null> = []
) => {
  const nonNullValues: Array<number> = data.reduce(
    (prev, next) => (next == null ? prev : [...prev, next]),
    []
  );
  let result = '';

  const sum = nonNullValues.reduce(
    (accumulator, currentValue) =>
      parseFloat(accumulator) + parseFloat(currentValue),
    0
  );

  const numberOfResults = data.length;

  const filled = nonNullValues.length;

  const empty = numberOfResults - filled;

  const mean = filled > 0 ? sum / filled : 0;

  const percentageFilled =
    numberOfResults === 0 ? 0 : (filled / numberOfResults) * 100;

  const percentageEmpty =
    numberOfResults === 0 ? 0 : (empty / numberOfResults) * 100;

  const minValue = nonNullValues.reduce(
    (min, currentValue) =>
      parseFloat(currentValue) < min ? parseFloat(currentValue) : min,
    nonNullValues[0] && nonNullValues[0]
  );

  const maxValue = nonNullValues.reduce(
    (max, currentValue) =>
      parseFloat(currentValue) > max ? parseFloat(currentValue) : max,
    nonNullValues[0] && nonNullValues[0]
  );

  const range = () => {
    let minRange = minValue;
    let maxRange = maxValue;

    if (!nonNullValues.length) return '';

    if (minRange?.toString().includes('.')) {
      minRange = parseFloat(minRange).toFixed(2);
    }

    if (maxRange?.toString().includes('.')) {
      maxRange = parseFloat(maxRange).toFixed(2);
    }

    return `${minRange} - ${maxRange}`;
  };

  const median = () => {
    if (nonNullValues.length === 0) return null;

    const sortedData = nonNullValues.sort((a, b) => {
      return a - b;
    });
    const datalength = sortedData.length;
    const middleIndex = Math.floor(datalength / 2);

    if (sortedData.length % 2) {
      if (sortedData.length === 1) {
        return sortedData[0];
      }

      return sortedData[middleIndex];
    }

    return (
      (parseFloat(sortedData[middleIndex - 1]) +
        parseFloat(sortedData[middleIndex])) /
      2
    );
  };

  const standardDeviation = () => {
    if (nonNullValues.length === 0) return null;

    const squaredDistanceToMean = nonNullValues.map(
      (dataPoint) => (dataPoint - mean) ** 2
    );

    const sumOfSquaredDistancesToMean = squaredDistanceToMean.reduce(
      (a, b) => a + b,
      0
    );

    return Math.sqrt(sumOfSquaredDistancesToMean / nonNullValues.length);
  };

  switch (summaryId) {
    case 'mean':
      result = mean;
      break;
    case 'min':
      result = minValue;
      break;
    case 'max':
      result = maxValue;
      break;
    case 'sum':
      result = sum;
      break;
    case 'filled':
      result = filled;
      break;
    case 'empty':
      result = empty;
      break;
    case 'percentageFilled':
      return Number.isInteger(percentageFilled)
        ? `${percentageFilled}%`
        : `${percentageFilled.toFixed(1)}%`;
    case 'percentageEmpty':
      return Number.isInteger(percentageEmpty)
        ? `${percentageEmpty}%`
        : `${percentageEmpty.toFixed(1)}%`;
    case 'range':
      return range();
    case 'median':
      result = median();
      break;
    case 'standardDeviation':
      result = standardDeviation();
      break;
    default:
      result = mean;
      break;
  }

  if (typeof result === 'undefined' || result === null) return '';

  return result.toString().includes('.')
    ? parseFloat(result).toFixed(2)
    : result;
};

export const getSummaryValue = (
  summaryId: number | string,
  data: Array<TableWidgetCellValue> = [],
  columnCalculation?: string
) => {
  if (
    ['filled', 'empty', 'percentageFilled', 'percentageEmpty'].includes(
      summaryId
    )
  ) {
    return calculateSummary(
      summaryId,
      data.map((value) => getNumericCellValue(value, columnCalculation))
    );
  }

  if (columnCalculation === 'proportion') {
    const numeratorData = data.map((value) =>
      getNumericCellValue(value, columnCalculation)
    );
    const denominatorData = data.map((value) =>
      getNumericCellValue(value, columnCalculation, true)
    );

    return `${calculateSummary(summaryId, numeratorData)} / ${calculateSummary(
      summaryId,
      denominatorData
    )}`;
  }

  if (columnCalculation === 'percentage') {
    const summaryCalc = calculateSummary(
      summaryId,
      data.map((value) => getNumericCellValue(value, columnCalculation))
    );

    if (summaryId === 'range' && typeof summaryCalc === 'string') {
      return `${summaryCalc.replace(' - ', '% - ')}%`;
    }

    return `${summaryCalc}%`;
  }

  return calculateSummary(
    summaryId,
    data.map((value) => getNumericCellValue(value, columnCalculation))
  );
};

const getValue = (
  cellValue: TableWidgetCellValue,
  type: string,
  calculation: string
) => {
  switch (type) {
    case 'string':
      return getFormattedCellValue(cellValue, calculation);
    case 'numeric':
    default:
      return getNumericCellValue(cellValue, calculation);
  }
};

export const shouldFormatCell = (
  cellValue: TableWidgetCellValue,
  formatRule: TableWidgetFormatRule,
  calculation: string
) => {
  const value = getValue(cellValue, formatRule.type, calculation);
  const ruleValue =
    formatRule.type === 'numeric'
      ? parseFloat(formatRule.value)
      : formatRule.value;

  if (value === null || value === '') {
    return false;
  }

  if (
    typeof value === 'number' &&
    typeof ruleValue === 'number' &&
    formatRule.condition === 'less_than'
  ) {
    return value < ruleValue;
  }

  if (
    typeof value === 'number' &&
    typeof ruleValue === 'number' &&
    formatRule.condition === 'greater_than'
  ) {
    return value > ruleValue;
  }

  if (formatRule.condition === 'equal_to') {
    return value === ruleValue;
  }

  if (formatRule.condition === 'not_equal_to') {
    return value !== ruleValue;
  }

  return false;
};

export const getCellDetails = (
  columnData: Array<TableWidgetCellData>,
  id: number | string,
  rowData?: DynamicRowData
): TableWidgetCellData => {
  const cellData = columnData.find((item) => item.id === id?.toString());

  if (rowData) {
    const childRowId = rowData?.label;

    if (!childRowId) {
      return { id, value: null };
    }

    const itemValue = cellData?.children?.find((item) =>
      [childRowId, NOT_AVAILABLE.label].includes(item.id)
    );

    return {
      id: childRowId,
      value:
        itemValue?.id === NOT_AVAILABLE.label
          ? i18n.t('N/A')
          : itemValue?.value ?? DASH,
    };
  }

  if (cellData) {
    return cellData;
  }

  return {
    id,
    value: null,
  };
};

export const getCellColour = (
  rules: Array<TableWidgetFormatRule>,
  cellValue: TableWidgetCellValue,
  calculation: string,
  customColour?: string
) => {
  let cellColour = customColour || colors.white;

  const hasRules = rules.length > 0;
  const hasValidCell = cellValue !== null && cellValue !== undefined;
  const shouldApplyRules = hasRules && (customColour || hasValidCell);

  if (shouldApplyRules) {
    rules.forEach((rule) => {
      if (shouldFormatCell(cellValue, rule, calculation)) {
        cellColour = rule.color;
      }
    });
  }

  return { background: cellColour };
};

/**
 * Returns percentile value for input based on arr supplied.
 * Based on the PERCENTRANK.INC function in excel
 *
 * @param {arrray<number>} arr data array of values
 * @param {number} value number to calulate percentile of
 * @returns number
 */
function percentRank(arr, x) {
  let s = 0;
  let b = 0;
  for (let k = 0; k < arr.length; k++) {
    if (arr[k] < x) {
      s += 1;
    } else {
      b += 1;
    }
  }
  return s / (s + b - 1);
}

/**
 * Gets a ranking calculation for a number based on the full
 * data array
 *
 * @param {number} value value to be ranked
 * @param {Array<number>} data Array of values to be ranked
 * @param {'NONE'|'RANK'|'QUARTILE'|'PERCENTILE'|'QUINTILE'|'SPLIT_RANK'} calculation Ranking calculation to be used
 * @param {'HIGH_LOW'|'LOW_HIGH'|'NONE'} direction Direction of ranking to be used
 * @returns {number} ranked value
 */
export const getRankingCalculation = (
  cellValue: TableWidgetCellValue,
  tableData: Array<TableWidgetCellValue>,
  calculation: RankingCalculation = 'NONE',
  direction: RankingDirection = 'NONE',
  columnSummaryCalculation: string
) => {
  const value = getNumericCellValue(cellValue, columnSummaryCalculation);
  const data: Array<number> = tableData
    .map((val) => getNumericCellValue(val, columnSummaryCalculation))
    .reduce((prev, next) => (next == null ? prev : [...prev, next]), []);

  const dataIndex = data.indexOf(value);
  const sortedData = [...data].sort((a, b) => {
    if (direction === 'LOW_HIGH') {
      return a - b;
    }

    return b - a;
  });
  let rankedData = [];

  const rankMapper = (val) => sortedData.indexOf(val) + 1;
  const percentileMapper = (val) => {
    const percentile = percentRank(data, val);
    const rank = direction === 'HIGH_LOW' ? percentile : 1 - percentile;

    return rank ? _round(rank, 2) : 0;
  };

  const isBetween = (val, a, b) => {
    const min = Math.min(a, b);
    const max = Math.max(a, b);

    return val >= min && val <= max;
  };

  const getBucketIndex = (buckets, val) => {
    let selectedBucket = null;

    buckets.forEach(({ rank, lower, higher }) => {
      if (isBetween(val, lower, higher)) {
        selectedBucket = rank;
      }
    });
    return selectedBucket;
  };

  switch (calculation) {
    case 'RANK':
      rankedData = data.map(rankMapper);
      break;
    case 'SPLIT_RANK':
      rankedData = data
        .map(rankMapper)
        .reduce((currentData, dataVal, index, dataArray) => {
          const sameRanks = dataArray.filter((rank) => rank === dataVal);
          const end = dataVal + sameRanks.length;
          const range = _range(dataVal, end);
          const splitRank = _sum(range) / range.length;

          return [...currentData, splitRank];
        }, []);

      break;
    case 'PERCENTILE':
      rankedData = data.map(percentileMapper);
      break;
    case 'QUARTILE':
      rankedData = data.map(percentileMapper).map((val) => {
        return getBucketIndex(
          [
            {
              rank: 4,
              lower: 0,
              higher: 0.25,
            },
            {
              rank: 3,
              lower: 0.251,
              higher: 0.5,
            },
            {
              rank: 2,
              lower: 0.501,
              higher: 0.75,
            },
            {
              rank: 1,
              lower: 0.751,
              higher: 1,
            },
          ],
          val
        );
      });
      break;
    case 'QUINTILE':
      rankedData = data.map(percentileMapper).map((val) => {
        return getBucketIndex(
          [
            {
              rank: 1,
              lower: 0.801,
              higher: 1,
            },
            {
              rank: 2,
              lower: 0.601,
              higher: 0.8,
            },
            {
              rank: 3,
              lower: 0.401,
              higher: 0.6,
            },
            {
              rank: 4,
              lower: 0.201,
              higher: 0.4,
            },
            {
              rank: 5,
              lower: 0,
              higher: 0.2,
            },
          ],
          val
        );
      });
      break;
    case 'NONE':
    default:
      rankedData = [...data];
  }

  return rankedData[dataIndex];
};

export const getRankingCalculationMenuItem = (
  isPivoted: boolean,
  rankingCalculation: RankingCalculationConfig = {
    type: 'NONE',
    direction: 'NONE',
  },
  setRankingCalculation: Function
) => {
  const labels = {
    NONE: '',
    RANK: i18n.t('Rank'),
    QUARTILE: i18n.t('Quartile'),
    SPLIT_RANK: i18n.t('Rank Average'),
    PERCENTILE: i18n.t('Percentile'),
    QUINTILE: i18n.t('Quintile'),
  };

  const sortLables = {
    NONE: '',
    HIGH_LOW: i18n.t('High - Low'),
    LOW_HIGH: i18n.t('Low - High'),
  };

  const getSortMenuItem = (
    key: RankingCalculation,
    direction: RankingDirection
  ) => ({
    description: sortLables[direction],
    isSelected:
      rankingCalculation.type === key &&
      rankingCalculation.direction === direction,
    onClick: () => {
      setRankingCalculation(key, direction);
    },
  });

  const getCalcSubMenuItem = (key: RankingCalculation) => ({
    description: labels[key],
    subMenuItems: [
      getSortMenuItem(key, 'HIGH_LOW'),
      getSortMenuItem(key, 'LOW_HIGH'),
    ],
  });

  return {
    description: i18n.t('Rank'),
    icon: 'icon-sort-low-high',
    isDisabled: isPivoted,
    subMenuItems: [
      {
        description: i18n.t('None'),
        isSelected: !rankingCalculation || rankingCalculation.type === 'NONE',
        onClick: () => {
          setRankingCalculation('NONE', 'NONE');
        },
      },
      getCalcSubMenuItem('PERCENTILE'),
      getCalcSubMenuItem('QUARTILE'),
      getCalcSubMenuItem('QUINTILE'),
      getCalcSubMenuItem('RANK'),
      getCalcSubMenuItem('SPLIT_RANK'),
    ],
  };
};

export const getColumnId = (column: {
  id: $PropertyType<TableWidgetColumn, 'id'>,
  column_id: $PropertyType<TableWidgetColumn, 'column_id'>,
}) => {
  if (column.id === null) {
    return column.column_id;
  }

  return column.id;
};

type GetRowSelectedItemConfig = {
  allSquadAthletes: Array<SquadAthletes>,
  squads: Array<Squad>,
  labels: LabelPopulation[],
  groups: GroupPopulation[],
  population: $PropertyType<TableWidgetRow, 'population'>,
};
export const getPopulationSelectedItems = ({
  squads,
  allSquadAthletes,
  labels,
  groups,
  population,
}: GetRowSelectedItemConfig): Array<string> => {
  if (!population) {
    return [];
  }

  let selectedItems = _uniq(
    allSquadAthletes
      .map((squadAthletes) => {
        return getSelectedItems(population, squadAthletes, squads);
      })
      .filter((label) => label !== '')
  );

  if (population?.labels?.length) {
    selectedItems = [
      ...selectedItems,
      ...population.labels.map(
        (labelId) => labels.find(({ id }) => id === labelId)?.name
      ),
    ];
  }

  if (population?.segments?.length) {
    selectedItems = [
      ...selectedItems,
      ...population.segments.map(
        (groupId) => groups.find(({ id }) => id === groupId)?.name
      ),
    ];
  }

  return selectedItems;
};

export const getDataTypeDropdownOptions = (
  exclude: Array<TableWidgetDataSource> = [TABLE_WIDGET_DATA_SOURCES.formula]
): Array<Option> => {
  const options: Array<Option> = [
    {
      id: TABLE_WIDGET_DATA_SOURCES.metric,
      value: TABLE_WIDGET_DATA_SOURCES.metric,
      label: i18n.t('Metric'),
    },
    {
      id: TABLE_WIDGET_DATA_SOURCES.activity,
      value: TABLE_WIDGET_DATA_SOURCES.activity,
      label: i18n.t('Session activity'),
    },
    {
      id: TABLE_WIDGET_DATA_SOURCES.availability,
      value: TABLE_WIDGET_DATA_SOURCES.availability,
      label: i18n.t('Availability'),
    },
    {
      id: TABLE_WIDGET_DATA_SOURCES.participation,
      value: TABLE_WIDGET_DATA_SOURCES.participation,
      label: i18n.t('Participation'),
    },
    {
      id: TABLE_WIDGET_DATA_SOURCES.medical,
      value: TABLE_WIDGET_DATA_SOURCES.medical,
      label: i18n.t('Medical'),
    },
    {
      id: TABLE_WIDGET_DATA_SOURCES.games,
      value: TABLE_WIDGET_DATA_SOURCES.games,
      label: i18n.t('Games'),
    },
    {
      id: TABLE_WIDGET_DATA_SOURCES.formula,
      value: TABLE_WIDGET_DATA_SOURCES.formula,
      label: i18n.t('Formula'),
    },
    {
      id: TABLE_WIDGET_DATA_SOURCES.growthAndMaturation,
      value: TABLE_WIDGET_DATA_SOURCES.growthAndMaturation,
      label: i18n.t('Growth and maturation'),
    },
  ];

  const filter = {
    [TABLE_WIDGET_DATA_SOURCES.metric]: !exclude.includes(
      TABLE_WIDGET_DATA_SOURCES.metric
    ),
    [TABLE_WIDGET_DATA_SOURCES.activity]:
      window.getFlag('table-widget-activity-source') &&
      !exclude.includes(TABLE_WIDGET_DATA_SOURCES.activity),
    [TABLE_WIDGET_DATA_SOURCES.availability]:
      window.getFlag('table-widget-availability-data-type') &&
      !exclude.includes(TABLE_WIDGET_DATA_SOURCES.availability),
    [TABLE_WIDGET_DATA_SOURCES.participation]:
      window.getFlag('table-widget-participation-data-type') &&
      !exclude.includes(TABLE_WIDGET_DATA_SOURCES.participation),
    [TABLE_WIDGET_DATA_SOURCES.medical]:
      window.getFlag('table-widget-medical-data-type') &&
      !exclude.includes(TABLE_WIDGET_DATA_SOURCES.medical),
    [TABLE_WIDGET_DATA_SOURCES.games]:
      window.featureFlags['planning-game-events-field-view'] &&
      !exclude.includes(TABLE_WIDGET_DATA_SOURCES.games),
    [TABLE_WIDGET_DATA_SOURCES.formula]:
      window.getFlag('rep-table-formula-columns') &&
      !exclude.includes(TABLE_WIDGET_DATA_SOURCES.formula),
    [TABLE_WIDGET_DATA_SOURCES.growthAndMaturation]:
      window.getFlag(
        'rep-pac-analysis-show-g-and-m-data-source-under-add-data'
      ) && !exclude.includes(TABLE_WIDGET_DATA_SOURCES.growthAndMaturation),
  };

  return options.filter((option) => (option.id ? filter[option.id] : true));
};

const formatGroupingsConfig = (groupings?: Object) =>
  groupings ? { groupings: Object.values(groupings) } : {};

const getSanitizedFormulaInputParams = (
  inputs: { [key: string]: TableWidgetFormulaInput },
  codingSystemKey: CodingSystemKey
): { [key: string]: Object } => {
  const sanitizedInputParams = {};
  Object.entries(inputs).forEach(([key, value]) => {
    // $FlowIgnore[incompatible-type]
    const input: TableWidgetFormulaInput = value;
    sanitizedInputParams[key] = {
      data_source_type:
        input.dataSource?.data_source_type || input.dataSource?.type,
      population: input.population,
      time_scope: input.time_scope,
      calculation: input.calculation,
      input_params: getInputParamsFromDataSource(
        input.dataSource,
        codingSystemKey
      ),
      element_config: {
        ...getNonEmptyParams('filters', input.element_config?.filters),
        ...getNonEmptyParams(
          'calculation_params',
          input.element_config?.calculation_params
        ),
        ...formatGroupingsConfig(input.element_config?.groupings),
      },
    };
  });
  return sanitizedInputParams;
};

export const prepareColumnFormulaSubmissionData = (
  columnPanelDetails: ColumnFormulaState,
  codingSystemKey: CodingSystemKey,
  activeFormula: ?FormulaDetails
): TableFormulaColumnData => {
  const columnName =
    columnPanelDetails.columnName || activeFormula?.label || i18n.t('Formula');

  const sanitizedInputParams = getSanitizedFormulaInputParams(
    columnPanelDetails.inputs,
    codingSystemKey
  );

  const firstInputId = activeFormula?.inputs[0].id || '';

  const columnData: TableFormulaColumnData = {
    name: columnName,
    data_source_type: TABLE_WIDGET_DATA_SOURCE_TYPES.formula,
    input_params: sanitizedInputParams,
    summary: 'formula',
    time_scope: columnPanelDetails.inputs[firstInputId]?.time_scope || null,
    element_config: {
      formula: activeFormula?.formula_expression || '',
      formula_id: activeFormula?.id,
    },
  };

  return columnData;
};

export const prepareChartFormulaSubmissionData = ({
  columnPanelDetails,
  codingSystemKey,
  activeFormula,
  id,
  seriesType,
  axisConfig,
}: {
  columnPanelDetails: ColumnFormulaState,
  codingSystemKey: CodingSystemKey,
  activeFormula: ?FormulaDetails,
  id: string,
  seriesType: SeriesType,
  axisConfig: AxisConfig,
}): DataSourceFormState => {
  const labelName =
    columnPanelDetails.columnName || activeFormula?.label || i18n.t('Formula');

  const sanitizedInputParams = getSanitizedFormulaInputParams(
    columnPanelDetails.inputs,
    codingSystemKey
  );
  const { inputs } = columnPanelDetails;

  const firstInputId = activeFormula?.inputs[0].id || '';
  const primaryGrouping =
    inputs[FORMULA_INPUT_IDS.numerator]?.element_config?.groupings || [];

  const chartData: DataSourceFormState = {
    id,
    data_source_type: TABLE_WIDGET_DATA_SOURCE_TYPES.formula,
    calculation: 'formula',
    input_params: sanitizedInputParams,
    overlays: null,
    population: { ...EMPTY_SELECTION },
    time_scope:
      inputs[firstInputId]?.time_scope || emptyDataSourceFormState.time_scope,
    config: {
      formula: activeFormula?.formula_expression || '',
      render_options: {
        name: labelName,
        type: seriesType || null,
        axis_config: axisConfig,
      },
      groupings: primaryGrouping,
      inherit_groupings: columnPanelDetails?.inheritGroupings,
    },
  };

  return chartData;
};

export const copyPrimaryGrouping = (
  inputs: FormulaInputParams,
  shouldInherit: boolean
) => {
  const sourceKey = FORMULA_INPUT_IDS.numerator;
  const targetKey = FORMULA_INPUT_IDS.denominator;

  return {
    ...inputs,
    [targetKey]: {
      ...inputs[targetKey],
      element_config: {
        ...inputs[targetKey]?.element_config,
        groupings: shouldInherit
          ? inputs[sourceKey]?.element_config.groupings
          : [],
      },
    },
  };
};

export const getReportingFilters = () => {
  return [{ label: i18n.t('Session type'), value: 'activity_group_ids' }];
};

export const getReportingDefenseFilters = () => {
  return [
    ...(window.getFlag('rep-defense-bmt-mvp')
      ? [{ label: i18n.t('Week of Training'), value: 'micro_cycle' }]
      : []),
  ];
};

export const getWeekOfTrainingFilterOptions = () => {
  return [
    { label: i18n.t('Week 1'), value: 1 },
    { label: i18n.t('Week 2'), value: 2 },
    { label: i18n.t('Week 3'), value: 3 },
    { label: i18n.t('Week 4'), value: 4 },
    { label: i18n.t('Week 5'), value: 5 },
    { label: i18n.t('Week 6'), value: 6 },
    { label: i18n.t('Week 7'), value: 7 },
    { label: i18n.t('Week 8'), value: 8 },
  ];
};

export const getMatchDayFilter = () => {
  return [{ label: i18n.t('Game Day +/-'), value: 'match_day_number' }];
};

export const hasValidComparativePeriod = (calculationParams: Object) => {
  // Ensure that if the comparative_period_type is 'custom', comparative_period must be present
  return (
    calculationParams.comparative_period_type !== 'custom' ||
    !!calculationParams.comparative_period
  );
};

export const hasValidTimePeriod = (calculationParams: Object) => {
  const hasTimePeriodLength = Boolean(calculationParams.time_period_length);
  const hasTimePeriodLengthUnit = Boolean(
    calculationParams.time_period_length_unit
  );

  return (
    calculationParams.time_period !== 'last_x_days' ||
    (hasTimePeriodLength && hasTimePeriodLengthUnit)
  );
};

export const hasRequiredCalculationValues = (
  requiredParams: Array<string>,
  calculationParams: Object
) => {
  // Ensure all required params are present
  return requiredParams.every((key) => calculationParams[key] !== undefined);
};

export const isValidCalculation = (
  calculation: ?string,
  calculationParams?: Object
) => {
  if (!calculation) return false;

  const requiredParams = calculationParamsMap[calculation];
  if (!requiredParams) return !!calculation; // Check if calculation is in the map, if not just check if it exists

  if (!calculationParams) return false;

  // Return true only if all checks pass
  return (
    hasRequiredCalculationValues(requiredParams, calculationParams) &&
    hasValidComparativePeriod(calculationParams) &&
    hasValidTimePeriod(calculationParams)
  );
};

export const filterGroupingsByCategory = (
  groupings: Array<{ name: string, groupings: Array<Grouping> }>,
  category: string
) => {
  if (!groupings) return [];

  return groupings.reduce((acc, curr) => {
    const filterGroupings = curr.groupings.filter(
      (grouping) => grouping.category === category
    );

    filterGroupings.forEach((grouping) => {
      if (_findIndex(acc, { key: grouping.key }) === -1) {
        acc.push(grouping);
      }
    });

    return [...acc];
  }, []);
};

export const filterGroupingsByKey = (
  groupings: Array<{ name: string, groupings: Array<Grouping> }>,
  key: string
) => {
  if (!groupings) return [];

  return groupings.reduce((acc, curr) => {
    const filterGroupings = curr.groupings.filter(
      (grouping) => grouping.key === key
    );

    filterGroupings.forEach((grouping) => {
      if (_findIndex(acc, { key: grouping.key }) === -1) {
        acc.push(grouping);
      }
    });

    return [...acc];
  }, []);
};

export const getInputParamsFromSource = (
  source: TableWidgetDataSource,
  dataSource: TableWidgetElementSource
) => {
  switch (source) {
    case TABLE_WIDGET_DATA_SOURCES.metric:
      return {
        source: dataSource.source,
        variable: dataSource.variable,
      };
    case TABLE_WIDGET_DATA_SOURCES.activity:
      return {
        ids: dataSource.ids,
        type: dataSource.type,
      };
    case TABLE_WIDGET_DATA_SOURCES.participation:
      return {
        participation_level_ids: dataSource.ids,
        status: dataSource.status,
      };
    case TABLE_WIDGET_DATA_SOURCES.games:
      return {
        position_ids: dataSource?.position_ids,
        kinds: dataSource?.kinds,
        result: dataSource?.result,
        formation_ids: dataSource?.formation_ids,
      };
    case TABLE_WIDGET_DATA_SOURCES.availability:
      return {
        status: dataSource?.status,
      };
    case TABLE_WIDGET_DATA_SOURCES.growthAndMaturation:
      return {
        training_variable_ids: dataSource?.training_variable_ids,
      };
    default:
      return {};
  }
};

export const addLabelToDynamicRows = (
  prev: DynamicRows,
  id: string,
  label: string
) => {
  // value: Temporary fix to BE response issue with Medical data source
  if (label === 'value' || label === NOT_AVAILABLE.label) return prev;

  const existing = prev[id] || [];
  if (existing.includes(label)) return prev;

  return {
    ...prev,
    [id]: [...existing, label],
  };
};

export const getRowCachedAt = (
  rowDetails: TableWidgetRow | TableWidgetRowMetric
) => {
  return rowDetails.table_element?.cached_at
    ? rowDetails?.calculatedCachedAt ?? rowDetails.table_element?.cached_at
    : '';
};

export const getColumnCachedAt = (columnDetails: TableWidgetColumn) => {
  return columnDetails.table_element?.cached_at
    ? columnDetails?.calculatedCachedAt ??
        columnDetails.table_element?.cached_at
    : '';
};

export const getCachedAtRolloverContent = (
  cachedAt?: string,
  dataStatus: string,
  locale?: ?string
) => {
  if (!window.getFlag('rep-table-widget-caching') || !cachedAt) {
    return '';
  }

  if (dataStatus === LOADER_LEVEL.CACHING) {
    return i18n.t('Calculating...');
  }

  if (cachedAt) {
    return `${i18n.t('Last Calculated:')} ${humanizeTimestamp(
      locale || navigator.language,
      cachedAt
    )}`;
  }
  return '';
};

export const hasValidGrouping = (groupings: ?Array<string>) => {
  return !!groupings && groupings[0] !== NO_GROUPING;
};

export const sortDynamicRows = (
  item: TableWidgetRow,
  rowsToUpdate: DynamicRows,
  sortRows: (items: Array<DynamicRowItem>) => Array<DynamicRowItem>
) => {
  if (!rowsToUpdate[item.id]) return rowsToUpdate;

  const getItemValue = (label) => {
    const value =
      item.children?.find((child) => child.id === label)?.value || 0;
    return getFormattedCellValue(value);
  };

  const childRows = rowsToUpdate[item.id].map((label) => ({
    id: label,
    value: getItemValue(label),
  }));

  const sortedIds = sortRows(childRows).map((row) => row.id);

  return {
    ...rowsToUpdate,
    [item.id]: sortedIds,
  };
};

export const getDataSourceLabel = (key: DataSource) => {
  const labels = {
    [DATA_SOURCES.metric]: i18n.t('Metric'),
    [DATA_SOURCES.activity]: i18n.t('Session activity'),
    [DATA_SOURCES.availability]: i18n.t('Availability'),
    [DATA_SOURCES.participation]: i18n.t('Participation'),
    [DATA_SOURCES.medical]: i18n.t('Medical'),
    [DATA_SOURCES.games]: i18n.t('Games'),
    [DATA_SOURCES.formula]: i18n.t('Formula'),
    [DATA_SOURCES.growthAndMaturation]: i18n.t('Growth and maturation'),
  };
  return labels[key] || '';
};
