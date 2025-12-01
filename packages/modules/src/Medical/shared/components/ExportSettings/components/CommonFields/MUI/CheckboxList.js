// @flow
import {
  Typography,
  FormControl,
  FormGroup,
  FormLabel,
  FormControlLabel,
  Checkbox,
} from '@kitman/playbook/components';
import Field from '@kitman/modules/src/Medical/shared/components/ExportSettings/components/Field';
import type {
  CheckboxListItem,
  ItemValue,
} from '@kitman/components/src/CheckboxList';
import type { CommonFieldProps } from '@kitman/modules/src/Medical/shared/components/ExportSettings/components/Field';

type Props = {
  ...CommonFieldProps,
  fieldKey: string,
  label?: string,
  defaultValue?: Array<ItemValue>,
  items: Array<CheckboxListItem>,
};

const MuiCheckboxListField = ({
  fieldKey,
  label,
  defaultValue = [],
  items,
  styles,
  isCached,
}: Props) => {
  return (
    <Field
      fieldKey={fieldKey}
      defaultValue={defaultValue}
      styles={styles}
      isCached={isCached}
    >
      {({ value = [], onChange }) => {
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
            <FormGroup>
              {items.map(
                ({ value: itemValue, label: itemLabel, isDisabled }) => (
                  <FormControlLabel
                    key={itemValue}
                    control={<Checkbox size="small" />}
                    label={itemLabel}
                    checked={value.includes(itemValue)}
                    disabled={isDisabled}
                    onChange={(e) => {
                      if (e.target.checked) {
                        onChange([...value, itemValue]);
                      } else {
                        onChange(value.filter((val) => val !== itemValue));
                      }
                    }}
                    sx={{ my: 0 }}
                  />
                )
              )}
            </FormGroup>
          </FormControl>
        );
      }}
    </Field>
  );
};

export default MuiCheckboxListField;
