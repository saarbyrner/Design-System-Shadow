// @flow
import i18n from '@kitman/common/src/utils/i18n';

export const alarmTypeOptions = () => [
  {
    id: 'numeric',
    title: i18n.t('Numeric'),
  },
  {
    id: 'percentage',
    title: i18n.t('Percentage'),
  },
];

export const alarmCalculationOptions = () => [
  {
    id: 'sum',
    title: i18n.t('Sum'),
  },
  {
    id: 'mean',
    title: i18n.t('Mean'),
  },
  {
    id: 'max',
    title: i18n.t('Max'),
  },
  {
    id: 'min',
    title: i18n.t('Min'),
  },
  {
    id: 'count',
    title: i18n.t('Count'),
  },
];

export const numericAlarmConditions = () => [
  {
    title: i18n.t('Less than'),
    id: 'less_than',
  },
  {
    title: i18n.t('Greater than'),
    id: 'greater_than',
  },
  {
    title: i18n.t('Equal to'),
    id: 'equals',
  },
];

export const percentageAlarmConditions = () => [
  {
    title: i18n.t('Less than'),
    id: 'less_than',
  },
  {
    title: i18n.t('Greater than'),
    id: 'greater_than',
  },
  {
    title: i18n.t('Equal to'),
    id: 'equals',
  },
];
