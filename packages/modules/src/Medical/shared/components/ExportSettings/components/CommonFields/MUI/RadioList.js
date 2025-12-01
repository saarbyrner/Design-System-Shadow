// @flow
import uuid from 'uuid';
import {
  Typography,
  FormControl,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
} from '@kitman/playbook/components';
import Field from '@kitman/modules/src/Medical/shared/components/ExportSettings/components/Field';
import type { RadioOption } from '@kitman/components/src/InputRadio/types';
import type { CommonFieldProps } from '@kitman/modules/src/Medical/shared/components/ExportSettings/components/Field';

type Props = {
  ...CommonFieldProps,
  fieldKey: string,
  label?: string,
  defaultValue?: string,
  options: Array<RadioOption>,
};

const MuiCheckboxListField = ({
  fieldKey,
  label,
  defaultValue = null,
  options,
  isCached,
}: Props) => {
  return (
    <Field fieldKey={fieldKey} defaultValue={defaultValue} isCached={isCached}>
      {({ value = null, onChange }) => {
        return (
          <FormControl>
            {label && (
              <FormLabel>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                  }}
                >
                  {label}
                </Typography>
              </FormLabel>
            )}
            <RadioGroup
              row
              value={value}
              onChange={(e) => onChange(e.target.value)}
            >
              {options.map(({ name: itemName, value: itemValue }) => (
                <FormControlLabel
                  key={typeof itemValue === 'string' ? itemValue : uuid.v4()}
                  control={<Radio size="small" />}
                  label={itemName}
                  value={itemValue}
                  sx={{ my: 0 }}
                />
              ))}
            </RadioGroup>
          </FormControl>
        );
      }}
    </Field>
  );
};

export default MuiCheckboxListField;
