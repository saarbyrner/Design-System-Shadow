// @flow
import i18n from '@kitman/common/src/utils/i18n';

export const SCROLL_BAR_HEIGHT = 10;
export const LEGEND_HEIGHT = 50;
export const MIN_SPACING_LABEL = 2;

export const AXIS_LABLE_MAX_WIDTH = {
  horizontal: 100,
  vertical: 100,
};

export const SERIES_TYPES = {
  bar: 'bar',
  line: 'line',
  area: 'area',
};

export const AGGREGATE_PERIOD = {
  daily: 'daily',
  weekly: 'weekly',
  monthly: 'monthly',
};

export const AGGREGATE_METHOD = {
  sum: 'sum',
  mean: 'mean',
  min: 'min',
  max: 'max',
  last: 'last',
  percentage: 'percentage',
};

export const getTooltipTranslations = () => ({
  weekly: i18n.t('Week starting'),
  monthly: i18n.t('Month starting'),
});

export const AXIS_CONFIG = {
  left: 'left',
  right: 'right',
};

export const FORMATTING_RULE_TYPES = {
  reference_line: 'reference_line',
  background_zone: 'zone',
};

export const SORT_ORDER = {
  HIGH_TO_LOW: 'highToLow',
  LOW_TO_HIGH: 'lowToHigh',
  ALPHABETICAL: 'alphabetical',
  DEFAULT: 'default',
};

export const CHART_ELEMENT_ERROR = {
  INVALID_GROUPING: 'invalidGrouping',
};

export const AREA_SERIES_OPACITY = 0.4;
