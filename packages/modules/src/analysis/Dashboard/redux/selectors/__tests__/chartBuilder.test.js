import { colors } from '@kitman/common/src/variables';
import {
  getChartBuilder,
  getChartBuilderMode,
  getChartElementByIdFactory,
  getChartId,
  getGroupings,
  getGroupingsByDataSourceType,
  getDataSourceGroupingByIndex,
  getNewChartModal,
  getWidgetByIdFactory,
  getChartElementsByWidgetIdFactory,
  getWidgetDataWithPreviewData,
  getDataSourceFormState,
  getDataSourceSidePanel,
  getPreviewData,
  getTimeScope,
  getWidgetIdFromSidePanel,
  isChartBuilderOpen,
  isDataSourcePanelOpen,
  isWidgetInEditModeFactory,
  getChartTypeByWidgetId,
  getFiltersByType,
  getChartElementName,
  getChartElementType,
  getSidePanelSource,
  getChartConfig,
  getIsChartElementStacked,
  getLoaderLevelByWidgetId,
  getCachedAtByWidgetId,
  getChartName,
  getWidgetRefreshCache,
  getIsChartFormattingPanelOpen,
  getFormattingPanelAppliedFormat,
  getChartElementAxisConfig,
} from '../chartBuilder';
// eslint-disable-next-line jest/no-mocks-import
import {
  MOCK_STATE,
  MOCK_CHART_BUILDER,
  generateChartWidgetData,
  generateChartElement,
  MOCK_DATA_SOURCE_SIDE_PANEL,
  MOCK_GROUPINGS,
  MOCK_STATE_WITH_DATA,
  MOCK_STATE_PREVIEW_DATA,
  MOCK_CHART_ELEMENTS,
} from '../../__mocks__/chartBuilder';

const prepareStateWithWidgets = () => {
  const firstWidget = generateChartWidgetData();
  const secondWidget = generateChartWidgetData();
  const thirdWidget = generateChartWidgetData();

  const state = {
    ...MOCK_STATE,
    chartBuilder: {
      ...MOCK_CHART_BUILDER,
      activeWidgets: {
        [`${firstWidget.id}`]: firstWidget,
        [`${secondWidget.id}`]: secondWidget,
        [`${thirdWidget.id}`]: thirdWidget,
      },
    },
  };

  return {
    firstWidget,
    secondWidget,
    thirdWidget,
    state,
  };
};

describe('analysisDashboard - chartBuilder selectors', () => {
  test('getChartBuilder', () => {
    expect(getChartBuilder(MOCK_STATE)).toStrictEqual(MOCK_CHART_BUILDER);
  });

  test('getNewChartModal', () => {
    expect(getNewChartModal(MOCK_STATE)).toStrictEqual(
      MOCK_CHART_BUILDER.newChartModal
    );
  });

  test('isChartBuilderOpen', () => {
    expect(
      isChartBuilderOpen({
        ...MOCK_STATE,
        chartBuilder: {
          ...MOCK_CHART_BUILDER,
          newChartModal: {
            ...MOCK_CHART_BUILDER.newChartModal,
            isOpen: true,
          },
        },
      })
    ).toStrictEqual(true);
  });

  test('getChartElementByIdFactory', () => {
    const firstWidget = generateChartWidgetData();
    const secondWidget = generateChartWidgetData();

    const firstChartElements = [
      generateChartElement(),
      generateChartElement(),
      generateChartElement(),
    ];
    const secondChartElements = [
      generateChartElement(),
      generateChartElement(),
      generateChartElement(),
    ];

    const state = {
      ...MOCK_STATE,
      chartBuilder: {
        ...MOCK_CHART_BUILDER,
        activeWidgets: {
          [`${firstWidget.id}`]: {
            ...firstWidget,
            widget: {
              ...firstWidget.widget,
              chart_elements: [...firstChartElements],
            },
          },
          [`${secondWidget.id}`]: {
            ...secondWidget,
            widget: {
              ...secondWidget.widget,
              chart_elements: [...secondChartElements],
            },
          },
        },
      },
    };

    firstChartElements.forEach((chartElement, index) => {
      const selector = getChartElementByIdFactory(firstChartElements[index].id);
      expect(selector(state)).toStrictEqual(chartElement);
    });

    secondChartElements.forEach((chartElement, index) => {
      const selector = getChartElementByIdFactory(
        secondChartElements[index].id
      );
      expect(selector(state)).toStrictEqual(chartElement);
    });
  });

  test('getWidgetByIdFactory', () => {
    const { firstWidget, state } = prepareStateWithWidgets();

    const activeSelector = getWidgetByIdFactory(firstWidget.id);
    expect(activeSelector(state)).toBe(firstWidget);
  });

  test('getWidgetRefreshCache() - returns the expected boolean value', () => {
    const widgetId = 101;
    const stateWithCache = {
      ...MOCK_STATE_WITH_DATA,
      chartBuilder: {
        ...MOCK_STATE_WITH_DATA.chartBuilder,
        refreshWidgetCacheMap: {
          [widgetId]: true,
        },
      },
    };

    const selector = getWidgetRefreshCache(widgetId);
    const result = selector(stateWithCache);

    expect(result).toBe(true);
  });

  test('getWidgetRefreshCache() - returns null when widgetId is not present', () => {
    const widgetId = 123;
    const stateWithCache = {
      ...MOCK_STATE_WITH_DATA,
      chartBuilder: {
        ...MOCK_STATE_WITH_DATA.chartBuilder,
        refreshWidgetCacheMap: {
          101: true,
        },
      },
    };

    const selector = getWidgetRefreshCache(widgetId);
    const result = selector(stateWithCache);

    expect(result).toBe(null);
  });

  describe('isWidgetInEditModeFactory', () => {
    it('returns true when widget is present in state', () => {
      const { firstWidget, secondWidget, thirdWidget, state } =
        prepareStateWithWidgets();

      const firstSelector = isWidgetInEditModeFactory(firstWidget.id);
      expect(firstSelector(state)).toBe(true);

      const secondSelector = isWidgetInEditModeFactory(secondWidget.id);
      expect(secondSelector(state)).toBe(true);

      const thirdSelector = isWidgetInEditModeFactory(thirdWidget.id);
      expect(thirdSelector(state)).toBe(true);
    });
    it('returns false when widget is not present in state', () => {
      const selector = isWidgetInEditModeFactory(1234);

      // checking with blank state
      expect(selector(MOCK_STATE)).toBe(false);

      // checking with prepopulated state
      const { state } = prepareStateWithWidgets();
      expect(selector(state)).toBe(false);
    });
  });

  test('getChartElementsByWidgetIdFactory', () => {
    const state = {
      ...MOCK_STATE,
      chartBuilder: {
        ...MOCK_CHART_BUILDER,
        activeWidgets: {
          123: {
            widget: {
              chart_elements: [...MOCK_CHART_ELEMENTS],
            },
          },
        },
      },
    };

    const selector = getChartElementsByWidgetIdFactory('123');
    const result = selector(state);

    expect(result).toStrictEqual(MOCK_CHART_ELEMENTS);
  });

  test('getPreviewData', () => {
    expect(getPreviewData(MOCK_STATE_PREVIEW_DATA)).toStrictEqual(
      MOCK_STATE_PREVIEW_DATA.chartBuilder.dataSourceSidePanel.previewData
    );
  });

  test('getDataSourceSidePanel', () => {
    expect(getDataSourceSidePanel(MOCK_STATE_WITH_DATA)).toStrictEqual(
      MOCK_DATA_SOURCE_SIDE_PANEL
    );
  });

  test('getChartBuilderMode', () => {
    expect(getChartBuilderMode(MOCK_STATE_WITH_DATA)).toStrictEqual(
      MOCK_DATA_SOURCE_SIDE_PANEL.mode
    );
  });

  test('isDataSourcePanelOpen', () => {
    expect(isDataSourcePanelOpen(MOCK_STATE_WITH_DATA)).toStrictEqual(
      MOCK_DATA_SOURCE_SIDE_PANEL.isOpen
    );
  });

  test('getDataSourceFormState', () => {
    expect(getDataSourceFormState(MOCK_STATE_WITH_DATA)).toStrictEqual(
      MOCK_DATA_SOURCE_SIDE_PANEL.dataSourceFormState
    );
  });

  test('getTimeScope', () => {
    expect(getTimeScope(MOCK_STATE_WITH_DATA)).toStrictEqual(
      MOCK_DATA_SOURCE_SIDE_PANEL.dataSourceFormState.time_scope
    );
  });

  test('getWidgetIdFromSidePanel()', () => {
    expect(getWidgetIdFromSidePanel(MOCK_STATE_WITH_DATA)).toStrictEqual(
      MOCK_DATA_SOURCE_SIDE_PANEL.widgetId
    );
  });

  describe('getWidgetDataWithPreviewData()', () => {
    it('returns an empty object when widgetId is not defined', () => {
      const selector = getWidgetDataWithPreviewData();
      const results = selector(MOCK_STATE_PREVIEW_DATA);

      expect(results).toStrictEqual({});
    });

    it('returns an empty object when previewData is not defined', () => {
      const selector = getWidgetDataWithPreviewData();
      // no previewData defined in MOCK_STATE_WITH_DATA
      const results = selector(MOCK_STATE_WITH_DATA);

      expect(results).toStrictEqual({});
    });

    it('returns an empty object when activeWidgetData is not defined', () => {
      const state = {
        chartBuilder: {
          ...MOCK_STATE_PREVIEW_DATA.chartBuilder,
          activeWidgets: {},
        },
      };
      const selector = getWidgetDataWithPreviewData();
      const results = selector(state);

      expect(results).toStrictEqual({});
    });

    it('returns widgetData with previewData adding chart_element in apply mode', () => {
      // expected output is the chart_elements containing the data from previewData State
      const expectedOutput = {
        id: 1,
        widget: {
          id: 1,
          name: 'Widget Name',
          chart_type: 'value',
          chart_elements: [
            {
              ...MOCK_STATE_PREVIEW_DATA.chartBuilder.dataSourceSidePanel
                .previewData,
            },
          ],
        },
      };

      const selector = getWidgetDataWithPreviewData(1);
      // MOCK_STATE_PREVIEW_DATA has an empty chart_elements array
      const results = selector(MOCK_STATE_PREVIEW_DATA);
      expect(results).toStrictEqual(expectedOutput);
    });

    it('returns widgetData with previewData replacing chart_element in edit mode', () => {
      // expected output is the chart_elements containing the data from previewData State
      const expectedOutput = {
        id: 1,
        widget: {
          id: 1,
          name: 'Widget Name',
          chart_type: 'value',
          chart_elements: [
            {
              ...MOCK_STATE_PREVIEW_DATA.chartBuilder.dataSourceSidePanel
                .previewData,
            },
          ],
        },
      };

      // in activeWidgets state, the previewData id matches a chart_element in the chart_elements array
      // this state has a different value for data_source_type to test the selector replaces the chart_element with the previewData
      const state = {
        chartBuilder: {
          ...MOCK_STATE_PREVIEW_DATA.chartBuilder,
          activeWidgets: {
            1: {
              id: 1,
              widget: {
                id: 1,
                name: 'Widget Name',
                chart_type: 'value',
                chart_elements: [
                  {
                    ...MOCK_STATE_PREVIEW_DATA.chartBuilder.dataSourceSidePanel
                      .previewData,
                    data_source_type: 'EventDrillLabel',
                  },
                ],
              },
            },
          },
        },
      };

      const selector = getWidgetDataWithPreviewData(1);
      const results = selector(state);
      expect(results).toStrictEqual(expectedOutput);
    });
  });

  it('getChartId()', () => {
    expect(getChartId(MOCK_STATE_WITH_DATA)).toStrictEqual(
      MOCK_DATA_SOURCE_SIDE_PANEL.chartId
    );
  });

  it('getGroupings()', () => {
    expect(getGroupings(MOCK_STATE_WITH_DATA)).toStrictEqual(MOCK_GROUPINGS);
  });

  it('getGroupingsByDataSourceType()', () => {
    const selector = getGroupingsByDataSourceType(MOCK_GROUPINGS[0].name);
    expect(selector(MOCK_STATE_WITH_DATA)).toStrictEqual(
      MOCK_GROUPINGS[0].groupings
    );
  });

  it('getDataSourceGroupingByIndex()', () => {
    const selector = getDataSourceGroupingByIndex(0);
    expect(selector(MOCK_STATE_WITH_DATA)).toStrictEqual(
      MOCK_GROUPINGS[0].groupings[0]
    );
  });

  it('getChartTypeByWidgetId()', () => {
    const selector = getChartTypeByWidgetId(1);
    expect(selector(MOCK_STATE_PREVIEW_DATA)).toBe('value');
  });

  it('getFiltersByType()', () => {
    const selector = getFiltersByType('training_session_ids');
    expect(selector(MOCK_STATE_PREVIEW_DATA)).toStrictEqual(
      MOCK_CHART_ELEMENTS[0].config.filters.training_session_ids
    );
  });

  it('getChartElementName()', () => {
    expect(getChartElementName(MOCK_STATE_PREVIEW_DATA)).toStrictEqual(
      MOCK_CHART_ELEMENTS[0].config.render_options.name
    );
  });

  it('getChartElementType', () => {
    expect(getChartElementType(MOCK_STATE_PREVIEW_DATA)).toStrictEqual(
      MOCK_CHART_ELEMENTS[0].config.render_options.type
    );
  });

  it('getSidePanelSource', () => {
    expect(getSidePanelSource(MOCK_STATE_PREVIEW_DATA)).toStrictEqual(
      MOCK_DATA_SOURCE_SIDE_PANEL.sidePanelSource
    );
  });

  it('getIsChartElementStacked', () => {
    expect(getIsChartElementStacked(MOCK_STATE_PREVIEW_DATA)).toStrictEqual(
      MOCK_CHART_ELEMENTS[0].config.render_options.stack_group_elements
    );
  });

  it('getChartName', () => {
    const selector = getChartName('1');
    expect(selector(MOCK_STATE_PREVIEW_DATA)).toBe('Widget Name');
  });

  it('getLoaderLevelByWidgetId()', () => {
    const widgetId = 112;
    const state = {
      ...MOCK_STATE_WITH_DATA,
      chartBuilder: {
        ...MOCK_STATE_WITH_DATA.chartBuilder,
        loaderLevelMap: {
          [widgetId]: 1,
        },
      },
    };

    const selector = getLoaderLevelByWidgetId(widgetId);
    const result = selector(state);

    expect(result).toStrictEqual(1);
  });

  it('getCachedAtByWidgetId()', () => {
    const widgetId = 112;
    const state = {
      ...MOCK_STATE_WITH_DATA,
      chartBuilder: {
        ...MOCK_STATE_WITH_DATA.chartBuilder,
        cachedAtMap: {
          [widgetId]: ['2025-06-18T14:49:51.000+01:00'],
        },
      },
    };

    const selector = getCachedAtByWidgetId(widgetId);
    const result = selector(state);

    expect(result).toStrictEqual(['2025-06-18T14:49:51.000+01:00']);
  });

  it('getChartConfig()', () => {
    const chartId = 123;
    const mockConfig = {
      aggregation_period: 'weekly',
      show_labels: true,
      chartOptions: { hide_zero_values: true },
      sortConfig: { sortBy: 456, sortOrder: 'lowToHigh' },
    };

    const state = {
      ...MOCK_STATE_WITH_DATA,
      chartBuilder: {
        ...MOCK_STATE_WITH_DATA.chartBuilder,
        [chartId]: {
          config: mockConfig,
        },
      },
    };

    const selector = getChartConfig(chartId);
    const result = selector(state);

    expect(result).toStrictEqual(mockConfig);
  });

  it('getChartConfig() - returns empty object when chartId is not in state', () => {
    const chartId = 999;
    const state = MOCK_STATE_WITH_DATA;

    const selector = getChartConfig(chartId);
    const result = selector(state);

    expect(result).toStrictEqual({});
  });

  test('getIsChartFormattingPanelOpen', () => {
    expect(
      getIsChartFormattingPanelOpen({
        ...MOCK_STATE,
        chartBuilder: {
          ...MOCK_CHART_BUILDER,
          chartFormattingPanel: {
            isOpen: true,
          },
        },
      })
    ).toStrictEqual(true);
  });

  test('getFormattingPanelAppliedFormat', () => {
    const mockAppliedFormat = [
      {
        type: 'zone',
        condition: 'greater_than',
        value: '200',
        color: colors.green_100,
        label: 'High performance',
      },
      {
        type: 'zone',
        condition: 'between',
        from: '100',
        to: '160',
        color: colors.yellow_100,
        label: 'Medium performance',
      },
    ];
    expect(
      getFormattingPanelAppliedFormat({
        ...MOCK_STATE,
        chartBuilder: {
          ...MOCK_CHART_BUILDER,
          chartFormattingPanel: {
            isOpen: true,
            appliedFormat: mockAppliedFormat,
          },
        },
      })
    ).toStrictEqual(mockAppliedFormat);
  });

  it('getChartElementAxisConfig', () => {
    expect(getChartElementAxisConfig(MOCK_STATE_PREVIEW_DATA)).toStrictEqual(
      MOCK_CHART_ELEMENTS[0].config.render_options.axis_config
    );
  });
});
