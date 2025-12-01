// @flow

import type { HumanInputFormElement } from '@kitman/modules/src/HumanInput/types/forms';
import type { ValidationStatus } from '@kitman/modules/src/HumanInput/types/validation';

import PhoneSelector from '@kitman/modules/src/HumanInput/shared/components/InputElements/TextInput/components/PhoneSelector';
import StandardInput from '@kitman/modules/src/HumanInput/shared/components/InputElements/TextInput/components/StandardInput';

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

const TextInput = (props: Props) => {
  const { element, value, onChange, onBlur, validationStatus } = props;
  const { custom_params: customParams } = element.config;

  switch (customParams?.type) {
    case 'phone':
      return (
        <PhoneSelector
          element={element}
          value={value}
          validationStatus={validationStatus}
          onChange={onChange}
        />
      );
    case 'email':
      return (
        <StandardInput
          element={element}
          validationStatus={validationStatus}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          type="email"
        />
      );

    default:
      return (
        <StandardInput
          element={element}
          validationStatus={validationStatus}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        />
      );
  }
};

export default TextInput;
