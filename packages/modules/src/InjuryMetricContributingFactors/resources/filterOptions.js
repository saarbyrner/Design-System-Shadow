// @flow
import i18n from '@kitman/common/src/utils/i18n';

export const multiSelectExposureOptions = () => [
  {
    id: 'game',
    name: i18n.t('Games'),
  },
  {
    id: 'training_session',
    name: i18n.t('Session'),
  },
];

export const multiSelectMechanismOptions = () => [
  {
    id: 'contact',
    name: i18n.t('Contact'),
  },
  {
    id: 'non_contact',
    name: i18n.t('Non contact'),
  },
];
