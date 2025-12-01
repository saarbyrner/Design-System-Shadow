// @flow
import { useState } from 'react';
import moment from 'moment';
import type { ComponentType } from 'react';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import { withNamespaces } from 'react-i18next';
import { DatePicker } from '@kitman/components';

type Props = {
  defaultString: string,
  isEditing: boolean,
  isDisabled: boolean,
  initialDate: moment,
  onUpdateDate: Function,
};

const DateField = (props: Props) => {
  const [date, setDate] = useState(props.initialDate);

  if (props.isEditing) {
    return (
      <DatePicker
        onDateChange={(newDate) => {
          setDate(newDate);
          props.onUpdateDate(newDate);
        }}
        value={date ? moment(date) : null}
        optional
        disabled={props.isDisabled}
        kitmanDesignSystem
      />
    );
  }

  return props.initialDate
    ? DateFormatter.formatStandard({
        date: moment(props.initialDate),
      })
    : props.defaultString;
};

export const DateFieldTranslated: ComponentType<Props> =
  withNamespaces()(DateField);
export default DateField;
