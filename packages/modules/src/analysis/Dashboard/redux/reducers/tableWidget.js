// @flow
import _uniq from 'lodash/uniq';
import _cloneDeep from 'lodash/cloneDeep';
import {
  formatParamsToDataSource,
  getDataSourceType,
  getParticipationStatus,
  getDataTypeSource,
} from '@kitman/modules/src/analysis/Dashboard/utils';

// TODO: add proper types for state and action.
// $FlowFixMe[missing-annot]
export default function (state = {}, action) {
  switch (action.type) {
    case 'UPDATE_TABLE_NAME_SUCCESS': {
      return {
        ...state,
        status: null,
      };
    }
    case 'ADD_TABLE_ROW_FAILURE':
    case 'ADD_TABLE_COLUMN_FAILURE':
    case 'CHANGE_COLUMN_SUMMARY_FAILURE':
    case 'CHANGE_ROW_SUMMARY_FAILURE':
    case 'DELETE_TABLE_COLUMN_FAILURE':
    case 'DELETE_TABLE_ROW_FAILURE':
    case 'EDIT_TABLE_COLUMN_FAILURE':
    case 'LOCK_COLUMN_PIVOT_FAILURE':
    case 'SAVE_TABLE_FORMATTING_FAILURE':
    case 'UPDATE_TABLE_NAME_FAILURE':
    case 'UPDATE_TABLE_SUMMARY_VISIBILITY_FAILURE': {
      return {
        ...state,
        status: 'error',
      };
    }
    case 'ADD_TABLE_ROW_LOADING':
    case 'ADD_TABLE_COLUMN_LOADING':
    case 'CHANGE_COLUMN_SUMMARY_LOADING':
    case 'CHANGE_ROW_SUMMARY_LOADING':
    case 'DELETE_TABLE_COLUMN_LOADING':
    case 'DELETE_TABLE_ROW_LOADING':
    case 'EDIT_TABLE_COLUMN_LOADING':
    case 'LOCK_COLUMN_PIVOT_LOADING':
    case 'SAVE_TABLE_FORMATTING_LOADING':
    case 'UPDATE_TABLE_SUMMARY_VISIBILITY_LOADING': {
      return {
        ...state,
        status: 'loading',
      };
    }
    case 'OPEN_TABLE_COLUMN_FORMATTING_PANEL': {
      return {
        ...state,
        appliedColumns: action.payload.existingTableColumns,
        formattingPanel: {
          ...state.formattingPanel,
          formattableId: action.payload.columnId,
          panelName: action.payload.columnName,
          ruleUnit: action.payload.columnUnit,
          appliedFormat: action.payload.appliedFormat,
        },
        tableContainerId: action.payload.tableContainerId,
        tableType: action.payload.tableType,
        widgetId: action.payload.widgetId,
      };
    }
    case 'OPEN_SCORECARD_TABLE_FORMATTING_PANEL': {
      return {
        ...state,
        appliedMetrics: action.payload.existingTableMetrics,
        formattingPanel: {
          ...state.formattingPanel,
          formattableId: action.payload.rowMetricId,
          panelName: action.payload.metricName,
          ruleUnit: action.payload.metricUnit,
          appliedFormat: action.payload.appliedFormat,
        },
        tableContainerId: action.payload.tableContainerId,
        tableType: 'SCORECARD',
        widgetId: action.payload.widgetId,
      };
    }
    case 'UPDATE_FORMATTING_RULE_TYPE': {
      return {
        ...state,
        formattingPanel: {
          ...state.formattingPanel,
          appliedFormat: state.formattingPanel.appliedFormat.map(
            (rule, index) => ({
              ...rule,
              type:
                action.payload.index === index
                  ? action.payload.type
                  : rule.type,
            })
          ),
        },
      };
    }
    case 'UPDATE_FORMATTING_RULE_CONDITION': {
      return {
        ...state,
        formattingPanel: {
          ...state.formattingPanel,
          appliedFormat: state.formattingPanel.appliedFormat.map(
            (rule, index) => ({
              ...rule,
              condition:
                action.payload.index === index
                  ? action.payload.condition
                  : rule.condition,
            })
          ),
        },
      };
    }
    case 'UPDATE_FORMATTING_RULE_VALUE': {
      return {
        ...state,
        formattingPanel: {
          ...state.formattingPanel,
          appliedFormat: state.formattingPanel.appliedFormat.map(
            (rule, index) => ({
              ...rule,
              value:
                action.payload.index === index
                  ? action.payload.value
                  : rule.value,
            })
          ),
        },
      };
    }
    case 'UPDATE_FORMATTING_RULE_COLOR': {
      return {
        ...state,
        formattingPanel: {
          ...state.formattingPanel,
          appliedFormat: state.formattingPanel.appliedFormat.map(
            (rule, index) => ({
              ...rule,
              color:
                action.payload.index === index
                  ? action.payload.color
                  : rule.color,
            })
          ),
        },
      };
    }
    case 'ADD_FORMATTING_RULE': {
      const appliedRules = state.formattingPanel.appliedFormat.slice();

      const lastRule = appliedRules[appliedRules.length - 1];

      appliedRules.push({
        type: appliedRules.length ? lastRule.type : null,
        condition: null,
        value: null,
        color: '#f3d2d5',
      });

      return {
        ...state,
        formattingPanel: {
          ...state.formattingPanel,
          appliedFormat: appliedRules,
        },
      };
    }
    case 'REMOVE_FORMATTING_RULE': {
      const formattingRules = [...state.formattingPanel.appliedFormat].filter(
        (item, index) => index !== action.payload.index
      );
      return {
        ...state,
        formattingPanel: {
          ...state.formattingPanel,
          appliedFormat: formattingRules,
        },
      };
    }
    case 'SAVE_SCORECARD_TABLE_FORMATTING_SUCCESS': {
      const metrics = state.appliedMetrics.slice();
      const metricToUpdate = metrics.find(
        (metric) => metric.id === state.formattingPanel.formattableId
      );

      if (metricToUpdate) {
        if (!metricToUpdate.config) {
          metricToUpdate.config = {};
        }
        metricToUpdate.config.conditional_formatting =
          action.payload.appliedRules;
      }

      return {
        ...state,
        appliedMetrics: metrics,
        status: null,
      };
    }
    case 'CHANGE_COLUMN_SUMMARY_SUCCESS': {
      const columns = [...action.payload.existingTableColumns];
      const columnToUpdate = columns.find(
        (column) => column.id === action.payload.columnId
      );

      if (columnToUpdate) {
        if (!columnToUpdate.config) {
          columnToUpdate.config = {};
        }
        columnToUpdate.config.summary_calculation = action.payload.summaryCalc;
      }

      return {
        ...state,
        appliedColumns: columns,
        status: null,
      };
    }
    case 'CHANGE_ROW_SUMMARY_SUCCESS': {
      const rows = [...action.payload.existingTableRows];
      const rowToUpdate = rows.find((row) => row.id === action.payload.rowId);

      if (rowToUpdate) {
        if (!rowToUpdate.config) {
          rowToUpdate.config = {};
        }
        rowToUpdate.config.summary_calculation = action.payload.summaryCalc;
      }

      return {
        ...state,
        status: null,
      };
    }
    case 'OPEN_TABLE_COLUMN_PANEL': {
      let dataSource = state.columnPanel.dataSource || {};
      let calculation = state.columnPanel.calculation || '';

      if (action.payload.source === 'medical') {
        dataSource = { ...dataSource, type: 'MedicalInjury' };
        calculation = 'count_absolute';
      }

      return {
        ...state,
        appliedColumns: action.payload.existingTableColumns,
        appliedRows: action.payload.existingTableRows,
        columnPanel: {
          ...state.columnPanel,
          calculation,
          dataSource: {
            ...dataSource,
          },
          source: action.payload.source,
          isEditMode: false,
        },
        tableContainerId: action.payload.tableContainerId,
        tableName: action.payload.tableName,
        tableType: action.payload.tableType,
        showSummary: action.payload.showSummary,
        widgetId: action.payload.widgetId,
      };
    }
    case 'ADD_EDIT_TABLE_COLUMN_LOADING': {
      return {
        ...state,
        columnPanel: {
          ...state.columnPanel,
          isLoading: true,
        },
      };
    }
    case 'ADD_TABLE_COLUMN_SUCCESS': {
      return {
        ...state,
        columnPanel: {
          ...state.columnPanel,
          isLoading: false,
        },
      };
    }
    case 'OPEN_TABLE_ROW_PANEL': {
      let dataSource = state.rowPanel.dataSource || {};
      let calculation = state.rowPanel.calculation || '';

      if (action.payload.source === 'medical') {
        dataSource = {
          ...dataSource,
          type: 'MedicalInjury',
        };
        calculation = 'count_absolute';
      }

      return {
        ...state,
        tableContainerId: action.payload.tableContainerId,
        appliedColumns: action.payload.existingTableColumns,
        appliedRows: action.payload.existingTableRows,
        rowPanel: {
          ...state.rowPanel,
          calculation,
          dataSource: {
            ...dataSource,
          },
          source: action.payload.source,
          isEditMode: false,
        },
        tableName: action.payload.tableName,
        tableType: action.payload.tableType,
        showSummary: action.payload.showSummary,
        widgetId: action.payload.widgetId,
      };
    }
    case 'ADD_EDIT_TABLE_ROW_LOADING': {
      return {
        ...state,
        rowPanel: {
          ...state.rowPanel,
          isLoading: true,
        },
      };
    }
    case 'ADD_TABLE_ROW_SUCCESS': {
      return {
        ...state,
        rowPanel: {
          ...state.rowPanel,
          isLoading: false,
        },
      };
    }
    case 'EDIT_COMPARISON_TABLE_COLUMN': {
      const filters =
        action.payload.columnDetails.table_element.config?.filters || {};
      const calculationParams =
        action.payload.columnDetails.table_element.config?.calculation_params ||
        {};
      const tableElement = action.payload.columnDetails.table_element;
      const event = tableElement?.data_source.involvement_event_type;
      let ids = [];
      let status = tableElement.data_source.status;

      if (
        getDataSourceType(tableElement.data_source) === 'ParticipationLevel'
      ) {
        ids =
          tableElement.data_source.ids ||
          tableElement.data_source.participation_level_ids ||
          [];

        status = status ?? getParticipationStatus(ids, Boolean(event));
      } else {
        ids = tableElement.data_source.ids;
      }

      return {
        ...state,
        appliedColumns: action.payload.existingTableColumns,
        columnPanel: {
          ...state.columnPanel,
          calculation: action.payload.columnDetails.table_element.calculation,
          calculation_params: calculationParams,
          columnId: action.payload.columnDetails.id,
          source: getDataTypeSource(
            getDataSourceType(tableElement.data_source)
          ),
          dataSource: {
            ...state.columnPanel.dataSource,
            subtypes: tableElement.data_source.subtypes || {},
            key_name: `${tableElement.data_source.source}|${tableElement.data_source.variable}`,
            variable: tableElement.data_source.variable,
            source: tableElement.data_source.source,
            type: getDataSourceType(tableElement.data_source),
            id: tableElement.data_source.id,
            kinds: tableElement.data_source?.kinds,
            result: tableElement.data_source?.result,
            position_ids: tableElement.data_source?.position_ids,
            formation_ids: tableElement.data_source?.formation_ids,
            ids,
            status,
            event,
          },
          tableElement: action.payload.columnDetails.table_element,
          isEditMode: true,
          name: action.payload.columnDetails.name,
          time_scope: action.payload.columnDetails.time_scope,
          filters,
        },
        tableContainerId: action.payload.tableContainerId,
        tableType: action.payload.tableType,
        widgetId: action.payload.widgetId,
      };
    }
    case 'EDIT_SCORECARD_TABLE_COLUMN': {
      return {
        ...state,
        appliedColumns: action.payload.existingTableColumns,
        columnPanel: {
          ...state.columnPanel,
          columnId: action.payload.columnDetails.id,
          isEditMode: true,
          population: action.payload.columnDetails.population,
          name: action.payload.columnDetails.name,
          time_scope: action.payload.columnDetails.time_scope,
        },
        tableContainerId: action.payload.tableContainerId,
        tableType: action.payload.tableType,
        widgetId: action.payload.widgetId,
      };
    }
    case 'EDIT_LONGITUDINAL_TABLE_COLUMN': {
      const filters =
        action.payload.columnDetails.table_element?.config?.filters || {};
      const calculationParams =
        action.payload.columnDetails.table_element.config?.calculation_params ||
        {};
      const tableElement = action.payload.columnDetails.table_element;
      const event = tableElement?.data_source.involvement_event_type;
      let ids = [];
      let status = tableElement.data_source.status;

      if (
        getDataSourceType(tableElement.data_source) === 'ParticipationLevel'
      ) {
        ids =
          tableElement.data_source.ids ||
          tableElement.data_source.participation_level_ids ||
          [];

        status = status ?? getParticipationStatus(ids, Boolean(event));
      } else {
        ids = tableElement.data_source.ids;
      }

      return {
        ...state,
        appliedColumns: action.payload.existingTableColumns,
        columnPanel: {
          ...state.columnPanel,
          source: getDataTypeSource(
            getDataSourceType(tableElement.data_source)
          ),
          calculation: action.payload.columnDetails.table_element.calculation,
          calculation_params: calculationParams,
          columnId: action.payload.columnDetails.id,
          dataSource: {
            ...state.columnPanel.dataSource,
            subtypes: tableElement.data_source.subtypes || {},
            key_name: `${tableElement.data_source.source}|${tableElement.data_source.variable}`,
            source: tableElement.data_source.source,
            variable: tableElement.data_source.variable,
            type: getDataSourceType(tableElement.data_source),
            id: tableElement.data_source.id,
            kinds: tableElement.data_source?.kinds,
            result: tableElement.data_source?.result,
            position_ids: tableElement.data_source?.position_ids,
            formation_ids: tableElement.data_source?.formation_ids,
            ids,
            status,
            event,
          },
          isEditMode: true,
          name: action.payload.columnDetails.name,
          population: action.payload.columnDetails.population,
          filters,
        },
        tableContainerId: action.payload.tableContainerId,
        tableType: action.payload.tableType,
        widgetId: action.payload.widgetId,
      };
    }
    case 'EDIT_TABLE_ROW': {
      const filters = action.payload.row.table_element?.config?.filters || {};
      const calculationParams =
        action.payload.row.table_element?.config?.calculation_params || {};
      const tableElement = action.payload.row.table_element;
      const keyName = `${tableElement?.data_source.source}|${tableElement?.data_source.variable}`;
      const event = tableElement?.data_source.involvement_event_type;
      const rowConfig = action.payload.row?.config || {};
      let ids = [];
      let status = tableElement?.data_source.status;

      if (
        getDataSourceType(tableElement?.data_source) === 'ParticipationLevel'
      ) {
        ids = tableElement?.data_source?.participation_level_ids || [];
        status = status ?? getParticipationStatus(ids, Boolean(event));
      } else {
        ids = tableElement?.data_source.ids;
      }

      return {
        ...state,
        rowPanel: {
          ...state.rowPanel,
          source: getDataTypeSource(
            getDataSourceType(tableElement?.data_source)
          ),
          calculation: action.payload.row.table_element?.calculation,
          calculation_params: calculationParams,
          isEditMode: true,
          rowId: action.payload.row.id,
          dataSource: {
            key_name: `${keyName}`,
            name: tableElement?.name,
            type: getDataSourceType(tableElement?.data_source),
            subtypes: tableElement?.data_source.subtypes || {},
            source: keyName.split('|')[0],
            variable: keyName.split('|')[1],
            id: tableElement?.data_source.id,
            kinds: tableElement?.data_source?.kinds,
            result: tableElement?.data_source?.result,
            position_ids: tableElement?.data_source?.position_ids,
            formation_ids: tableElement?.data_source?.formation_ids,
            status,
            ids,
            event,
          },
          population: [action.payload.row.population],
          time_scope: action.payload.row.time_scope,
          filters,
          config: rowConfig,
        },
        tableContainerId: action.payload.tableContainerId,
        tableType: action.payload.tableType,
        widgetId: action.payload.widgetId,
      };
    }
    case 'SET_TABLE_COLUMN_CALCULATION': {
      return {
        ...state,
        columnPanel: {
          ...state.columnPanel,
          calculation: action.payload.calculation,
        },
      };
    }
    case 'SET_TABLE_COLUMN_CALCULATION_PARAM': {
      return {
        ...state,
        columnPanel: {
          ...state.columnPanel,
          calculation_params: {
            ...state.columnPanel.calculation_params,
            [action.payload.calculationParam]: _cloneDeep(action.payload.value),
          },
        },
      };
    }
    case 'SET_TABLE_COLUMN_DATE_RANGE': {
      return {
        ...state,
        columnPanel: {
          ...state.columnPanel,
          time_scope: {
            ...state.columnPanel.time_scope,
            start_time: action.payload.range.start_date,
            end_time: action.payload.range.end_date,
          },
        },
      };
    }
    case 'SET_TABLE_COLUMN_METRICS': {
      return {
        ...state,
        columnPanel: {
          ...state.columnPanel,
          dataSource: {
            ...state.columnPanel.dataSource,
            type: 'TableMetric',
            key_name: action.payload.metric[0].key_name,
            source: action.payload.metric[0].key_name.split('|')[0],
            variable: action.payload.metric[0].key_name.split('|')[1],
          },
          name: action.payload.metric[0].name,
        },
      };
    }
    case 'SET_TABLE_COLUMN_DATASOURCE_TYPE': {
      return {
        ...state,
        columnPanel: {
          ...state.columnPanel,
          dataSource: {
            ...state.columnPanel.dataSource,
            type: action.payload.type,
          },
        },
      };
    }
    case 'SET_TABLE_COLUMN_DATASOURCE_IDS': {
      return {
        ...state,
        columnPanel: {
          ...state.columnPanel,
          dataSource: {
            ...state.columnPanel.dataSource,
            type: action.payload.type,
            ids: [...action.payload.ids],
          },
        },
      };
    }
    case 'SET_TABLE_COLUMN_ACTIVITY': {
      return {
        ...state,
        columnPanel: {
          ...state.columnPanel,
          dataSource: {
            ...state.columnPanel.dataSource,
            ids: action.payload.ids?.length
              ? [...action.payload.ids]
              : action.payload.ids,
            type: action.payload.type,
          },
        },
      };
    }
    case 'SET_TABLE_COLUMN_GAME_KINDS': {
      return {
        ...state,
        columnPanel: {
          ...state.columnPanel,
          dataSource: {
            ...state.columnPanel.dataSource,
            kinds: [...action.payload.kinds],
            type: action.payload.type,
          },
        },
      };
    }
    case 'SET_TABLE_ROW_GAME_KINDS': {
      return {
        ...state,
        rowPanel: {
          ...state.rowPanel,
          dataSource: {
            ...state.rowPanel.dataSource,
            kinds: [...action.payload.kinds],
            type: action.payload.type,
          },
        },
      };
    }
    case 'SET_TABLE_COLUMN_GAME_RESULT': {
      return {
        ...state,
        columnPanel: {
          ...state.columnPanel,
          dataSource: {
            result: action.payload.result,
            type: action.payload.type,
          },
        },
      };
    }
    case 'SET_TABLE_ROW_GAME_RESULT': {
      return {
        ...state,
        rowPanel: {
          ...state.rowPanel,
          dataSource: {
            name: state.rowPanel?.dataSource?.name,
            result: action.payload.result,
            type: action.payload.type,
          },
        },
      };
    }
    case 'SET_TABLE_COLUMN_TIME_IN_POSITIONS': {
      return {
        ...state,
        columnPanel: {
          ...state.columnPanel,
          dataSource: {
            ...state.columnPanel.dataSource,
            position_ids: action.payload.positions || [],
          },
        },
      };
    }
    case 'SET_TABLE_ROW_TIME_IN_POSITIONS': {
      return {
        ...state,
        rowPanel: {
          ...state.rowPanel,
          dataSource: {
            ...state.rowPanel.dataSource,
            position_ids: action.payload.positions || [],
          },
        },
      };
    }
    case 'SET_TABLE_COLUMN_TIME_IN_FORMATION': {
      return {
        ...state,
        columnPanel: {
          ...state.columnPanel,
          dataSource: {
            ...state.columnPanel.dataSource,
            formation_ids: action.payload.formations || [],
          },
        },
      };
    }
    case 'SET_TABLE_ROW_TIME_IN_FORMATION': {
      return {
        ...state,
        rowPanel: {
          ...state.rowPanel,
          dataSource: {
            ...state.rowPanel.dataSource,
            formation_ids: action.payload.formations || [],
          },
        },
      };
    }
    case 'SET_TABLE_COLUMN_STATUS': {
      return {
        ...state,
        columnPanel: {
          ...state.columnPanel,
          dataSource: {
            ...state.columnPanel.dataSource,
            type: action.payload.type,
            status: action.payload.status,
          },
        },
      };
    }
    case 'SET_TABLE_COLUMN_SUBTYPE': {
      return {
        ...state,
        columnPanel: {
          ...state.columnPanel,
          dataSource: {
            ...state.columnPanel.dataSource,
            subtypes: {
              ...state.columnPanel.dataSource.subtypes,
              [action.payload.subtype]: _cloneDeep(action.payload.value),
            },
          },
        },
      };
    }
    case 'SET_TABLE_COLUMN_POPULATION': {
      return {
        ...state,
        columnPanel: {
          ...state.columnPanel,
          population: action.payload.population,
        },
      };
    }
    case 'SET_TABLE_COLUMN_TITLE': {
      return {
        ...state,
        columnPanel: {
          ...state.columnPanel,
          name: action.payload.title,
        },
      };
    }
    case 'SET_TABLE_COLUMN_TIME_PERIOD': {
      return {
        ...state,
        columnPanel: {
          ...state.columnPanel,
          time_scope: {
            ...state.columnPanel.time_scope,
            time_period: action.payload.timePeriod,
          },
        },
      };
    }
    case 'SET_TABLE_COLUMN_TIME_PERIOD_LENGTH': {
      return {
        ...state,
        columnPanel: {
          ...state.columnPanel,
          time_scope: {
            ...state.columnPanel.time_scope,
            time_period_length: action.payload.timePeriodLength,
          },
        },
      };
    }
    case 'SET_TABLE_COLUMN_TIME_PERIOD_CONFIG': {
      return {
        ...state,
        columnPanel: {
          ...state.columnPanel,
          time_scope: {
            ...state.columnPanel.time_scope,
            config: action.payload.config,
          },
        },
      };
    }
    case 'SET_TABLE_COLUMN_TIME_PERIOD_LENGTH_OFFSET': {
      return {
        ...state,
        columnPanel: {
          ...state.columnPanel,
          time_scope: {
            ...state.columnPanel.time_scope,
            time_period_length_offset: action.payload.timePeriodLengthOffset,
          },
        },
      };
    }
    case 'SET_TABLE_ELEMENT_FILTER': {
      const panel = `${action.payload.panel}Panel`;

      return {
        ...state,
        [panel]: {
          ...state[panel],
          filters: {
            ...state[panel].filters,
            [action.payload.filter]: _cloneDeep(action.payload.value),
          },
        },
      };
    }
    case 'SET_TABLE_ROW_CALCULATION': {
      return {
        ...state,
        rowPanel: {
          ...state.rowPanel,
          calculation: action.payload.calculation,
        },
      };
    }
    case 'SET_TABLE_ROW_CALCULATION_PARAM': {
      return {
        ...state,
        rowPanel: {
          ...state.rowPanel,
          calculation_params: {
            ...state.rowPanel.calculation_params,
            [action.payload.calculationParam]: _cloneDeep(action.payload.value),
          },
        },
      };
    }
    case 'SET_TABLE_ROW_DATE_RANGE': {
      return {
        ...state,
        rowPanel: {
          ...state.rowPanel,
          time_scope: {
            ...state.rowPanel.time_scope,
            start_time: action.payload.range.start_date,
            end_time: action.payload.range.end_date,
          },
        },
      };
    }
    case 'SET_TABLE_ROW_TITLE': {
      return {
        ...state,
        rowPanel: {
          ...state.rowPanel,
          name: action.payload.title,
          dataSource: {
            ...state.rowPanel.dataSource,
            name: action.payload.title,
          },
        },
      };
    }
    case 'SET_TABLE_ROW_METRICS': {
      return {
        ...state,
        rowPanel: {
          ...state.rowPanel,
          dataSource: {
            ...state.rowPanel.dataSource,
            type: 'TableMetric',
            key_name: action.payload.metric[0].key_name,
            name: action.payload.metric[0].name,
            source: action.payload.metric[0].key_name.split('|')[0],
            variable: action.payload.metric[0].key_name.split('|')[1],
          },
        },
      };
    }
    case 'SET_TABLE_ROW_ACTIVITY': {
      return {
        ...state,
        rowPanel: {
          ...state.rowPanel,
          dataSource: {
            ...state.rowPanel.dataSource,
            ids: action.payload.ids?.length
              ? [...action.payload.ids]
              : action.payload.ids,
            type: action.payload.type,
            name: action.payload.name || state.rowPanel.dataSource.name,
          },
        },
      };
    }
    case 'SET_TABLE_ROW_DATASOURCE_IDS': {
      return {
        ...state,
        rowPanel: {
          ...state.rowPanel,
          dataSource: {
            ...state.rowPanel.dataSource,
            ids: [...action.payload.ids],
            type: action.payload.type,
            name: action.payload.name,
          },
        },
      };
    }
    case 'SET_TABLE_ROW_DATASOURCE_TYPE': {
      return {
        ...state,
        rowPanel: {
          ...state.rowPanel,
          dataSource: {
            ...state.rowPanel.dataSource,
            type: action.payload.type,
          },
        },
      };
    }
    case 'SET_TABLE_ROW_STATUS': {
      return {
        ...state,
        rowPanel: {
          ...state.rowPanel,
          dataSource: {
            ...state.rowPanel.dataSource,
            type: action.payload.type,
            status: action.payload.status,
            name: action.payload.name,
          },
        },
      };
    }
    case 'SET_TABLE_ROW_SUBTYPE': {
      return {
        ...state,
        rowPanel: {
          ...state.rowPanel,
          dataSource: {
            ...state.rowPanel.dataSource,
            subtypes: {
              ...state.rowPanel.dataSource.subtypes,
              [action.payload.subtype]: _cloneDeep(action.payload.value),
            },
          },
        },
      };
    }
    case 'SET_TABLE_ROW_POPULATION': {
      return {
        ...state,
        rowPanel: {
          ...state.rowPanel,
          population: action.payload.population,
        },
      };
    }
    case 'SET_TABLE_ROW_GROUPING': {
      return {
        ...state,
        rowPanel: {
          ...state.rowPanel,
          config: {
            groupings: action.payload.groupings,
          },
        },
      };
    }
    case 'SET_TABLE_ROW_TIME_PERIOD': {
      return {
        ...state,
        rowPanel: {
          ...state.rowPanel,
          time_scope: {
            ...state.rowPanel.time_scope,
            time_period: action.payload.timePeriod,
            start_time: null,
            end_time: null,
          },
        },
      };
    }
    case 'SET_TABLE_ROW_TIME_PERIOD_LENGTH': {
      return {
        ...state,
        rowPanel: {
          ...state.rowPanel,
          time_scope: {
            ...state.rowPanel.time_scope,
            time_period_length: action.payload.timePeriodLength,
          },
        },
      };
    }
    case 'SET_TABLE_ROW_TIME_PERIOD_LENGTH_OFFSET': {
      return {
        ...state,
        rowPanel: {
          ...state.rowPanel,
          time_scope: {
            ...state.rowPanel.time_scope,
            time_period_length_offset: action.payload.timePeriodLengthOffset,
          },
        },
      };
    }
    case 'TOGGLE_TABLE_COLUMN_PANEL': {
      return {
        ...state,
        appliedColumns: [],
        appliedRows: [],
        columnPanel: {
          source: null,
          calculation: '',
          columnId: null,
          dataSource: {},
          isEditMode: false,
          name: '',
          population: {
            applies_to_squad: false,
            position_groups: [],
            positions: [],
            athletes: [],
            all_squads: false,
            squads: [],
          },
          time_scope: {
            time_period: '',
            start_time: undefined,
            end_time: undefined,
            time_period_length: undefined,
          },
          requestStatus: {
            status: 'dormant',
            data: {},
          },
          filters: {
            time_loss: [],
            session_type: [],
            competitions: [],
            event_types: [],
            training_session_types: [],
            match_days: [],
          },
        },
        tableContainerId: null,
        tableName: '',
        tableType: '',
        widgetId: null,
      };
    }
    case 'TOGGLE_TABLE_ROW_PANEL': {
      return {
        ...state,
        appliedColumns: [],
        appliedRows: [],
        rowPanel: {
          source: null,
          calculation: '',
          isEditMode: false,
          dataSource: {},
          population: [],
          time_scope: {
            time_period: '',
            start_time: undefined,
            end_time: undefined,
            time_period_length: undefined,
          },
          requestStatus: {
            status: 'dormant',
            data: {},
          },
          filters: {
            time_loss: [],
            session_type: [],
            competitions: [],
            event_types: [],
            training_session_types: [],
          },
        },
        tableContainerId: null,
        tableName: '',
        tableType: '',
        widgetId: null,
      };
    }
    case 'DUPLICATE_COLUMN_IS_LOADING': {
      return {
        ...state,
        duplicateColumn: {
          ...state.duplicateColumn,
          loading: _uniq([
            ...state.duplicateColumn.loading,
            action.payload.columnId,
          ]),
        },
      };
    }
    case 'DUPLICATE_COLUMN_SUCCESS': {
      const newLoading = [...state.duplicateColumn.loading];

      newLoading.splice(newLoading.indexOf(action.payload.id), 1);

      return {
        ...state,
        duplicateColumn: {
          ...state.duplicateColumn,
          loading: newLoading,
        },
      };
    }
    case 'DUPLICATE_COLUMN_ERROR': {
      const newLoading = [...state.duplicateColumn.loading];

      newLoading.splice(newLoading.indexOf(action.payload.id), 1);

      return {
        ...state,
        duplicateColumn: {
          ...state.duplicateColumn,
          loading: newLoading,
          error: _uniq([
            ...state.duplicateColumn.error,
            action.payload.columnId,
          ]),
        },
      };
    }
    case 'CLEAR_DUPLICATE_COLUMN_ERROR': {
      const newError = [...state.duplicateColumn.error];

      newError.splice(newError.indexOf(action.payload.id), 1);

      return {
        ...state,
        duplicateColumn: {
          ...state.duplicateColumn,
          error: newError,
        },
      };
    }
    case 'SET_TABLE_COLUMN_EVENT_TYPE': {
      return {
        ...state,
        columnPanel: {
          ...state.columnPanel,
          dataSource: {
            ...state.columnPanel.dataSource,
            event: action.payload.event,
            type: action.payload.type,
          },
        },
      };
    }
    case 'SET_TABLE_ROW_EVENT_TYPE': {
      return {
        ...state,
        rowPanel: {
          ...state.rowPanel,
          dataSource: {
            ...state.rowPanel.dataSource,
            event: action.payload.event,
            type: action.payload.type,
          },
        },
      };
    }
    case 'SET_COLUMN_PANEL_INPUT_PARAMS': {
      const dataSource = formatParamsToDataSource(action.payload.params);
      const name = action.payload.params.data?.[0]?.name;

      return {
        ...state,
        columnPanel: {
          ...state.columnPanel,
          dataSource: {
            ...state.columnPanel.dataSource,
            ...dataSource,
          },
          ...(name && { name }),
        },
      };
    }
    case 'SET_ROW_PANEL_INPUT_PARAMS': {
      const dataSource = formatParamsToDataSource(action.payload.params);
      const name = action.payload.params.data?.[0]?.name;

      return {
        ...state,
        rowPanel: {
          ...state.rowPanel,
          dataSource: {
            ...state.rowPanel.dataSource,
            ...dataSource,
          },
          ...(name && { name }),
        },
      };
    }
    default:
      return state;
  }
}
