// @flow
import type { SerializedStyles } from '@emotion/react';
import { styles } from './style';

export type CheckmarkStyles = {
  css: Array<SerializedStyles>,
  className: string,
};
export const getCheckmarkStyles = ({
  isChecked,
  isIndeterminate,
  isDisabled,
  isFocused,
  isInvalid,
}: {
  isChecked: boolean,
  isIndeterminate: boolean,
  isDisabled: boolean,
  isFocused: boolean,
  isInvalid: boolean,
}): CheckmarkStyles => {
  const css = [];
  let className = '';

  if (isChecked) {
    css.push(styles.checked);
    className = 'icon-checked-checkmark';
  } else if (isIndeterminate) {
    className = 'icon-indeterminate-checkmark';
    css.push(styles.indeterminate);
  } else {
    css.push(styles.unchecked);
  }

  if (isDisabled) {
    css.push(styles.disabled);
  } else if (isFocused) {
    css.push(styles.focused);
  } else if (isInvalid) {
    css.push(styles.invalid);
  }

  return {
    css,
    className,
  };
};
