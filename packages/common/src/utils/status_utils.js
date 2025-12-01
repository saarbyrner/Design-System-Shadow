/* eslint-disable flowtype/require-valid-file-annotation */
import uuid from 'uuid';
import moment from 'moment';
import i18n from './i18n';
import * as DateFormatter from './dateFormatter';

export const settingsBySummary = (summary) => {
  switch (summary) {
    case 'training_efficiency_index':
      return { second_variable: 'external' };
    case 'acute_to_chronic_ratio':
    case 'ewma_acute_to_chronic_ratio':
      if (window.featureFlags['acute-chronic-inidividual']) {
        return {
          summary: {
            ratio: true,
            acute: false,
            chronic: false,
          },
        };
      }
      return {};
    default:
      return {};
  }
};

export const blankStatus = () => ({
  status_id: uuid.v4(),
  description: null,
  localised_unit: null,
  period_scope: null,
  second_period_length: null,
  operator: null,
  second_period_all_time: null,
  source: 'kitman:tv',
  summary: null,
  variable: null,
  name: '',
  is_custom_name: false,
  variables: [],
  settings: settingsBySummary(null),
  event_type_time_period: '',
  games: [],
  training_sessions: [],
  drills: [],
  selected_games: [],
  selected_training_sessions: [],
  event_breakdown: null,
});

// This needs to be a function, otherwise, the translation won't work
export const getCalculations = () => ({
  last: { title: i18n.t('Last Value'), id: 'last' },
  mean: { title: i18n.t('Mean'), id: 'mean' },
  sum: { title: i18n.t('Sum'), id: 'sum' },
  sumAbsolute: {
    id: 'sum_absolute',
    title: i18n.t('Sum (Absolute)'),
  },
  min: { title: i18n.t('Min'), id: 'min' },
  minAbsolute: {
    id: 'min_absolute',
    title: i18n.t('Min (Absolute)'),
  },
  max: { title: i18n.t('Max'), id: 'max' },
  maxAbsolute: {
    id: 'max_absolute',
    title: i18n.t('Max (Absolute)'),
  },
  stddev: {
    title: i18n.t('Standard Deviation'),
    id: 'standard_deviation',
  },
  zscore: { title: i18n.t('Z Score'), id: 'z_score' },
  zscoreRolling: {
    title: i18n.t('Complex Z Score'),
    id: 'z_score_rolling',
  },
  acutechronic: {
    title: i18n.t('Acute:Chronic'),
    id: 'acute_to_chronic_ratio',
  },
  ewmaAcuteChronic: {
    title: i18n.t('Acute:Chronic (EWMA)'),
    id: 'ewma_acute_to_chronic_ratio',
  },
  tsb: {
    title: i18n.t('Training Stress Balance'),
    id: 'training_stress_balance',
  },
  strain: { title: i18n.t('Strain'), id: 'strain' },
  monotony: { title: i18n.t('Monotony'), id: 'monotony' },
  averagePercentageChange: {
    title: i18n.t('Average Percentage Change'),
    id: 'average_percentage_change',
  },
  count: { title: i18n.t('Count'), id: 'count' },
  countAbsolute: {
    id: 'count_absolute',
    title: i18n.t('Count (Absolute)'),
  },
  trainingEfficiencyIndex: {
    title: i18n.t('Training Efficiency Index'),
    id: 'training_efficiency_index',
  },
});

export const getPeriodScope = (summary) => {
  let periodScope;
  switch (summary) {
    case 'acute_to_chronic_ratio':
    case 'ewma_acute_to_chronic_ratio':
    case 'training_stress_balance':
    case 'z_score':
    case 'z_score_rolling':
    case 'average_percentage_change':
    case 'monotony':
    case 'strain':
      periodScope = 'today';
      break;
    default:
      periodScope = null;
  }
  return periodScope;
};

const calculationFeatureFlagMapping = {
  training_efficiency_index: 'training-efficiency-index',
};

const removeDisabledFeatureFlagSummaries = (summaries) => {
  let filteredSummaries = summaries;
  Object.keys(calculationFeatureFlagMapping).forEach((calculationId) => {
    const featureFlagKey = calculationFeatureFlagMapping[calculationId];
    if (!window.featureFlags[featureFlagKey]) {
      // remove the disabled featured flag summaries
      filteredSummaries = filteredSummaries.filter(
        (calculation) => calculation.id !== calculationId
      );
    }
  });
  return filteredSummaries;
};

const calculationsByType = (type) => {
  const calculations = getCalculations();
  const shouldOverlayGraphHasAbsoluteSummaries =
    window.getFlag('graph-pipeline-migration-summary_bar') ||
    window.getFlag('graph-pipeline-migration-longitudinal');
  const hasAbsoluteSummaries =
    window.featureFlags['graph-pipeline-migration-summary'];

  switch (type) {
    case 'graph_overlay':
      return shouldOverlayGraphHasAbsoluteSummaries
        ? [
            calculations.mean,
            calculations.max,
            calculations.maxAbsolute,
            calculations.min,
            calculations.minAbsolute,
          ]
        : [calculations.mean, calculations.max, calculations.min];
    case 'simple':
      return hasAbsoluteSummaries
        ? [
            calculations.max,
            calculations.maxAbsolute,
            calculations.mean,
            calculations.min,
            calculations.minAbsolute,
            calculations.count,
            calculations.countAbsolute,
            calculations.sum,
            calculations.sumAbsolute,
          ]
        : [
            calculations.max,
            calculations.mean,
            calculations.min,
            calculations.count,
            calculations.sum,
          ];
    case 'simple_and_last':
      return hasAbsoluteSummaries
        ? [
            calculations.last,
            calculations.max,
            calculations.maxAbsolute,
            calculations.mean,
            calculations.min,
            calculations.minAbsolute,
            calculations.count,
            calculations.countAbsolute,
            calculations.sum,
            calculations.sumAbsolute,
          ]
        : [
            calculations.last,
            calculations.max,
            calculations.mean,
            calculations.min,
            calculations.count,
            calculations.sum,
          ];
    case 'complex':
      return [
        calculations.stddev,
        calculations.zscore,
        calculations.zscoreRolling,
        calculations.averagePercentageChange,
        calculations.acutechronic,
        calculations.ewmaAcuteChronic,
        calculations.tsb,
        calculations.strain,
        calculations.monotony,
        calculations.trainingEfficiencyIndex,
      ];
    default:
      return hasAbsoluteSummaries
        ? [
            calculations.max,
            calculations.maxAbsolute,
            calculations.mean,
            calculations.min,
            calculations.minAbsolute,
            calculations.count,
            calculations.countAbsolute,
            calculations.sum,
            calculations.sumAbsolute,
            calculations.stddev,
            calculations.zscore,
            calculations.zscoreRolling,
            calculations.averagePercentageChange,
            calculations.acutechronic,
            calculations.ewmaAcuteChronic,
            calculations.tsb,
            calculations.strain,
            calculations.monotony,
            calculations.trainingEfficiencyIndex,
          ]
        : [
            calculations.max,
            calculations.mean,
            calculations.min,
            calculations.count,
            calculations.sum,
            calculations.stddev,
            calculations.zscore,
            calculations.zscoreRolling,
            calculations.averagePercentageChange,
            calculations.acutechronic,
            calculations.ewmaAcuteChronic,
            calculations.tsb,
            calculations.strain,
            calculations.monotony,
            calculations.trainingEfficiencyIndex,
          ];
  }
};

export const getCalculationsByType = (type) => {
  const summaries = calculationsByType(type);

  return removeDisabledFeatureFlagSummaries(summaries);
};

/**
 * availableSummaries() returns available summaries for the source, variable, and type
 */
export const availableSummaries = (
  source = '',
  variable = '',
  type = '',
  withAbsoluteValues = false
) => {
  const calculations = getCalculations();

  let summaries = null;
  // put the available options into their categories
  const standardOptions = [
    calculations.last,
    calculations.max,
    calculations.mean,
    calculations.min,
    calculations.count,
    calculations.sum,
    calculations.stddev,
    calculations.zscore,
    calculations.zscoreRolling,
    calculations.averagePercentageChange,
    calculations.acutechronic,
    calculations.ewmaAcuteChronic,
    calculations.trainingEfficiencyIndex,
  ];
  const dynamicMovementOptions = [
    calculations.last,
    calculations.max,
    calculations.mean,
    calculations.min,
    calculations.count,
    calculations.stddev,
    calculations.zscore,
    calculations.zscoreRolling,
    calculations.averagePercentageChange,
  ];
  const booleanOptions = [calculations.last, calculations.count];
  const sleepOptions = [
    calculations.last,
    calculations.max,
    calculations.mean,
    calculations.min,
    calculations.count,
    calculations.zscore,
    calculations.zscoreRolling,
  ];
  const rpexdurationOptions = [
    calculations.last,
    calculations.max,
    calculations.mean,
    calculations.count,
    calculations.sum,
    calculations.stddev,
    calculations.zscore,
    calculations.zscoreRolling,
    calculations.averagePercentageChange,
    calculations.acutechronic,
    calculations.ewmaAcuteChronic,
    calculations.tsb,
    calculations.strain,
    calculations.monotony,
    calculations.trainingEfficiencyIndex,
  ];
  const thirdPartyOptions = [
    calculations.last,
    calculations.max,
    calculations.mean,
    calculations.min,
    calculations.count,
    calculations.sum,
    calculations.stddev,
    calculations.zscore,
    calculations.zscoreRolling,
    calculations.averagePercentageChange,
    calculations.acutechronic,
    calculations.ewmaAcuteChronic,
    calculations.tsb,
    calculations.strain,
    calculations.monotony,
    calculations.trainingEfficiencyIndex,
  ];

  // determine which options to display
  switch (source) {
    case 'kitman:tv':
      // check the status type
      if (type === 'boolean') {
        summaries = booleanOptions;
      } else if (type === 'sleep_duration') {
        summaries = sleepOptions;
      } else {
        summaries = standardOptions;
      }
      break;
    case 'kitman':
      // if the source is 'kitman', there are rules based on the status
      switch (variable) {
        case 'game_minutes':
          summaries = standardOptions;
          break;
        case 'rpe_x_duration':
        case 'game_rpe':
        case 'training_session_rpe':
        case 'training_session_minutes':
          summaries = rpexdurationOptions;
          break;
        default:
          summaries = rpexdurationOptions;
      }
      break;
    default:
      if (source.includes('kitman:') && !source.includes('kitman:custom')) {
        /**
         * all sources containing 'kitman:', excluding 'kitman:custom',
         * will be considered dynamic movements.
         */
        summaries = dynamicMovementOptions;
      } else {
        summaries = thirdPartyOptions;
      }
  }
  summaries = removeDisabledFeatureFlagSummaries(summaries);

  if (withAbsoluteValues) {
    const absoluteMap = {
      [calculations.sum.id]: calculations.sumAbsolute,
      [calculations.min.id]: calculations.minAbsolute,
      [calculations.max.id]: calculations.maxAbsolute,
      [calculations.count.id]: calculations.countAbsolute,
    };

    return summaries.flatMap((summary) => {
      const absoluteKeys = Object.keys(absoluteMap);

      if (absoluteKeys.includes(summary.id)) {
        return [summary, absoluteMap[summary.id]];
      }

      return [summary];
    });
  }

  return summaries;
};
/* eslint-enable max-statements */

export const sessions = () => {
  return [
    {
      title: i18n.t('Game'),
      id: 'game',
    },
    { title: i18n.t('Training Session'), id: 'training_session' },
  ];
};

export const dateRangeTimePeriods = (excludeRollingPeriod) => {
  const timePeriods = [
    { title: i18n.t('Last (x) Period'), id: 'last_x_days' },
    { title: i18n.t('Today'), id: 'today' },
    { title: i18n.t('Yesterday'), id: 'yesterday' },
    { title: i18n.t('This Week'), id: 'this_week' },
    { title: i18n.t('Last Week'), id: 'last_week' },
    { title: i18n.t('This Season So Far'), id: 'this_season_so_far' },
    { title: i18n.t('This Season'), id: 'this_season' },
    { title: i18n.t('This Pre-season'), id: 'this_pre_season' },
    { title: i18n.t('This In-season'), id: 'this_in_season' },
    { title: i18n.t('Custom Date Range'), id: 'custom_date_range' },
  ];

  if (excludeRollingPeriod) {
    return timePeriods.filter((timePeriod) => timePeriod.id !== 'last_x_days');
  }

  return timePeriods;
};

/**
 * availableTimePeriods() returns available time periods depending on whether
 * the summary is last or something else
 */
export const availableTimePeriods = (summary) => {
  const defaultTimePeriods = [
    { title: i18n.t('Last (x) Period'), id: 'last_x_days' },
    { title: i18n.t('Daily'), id: 'today' },
    { title: i18n.t('Yesterday'), id: 'yesterday' },
    { title: i18n.t('This Week'), id: 'this_week' },
    { title: i18n.t('Last Week'), id: 'last_week' },
    { title: i18n.t('This Pre-season'), id: 'this_pre_season' },
    { title: i18n.t('This In-season'), id: 'this_in_season' },
    { title: i18n.t('This Season So Far'), id: 'this_season_so_far' },
    { title: i18n.t('This Season'), id: 'this_season' },
  ];

  const timePeriodsByCalculation = {
    last: [
      { title: i18n.t('Last (x) Period'), id: 'last_x_days' },
      { title: i18n.t('Daily'), id: 'today' },
      { title: i18n.t('Yesterday'), id: 'yesterday' },
    ],
    training_efficiency_index: [
      { title: i18n.t('Last Value'), id: 'last_x_days' },
      { title: i18n.t('All time'), id: 'all_time' },
    ],
  };

  const calculationTimePeriods = timePeriodsByCalculation[summary];

  if (calculationTimePeriods) return calculationTimePeriods;

  return defaultTimePeriods;
};

const formatDate = (date) => {
  if (window.featureFlags['standard-date-formatting']) {
    return DateFormatter.formatStandard({ date });
  }

  return date.format('D MMM YYYY');
};

export const getTimePeriodName = (
  timePeriodId,
  dateRange,
  periodLength = null,
  periodLengthOffset = null
) => {
  if (timePeriodId === 'custom_date_range') {
    const startDate = formatDate(moment(dateRange.startDate));
    const endDate = formatDate(moment(dateRange.endDate));

    return startDate === endDate ? startDate : `${startDate} - ${endDate}`;
  }

  if (timePeriodId === 'last_x_days' && periodLength) {
    const periodLengthText = periodLengthOffset
      ? `${periodLengthOffset} - ${periodLengthOffset + periodLength}`
      : periodLength;

    return i18n.t('Last {{x}} days', {
      x: periodLengthText,
    });
  }

  const timePeriods = availableTimePeriods();
  let timePeriodName = null;

  timePeriods.forEach((timePeriod) => {
    if (timePeriod.id === timePeriodId) {
      timePeriodName = timePeriod.title;
    }
  });

  return timePeriodName;
};

export const availableZScoreRollingOperators = () => [
  { title: i18n.t('Mean'), id: 'mean' },
  { title: i18n.t('Min'), id: 'min' },
  { title: i18n.t('Max'), id: 'max' },
  { title: i18n.t('Sum'), id: 'sum' },
];

export const availableZScoreRollingComparativePeriods = () => [
  { title: i18n.t('Custom'), id: 'custom' },
  { title: i18n.t('All Time'), id: 'all' },
];

export const getDefaultDateRange = (eventTypeKey) => {
  const currentDate = moment().format(DateFormatter.dateTransferFormat);
  const twoWeeksAgo = moment()
    .subtract(7, 'days')
    .format(DateFormatter.dateTransferFormat);
  if (eventTypeKey === 'game' || eventTypeKey === 'training_session') {
    return {
      start_date: twoWeeksAgo,
      end_date: currentDate,
    };
  }
  return {};
};

export const getSourceFromSourceKey = (sourceKey) => sourceKey.split('|')[0];
export const getVariableFromSourceKey = (sourceKey) => sourceKey.split('|')[1];
