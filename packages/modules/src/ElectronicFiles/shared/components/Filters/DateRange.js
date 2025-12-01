// @flow
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { Moment } from 'moment';
import {
  DateRangePicker,
  SingleInputDateRangeField,
} from '@kitman/playbook/components';

type Props = {
  value: Array<?Moment>,
  onChange: (value: Array<?Moment>) => void,
  disabled?: boolean,
};

const DateRangeFilter = ({
  value,
  onChange,
  disabled = false,
  t,
}: I18nProps<Props>) => {
  return (
    <DateRangePicker
      label={t('Date range')}
      value={value}
      onChange={(val) => onChange(val)}
      slots={{ field: SingleInputDateRangeField }}
      slotProps={{
        textField: {
          clearable: true,
        },
      }}
      sx={{ width: '245px' }}
      disabled={disabled}
    />
  );
};

export const DateRangeFilterTranslated: ComponentType<Props> =
  withNamespaces()(DateRangeFilter);
export default DateRangeFilter;
