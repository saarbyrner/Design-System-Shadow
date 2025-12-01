// @flow
import { useState } from 'react';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { InputTextField } from '@kitman/components';

type Props = {
  isEditing: boolean,
  isDisabled: boolean,
  initialValue: string,
  onUpdateText: Function,
};

const TextField = (props: Props) => {
  const [text, setText] = useState(props.initialValue || '');
  if (props.isEditing) {
    return (
      <InputTextField
        value={text}
        onBlur={(e) => {
          props.onUpdateText(e.target.value);
        }}
        onChange={(e) => {
          const newCode = e.target.value;
          setText(newCode);
        }}
        inputType="text"
        kitmanDesignSystem
        disabled={props.isDisabled}
      />
    );
  }

  return props.initialValue;
};

export const TextFieldTranslated: ComponentType<Props> =
  withNamespaces()(TextField);
export default TextField;
