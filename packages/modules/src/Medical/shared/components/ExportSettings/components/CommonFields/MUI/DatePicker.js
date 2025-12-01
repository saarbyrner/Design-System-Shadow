// @flow
import { useState } from 'react';
import moment, { type Moment } from 'moment';
import { FormControl, DatePicker } from '@kitman/playbook/components';
import Field from '@kitman/modules/src/Medical/shared/components/ExportSettings/components/Field';
import { sanitizeDate } from '@kitman/playbook/utils/DatePicker';
import type { CommonFieldProps } from '@kitman/modules/src/Medical/shared/components/ExportSettings/components/Field';

type Props = {
  ...CommonFieldProps,
  fieldKey: string,
  label: string,
  defaultValue?: Moment,
};

const DatePickerField = ({
  fieldKey,
  label,
  defaultValue = null,
  isCached,
}: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Field fieldKey={fieldKey} defaultValue={defaultValue} isCached={isCached}>
      {({ value = null, onChange }) => {
        return (
          <FormControl fullWidth>
            <DatePicker
              open={open}
              onOpen={() => setOpen(true)}
              onClose={() => setOpen(false)}
              label={label}
              value={value ? moment(value).startOf('day') : null}
              onChange={(date) => {
                onChange(sanitizeDate(date));
              }}
              slotProps={{
                textField: {
                  onClick: () => setOpen(true),
                  error: !value,
                  clearable: true,
                },
              }}
            />
          </FormControl>
        );
      }}
    </Field>
  );
};

export default DatePickerField;
