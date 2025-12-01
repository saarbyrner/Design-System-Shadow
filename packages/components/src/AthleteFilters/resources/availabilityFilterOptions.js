// @flow
import i18n from '@kitman/common/src/utils/i18n';

const availabilityFilterOptions = () => [
  { title: i18n.t('Unavailable'), id: 'unavailable' },
  { title: i18n.t('Available (Injured/Ill)'), id: 'injured_or_ill' },
  {
    title: i18n.t('Available (Returning from injury/illness)'),
    id: 'returning_from_injury_or_illness',
  },
  { title: i18n.t('Available'), id: 'available' },
];

export default availabilityFilterOptions;
