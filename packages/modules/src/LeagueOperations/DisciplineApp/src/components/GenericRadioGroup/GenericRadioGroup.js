// @flow
import {
  Stack,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormLabel,
  FormControl,
} from '@kitman/playbook/components';
import { colors } from '@kitman/common/src/variables';

type Props = {
  title?: string,
  options: Array<{ value: string, label: string }>,
  selectedValue: string,
  onChange: (value: string) => void,
};

const GenericRadioGroup = ({
  title,
  options,
  selectedValue,
  onChange,
}: Props) => {
  return (
    <Stack>
      <FormControl component="fieldset">
        {title && (
          <FormLabel component="legend" sx={{ fontSize: 16, mb: 1 }}>
            {title}
          </FormLabel>
        )}
        <RadioGroup
          value={selectedValue}
          onChange={(event) => {
            onChange(event.target.value);
          }}
          row
        >
          {options.map(({ value, label }) => (
            <FormControlLabel
              key={value}
              value={value}
              control={
                <Radio
                  sx={{
                    color: colors.grey_200,
                    '&.Mui-checked': {
                      color: colors.grey_200,
                    },
                  }}
                />
              }
              label={label}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Stack>
  );
};
export default GenericRadioGroup;
