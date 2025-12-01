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

const CptCode = (props: Props) => {
  const [code, setCode] = useState(props.initialCode || '');
  const [isInvalid, setIsInvalid] = useState(false);

  const isCodeValid = (codeToValidate) => {
    const codeLength = codeToValidate.length;
    if (codeLength > 0 && codeLength < 5) {
      return false;
    }
    return true;
  };

  if (props.isEditing) {
    return (
      <InputTextField
        value={code}
        onBlur={(e) => {
          if (isInvalid || code.length === 0) {
            return;
          }
          props.onUpdateCode(e.target.value);
        }}
        onChange={(e) => {
          const newCode = e.target.value;
          setCode(newCode);

          if (!isCodeValid(newCode)) {
            setIsInvalid(true);
          } else {
            setIsInvalid(false);
          }
        }}
        inputType="text"
        invalid={!isCodeValid(code)}
        kitmanDesignSystem
        disabled={props.isDisabled}
      />
    );
  }

  return props.initialCode;
};

export const CptCodeTranslated: ComponentType<Props> =
  withNamespaces()(CptCode);
export default CptCode;
