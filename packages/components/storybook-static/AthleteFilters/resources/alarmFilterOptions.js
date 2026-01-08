// @flow
import i18n from '@kitman/common/src/utils/i18n';

const alarmFilterOptions = () => [
  { title: i18n.t('In Alarm'), id: 'inAlarm' },
  { title: i18n.t('No Alarms'), id: 'noAlarms' },
];

export default alarmFilterOptions;
