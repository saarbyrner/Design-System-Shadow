// @flow
import _isEmpty from 'lodash/isEmpty';
import i18n from '@kitman/common/src/utils/i18n';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import {
  EVENT_TIME_PERIODS,
  MEDICAL_DATA_SOURCES,
} from '@kitman/modules/src/analysis/shared/constants';

// Types
import type { TableWidgetElementSource } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/types';
import type { CodingSystemKey } from '@kitman/common/src/types/Coding';
import type { TimeScopeConfig } from '@kitman/modules/src/analysis/Dashboard/components/types';

export const inlineMaxWidth = 380;

const isInvalidPeriodLength = (value) => value === 0 || !value;

const validateGameActivity = (dataSource: TableWidgetElementSource) => {
  if (dataSource.kinds?.includes('position_change')) {
    return !_isEmpty(dataSource.position_ids);
  }

  if (dataSource.kinds?.includes('formation_change')) {
    return !_isEmpty(dataSource.formation_ids);
  }

  return !_isEmpty(dataSource.kinds);
};

export const isDateRangeValid = (
  timePeriodId: ?string,
  dateRange: ?Object,
  periodLength: ?number
) => {
  if (_isEmpty(timePeriodId)) {
    return false;
  }

  if (
    timePeriodId === EVENT_TIME_PERIODS.lastXEvents &&
    isInvalidPeriodLength(periodLength)
  ) {
    return false;
  }

  if (
    timePeriodId === EVENT_TIME_PERIODS.lastXDays &&
    isInvalidPeriodLength(periodLength)
  ) {
    return false;
  }

  return !(
    timePeriodId === EVENT_TIME_PERIODS.customDateRange && _isEmpty(dateRange)
  );
};

export const isDataSourceValid = (dataSource: TableWidgetElementSource) => {
  if (MEDICAL_DATA_SOURCES.includes(dataSource.type)) {
    return true;
  }

  if (dataSource.type === 'ParticipationLevel') {
    if (
      dataSource.status === 'participation_status' &&
      _isEmpty(dataSource.ids)
    ) {
      return true;
    }
    if (
      dataSource.status === 'participation_levels' &&
      !_isEmpty(dataSource.ids)
    ) {
      return true;
    }

    return dataSource.status === 'game_involvement';
  }

  if (dataSource.type === 'GameActivity') {
    return validateGameActivity(dataSource);
  }

  return !_isEmpty(dataSource);
};

export const getCodingSystemFilterOptions = (
  codingSystemKey: CodingSystemKey
) => {
  const prefix =
    window.getFlag('multi-coding-pipeline-table-widget') ||
    window.getFlag('coding-system-osiics-15')
      ? ''
      : `${codingSystemKey}_`;

  switch (codingSystemKey) {
    case codingSystemKeys.OSICS_10:
    case codingSystemKeys.DATALYS: {
      return [
        {
          label: i18n.t('Pathology'),
          value: `${prefix}pathology_ids`,
        },
        {
          label: i18n.t('Classification'),
          value: `${prefix}classification_ids`,
        },
        {
          label: i18n.t('Body area'),
          value: `${prefix}body_area_ids`,
        },
        {
          label: i18n.t('Code'),
          value: `${prefix}code_ids`,
        },
      ];
    }

    case codingSystemKeys.CLINICAL_IMPRESSIONS: {
      return [
        {
          label: i18n.t('Pathology'),
          value: `${prefix}pathology_ids`,
        },
        {
          label: i18n.t('Classification'),
          value: `${prefix}classification_ids`,
        },
        {
          label: i18n.t('Body area'),
          value: `${prefix}body_area_ids`,
        },
      ];
    }

    case codingSystemKeys.ICD: {
      return [
        {
          label: i18n.t('Pathology'),
          value: `${prefix}pathology_ids`,
        },
        {
          label: i18n.t('Body area'),
          value: `${prefix}body_area_ids`,
        },
        {
          label: i18n.t('Code'),
          value: `${prefix}code_ids`,
        },
      ];
    }

    case codingSystemKeys.OSIICS_15: {
      return [
        {
          label: i18n.t('Pathology'),
          value: `${prefix}pathology_ids`,
        },
        {
          label: i18n.t('Body Area'),
          value: `${prefix}body_area_ids`,
        },
        {
          label: i18n.t('Classification'),
          value: `${prefix}classification_ids`,
        },
      ];
    }
    default:
      return [];
  }
};

export const isValidOptionLength = (options: Object) =>
  Array.isArray(options) && options.length > 0;

export const isValidFormulaGrouping = (groupings: string[]) =>
  !!groupings && !_isEmpty(groupings);

export const getTimePeriodValue = (
  timePeriod: string,
  config?: TimeScopeConfig
) => {
  const eventTypes = config?.event_types;
  if (!eventTypes) return timePeriod;

  const hasGame = eventTypes.includes(EVENT_TIME_PERIODS.game);
  const hasTraining = eventTypes.includes(EVENT_TIME_PERIODS.trainingSession);

  switch (true) {
    case hasGame && hasTraining:
      return EVENT_TIME_PERIODS.lastXGamesAndSessions;
    case hasGame:
      return EVENT_TIME_PERIODS.lastXGames;
    case hasTraining:
      return EVENT_TIME_PERIODS.lastXSessions;
    default:
      return timePeriod;
  }
};
