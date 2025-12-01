// @flow
import i18n from '@kitman/common/src/utils/i18n';

const dayOptions = [
  {
    id: 'monday',
    displayName: i18n.t('M', { context: 'First letter of Monday' }),
  },
  {
    id: 'tuesday',
    displayName: i18n.t('T', { context: 'First letter of Tuesday' }),
  },
  {
    id: 'wednesday',
    displayName: i18n.t('W', { context: 'First letter of Wednesday' }),
  },
  {
    id: 'thursday',
    displayName: i18n.t('T', { context: 'First letter of Thursday' }),
  },
  {
    id: 'friday',
    displayName: i18n.t('F', { context: 'First letter of Friday' }),
  },
  {
    id: 'saturday',
    displayName: i18n.t('S', { context: 'First letter of Saturday' }),
  },
  {
    id: 'sunday',
    displayName: i18n.t('S', { context: 'First letter of Sunday' }),
  },
];

export default dayOptions;
