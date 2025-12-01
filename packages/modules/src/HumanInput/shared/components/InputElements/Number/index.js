// @flow

import {
  InputLabel,
  FilledInput,
  InputAdornment,
} from '@kitman/playbook/components';
import type { HumanInputFormElement } from '@kitman/modules/src/HumanInput/types/forms';
import type { ValidationStatus } from '@kitman/modules/src/HumanInput/types/validation';

type Props = {
  element: HumanInputFormElement,
  value: string,
  validationStatus: {
    status: ValidationStatus,
    message: ?string,
  },
  onChange: Function,
  onBlur: Function,
};

const NumberInput = (props: Props) => {
  const { element, value, validationStatus, onChange, onBlur } = props;
  const {
    element_id: elementId,
    text,
    custom_params: customParams,
  } = element.config;

  const handleInputChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    // Allow only digits and the decimal point
    const sanitizedValue = newValue.replace(/[^0-9.]/g, '');

    onChange(sanitizedValue);
  };

  return (
    <>
      <InputLabel
        id={`${elementId}-label`}
        error={validationStatus.status === 'INVALID'}
      >
        {text}
      </InputLabel>
      <FilledInput
        id={`${elementId}-input`}
        endAdornment={
          <InputAdornment position="end">{customParams?.unit}</InputAdornment>
        }
        value={value}
        onChange={handleInputChange}
        onBlur={(event) => onBlur(event.target.value)}
        size="small"
        type="number"
        error={validationStatus.status === 'INVALID'}
        readOnly={customParams?.readonly}
      />
    </>
  );
};

export default NumberInput;
