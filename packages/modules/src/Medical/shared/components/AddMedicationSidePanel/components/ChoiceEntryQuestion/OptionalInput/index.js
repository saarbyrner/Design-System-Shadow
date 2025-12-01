// @flow
import { InputTextField } from '@kitman/components';

const OptionalInput = ({
  value,
  inputOnChange,
  optionalTextLabel,
  invalid,
  isDisabled,
}: {
  value: string,
  inputOnChange: Function,
  optionalTextLabel: string,
  invalid: boolean,
  isDisabled: boolean,
}) => {
  return (
    <InputTextField
      label={optionalTextLabel}
      value={value}
      inputType="text"
      onChange={(e) => {
        inputOnChange(e);
      }}
      kitmanDesignSystem
      invalid={invalid}
      disabled={isDisabled}
    />
  );
};

export default OptionalInput;
