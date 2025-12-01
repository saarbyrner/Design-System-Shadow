/* eslint-disable flowtype/require-valid-file-annotation */
import i18n from './i18n';

const groupByOptions = () => [
  { title: i18n.t('Availability'), id: 'availability' },
  { title: i18n.t('#sport_specific__Position'), id: 'position' },
  { title: i18n.t('#sport_specific__Position_Group'), id: 'positionGroup' },
  { title: i18n.t('Screening'), id: 'last_screening' },
  { title: i18n.t('No Grouping'), id: 'name' },
];

export default groupByOptions;
