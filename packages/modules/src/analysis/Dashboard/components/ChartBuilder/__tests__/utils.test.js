import { EMPTY_SELECTION } from '@kitman/components/src/Athletes/constants';
import { SERIES_TYPES } from '@kitman/modules/src/analysis/shared/components/XYChart/constants';
import { CHART_TYPE } from '@kitman/modules/src/analysis/Dashboard/components/ChartWidget/types';
import {
  getCoreChartTypes,
  getVisualisationOptions,
  getPieVisualisationOptions,
  getPieDefaultSeriesType,
  getAvailableVisualisationOptions,
  formatChartElementServerResponse,
  formatGetDataParams,
  isChartEmpty,
  isValueChartValid,
  isXYChartValid,
  isSidePanelButtonDisabled,
  isAddDataEnabled,
  isInvalidGame,
  isPivotEnabled,
  isChartLongitudinal,
  isParticipationBlockInvalid,
  getNewChartTitle,
  getNewChartTitleOnRemove,
  synchronizeChartGrouping,
  getDefaultSeriesType,
  isSubArray,
  applyErrorState,
  removeErrorState,
  formatFormulaDetails,
  getCheckboxChartOptions,
  getDefaultChartOptionsAsObject,
  orderGroupings,
  getDefaultAxisConfig,
} from '../utils';
// eslint-disable-next-line jest/no-mocks-import
import {
  generateChartElement,
  generateChartWidget,
  MOCK_CHART_ELEMENTS,
  MOCK_CHART_ELEMENT_SERVER_RESPONSE,
} from '../../../redux/__mocks__/chartBuilder';

const dataSource = {
  population: { ...EMPTY_SELECTION, athletes: [1] },
  input_params: {
    variable: 'age',
    source: 'kitman',
  },
  calculation: 'sum',
  time_scope: {
    time_period: 'this_season',
  },
};

const xyDataSource = {
  ...dataSource,
  config: {
    groupings: ['athlete'],
    render_options: {
      type: 'column',
    },
  },
};

describe('analysis dashbord | ChartBuilder utils', () => {
  afterAll(() => {
    window.featureFlags = {};
  });

  describe('getCoreChartTypes', () => {
    it('does not contain pie as an option when rep-charts-pie-donut is false', () => {
      window.setFlag('rep-charts-pie-donut', false);
      const coreChartTypes = getCoreChartTypes().map(({ type }) => type);

      expect(coreChartTypes.includes(CHART_TYPE.pie)).toBe(false);
    });

    it('contains pie as an option when rep-charts-pie-donut is true', () => {
      window.setFlag('rep-charts-pie-donut', true);
      const coreChartTypes = getCoreChartTypes().map(({ type }) => type);

      expect(coreChartTypes.includes(CHART_TYPE.pie)).toBe(true);
    });
  });

  describe('getAvailableVisualisationOptions', () => {
    const defaultVisualisationOptions = getVisualisationOptions();

    it('returns default visualisationOptions when there are no chart elements', () => {
      expect(getAvailableVisualisationOptions([])).toStrictEqual(
        defaultVisualisationOptions
      );
    });

    it('returns default visualisationOptions when chart elements does not contain a bar series', () => {
      const mockChartElement = {
        ...MOCK_CHART_ELEMENTS[0],
        config: {
          render_options: {
            type: 'line',
          },
        },
      };
      expect(
        getAvailableVisualisationOptions([mockChartElement])
      ).toStrictEqual(defaultVisualisationOptions);
    });

    it('returns visualisationOptions with bar disabled when chart elements does contain a bar series', () => {
      const mockChartElement = {
        ...MOCK_CHART_ELEMENTS[0],
        config: {
          render_options: {
            type: 'bar',
          },
        },
      };

      const expectedVisualisationOptions = [
        {
          // bar option
          ...defaultVisualisationOptions[0],
          isEnabled: false,
        },
        ...defaultVisualisationOptions.slice(1),
      ];

      expect(
        getAvailableVisualisationOptions([mockChartElement])
      ).toStrictEqual(expectedVisualisationOptions);
    });
  });

  describe('on area chart selection', () => {
    it('returns default visualisationOptions when there are no chart elements', () => {
      const defaultVisualisationOptions = getVisualisationOptions();

      expect(getAvailableVisualisationOptions([])).toStrictEqual(
        defaultVisualisationOptions
      );
    });

    it('returns default visualisationOptions when chart elements does not contain area or bar series', () => {
      const defaultVisualisationOptions = getVisualisationOptions();
      const mockChartElement = {
        ...MOCK_CHART_ELEMENTS[0],
        config: {
          render_options: {
            type: 'line',
          },
        },
      };
      expect(
        getAvailableVisualisationOptions([mockChartElement])
      ).toStrictEqual(defaultVisualisationOptions);
    });

    it('returns visualisationOptions with area disabled when chart elements does contain an area series', () => {
      const defaultVisualisationOptions = getVisualisationOptions();
      const mockChartElement = {
        ...MOCK_CHART_ELEMENTS[0],
        config: {
          render_options: {
            type: 'area',
          },
        },
      };

      const expectedVisualisationOptions = [
        defaultVisualisationOptions[0],
        defaultVisualisationOptions[1],
        {
          // area option
          ...defaultVisualisationOptions[2],
          isEnabled: false,
        },
      ];

      expect(
        getAvailableVisualisationOptions([mockChartElement])
      ).toStrictEqual(expectedVisualisationOptions);
    });
  });

  describe('getPieDefaultSeriesType', () => {
    it('returns the first pie visualisation value', () => {
      expect(getPieDefaultSeriesType()).toEqual(
        getPieVisualisationOptions()[0].value
      );
    });
  });

  describe('isChartEmpty', () => {
    it('returns true if chart_elements is empty or undefined', () => {
      expect(isChartEmpty({})).toBe(true);
      expect(isChartEmpty(generateChartWidget())).toBe(true);
    });

    it('returns false if chart_elements are present', () => {
      expect(
        isChartEmpty(
          generateChartWidget({ chart_elements: [generateChartElement()] })
        )
      ).toBe(false);
    });
  });

  // invalid core elements can be reused across all chart types for testing
  const renderInvalidCoreElements = (utilFunc) => {
    it('should return false when calculation is not defined', () => {
      expect(utilFunc({ ...dataSource, calculation: undefined })).toBe(false);
    });

    it('should return false when input_params is not defined', () => {
      expect(utilFunc({ ...dataSource, input_params: {} })).toBe(false);
    });

    it('should return false when population equals EMPTY_SELECTION', () => {
      expect(
        utilFunc({
          ...dataSource,
          population: { ...EMPTY_SELECTION },
        })
      ).toBe(false);
    });

    it('should return false when time_scope is undefined', () => {
      expect(
        utilFunc({
          ...dataSource,
          time_scope: { time_period: null },
        })
      ).toBe(false);
    });
  };

  describe('isInvalidGame', () => {
    it('returns false when not a GameActivity datasource', () => {
      expect(isInvalidGame({ data_source_type: 'Not a Game' })).toBe(false);
    });

    it('returns false if it is position change kind and has position ids', () => {
      expect(
        isInvalidGame({
          data_source_type: 'GameActivity',
          input_params: { kinds: ['position_change'], position_ids: [1, 2] },
        })
      ).toBe(false);
    });

    it('returns false if kinds is populated without position change', () => {
      expect(
        isInvalidGame({
          data_source_type: 'GameActivity',
          input_params: { kinds: ['assist'] },
        })
      ).toBe(false);
    });

    it('returns true if there are not kind input params', () => {
      expect(
        isInvalidGame({
          data_source_type: 'GameActivity',
          input_params: { kinds: [] },
        })
      ).toBe(true);
    });

    it('returns true if its a position change kind, but no position ids are submitted', () => {
      expect(
        isInvalidGame({
          data_source_type: 'GameActivity',
          input_params: { kinds: ['position_change'], position_ids: [] },
        })
      ).toBe(true);
    });

    it('returns true if it is a formation change kind, but no formation ids are submitted', () => {
      expect(
        isInvalidGame({
          data_source_type: 'GameActivity',
          input_params: { kinds: ['formation_change'], formation_ids: [] },
        })
      ).toBe(true);
    });

    it('returns false if it is a formation change kind, and formation ids are submitted', () => {
      expect(
        isInvalidGame({
          data_source_type: 'GameActivity',
          input_params: { kinds: ['formation_change'], formation_ids: [68] },
        })
      ).toBe(false);
    });
  });

  describe('isParticipationBlockInvalid', () => {
    it('returns false when not a ParticipationLevel datasource', () => {
      expect(
        isParticipationBlockInvalid({
          data_source_type: 'Not a Participation Level',
        })
      ).toBe(false);
    });

    it('returns false if status is not participation_levels', () => {
      expect(
        isParticipationBlockInvalid({
          data_source_type: 'ParticipationLevel',
          input_params: {
            status: 'participation_status',
            participation_level_ids: [],
          },
        })
      ).toBe(false);
    });

    it('returns false if status is participation_levels and ids are submitted', () => {
      expect(
        isParticipationBlockInvalid({
          data_source_type: 'ParticipationLevel',
          input_params: {
            status: 'participation_levels',
            participation_level_ids: [3859],
          },
        })
      ).toBe(false);
    });

    it('returns true if status is participation_levels, but no ids are submitted', () => {
      expect(
        isParticipationBlockInvalid({
          data_source_type: 'ParticipationLevel',
          input_params: {
            status: 'participation_levels',
            participation_level_ids: [],
          },
        })
      ).toBe(true);
    });
  });

  describe('isValueChartValid', () => {
    describe('when value chart is not valid', () => {
      renderInvalidCoreElements(isValueChartValid);
    });

    describe('when value chart is valid', () => {
      it('should return true', () => {
        expect(isValueChartValid(dataSource)).toBe(true);
      });
    });
  });

  describe('isXYChartValid', () => {
    describe('when XY chart is not valid', () => {
      renderInvalidCoreElements(isXYChartValid);

      it('returns false when grouping is not defined', () => {
        expect(
          isXYChartValid({
            ...xyDataSource,
            config: { groupings: [] },
          })
        ).toBe(false);
      });

      it('returns false when render_options.type is not defined', () => {
        expect(
          isXYChartValid({
            ...xyDataSource,
            config: { render_options: {} },
          })
        ).toBe(false);
      });

      it('returns false when input_params is empty', () => {
        expect(
          isXYChartValid({
            ...xyDataSource,
            input_params: {},
            config: { render_options: {} },
          })
        ).toBe(false);
      });
    });

    describe('when XY chart is valid', () => {
      it('should return true', () => {
        expect(isValueChartValid(xyDataSource)).toBe(true);
      });

      it('returns true when data_source_type === MedicalInjury and input_params is empty', () => {
        expect(
          isValueChartValid({
            ...xyDataSource,
            input_params: {},
            data_source_type: 'MedicalInjury',
          })
        ).toBe(true);
      });

      it('returns true when data_source_type === MedicalIllness and input_params is empty', () => {
        expect(
          isValueChartValid({
            ...xyDataSource,
            input_params: {},
            data_source_type: 'MedicalIllness',
          })
        ).toBe(true);
      });

      it('returns true when data_source_type === RehabSessionExercise and input_params is empty', () => {
        expect(
          isValueChartValid({
            ...xyDataSource,
            input_params: {},
            data_source_type: 'RehabSessionExercise',
          })
        ).toBe(true);
      });
    });
  });

  describe('isSidePanelButtonDisabled', () => {
    describe('when chart type is value', () => {
      it('should return true when dataSource has incomplete data', () => {
        expect(
          isSidePanelButtonDisabled('value', {
            ...dataSource,
            input_params: {},
          })
        ).toBe(true);
      });

      it('should return false when dataSource has complete data', () => {
        expect(isSidePanelButtonDisabled('value', { ...dataSource })).toBe(
          false
        );
      });
    });

    describe('when chart type is xy', () => {
      it('should return true when dataSource has incomplete data', () => {
        expect(
          isSidePanelButtonDisabled('xy', {
            ...dataSource,
            config: {},
          })
        ).toBe(true);
      });

      it('should return false when dataSource has complete data', () => {
        expect(isSidePanelButtonDisabled('xy', { ...xyDataSource })).toBe(
          false
        );
      });
    });
  });

  describe('isAddDataEnabled', () => {
    describe('when chart type is value', () => {
      it('returns true when no chart_elements are configured', () => {
        expect(isAddDataEnabled(CHART_TYPE.value, [])).toBe(true);
      });

      it('returns false when at least one chart_element is configured', () => {
        expect(
          isAddDataEnabled(CHART_TYPE.value, [MOCK_CHART_ELEMENTS[0]])
        ).toBe(false);
      });
    });

    describe('when chart type is xy', () => {
      beforeEach(() => {
        window.setFlag('rep-charts-configure-axis', false);
      });

      it('returns true always when rep-xy-charts-formula feature flag is enabled', () => {
        window.setFlag('rep-charts-configure-axis', true);

        expect(isAddDataEnabled(CHART_TYPE.xy, [])).toBe(true); // 0
        expect(isAddDataEnabled(CHART_TYPE.xy, [MOCK_CHART_ELEMENTS[0]])).toBe(
          true
        ); // 1
        expect(isAddDataEnabled(CHART_TYPE.xy, MOCK_CHART_ELEMENTS)).toBe(true); // 2
        expect(
          isAddDataEnabled(CHART_TYPE.xy, [
            ...MOCK_CHART_ELEMENTS,
            MOCK_CHART_ELEMENTS[0],
          ])
        ).toBe(true); // 3
      });

      it('returns true when less than two chart_elements are configured', () => {
        expect(isAddDataEnabled(CHART_TYPE.xy, [])).toBe(true); // 0
        expect(isAddDataEnabled(CHART_TYPE.xy, [MOCK_CHART_ELEMENTS[0]])).toBe(
          true
        ); // 1
      });

      it('returns false when at least two chart_elements are configured', () => {
        expect(isAddDataEnabled(CHART_TYPE.xy, MOCK_CHART_ELEMENTS)).toBe(
          false
        ); // 2
        expect(
          isAddDataEnabled(CHART_TYPE.xy, [
            ...MOCK_CHART_ELEMENTS,
            MOCK_CHART_ELEMENTS[0],
          ])
        ).toBe(false); // 3
      });

      it('returns true when no chart_elements are configured', () => {
        expect(isAddDataEnabled(CHART_TYPE.xy, [])).toBe(true); // 0
      });
    });

    describe('when chart type is pie', () => {
      it('returns true when no chart_elements are configured', () => {
        expect(isAddDataEnabled(CHART_TYPE.pie, [])).toBe(true);
      });

      it('returns false when at least one chart_element is configured', () => {
        expect(isAddDataEnabled(CHART_TYPE.pie, [MOCK_CHART_ELEMENTS[0]])).toBe(
          false
        );
      });
    });
  });

  describe('formatChartElementServerResponse', () => {
    const expectedResult = {
      id: 20,
      population: {
        applies_to_squad: false,
        all_squads: false,
        athletes: [],
        positions: [],
        position_groups: [],
        squads: [8],
        context_squads: [],
        users: [],
      },
      data_source_type: 'TableMetric',
      input_params: {
        source: 'kitman',
        variable: 'game_minutes',
      },
      calculation: 'mean',
      overlays: null,
      time_scope: {
        time_period: 'last_x_days',
        start_time: null,
        end_time: null,
        time_period_length: 365,
        time_period_length_offset: null,
        config: null,
      },
      config: null,
    };
    it('formats the data correctly', () => {
      expect(
        formatChartElementServerResponse(MOCK_CHART_ELEMENT_SERVER_RESPONSE)
      ).toStrictEqual(expectedResult);
    });
  });

  describe('isPivotEnabled', () => {
    it('returns false when providing no pivotedPopulation and no pivotedTimePeriod', () => {
      expect(isPivotEnabled({})).toBe(false);
    });

    it('returns false when providing undefined pivotedTimePeriod and empty pivotedPopulation', () => {
      expect(
        isPivotEnabled({
          pivotedPopulation: {
            applies_to_squad: false,
            all_squads: false,
            position_groups: [],
            positions: [],
            athletes: [],
            squads: [],
          },
          pivotedTimePeriod: undefined,
        })
      ).toBe(false);
    });

    it('returns true when providing a  pivotedPopulation', () => {
      expect(
        isPivotEnabled({
          pivotedPopulation: {
            applies_to_squad: false,
            all_squads: false,
            position_groups: [],
            positions: [],
            athletes: [8],
            squads: [],
          },
        })
      ).toBe(true);
    });

    it('returns true when providing a pivotedTimePeriod', () => {
      expect(
        isPivotEnabled({
          pivotedTimePeriod: 'this_week',
        })
      ).toBe(true);
    });
  });

  describe('formatGetDataParams', () => {
    describe('when pivot is not enabled', () => {
      it('returns the correct format when chart_elements = []', () => {
        const widget = generateChartWidget({ chart_elements: [] });

        expect(formatGetDataParams(widget, {})).toStrictEqual(widget);
      });

      it('returns the correct format when chart_elements length >= 1', () => {
        const chartElement = generateChartElement({
          overlays: null,
          type: 'Medical',
        });
        const widget = generateChartWidget({ chart_elements: [chartElement] });

        const expected = {
          ...widget,
          chart_elements: [
            {
              calculation: chartElement.calculation,
              config: chartElement.config,
              data_source_type: chartElement.data_source_type,
              input_params: chartElement.input_params,
              population: chartElement.population,
              time_scope: chartElement.time_scope,
              overlays: chartElement.overlays,
            },
          ],
        };

        expect(formatGetDataParams(widget, {})).toStrictEqual(expected);
      });
    });

    describe('when pivot is enabled', () => {
      it('returns the correct format when chart_elements length >= 1 with pivoted variables', () => {
        const chartElement = generateChartElement({
          overlays: null,
          type: 'Medical',
        });
        const widget = generateChartWidget({ chart_elements: [chartElement] });

        const pivotedPopulation = {
          applies_to_squad: false,
          all_squads: false,
          position_groups: [],
          positions: [],
          athletes: [8],
          squads: [],
        };

        const pivotedTimePeriod = 'last_x_days';

        const pivotedTimePeriodLength = '10';

        const expected = {
          ...widget,
          chart_elements: [
            {
              calculation: chartElement.calculation,
              config: chartElement.config,
              data_source_type: chartElement.data_source_type,
              input_params: chartElement.input_params,
              population: {
                ...pivotedPopulation,
                context_squads: chartElement.population.context_squads,
              },
              time_scope: {
                time_period: pivotedTimePeriod,
                time_period_length: pivotedTimePeriodLength,
                start_time: undefined,
                end_time: undefined,
                time_period_length_offset: null,
              },
              overlays: chartElement.overlays,
            },
          ],
        };

        expect(
          formatGetDataParams(widget, {
            pivotedDataRange: {},
            pivotedPopulation,
            pivotedTimePeriod,
            pivotedTimePeriodLength,
          })
        ).toStrictEqual(expected);
      });

      it('returns the correct format when chart_elements length >= 1 and has context_squads', () => {
        const element = generateChartElement({
          overlays: null,
          type: 'Medical',
        });

        const chartElement = {
          ...element,
          population: {
            ...element.population,
            context_squads: [12, 45],
          },
        };

        const widget = generateChartWidget({
          chart_elements: [chartElement],
        });

        const pivotedPopulation = {
          applies_to_squad: false,
          all_squads: false,
          position_groups: [],
          positions: [],
          athletes: [8],
          squads: [],
        };

        const pivotedTimePeriod = 'last_x_days';

        const pivotedTimePeriodLength = '10';

        const expected = {
          ...widget,
          chart_elements: [
            {
              calculation: chartElement.calculation,
              config: chartElement.config,
              data_source_type: chartElement.data_source_type,
              input_params: chartElement.input_params,
              population: {
                ...pivotedPopulation,
                context_squads: chartElement.population.context_squads,
              },
              time_scope: {
                time_period: pivotedTimePeriod,
                time_period_length: pivotedTimePeriodLength,
                start_time: undefined,
                end_time: undefined,
                time_period_length_offset: null,
              },
              overlays: chartElement.overlays,
            },
          ],
        };

        expect(
          formatGetDataParams(widget, {
            pivotedDataRange: {},
            pivotedPopulation,
            pivotedTimePeriod,
            pivotedTimePeriodLength,
          })
        ).toStrictEqual(expected);
      });
    });

    describe('rep-charts-v2-caching', () => {
      it('does not add chart element id to the params when the feature flag is turned off', () => {
        window.setFlag('rep-charts-v2-caching', false);

        const widget = generateChartWidget({ chart_elements: [] });

        expect(formatGetDataParams(widget, {})).toStrictEqual(widget);
      });

      it('adds chart element id to the params when the feature flag is turned on', () => {
        window.setFlag('rep-charts-v2-caching', true);

        const widget = {
          ...generateChartWidget({ chart_elements: [] }),
          id: 1,
        };

        expect(formatGetDataParams(widget, {})).toStrictEqual({ ...widget });
      });
    });
  });

  describe('isChartLongitudinal', () => {
    it('returns false when a chartElements is undefined', () => {
      expect(isChartLongitudinal()).toBe(false);
    });

    it('returns false when a chartElements array is empty', () => {
      expect(isChartLongitudinal([])).toBe(false);
    });

    it('returns false when a chartElements array does not contains a chart_element with the grouping "timestamp"', () => {
      expect(isChartLongitudinal(MOCK_CHART_ELEMENTS)).toBe(false);
    });

    it('returns true when a chartElements array does contain a chart_element with the grouping "timestamp"', () => {
      const chartElements = [
        {
          ...MOCK_CHART_ELEMENTS[0],
          config: {
            groupings: ['timestamp'],
          },
        },
      ];

      expect(isChartLongitudinal(chartElements)).toBe(true);
    });
  });

  describe('getNewChartTitle', () => {
    it('returns the correct chart title when adding the first data source', () => {
      const chartElements = [];

      const dataSourceFormState = {
        config: {
          render_options: { name: 'Training Mins' },
        },
        input_params: {
          source: 'kitman',
          variable: 'training_minutes',
        },
        calculation: 'sum',
      };

      const chartTitle = 'XY Chart';

      expect(
        getNewChartTitle(dataSourceFormState, chartElements, chartTitle)
      ).toBe('Training Mins - Sum');
    });

    describe('when editing the first data source and there is only one data source', () => {
      it('returns the correct chart title when input_params / data source changes', () => {
        const chartElements = [
          {
            id: 123,
            input_params: {
              source: 'kitman',
              variable: 'game_minutes',
            },
            calculation: 'sum',
            config: {
              render_options: { name: 'Game Mins' },
            },
          },
        ];

        const dataSourceFormState = {
          id: 123,
          config: {
            render_options: { name: 'Training Mins' },
          },
          calculation: 'sum',
          input_params: {
            source: 'kitman',
            variable: 'training_session_minutes',
          },
        };

        const chartTitle = 'Game Mins - Sum';

        expect(
          getNewChartTitle(dataSourceFormState, chartElements, chartTitle)
        ).toBe('Training Mins - Sum');
      });

      it('returns the correct chart title when calculation changes', () => {
        const chartElements = [
          {
            id: 123,
            input_params: {
              source: 'kitman',
              variable: 'game_minutes',
            },
            config: {
              render_options: { name: 'Game Mins' },
            },
            calculation: 'sum',
          },
        ];

        const dataSourceFormState = {
          id: 123,
          calculation: 'mean',
          input_params: {
            source: 'kitman',
            variable: 'game_minutes',
          },
          config: {
            render_options: { name: 'Game Mins' },
          },
        };

        const chartTitle = 'Game Mins - Sum';

        expect(
          getNewChartTitle(dataSourceFormState, chartElements, chartTitle)
        ).toBe('Game Mins - Mean');
      });
    });

    it('returns the correct chart title when adding the second data source', () => {
      const chartElements = [
        {
          id: 123,
          input_params: {
            source: 'kitman',
            variable: 'game_minutes',
          },
          calculation: 'sum',
          config: {
            render_options: { name: 'Game Mins' },
          },
        },
      ];

      const dataSourceFormState = {
        id: 456,
        config: {
          render_options: { name: 'Training Mins' },
        },
        calculation: 'sum',
        input_params: {
          source: 'kitman',
          variable: 'training_session_minutes',
        },
      };

      const chartTitle = 'Game Mins - Sum';

      expect(
        getNewChartTitle(dataSourceFormState, chartElements, chartTitle)
      ).toBe('Game Mins - Sum - Training Mins - Sum');
    });

    describe('when editing either data source when there are two data sources', () => {
      it('returns the correct chart title when input_params changes for the first data source', () => {
        const chartElements = [
          {
            id: 123,
            input_params: {
              source: 'kitman',
              variable: 'game_minutes',
            },
            calculation: 'sum',
            config: {
              render_options: { name: 'Game Mins' },
            },
          },
          {
            id: 456,
            input_params: {
              source: 'kitman',
              variable: 'training_minutes',
            },
            calculation: 'sum',
            config: {
              render_options: { name: 'Training Mins' },
            },
          },
        ];

        const dataSourceFormState = {
          id: 123,
          config: {
            render_options: { name: 'Training Mins' },
          },
          calculation: 'sum',
          input_params: {
            source: 'kitman',
            variable: 'training_minutes',
          },
        };

        const chartTitle = 'Game Mins - Sum - Training Mins - Sum';

        expect(
          getNewChartTitle(dataSourceFormState, chartElements, chartTitle)
        ).toBe('Training Mins - Sum - Training Mins - Sum');
      });

      it('returns the correct chart title when input_params changes for the second data source', () => {
        const chartElements = [
          {
            id: 123,
            input_params: {
              source: 'kitman',
              variable: 'game_minutes',
            },
            calculation: 'sum',
            config: {
              render_options: { name: 'Game Mins' },
            },
          },
          {
            id: 456,
            input_params: {
              source: 'kitman',
              variable: 'game_minutes',
            },
            calculation: 'sum',
            config: {
              render_options: { name: 'Game Mins' },
            },
          },
        ];

        const dataSourceFormState = {
          id: 456,
          config: {
            render_options: { name: 'Training Mins' },
          },
          calculation: 'sum',
          input_params: {
            source: 'kitman',
            variable: 'training_minutes',
          },
        };

        const chartTitle = 'Game Mins - Sum - Game Mins - Sum';

        expect(
          getNewChartTitle(dataSourceFormState, chartElements, chartTitle)
        ).toBe('Game Mins - Sum - Training Mins - Sum');
      });

      it('returns the correct chart title when calculation changes for the first data source', () => {
        const chartElements = [
          {
            id: 123,
            input_params: {
              source: 'kitman',
              variable: 'game_minutes',
            },
            calculation: 'sum',
            config: {
              render_options: { name: 'Game Mins' },
            },
          },
          {
            id: 456,
            input_params: {
              source: 'kitman',
              variable: 'training_minutes',
            },
            calculation: 'sum',
            config: {
              render_options: { name: 'Training Mins' },
            },
          },
        ];

        const dataSourceFormState = {
          id: 123,
          config: {
            render_options: { name: 'Game Mins' },
          },
          calculation: 'mean',
          input_params: {
            source: 'kitman',
            variable: 'game_minutes',
          },
        };

        const chartTitle = 'Game Mins - Sum - Training Mins - Sum';

        expect(
          getNewChartTitle(dataSourceFormState, chartElements, chartTitle)
        ).toBe('Game Mins - Mean - Training Mins - Sum');
      });

      it('returns the correct chart title when calculation changes for the second data source', () => {
        const chartElements = [
          {
            id: 123,
            input_params: {
              source: 'kitman',
              variable: 'game_minutes',
            },
            calculation: 'sum',
            config: {
              render_options: { name: 'Game Mins' },
            },
          },
          {
            id: 456,
            input_params: {
              source: 'kitman',
              variable: 'training_minutes',
            },
            calculation: 'sum',
            config: {
              render_options: { name: 'Training Mins' },
            },
          },
        ];

        const dataSourceFormState = {
          id: 456,
          config: {
            render_options: { name: 'Training Mins' },
          },
          calculation: 'mean',
          input_params: {
            source: 'kitman',
            variable: 'training_minutes',
          },
        };

        const chartTitle = 'Game Mins - Sum - Training Mins - Sum';

        expect(
          getNewChartTitle(dataSourceFormState, chartElements, chartTitle)
        ).toBe('Game Mins - Sum - Training Mins - Mean');
      });
    });
  });

  describe('getNewChartTitleOnRemove', () => {
    it('returns the default "Value" chart title when removing a data source on a value chart', () => {
      const chartElements = [
        {
          id: 123,
          input_params: {
            source: 'kitman',
            variable: 'game_minutes',
          },
          calculation: 'sum',
        },
      ];

      const dataSourceFormState = {
        id: 123,
        input_params: {
          source: 'kitman',
          variable: 'game_minutes',
        },
        calculation: 'sum',
      };

      const chartType = 'value';

      expect(
        getNewChartTitleOnRemove(chartElements, dataSourceFormState, chartType)
      ).toBe('Value');
    });

    it('returns the default "X and Y chart" chart title when removing a data source on xy chart', () => {
      const chartElements = [
        {
          id: 123,
          input_params: {
            source: 'kitman',
            variable: 'game_minutes',
          },
          calculation: 'sum',
        },
      ];

      const dataSourceFormState = {
        id: 123,
        input_params: {
          source: 'kitman',
          variable: 'game_minutes',
        },
        calculation: 'sum',
      };

      const chartType = 'xy';

      expect(
        getNewChartTitleOnRemove(chartElements, dataSourceFormState, chartType)
      ).toBe('X and Y chart');
    });

    describe('when there is more than one data source on a XY chart', () => {
      it('returns the chart title of only the second data source when the first is removed', () => {
        const chartElements = [
          {
            id: 123,
            input_params: {
              source: 'kitman',
              variable: 'game_minutes',
            },
            calculation: 'sum',
            config: {
              render_options: { name: 'Game Mins' },
            },
          },
          {
            id: 456,
            input_params: {
              source: 'kitman',
              variable: 'training_minutes',
            },
            calculation: 'mean',
            config: {
              render_options: { name: 'Training Mins' },
            },
          },
        ];

        const dataSourceFormState = {
          id: 123,
          input_params: {
            source: 'kitman',
            variable: 'game_minutes',
          },
          calculation: 'sum',
          config: {
            render_options: { name: 'Game Mins' },
          },
        };

        const chartType = 'xy';

        expect(
          getNewChartTitleOnRemove(
            chartElements,
            dataSourceFormState,
            chartType
          )
        ).toBe('Training Mins - Mean');
      });

      it('returns the chart title of only the first data source when the second is removed', () => {
        const chartElements = [
          {
            id: 123,
            input_params: {
              source: 'kitman',
              variable: 'game_minutes',
            },
            calculation: 'sum',
            config: {
              render_options: { name: 'Game Mins' },
            },
          },
          {
            id: 456,
            input_params: {
              source: 'kitman',
              variable: 'training_minues',
            },
            calculation: 'mean',
            config: {
              render_options: { name: 'Training Mins' },
            },
          },
        ];

        const dataSourceFormState = {
          id: 456,
          input_params: {
            source: 'kitman',
            variable: 'training_minues',
          },
          calculation: 'mean',
          config: {
            render_options: { name: 'Training Mins' },
          },
        };

        const chartType = 'xy';

        expect(
          getNewChartTitleOnRemove(
            chartElements,
            dataSourceFormState,
            chartType
          )
        ).toBe('Game Mins - Sum');
      });
    });

    describe('getDefaultSeriesType', () => {
      it('returns SERIES_TYPES.bar if chartElements is empty', () => {
        expect(getDefaultSeriesType([])).toBe(SERIES_TYPES.bar);
      });

      it('returns SERIES_TYPES.line if chartElements contains at least one bar series', () => {
        const mockChartElement = {
          config: {
            render_options: {
              type: SERIES_TYPES.bar,
            },
          },
        };
        expect(getDefaultSeriesType([mockChartElement])).toBe(
          SERIES_TYPES.line
        );
      });

      it('returns SERIES_TYPES.bar if chartElements does not contain any bar series', () => {
        const mockChartElement = {
          config: {
            render_options: {
              type: SERIES_TYPES.line,
            },
          },
        };
        expect(getDefaultSeriesType([mockChartElement])).toBe(SERIES_TYPES.bar);
      });
    });
  });

  describe('synchronizeChartGrouping', () => {
    it('sync datasources with the correct groupings whilst ignoring invalid datasources', () => {
      const widgetData = {
        widget: {
          chart_elements: [
            {
              ...MOCK_CHART_ELEMENTS[0],
              config: {
                groupings: ['timestamp'],
                render_options: {
                  name: 'New Chart Element',
                },
              },
            },
            {
              ...MOCK_CHART_ELEMENTS[1],
              config: {
                groupings: ['timestamp'],
                render_options: {
                  name: 'New Chart Element 2',
                },
              },
            },

            {
              ...MOCK_CHART_ELEMENTS[1],
              id: 3,
              config: {
                groupings: ['timestamp'],
                render_options: {
                  name: 'New Chart Element 3',
                },
              },
            },
          ],
        },
      };
      const dataSourceFormState = {
        config: {
          groupings: ['squad'],
        },
      };
      const invalidChartElementMap = {
        1: ['invalidGrouping'],
      };

      const result = synchronizeChartGrouping(
        widgetData,
        dataSourceFormState,
        invalidChartElementMap
      );

      const expectedResult = [
        {
          ...MOCK_CHART_ELEMENTS[0],
          config: {
            groupings: ['timestamp'],
            render_options: {
              name: 'New Chart Element',
            },
          },
        },
        {
          ...MOCK_CHART_ELEMENTS[1],
          config: {
            groupings: ['squad'],
            render_options: {
              name: 'New Chart Element 2',
            },
          },
        },

        {
          ...MOCK_CHART_ELEMENTS[1],
          id: 3,
          config: {
            groupings: ['squad'],
            render_options: {
              name: 'New Chart Element 3',
            },
          },
        },
      ];
      expect(result).toStrictEqual(expectedResult);
      expect(result.length).toBe(3);
    });

    it('returns the elements as it is when there is no deactivated source', () => {
      const widgetData = {
        widget: {
          chart_elements: [
            {
              ...MOCK_CHART_ELEMENTS[0],
              config: {
                groupings: ['squad'],
                render_options: {
                  name: 'New Chart Element',
                },
              },
            },
            {
              ...MOCK_CHART_ELEMENTS[1],
              config: {
                groupings: ['timestamp'],
                render_options: {
                  name: 'New Chart Element 2',
                },
              },
            },
          ],
        },
      };
      const dataSourceFormState = {
        config: {
          groupings: ['timestamp'],
        },
      };
      const invalidChartElementMap = {
        1: [],
      };
      const result = synchronizeChartGrouping(
        widgetData,
        dataSourceFormState,
        invalidChartElementMap
      );
      expect(result.length).toBe(2);
    });

    it('syncs the grouping when there is no deactivated source', () => {
      const sharedGrouping = 'athlete_id';
      const widgetData = {
        widget: {
          chart_elements: [
            {
              ...MOCK_CHART_ELEMENTS[0],
              config: {
                groupings: [sharedGrouping],
                render_options: {
                  name: 'New Chart Element',
                },
              },
            },
            {
              ...MOCK_CHART_ELEMENTS[1],
              config: {
                groupings: ['timestamp'],
                render_options: {
                  name: 'New Chart Element 2',
                },
              },
            },
          ],
        },
      };
      const dataSourceFormState = {
        config: {
          groupings: [sharedGrouping],
        },
      };
      const invalidChartElementMap = {
        1: [],
      };

      const result = synchronizeChartGrouping(
        widgetData,
        dataSourceFormState,
        invalidChartElementMap
      );
      const syncedChartElements = result.filter(
        (r) => r.config.groupings[0] === sharedGrouping
      );
      expect(syncedChartElements.length).toStrictEqual(
        widgetData.widget.chart_elements.length
      );
    });

    it('does not sync the grouping when there is deactivated source', () => {
      const widgetData = {
        widget: {
          chart_elements: [
            {
              ...MOCK_CHART_ELEMENTS[0],
              config: {
                groupings: ['squad'],
                render_options: {
                  name: 'New Chart Element',
                },
              },
            },
            {
              ...MOCK_CHART_ELEMENTS[1],
              config: {
                groupings: ['timestamp'],
                render_options: {
                  name: 'New Chart Element 2',
                },
              },
            },
          ],
        },
      };
      const dataSourceFormState = {
        config: {
          groupings: ['squad'],
        },
      };
      const invalidChartElementMap = {
        1: ['invalidGrouping'],
      };

      const result = synchronizeChartGrouping(
        widgetData,
        dataSourceFormState,
        invalidChartElementMap
      );
      const syncedChartElements = result.filter(
        (r) => r.config.groupings[0] === dataSourceFormState.config.groupings[0]
      );
      expect(syncedChartElements.length).toBe(2);
    });
  });

  describe('isSubArray', () => {
    it('returns true if the array is a subarray', () => {
      const primaryArray = ['a', 'b', 'c'];
      const subArray = ['a', 'b'];
      const result = isSubArray(primaryArray, subArray);
      expect(result).toBe(true);
    });

    it('returns false if the array is not a subarray', () => {
      const primaryArray = ['a', 'b', 'c'];
      const subArray = ['d'];
      const result = isSubArray(primaryArray, subArray);
      expect(result).toBe(false);
    });
  });

  describe('applyErrorState', () => {
    it('adds error state', () => {
      const chartElementIds = ['1', '2'];
      const invalidMap = {
        1: ['invalidFilter'],
      };
      const error = 'invalidGrouping';
      const result = applyErrorState(chartElementIds, invalidMap, error);
      expect(result).toStrictEqual({
        1: ['invalidFilter', 'invalidGrouping'],
        2: ['invalidGrouping'],
      });
    });

    it('does not add duplicate error states', () => {
      const chartElementIds = ['1', '2'];
      const invalidMap = {
        1: ['invalidFilter'],
      };
      const error = 'invalidFilter';
      const result = applyErrorState(chartElementIds, invalidMap, error);
      expect(result).toStrictEqual({
        1: ['invalidFilter'],
        2: ['invalidFilter'],
      });
    });

    it('if invalid map is null creates one with the passed params', () => {
      const chartElementIds = [1, 2];
      const invalidMap = null;
      const error = 'invalidFilter';
      const result = applyErrorState(chartElementIds, invalidMap, error);
      expect(result).toStrictEqual({
        1: ['invalidFilter'],
        2: ['invalidFilter'],
      });
    });
  });

  describe('removeErrorState', () => {
    it('removes error state', () => {
      const invalidMap = {
        1: ['invalidGrouping', 'invalidFilter'],
      };
      const error = 'invalidGrouping';
      const result = removeErrorState(invalidMap, error);
      expect(result).toStrictEqual({
        1: ['invalidFilter'],
      });
    });

    it('return empty object if there is no existing invalid chart element map', () => {
      const error = 'invalidFilter';
      const result = removeErrorState(null, error);
      expect(result).toStrictEqual({});
    });
  });

  describe('formatFormulaDetails', () => {
    const mockElement = {
      id: 123,
      config: {
        render_options: {
          name: 'test',
        },
      },
      input_params: {
        A: {},
        B: {},
      },
      data_source_type: 'formula',
    };

    it('returns the right object', () => {
      const result = formatFormulaDetails(mockElement);
      expect(result).toStrictEqual({
        id: 123,
        name: 'test',
        table_element: {
          data_source: {
            A: {},
            B: {},
            data_source_type: 'formula',
          },
        },
      });
    });
  });

  describe('getCheckboxChartOptions', () => {
    let chartType = '';
    it('returns hide nulls/zeroes options when chart type = xy', () => {
      chartType = CHART_TYPE.xy;
      const result = getCheckboxChartOptions(chartType);
      expect(result).toStrictEqual([
        {
          value: 'hide_zero_values',
          label: 'Hide zero values',
        },
        {
          value: 'hide_null_values',
          label: 'Hide null values',
        },
      ]);
    });

    it('returns empty array by default', () => {
      chartType = CHART_TYPE.value;
      const result = getCheckboxChartOptions(chartType);
      expect(result).toStrictEqual([]);
    });

    it('returns pie default options when chart type = pie', () => {
      chartType = CHART_TYPE.pie;
      const result = getCheckboxChartOptions(chartType);
      expect(result).toStrictEqual([
        {
          value: 'show_label',
          label: 'Show label',
        },
        {
          value: 'show_values',
          label: 'Show values',
        },
        {
          value: 'show_percentage',
          label: 'Show percentage',
        },
        {
          value: 'show_legend',
          label: 'Show legend',
        },
      ]);
    });
  });

  describe('getDefaultChartOptionsAsObject', () => {
    let chartType = '';
    it('returns chart options based on chart type', () => {
      chartType = CHART_TYPE.pie;
      const result = getDefaultChartOptionsAsObject(chartType);
      expect(result).toStrictEqual({
        show_label: true,
        show_legend: true,
      });
    });

    it('returns empty object by default', () => {
      chartType = CHART_TYPE.xy;
      const result = getDefaultChartOptionsAsObject(chartType);
      expect(result).toStrictEqual({});
    });
  });

  describe('orderGroupings', () => {
    const mockGroupings = [
      {
        name: 'Treatment Modality',
        order: 11,
        category_order: 5,
      },
      {
        name: 'Athlete',
        order: 1,
        category_order: 1,
      },
      {
        name: 'Surface Type',
        order: 5,
        category_order: 3,
      },
      {
        name: 'Position',
        order: 3,
        category_order: 1,
      },
      {
        name: 'Treatment Category',
        category_name: 'Medical',
        order: 10,
        category_order: 5,
      },
      {
        name: 'Game Result',
        order: 5,
        category_order: 4,
      },
      {
        name: 'Week of Training',
        order: 2,
        category_order: 2,
      },
    ];

    it('returns the ordered list', () => {
      const result = orderGroupings(mockGroupings);
      expect(result).toStrictEqual([
        {
          name: 'Athlete',
          order: 1,
          category_order: 1,
        },
        {
          name: 'Position',
          order: 3,
          category_order: 1,
        },
        {
          name: 'Week of Training',
          order: 2,
          category_order: 2,
        },
        {
          name: 'Surface Type',
          order: 5,
          category_order: 3,
        },
        {
          name: 'Game Result',
          order: 5,
          category_order: 4,
        },
        {
          name: 'Treatment Category',
          category_name: 'Medical',
          order: 10,
          category_order: 5,
        },
        {
          name: 'Treatment Modality',
          order: 11,
          category_order: 5,
        },
      ]);
    });
  });

  describe('getDefaultAxisConfig', () => {
    it('returns "left" config when adding the first chart element', () => {
      const chartElements = []; // empty, so adding first element

      expect(getDefaultAxisConfig(chartElements)).toBe('left');
    });

    it('returns "right" config when adding the second chart element', () => {
      const chartElements = [MOCK_CHART_ELEMENTS[0]]; // 1 element already configured, so adding second element

      expect(getDefaultAxisConfig(chartElements)).toBe('right');
    });
    it('returns "left" config when adding the subsequent chart element', () => {
      const chartElements = MOCK_CHART_ELEMENTS; // 2 elements already configured, so adding third element

      expect(getDefaultAxisConfig(chartElements)).toBe('left');
    });
  });
});
