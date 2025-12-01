// @flow
import { type ObjectStyle } from '@kitman/common/src/types/styles';

import style from './style';

export const inputTypes = {
  Textarea: 'textarea',
  Input: 'input',
  Select: 'select',
};
export type InputTypes = $Values<typeof inputTypes>;

export const getInputElementStyles = ({
  isFocused,
}: {
  isFocused: boolean,
}): Array<ObjectStyle> => {
  const css: Array<ObjectStyle> = [];

  if (isFocused && typeof style.focusedInputElement === 'object') {
    css.push(style.focusedInputElement);
  }

  return css;
};

export const getInputControlsStyles = ({
  inputType,
}: {
  inputType: InputTypes,
}): Array<ObjectStyle> => {
  const css: Array<ObjectStyle> = [];

  if (
    inputType === inputTypes.Textarea &&
    typeof style.alignItemsStart === 'object'
  ) {
    css.push(style.alignItemsStart);
  }

  if (inputType === inputTypes.Select && typeof style.select === 'object') {
    css.push(style.select);
  }

  return css;
};
