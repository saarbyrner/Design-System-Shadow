// @flow
import { withNamespaces } from 'react-i18next';
import type { Alarm } from '@kitman/common/src/types/Alarm';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  alarmCount: number,
  alarmsForStatus: Array<Alarm>,
  setAlarms: (Array<Alarm>) => void,
  show: () => void,
};

export const AlarmsEditorButton = (props: I18nProps<Props>) => (
  <li
    className="tooltipMenu__item tooltipMenu__item--icon tooltipMenu__item--alarms"
    onClick={() => {
      props.show();
      props.setAlarms(props.alarmsForStatus);
    }}
  >
    <span className="tooltipMenu__icon icon-alarm" />
    {props.alarmCount
      ? props.t('Alarms ({{alarmCount}} Alarms defined)', {
          alarmCount: props.alarmCount,
        })
      : props.t('Alarms')}
  </li>
);

export const AlarmsEditorButtonTranslated =
  withNamespaces()(AlarmsEditorButton);
export default AlarmsEditorButton;
