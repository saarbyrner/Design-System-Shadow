// @flow
import i18n from '@kitman/common/src/utils/i18n';
import { FORMATTING_RULE_TYPES } from '@kitman/modules/src/analysis/shared/components/XYChart/constants';
import type {
  TableWidgetFormatRule,
  WidgetType,
} from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/types';
import type { ChartWidgetFormatRule, WidgetFormatRule } from './types';

export const getTableWidgetConditions = (selectedRuleType: string) => {
  const commonConditions = [
    {
      value: 'equal_to',
      label: i18n.t('Equal to'),
    },
  ];

  const conditionsByType = {
    numeric: [
      {
        value: 'less_than',
        label: i18n.t('Less than'),
      },
      {
        value: 'greater_than',
        label: i18n.t('Greater than'),
      },
    ],
    string: [
      {
        value: 'not_equal_to',
        label: i18n.t('Not equal to'),
      },
    ],
  };

  const typeConditions = conditionsByType[selectedRuleType] || [];

  return [...typeConditions, ...commonConditions];
};

export const getChartWidgetConditions = (selectedRuleType: string) => {
  const commonConditions = [
    {
      value: 'less_than',
      label: i18n.t('If less than'),
    },
    {
      value: 'greater_than',
      label: i18n.t('If greater than'),
    },
  ];

  const conditionsByType = {
    zone: [
      {
        value: 'between',
        label: i18n.t('Between'),
      },
    ],
    [FORMATTING_RULE_TYPES.reference_line]: [
      {
        value: 'equal_to',
        label: i18n.t('Equal to'),
      },
    ],
  };

  const typeConditions = conditionsByType[selectedRuleType] || [];

  const result =
    selectedRuleType === FORMATTING_RULE_TYPES.reference_line
      ? typeConditions
      : [...typeConditions, ...commonConditions];
  return result;
};

export const getWidgetConditions = (
  widgetType: WidgetType,
  selectedRuleType: string
) => {
  switch (widgetType) {
    case 'COMPARISON':
    case 'LONGITUDINAL':
    case 'SCORECARD':
      return getTableWidgetConditions(selectedRuleType);
    case 'xy':
      return getChartWidgetConditions(selectedRuleType);
    default:
      return [];
  }
};

export const getTableWidgetRules = () => {
  return [
    {
      value: 'numeric',
      label: i18n.t('Numeric'),
    },
    ...(window.getFlag('table-widget-availability-data-type')
      ? [
          {
            value: 'string',
            label: i18n.t('Text'),
          },
        ]
      : []),
  ];
};

export const getChartWidgetRules = () => {
  return [
    {
      value: 'zone',
      label: i18n.t('Zone'),
    },
    {
      value: 'reference_line',
      label: i18n.t('Reference Line'),
    },
  ];
};

export const getWidgetRules = (widgetType: WidgetType) => {
  switch (widgetType) {
    case 'COMPARISON':
    case 'LONGITUDINAL':
    case 'SCORECARD':
      return getTableWidgetRules();
    case 'xy':
      return getChartWidgetRules();
    default:
      return [];
  }
};

/**
 * Util that checks whether formatting rules are valid for table widget
 * * Required fields: type, condition, color, value (all fields)
 *
 * @param {Array<TableWidgetFormatRule>} appliedFormat the table widget formatting rules
 * @returns Boolean whether the rules are valid
 */
export const isTableWidgetRuleSelectionValid = (
  appliedFormat: Array<TableWidgetFormatRule>
) => {
  let valid = true;
  appliedFormat.forEach((format) => {
    if (
      Object.keys(format).some((key) => {
        return format[key] === null;
      })
    ) {
      valid = false;
    }
  });
  return valid;
};

/**
 * Util that checks whether formatting rules are valid for chart widget
 * Required fields: type, condition, color
 * If value is null, to and from are required
 * Or value is required
 *
 * @param {Array<ChartWidgetFormatRule>} appliedFormat the chart widget formatting rules
 * @returns Boolean whether the rules are valid
 */
export const isChartWidgetRuleSelectionValid = (
  appliedFormat: Array<ChartWidgetFormatRule>
) => {
  let valid = true;
  appliedFormat.forEach((format) => {
    // Validating required fields
    if (!format.type || !format.condition || !format.color) {
      valid = false;
      return;
    }

    // Validating value/to/from logic
    if (!format.value) {
      // If value is null, both to and from need to have values
      if (!format.to || !format.from) {
        valid = false;
      }
    }
  });

  return valid;
};

/**
 * Util that checks whether formatting rules are valid for table or chart widget
 *
 * @param {WidgetType} widgetType the type of the widget
 * @param {Array<ChartWidgetFormatRule>} appliedFormat the chart widget formatting rules
 * @returns Boolean whether the rules are valid
 */
export const isRuleSelectionValid = (
  widgetType: WidgetType,
  appliedFormat: Array<WidgetFormatRule>
) => {
  switch (widgetType) {
    case 'COMPARISON':
    case 'LONGITUDINAL':
    case 'SCORECARD':
      // $FlowIgnore - we know this is type TableWidgetFormatRule because of the widgetType check
      return isTableWidgetRuleSelectionValid(appliedFormat);
    case 'xy':
      // $FlowIgnore - we know this is type ChartWidgetFormatRule because of the widgetType check
      return isChartWidgetRuleSelectionValid(appliedFormat);
    default:
      return false;
  }
};
