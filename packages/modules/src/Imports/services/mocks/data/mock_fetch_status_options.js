import i18n from '@kitman/common/src/utils/i18n';

export const data = [
  { id: 'completed', name: i18n.t('Completed') },
  { id: 'errored', name: i18n.t('Error') },
  { id: 'pending', name: i18n.t('In progress') },
];

export const response = {
  data,
};
