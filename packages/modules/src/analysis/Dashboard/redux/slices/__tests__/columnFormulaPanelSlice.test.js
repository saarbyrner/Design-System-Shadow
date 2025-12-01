import structuredClone from 'core-js/stable/structured-clone';

import { data as formulaColumnServerResponse } from '@kitman/services/src/mocks/handlers/analysis/addTableFormulaColumn';
// eslint-disable-next-line jest/no-mocks-import
import { CONVERTED_FORMULA_DATASOURCE } from '@kitman/modules/src/analysis/Dashboard/redux/__mocks__/tableWidget';
import columnFormulaPanelReducer, {
  initialState,
  initialTableWidgetFormulaInput,
  reset,
  setLoading,
  setupFormulaPanel,
  setColumnName,
  updateFormulaInput,
  updateFormulaInputElementConfig,
  updateFormulaInputDataSource,
  incrementProgressStep,
  updateFormulaInputDataSourceSubtype,
  updateInheritGroupings,
} from '@kitman/modules/src/analysis/Dashboard/redux/slices/columnFormulaPanelSlice';

describe('analysis dashboard - columnFormulaPanel slice', () => {
  it('should have an initial state', () => {
    const action = { type: 'unknown' };
    const expectedState = initialState;

    expect(columnFormulaPanelReducer(initialState, action)).toStrictEqual(
      expectedState
    );
  });

  test('reset()', () => {
    expect(
      columnFormulaPanelReducer(
        {
          ...initialState,
          progressStep: 2,
          columnName: 'Test name',
        },
        reset()
      )
    ).toStrictEqual(initialState);
  });

  test('setupFormulaPanel() create column', () => {
    expect(
      columnFormulaPanelReducer(
        initialState,
        setupFormulaPanel({
          formulaId: 2,
          widgetType: 'COMPARISON',
          widgetId: 2,
          tableContainerId: 3,
        })
      )
    ).toStrictEqual({
      ...initialState,
      formulaId: 2,
      widgetType: 'COMPARISON',
      widgetId: 2,
      tableContainerId: 3,
    });
  });

  test('setupFormulaPanel() edit column', () => {
    const columnDetails = {
      id: 100,
      name: 'column name',
      table_element: structuredClone(formulaColumnServerResponse.table_element),
    };
    expect(
      columnFormulaPanelReducer(
        initialState,
        setupFormulaPanel({
          formulaId: 2,
          widgetType: 'COMPARISON',
          widgetId: 2,
          tableContainerId: 3,
          columnDetails,
        })
      )
    ).toStrictEqual({
      ...initialState,
      formulaId: 2,
      widgetType: 'COMPARISON',
      widgetId: 2,
      tableContainerId: 3,
      columnName: 'column name',
      columnId: 100,
      isEditMode: true,
      inputs: { ...CONVERTED_FORMULA_DATASOURCE },
    });
  });

  test('setColumnName()', () => {
    expect(
      columnFormulaPanelReducer(initialState, setColumnName('Test name'))
    ).toStrictEqual({
      ...initialState,
      columnName: 'Test name',
    });
  });

  test('setLoading()', () => {
    expect(
      columnFormulaPanelReducer(initialState, setLoading(true))
    ).toStrictEqual({
      ...initialState,
      isLoading: true,
    });
  });

  test('updateFormulaInput() create input', () => {
    expect(
      columnFormulaPanelReducer(
        initialState,
        updateFormulaInput({
          formulaInputId: 'A',
          properties: {
            panel_source: 'metric',
            calculation: 'sum',
          },
        })
      )
    ).toStrictEqual({
      ...initialState,
      inputs: {
        A: {
          ...structuredClone(initialTableWidgetFormulaInput),
          panel_source: 'metric',
          calculation: 'sum',
        },
      },
    });
  });

  test('updateFormulaInput() existing input', () => {
    expect(
      columnFormulaPanelReducer(
        {
          ...initialState,
          inputs: {
            A: {
              ...structuredClone(initialTableWidgetFormulaInput),
              panel_source: 'metric',
              calculation: 'sum',
            },
            B: {
              ...structuredClone(initialTableWidgetFormulaInput),
              panel_source: 'metric',
              calculation: 'sum',
            },
          },
        },
        updateFormulaInput({
          formulaInputId: 'B',
          properties: {
            panel_source: 'medical',
          },
        })
      )
    ).toStrictEqual({
      ...initialState,
      inputs: {
        A: {
          ...structuredClone(initialTableWidgetFormulaInput),
          panel_source: 'metric',
          calculation: 'sum',
        },
        B: {
          ...structuredClone(initialTableWidgetFormulaInput),
          panel_source: 'medical',
          calculation: 'count_absolute', // as medical, calculation gets overridden
          dataSource: {
            type: 'MedicalInjury',
          },
        },
      },
    });
  });

  test('updateFormulaInputElementConfig() filters, create input', () => {
    expect(
      columnFormulaPanelReducer(
        initialState,
        updateFormulaInputElementConfig({
          formulaInputId: 'A',
          configKey: 'filters',
          properties: {
            time_loss: [1],
          },
        })
      )
    ).toStrictEqual({
      ...initialState,
      inputs: {
        A: {
          ...structuredClone(initialTableWidgetFormulaInput),
          element_config: {
            filters: {
              time_loss: [1],
              competitions: [],
              event_types: [],
              session_type: [],
              training_session_types: [],
              micro_cycle: [],
              match_days: [],
            },
            calculation_params: {},
            groupings: [],
          },
          dataSource: {},
        },
      },
    });
  });

  test('updateFormulaInputElementConfig() filters, create input with groupings property', () => {
    expect(
      columnFormulaPanelReducer(
        initialState,
        updateFormulaInputElementConfig({
          formulaInputId: 'A',
          configKey: 'groupings',
          properties: {
            index: 0,
            grouping: 'side',
          },
        })
      )
    ).toStrictEqual({
      ...initialState,
      inputs: {
        A: {
          ...structuredClone(initialTableWidgetFormulaInput),
          element_config: {
            filters: {
              time_loss: [],
              competitions: [],
              event_types: [],
              session_type: [],
              training_session_types: [],
              micro_cycle: [],
              match_days: [],
            },
            calculation_params: {},
            groupings: ['side'],
          },
          dataSource: {},
        },
      },
    });
  });

  test('updateFormulaInputElementConfig() filters, existing input', () => {
    expect(
      columnFormulaPanelReducer(
        {
          ...initialState,
          inputs: {
            A: {
              ...structuredClone(initialTableWidgetFormulaInput),
              element_config: {
                filters: {
                  time_loss: [],
                  competitions: [2],
                  event_types: [],
                  session_type: [],
                  training_session_types: [],
                },
                calculation_params: {},
              },
            },
          },
        },
        updateFormulaInputElementConfig({
          formulaInputId: 'A',
          configKey: 'filters',
          properties: {
            time_loss: [1],
          },
        })
      )
    ).toStrictEqual({
      ...initialState,
      inputs: {
        A: {
          ...structuredClone(initialTableWidgetFormulaInput),
          element_config: {
            filters: {
              time_loss: [1],
              competitions: [2], // Existing filter is maintained
              event_types: [],
              session_type: [],
              training_session_types: [],
            },
            calculation_params: {},
          },
        },
      },
    });
  });

  test('updateFormulaInputElementConfig() adds new filters when no filters exist', () => {
    expect(
      columnFormulaPanelReducer(
        {
          ...initialState,
          inputs: {
            B: {
              ...structuredClone(initialTableWidgetFormulaInput),
              element_config: {
                calculation_params: {},
              },
            },
          },
        },
        updateFormulaInputElementConfig({
          formulaInputId: 'B',
          configKey: 'filters', // Adding a new filter
          properties: {
            time_loss: [1],
          },
        })
      )
    ).toStrictEqual({
      ...initialState,
      inputs: {
        B: {
          ...structuredClone(initialTableWidgetFormulaInput),
          element_config: {
            filters: {
              time_loss: [1], // New added filter
            },
            calculation_params: {},
          },
        },
      },
    });
  });

  test('updateFormulaInputDataSource() filters, create input', () => {
    expect(
      columnFormulaPanelReducer(
        initialState,
        updateFormulaInputDataSource({
          formulaInputId: 'A',
          properties: {
            type: 'TableMetric',
            key_name: 'kitman|game_minutes',
            source: 'kitman',
            variable: 'game_minutes',
          },
        })
      )
    ).toStrictEqual({
      ...initialState,
      inputs: {
        A: {
          ...structuredClone(initialTableWidgetFormulaInput),
          dataSource: {
            type: 'TableMetric',
            key_name: 'kitman|game_minutes',
            source: 'kitman',
            variable: 'game_minutes',
          },
        },
      },
    });
  });

  test('updateFormulaInputDataSource() filters, existing input', () => {
    expect(
      columnFormulaPanelReducer(
        {
          ...initialState,
          inputs: {
            A: {
              ...structuredClone(initialTableWidgetFormulaInput),
              dataSource: {
                type: 'TableMetric',
                key_name: 'kitman|game_minutes',
                source: 'kitman',
                variable: 'game_minutes',
              },
            },
          },
        },
        updateFormulaInputDataSource({
          formulaInputId: 'A',
          properties: {
            type: 'ParticipationLevel',
            ids: [1],
          },
        })
      )
    ).toStrictEqual({
      ...initialState,
      inputs: {
        A: {
          ...structuredClone(initialTableWidgetFormulaInput),
          dataSource: {
            type: 'ParticipationLevel',
            ids: [1],
            // NOTE: currently older params bellow related to prior type are not removed
            // This is same behavior as non formula column state
            key_name: 'kitman|game_minutes',
            source: 'kitman',
            variable: 'game_minutes',
          },
        },
      },
    });
  });

  test('incrementProgressStep() positive', () => {
    expect(
      columnFormulaPanelReducer(
        { ...initialState, progressStep: 1 },
        incrementProgressStep(1)
      )
    ).toStrictEqual({
      ...initialState,
      progressStep: 2,
    });
  });

  test('incrementProgressStep() negative', () => {
    expect(
      columnFormulaPanelReducer(
        { ...initialState, progressStep: 1 },
        incrementProgressStep(-1)
      )
    ).toStrictEqual({
      ...initialState,
      progressStep: 0,
    });
  });

  test('updateFormulaInputDataSourceSubtype()', () => {
    const initialStateWithInput = {
      ...initialState,
      inputs: {
        A: {
          ...structuredClone(initialTableWidgetFormulaInput),
          dataSource: {
            type: 'MedicalInjury',
            key_name: 'kitman|medical',
            source: 'kitman',
            variable: 'medical',
            subtypes: {
              side: 'right',
            },
          },
        },
      },
    };

    const updatedState = columnFormulaPanelReducer(
      initialStateWithInput,
      updateFormulaInputDataSourceSubtype({
        formulaInputId: 'A',
        properties: {
          subtypeKey: 'activity',
          value: 'scrum',
        },
      })
    );

    expect(updatedState).toStrictEqual({
      ...initialStateWithInput,
      inputs: {
        A: {
          ...structuredClone(initialTableWidgetFormulaInput),
          dataSource: {
            type: 'MedicalInjury',
            key_name: 'kitman|medical',
            source: 'kitman',
            variable: 'medical',
            subtypes: {
              side: 'right', // Keep existing subtypes
              activity: 'scrum', // Add new subtype
            },
          },
        },
      },
    });
  });

  test('updateInheritGroupings() yes', () => {
    expect(
      columnFormulaPanelReducer(
        { ...initialState, inheritGroupings: 'no' },
        updateInheritGroupings('yes')
      )
    ).toStrictEqual({
      ...initialState,
      inheritGroupings: 'yes',
    });
  });

  test('updateInheritGroupings() no', () => {
    expect(
      columnFormulaPanelReducer(
        { ...initialState, inheritGroupings: 'yes' },
        updateInheritGroupings('no')
      )
    ).toStrictEqual({
      ...initialState,
      inheritGroupings: 'no',
    });
  });
});
