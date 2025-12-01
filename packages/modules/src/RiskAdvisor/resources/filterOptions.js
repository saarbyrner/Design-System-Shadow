// @flow
import i18n from '@kitman/common/src/utils/i18n';

export const exposureOptions = () => [
  {
    value: 'game',
    label: i18n.t('Games'),
  },
  {
    value: 'training_session',
    label: i18n.t('Session'),
  },
];

export const mechanismOptions = () => [
  {
    value: 'contact',
    label: i18n.t('Contact'),
  },
  {
    value: 'non_contact',
    label: i18n.t('Non contact'),
  },
];

export const severityOptions = () => [
  {
    value: 'slight',
    label: i18n.t('Slight (0-1 days)'),
  },
  {
    value: 'minimal',
    label: i18n.t('Minimal (2-3 days)'),
  },
  {
    value: 'mild',
    label: i18n.t('Mild (4-7 days)'),
  },
  {
    value: 'moderate',
    label: i18n.t('Moderate (8-28 days)'),
  },
  {
    value: 'severe',
    label: i18n.t('Severe (29+ days)'),
  },
];
