// @flow
import omitBy from 'lodash/omitBy';
import isArray from 'lodash/isArray';
import isNull from 'lodash/isNull';
import isEmpty from 'lodash/isEmpty';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import { MEDICAL_DATA_SOURCES } from '@kitman/modules/src/analysis/shared/constants';
import moment from 'moment';
import compact from 'lodash/compact';
import { DATA_STATUS } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/consts';
import { humanizeTimestamp } from '@kitman/common/src/utils/dateFormatter';
import i18n from '@kitman/common/src/utils/i18n';
// Types
import type {
  TableWidgetSourceSubtypes,
  TableGroupingsConfig,
} from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/types';
import type { InputParams } from '@kitman/modules/src/analysis/shared/types/charts';
import {
  DATA_SOURCES,
  DATA_SOURCE_TYPES,
  PARTICIPATION_STATUS,
  type DataSourceInputParams,
} from '@kitman/modules/src/analysis/Dashboard/components/types';
import type { SquadAthletesSelection } from '@kitman/components/src/types';
import { isV2MultiCodingSystem } from '@kitman/modules/src/Medical/shared/utils';
import { searchParams } from '@kitman/common/src/utils';
import type {
  TableWidgetElementSource,
  TableWidgetDataSource,
} from '../components/TableWidget/types';
import type { DataSourceInput } from '../components/ChartBuilder/types';

// Requested change per coding system.
// Reference: <https://kitmanlabs.atlassian.net/browse/REP-117>
export const updateDataSourceSubtypesForCodingSystems = (subtypes: Object) => {
  function updateKeysWithPrefix(input, prefixes) {
    const output = {};
    Object.entries(input).forEach(([key, value]) => {
      let updatedKey = key;
      prefixes.forEach((prefix) => {
        if (key.endsWith(prefix)) {
          updatedKey = prefix;
        }
      });
      output[updatedKey] = value;
    });
    return output;
  }
  const prefixes = [
    'pathology_ids',
    'classification_ids',
    'body_area_ids',
    'code_ids',
  ];
  const updatedSubtypesWithoutCodingPrefix = updateKeysWithPrefix(
    subtypes,
    prefixes
  );
  const parsedDataSourceSubtypes = {};
  Object.entries(updatedSubtypesWithoutCodingPrefix).forEach(
    ([subtype, ids]) => {
      if (isArray(ids)) {
        // Pathology and Code selector use AsyncSelect component which returns `{value, label}`
        // They are ONLY AsyncSelect components when coding system key is NOT OSICS_10
        // $FlowFixMe
        parsedDataSourceSubtypes[subtype] = ids.map((id) => id.value ?? id);
      } else {
        parsedDataSourceSubtypes[subtype] = ids;
      }
    }
  );
  return parsedDataSourceSubtypes;
};

// Helper to handle subtypes for MedicalInjury, MedicalIllness and RehabSessionExercise
export const handleMedicalSubtypes = (
  subtypes: ?TableWidgetSourceSubtypes,
  codingSystemKey: string | typeof undefined
) => {
  let filteredSubtypes = {
    ...omitBy(
      subtypes,
      (value) => (isArray(value) && value.length === 0) || isNull(value)
    ),
  };

  if (
    window.getFlag('coding-system-osiics-15') &&
    codingSystemKey &&
    isV2MultiCodingSystem(codingSystemKey)
  ) {
    filteredSubtypes =
      updateDataSourceSubtypesForCodingSystems(filteredSubtypes);
    /**
     * filteredSubtypes keys may have prefix e.g `osiics_15_pathology_ids` or `osiics_15_code_ids`
     *
     * When the organisation coding system is osiics 15 the coding system must be removed from the following keys:
     * classification_ids
     * body_area_ids
     * code_ids
     * side_ids
     * pathology_ids
     */
    Object.keys(filteredSubtypes).forEach((key) => {
      if (key.startsWith(`${codingSystemKeys.OSIICS_15}_`)) {
        filteredSubtypes[key.replace(`${codingSystemKeys.OSIICS_15}_`, '')] =
          isArray(filteredSubtypes[key])
            ? compact(filteredSubtypes[key])
            : filteredSubtypes[key];
        delete filteredSubtypes[key];
      }
    });

    return filteredSubtypes;
  }

  if (codingSystemKey) {
    return updateDataSourceSubtypesForCodingSystems(filteredSubtypes);
  }

  return filteredSubtypes;
};

export const getInputParamsFromDataSource = (
  dataSource: TableWidgetElementSource | typeof undefined,
  codingSystemKey?: string
) => {
  if (!dataSource) {
    return {};
  }
  const dataSourceType = dataSource.data_source_type || dataSource.type;
  const involvementType =
    dataSource?.status === 'game_involvement' ? 'game' : null;

  if (
    MEDICAL_DATA_SOURCES.includes(dataSourceType) &&
    window.getFlag('multi-coding-pipeline-table-widget')
  ) {
    const inputParamsSubtypes = handleMedicalSubtypes(
      dataSource.subtypes,
      codingSystemKey
    );

    return {
      coding_system: codingSystemKey,
      subtypes: inputParamsSubtypes,
    };
  }

  switch (dataSourceType) {
    case DATA_SOURCE_TYPES.tableMetric:
      return {
        variable: dataSource.variable,
        source: dataSource.source,
      };
    case DATA_SOURCE_TYPES.availability:
      return {
        status: dataSource.status,
      };
    case DATA_SOURCE_TYPES.participationLevel:
      return {
        participation_level_ids:
          // $FlowIgnore sometimes `participation_level_ids` make it through to the data source (for duplicate + edit)
          dataSource.ids || dataSource.participation_level_ids,
        involvement_event_type: dataSource.event ?? involvementType,
        status: dataSource.status,
      };
    case 'MedicalInjury':
    case 'MedicalIllness':
    case 'RehabSessionExercise': {
      if (
        window.getFlag('coding-system-osiics-15') &&
        codingSystemKey &&
        isV2MultiCodingSystem(codingSystemKey)
      ) {
        return {
          coding_system: codingSystemKey,
          subtypes: handleMedicalSubtypes(dataSource.subtypes, codingSystemKey),
        };
      }

      return {
        subtypes: handleMedicalSubtypes(dataSource.subtypes),
      };
    }
    case DATA_SOURCE_TYPES.gameActivity:
      return {
        kinds: dataSource.kinds,
        position_ids: dataSource.position_ids,
        formation_ids: dataSource.formation_ids,
      };
    case DATA_SOURCE_TYPES.gameResultAthlete:
      return {
        result: dataSource.result,
      };
    case DATA_SOURCE_TYPES.maturityEstimate:
      return {
        training_variable_ids: dataSource.training_variable_ids,
      };
    case DATA_SOURCE_TYPES.formula:
      return { A: dataSource?.A, B: dataSource?.B };
    default:
      return {
        ids: dataSource.ids,
      };
  }
};

export const getDataSourceType = (dataSource: ?TableWidgetElementSource) => {
  if (dataSource) {
    return dataSource.data_source_type || dataSource.type;
  }

  return '';
};

export const getNonEmptyParams = (paramName: string, params?: Object) => {
  const newParams = omitBy(
    params,
    (value) => (isArray(value) && value.length === 0) || isNull(value)
  );

  if (isEmpty(newParams)) {
    return {};
  }

  return {
    [paramName]: {
      ...newParams,
    },
  };
};

/**
 * Formats the chart element input_params based on the dataSourceType allowing
 * us to correectly format for the backend.
 *
 * @param {TableWidgetDataSource} dataSourceType The data source type.
 * @param {DataSourceInput} data The structure of data types received from the
 *  backend and rendered in the modules. It will combine all data types so it
 *  can be used to correctly type and format the data in this function.
 */
export const formatChartInputParams = (
  dataSourceType: TableWidgetDataSource | typeof undefined,
  data: Array<DataSourceInput> | string
) => {
  if (!(data && Array.isArray(data))) return {};
  const [params = {}] = data;

  switch (dataSourceType) {
    case DATA_SOURCE_TYPES.tableMetric:
      return {
        source: params?.key_name?.split('|')[0],
        variable: params?.key_name?.split('|')[1],
      };
    case DATA_SOURCE_TYPES.principle:
    case DATA_SOURCE_TYPES.eventActivityType:
    case DATA_SOURCE_TYPES.eventActivityTypeCategory:
    case DATA_SOURCE_TYPES.principleType:
    case DATA_SOURCE_TYPES.principleCategory:
    case DATA_SOURCE_TYPES.principlePhase:
    case DATA_SOURCE_TYPES.eventActivityDrillLabel:
      return { ids: params.ids, type: dataSourceType };
    case DATA_SOURCE_TYPES.gameActivity:
      return {
        kinds: params.kinds,
        position_ids: params.position_ids,
        formation_ids: params.formation_ids,
      };
    case DATA_SOURCE_TYPES.gameResultAthlete:
      return { result: params.result };
    case DATA_SOURCE_TYPES.availability:
      return { status: params.status };
    case DATA_SOURCE_TYPES.participationLevel:
      return {
        status: params.status,
        participation_level_ids: params.ids,
        involvement_event_type:
          params.status === 'game_involvement' ? 'game' : null,
      };
    case DATA_SOURCE_TYPES.maturityEstimate:
      return { training_variable_ids: [params] };
    default:
      return {};
  }
};

export const getDataTypeSource = (
  dataSourceType: TableWidgetDataSource
): TableWidgetDataSource => {
  switch (dataSourceType) {
    case DATA_SOURCE_TYPES.principle:
    case DATA_SOURCE_TYPES.eventActivityType:
    case DATA_SOURCE_TYPES.eventActivityTypeCategory:
    case DATA_SOURCE_TYPES.principleType:
    case DATA_SOURCE_TYPES.principleCategory:
    case DATA_SOURCE_TYPES.principlePhase:
    case DATA_SOURCE_TYPES.eventActivityDrillLabel:
      return DATA_SOURCES.activity;
    case DATA_SOURCE_TYPES.gameActivity:
    case DATA_SOURCE_TYPES.gameResultAthlete:
      return DATA_SOURCES.games;
    case DATA_SOURCE_TYPES.availability:
      return DATA_SOURCES.availability;
    case DATA_SOURCE_TYPES.participationLevel:
      return DATA_SOURCES.participation;
    case 'MedicalInjury':
    case 'MedicalIllness':
    case 'RehabSessionExercise':
      return DATA_SOURCES.medical;
    case DATA_SOURCE_TYPES.formula:
      return DATA_SOURCES.formula;
    case DATA_SOURCE_TYPES.maturityEstimate:
      return DATA_SOURCES.growthAndMaturation;
    case DATA_SOURCE_TYPES.tableMetric:
    default:
      return DATA_SOURCES.metric;
  }
};

export const isValidSourceForMatchDayFilter = (source: string): boolean =>
  [
    DATA_SOURCES.metric,
    DATA_SOURCES.activity,
    DATA_SOURCES.participation,
  ].includes(source);

export const isValidSourceForSessionTypeFilter = (source: string): boolean =>
  source !== DATA_SOURCES.growthAndMaturation;

// Utility function to format input_params based on the coding system associated with medical data source.
export const formatDataSourceInputParams = (
  inputParams: InputParams,
  type: TableWidgetDataSource,
  codingSystemKey?: string
) => {
  if (!inputParams) {
    return {};
  }

  if (
    MEDICAL_DATA_SOURCES.includes(type) &&
    window.getFlag('multi-coding-pipeline-table-widget')
  ) {
    const inputParamsSubtypes = handleMedicalSubtypes(
      inputParams.subtypes,
      codingSystemKey
    );

    if (
      !inputParamsSubtypes ||
      !Object.keys(inputParamsSubtypes).length ||
      Object.values(inputParamsSubtypes).includes(null)
    ) {
      return {};
    }

    return {
      coding_system: codingSystemKey,
      subtypes: inputParamsSubtypes,
    };
  }

  switch (type) {
    case 'MedicalInjury':
    case 'MedicalIllness':
    case 'RehabSessionExercise':
      return {
        subtypes: handleMedicalSubtypes(inputParams.subtypes),
      };
    default:
      return inputParams;
  }
};

export const getParticipationStatus = (
  ids: string[],
  hasEventType?: boolean
): string => {
  if (hasEventType) {
    return 'game_involvement';
  }

  return ids.length === 0 ? 'participation_status' : 'participation_levels';
};

export const sanitizeChartTitle = (title: string): string => {
  const isPercentIncluded = title.includes('%');

  if (isPercentIncluded) {
    const isTitleSanitized = title.includes('%25');

    return isTitleSanitized ? title : title.replace(/%/g, '%25');
  }

  return title;
};

export const getChartTitle = (title: string): string => {
  const isPercentIncluded = title.includes('%');

  if (isPercentIncluded) {
    return title.replace(/%25/g, '%');
  }

  return title;
};

export const formatParamsToDataSource = (params: DataSourceInputParams) => {
  switch (params.type) {
    case DATA_SOURCE_TYPES.tableMetric:
      return {
        type: params.type,
        key_name: params.data[0].key_name,
        source: params.data[0].key_name?.split('|')[0],
        variable: params.data[0].key_name?.split('|')[1],
      };
    case DATA_SOURCE_TYPES.principle:
    case DATA_SOURCE_TYPES.eventActivityType:
    case DATA_SOURCE_TYPES.eventActivityTypeCategory:
    case DATA_SOURCE_TYPES.principleType:
    case DATA_SOURCE_TYPES.principleCategory:
    case DATA_SOURCE_TYPES.principlePhase:
    case DATA_SOURCE_TYPES.eventActivityDrillLabel:
      return {
        type: params.type,
        ids: params.data[0].ids?.length
          ? [...params.data[0].ids]
          : params.data[0].ids,
      };
    case DATA_SOURCE_TYPES.participationLevel:
      return {
        type: params.type,
        ...(params.data[0].status && { status: params.data[0].status }),
        ...(params.data[0].ids && { ids: [...params.data[0].ids] }),
        event:
          params.data[0]?.status === PARTICIPATION_STATUS.gameInvolvement
            ? params.data[0].event
            : null,
      };
    case DATA_SOURCE_TYPES.gameActivity:
      return {
        type: params.type,
        kinds: params.data[0]?.kinds,
        formation_ids: params.data[0]?.formation_ids,
        position_ids: params.data[0]?.position_ids,
      };
    case DATA_SOURCE_TYPES.gameResultAthlete:
      return {
        type: params.type,
        result: params.data[0].result,
        kinds: undefined, // restore to default
      };
    case DATA_SOURCE_TYPES.availability:
      return {
        type: params.type,
        status: params.data[0].status,
      };
    case DATA_SOURCE_TYPES.maturityEstimate:
      return {
        type: params.type,
        training_variable_ids: params.data,
      };
    default:
      return {};
  }
};

/**
 * This method takes an array of dates
 * and sorts them from oldest to newest
 *
 * @param {Array<?Date>} timestamps array of Dates or nulls
 * @returns sorted timestamps
 */
export const sortCacheTimestamps = (
  timestamps: Array<?Date>
): Array<moment> => {
  const dates: moment[] = timestamps
    .filter(Boolean)
    .map((timestamp) => moment(timestamp));

  dates.sort((a, b) => a.diff(b));

  return dates;
};

/**
 * Util that append the groupings to the population object
 * @param {Array<SquadAthletesSelection>} population the population object
 * @param {Object} groupings the groupings object
 * @returns {Array<Object> | Object} object or array of objects with population and config properties
 */
export const applyPopulationGrouping = (
  population: Array<SquadAthletesSelection>,
  groupings: TableGroupingsConfig
): Array<Object> => {
  if (!Array.isArray(population)) {
    return population;
  }

  return population.map((item, index) => {
    const groupingValue = groupings[index];
    const config =
      !groupingValue || groupingValue === 'no_grouping'
        ? null
        : { groupings: [groupingValue] };

    return {
      population: item,
      config,
    };
  });
};

export const getDashboardCachedAtContent = (
  cachedAt: string,
  dataStatus: string,
  locale: string
) => {
  if (
    (!window.getFlag('rep-table-widget-caching') &&
      !window.getFlag('rep-charts-v2-caching')) ||
    !cachedAt
  ) {
    return '';
  }

  if (dataStatus === DATA_STATUS.caching) {
    return i18n.t('Calculating...');
  }

  return `${i18n.t('Last Calculated:')} ${humanizeTimestamp(
    locale || navigator.language,
    cachedAt
  )}`;
};

export const formatPopulationPayload = (
  population: Array<SquadAthletesSelection>,
  config: ?{ groupings: TableGroupingsConfig },
  isEditMode: boolean
) => {
  if (isEditMode) {
    return applyPopulationGrouping(population, config?.groupings || {})[0];
  }

  return {
    bulk_population: applyPopulationGrouping(
      population,
      config?.groupings || {}
    ),
  };
};

export const isDashboardPivoted = () => !!searchParams('pivot');
