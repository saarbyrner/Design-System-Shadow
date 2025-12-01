// @flow

import { createSelector } from '@reduxjs/toolkit';
import _cloneDeep from 'lodash/cloneDeep';
import _get from 'lodash/get';
import type {
  ChartElement,
  FilterType,
  FilterValue,
} from '@kitman/modules/src/analysis/shared/types/charts';
import type { Timescope } from '@kitman/modules/src/analysis/shared/types';
import {
  initialState,
  REDUCER_KEY,
  type ChartBuilderState,
  type FormMode,
} from '../slices/chartBuilder';
import type {
  DataSourceFormState,
  Grouping,
} from '../../components/ChartBuilder/types';
import type { Selector } from '../types/store';

export const getChartBuilder: Selector<ChartBuilderState> = (state) =>
  _get(state, REDUCER_KEY, initialState);

export const getNewChartModal: Selector<ChartBuilderState> = createSelector(
  [getChartBuilder],
  (chartBuilder) => {
    return chartBuilder.newChartModal;
  }
);

export const isChartBuilderOpen: Selector<Boolean> = createSelector(
  [getNewChartModal],
  ({ isOpen }) => isOpen
);

export const isWidgetInEditModeFactory = (
  widgetId: number
): Selector<boolean> =>
  createSelector([getChartBuilder], (chartBuilder) => {
    const isEditmode = !!chartBuilder.activeWidgets[`${widgetId}`];

    return isEditmode;
  });

export const getWidgetByIdFactory = (
  id: number
): Selector<ChartElement | null> =>
  createSelector([getChartBuilder], (chartBuilder) => {
    const widgets = chartBuilder.activeWidgets;
    return widgets[`${id}`];
  });

export const getChartElementsByWidgetIdFactory = (
  widgetId: string
): Selector<Array<ChartElement>> =>
  createSelector([getChartBuilder], (chartBuilder) => {
    const widget = chartBuilder.activeWidgets[widgetId];

    return widget?.widget?.chart_elements;
  });

export const getChartElementByIdFactory = (
  id: number
): Selector<ChartElement | null> =>
  createSelector([getChartBuilder], (chartBuilder) => {
    const widgets = chartBuilder.activeWidgets;

    const chartElements = Object.keys(widgets).flatMap((widgetId) => {
      const widgetData = widgets[widgetId];

      return widgetData.widget.chart_elements;
    });

    const chartElement = chartElements.find((element) => element.id === id);

    return chartElement;
  });

export const getGroupings: Selector<Array<Grouping>> = createSelector(
  [getChartBuilder],
  ({ groupings }) => groupings
);

export const getGroupingsByDataSourceType = (
  dataSourceType: string
): Selector<Array<string>> =>
  createSelector([getChartBuilder], ({ groupings }) => {
    if (!groupings) {
      return [];
    }

    const filteredGroupings = groupings.filter(
      (grouping) => grouping.name === dataSourceType
    );

    return filteredGroupings.length > 0 ? filteredGroupings[0].groupings : [];
  });

export const getDataSourceSidePanel: Selector<Object> = createSelector(
  [getChartBuilder],
  ({ dataSourceSidePanel }) => dataSourceSidePanel
);

export const getChartBuilderMode: Selector<FormMode> = createSelector(
  [getDataSourceSidePanel],
  ({ mode }) => mode
);

export const isDataSourcePanelOpen: Selector<Boolean> = createSelector(
  [getDataSourceSidePanel],
  ({ isOpen }) => isOpen
);

export const getDataSourceFormState: Selector<DataSourceFormState> =
  createSelector(
    [getDataSourceSidePanel],
    ({ dataSourceFormState }) => dataSourceFormState
  );

export const getPreviewData: Selector<boolean | null> = createSelector(
  [getDataSourceSidePanel],
  ({ previewData }) => previewData
);

export const getWidgetIdFromSidePanel: Selector<string | number> =
  createSelector([getDataSourceSidePanel], ({ widgetId }) => widgetId);

export const getSidePanelSource: Selector<string | null> = createSelector(
  [getDataSourceSidePanel],
  ({ sidePanelSource }) => sidePanelSource
);

export const getTimeScope: Selector<Timescope> = createSelector(
  [getDataSourceFormState],
  // eslint-disable-next-line camelcase
  ({ time_scope }) => time_scope
);

// This selector is used whens a user wants to preview the data source in the side panel
// It uses widgetData from activeWidgets and either adds or replaces a chart_element when adding/editing data source
// We then use this data to query the preview endpoint whilst a user is in edit mode of the chart builder
export const getWidgetDataWithPreviewData = (
  widgetId: number
  // previewData: DataSourceFormState
): Selector<ChartElement | null> =>
  createSelector(
    [getWidgetByIdFactory(widgetId), getPreviewData],
    (activeWidgetData, previewData) => {
      if (!widgetId || !previewData || !activeWidgetData) {
        return {};
      }

      const previewWidgetData = _cloneDeep(activeWidgetData);

      const index = previewWidgetData.widget.chart_elements.findIndex(
        (element) => element.id === previewData.id
      );

      if (index !== -1) {
        previewWidgetData.widget.chart_elements.splice(index, 1, previewData);
      } else {
        previewWidgetData.widget.chart_elements.push({
          ...previewData,
        });
      }

      return previewWidgetData;
    }
  );

export const getChartId: Selector<number> = createSelector(
  [getDataSourceSidePanel],
  ({ chartId }) => chartId
);

export const getDataSourceGroupingByIndex = (index: number): Selector<string> =>
  createSelector([getDataSourceFormState], ({ config }) => {
    if (!config?.groupings) {
      return '';
    }

    return config.groupings[index];
  });

export const getChartTypeByWidgetId = (widgetId: number): Selector<string> =>
  createSelector([getWidgetByIdFactory(widgetId)], (widget) => {
    if (!widget) {
      return null;
    }

    return widget?.widget.chart_type;
  });

export const getLoaderLevelByWidgetId = (widgetId: number): Selector<number> =>
  createSelector([getChartBuilder], (chartBuilder) => {
    if (!chartBuilder) {
      return null;
    }
    return chartBuilder.loaderLevelMap?.[widgetId];
  });

export const getCachedAtByWidgetId = (
  widgetId: number
): Selector<Array<string>> =>
  createSelector([getChartBuilder], (chartBuilder) => {
    if (!chartBuilder) {
      return null;
    }
    return chartBuilder.cachedAtMap?.[widgetId];
  });

export const getFiltersByType = (
  filterType: FilterType
): Selector<Array<FilterValue | null>> =>
  createSelector([getDataSourceFormState], ({ config }) => {
    if (!config?.filters) {
      return [];
    }

    return config.filters[filterType] ? config.filters[filterType] : [];
  });

export const getChartElementName: Selector<string> = createSelector(
  [getDataSourceFormState],
  ({ config }) => {
    if (!config?.render_options) {
      return '';
    }

    return config.render_options?.name ? config.render_options.name : '';
  }
);

export const getChartElementType: Selector<string> = createSelector(
  [getDataSourceFormState],
  ({ config }) => {
    if (!config?.render_options) {
      return '';
    }

    return config.render_options?.type ? config.render_options.type : '';
  }
);

export const getChartConfig = (
  chartId: number
): Selector<ChartElement | Object> =>
  createSelector([getChartBuilder], (chartBuilder) => {
    return chartBuilder?.[chartId]?.config ?? {};
  });

export const getIsChartElementStacked: Selector<string | null> = createSelector(
  [getDataSourceFormState],
  ({ config }) => {
    if (!config?.render_options) {
      return '';
    }

    return config.render_options?.stack_group_elements;
  }
);

export const getChartName = (id: number): Selector<ChartElement | null> =>
  createSelector([getChartBuilder], (chartBuilder) => {
    const widget = chartBuilder.activeWidgets?.[`${id}`];

    return widget?.widget?.name;
  });

export const getWidgetRefreshCache = (
  widgetId: number
): Selector<boolean | null> =>
  createSelector([getChartBuilder], ({ refreshWidgetCacheMap }) => {
    if (!refreshWidgetCacheMap) {
      return null;
    }

    return refreshWidgetCacheMap[widgetId] ?? null;
  });

export const getIsChartFormattingPanelOpen: Selector<boolean> = createSelector(
  [getChartBuilder],
  (chartBuilder) => chartBuilder.chartFormattingPanel.isOpen
);

export const getFormattingPanelAppliedFormat: Selector<Array<Object>> =
  createSelector(
    [getChartBuilder],
    (chartBuilder) => chartBuilder.chartFormattingPanel.appliedFormat
  );

export const getChartElementAxisConfig: Selector<string> = createSelector(
  [getDataSourceFormState],
  ({ config }) => {
    if (!config?.render_options) {
      return '';
    }

    return config.render_options?.axis_config
      ? config.render_options.axis_config
      : '';
  }
);
