// @flow
import { useState } from 'react';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { InputTextField } from '@kitman/components';

type Props = {
  isEditing: boolean,
  isDisabled: boolean,
  initialCode: string,
  onUpdateCode: Function,
};

const IcdCode = (props: Props) => {
  const [code, setCode] = useState(props.initialCode || '');

  if (props.isEditing) {
    return (
      <InputTextField
        value={code}
        onBlur={(e) => {
          if (code.length === 0) {
            return;
          }
          props.onUpdateCode(e.target.value);
        }}
        onChange={(e) => {
          const newCode = e.target.value;
          setCode(newCode);
        }}
        inputType="text"
        kitmanDesignSystem
        disabled={props.isDisabled}
      />
    );
  }

  return props.initialCode;
};

export const IcdCodeTranslated: ComponentType<Props> =
  withNamespaces()(IcdCode);
export default IcdCode;
