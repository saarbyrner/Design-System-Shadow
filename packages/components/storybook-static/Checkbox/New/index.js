// @flow
import { useRef, useEffect, useState, useCallback } from 'react';
import { styles } from './style';
import type { CheckmarkStyles } from './utils';
import { getCheckmarkStyles } from './utils';

export type Props = {
  id: string,
  name?: string,
  checked?: boolean,
  indeterminate?: boolean,
  disabled?: boolean,
  invalid?: boolean,
  onClick: (id: string) => void,
};

// Checkbox is a dumb component which uses a real input element to manage
// accessibility and focus.
//
// States which can be set externally:
// - primary:
//   - unchecked;
//   - checked;
//   - indeterminate (partially checked).
// - secondary:
//   - disabled;
//   - invalid.
// There is also focused state which is set automatically if the input element
// is focused. It cannot be set externally explicitly, but Checkbox cannot be
// in focused or invalid state if `disabled` prop is truthy.
//
// Example:
//
// <Checkbox.New
//   id="names"
//   name="names"
//   checked={names.every(name => name.selected)}
//   indeterminate={names.some(name => name.selected)}
//   disabled={isNamesSelectionDisabled}
//   invalid={!names.some(name => name.selected)}
//   onClick={handleCheckbox}
// />
//
const Checkbox = (props: Props) => {
  const inputRef = useRef<?HTMLInputElement>(null);
  const [checkmarkStyles, setCheckmarkStyles] = useState<CheckmarkStyles>({
    css: [],
    className: '',
  });

  const updateCheckmarkStyles = useCallback(() => {
    setCheckmarkStyles(
      getCheckmarkStyles({
        isChecked: props.checked ?? false,
        isIndeterminate: props.indeterminate ?? false,
        isDisabled: props.disabled ?? false,
        isFocused: inputRef.current === document.activeElement,
        isInvalid: props.invalid ?? false,
      })
    );
  }, [props.checked, props.indeterminate, props.disabled, props.invalid]);

  useEffect(() => {
    const inputRefValue = inputRef.current;
    if (inputRefValue) {
      // Set indeterminate attribute programmatically because it cannot be set
      // via HTML.
      inputRefValue.indeterminate = props.indeterminate ?? false;
      inputRefValue.setCustomValidity(props.invalid ? 'invalid' : '');
    }
    updateCheckmarkStyles();
  }, [
    props.checked,
    props.indeterminate,
    props.disabled,
    props.invalid,
    updateCheckmarkStyles,
  ]);

  return (
    <div
      css={styles.wrapper}
      onClick={() => {
        if (props.disabled) {
          return;
        }
        props.onClick(props.id);
        inputRef.current?.focus();
      }}
      onFocus={() => inputRef.current?.focus()}
    >
      <input
        id={props.id}
        name={props.name ?? props.id}
        ref={inputRef}
        type="checkbox"
        checked={props.checked}
        disabled={props.disabled}
        onClick={(event) => event.preventDefault()}
        onChange={(event) => event.preventDefault()}
        onFocus={updateCheckmarkStyles}
        onBlur={updateCheckmarkStyles}
      />
      <span css={checkmarkStyles.css} className={checkmarkStyles.className} />
    </div>
  );
};

export default Checkbox;
