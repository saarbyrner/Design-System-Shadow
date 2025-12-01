// @flow

import moment from 'moment';
import _uniq from 'lodash/uniq';
import _cloneDeep from 'lodash/cloneDeep';
import i18n from '@kitman/common/src/utils/i18n';
import {
  dateRangeTimePeriods,
  sessions,
  getCalculations,
  getTimePeriodName,
} from '@kitman/common/src/utils/status_utils';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import {
  EVENT_TIME_PERIODS,
  FORMULA_INPUT_IDS,
  POPULATION_TYPES,
} from '@kitman/modules/src/analysis/shared/constants';
import { getDataTypeSource } from '@kitman/modules/src/analysis/Dashboard/utils';
import { DATA_SOURCES } from '@kitman/modules/src/analysis/Dashboard/components/types';

// Types
import type { ChartData } from '@kitman/modules/src/analysis/shared/types/charts';
import type { FormulaDetails } from '@kitman/modules/src/analysis/shared/types';
import type {
  FormulaInputParams,
  FormulaInputParamsData,
  FormulaInputObject,
} from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/types';
import type { DataSource } from '@kitman/modules/src/analysis/Dashboard/components/types';
import type { SquadAthletesSelection } from '@kitman/components/src/Athletes/types';

// $FlowIgnore[missing-annot]
export const formatFilterNames = (filterNames) => {
  if (
    !filterNames ||
    ((!filterNames.time_loss || filterNames.time_loss.length === 0) &&
      (!filterNames.session_type || filterNames.session_type.length === 0) &&
      (!filterNames.competitions || filterNames.competitions.length === 0) &&
      (!filterNames.event_types || filterNames.event_types.length === 0) &&
      (!filterNames.training_session_types ||
        filterNames.training_session_types.length === 0))
  ) {
    return null;
  }

  const formatedFiltersList = [];

  if (filterNames.time_loss && filterNames.time_loss.length > 0) {
    formatedFiltersList.push(`${filterNames.time_loss.join(', ')}`);
  }

  if (filterNames.session_type && filterNames.session_type.length > 0) {
    formatedFiltersList.push(`${filterNames.session_type.join(', ')}`);
  }

  if (filterNames.competitions && filterNames.competitions.length > 0) {
    formatedFiltersList.push(`${filterNames.competitions.join(', ')}`);
  }

  if (filterNames.event_types && filterNames.event_types.length > 0) {
    formatedFiltersList.push(`${filterNames.event_types.join(', ')}`);
  }

  if (
    filterNames.training_session_types &&
    filterNames.training_session_types.length > 0
  ) {
    formatedFiltersList.push(
      `${filterNames.training_session_types.join(', ')}`
    );
  }

  return `${formatedFiltersList.join(' | ')}`;
};

// $FlowIgnore[missing-annot]
export const getMedicalCategories = ({
  excludeGlobalCategories = false,
  onlyGlobalCategories = false,
  excludeGeneralMedical = false,
  excludeIllnesses = false,
  excludeClassifications = false,
} = {}) => {
  let medicalCategories = [
    {
      key_name: 'injury_group',
      name: i18n.t('Injuries'),
      isGroupOption: true,
    },
    {
      key_name: 'injury_group__all_injuries',
      name: i18n.t('No. of Injury Occurrences'),
    },
    { key_name: 'injury_group__pathology', name: i18n.t('Pathology') },
    { key_name: 'injury_group__body_area', name: i18n.t('Body Area') },
    {
      key_name: 'injury_group__classification',
      name: i18n.t('Classification'),
    },
    { key_name: 'injury_group__activity', name: i18n.t('Activity') },
    { key_name: 'injury_group__session_type', name: i18n.t('Session Type') },
    { key_name: 'injury_group__contact_type', name: i18n.t('Contact Type') },
    { key_name: 'injury_group__competition', name: i18n.t('Competition') },
    {
      key_name: 'illness_group',
      name: i18n.t('Illnesses'),
      isGroupOption: true,
    },
    {
      key_name: 'illness_group__all_illnesses',
      name: i18n.t('No. of Illness Occurrences'),
    },
    { key_name: 'illness_group__pathology', name: i18n.t('Pathology') },
    { key_name: 'illness_group__body_area', name: i18n.t('Body Area') },
    {
      key_name: 'illness_group__classification',
      name: i18n.t('Classification'),
    },
    {
      key_name: 'general_medical_group',
      name: i18n.t('General Medical'),
      isGroupOption: true,
    },
    {
      key_name: 'general_medical_group__diagnostic',
      name: i18n.t('Diagnostics / Interventions'),
    },
  ];

  if (excludeGlobalCategories) {
    // $FlowIgnore[missing-annot]
    medicalCategories = medicalCategories.filter(
      (category) =>
        category.key_name !== 'injury_group__all_injuries' &&
        category.key_name !== 'illness_group__all_illnesses'
    );
  }

  if (onlyGlobalCategories) {
    medicalCategories = medicalCategories.filter(
      (category) =>
        category.key_name === 'injury_group__all_injuries' ||
        category.key_name === 'illness_group__all_illnesses'
    );
  }

  if (excludeGeneralMedical) {
    medicalCategories = medicalCategories.filter(
      (category) => !category.key_name.includes('general_medical_group')
    );
  }

  if (excludeIllnesses) {
    medicalCategories = medicalCategories.filter(
      (category) =>
        category.key_name.includes('injury_group') ||
        category.key_name.includes('general_medical_group')
    );
  }

  if (excludeClassifications) {
    medicalCategories = medicalCategories.filter(
      (category) => !category.key_name.includes('classification')
    );
  }

  return medicalCategories;
};

// $FlowIgnore[missing-annot]
export const getCategoryDivisionOptions = ({
  mainCategory,
  subCategory,
  excludeClassifications,
} = {}) => {
  const options = {
    pathology: { id: 'pathology', title: i18n.t('Pathology') },
    bodyArea: { id: 'body_area', title: i18n.t('Body Area') },
    classification: { id: 'classification', title: i18n.t('Classification') },
    activity: { id: 'activity', title: i18n.t('Activity') },
    sessionType: { id: 'session_type', title: i18n.t('Session Type') },
    contactType: { id: 'contact_type', title: i18n.t('Contact Type') },
    competition: { id: 'competition', title: i18n.t('Competition') },
  };
  const isClassification = excludeClassifications
    ? []
    : [options.classification];

  if (mainCategory === 'injury') {
    switch (subCategory) {
      case 'pathology':
        return [options.activity, options.sessionType, options.contactType];
      case 'body_area':
        return [
          options.pathology,
          ...isClassification,
          options.activity,
          options.sessionType,
          options.contactType,
          options.competition,
        ];
      case 'classification':
        return [
          options.pathology,
          options.bodyArea,
          options.activity,
          options.sessionType,
          options.contactType,
          options.competition,
        ];
      case 'activity':
        return [
          options.pathology,
          options.bodyArea,
          ...isClassification,
          options.contactType,
          options.competition,
        ];
      case 'session_type':
        return [
          options.pathology,
          options.bodyArea,
          ...isClassification,
          options.contactType,
          options.competition,
        ];
      case 'contact_type':
        return [
          options.pathology,
          options.bodyArea,
          ...isClassification,
          options.activity,
          options.sessionType,
          options.competition,
        ];
      case 'competition':
        return [
          options.pathology,
          options.bodyArea,
          ...isClassification,
          options.activity,
          options.sessionType,
          options.contactType,
        ];
      default:
        break;
    }
  }

  if (mainCategory === 'illness') {
    switch (subCategory) {
      case 'pathology':
        return [];
      case 'body_area':
        return [options.pathology, ...isClassification];
      case 'classification':
        return [options.pathology, options.bodyArea];
      default:
        break;
    }
  }

  return [];
};

// returns the medical category name. Ex: 'Body Area'
// $FlowIgnore[missing-annot]
export const getMedicalCategoryName = (categoryId) => {
  return getMedicalCategories().filter((category) =>
    category.key_name.includes(categoryId)
  )[0].name;
};

// returns the full medical category name. Ex: 'Illness - Body Area & Pathology'

export const getFullMedicalCategoryName = (
  // $FlowIgnore[missing-annot]
  categoryId,
  // $FlowIgnore[missing-annot]
  mainCategoryId,
  // $FlowIgnore[missing-annot]
  subCategory,
  // $FlowIgnore[missing-annot]
  filterNames
) => {
  // Retrieve names from the IDs
  const mainCategoryName =
    mainCategoryId === 'injury' ? i18n.t('Injury') : i18n.t('Illness');

  const categoryName = getMedicalCategoryName(categoryId);

  const subCategoryName = subCategory
    ? getMedicalCategoryName(subCategory)
    : null;

  const formatedFilterNames = formatFilterNames(filterNames);

  const fullMedicalName = subCategoryName
    ? `${mainCategoryName} - ${categoryName} & ${subCategoryName}`
    : `${mainCategoryName} - ${categoryName}`;

  return formatedFilterNames
    ? `${fullMedicalName} (${formatedFilterNames})`
    : fullMedicalName;
};

// $FlowIgnore[missing-annot]
export const getGraphTitles = (graphData) => {
  switch (graphData.graphGroup) {
    case 'summary':
      return graphData.metrics
        ? graphData.metrics.map((metric) => ({
            title: metric.name,
            unit: null,
          }))
        : [];
    case 'summary_donut':
      if (graphData.metrics) {
        return [
          {
            title: getFullMedicalCategoryName(
              graphData.metrics[0].category,
              graphData.metrics[0].main_category
            ),
            unit: null,
          },
        ];
      }
      return [];
    case 'summary_bar':
    case 'summary_stack_bar':
    case 'longitudinal':
    case 'value_visualisation': {
      const titles = [];
      if (graphData.metrics && graphData.metrics.length > 0) {
        graphData.metrics.forEach((metric) => {
          if (metric.type === 'medical') {
            titles.push({
              title: getFullMedicalCategoryName(
                metric.category,
                metric.main_category,
                metric.category_division
              ),
              unit: null,
            });
          } else {
            titles.push({
              title: metric.status.name,
              unit: metric.status.localised_unit
                ? metric.status.localised_unit
                : null,
            });
          }
        });
      }

      return titles;
    }
    default:
      return [];
  }
};

// $FlowIgnore[missing-annot]
export const formatGraphTitlesToString = (graphTitles) => {
  if (graphTitles) {
    if (graphTitles.length <= 2) {
      const titles = graphTitles.map((metric) => {
        const title = metric.unit
          ? `${metric.title} (${metric.unit})`
          : metric.title;
        if (title) {
          return title.trim();
        }
        return '';
      });
      return titles.join(' - ');
    }
    return i18n.t('{{titleCount}} Metrics', {
      titleCount: graphTitles.length,
    });
  }
  return '';
};

// Returns the shorthand string for Home/Away/Neutral venue type
// $FlowIgnore[missing-annot]
export const getVenueShorthand = (venueType) => {
  if (venueType === 'Home') {
    return 'H';
  }
  if (venueType === 'Away') {
    return 'A';
  }
  return 'N';
};

// Formats the game score based on Home/Away/Neutral venue type
// $FlowIgnore[missing-annot]
export const formatScore = (game, venueType) => {
  if (venueType === 'Away') {
    return `${game.opponent_score} - ${game.score}`;
  }
  return `${game.score} - ${game.opponent_score}`;
};

// Returns the Selected Game or Training Details for Graph Legends
export const getEventsDetails = (
  // $FlowIgnore[missing-annot]
  eventType,
  // $FlowIgnore[missing-annot]
  selectedGames,
  // $FlowIgnore[missing-annot]
  selectedTrainingSessions
) => {
  const eventsDetails = [];

  if (eventType === 'game' && selectedGames) {
    selectedGames.forEach((game) => {
      const venue = getVenueShorthand(game.venue_type_name);
      const score = formatScore(game, game.venue_type_name);

      // 23 Feb 2019 - Man United (A) 2-0
      eventsDetails.push(
        `${
          window.featureFlags['standard-date-formatting']
            ? DateFormatter.formatStandard({ date: moment(game.date) })
            : moment(game.date).format('D MMM YYYY')
        } - ${game.opponent_team_name} (${venue}) ${score}`
      );
    });
  } else if (eventType === 'training_session' && selectedTrainingSessions) {
    selectedTrainingSessions.forEach((trainingSession) => {
      const trainingDuration =
        trainingSession.duration !== null
          ? `(${trainingSession.duration} mins)`
          : '';

      // Tue, 18 Jan 2019 (9:12am) - Conditioning (100 mins)
      eventsDetails.push(
        `${
          window.featureFlags['standard-date-formatting']
            ? DateFormatter.formatStandard({
                date: moment(trainingSession.date),
                showTime: true,
              })
            : moment(trainingSession.date).format('ddd, D MMM YYYY (h:mm a)')
        } - ${trainingSession.session_type_name} ${trainingDuration}`
      );
    });
  }

  return eventsDetails.join(' | ');
};

// $FlowIgnore[missing-annot]
export const getMetricName = (metric) => {
  let metricName = '';

  if (metric.name) {
    metricName = metric.name;
  } else if (metric.type === 'metric') {
    metricName = metric.status.name;
  } else if (metric.type === 'medical') {
    metricName = getFullMedicalCategoryName(
      metric.category,
      metric.main_category,
      metric.category_division
    );
  }
  return metricName;
};

// $FlowIgnore[missing-annot]
export const shouldFilterNulls = (graphData) => {
  const isNullFilterableType =
    graphData.graphGroup === 'summary_bar' ||
    graphData.graphGroup === 'summary_stack_bar';
  if (isNullFilterableType) {
    return graphData.decorators.hide_nulls || false;
  }
  return false;
};

// $FlowIgnore[missing-annot]
export const shouldFilterZeros = (graphData) => {
  const isZeroFilterableType =
    graphData.graphGroup === 'summary_bar' ||
    graphData.graphGroup === 'summary_stack_bar';
  if (isZeroFilterableType) {
    return graphData.decorators.hide_zeros || false;
  }
  return false;
};

// $FlowIgnore[missing-annot]
export const isDrillGraph = (graphData) => {
  if (graphData.graphGroup === 'summary') {
    return (
      graphData.series[0].event_type_time_period === 'game' ||
      graphData.series[0].event_type_time_period === 'training_session'
    );
  }

  return (
    graphData.metrics &&
    graphData.metrics[0].status &&
    (graphData.metrics[0].status.event_type_time_period === 'game' ||
      graphData.metrics[0].status.event_type_time_period === 'training_session')
  );
};

// $FlowIgnore[missing-annot]
export const buildEventTypeTimePeriodOptions = (isPivot) => {
  const sessionOptions = sessions();
  const dateRangeOptions = dateRangeTimePeriods();
  const setPeriodOption = dateRangeOptions.slice().pop();
  const options = [];

  if (!isPivot) {
    options.push({ isGroupOption: true, name: i18n.t('Sessions') });
    sessionOptions.forEach((option) => {
      options.push({
        name: option.title,
        key_name: option.id,
      });
    });
  }

  options.push({
    isGroupOption: true,
    name: i18n.t('Rolling Period'),
  });
  dateRangeOptions.slice(0, 5).forEach((option) => {
    options.push({
      name: option.title,
      key_name: option.id,
    });
  });

  options.push({ isGroupOption: true, name: i18n.t('Season') });
  dateRangeOptions.slice(5, 9).forEach((option) => {
    options.push({
      name: option.title,
      key_name: option.id,
    });
  });

  options.push({ isGroupOption: true, name: i18n.t('Set Period') });
  options.push({
    name: setPeriodOption.title,
    key_name: setPeriodOption.id,
  });

  return options;
};

// $FlowIgnore[missing-annot]
export const buildEventTypeTimePeriodSelectOptions = (
  isPivot: boolean,
  withEvents: boolean,
  withGamesAndSessions?: boolean
) => {
  const sessionOptions = sessions();
  const dateRangeOptions = dateRangeTimePeriods();
  const setPeriodOption = dateRangeOptions.slice().pop();
  const options = [];

  if (withEvents || withGamesAndSessions) {
    options.push({
      label: i18n.t('Events'),
      options: [
        ...(withEvents
          ? [
              {
                label: i18n.t('Last (x) Events'),
                value: EVENT_TIME_PERIODS.lastXEvents,
              },
            ]
          : []),
        ...(withGamesAndSessions
          ? [
              {
                label: i18n.t('Last (x) Games/Sessions'),
                value: EVENT_TIME_PERIODS.lastXGamesAndSessions,
              },
              {
                label: i18n.t('Last (x) Games'),
                value: EVENT_TIME_PERIODS.lastXGames,
              },
              {
                label: i18n.t('Last (x) Sessions'),
                value: EVENT_TIME_PERIODS.lastXSessions,
              },
            ]
          : []),
      ],
    });
  }

  if (!isPivot) {
    options.push({
      label: i18n.t('Sessions'),
      options: sessionOptions.map((option) => ({
        label: option.title,
        value: option.id,
      })),
    });
  }

  const rollingPeriodOptions = [];
  dateRangeOptions.slice(0, 5).forEach((option) => {
    rollingPeriodOptions.push({
      label: option.title,
      value: option.id,
    });
  });

  options.push({
    label: i18n.t('Rolling Period'),
    options: rollingPeriodOptions,
  });

  const seasonOptions = [];
  dateRangeOptions.slice(5, 9).forEach((option) => {
    seasonOptions.push({
      label: option.title,
      value: option.id,
    });
  });
  options.push({ label: i18n.t('Season'), options: seasonOptions });

  options.push({
    label: i18n.t('Set Period'),
    options: [
      {
        label: setPeriodOption.title,
        value: setPeriodOption.id,
      },
    ],
  });

  return options;
};

/* eslint-enable max-statements */

export const getPeriodName = (
  // $FlowIgnore[missing-annot]
  timePeriodId,
  // $FlowIgnore[missing-annot]
  dateRange,
  periodLength: ?number = null,
  periodLengthOffset: ?number = null
) => {
  if (timePeriodId === EVENT_TIME_PERIODS.lastXEvents) {
    const periodLengthNumber = periodLength || 0;
    const periodLengthOffsetNumber = periodLengthOffset || 0;
    const periodLengthText = periodLengthOffset
      ? `${periodLengthOffset} - ${
          periodLengthOffsetNumber + periodLengthNumber
        }`
      : periodLength;

    return i18n.t('Last {{x}} events', {
      x: periodLengthText,
    });
  }

  return getTimePeriodName(
    timePeriodId,
    dateRange,
    periodLength,
    periodLengthOffset
  );
};

// $FlowIgnore[missing-annot]
export const getOverlayName = (overlay) => {
  const timePeriodName = getTimePeriodName(overlay.timePeriod, {
    startDate: overlay.dateRange.start_date,
    endDate: overlay.dateRange.end_date,
  });

  return `${overlay.name} ${
    getCalculations()[overlay.summary].title
  } (${timePeriodName})`;
};

// $FlowIgnore[missing-annot]
export const summaryTableFormatting = (graphData) => {
  const metrics = [];

  graphData.metrics.forEach((metric, index) => {
    metrics.push({
      ...metric,
      data: [],
    });
    graphData.series.forEach((item) => {
      if (graphData.scaleType === 'denormalized') {
        metrics[index].data.push(item.values[index]);
      } else {
        metrics[index].data.push(item.zScores[index]);
      }
    });
  });

  return {
    metrics,
    series: graphData.series.map((item) => item.name),
  };
};

/* eslint-enable flowtype/require-valid-file-annotation */

// TODO: this will become a service later
export const getSupportedFormulas = (): Array<FormulaDetails> => [
  {
    id: 1,
    label: i18n.t('Percentage'),
    formula_expression: '(A/B)*100',
    inputs: [
      {
        id: FORMULA_INPUT_IDS.numerator,
        label: i18n.t('Set value'),
        description: 'value',
        population_config: {
          supported_types: [POPULATION_TYPES.inherit, POPULATION_TYPES.squad],
          single_type_selection: true,
          default_value: POPULATION_TYPES.inherit,
        },
      },
      {
        id: FORMULA_INPUT_IDS.denominator,
        label: i18n.t('Set total'),
        description: 'total',
        population_config: {
          supported_types: [POPULATION_TYPES.inherit, POPULATION_TYPES.squad],
          single_type_selection: true,
          default_value: POPULATION_TYPES.inherit,
        },
      },
    ],
  },
  {
    id: 2,
    label: i18n.t('% baseline change'),
    formula_expression: '(B-A)/A * 100',
    inputs: [
      {
        id: FORMULA_INPUT_IDS.numerator,
        label: i18n.t('Set baseline'),
        description: 'baseline',
        population_config: {
          supported_types: [POPULATION_TYPES.inherit, POPULATION_TYPES.squad],
          single_type_selection: true,
          default_value: POPULATION_TYPES.inherit,
        },
      },
      {
        id: FORMULA_INPUT_IDS.denominator,
        label: i18n.t('Add comparison'),
        description: 'comparison',
        population_config: {
          supported_types: [POPULATION_TYPES.inherit, POPULATION_TYPES.squad],
          single_type_selection: true,
          default_value: POPULATION_TYPES.inherit,
        },
      },
    ],
  },
];

export const convertDataSourceToInputs = (
  dataSource: FormulaInputParamsData
): FormulaInputParams => {
  const converted = {};

  Object.entries(dataSource).forEach(([key, value]) => {
    if (key !== 'data_source_type') {
      // $FlowIgnore
      const input: FormulaInputObject = value;

      let ids = input.input_params?.ids || [];
      let status = input.input_params?.status;

      if (input.data_source_type === 'ParticipationLevel') {
        ids =
          input.input_params?.ids ||
          input.input_params?.participation_level_ids ||
          [];

        if (!status) {
          status =
            ids.length === 0 ? 'participation_status' : 'participation_levels';
        }
      }

      converted[key] = {
        panel_source: getDataTypeSource(input.data_source_type),

        dataSource: {
          ...(input.input_params || {}),
          type: input.data_source_type,
          key_name: `${input.input_params?.source}|${input.input_params?.variable}`,
          subtypes: input.input_params?.subtypes || {},
          ids,
          status,
        },

        population: input.population,
        time_scope: input.time_scope,
        calculation: input.calculation,
        element_config: input.element_config,
        population_selection: input.population ? 'select' : 'inherit',
        isPanelFiltersOpen: false, // NOTE: UI check if filters are present
      };
    }
  });

  return converted;
};

/**
 * This makes sure each 'values' array has a consistent set of unique fields.
 *
 * e.g. inputting data like this:
 *  [
      {
        label: "category",
        values: [
          { label: "first", value: 1 },
          { label: "second", value: 2 },
          { label: "third", value: 3 },
        ],
      },
      {
        label: "category 2",
        values: [
          { label: "first", value: 1 },
          // missing value here for "second"
          { label: "third", value: 3 },
        ],
      },
    ];
 * to
    [
      {
        label: "category",
        values: [
          { label: "first", value: 1 },
          { label: "second", value: 2 },
          { label: "third", value: 3 },
        ],
      },
      {
        label: "category 2",
        values: [
          { label: "first", value: 1 },
          { label: "second", value: null }, // added by util to fill in blank
          { label: "third", value: 3 },
        ],
      },
    ];
 *
 *
 * Context:
 * This processor is to fix a bug in visx with the tooltips.
 * All the logic for this fix should live in here so that its easily removed.
 * There is a PR in visx to fix this here https://github.com/airbnb/visx/pull/1878
 * so when that is fixed we can remove this processing.
 */
export const processDataToAddMissingValues = (
  data: ChartData[]
): ChartData[] => {
  const dataCopy: ChartData[] = _cloneDeep(Array.isArray(data) ? data : []);
  const UNIQUE_FIELD = 'label';
  const uniqueEntities = _uniq(
    dataCopy.flatMap((dataSource) => {
      return dataSource.chart?.flatMap((item) =>
        // $FlowIgnore[incompatible-use] flow gives about about .values here even though its defined in type, and checked for
        item.values ? item.values.map((value) => value[UNIQUE_FIELD]) : []
      );
    })
  );

  const itemMapper = (item) => {
    if (!item.values) return item;

    const updatedValues = uniqueEntities.map((entity) => {
      // $FlowIgnore[prop-missing] flow gives about about .values here even though its defined in type, and checked for
      const matchingValue = item.values.find(
        (value) => value[UNIQUE_FIELD] === entity
      );

      if (matchingValue) return matchingValue;

      return {
        [UNIQUE_FIELD]: entity,
        value: null,
      };
    });

    return {
      ...item,
      values: updatedValues,
    };
  };

  return dataCopy.map((dataSource) => {
    return {
      ...dataSource,
      chart: dataSource.chart?.map(itemMapper) || [],
    };
  });
};

export const getMatchingFormulaId = (formulaExpression: string) => {
  const supportedFormulas = getSupportedFormulas();

  const matchingFormula = supportedFormulas.find(
    (formula) => formula.formula_expression === formulaExpression
  );

  return matchingFormula?.id;
};

export const getMixpanelDataSourceLabel = (key: DataSource) => {
  const labels = {
    [DATA_SOURCES.metric]: 'Metric',
    [DATA_SOURCES.activity]: 'Session activity',
    [DATA_SOURCES.availability]: 'Availability',
    [DATA_SOURCES.participation]: 'Participation',
    [DATA_SOURCES.medical]: 'Medical',
    [DATA_SOURCES.games]: 'Games',
    [DATA_SOURCES.formula]: 'Formula',
    [DATA_SOURCES.growthAndMaturation]: 'Growth and maturation',
  };
  return labels[key] || '';
};

export const getPopulationKeys = (
  population: SquadAthletesSelection
): Array<string> => {
  if (!population || typeof population !== 'object') return [];

  return Object.keys(population).filter((key: string) => {
    const value = population[key];
    return Array.isArray(value) && value.length > 0;
  });
};
