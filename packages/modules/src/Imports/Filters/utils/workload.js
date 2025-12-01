// @flow

import i18n from '@kitman/common/src/utils/i18n';

export const getImportTypeList = () => [
  { id: 'athlete_import', name: i18n.t('Athlete Import') },
  { id: 'user_import', name: i18n.t('Staff Import') },
  {
    id: 'official_import',
    name: i18n.t('Official Import'),
  },
  {
    id: 'scout_import',
    name: i18n.t('Scout Import'),
  },
  {
    id: 'official_assignment_import',
    name: i18n.t('Official Assignment Import'),
  },
];

export const getStatusList = () => [
  { id: 'completed', name: i18n.t('Completed') },
  { id: 'errored', name: i18n.t('Error') },
  { id: 'pending', name: i18n.t('In progress') },
];
