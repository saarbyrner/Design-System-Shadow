// @flow
import moment, { type Moment } from 'moment';
import { FormControl, DateRangePicker } from '@kitman/playbook/components';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { sanitizeDate } from '@kitman/playbook/utils/DatePicker';
import Field from '@kitman/modules/src/Medical/shared/components/ExportSettings/components/Field';
import type { CommonFieldProps } from '@kitman/modules/src/Medical/shared/components/ExportSettings/components/Field';

type Props = {
  ...CommonFieldProps,
  fieldKey: string,
  label: string,
  defaultValue?: Array<?Moment>,
  maxDate?: Moment,
};

const DateRangePickerField = ({
  fieldKey,
  label,
  defaultValue = [null, null],
  maxDate,
  isCached,
}: Props) => {
  return (
    <Field fieldKey={fieldKey} defaultValue={defaultValue} isCached={isCached}>
      {({ value = [null, null], onChange }) => {
        return (
          <FormControl fullWidth>
            <DateRangePicker
              label={label}
              value={[
                value[0] ? moment(value[0]).startOf('day') : null,
                value[1] ? moment(value[1]).startOf('day') : null,
              ]}
              onChange={([startDate, endDate]) => {
                onChange([sanitizeDate(startDate), sanitizeDate(endDate)]);
              }}
              slots={{ field: SingleInputDateRangeField }}
              slotProps={{
                textField: {
                  error: !value[0] || !value[1],
                  clearable: true,
                },
              }}
              maxDate={maxDate}
            />
          </FormControl>
        );
      }}
    </Field>
  );
};

export default DateRangePickerField;
