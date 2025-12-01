// @flow
import { withNamespaces } from 'react-i18next';
import { type ComponentType } from 'react';
import moment from 'moment-timezone';

import {
  DatePicker,
  Select,
  TimePicker,
  InputNumeric,
} from '@kitman/components';
import { type I18nProps } from '@kitman/common/src/types/i18n';
import { displayValidationMessages } from '@kitman/modules/src/PlanningEventSidePanel/src/validation/utils';
import { type CommonAttributesValidity } from '@kitman/modules/src/PlanningEventSidePanel/src/types';

import styling from './style';

export type Props = {
  eventDate: typeof moment | typeof undefined,
  timeZone: ?string,
  duration?: ?number | ?string,
  eventValidity: CommonAttributesValidity,
  disableDateTimeEdit: boolean,
  onSelectDate: Function,
  onUpdateStartTime: Function,
  onUpdateDuration: Function,
  onSelectTimezone: Function,
};

const EventDateTime = (props: I18nProps<Props>) => {
  const style = styling;

  const formatDate = (date: moment): string => {
    return date.format('YYYY-MM-DD');
  };

  return (
    <div css={style.eventDateTime}>
      <div css={style.date}>
        <DatePicker
          name="date"
          label={props.t('Date')}
          onDateChange={props.onSelectDate}
          value={formatDate(props.eventDate ?? moment())}
          kitmanDesignSystem
          data-testid="EventDateTime|Date"
          invalid={props.eventValidity.start_time?.isInvalid}
          disabled={props.disableDateTimeEdit}
        />
        {props.eventValidity.start_time?.messages &&
          displayValidationMessages(props.eventValidity.start_time?.messages)}
      </div>
      <div css={style.startTime}>
        <TimePicker
          name="start_time"
          value={props.eventDate || moment().startOf('hour')}
          label={props.t('Start Time')}
          onChange={props.onUpdateStartTime}
          kitmanDesignSystem
          data-testid="EventDateTime|StartTime"
          disabled={props.disableDateTimeEdit}
        />
      </div>
      <div css={style.duration}>
        <InputNumeric
          label={props.t('Duration')}
          name="duration"
          value={props.duration ?? undefined}
          onChange={(durationMinutes) =>
            props.onUpdateDuration?.(durationMinutes)
          }
          descriptor={props.t('mins')}
          size="small"
          kitmanDesignSystem
          data-testid="EventDateTime|Duration"
          isInvalid={props.eventValidity.duration?.isInvalid}
        />
      </div>
      <div css={style.timezone}>
        <Select
          label={props.t('Timezone')}
          options={moment.tz.names().map((tzName) => ({
            value: tzName,
            label: tzName,
          }))}
          onChange={(value) => props.onSelectTimezone(value)}
          value={props.timeZone}
          data-testid="EventDateTime|Timezone"
          invalid={props.eventValidity.local_timezone?.isInvalid}
          showAutoWidthDropdown
          isDisabled={props.disableDateTimeEdit}
        />
      </div>
    </div>
  );
};

export const EventDateTimeTranslated: ComponentType<Props> =
  withNamespaces()(EventDateTime);
export default EventDateTime;
