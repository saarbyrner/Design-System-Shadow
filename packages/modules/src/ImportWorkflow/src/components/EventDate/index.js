// @flow
import { withNamespaces } from 'react-i18next';
import moment from 'moment-timezone';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  date: ?string,
  localTimezone: ?string,
  orgTimezone: ?string,
  format: 'DATETIME' | 'TIME',
};

const EventDate = (props: I18nProps<Props>) => {
  const showLocalTime = props.localTimezone !== props.orgTimezone;
  const dateInOrgTimezone = moment.tz(props.date, props.orgTimezone);
  let orgTimezoneDate;

  if (props.format === 'TIME') {
    orgTimezoneDate = window.featureFlags['standard-date-formatting']
      ? DateFormatter.formatJustTime(dateInOrgTimezone)
      : dateInOrgTimezone.format('h:mm a');
  } else {
    orgTimezoneDate = window.featureFlags['standard-date-formatting']
      ? DateFormatter.formatStandard({
          date: dateInOrgTimezone,
          showTime: true,
        })
      : props.t('{{date}} at {{time}}', {
          date: dateInOrgTimezone.format('MMMM D, YYYY'),
          time: dateInOrgTimezone.format('h:mm a'),
        });
  }

  const dateInLocalTimezone = moment.tz(props.date, props.localTimezone);
  const localTimezoneTime = window.featureFlags['standard-date-formatting']
    ? DateFormatter.formatJustTime(dateInLocalTimezone)
    : dateInLocalTimezone.format('h:mm a');

  return (
    <div className="importWorkflowEventDate">
      {orgTimezoneDate}
      {showLocalTime && (
        <span className="importWorkflowEventDate__localTime">
          {' '}
          ({localTimezoneTime} {props.localTimezone})
        </span>
      )}
    </div>
  );
};

export const EventDateTranslated = withNamespaces()(EventDate);
export default EventDate;
