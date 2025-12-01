import { colors } from '@kitman/common/src/variables';
// eslint-disable-next-line jest/no-mocks-import
import {
  MOCK_CHART_BUILDER,
  generateChartWidgetData,
  MOCK_CHART_ELEMENTS,
  MOCK_DATA_SOURCE_SIDE_PANEL,
} from '../../__mocks__/chartBuilder';

import chartBuilderReducer, {
  addCalculation,
  addCalculationParams,
  addInputParams,
  addPopulation,
  addTimeScope,
  beginWidgetEditMode,
  closeNewChartModal,
  deleteChartElement,
  endWidgetEditMode,
  addDataType,
  applyChartElement,
  closeDataSourcePanel,
  defaultDataSourceSidePanel,
  emptyDataSourceFormState,
  editDataType,
  initialState,
  newChart,
  setAllGroupings,
  addDataSourceGroupingByIndex,
  deleteDataSourceGrouping,
  addFilter,
  addRenderOptions,
  updatePreviewChartData,
  updateChartElement,
  setSidePanelSource,
  updateFormStateType,
  setDataSourceSubtype,
  updateChartName,
  refreshChartElements,
  refreshInvalidChartElementMap,
  updateLoaderLevel,
  updateCachedAt,
  updateChartConfig,
  refreshWidgetCache,
  toggleChartFormattingPanel,
  addFormattingRule,
  removeFormattingRule,
  addFormattingOption,
} from '../chartBuilder';

describe('analysis dashboard - chartBuilder slice', () => {
  it('should have an initial state', () => {
    const action = { type: 'unknown' };
    const expectedState = initialState;

    expect(chartBuilderReducer(initialState, action)).toStrictEqual(
      expectedState
    );
  });

  test('newChart()', () => {
    expect(chartBuilderReducer(initialState, newChart())).toStrictEqual({
      ...MOCK_CHART_BUILDER,
      newChartModal: {
        ...MOCK_CHART_BUILDER.newChartModal,
        isOpen: true,
      },
    });
  });

  describe('closeNewChartModal()', () => {
    const mockChartBuilderState = {
      activeWidgets: {},
      dataSourceSidePanel: MOCK_DATA_SOURCE_SIDE_PANEL,
      groupings: ['side', 'athlete_id'],
      123: {
        show_labels: true,
        chartOptions: {
          hide_zero_values: true,
        },
      },
    };

    it('close the modal state', () => {
      expect(
        chartBuilderReducer(
          {
            ...MOCK_CHART_BUILDER,
            newChartModal: {
              isOpen: true,
            },
          },
          closeNewChartModal()
        )
      ).toStrictEqual({
        ...MOCK_CHART_BUILDER,
        newChartModal: {
          isOpen: false,
        },
      });
    });

    it('only reset the partial state "dataSourceSidePanel"', () => {
      expect(
        chartBuilderReducer(
          {
            ...mockChartBuilderState,
            newChartModal: {
              isOpen: true,
            },
          },
          closeNewChartModal()
        )
      ).toStrictEqual({
        ...mockChartBuilderState,
        dataSourceSidePanel: defaultDataSourceSidePanel, // reset dataSourceSidePanel
        newChartModal: {
          isOpen: false,
        },
      });
    });
  });

  test('closeDataSourcePanel()', () => {
    expect(
      chartBuilderReducer(
        {
          ...MOCK_CHART_BUILDER,
          dataSourceSidePanel: {
            ...MOCK_CHART_BUILDER.dataSourceSidePanel,
            isOpen: true,
          },
        },
        closeDataSourcePanel()
      )
    ).toStrictEqual(initialState);
  });

  test('addDataType()', () => {
    const expectedState = {
      ...MOCK_CHART_BUILDER,
      dataSourceSidePanel: {
        isOpen: true,
        widgetId: 1,
        chartId: 1,
        mode: 'create',
        sidePanelSource: 'metric',
        dataSourceFormState: {
          id: '-1',
          ...emptyDataSourceFormState,
        },
      },
    };

    expect(
      chartBuilderReducer(
        {
          ...MOCK_CHART_BUILDER,
        },
        addDataType({ source: 'metric', widgetId: 1, chartId: 1 })
      )
    ).toStrictEqual(expectedState);
  });

  test('addDataType() with medical source', () => {
    const expectedState = {
      ...MOCK_CHART_BUILDER,
      dataSourceSidePanel: {
        isOpen: true,
        widgetId: 1,
        chartId: 1,
        mode: 'create',
        sidePanelSource: 'medical',
        dataSourceFormState: {
          id: '-2',
          ...emptyDataSourceFormState,
          calculation: 'count_absolute',
          type: 'MedicalInjury',
          data_source_type: 'MedicalInjury',
        },
      },
    };

    expect(
      chartBuilderReducer(
        {
          ...MOCK_CHART_BUILDER,
        },
        addDataType({ source: 'medical', widgetId: 1, chartId: 1 })
      )
    ).toStrictEqual(expectedState);
  });

  test('editDataType()', () => {
    const widget = generateChartWidgetData();

    const expectedState = {
      ...MOCK_CHART_BUILDER,
      activeWidgets: {
        [widget.id]: {
          ...widget,
          widget: {
            ...widget.widget,
            chart_elements: [...MOCK_CHART_ELEMENTS],
          },
        },
      },
      dataSourceSidePanel: {
        mode: 'update',
        isOpen: true,
        widgetId: 1,
        chartId: 1,
        sidePanelSource: 'metric',
        dataSourceFormState: {
          ...MOCK_CHART_ELEMENTS[0],
        },
      },
    };

    expect(
      chartBuilderReducer(
        {
          ...MOCK_CHART_BUILDER,
          activeWidgets: {
            [widget.id]: {
              ...widget,
              widget: {
                ...widget.widget,
                chart_elements: [...MOCK_CHART_ELEMENTS],
              },
            },
          },
        },
        editDataType({
          chart_element: MOCK_CHART_ELEMENTS[0],
          widgetId: 1,
          chartId: 1,
        })
      )
    ).toStrictEqual(expectedState);
  });

  test('applyChartElement()', () => {
    const widget = generateChartWidgetData();

    const expectedState = {
      ...MOCK_CHART_BUILDER,
      activeWidgets: {
        [widget.id]: {
          ...widget,
          widget: {
            ...widget.widget,
            chart_elements: [
              {
                ...MOCK_CHART_ELEMENTS[0],
              },
            ],
          },
        },
      },
      dataSourceSidePanel: {
        ...defaultDataSourceSidePanel,
      },
    };

    expect(
      chartBuilderReducer(
        {
          ...MOCK_CHART_BUILDER,
          activeWidgets: {
            [widget.id]: {
              ...widget,
            },
          },
          dataSourceSidePanel: {
            isOpen: true,
            mode: 'create',
            widgetId: widget.id,
            dataSourceFormState: {
              ...MOCK_CHART_ELEMENTS[0],
            },
          },
        },
        applyChartElement({ data: MOCK_CHART_ELEMENTS[0] })
      )
    ).toStrictEqual(expectedState);
  });

  test('updateChartElement()', () => {
    const widget = generateChartWidgetData();

    const updatedDataSourceFormState = {
      id: 2,
      data_source_type: 'metric',
      input_params: {},
      calculation: 'sum',
      overlays: null,
      population: {
        applies_to_squad: false,
        all_squads: false,
        position_groups: [],
        positions: [1],
        athletes: [],
        squads: [],
        context_squads: [],
      },
      time_scope: {
        time_period: 'this_season',
      },
      config: {},
    };

    const expectedState = {
      ...MOCK_CHART_BUILDER,
      activeWidgets: {
        [widget.id]: {
          ...widget,
          widget: {
            ...widget.widget,
            chart_elements: [
              MOCK_CHART_ELEMENTS[0],
              {
                ...updatedDataSourceFormState,
              },
            ],
          },
        },
      },
      dataSourceSidePanel: {
        ...defaultDataSourceSidePanel,
      },
    };

    expect(
      chartBuilderReducer(
        {
          ...MOCK_CHART_BUILDER,
          activeWidgets: {
            [widget.id]: {
              ...widget,
              widget: {
                ...widget.widget,
                chart_elements: [...MOCK_CHART_ELEMENTS],
              },
            },
          },
          dataSourceSidePanel: {
            isOpen: true,
            mode: 'update',
            widgetId: widget.id,
            dataSourceFormState: {
              ...updatedDataSourceFormState,
            },
          },
        },
        updateChartElement({
          widgetId: `${widget.id}`,
          formattedState: updatedDataSourceFormState,
        })
      )
    ).toStrictEqual(expectedState);
  });

  test('addInputParams()', () => {
    const expectedState = {
      ...MOCK_CHART_BUILDER,
      dataSourceSidePanel: {
        ...defaultDataSourceSidePanel,
        isOpen: true,
        dataSourceFormState: {
          ...defaultDataSourceSidePanel.dataSourceFormState,
          data_source_type: 'TableMetric',
          input_params: {
            source: 'kitman:athlete',
            variable: 'age_in_years',
          },
          type: 'TableMetric',
        },
      },
    };

    expect(
      chartBuilderReducer(
        {
          ...MOCK_CHART_BUILDER,
          dataSourceSidePanel: {
            isOpen: true,
            mode: 'create',
            dataSourceFormState: {
              ...defaultDataSourceSidePanel.dataSourceFormState,
              data_source_type: 'metric',
            },
          },
        },
        addInputParams({
          type: 'TableMetric',
          data: [
            { key_name: 'kitman:athlete|age_in_years', name: 'Age (years)' },
          ],
        })
      )
    ).toStrictEqual(expectedState);
  });

  test('beginWidgetEditMode', () => {
    const widget = generateChartWidgetData();
    const newState = chartBuilderReducer(
      { ...MOCK_CHART_BUILDER },
      beginWidgetEditMode(widget)
    );

    expect(newState).toStrictEqual({
      ...MOCK_CHART_BUILDER,
      activeWidgets: {
        [widget.id]: widget,
      },
    });

    const anotherWidget = generateChartWidgetData();

    const updatedState = chartBuilderReducer(
      newState,
      beginWidgetEditMode(anotherWidget)
    );

    expect(updatedState).toStrictEqual({
      ...MOCK_CHART_BUILDER,
      activeWidgets: {
        [widget.id]: widget,
        [`${anotherWidget.id}`]: anotherWidget,
      },
    });
  });

  test('endWidgetEditMode', () => {
    const widget = generateChartWidgetData();
    const anotherWidget = generateChartWidgetData();

    const newState = chartBuilderReducer(
      {
        ...MOCK_CHART_BUILDER,
        activeWidgets: {
          [widget.id]: widget,
          [`${anotherWidget.id}`]: anotherWidget,
        },
      },
      endWidgetEditMode(widget.id)
    );

    expect(newState).toStrictEqual({
      ...MOCK_CHART_BUILDER,
      activeWidgets: {
        [`${anotherWidget.id}`]: anotherWidget,
      },
    });
  });

  test('setAllGroupings', () => {
    const expectedState = {
      ...MOCK_CHART_BUILDER,
      groupings: [{ name: 'grouping_1', groupings: ['grouping_1'] }],
      dataSourceSidePanel: {
        ...defaultDataSourceSidePanel,
      },
    };
    expect(
      chartBuilderReducer(
        {
          ...MOCK_CHART_BUILDER,
          dataSourceSidePanel: {
            ...defaultDataSourceSidePanel,
          },
        },
        setAllGroupings([{ name: 'grouping_1', groupings: ['grouping_1'] }])
      )
    ).toStrictEqual(expectedState);
  });

  describe('addCalculation()', () => {
    it('updates the calculation', () => {
      const expectedState = {
        ...MOCK_CHART_BUILDER,
        dataSourceSidePanel: {
          isOpen: true,
          mode: 'update',
          widgetId: '1',
          dataSourceFormState: {
            ...emptyDataSourceFormState,
            calculation: 'sum',
          },
        },
      };
      expect(
        chartBuilderReducer(
          {
            ...MOCK_CHART_BUILDER,
            dataSourceSidePanel: {
              isOpen: true,
              mode: 'update',
              widgetId: '1',
              dataSourceFormState: {
                ...emptyDataSourceFormState,
              },
            },
          },
          addCalculation('sum')
        )
      ).toStrictEqual(expectedState);
    });

    it('resets calculation_params (when defined) when changing the calculation', () => {
      const expectedState = {
        ...MOCK_CHART_BUILDER,
        dataSourceSidePanel: {
          isOpen: true,
          mode: 'update',
          widgetId: '1',
          dataSourceFormState: {
            ...emptyDataSourceFormState,
            calculation: 'sum',
            config: {
              calculation_params: {},
            },
          },
        },
      };

      expect(
        chartBuilderReducer(
          {
            ...MOCK_CHART_BUILDER,
            dataSourceSidePanel: {
              isOpen: true,
              mode: 'update',
              widgetId: '1',
              dataSourceFormState: {
                ...emptyDataSourceFormState,
                calculation: 'z-score',
                config: {
                  calculation_params: {
                    evaluated_period: 10,
                    comparative_period: 10,
                  },
                },
              },
            },
          },
          addCalculation('sum')
        )
      ).toStrictEqual(expectedState);
    });
  });

  describe('addCalculationParams()', () => {
    test('it adds payload to the config state', () => {
      const expectedState = {
        ...MOCK_CHART_BUILDER,
        dataSourceSidePanel: {
          isOpen: true,
          mode: 'update',
          widgetId: '1',
          dataSourceFormState: {
            ...defaultDataSourceSidePanel,
            config: {
              calculation_params: {
                evaluated_period: 10,
              },
            },
            calculation: 'z-score',
          },
        },
      };

      expect(
        chartBuilderReducer(
          {
            ...MOCK_CHART_BUILDER,
            dataSourceSidePanel: {
              isOpen: true,
              mode: 'update',
              widgetId: '1',
              dataSourceFormState: {
                ...defaultDataSourceSidePanel,
                calculation: 'z-score',
              },
            },
          },
          addCalculationParams({ evaluated_period: 10 })
        )
      ).toStrictEqual(expectedState);
    });

    test('it layers new config into existing config state', () => {
      const expectedState = {
        ...MOCK_CHART_BUILDER,
        dataSourceSidePanel: {
          isOpen: true,
          mode: 'update',
          widgetId: '1',
          dataSourceFormState: {
            ...defaultDataSourceSidePanel,
            calculation: 'z-score',
            config: {
              calculation_params: {
                evaluated_period: 10,
                comparative_period: 10,
              },
            },
          },
        },
      };

      expect(
        chartBuilderReducer(
          {
            ...MOCK_CHART_BUILDER,
            dataSourceSidePanel: {
              isOpen: true,
              mode: 'update',
              widgetId: '1',
              dataSourceFormState: {
                ...defaultDataSourceSidePanel,
                config: {
                  calculation_params: {
                    evaluated_period: 10,
                  },
                },
                calculation: 'z-score',
              },
            },
          },
          addCalculationParams({ comparative_period: 10 })
        )
      ).toStrictEqual(expectedState);
    });
  });

  test('addPopulation', () => {
    const expectedState = {
      ...MOCK_CHART_BUILDER,
      dataSourceSidePanel: {
        isOpen: true,
        mode: 'update',
        widgetId: '1',
        dataSourceFormState: {
          ...defaultDataSourceSidePanel,
          population: {
            applies_to_squad: false,
            all_squads: false,
            position_groups: [],
            positions: [],
            athletes: [1],
            squads: [],
            context_squads: [],
            users: [],
          },
        },
      },
    };

    expect(
      chartBuilderReducer(
        {
          ...MOCK_CHART_BUILDER,
          dataSourceSidePanel: {
            isOpen: true,
            mode: 'update',
            widgetId: '1',
            dataSourceFormState: {
              ...defaultDataSourceSidePanel,
            },
          },
        },
        addPopulation({
          applies_to_squad: false,
          all_squads: false,
          position_groups: [],
          positions: [],
          athletes: [1],
          squads: [],
          context_squads: [],
          users: [],
        })
      )
    ).toStrictEqual(expectedState);
  });

  describe('addTimeScope', () => {
    test('it adds payload to state', () => {
      const expectedState = {
        ...MOCK_CHART_BUILDER,
        dataSourceSidePanel: {
          isOpen: true,
          widgetId: '1',
          dataSourceFormState: {
            ...defaultDataSourceSidePanel,
            time_scope: {
              time_period: 'this season',
            },
          },
        },
      };

      expect(
        chartBuilderReducer(
          {
            ...MOCK_CHART_BUILDER,
            dataSourceSidePanel: {
              isOpen: true,
              widgetId: '1',
              dataSourceFormState: {
                ...defaultDataSourceSidePanel,
              },
            },
          },
          addTimeScope({ key: 'time_period', value: 'this season' })
        )
      ).toStrictEqual(expectedState);
    });

    test('it layers new config into existing state', () => {
      const expectedState = {
        ...MOCK_CHART_BUILDER,
        dataSourceSidePanel: {
          isOpen: true,
          widgetId: '1',
          dataSourceFormState: {
            ...defaultDataSourceSidePanel,
            time_scope: {
              time_period: 'last_x_days',
              time_period_length: 10,
            },
          },
        },
      };

      expect(
        chartBuilderReducer(
          {
            ...MOCK_CHART_BUILDER,
            dataSourceSidePanel: {
              isOpen: true,
              widgetId: '1',
              dataSourceFormState: {
                ...defaultDataSourceSidePanel,
                time_scope: {
                  time_period: 'last_x_days',
                },
              },
            },
          },
          addTimeScope({ key: 'time_period_length', value: 10 })
        )
      ).toStrictEqual(expectedState);
    });
  });

  test('updatePreviewChartData', () => {
    const expectedState = {
      ...MOCK_CHART_BUILDER,
      dataSourceSidePanel: {
        ...defaultDataSourceSidePanel,
        previewData: {
          time_scope: {
            time_period: 'last_x_days',
          },
        },
        dataSourceFormState: {
          time_scope: {
            time_period: 'last_x_days',
          },
        },
      },
    };
    expect(
      chartBuilderReducer(
        {
          ...MOCK_CHART_BUILDER,
          dataSourceSidePanel: {
            ...defaultDataSourceSidePanel,
            dataSourceFormState: {
              time_scope: {
                time_period: 'last_x_days',
              },
            },
          },
        },
        updatePreviewChartData()
      )
    ).toStrictEqual(expectedState);
  });

  test('updatePreviewChartData with payload: formattedState', () => {
    const mockFormattedState = {
      coding_system: 'ICD-10',
      subtypes: { subtype1: 'value1', subtype2: 'value2' },
    };

    const initialSourceState = {
      ...MOCK_CHART_BUILDER,
      dataSourceSidePanel: {
        ...defaultDataSourceSidePanel,
        dataSourceFormState: {
          time_scope: {
            time_period: 'last_x_days',
          },
        },
      },
    };

    const expectedState = {
      ...initialSourceState,
      dataSourceSidePanel: {
        ...initialSourceState.dataSourceSidePanel,
        previewData: mockFormattedState,
      },
    };

    expect(
      chartBuilderReducer(
        initialSourceState,
        updatePreviewChartData({ formattedState: mockFormattedState })
      )
    ).toStrictEqual(expectedState);
  });

  test('updatePreviewChartData without payload: formattedState', () => {
    const initialFormattedState = {
      ...MOCK_CHART_BUILDER,
      dataSourceSidePanel: {
        ...defaultDataSourceSidePanel,
        dataSourceFormState: {
          time_scope: {
            time_period: 'last_x_days',
          },
        },
      },
    };

    const expectedState = {
      ...initialFormattedState,
      dataSourceSidePanel: {
        ...initialFormattedState.dataSourceSidePanel,
        previewData: {
          time_scope: {
            time_period: 'last_x_days',
          },
        },
      },
    };

    expect(
      chartBuilderReducer(initialFormattedState, updatePreviewChartData())
    ).toStrictEqual(expectedState);
  });

  test('deleteChartElement()', () => {
    const widget = generateChartWidgetData();

    const expectedState = {
      ...MOCK_CHART_BUILDER,
      activeWidgets: {
        [widget.id]: {
          ...widget,
          widget: {
            ...widget.widget,
            chart_elements: [],
          },
        },
      },
      dataSourceSidePanel: {
        ...defaultDataSourceSidePanel,
      },
    };

    expect(
      chartBuilderReducer(
        {
          ...MOCK_CHART_BUILDER,
          activeWidgets: {
            [widget.id]: {
              ...widget,
              widget: {
                ...widget.widget,
                chart_elements: [MOCK_CHART_ELEMENTS[0]],
              },
            },
          },
          dataSourceSidePanel: {
            isOpen: true,
            mode: 'update',
            widgetId: widget.id,
            dataSourceFormState: {
              ...emptyDataSourceFormState,
              id: 1,
            },
          },
        },
        deleteChartElement()
      )
    ).toStrictEqual(expectedState);
  });

  describe('addDataSourceGroupingByIndex()', () => {
    it('sets the correct state at index 0', () => {
      const expectedState = {
        ...MOCK_CHART_BUILDER,
        dataSourceSidePanel: {
          ...defaultDataSourceSidePanel,
          dataSourceFormState: {
            ...emptyDataSourceFormState,
            config: {
              groupings: ['timestamp'],
            },
          },
        },
      };

      expect(
        chartBuilderReducer(
          {
            ...MOCK_CHART_BUILDER,
            dataSourceSidePanel: {
              ...defaultDataSourceSidePanel,
            },
          },
          addDataSourceGroupingByIndex({
            index: 0,
            grouping: 'timestamp',
          })
        )
      ).toStrictEqual(expectedState);
    });

    it('sets the correct state at index 1', () => {
      const expectedState = {
        ...MOCK_CHART_BUILDER,
        dataSourceSidePanel: {
          ...defaultDataSourceSidePanel,
          dataSourceFormState: {
            ...emptyDataSourceFormState,
            config: {
              groupings: ['timestamp', 'athlete_id'],
            },
          },
        },
      };

      expect(
        chartBuilderReducer(
          {
            ...MOCK_CHART_BUILDER,
            dataSourceSidePanel: {
              ...defaultDataSourceSidePanel,
              dataSourceFormState: {
                ...emptyDataSourceFormState,
                config: {
                  groupings: ['timestamp'],
                },
              },
            },
          },
          addDataSourceGroupingByIndex({
            index: 1,
            grouping: 'athlete_id',
          })
        )
      ).toStrictEqual(expectedState);
    });

    it('resets the state when editing grouping at index 0', () => {
      const expectedState = {
        ...MOCK_CHART_BUILDER,
        dataSourceSidePanel: {
          ...defaultDataSourceSidePanel,
          dataSourceFormState: {
            ...emptyDataSourceFormState,
            config: {
              groupings: ['timestamp'],
            },
          },
        },
      };

      expect(
        chartBuilderReducer(
          {
            ...MOCK_CHART_BUILDER,
            dataSourceSidePanel: {
              ...defaultDataSourceSidePanel,
              dataSourceFormState: {
                ...emptyDataSourceFormState,
                config: {
                  groupings: ['athlete_id'],
                },
              },
            },
          },
          addDataSourceGroupingByIndex({
            index: 0,
            grouping: 'timestamp',
          })
        )
      ).toStrictEqual(expectedState);
    });

    it('persists other config data', () => {
      const expectedState = {
        ...MOCK_CHART_BUILDER,
        dataSourceSidePanel: {
          ...defaultDataSourceSidePanel,
          dataSourceFormState: {
            ...emptyDataSourceFormState,
            config: {
              groupings: ['timestamp'],
              filters: {
                event_filters: ['game'],
              },
            },
          },
        },
      };

      expect(
        chartBuilderReducer(
          {
            ...MOCK_CHART_BUILDER,
            dataSourceSidePanel: {
              ...defaultDataSourceSidePanel,
              dataSourceFormState: {
                ...emptyDataSourceFormState,
                config: {
                  filters: {
                    event_filters: ['game'],
                  },
                },
              },
            },
          },
          addDataSourceGroupingByIndex({
            index: 0,
            grouping: 'timestamp',
          })
        )
      ).toStrictEqual(expectedState);
    });
  });

  test('deleteDataSourceGrouping', () => {
    const expectedState = {
      ...MOCK_CHART_BUILDER,
      dataSourceSidePanel: {
        ...defaultDataSourceSidePanel,
        dataSourceFormState: {
          ...emptyDataSourceFormState,
          config: {
            groupings: ['timestamp'],
            render_options: {
              stack_group_elements: undefined,
            },
          },
        },
      },
    };

    expect(
      chartBuilderReducer(
        {
          ...MOCK_CHART_BUILDER,
          dataSourceSidePanel: {
            ...defaultDataSourceSidePanel,
            dataSourceFormState: {
              ...emptyDataSourceFormState,
              config: {
                groupings: ['timestamp', 'athlete_id'],
                render_options: {
                  stack_group_elements: true,
                },
              },
            },
          },
        },
        deleteDataSourceGrouping()
      )
    ).toStrictEqual(expectedState);
  });

  describe('addFilter()', () => {
    it('sets the correct state', () => {
      const expectedState = {
        ...MOCK_CHART_BUILDER,
        dataSourceSidePanel: {
          ...defaultDataSourceSidePanel,
          dataSourceFormState: {
            ...emptyDataSourceFormState,
            config: {
              filters: {
                event_types: ['games'],
              },
            },
          },
        },
      };

      expect(
        chartBuilderReducer(
          {
            ...MOCK_CHART_BUILDER,
            dataSourceSidePanel: {
              ...defaultDataSourceSidePanel,
              dataSourceFormState: {
                ...emptyDataSourceFormState,
              },
            },
          },
          addFilter({ type: 'event_types', value: ['games'] })
        )
      ).toStrictEqual(expectedState);
    });

    it('persists other config data', () => {
      const expectedState = {
        ...MOCK_CHART_BUILDER,
        dataSourceSidePanel: {
          ...defaultDataSourceSidePanel,
          dataSourceFormState: {
            ...emptyDataSourceFormState,
            config: {
              groupings: ['timestamp'],
              filters: {
                event_types: ['games'],
                training_session_types: [1],
              },
            },
          },
        },
      };

      expect(
        chartBuilderReducer(
          {
            ...MOCK_CHART_BUILDER,
            dataSourceSidePanel: {
              ...defaultDataSourceSidePanel,
              dataSourceFormState: {
                ...emptyDataSourceFormState,
                config: {
                  groupings: ['timestamp'],
                  filters: {
                    event_types: ['games'],
                  },
                },
              },
            },
          },
          addFilter({ type: 'training_session_types', value: [1] })
        )
      ).toStrictEqual(expectedState);
    });
  });

  describe('addRenderOptions()', () => {
    it('sets the correct state', () => {
      const expectedState = {
        ...MOCK_CHART_BUILDER,
        dataSourceSidePanel: {
          ...defaultDataSourceSidePanel,
          dataSourceFormState: {
            ...emptyDataSourceFormState,
            config: {
              render_options: {
                name: 'New Chart',
              },
            },
          },
        },
      };

      expect(
        chartBuilderReducer(
          {
            ...MOCK_CHART_BUILDER,
            dataSourceSidePanel: {
              ...defaultDataSourceSidePanel,
              dataSourceFormState: {
                ...emptyDataSourceFormState,
              },
            },
          },
          addRenderOptions({ key: 'name', value: 'New Chart' })
        )
      ).toStrictEqual(expectedState);
    });

    it('persists other config data', () => {
      const expectedState = {
        ...MOCK_CHART_BUILDER,
        dataSourceSidePanel: {
          ...defaultDataSourceSidePanel,
          dataSourceFormState: {
            ...emptyDataSourceFormState,
            config: {
              groupings: ['timestamp'],
              render_options: {
                name: 'New Chart',
              },
            },
          },
        },
      };

      expect(
        chartBuilderReducer(
          {
            ...MOCK_CHART_BUILDER,
            dataSourceSidePanel: {
              ...defaultDataSourceSidePanel,
              dataSourceFormState: {
                ...emptyDataSourceFormState,
                config: {
                  groupings: ['timestamp'],
                },
              },
            },
          },
          addRenderOptions({ key: 'name', value: 'New Chart' })
        )
      ).toStrictEqual(expectedState);
    });
  });

  it('setSidePanelSource', () => {
    const expectedState = {
      ...MOCK_CHART_BUILDER,
      dataSourceSidePanel: {
        ...defaultDataSourceSidePanel,
        sidePanelSource: 'metric',
        dataSourceFormState: {
          ...emptyDataSourceFormState,
        },
      },
    };

    expect(
      chartBuilderReducer(
        {
          ...MOCK_CHART_BUILDER,
          dataSourceSidePanel: {
            ...defaultDataSourceSidePanel,
          },
        },
        setSidePanelSource('metric')
      )
    ).toStrictEqual(expectedState);
  });

  describe('updateFormStateType()', () => {
    it('should update the dataSourceFormState type correctly', () => {
      const expectedState = {
        ...MOCK_CHART_BUILDER,
        dataSourceSidePanel: {
          ...defaultDataSourceSidePanel,
          dataSourceFormState: {
            ...emptyDataSourceFormState,
            type: 'MedicalIllness',
            data_source_type: 'MedicalIllness',
            input_params: { subtypes: {} },
          },
        },
      };

      expect(
        chartBuilderReducer(
          {
            ...MOCK_CHART_BUILDER,
            dataSourceSidePanel: {
              ...defaultDataSourceSidePanel,
              dataSourceFormState: {
                ...emptyDataSourceFormState,
              },
            },
          },
          updateFormStateType('MedicalIllness')
        )
      ).toStrictEqual(expectedState);
    });
  });

  describe('setDataSourceSubtype()', () => {
    it('should set the data_source_type and subtypes correctly', () => {
      const actionPayload = {
        data: {
          subtypeKey: 'activity_group_ids',
          value: [2, 3, 4, 9],
        },
      };

      const expectedState = {
        ...MOCK_CHART_BUILDER,
        dataSourceSidePanel: {
          ...defaultDataSourceSidePanel,
          dataSourceFormState: {
            ...emptyDataSourceFormState,
            input_params: {
              ...emptyDataSourceFormState.input_params,
              subtypes: {
                activity_group_ids: [2, 3, 4, 9],
              },
            },
          },
        },
      };

      expect(
        chartBuilderReducer(
          {
            ...MOCK_CHART_BUILDER,
            dataSourceSidePanel: {
              ...defaultDataSourceSidePanel,
              dataSourceFormState: {
                ...emptyDataSourceFormState,
                input_params: {
                  subtypes: {},
                },
              },
            },
          },
          setDataSourceSubtype(actionPayload)
        )
      ).toStrictEqual(expectedState);
    });
  });

  describe('updateChartName()', () => {
    it('updates the widget name correctly', () => {
      const widgetId = '123';

      const initialChartState = {
        ...MOCK_CHART_BUILDER,
        activeWidgets: {
          [widgetId]: {
            widget: {
              name: 'Old Name',
            },
          },
        },
      };

      const expectedState = {
        ...MOCK_CHART_BUILDER,
        activeWidgets: {
          [widgetId]: {
            widget: {
              name: 'New Name',
            },
          },
        },
      };

      expect(
        chartBuilderReducer(
          initialChartState,
          updateChartName({
            widgetId,
            name: 'New Name',
          })
        )
      ).toStrictEqual(expectedState);
    });
  });

  test('updateChartConfig() - initializes config for a new chart ID', () => {
    const chartId = 123;
    const newConfig = { show_labels: true };

    const expectedState = {
      ...MOCK_CHART_BUILDER,
      [chartId]: {
        config: newConfig,
      },
    };

    expect(
      chartBuilderReducer(
        { ...MOCK_CHART_BUILDER },
        updateChartConfig({
          chartId,
          partialConfig: newConfig,
        })
      )
    ).toStrictEqual(expectedState);
  });

  test('refreshChartElements', () => {
    const widget = generateChartWidgetData();

    const expectedState = {
      ...MOCK_CHART_BUILDER,
      dataSourceSidePanel: {
        widgetId: widget.id,
      },
      activeWidgets: {
        [`${widget.id}`]: {
          ...widget,
          widget: {
            ...widget.widget,
            chart_elements: [...MOCK_CHART_ELEMENTS],
          },
        },
      },
    };

    expect(
      chartBuilderReducer(
        {
          ...MOCK_CHART_BUILDER,
          dataSourceSidePanel: {
            widgetId: widget.id,
          },
          activeWidgets: {
            [`${widget.id}`]: {
              ...widget,
              widget: {
                ...widget.widget,
                chart_elements: [],
              },
            },
          },
        },
        refreshChartElements({
          chartElements: MOCK_CHART_ELEMENTS,
        })
      )
    ).toStrictEqual(expectedState);
  });

  test('refreshInvalidChartElementMap', () => {
    const widget = generateChartWidgetData();

    const expectedState = {
      ...MOCK_CHART_BUILDER,
      dataSourceSidePanel: {
        widgetId: widget.id,
      },
      activeWidgets: {
        [`${widget.id}`]: {
          ...widget,
          widget: {
            ...widget.widget,
            config: {
              ...widget.widget.config,
              invalid_chart_elements: { 1: ['invalidGroping'] },
            },
          },
        },
      },
    };

    expect(
      chartBuilderReducer(
        {
          ...MOCK_CHART_BUILDER,
          dataSourceSidePanel: {
            widgetId: widget.id,
          },
          activeWidgets: {
            [`${widget.id}`]: {
              ...widget,
              widget: {
                ...widget.widget,
              },
            },
          },
        },
        refreshInvalidChartElementMap({
          widgetId: widget.id,
          invalidChartElementMap: { 1: ['invalidGroping'] },
        })
      )
    ).toStrictEqual(expectedState);
  });

  test('updateLoaderLevel', () => {
    const widget = generateChartWidgetData();

    const expectedState = {
      ...MOCK_CHART_BUILDER,
      dataSourceSidePanel: {
        widgetId: widget.id,
      },
      activeWidgets: {
        [`${widget.id}`]: {
          ...widget,
        },
      },
      loaderLevelMap: {
        [`${widget.id}`]: 1,
      },
    };

    expect(
      chartBuilderReducer(
        {
          ...MOCK_CHART_BUILDER,
          dataSourceSidePanel: {
            widgetId: widget.id,
          },
          activeWidgets: {
            [`${widget.id}`]: {
              ...widget,
            },
          },
        },
        updateLoaderLevel({
          widgetId: widget.id,
          loaderLevel: 1,
        })
      )
    ).toStrictEqual(expectedState);
  });

  test('updateCachedAt', () => {
    const widget = generateChartWidgetData();

    const expectedState = {
      ...MOCK_CHART_BUILDER,
      dataSourceSidePanel: {
        widgetId: widget.id,
      },
      activeWidgets: {
        [`${widget.id}`]: {
          ...widget,
        },
      },
      cachedAtMap: {
        [`${widget.id}`]: ['2025-06-18T14:49:51.000+01:00'],
      },
    };

    expect(
      chartBuilderReducer(
        {
          ...MOCK_CHART_BUILDER,
          dataSourceSidePanel: {
            widgetId: widget.id,
          },
          activeWidgets: {
            [`${widget.id}`]: {
              ...widget,
            },
          },
        },
        updateCachedAt({
          widgetId: widget.id,
          cachedAt: ['2025-06-18T14:49:51.000+01:00'],
        })
      )
    ).toStrictEqual(expectedState);
  });

  test('updateChartConfig()', () => {
    const chartId = 123;
    const updateConfig = { aggregation_period: 'monthly' };

    const expectedState = {
      ...MOCK_CHART_BUILDER,
      [chartId]: {
        config: {
          ...updateConfig,
        },
      },
    };

    expect(
      chartBuilderReducer(
        initialState,
        updateChartConfig({
          chartId,
          partialConfig: updateConfig,
        })
      )
    ).toStrictEqual(expectedState);
  });

  describe('refreshWidgetCache()', () => {
    it('should set refreshCache value for the given widgetId', () => {
      const widgetId = 123;
      const expectedState = {
        ...MOCK_CHART_BUILDER,
        refreshWidgetCacheMap: {
          [widgetId]: true,
        },
      };

      expect(
        chartBuilderReducer(
          {
            ...MOCK_CHART_BUILDER,
            refreshWidgetCacheMap: undefined,
          },
          refreshWidgetCache({ widgetId, refreshCache: true })
        )
      ).toStrictEqual(expectedState);
    });

    it('should update the refreshCache value for an existing widgetId', () => {
      const widgetId = 345;
      const initialCacheState = {
        ...MOCK_CHART_BUILDER,
        refreshWidgetCacheMap: {
          [widgetId]: true,
        },
      };

      const expectedState = {
        ...MOCK_CHART_BUILDER,
        refreshWidgetCacheMap: {
          [widgetId]: false,
        },
      };

      expect(
        chartBuilderReducer(
          initialCacheState,
          refreshWidgetCache({ widgetId, refreshCache: false })
        )
      ).toStrictEqual(expectedState);
    });
  });

  describe('toggleChartFormattingPanel', () => {
    test('it opens side panel when passed but does not parse existing formats when none exist', () => {
      const expectedState = {
        ...MOCK_CHART_BUILDER,
        dataSourceSidePanel: {
          ...defaultDataSourceSidePanel,
          dataSourceFormState: {
            ...emptyDataSourceFormState,
          },
        },
        chartFormattingPanel: {
          isOpen: true,
          appliedFormat: [],
        },
      };

      expect(
        chartBuilderReducer(
          {
            ...MOCK_CHART_BUILDER,
            dataSourceSidePanel: {
              ...defaultDataSourceSidePanel,
              dataSourceFormState: {
                ...emptyDataSourceFormState,
              },
            },
          },
          toggleChartFormattingPanel({ isOpen: true })
        )
      ).toStrictEqual(expectedState);
    });

    test('it opens side panel when passed and parses existing formats when they exist', () => {
      const expectedState = {
        ...MOCK_CHART_BUILDER,
        dataSourceSidePanel: {
          ...defaultDataSourceSidePanel,
          dataSourceFormState: {
            ...emptyDataSourceFormState,
            config: {
              ...emptyDataSourceFormState.config,
              render_options: {
                conditional_formatting: [
                  {
                    type: 'zone',
                    condition: 'greater_than',
                    value: '200',
                    color: colors.green_100,
                    label: 'High performance',
                  },
                ],
              },
            },
          },
        },
        chartFormattingPanel: {
          isOpen: true,
          appliedFormat: [
            {
              type: 'zone',
              condition: 'greater_than',
              value: '200',
              color: colors.green_100,
              label: 'High performance',
            },
          ],
        },
      };

      expect(
        chartBuilderReducer(
          {
            ...MOCK_CHART_BUILDER,
            dataSourceSidePanel: {
              ...defaultDataSourceSidePanel,
              dataSourceFormState: {
                ...emptyDataSourceFormState,
                config: {
                  ...emptyDataSourceFormState.config,
                  render_options: {
                    conditional_formatting: [
                      {
                        type: 'zone',
                        condition: 'greater_than',
                        value: '200',
                        color: colors.green_100,
                        label: 'High performance',
                      },
                    ],
                  },
                },
              },
            },
          },
          toggleChartFormattingPanel({ isOpen: true })
        )
      ).toStrictEqual(expectedState);
    });

    test('it closes side panel when passed and resets appliedFormat to []', () => {
      const expectedState = {
        ...MOCK_CHART_BUILDER,
        dataSourceSidePanel: {
          ...defaultDataSourceSidePanel,
          dataSourceFormState: {
            ...emptyDataSourceFormState,
          },
        },
        chartFormattingPanel: {
          isOpen: false,
          appliedFormat: [],
        },
      };

      expect(
        chartBuilderReducer(
          {
            ...MOCK_CHART_BUILDER,
            dataSourceSidePanel: {
              ...defaultDataSourceSidePanel,
              dataSourceFormState: {
                ...emptyDataSourceFormState,
              },
            },
            chartFormattingPanel: {
              isOpen: true,
              appliedFormat: [
                {
                  type: 'zone',
                  condition: 'greater_than',
                  value: '200',
                  color: colors.green_100,
                  label: 'High performance',
                },
              ],
            },
          },
          toggleChartFormattingPanel({ isOpen: false })
        )
      ).toStrictEqual(expectedState);
    });
  });

  test('addFormattingRule()', () => {
    const expectedState = {
      ...MOCK_CHART_BUILDER,
      dataSourceSidePanel: {
        ...defaultDataSourceSidePanel,
      },
      chartFormattingPanel: {
        isOpen: true,
        appliedFormat: [
          {
            type: null,
            condition: null,
            value: null,
            color: colors.red_100_20,
          },
        ],
      },
    };

    expect(
      chartBuilderReducer(
        {
          ...MOCK_CHART_BUILDER,
          dataSourceSidePanel: {
            ...defaultDataSourceSidePanel,
          },
          chartFormattingPanel: {
            isOpen: true,
            appliedFormat: [],
          },
        },
        addFormattingRule()
      )
    ).toStrictEqual(expectedState);
  });

  test('removeFormattingRule()', () => {
    const expectedState = {
      ...MOCK_CHART_BUILDER,
      dataSourceSidePanel: {
        ...defaultDataSourceSidePanel,
      },
      chartFormattingPanel: {
        isOpen: true,
        appliedFormat: [
          {
            type: 'zone',
            condition: 'greater_than',
            value: '200',
            color: colors.green_100,
            label: 'High performance',
          },
        ],
      },
    };

    expect(
      chartBuilderReducer(
        {
          ...MOCK_CHART_BUILDER,
          dataSourceSidePanel: {
            ...defaultDataSourceSidePanel,
          },
          chartFormattingPanel: {
            isOpen: true,
            appliedFormat: [
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
            ],
          },
        },
        removeFormattingRule({ index: 1 })
      )
    ).toStrictEqual(expectedState);
  });

  describe('addFormattingOption()', () => {
    it('sets the correct state for key "type"', () => {
      const expectedState = {
        ...MOCK_CHART_BUILDER,
        dataSourceSidePanel: {
          ...defaultDataSourceSidePanel,
        },
        chartFormattingPanel: {
          isOpen: true,
          appliedFormat: [
            {
              type: 'zone',
              condition: null,
              value: null,
              color: colors.red_100_20,
            },
          ],
        },
      };

      expect(
        chartBuilderReducer(
          {
            ...MOCK_CHART_BUILDER,
            dataSourceSidePanel: {
              ...defaultDataSourceSidePanel,
            },
            chartFormattingPanel: {
              isOpen: true,
              appliedFormat: [
                {
                  type: null,
                  condition: null,
                  value: null,
                  color: colors.red_100_20,
                },
              ],
            },
          },
          addFormattingOption({ key: 'type', value: 'zone', index: 0 })
        )
      ).toStrictEqual(expectedState);
    });

    it('sets the correct state for key "condition"', () => {
      const expectedState = {
        ...MOCK_CHART_BUILDER,
        dataSourceSidePanel: {
          ...defaultDataSourceSidePanel,
        },
        chartFormattingPanel: {
          isOpen: true,
          appliedFormat: [
            {
              type: 'zone',
              condition: 'less_than',
              value: null,
              color: colors.red_100_20,
            },
          ],
        },
      };

      expect(
        chartBuilderReducer(
          {
            ...MOCK_CHART_BUILDER,
            dataSourceSidePanel: {
              ...defaultDataSourceSidePanel,
            },
            chartFormattingPanel: {
              isOpen: true,
              appliedFormat: [
                {
                  type: 'zone',
                  condition: null,
                  value: null,
                  color: colors.red_100_20,
                },
              ],
            },
          },
          addFormattingOption({
            key: 'condition',
            value: 'less_than',
            index: 0,
          })
        )
      ).toStrictEqual(expectedState);
    });

    it('sets the correct state for key "value"', () => {
      const expectedState = {
        ...MOCK_CHART_BUILDER,
        dataSourceSidePanel: {
          ...defaultDataSourceSidePanel,
        },
        chartFormattingPanel: {
          isOpen: true,
          appliedFormat: [
            {
              type: 'zone',
              condition: 'less_than',
              value: '10',
              color: colors.red_100_20,
            },
          ],
        },
      };

      expect(
        chartBuilderReducer(
          {
            ...MOCK_CHART_BUILDER,
            dataSourceSidePanel: {
              ...defaultDataSourceSidePanel,
            },
            chartFormattingPanel: {
              isOpen: true,
              appliedFormat: [
                {
                  type: 'zone',
                  condition: 'less_than',
                  value: null,
                  color: colors.red_100_20,
                },
              ],
            },
          },
          addFormattingOption({
            key: 'value',
            value: '10',
            index: 0,
          })
        )
      ).toStrictEqual(expectedState);
    });

    it('sets the correct state for key "color"', () => {
      const expectedState = {
        ...MOCK_CHART_BUILDER,
        dataSourceSidePanel: {
          ...defaultDataSourceSidePanel,
        },
        chartFormattingPanel: {
          isOpen: true,
          appliedFormat: [
            {
              type: 'zone',
              condition: 'less_than',
              value: '10',
              color: colors.blue_100,
            },
          ],
        },
      };

      expect(
        chartBuilderReducer(
          {
            ...MOCK_CHART_BUILDER,
            dataSourceSidePanel: {
              ...defaultDataSourceSidePanel,
            },
            chartFormattingPanel: {
              isOpen: true,
              appliedFormat: [
                {
                  type: 'zone',
                  condition: 'less_than',
                  value: '10',
                  color: colors.red_100_20,
                },
              ],
            },
          },
          addFormattingOption({
            key: 'color',
            value: colors.blue_100,
            index: 0,
          })
        )
      ).toStrictEqual(expectedState);
    });
  });
});
