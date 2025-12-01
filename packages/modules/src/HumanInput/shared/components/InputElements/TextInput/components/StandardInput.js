// @flow

import { FilledInput, InputLabel } from '@kitman/playbook/components';
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
  onBlur?: Function,
};

const StandardInput = (props: Props) => {
  const { element, value, onChange, validationStatus } = props;
  const {
    element_id: elementId,
    text,
    custom_params: customParams,
  } = element.config;

  /**
   * TODO: Create a style enum.
   */
  const isMultiLine = customParams?.style === 'multiline';

  return (
    <>
      <InputLabel
        id={`${elementId}-label`}
        htmlFor={`${elementId}-input`}
        error={validationStatus.status === 'INVALID'}
      >
        {text}
      </InputLabel>
      <FilledInput
        id={`${elementId}-input`}
        value={value || ''}
        onChange={(event) => onChange(event.target.value)}
        onBlur={(event) => props.onBlur && props.onBlur(event.target.value)}
        size="small"
        error={validationStatus.status === 'INVALID'}
        readOnly={customParams?.readonly}
        multiline={isMultiLine}
      />
    </>
  );
};

export default StandardInput;
