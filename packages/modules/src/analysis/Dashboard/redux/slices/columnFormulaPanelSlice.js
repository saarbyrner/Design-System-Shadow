// @flow
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import structuredClone from 'core-js/stable/structured-clone';

import { convertDataSourceToInputs } from '@kitman/modules/src/analysis/shared/utils';
import { FORMULA_CONFIG_KEYS } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/consts';
import { type ColumnFormulaState } from '@kitman/modules/src/analysis/Dashboard/redux/types/store';
import {
  type UpdateFormulaInput,
  type UpdateFormulaInputElementConfig,
  type UpdateFormulaInputDataSource,
  type SetupFormulaPanel,
  type TableWidgetFormulaInput,
  type UpdateFormulaInputDataSourceSubtype,
  type InheritGroupings,
} from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/types';

export const REDUCER_KEY = 'columnFormulaPanel';

export const initialState: ColumnFormulaState = {
  isLoading: false,
  isEditMode: false,
  isOpen: false,
  columnName: null,
  formulaId: null,
  widgetType: null,
  widgetId: null,
  tableContainerId: null,
  columnId: null,
  progressStep: 0,
  inputs: {},
};

export const initialTableWidgetFormulaInput: TableWidgetFormulaInput = {
  panel_source: null,
  dataSource: {},
  population: null,
  time_scope: null,
  calculation: null,
  input_params: null,
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
    groupings: [],
  },
  population_selection: null,
  isPanelFiltersOpen: false,
};

const columnFormulaPanel = createSlice({
  name: REDUCER_KEY,
  initialState,
  reducers: {
    reset() {
      return initialState;
    },

    setupFormulaPanel(
      state: ColumnFormulaState,
      action: PayloadAction<SetupFormulaPanel>
    ) {
      state.formulaId = action.payload.formulaId;
      state.widgetType = action.payload.widgetType;
      state.widgetId = action.payload.widgetId;
      state.tableContainerId = action.payload?.tableContainerId;
      state.progressStep = 0;
      if (action.payload.columnDetails) {
        const details = action.payload.columnDetails;
        state.columnId = details.id; // NOTE: is not same as column_id
        state.columnName = details.name;
        state.isEditMode = true;
        state.inputs = convertDataSourceToInputs(
          details.table_element.data_source
        );
      } else {
        state.isEditMode = false;
      }

      // Only set inheritGroupings for 'xy' chart type
      if (action.payload?.inheritGroupings) {
        state.inheritGroupings = action.payload.inheritGroupings;
      }
    },

    setLoading(state: ColumnFormulaState, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },

    setColumnName(state: ColumnFormulaState, action: PayloadAction<string>) {
      state.columnName = action.payload;
    },

    incrementProgressStep(
      state: ColumnFormulaState,
      action: PayloadAction<?number>
    ) {
      state.progressStep += action.payload;
    },

    updateFormulaInput(
      state: ColumnFormulaState,
      action: PayloadAction<UpdateFormulaInput>
    ) {
      const formulaInputId = action.payload.formulaInputId;

      let input =
        state.inputs[formulaInputId] ||
        // Even with immer I think structuredClone safest here
        structuredClone(initialTableWidgetFormulaInput);

      input = {
        ...input,
        ...action.payload.properties,
      };

      // Apply overrides for medical panel source
      if (action.payload.properties.panel_source === 'medical') {
        if (input.dataSource) {
          input.dataSource.type = 'MedicalInjury';
        }
        input.calculation = 'count_absolute';
      }

      // Thought to Reset the calculation params when calculation changes
      // TODO: Need more thought here.
      // Issue is if the new calculation shares some calculation params with previous values would be gone from state
      /*
      if (
        action.payload.properties.calculation &&
        input.element_config?.calculation_params
      ) {
        input.element_config.calculation_params = {};
      }
      */

      state.inputs[formulaInputId] = input;
    },

    updateFormulaInputElementConfig(
      state: ColumnFormulaState,
      action: PayloadAction<UpdateFormulaInputElementConfig>
    ) {
      const { formulaInputId, configKey, properties } = action.payload;

      // Even with immer I think structuredClone safest here
      const input =
        state.inputs[formulaInputId] ||
        structuredClone(initialTableWidgetFormulaInput);

      if (input.element_config && configKey) {
        // Groupings are stored in an array instead an object
        if (configKey === FORMULA_CONFIG_KEYS.groupings) {
          const { index, grouping } = properties;

          input.element_config[configKey] =
            input.element_config[configKey] || [];

          input.element_config[configKey][index] = grouping;
        } else {
          input.element_config[configKey] = {
            ...input.element_config[configKey],
            ...action.payload.properties,
          };
        }
      }

      state.inputs[formulaInputId] = input;
    },

    updateFormulaInputDataSource(
      state: ColumnFormulaState,
      action: PayloadAction<UpdateFormulaInputDataSource>
    ) {
      const formulaInputId = action.payload.formulaInputId;

      // Even with immer I think structuredClone safest here
      const input =
        state.inputs[formulaInputId] ||
        structuredClone(initialTableWidgetFormulaInput);

      if (input.dataSource) {
        input.dataSource = {
          ...input.dataSource,
          ...action.payload.properties,
        };
      }
      state.inputs[formulaInputId] = input;
    },
    updateFormulaInputDataSourceSubtype(
      state: ColumnFormulaState,
      action: PayloadAction<UpdateFormulaInputDataSourceSubtype>
    ) {
      const { formulaInputId, properties } = action.payload;
      const key = properties.subtypeKey;
      const value = structuredClone(properties.value);

      const input =
        state.inputs[formulaInputId] ||
        structuredClone(initialTableWidgetFormulaInput);

      if (input.dataSource) {
        input.dataSource.subtypes = input.dataSource.subtypes || {};

        input.dataSource.subtypes = {
          ...input.dataSource.subtypes,
          [key]: value,
        };
      }
      state.inputs[formulaInputId] = input;
    },
    updateInheritGroupings(
      state: ColumnFormulaState,
      action: PayloadAction<InheritGroupings>
    ) {
      state.inheritGroupings = action.payload;
    },
  },
});

export const {
  reset,
  setupFormulaPanel,
  setColumnName,
  setLoading,
  updateFormulaInput,
  updateFormulaInputElementConfig,
  updateFormulaInputDataSource,
  incrementProgressStep,
  updateFormulaInputDataSourceSubtype,
  updateInheritGroupings,
} = columnFormulaPanel.actions;

export default columnFormulaPanel.reducer;
