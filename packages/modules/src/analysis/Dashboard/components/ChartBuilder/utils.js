// @flow
import _cloneDeep from 'lodash/cloneDeep';
import _isEmpty from 'lodash/isEmpty';
import _isEqual from 'lodash/isEqual';
import i18n from '@kitman/common/src/utils/i18n';
import { type KitmanIconName, KITMAN_ICON_NAMES } from '@kitman/playbook/icons';
import { MEDICAL_DATA_SOURCES } from '@kitman/modules/src/analysis/shared/constants';
import {
  AGGREGATE_PERIOD,
  AXIS_CONFIG,
  SERIES_TYPES,
  CHART_ELEMENT_ERROR,
} from '@kitman/modules/src/analysis/shared/components/XYChart/constants';
import {
  GROUPING_OPTIONS,
  defaultPieOptions,
} from '@kitman/modules/src/analysis/Dashboard/components/ChartBuilder/constants';
import { ICON_NAME } from '@kitman/playbook/icons/kitmanIconData';

// Types
import type {
  AggregatePeriod,
  ChartElementErrorType,
} from '@kitman/modules/src/analysis/shared/components/XYChart/types';
import { CHART_TYPE } from '@kitman/modules/src/analysis/Dashboard/components/ChartWidget/types';
import type {
  ChartElement,
  Grouping,
} from '@kitman/modules/src/analysis/shared/types/charts';
import { EMPTY_SELECTION } from '@kitman/components/src/Athletes/constants';
import { getCalculationTitle } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/utils';
import type { SquadAthletesSelection } from '@kitman/components/src/Athletes/types';
import type { WidgetData } from '../../types';
import type {
  CoreChartType,
  ChartWidgetType,
  PivotData,
} from '../ChartWidget/types';
import type { DataSourceFormState, VisualisationOption } from './types';

const SEPARATOR = ' - ';

export const getCoreChartTypes = (): Array<{
  type: CoreChartType,
  icon?: string,
  muiIcon?: KitmanIconName,
  name: string,
  description: string,
}> => [
  {
    type: 'value',
    icon: 'icon-value-graph',
    name: i18n.t('Value'),
    description: i18n.t('A number value'),
  },
  {
    type: 'xy',
    icon: 'icon-combination-graph',
    name: i18n.t('X and Y chart'),
    description: i18n.t('Bar charts, line charts or a combination of both'),
  },
  ...(window.getFlag('rep-charts-pie-donut')
    ? [
        {
          type: 'pie',
          muiIcon: KITMAN_ICON_NAMES.PieChartOutlineIcon,
          name: i18n.t('Pie and donut chart'),
          description: i18n.t('Add 1 data type and 1 grouping'),
        },
      ]
    : []),
];

export const getVisualisationOptions = (): Array<VisualisationOption> => [
  {
    label: i18n.t('Bar'),
    value: 'bar',
    icon: KITMAN_ICON_NAMES.BarChartIcon,
    isEnabled: true,
  },
  {
    label: i18n.t('Line'),
    value: 'line',
    icon: KITMAN_ICON_NAMES.TimelineIcon,
    isEnabled: true,
  },
  {
    label: i18n.t('Area'),
    value: 'area',
    customIcon: ICON_NAME.AreaChart,
    isEnabled: true,
  },
];

export const getPieVisualisationOptions = (): Array<VisualisationOption> => [
  {
    label: i18n.t('Donut'),
    value: 'donut',
    icon: KITMAN_ICON_NAMES.DataSaverOffIcon,
    isEnabled: true,
  },
  {
    label: i18n.t('Pie'),
    value: 'pie',
    icon: KITMAN_ICON_NAMES.ContrastIcon,
    isEnabled: true,
  },
];

// returns the value of the first pie visualisation type as default
export const getPieDefaultSeriesType = () => {
  return getPieVisualisationOptions()[0].value;
};

/**
 * This util returns the available visualisation options available when adding a new data source
 *  - Includes business logic to disable bar as an option when another chartElement is
 *    already configured to be a bar series
 *
 * @param {Array<ChartElement>} chartElements array of chartElements on the activeWidget
 * @returns Array<VisualisationOption>
 */

export const getAvailableVisualisationOptions = (
  chartElements: Array<ChartElement>
): Array<VisualisationOption> => {
  const visualisationOptions = getVisualisationOptions();

  if (!chartElements) {
    return visualisationOptions;
  }

  const existingTypes = new Set(
    chartElements.map((element) => element?.config?.render_options?.type)
  );

  const restrictedTypes = [SERIES_TYPES.bar, SERIES_TYPES.area];

  return visualisationOptions.map((option) => ({
    ...option,
    isEnabled: !(
      restrictedTypes.includes(option.value) && existingTypes.has(option.value)
    ),
  }));
};

export const getGranualityOptions = (): Array<{
  key: AggregatePeriod,
  label: string,
}> => [
  {
    key: AGGREGATE_PERIOD.monthly,
    label: i18n.t('Monthly'),
  },
  {
    key: AGGREGATE_PERIOD.weekly,
    label: i18n.t('Weekly'),
  },
  {
    key: AGGREGATE_PERIOD.daily,
    label: i18n.t('Daily'),
  },
];

/**
 * Util that recieves a chart widget and returns true or false if it is
 * empty, i.e. if there is enough data on the chart widget to query the /preview endpoint
 *
 * @param {ChartWidgetType} chartWidget the chart widget config
 * @returns Boolean
 */
export const isChartEmpty = (chartWidget: ChartWidgetType) => {
  if (!chartWidget.chart_elements || chartWidget.chart_elements?.length === 0) {
    return true;
  }

  // TODO write code for the following use cases in each chart element
  //  - Empty data type and input paramaters
  //  - Empty timescope
  //  - Empty population

  return false;
};

export const isInvalidGame = (dataSourceFormState: DataSourceFormState) => {
  const isGameActivity =
    dataSourceFormState.data_source_type === 'GameActivity';
  if (isGameActivity) {
    const isInvalidKinds = dataSourceFormState.input_params.kinds?.length === 0;
    const isInvalidPositionChange =
      dataSourceFormState.input_params.kinds?.includes('position_change') &&
      dataSourceFormState.input_params.position_ids?.length === 0;
    const isInvalidFormationChange =
      dataSourceFormState.input_params.kinds?.includes('formation_change') &&
      dataSourceFormState.input_params.formation_ids?.length === 0;

    return (
      isInvalidKinds || isInvalidPositionChange || isInvalidFormationChange
    );
  }
  return false;
};

export const isParticipationBlockInvalid = (
  dataSourceFormState: DataSourceFormState
) => {
  const isParticipation =
    dataSourceFormState.data_source_type === 'ParticipationLevel';
  if (isParticipation) {
    const isSectionInvalid =
      dataSourceFormState.input_params.status === 'participation_levels' &&
      dataSourceFormState.input_params.participation_level_ids?.length === 0;
    return isSectionInvalid;
  }
  return false;
};

export const isValueChartValid = (dataSourceFormState: DataSourceFormState) => {
  const isEmpty =
    _isEmpty(dataSourceFormState.input_params) &&
    !MEDICAL_DATA_SOURCES.includes(dataSourceFormState.data_source_type);

  const chartInvalid =
    !dataSourceFormState.calculation ||
    isEmpty ||
    _isEqual(dataSourceFormState.population, EMPTY_SELECTION) ||
    !dataSourceFormState.time_scope.time_period ||
    isInvalidGame(dataSourceFormState) ||
    isParticipationBlockInvalid(dataSourceFormState);

  return !chartInvalid;
};

export const isXYChartValid = (dataSourceFormState: DataSourceFormState) => {
  const chartInvalid =
    !isValueChartValid(dataSourceFormState) ||
    !dataSourceFormState.config?.groupings ||
    !dataSourceFormState.config?.render_options?.type ||
    isInvalidGame(dataSourceFormState) ||
    isParticipationBlockInvalid(dataSourceFormState);

  return !chartInvalid;
};

export const isSidePanelButtonDisabled = (
  chartType: string,
  dataSourceFormState: DataSourceFormState
) => {
  // this will need to be extended when other chart types are added
  // switch statement on chartType

  if (chartType === 'value') {
    return !isValueChartValid(dataSourceFormState);
  }

  return !isXYChartValid(dataSourceFormState);
};

/* 
Function to calculate if the chart has the max number of chart_elements allowed
 Used to determine whether to hide the Add data CTA.
 Will likely expand to switch statement once more chart types and multiple chart_elements are configured 
 */

export const isAddDataEnabled = (
  chartType: string,
  chartElements: Array<ChartElement>
) => {
  if (window.getFlag('rep-charts-configure-axis') && chartType === 'xy') {
    return true;
  }

  if (chartType === 'xy') {
    return chartElements.length < 2;
  }
  // default for value charts and pie charts
  return chartElements.length < 1;
};

// this function is to format the server response from adding a chart element.
// Only save required data to state, instead of the full response.
export const formatChartElementServerResponse = (
  serverData: DataSourceFormState
) => {
  return {
    id: serverData.id,
    data_source_type: serverData.data_source_type,
    input_params: serverData.input_params,
    calculation: serverData.calculation,
    overlays: serverData.overlays || null,
    population: serverData.population,
    time_scope: {
      time_period: serverData.time_scope.time_period,
      start_time: serverData.time_scope?.start_time,
      end_time: serverData.time_scope?.end_time,
      time_period_length: serverData.time_scope?.time_period_length,
      time_period_length_offset:
        serverData.time_scope?.time_period_length_offset,
      config: serverData.time_scope?.config || null,
    },
    config: serverData.config,
  };
};

// created pivot empty population as there are limited population options compared to the global population
const PIVOT_EMPTY_SELECTION: SquadAthletesSelection = {
  applies_to_squad: false,
  all_squads: false,
  position_groups: [],
  positions: [],
  athletes: [],
  squads: [],
};

export const isPivotEnabled = ({
  pivotedPopulation,
  pivotedTimePeriod,
}: PivotData) => {
  if (!pivotedPopulation && !pivotedTimePeriod) {
    return false;
  }
  return (
    !!pivotedTimePeriod || !_isEqual(pivotedPopulation, PIVOT_EMPTY_SELECTION)
  );
};

/* this function isolates the params necessary to query the preview endpoint
   with the intention to avoid unnecessary re-renders
   and it injects the pivot variables when pivot is enabled
*/
export const formatGetDataParams = (
  data: ChartWidgetType,
  {
    pivotedDateRange,
    pivotedPopulation,
    pivotedTimePeriod,
    pivotedTimePeriodLength,
  }: PivotData
) => {
  const chartElements = data.chart_elements.map((element: ChartElement) => {
    // when pivot is enabled, we swtich the population and time_scope to the pivoted variables.
    return {
      data_source_type: element.data_source_type,
      calculation: element.calculation,
      input_params: element.input_params,
      overlays: element.overlays,
      population:
        !pivotedPopulation || _isEqual(pivotedPopulation, PIVOT_EMPTY_SELECTION)
          ? element.population
          : {
              ...pivotedPopulation,
              context_squads: element.population.context_squads,
            },
      time_scope: !pivotedTimePeriod
        ? element.time_scope
        : {
            time_period: pivotedTimePeriod,
            start_time: pivotedDateRange?.start_date,
            end_time: pivotedDateRange?.end_date,
            time_period_length: pivotedTimePeriodLength,
            time_period_length_offset: null,
          },
      config: element.config,
      ...(window.getFlag('rep-charts-v2-caching') ? { id: element.id } : {}),
    };
  });

  return {
    id: data.id,
    name: data.name,
    chart_id: data.chart_id,
    chart_type: data.chart_type,
    chart_elements: _cloneDeep(chartElements),
  };
};

export const isChartLongitudinal = (chartElements: ?Array<ChartElement>) => {
  if (!chartElements || chartElements?.length === 0) {
    return false;
  }

  const config = chartElements[0].config;

  return config?.groupings
    ? config.groupings[0] === GROUPING_OPTIONS.timestamp
    : false;
};

/**
 * This util gets the new chart title based on the chart elements and dataSourceFormState
 * It utilizes the name set in the side panel and the calculation
 * For one data source, it formats "data source name - calculation"
 * For two data sources, it formats "data source 1 name - calculation 1 - data source 2 name - calculation 2"
 *
 * This functions handles the chart title when data sources are added or edited
 *
 * @param {DataSourceFormState} dataSourceFormState the data source config from the side panel
 * @param {Array<ChartElement>} chartElements the chart elements that are saved for the chart
 * @param {string} chartTitle the current chart title
 * @returns Array<Object>
 */
export const getNewChartTitle = (
  dataSourceFormState: DataSourceFormState,
  chartElements: Array<ChartElement>,
  chartTitle: string
): string => {
  const { calculation, id } = dataSourceFormState;
  const calculationTitle = getCalculationTitle(calculation);

  const currentElementTitle = [
    dataSourceFormState.config.render_options.name,
    calculationTitle,
  ].join(SEPARATOR);

  // when adding first data source
  if (chartElements?.length === 0) {
    return currentElementTitle;
  }

  // when editing first data source when there's only one data source
  if (chartElements.length === 1 && chartElements[0].id === id) {
    return currentElementTitle;
  }

  // when adding second data source
  if (chartElements.length === 1 && chartElements[0].id !== id) {
    return `${chartTitle} - ${currentElementTitle}`;
  }

  // when editing either data sources
  return chartElements
    .map((element) => {
      if (element.id === id) {
        return currentElementTitle;
      }

      return [
        element.config.render_options.name,
        getCalculationTitle(element.calculation),
      ].join(SEPARATOR);
    })
    .join(SEPARATOR);
};

/**
 * This util gets the new chart title when a data source is removed
 *
 * When removing the only data source, it defaults back to the generic chart type title
 * When removing one of multiple data sources, we loop through the remaining chartElements
 * to generate new title
 *
 * @param {DataSourceFormState} dataSourceFormState the data source config from the side panel
 * @param {Array<ChartElement>} chartElements the chart elements that are saved for the chart
 * @param {string} chartType the chart type
 * @returns Array<Object>
 */
export const getNewChartTitleOnRemove = (
  chartElements: Array<ChartElement>,
  dataSourceFormState: DataSourceFormState,
  chartType: string
): string => {
  const { id } = dataSourceFormState;

  if (chartElements.length === 1) {
    // get default chart name
    const chartTypes = getCoreChartTypes();
    return (
      chartTypes.find(({ type }) => type === chartType)?.name ||
      i18n.t('New Chart')
    );
  }

  return chartElements
    .filter((element) => element.id !== id)
    .map((element) =>
      [
        element.config.render_options.name,
        getCalculationTitle(element.calculation),
      ].join(SEPARATOR)
    )
    .join(SEPARATOR);
};

/* Determines the default widget type (bar/line) for a new chart.
   If the chart already contains a bar series, sets the default to line.
   Otherwise, defaults to bar. */
export const getDefaultSeriesType = (chartElements: Array<ChartElement>) => {
  const hasBarSeries = chartElements.some(
    (element) => element?.config?.render_options?.type === SERIES_TYPES.bar
  );

  return hasBarSeries ? SERIES_TYPES.line : SERIES_TYPES.bar;
};

/**
 * Synchronizes grouping of the chart elements:
 *
 * 1. Ignores the chart element if its datasource is invalid.
 *
 * 2. If one of the datasources has an updated shared grouping, syncs
 * the primary grouping of all the chart elements to shared grouping.
 *
 * @param {*} widgetData : all the available datasources per chart
 * @param {*} dataSourceFormState : current edit in the side panel
 * @param {*} invalidChartElementMap : map of chart elements and their error states
 * @returns validated and updated list of chart elements.
 */
export const synchronizeChartGrouping = (
  widgetData: WidgetData,
  dataSourceFormState: DataSourceFormState,
  invalidChartElementMap: { [key: string]: Array<string> }
) => {
  if (!widgetData) {
    return [];
  }
  const formStateGrouping = dataSourceFormState?.config?.groupings[0];
  const validatedChartElements = widgetData.widget.chart_elements.map(
    (item) => {
      // do not update chart element if the data source is invalid
      if (
        invalidChartElementMap?.[item.id]?.includes(
          CHART_ELEMENT_ERROR.INVALID_GROUPING
        )
      ) {
        return item;
      }

      const itemGroupings = [...item.config.groupings];
      // Syncs the primary grouping of all the chart elements to shared grouping.
      itemGroupings[0] = formStateGrouping;
      return {
        ...item,
        config: {
          ...item.config,
          groupings: itemGroupings,
        },
      };
    }
  );

  return validatedChartElements;
};

/**
 * Checks if the secondary array is a sub array of the primary array
 * @param {*} primaryArray
 * @param {*} secondaryArray
 * @returns boolean
 */
export const isSubArray = (
  primaryArray: Array<string>,
  secondaryArray: Array<string>
) => {
  const arr = Array.from(new Set([...primaryArray, ...secondaryArray]));

  return arr.length === primaryArray.length;
};

/**
 * Applies error state to the chart elements
 * @param {*} invalidChartElementIds chart elements to be considered
 * @param {*} invalidChartElementMapping invalid mapping from the state
 * @param {*} error the error to be applied
 * @returns an updated mapping after applying the error
 */
export const applyErrorState = (
  invalidChartElementIds: Array<string>,
  invalidChartElementMapping: { [key: string]: Array<string> },
  error: ChartElementErrorType
) => {
  const updatedMapping = invalidChartElementIds.reduce((acc, item) => {
    acc[item] = Array.from(
      new Set([
        ...(Array.isArray(invalidChartElementMapping?.[item])
          ? invalidChartElementMapping[item]
          : []),
        error,
      ])
    );
    return acc;
  }, {});

  return updatedMapping;
};

/**
 * Removes the error state from the state invalid mapping
 * @param {*} invalidChartElementMapping invalid mapping from the state
 * @param {*} error the error to be removed
 * @returns an updated mapping after removing the error
 */
export const removeErrorState = (
  invalidChartElementMapping: { [key: string]: Array<string> },
  error: ChartElementErrorType
) => {
  if (!invalidChartElementMapping) {
    return {};
  }
  const updatedMapping = Object.keys(invalidChartElementMapping).reduce(
    (acc, key) => {
      acc[key] = invalidChartElementMapping[key].filter(
        (item) => item !== error
      );
      return acc;
    },
    {}
  );
  return updatedMapping;
};

export const formatFormulaDetails = (element: ChartElement) => ({
  id: element.id,
  name: element.config.render_options.name,
  table_element: {
    data_source: {
      ...element.input_params,
      data_source_type: element.data_source_type,
    },
  },
});

/**
 * Orders the array of groupings first by
 * category and then by order.
 * @param {*} groupingList
 * @returns an ordered list of groupings
 */
export const orderGroupings = (
  groupingList: Array<Grouping>
): Array<Grouping> => {
  return groupingList.sort((a, b) => {
    if (a.category_order === b.category_order) {
      return a.order - b.order;
    }
    return a.category_order - b.category_order;
  });
};

export const getCheckboxChartOptions = (chartType: CoreChartType) => {
  switch (chartType) {
    case CHART_TYPE.xy:
      return [
        {
          value: 'hide_zero_values',
          label: i18n.t('Hide zero values'),
        },
        {
          value: 'hide_null_values',
          label: i18n.t('Hide null values'),
        },
      ];
    case CHART_TYPE.pie:
      return [
        {
          value: 'show_label',
          label: i18n.t('Show label'),
        },
        {
          value: 'show_values',
          label: i18n.t('Show values'),
        },
        {
          value: 'show_percentage',
          label: i18n.t('Show percentage'),
        },
        {
          value: 'show_legend',
          label: i18n.t('Show legend'),
        },
      ];
    default:
      return [];
  }
};

export const getDefaultChartOptionsAsObject = (chartType: CoreChartType) => {
  switch (chartType) {
    case CHART_TYPE.pie:
      return defaultPieOptions.reduce((result, option: string) => {
        return { ...result, [option]: true };
      }, {});
    case CHART_TYPE.value:
    default:
      return {};
  }
};

/**
 * Returns the default axis config for a chart element
 * when adding a new chart element, the default will be preselected
 * but a user can override it in the side panel
 *
 * Business logic
 * 1. default to left axis for first chart element
 * 2. default to right for the second chart element
 * 3. default to left for third and subsequent chart elements
 *
 * @param {Array<ChartElement>} chartElements : chartElements already configured for the chart
 * @returns 'left' | 'right' default axis config
 */
export const getDefaultAxisConfig = (chartElements: Array<ChartElement>) => {
  if (chartElements?.length === 1) {
    return AXIS_CONFIG.right;
  }

  return AXIS_CONFIG.left;
};
