// @flow
import { InputTextField } from '@kitman/components';

const OptionalInput = ({
  value,
  askOnEntryIndex,
  inputOnChange,
  optionalTextLabel,
  invalid,
}: {
  value: string,
  askOnEntryIndex: number,
  inputOnChange: Function,
  optionalTextLabel: string,
  invalid: boolean,
}) => {
  return (
    <div key={`Input_field_${askOnEntryIndex}`}>
      <InputTextField
        label={optionalTextLabel}
        value={value}
        inputType="text"
        onChange={(e) => {
          inputOnChange(e);
        }}
        kitmanDesignSystem
        invalid={invalid}
      />
    </div>
  );
};

export default OptionalInput;
