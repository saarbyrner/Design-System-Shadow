/* eslint-disable flowtype/require-valid-file-annotation */
import {
  formatSelectedItems,
  flattenSquadSelection,
} from '@kitman/components/src/SquadSearch/utils';
import { searchParams } from '@kitman/common/src/utils';
import { EVENT_TIME_PERIODS } from '@kitman/modules/src/analysis/shared/constants';

const shouldRequestIncludeDateRange = (timePeriod) =>
  timePeriod === EVENT_TIME_PERIODS.customDateRange ||
  timePeriod === EVENT_TIME_PERIODS.game ||
  timePeriod === EVENT_TIME_PERIODS.trainingSession;

const formatOverlaysForRequest = (overlays) =>
  overlays.map((overlay) => ({
    status: {
      summary: overlay.summary,
    },
    squad_selection: formatSelectedItems([overlay.population]),
    time_period: overlay.timePeriod,
    date_range:
      overlay.timePeriod === EVENT_TIME_PERIODS.customDateRange
        ? {
            start_date: overlay.dateRange.start_date,
            end_date: overlay.dateRange.end_date,
          }
        : {},
  }));

const formatMetricForRequest = (metric, graphType, graphGroup) => {
  const formattedMetric = {
    ...metric,
  };

  if (graphGroup === 'longitudinal') {
    formattedMetric.metric_style =
      graphType === 'combination' ? metric.metric_style : null;
  }

  if (graphGroup === 'longitudinal' || graphGroup === 'summary_bar') {
    formattedMetric.overlays = metric.overlays
      ? formatOverlaysForRequest(metric.overlays)
      : [];
  }

  if (graphGroup === 'summary_stack_bar') {
    formattedMetric.category_division = metric.category_division || null;
  }

  return formattedMetric;
};

const buildGraphRequest = (
  graphGroup,
  graphForm,
  graphType,
  { aggregationPeriod = 'day', decorators = {} } = {}
) => {
  const formattedMetrics = graphForm.metrics.map((metric) =>
    formatMetricForRequest(metric, graphType, graphGroup)
  );

  const graphRequestData = {
    metrics: formattedMetrics,
    date_range: shouldRequestIncludeDateRange(graphForm.time_period)
      ? {
          start_date: graphForm.date_range.start_date,
          end_date: graphForm.date_range.end_date,
        }
      : {},
    time_period: graphForm.time_period,
    graph_type: graphType || null,
    graph_group: graphGroup,
  };

  if (graphGroup === 'longitudinal') {
    graphRequestData.aggregation_period = aggregationPeriod;
  }

  if (
    graphGroup === 'longitudinal' ||
    graphGroup === 'summary_bar' ||
    graphGroup === 'summary_stack_bar'
  ) {
    if (graphGroup === 'summary_bar' || graphGroup === 'summary_stack_bar') {
      graphRequestData.decorators = {
        data_labels: decorators.data_labels || false,
        hide_zeros: decorators.hide_zeros || false,
        hide_nulls: decorators.hide_nulls || false,
      };
    } else {
      graphRequestData.decorators = {
        data_labels: decorators.data_labels || false,
      };
    }
  }

  return graphRequestData;
};

const useDateRange = (population) =>
  population.event_type_time_period === EVENT_TIME_PERIODS.customDateRange ||
  population.event_type_time_period === EVENT_TIME_PERIODS.game ||
  population.event_type_time_period === EVENT_TIME_PERIODS.trainingSession;

const buildSummaryGraphRequest = (
  reactGraphFormState,
  reactGraphFormTypeState
) => ({
  metrics: reactGraphFormState.metrics,
  populations: reactGraphFormState.population.map((population, index) => ({
    ...population,
    squadSelection: formatSelectedItems([population.athletes]),
    dateRange: useDateRange(population)
      ? {
          startDate: population.dateRange.start_date,
          endDate: population.dateRange.end_date,
        }
      : {},
    comparisonGroup: reactGraphFormState.comparisonGroupIndex === index,
  })),
  graph_type: reactGraphFormTypeState || null,
  graph_group: 'summary',
  scale_type: reactGraphFormState.scale_type,
});

const transformLoadingGraphResponse = (response) => ({
  id: response.id,
  graphType: response.graph_type,
  graphGroup: response.graph_group,
  isLoading: true,
  name: response.name || null,
  error: false,
});

const transformOverlayResponse = (overlays) =>
  overlays.map((overlay) => ({
    ...overlay,
    timePeriod: overlay.time_period,
    dateRange: overlay.date_range,
    population: flattenSquadSelection(overlay.squad_selection)[0],
    summary: overlay.status.summary,
  }));

const transformGraphResponse = (response, graphGroup) => {
  let formattedMetrics = response.metrics;

  if (graphGroup === 'longitudinal' || graphGroup === 'summary_bar') {
    formattedMetrics = response.metrics.map((metric) => ({
      ...metric,
      overlays:
        metric.overlays && metric.overlays.length > 0
          ? transformOverlayResponse(metric.overlays)
          : [],
    }));
  }

  const transformedGraphResponse = {
    graphData: Object.assign(
      {},
      {
        id: response.id || null,
        graphType: response.graph_type || null,
        metrics: formattedMetrics,
        time_period: response.time_period,
        date_range: response.date_range,
        graphGroup,
        name: response.name || null,
      }
    ),
    formData: {
      graphGroup,
      metrics: formattedMetrics,
      time_period: response.time_period,
      date_range: response.date_range,
    },
  };

  if (
    graphGroup === 'longitudinal' ||
    graphGroup === 'summary_bar' ||
    graphGroup === 'summary_stack_bar'
  ) {
    transformedGraphResponse.graphData.decorators = {
      data_labels:
        response.decorators && response.decorators.data_labels
          ? response.decorators.data_labels
          : false,
    };
  }

  if (graphGroup === 'summary_bar' || graphGroup === 'summary_stack_bar') {
    transformedGraphResponse.graphData.decorators = {
      ...transformedGraphResponse.graphData.decorators,
      hide_nulls:
        response.decorators && response.decorators.hide_nulls
          ? response.decorators.hide_nulls
          : false,
      hide_zeros:
        response.decorators && response.decorators.hide_zeros
          ? response.decorators.hide_zeros
          : false,
    };
  }

  if (graphGroup === 'longitudinal') {
    transformedGraphResponse.graphData = {
      ...transformedGraphResponse.graphData,
      illnesses: response.illnesses,
      injuries: response.injuries,
      categories: response.categories,
      aggregationPeriod: response.aggregation_period || 'day',
      decorators: {
        ...transformedGraphResponse.graphData.decorators,
        injuries: false,
        illnesses: false,
      },
    };
  }

  return transformedGraphResponse;
};

const transformSummaryResponse = (response, variablesHash = []) => {
  let comparisonGroupIndex = null;

  return {
    graphData: {
      id: response.id || null,
      graphType: response.graph_type || null,
      metrics: response.metrics.map((metric) => ({
        ...metric,
        name: variablesHash[metric.source_key]
          ? variablesHash[metric.source_key].name
          : null,
      })),
      series: response.series.map((series, index) => {
        const population = response.populations[index];
        return {
          ...series,
          dateRange: population.dateRange || {},
          timePeriod: population.timePeriod,
          selected_games: population.selected_games || [],
          selected_training_sessions:
            population.selected_training_sessions || [],
          event_breakdown: population.event_breakdown || null,
          event_type_time_period: population.event_type_time_period || null,
          time_period_length: population.time_period_length || null,
          last_x_time_period: population.last_x_time_period || 'days',
          time_period_length_offset:
            population.time_period_length_offset || null,
          last_x_time_period_offset:
            population.last_x_time_period_offset || 'days',
        };
      }),
      graphGroup: 'summary',
      illnesses: [],
      injuries: [],
      cmpStdDevs: response.cmpStdDevs,
      name: response.name || null,
      scale_type: response.scale_type,
    },
    formData: {
      population: response.populations.map((population, index) => {
        if (population.comparisonGroup) {
          comparisonGroupIndex = index;
        }

        return {
          ...population,
          athletes: flattenSquadSelection(population.squadSelection)[0],
          dateRange: useDateRange(population)
            ? {
                start_date: population.dateRange.startDate,
                end_date: population.dateRange.endDate,
              }
            : {},
          last_x_time_period: population.last_x_time_period || 'days',
          time_period_length: population.time_period_length || null,
          last_x_time_period_offset:
            population.last_x_time_period_offset || 'days',
          time_period_length_offset:
            population.time_period_length_offset || null,
        };
      }),
      metrics: response.metrics,
      comparisonGroupIndex,
      scale_type: response.scale_type,
    },
  };
};

const availableVariablesHash = (variables) =>
  variables.reduce((hash, variable) => {
    // Using Object.assign as that's what eslint recommends
    // https://github.com/airbnb/javascript/issues/719
    Object.assign(hash, { [variable.source_key]: variable });
    return hash;
  }, {});

const getIsEditingDashboard = () =>
  Boolean(searchParams('analytical_dashboard_id')) ||
  Boolean(searchParams('home_dashboard_id'));

const getContainerType = () => {
  const isHomeDashboard =
    searchParams('home_dashboard_id') ||
    searchParams('deeplink') === 'home_dashboard';

  if (isHomeDashboard) return 'HomeDashboard';
  return 'AnalyticalDashboard';
};

const getCurrentDashboard = (dashboardList) => {
  const isEditingDashboard = getIsEditingDashboard();

  const dashboardIdString =
    searchParams('home_dashboard_id') ||
    searchParams('analytical_dashboard_id') ||
    '';

  const dashboardId = parseInt(dashboardIdString, 10);

  return isEditingDashboard
    ? dashboardList.filter((dashboard) => dashboard.id === dashboardId)[0]
    : null;
};

const getIsEditingGraph = () => Boolean(searchParams('graph_id'));

const formatDashboardListForDropdown = (dashboardList) =>
  dashboardList.map((dashboard) => ({
    id: dashboard.id,
    title: dashboard.name,
  }));

const getCategorySelections = (mainCategory, category, StaticData) => {
  if (mainCategory === 'injury') {
    switch (category) {
      case 'pathology':
        return StaticData.injuryPathologies;
      case 'body_area':
        return StaticData.injuryBodyAreas;
      case 'classification':
        return StaticData.injuryClassifications;
      case 'activity':
        return StaticData.activities;
      case 'session_type':
        return StaticData.sessionsTypes;
      case 'contact_type':
        return StaticData.contactTypes;
      case 'competition':
        return StaticData.competitions;
      default:
        return [];
    }
  } else if (mainCategory === 'illness') {
    switch (category) {
      case 'pathology':
        return StaticData.illnessPathologies;
      case 'body_area':
        return StaticData.illnessBodyAreas;
      case 'classification':
        return StaticData.illnessClassifications;
      default:
        return [];
    }
  } else if (mainCategory === 'general_medical') {
    switch (category) {
      case 'diagnostic':
        return StaticData.diagnostics;
      default:
        return [];
    }
  }
  return [];
};

export {
  searchParams,
  shouldRequestIncludeDateRange,
  buildGraphRequest,
  buildSummaryGraphRequest,
  formatOverlaysForRequest,
  transformGraphResponse,
  transformSummaryResponse,
  transformLoadingGraphResponse,
  availableVariablesHash,
  getIsEditingDashboard,
  getIsEditingGraph,
  getContainerType,
  formatDashboardListForDropdown,
  getCurrentDashboard,
  getCategorySelections,
};
