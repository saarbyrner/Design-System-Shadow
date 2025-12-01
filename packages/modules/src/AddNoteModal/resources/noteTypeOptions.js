// @flow
import i18n from '@kitman/common/src/utils/i18n';

const noteTypeOptions = () => [
  {
    id: 0,
    title: i18n.t('Standard Note'),
  },
  {
    id: 1,
    title: i18n.t('Injury'),
  },
  {
    id: 2,
    title: i18n.t('Illness'),
  },
  {
    id: 3,
    title: i18n.t('Medical'),
  },
];

export default noteTypeOptions;
