// @flow
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';
import moment from 'moment-timezone';
import { DatePicker, Select, TimePicker } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { displayValidationMessages } from '../../validation/utils';
import styling from './style';
import type { CommonAttributesValidity } from '../../types';

export type Props = {
  eventDate: ?moment,
  timeZone: ?string,
  eventValidity: CommonAttributesValidity,
  disableDateTimeEdit: boolean,
  onSelectDate: Function,
  onUpdateStartTime: Function,
  onSelectTimezone: Function,
};

const EventDateTimeV2 = (props: I18nProps<Props>) => {
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
          onDateChange={(date) => {
            props.onSelectDate(date);
          }}
          value={formatDate(props.eventDate) || formatDate(moment())}
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

export const EventDateTimeV2Translated: ComponentType<Props> =
  withNamespaces()(EventDateTimeV2);
export default EventDateTimeV2;
